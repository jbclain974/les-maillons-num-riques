import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminRouteProps {
  children: ReactNode;
  /** Roles that are allowed to access this route. Defaults to ['admin'] */
  allowedRoles?: Array<'admin' | 'editor' | 'animator'>;
}

/**
 * A role-aware route guard that checks if the authenticated user
 * has the required role to access admin routes.
 */
const AdminRoute = ({ children, allowedRoles = ['admin'] }: AdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        // Query user roles from the database
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error checking user roles:', error);
          setHasAccess(false);
          setChecking(false);
          return;
        }

        // Check if user has any of the allowed roles
        const userRoles = roles?.map(r => r.role) || [];
        
        // Admin always has access to all admin routes
        const isAdmin = userRoles.includes('admin');
        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
        
        setHasAccess(isAdmin || hasRequiredRole);
      } catch (err) {
        console.error('Role check failed:', err);
        setHasAccess(false);
      } finally {
        setChecking(false);
      }
    };

    if (!authLoading) {
      checkRole();
    }
  }, [user, authLoading, allowedRoles]);

  // Still loading auth state
  if (authLoading || checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Authenticated but no access - show forbidden page
  if (!hasAccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <ShieldX className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Accès refusé</h1>
        <p className="text-muted-foreground max-w-md">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Contactez un administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
