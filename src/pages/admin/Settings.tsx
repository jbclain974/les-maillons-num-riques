import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface Settings {
  [key: string]: string;
}

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("*");

      if (error) throw error;

      const settingsMap: Settings = {};
      data?.forEach((item) => {
        settingsMap[item.key] = item.value || "";
      });

      setSettings(settingsMap);
    } catch (error: any) {
      toast.error("Erreur lors du chargement");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Mettre à jour tous les paramètres
      const updates = Object.entries(settings).map(([key, value]) =>
        supabase.from("site_settings").update({ value }).eq("key", key)
      );

      await Promise.all(updates);

      toast.success("Paramètres enregistrés");
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Paramètres du Site</h1>
          <p className="text-muted-foreground">
            Gérez les informations générales de l'association
          </p>
        </div>

        <div className="max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de Contact</CardTitle>
              <CardDescription>
                Ces informations apparaissent sur la page Contact et dans le footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom de l'association</Label>
                  <Input
                    value={settings.site_name || ""}
                    onChange={(e) => updateSetting("site_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email de contact</Label>
                  <Input
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) => updateSetting("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={settings.phone || ""}
                    onChange={(e) => updateSetting("phone", e.target.value)}
                    placeholder="0692..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Adresse complète</Label>
                  <Input
                    value={settings.address || ""}
                    onChange={(e) => updateSetting("address", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chiffres Clés</CardTitle>
              <CardDescription>
                Affichés sur la page d'accueil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Nombre d'adhérents</Label>
                  <Input
                    type="number"
                    value={settings.member_count || ""}
                    onChange={(e) => updateSetting("member_count", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Adhérents abstinents</Label>
                  <Input
                    type="number"
                    value={settings.abstinent_count || ""}
                    onChange={(e) => updateSetting("abstinent_count", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cotisation annuelle (€)</Label>
                  <Input
                    type="number"
                    value={settings.membership_fee || ""}
                    onChange={(e) => updateSetting("membership_fee", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Réseaux Sociaux</CardTitle>
              <CardDescription>
                Liens affichés dans le footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Page Facebook</Label>
                  <Input
                    type="url"
                    value={settings.social_facebook || ""}
                    onChange={(e) => updateSetting("social_facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Compte Instagram</Label>
                  <Input
                    type="url"
                    value={settings.social_instagram || ""}
                    onChange={(e) => updateSetting("social_instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Chaîne YouTube</Label>
                  <Input
                    type="url"
                    value={settings.social_youtube || ""}
                    onChange={(e) => updateSetting("social_youtube", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dons</CardTitle>
              <CardDescription>
                Lien vers votre plateforme de don (HelloAsso, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Lien de don</Label>
                <Input
                  type="url"
                  value={settings.donation_link || ""}
                  onChange={(e) => updateSetting("donation_link", e.target.value)}
                  placeholder="https://helloasso.com/..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSave} className="gradient-ocean" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les paramètres
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
