import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Shield,
  Search,
  Users as UsersIcon,
  Crown,
  PenLine,
  Sparkles,
  Eye,
  AlertTriangle,
  Key,
  Mail,
  Loader2,
  UserPlus,
} from "lucide-react";
import { sanitizeError } from "@/lib/errorSanitizer";
import { logAdminAction } from "@/hooks/useAdminAnalytics";
import { UserFormDialog } from "@/components/admin/users/UserFormDialog";
import { UserDeleteDialog } from "@/components/admin/users/UserDeleteDialog";
import { UserStatsCards, roleConfig } from "@/components/admin/users/UserStatsCards";
import { UserTable } from "@/components/admin/users/UserTable";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_account_active?: boolean;
}

interface UserRole {
  user_id: string;
  role: string;
}

type AppRole = "admin" | "editor" | "animator" | "viewer";

const Users = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Dialogs state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    userName: string;
    newRole: AppRole;
  } | null>(null);

  const [resetPasswordDialog, setResetPasswordDialog] = useState<{
    open: boolean;
    userId: string;
    userEmail: string;
    userName: string;
  } | null>(null);

  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState<{
    open: boolean;
    profile: Profile | null;
  }>({ open: false, profile: null });

  const [deleteUserDialog, setDeleteUserDialog] = useState<{
    open: boolean;
    profile: Profile | null;
  }>({ open: false, profile: null });

  const [sendingReset, setSendingReset] = useState(false);

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const fetchUsersAndRoles = async () => {
    try {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      setProfiles(profilesRes.data || []);

      const rolesMap: { [key: string]: string[] } = {};
      rolesRes.data?.forEach((role: UserRole) => {
        if (!rolesMap[role.user_id]) {
          rolesMap[role.user_id] = [];
        }
        rolesMap[role.user_id].push(role.role);
      });
      setRoles(rolesMap);
    } catch (error: any) {
      toast.error(sanitizeError(error));
    } finally {
      setLoading(false);
    }
  };

  const callAdminFunction = async (action: string, params: Record<string, any>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Non authentifié");

    const response = await supabase.functions.invoke("admin-create-user", {
      body: { action, ...params },
    });

    if (response.error) throw response.error;
    if (response.data?.error) throw new Error(response.data.error);
    
    return response.data;
  };

  const handleCreateUser = async (data: { email: string; full_name: string; password: string; role: AppRole }) => {
    try {
      await callAdminFunction("create", data);
      await logAdminAction("create", "user", undefined, { email: data.email, role: data.role });
      toast.success("Utilisateur créé avec succès");
      fetchUsersAndRoles();
    } catch (error: any) {
      toast.error(sanitizeError(error));
      throw error;
    }
  };

  const handleUpdateUser = async (data: { id?: string; email: string; full_name: string; password: string; role: AppRole }) => {
    if (!data.id) return;
    
    try {
      await callAdminFunction("update", {
        user_id: data.id,
        email: data.email,
        full_name: data.full_name,
        password: data.password || undefined,
      });

      // Update role
      await supabase.from("user_roles").delete().eq("user_id", data.id);
      await supabase.from("user_roles").insert([{ user_id: data.id, role: data.role as any }]);

      await logAdminAction("update", "user", data.id, { email: data.email, role: data.role });
      toast.success("Utilisateur modifié avec succès");
      fetchUsersAndRoles();
    } catch (error: any) {
      toast.error(sanitizeError(error));
      throw error;
    }
  };

  const handleDeleteUser = async (hardDelete: boolean) => {
    if (!deleteUserDialog.profile) return;
    
    try {
      await callAdminFunction("delete", {
        user_id: deleteUserDialog.profile.id,
        hard_delete: hardDelete,
      });

      await logAdminAction(
        hardDelete ? "delete" : "deactivate",
        "user",
        deleteUserDialog.profile.id,
        { email: deleteUserDialog.profile.email }
      );
      
      toast.success(hardDelete ? "Utilisateur supprimé" : "Compte désactivé");
      fetchUsersAndRoles();
    } catch (error: any) {
      toast.error(sanitizeError(error));
      throw error;
    }
  };

  const handleToggleActive = async (profile: Profile) => {
    const isActive = profile.is_account_active !== false;
    
    try {
      await callAdminFunction("toggle_active", {
        user_id: profile.id,
        is_active: !isActive,
      });

      await logAdminAction(
        isActive ? "deactivate" : "activate",
        "user",
        profile.id,
        { email: profile.email }
      );
      
      toast.success(isActive ? "Compte désactivé" : "Compte réactivé");
      fetchUsersAndRoles();
    } catch (error: any) {
      toast.error(sanitizeError(error));
    }
  };

  const handleRoleChangeRequest = (userId: string, userName: string, newRole: AppRole) => {
    setConfirmDialog({ open: true, userId, userName, newRole });
  };

  const handleRoleChange = async () => {
    if (!confirmDialog) return;

    const { userId, newRole } = confirmDialog;

    try {
      await supabase.from("user_roles").delete().eq("user_id", userId);

      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: newRole as any }]);

      if (error) throw error;

      await logAdminAction("update", "user", userId, { new_role: newRole, user_name: confirmDialog.userName });
      toast.success("Rôle mis à jour avec succès");
      fetchUsersAndRoles();
    } catch (error: any) {
      toast.error(sanitizeError(error));
    } finally {
      setConfirmDialog(null);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!resetPasswordDialog) return;
    
    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        resetPasswordDialog.userEmail,
        { redirectTo: `${window.location.origin}/auth` }
      );
      
      if (error) throw error;
      
      await logAdminAction("password_reset", "user", resetPasswordDialog.userId, { 
        user_email: resetPasswordDialog.userEmail,
        user_name: resetPasswordDialog.userName 
      });
      toast.success("Email de réinitialisation envoyé");
    } catch (error: any) {
      toast.error(sanitizeError(error));
    } finally {
      setSendingReset(false);
      setResetPasswordDialog(null);
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profile.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const userRole = roles[profile.id]?.[0] || "viewer";
    const matchesRole = filterRole === "all" || userRole === filterRole;

    const isActive = profile.is_account_active !== false;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && isActive) ||
      (filterStatus === "inactive" && !isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleStats = {
    admin: profiles.filter((p) => roles[p.id]?.[0] === "admin").length,
    editor: profiles.filter((p) => roles[p.id]?.[0] === "editor").length,
    animator: profiles.filter((p) => roles[p.id]?.[0] === "animator").length,
    viewer: profiles.filter((p) => !roles[p.id]?.[0] || roles[p.id]?.[0] === "viewer").length,
  };

  const activeCount = profiles.filter((p) => p.is_account_active !== false).length;
  const inactiveCount = profiles.filter((p) => p.is_account_active === false).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 bg-gradient-to-br from-background via-background to-muted/20 min-h-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Gestion des Utilisateurs
            </h1>
            <p className="text-muted-foreground">
              Créez, modifiez et gérez les comptes utilisateurs
            </p>
          </div>
          <Button onClick={() => setCreateUserDialog(true)} size="lg">
            <UserPlus className="h-5 w-5 mr-2" />
            Créer un utilisateur
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          <UserStatsCards
            roleStats={roleStats}
            activeCount={activeCount}
            inactiveCount={inactiveCount}
            filterRole={filterRole}
            filterStatus={filterStatus}
            onFilterRole={setFilterRole}
            onFilterStatus={setFilterStatus}
          />
        </div>

        {/* Role Description Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-0">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold mb-3">Rôles et permissions</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(Object.entries(roleConfig) as [AppRole, typeof roleConfig.admin][]).map(([role, config]) => {
                    const Icon = config.icon;
                    return (
                      <div key={role} className="flex items-start gap-2">
                        <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
                        <div>
                          <p className={`font-medium text-sm ${config.color}`}>{config.label}</p>
                          <p className="text-xs text-muted-foreground">{config.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                  <SelectItem value="editor">Éditeurs</SelectItem>
                  <SelectItem value="animator">Animateurs</SelectItem>
                  <SelectItem value="viewer">Lecteurs</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              {filteredProfiles.length} utilisateur{filteredProfiles.length > 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserTable
              profiles={filteredProfiles}
              roles={roles}
              onRoleChange={handleRoleChangeRequest}
              onEdit={(profile) => setEditUserDialog({ open: true, profile })}
              onDelete={(profile) => setDeleteUserDialog({ open: true, profile })}
              onResetPassword={(profile) =>
                setResetPasswordDialog({
                  open: true,
                  userId: profile.id,
                  userEmail: profile.email,
                  userName: profile.full_name || profile.email,
                })
              }
              onToggleActive={handleToggleActive}
            />

            {filteredProfiles.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <UserFormDialog
          open={createUserDialog}
          onOpenChange={setCreateUserDialog}
          mode="create"
          onSubmit={handleCreateUser}
        />

        {/* Edit User Dialog */}
        <UserFormDialog
          open={editUserDialog.open}
          onOpenChange={(open) => setEditUserDialog({ open, profile: open ? editUserDialog.profile : null })}
          mode="edit"
          initialData={
            editUserDialog.profile
              ? {
                  id: editUserDialog.profile.id,
                  email: editUserDialog.profile.email,
                  full_name: editUserDialog.profile.full_name || "",
                  role: (roles[editUserDialog.profile.id]?.[0] as AppRole) || "viewer",
                }
              : undefined
          }
          onSubmit={handleUpdateUser}
        />

        {/* Delete User Dialog */}
        <UserDeleteDialog
          open={deleteUserDialog.open}
          onOpenChange={(open) => setDeleteUserDialog({ open, profile: open ? deleteUserDialog.profile : null })}
          userName={deleteUserDialog.profile?.full_name || deleteUserDialog.profile?.email || ""}
          userEmail={deleteUserDialog.profile?.email || ""}
          onDelete={handleDeleteUser}
        />

        {/* Role Change Confirmation Dialog */}
        <Dialog open={confirmDialog?.open || false} onOpenChange={() => setConfirmDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                Confirmer le changement de rôle
              </DialogTitle>
              <DialogDescription>
                Vous êtes sur le point de modifier le rôle de{" "}
                <strong>{confirmDialog?.userName}</strong> en{" "}
                <strong>{confirmDialog?.newRole && roleConfig[confirmDialog.newRole]?.label}</strong>.
                <br />
                <br />
                Cette action modifiera immédiatement les permissions de cet utilisateur.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialog(null)}>
                Annuler
              </Button>
              <Button onClick={handleRoleChange}>
                Confirmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Password Reset Dialog */}
        <Dialog open={resetPasswordDialog?.open || false} onOpenChange={() => setResetPasswordDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Réinitialiser le mot de passe
              </DialogTitle>
              <DialogDescription>
                Un email de réinitialisation sera envoyé à <strong>{resetPasswordDialog?.userEmail}</strong>.
                <br /><br />
                L'utilisateur recevra un lien pour créer un nouveau mot de passe.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetPasswordDialog(null)}>
                Annuler
              </Button>
              <Button onClick={handleSendPasswordReset} disabled={sendingReset}>
                {sendingReset && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Mail className="h-4 w-4 mr-2" />
                Envoyer l'email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Users;
