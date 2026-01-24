import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Shield, UserCog } from "lucide-react";
import { sanitizeError } from "@/lib/errorSanitizer";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

const Users = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);

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

      // Organiser les rôles par user_id
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

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Supprimer les rôles existants
      await supabase.from("user_roles").delete().eq("user_id", userId);

      // Ajouter le nouveau rôle
      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: newRole as any }]);

      if (error) throw error;

      toast.success("Rôle mis à jour");
      fetchUsersAndRoles();
    } catch (error: any) {
      toast.error(sanitizeError(error));
    }
  };

  const getRoleBadge = (userRoles: string[]) => {
    if (!userRoles || userRoles.length === 0) {
      return <Badge variant="outline">Aucun rôle</Badge>;
    }

    const roleStyles: { [key: string]: string } = {
      admin: "bg-red-100 text-red-800",
      editor: "bg-blue-100 text-blue-800",
      animator: "bg-green-100 text-green-800",
      viewer: "bg-gray-100 text-gray-800",
    };

    return userRoles.map((role) => (
      <Badge key={role} className={roleStyles[role]}>
        {role === "admin" && "Administrateur"}
        {role === "editor" && "Éditeur"}
        {role === "animator" && "Animateur"}
        {role === "viewer" && "Lecteur"}
      </Badge>
    ));
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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les rôles et permissions des membres de l'équipe
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Rôles disponibles</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>Admin :</strong> Accès complet à toutes les fonctionnalités</li>
                  <li><strong>Éditeur :</strong> Gestion des contenus (actualités, événements, ateliers, témoignages)</li>
                  <li><strong>Animateur :</strong> Gestion des ateliers et événements uniquement</li>
                  <li><strong>Lecteur :</strong> Consultation uniquement, sans modification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <UserCog className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">
                          {profile.full_name || "Utilisateur sans nom"}
                        </h3>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Inscrit le {format(new Date(profile.created_at), "d MMMM yyyy", { locale: fr })}
                      </span>
                      <span className="flex gap-2">{getRoleBadge(roles[profile.id] || [])}</span>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Select
                      value={roles[profile.id]?.[0] || ""}
                      onValueChange={(value) => handleRoleChange(profile.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Attribuer un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="editor">Éditeur</SelectItem>
                        <SelectItem value="animator">Animateur</SelectItem>
                        <SelectItem value="viewer">Lecteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Users;
