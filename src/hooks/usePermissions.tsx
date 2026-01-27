import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type AppModule = 
  | 'dashboard'
  | 'pages'
  | 'posts'
  | 'events'
  | 'activities'
  | 'testimonials'
  | 'messages'
  | 'media'
  | 'users'
  | 'settings'
  | 'members';

export type AppPermission = 'view' | 'create' | 'edit' | 'delete' | 'publish' | 'validate';

export type AppRole = 'admin' | 'editor' | 'animator' | 'viewer';

interface Permission {
  module: AppModule;
  permission: AppPermission;
}

export function usePermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPermissions();
    } else {
      setPermissions([]);
      setUserRole(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserPermissions = async () => {
    if (!user) return;
    
    try {
      // Get user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      const role = roleData?.role as AppRole | null;
      setUserRole(role);
      
      // Admin has all permissions
      if (role === 'admin') {
        const allModules: AppModule[] = ['dashboard', 'pages', 'posts', 'events', 'activities', 'testimonials', 'messages', 'media', 'users', 'settings', 'members'];
        const allPermissions: AppPermission[] = ['view', 'create', 'edit', 'delete', 'publish', 'validate'];
        
        const adminPerms: Permission[] = [];
        allModules.forEach(module => {
          allPermissions.forEach(permission => {
            adminPerms.push({ module, permission });
          });
        });
        setPermissions(adminPerms);
      } else if (role) {
        // Get permissions for the role
        const { data: perms } = await supabase
          .from('role_permissions')
          .select('module, permission')
          .eq('role', role);
        
        setPermissions(perms?.map(p => ({
          module: p.module as AppModule,
          permission: p.permission as AppPermission
        })) || []);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = useCallback((module: AppModule, permission: AppPermission): boolean => {
    if (userRole === 'admin') return true;
    return permissions.some(p => p.module === module && p.permission === permission);
  }, [permissions, userRole]);

  const canView = useCallback((module: AppModule) => hasPermission(module, 'view'), [hasPermission]);
  const canCreate = useCallback((module: AppModule) => hasPermission(module, 'create'), [hasPermission]);
  const canEdit = useCallback((module: AppModule) => hasPermission(module, 'edit'), [hasPermission]);
  const canDelete = useCallback((module: AppModule) => hasPermission(module, 'delete'), [hasPermission]);
  const canPublish = useCallback((module: AppModule) => hasPermission(module, 'publish'), [hasPermission]);
  const canValidate = useCallback((module: AppModule) => hasPermission(module, 'validate'), [hasPermission]);

  const isAdmin = userRole === 'admin';
  const isEditor = userRole === 'editor';
  const isAnimator = userRole === 'animator';
  const isViewer = userRole === 'viewer';

  return {
    permissions,
    userRole,
    loading,
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canPublish,
    canValidate,
    isAdmin,
    isEditor,
    isAnimator,
    isViewer,
    refetch: fetchUserPermissions
  };
}
