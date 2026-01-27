import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Shield, Save, RotateCcw } from "lucide-react";

type AppRole = 'editor' | 'animator' | 'viewer';
type AppModule = 'dashboard' | 'pages' | 'posts' | 'events' | 'activities' | 'testimonials' | 'messages' | 'media' | 'users' | 'settings' | 'members';
type AppPermission = 'view' | 'create' | 'edit' | 'delete' | 'publish' | 'validate';

const modules: { key: AppModule; label: string; description: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', description: 'Accès au dashboard admin' },
  { key: 'pages', label: 'Pages', description: 'Gestion des pages statiques' },
  { key: 'posts', label: 'Actualités', description: 'Articles et news' },
  { key: 'events', label: 'Événements', description: 'Gestion des événements' },
  { key: 'activities', label: 'Ateliers', description: 'Activités récurrentes' },
  { key: 'testimonials', label: 'Témoignages', description: 'Témoignages des adhérents' },
  { key: 'messages', label: 'Messages', description: 'Messages de contact' },
  { key: 'media', label: 'Médias', description: 'Bibliothèque de fichiers' },
  { key: 'users', label: 'Utilisateurs', description: 'Gestion des comptes' },
  { key: 'settings', label: 'Paramètres', description: 'Configuration du site' },
  { key: 'members', label: 'Espace membres', description: 'Zone adhérents' },
];

const permissions: { key: AppPermission; label: string; color: string }[] = [
  { key: 'view', label: 'Voir', color: 'bg-gray-100 text-gray-800' },
  { key: 'create', label: 'Créer', color: 'bg-green-100 text-green-800' },
  { key: 'edit', label: 'Modifier', color: 'bg-blue-100 text-blue-800' },
  { key: 'delete', label: 'Supprimer', color: 'bg-red-100 text-red-800' },
  { key: 'publish', label: 'Publier', color: 'bg-purple-100 text-purple-800' },
  { key: 'validate', label: 'Valider', color: 'bg-amber-100 text-amber-800' },
];

const roles: { key: AppRole; label: string; description: string }[] = [
  { key: 'editor', label: 'Éditeur', description: 'Gestion complète du contenu' },
  { key: 'animator', label: 'Animateur', description: 'Gestion des activités et événements' },
  { key: 'viewer', label: 'Lecteur', description: 'Consultation seule' },
];

interface PermissionState {
  [role: string]: {
    [module: string]: {
      [permission: string]: boolean;
    };
  };
}

const Permissions = () => {
  const [permissionState, setPermissionState] = useState<PermissionState>({});
  const [originalState, setOriginalState] = useState<PermissionState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('role, module, permission');

      if (error) throw error;

      // Build state object
      const state: PermissionState = {};
      roles.forEach(role => {
        state[role.key] = {};
        modules.forEach(module => {
          state[role.key][module.key] = {};
          permissions.forEach(perm => {
            state[role.key][module.key][perm.key] = false;
          });
        });
      });

      // Fill in existing permissions
      data?.forEach(item => {
        if (state[item.role]?.[item.module]) {
          state[item.role][item.module][item.permission] = true;
        }
      });

      setPermissionState(state);
      setOriginalState(JSON.parse(JSON.stringify(state)));
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des permissions");
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (role: AppRole, module: AppModule, permission: AppPermission) => {
    setPermissionState(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: {
          ...prev[role][module],
          [permission]: !prev[role][module][permission],
        },
      },
    }));
  };

  const hasChanges = JSON.stringify(permissionState) !== JSON.stringify(originalState);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Find changes
      const toAdd: { role: AppRole; module: AppModule; permission: AppPermission }[] = [];
      const toRemove: { role: AppRole; module: AppModule; permission: AppPermission }[] = [];

      roles.forEach(role => {
        modules.forEach(module => {
          permissions.forEach(perm => {
            const current = permissionState[role.key]?.[module.key]?.[perm.key] || false;
            const original = originalState[role.key]?.[module.key]?.[perm.key] || false;

            if (current && !original) {
              toAdd.push({ role: role.key, module: module.key, permission: perm.key });
            } else if (!current && original) {
              toRemove.push({ role: role.key, module: module.key, permission: perm.key });
            }
          });
        });
      });

      // Remove permissions
      for (const item of toRemove) {
        await supabase
          .from('role_permissions')
          .delete()
          .eq('role', item.role)
          .eq('module', item.module)
          .eq('permission', item.permission);
      }

      // Add permissions
      if (toAdd.length > 0) {
        const { error } = await supabase
          .from('role_permissions')
          .insert(toAdd);

        if (error) throw error;
      }

      setOriginalState(JSON.parse(JSON.stringify(permissionState)));
      toast.success("Permissions mises à jour");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPermissionState(JSON.parse(JSON.stringify(originalState)));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Gestion des permissions
            </h1>
            <p className="text-muted-foreground mt-1">
              Configurez les droits d'accès par rôle et par module
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges || saving}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || saving} className="gradient-ocean">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Enregistrer
            </Button>
          </div>
        </div>

        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardContent className="py-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Les administrateurs ont automatiquement accès à toutes les fonctionnalités. Ces paramètres concernent uniquement les rôles Éditeur, Animateur et Lecteur.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="editor">
          <TabsList className="mb-6">
            {roles.map(role => (
              <TabsTrigger key={role.key} value={role.key} className="gap-2">
                {role.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {roles.map(role => (
            <TabsContent key={role.key} value={role.key}>
              <Card>
                <CardHeader>
                  <CardTitle>{role.label}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left font-medium">Module</th>
                          {permissions.map(perm => (
                            <th key={perm.key} className="py-3 px-2 text-center">
                              <Badge variant="outline" className={perm.color}>
                                {perm.label}
                              </Badge>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {modules.map(module => (
                          <tr key={module.key} className="border-b hover:bg-muted/50">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium">{module.label}</div>
                                <div className="text-xs text-muted-foreground">{module.description}</div>
                              </div>
                            </td>
                            {permissions.map(perm => (
                              <td key={perm.key} className="py-4 px-2 text-center">
                                <Checkbox
                                  checked={permissionState[role.key]?.[module.key]?.[perm.key] || false}
                                  onCheckedChange={() => togglePermission(role.key, module.key, perm.key)}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Permissions;
