import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Shield,
  UserCog,
  Search,
  Users as UsersIcon,
  Crown,
  PenLine,
  Eye,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { sanitizeError } from "@/lib/errorSanitizer";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

type AppRole = "admin" | "editor" | "animator" | "viewer";

const roleConfig: Record<AppRole, { label: string; color: string; bgColor: string; icon: React.ComponentType<any>; description: string }> = {
  admin: {
    label: "Administrateur",
    color: "text-red-700",
    bgColor: "bg-red-100 border-red-200",
    icon: Crown,
    description: "Accès complet à toutes les fonctionnalités",
  },
  editor: {
    label: "Éditeur",
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    icon: PenLine,
    description: "Gestion des contenus (actualités, événements, ateliers, témoignages)",
  },
  animator: {
    label: "Animateur",
    color: "text-secondary",
    bgColor: "bg-secondary/10 border-secondary/20",
    icon: Sparkles,
    description: "Gestion des ateliers et événements uniquement",
  },
  viewer: {
    label: "Lecteur",
    color: "text-muted-foreground",
    bgColor: "bg-muted border-muted-foreground/20",
    icon: Eye,
    description: "Consultation uniquement, sans modification",
  },
};

const Users = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    userName: string;
    newRole: AppRole;
  } | null>(null);

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

      toast.success("Rôle mis à jour avec succès");
      fetchUsersAndRoles();
    } catch (error: any) {
      toast.error(sanitizeError(error));
    } finally {
      setConfirmDialog(null);
    }
  };

  const getRoleBadge = (userRoles: string[]) => {
    const role = (userRoles?.[0] as AppRole) || "viewer";
    const config = roleConfig[role] || roleConfig.viewer;
    const Icon = config.icon;

    return (
      <Badge className={`${config.bgColor} ${config.color} border gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profile.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const userRole = roles[profile.id]?.[0] || "viewer";
    const matchesRole = filterRole === "all" || userRole === filterRole;

    return matchesSearch && matchesRole;
  });

  const roleStats = {
    admin: profiles.filter((p) => roles[p.id]?.[0] === "admin").length,
    editor: profiles.filter((p) => roles[p.id]?.[0] === "editor").length,
    animator: profiles.filter((p) => roles[p.id]?.[0] === "animator").length,
    viewer: profiles.filter((p) => !roles[p.id]?.[0] || roles[p.id]?.[0] === "viewer").length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 bg-gradient-to-br from-background via-background to-muted/20 min-h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les rôles et permissions des membres de l'équipe
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(Object.entries(roleConfig) as [AppRole, typeof roleConfig.admin][]).map(([role, config]) => {
            const Icon = config.icon;
            return (
              <Card
                key={role}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  filterRole === role ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setFilterRole(filterRole === role ? "all" : role)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{roleStats[role]}</p>
                    <p className="text-xs text-muted-foreground">{config.label}s</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle actuel</TableHead>
                  <TableHead>Inscrit le</TableHead>
                  <TableHead className="text-right">Modifier le rôle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => {
                  const currentRole = (roles[profile.id]?.[0] as AppRole) || "viewer";

                  return (
                    <TableRow key={profile.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                            {(profile.full_name?.[0] || profile.email[0]).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">
                              {profile.full_name || "Utilisateur sans nom"}
                            </p>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(roles[profile.id] || [])}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(profile.created_at), "d MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={currentRole}
                          onValueChange={(value) =>
                            handleRoleChangeRequest(
                              profile.id,
                              profile.full_name || profile.email,
                              value as AppRole
                            )
                          }
                        >
                          <SelectTrigger className="w-40 ml-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              <span className="flex items-center gap-2">
                                <Crown className="h-3 w-3" /> Administrateur
                              </span>
                            </SelectItem>
                            <SelectItem value="editor">
                              <span className="flex items-center gap-2">
                                <PenLine className="h-3 w-3" /> Éditeur
                              </span>
                            </SelectItem>
                            <SelectItem value="animator">
                              <span className="flex items-center gap-2">
                                <Sparkles className="h-3 w-3" /> Animateur
                              </span>
                            </SelectItem>
                            <SelectItem value="viewer">
                              <span className="flex items-center gap-2">
                                <Eye className="h-3 w-3" /> Lecteur
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredProfiles.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
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
      </div>
    </AdminLayout>
  );
};

export default Users;
