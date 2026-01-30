import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !caller) {
      throw new Error("Invalid token");
    }

    // Check if caller is admin
    const { data: callerRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .single();

    if (!callerRoles || callerRoles.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const { action, ...params } = await req.json();

    switch (action) {
      case "create": {
        const { email, password, full_name, role } = params;
        
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        // Create user with admin API
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Auto-confirm email
          user_metadata: { full_name },
        });

        if (createError) {
          throw createError;
        }

        // Assign role if specified
        if (role && newUser.user) {
          await supabaseAdmin.from("user_roles").upsert({
            user_id: newUser.user.id,
            role,
          });
        }

        return new Response(
          JSON.stringify({ success: true, user: newUser.user }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "update": {
        const { user_id, email, full_name, password } = params;
        
        if (!user_id) {
          throw new Error("User ID is required");
        }

        // Update auth user if email or password changed
        const updateData: any = {};
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (full_name) updateData.user_metadata = { full_name };

        if (Object.keys(updateData).length > 0) {
          const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
            user_id,
            updateData
          );
          if (updateAuthError) {
            throw updateAuthError;
          }
        }

        // Update profile
        const profileUpdate: any = {};
        if (email) profileUpdate.email = email;
        if (full_name) profileUpdate.full_name = full_name;

        if (Object.keys(profileUpdate).length > 0) {
          const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .update(profileUpdate)
            .eq("id", user_id);

          if (profileError) {
            throw profileError;
          }
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete": {
        const { user_id, hard_delete } = params;
        
        if (!user_id) {
          throw new Error("User ID is required");
        }

        // Prevent self-deletion
        if (user_id === caller.id) {
          throw new Error("Cannot delete your own account");
        }

        if (hard_delete) {
          // Hard delete - remove from auth.users (cascades to profiles via trigger)
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id);
          if (deleteError) {
            throw deleteError;
          }
        } else {
          // Soft delete - just mark as inactive
          const { error: updateError } = await supabaseAdmin
            .from("profiles")
            .update({ is_account_active: false })
            .eq("id", user_id);

          if (updateError) {
            throw updateError;
          }
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "toggle_active": {
        const { user_id, is_active } = params;
        
        if (!user_id) {
          throw new Error("User ID is required");
        }

        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ is_account_active: is_active })
          .eq("id", user_id);

        if (updateError) {
          throw updateError;
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
