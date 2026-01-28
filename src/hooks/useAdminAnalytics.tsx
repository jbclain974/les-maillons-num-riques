import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

interface AnalyticsData {
  id: string;
  date: string;
  page_views: number;
  unique_visitors: number;
  contact_forms: number;
  event_registrations: number;
  activity_registrations: number;
  new_members: number;
}

export function useAuditLogs(limit = 50) {
  return useQuery({
    queryKey: ["admin-audit-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_audit_logs")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return (data || []).map((log: any) => ({
        ...log,
        user_name: log.profiles?.full_name || "Système",
        user_email: log.profiles?.email || "",
      })) as AuditLog[];
    },
  });
}

export function useSiteAnalytics(days = 30) {
  return useQuery({
    queryKey: ["site-analytics", days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from("site_analytics")
        .select("*")
        .gte("date", startDate.toISOString().split("T")[0])
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data as AnalyticsData[];
    },
  });
}

export async function logAdminAction(
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, unknown>
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;
  
  await supabase.from("admin_audit_logs").insert([{
    user_id: user.id,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    details: (details || {}) as any,
  }]);
}
