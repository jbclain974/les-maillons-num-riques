import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Eye, EyeOff, Upload, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  is_visible: boolean;
  settings: unknown;
}

interface SiteStatistic {
  id: string;
  stat_key: string;
  label: string;
  value: string;
  suffix: string | null;
  is_visible: boolean;
  position: number;
  section: string;
}

const sectionLabels: Record<string, string> = {
  hero_badge: "Badge Hero (Depuis 2007...)",
  hero_main: "Titre principal et description",
  cta_help: "Carte CTA - Besoin d'aide",
  cta_join: "Carte CTA - Rejoindre",
  cta_support: "Carte CTA - Soutenir",
};

const HomepageManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ["homepage-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("*")
        .order("section_key");
      if (error) throw error;
      return data as HomepageSection[];
    },
  });

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ["site-statistics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_statistics")
        .select("*")
        .order("position");
      if (error) throw error;
      return data as SiteStatistic[];
    },
  });

  const { data: heroSetting, isLoading: heroLoading } = useQuery({
    queryKey: ["hero-image-setting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "hero_image_url")
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  // Sync local state with fetched data
  useState(() => {
    if (heroSetting?.value) {
      setHeroImageUrl(heroSetting.value);
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `homepage/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(filePath);
      const url = publicUrl.publicUrl;

      // Save to site_settings
      const { error: updateError } = await supabase
        .from("site_settings")
        .update({ value: url })
        .eq("key", "hero_image_url");

      if (updateError) throw updateError;

      setHeroImageUrl(url);
      queryClient.invalidateQueries({ queryKey: ["hero-image-url"] });
      toast({ title: "Image mise à jour" });
    } catch (err) {
      console.error("Upload error:", err);
      toast({ title: "Erreur lors de l'upload", variant: "destructive" });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const updateSectionMutation = useMutation({
    mutationFn: async (section: { id: string; title?: string | null; content?: string | null; is_visible?: boolean }) => {
      const { id, ...updateData } = section;
      const { error } = await supabase
        .from("homepage_sections")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-sections"] });
      toast({ title: "Section mise à jour" });
    },
    onError: () => {
      toast({ title: "Erreur", variant: "destructive" });
    },
  });

  const updateStatMutation = useMutation({
    mutationFn: async (stat: Partial<SiteStatistic> & { id: string }) => {
      const { error } = await supabase
        .from("site_statistics")
        .update(stat)
        .eq("id", stat.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-statistics"] });
      toast({ title: "Statistique mise à jour" });
    },
    onError: () => {
      toast({ title: "Erreur", variant: "destructive" });
    },
  });

  const [editedSections, setEditedSections] = useState<Record<string, Partial<HomepageSection>>>({});
  const [editedStats, setEditedStats] = useState<Record<string, Partial<SiteStatistic>>>({});

  const handleSectionChange = (id: string, field: keyof Omit<HomepageSection, 'settings'>, value: unknown) => {
    setEditedSections((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleStatChange = (id: string, field: keyof SiteStatistic, value: unknown) => {
    setEditedStats((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveSection = (section: HomepageSection) => {
    const changes = editedSections[section.id];
    if (changes) {
      const { settings, ...safeChanges } = changes;
      updateSectionMutation.mutate({ id: section.id, ...safeChanges });
      setEditedSections((prev) => {
        const newState = { ...prev };
        delete newState[section.id];
        return newState;
      });
    }
  };

  const saveStat = (stat: SiteStatistic) => {
    const changes = editedStats[stat.id];
    if (changes) {
      updateStatMutation.mutate({ id: stat.id, ...changes });
      setEditedStats((prev) => {
        const newState = { ...prev };
        delete newState[stat.id];
        return newState;
      });
    }
  };

  const getSectionValue = (section: HomepageSection, field: keyof HomepageSection) => {
    return editedSections[section.id]?.[field] ?? section[field];
  };

  const getStatValue = (stat: SiteStatistic, field: keyof SiteStatistic) => {
    return editedStats[stat.id]?.[field] ?? stat[field];
  };

  const isLoading = sectionsLoading || statsLoading || heroLoading;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Gestion de la Page d'Accueil</h1>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Image du Hero */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Image de fond du Hero
                </CardTitle>
                <CardDescription>
                  Uploadez une nouvelle image pour le fond de la section principale de la page d'accueil.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(heroImageUrl || heroSetting?.value) && (
                  <div className="relative w-full max-w-md rounded-lg overflow-hidden border">
                    <img
                      src={heroImageUrl || heroSetting?.value}
                      alt="Hero preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="hero-image" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Button asChild disabled={isUploadingImage}>
                        <span>
                          {isUploadingImage ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Changer l'image
                        </span>
                      </Button>
                    </div>
                  </Label>
                  <input
                    id="hero-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques affichées</CardTitle>
                <CardDescription>
                  Gérez les chiffres clés affichés sur la page d'accueil. Désactivez pour masquer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {statistics?.map((stat) => (
                  <div
                    key={stat.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={getStatValue(stat, "is_visible") as boolean}
                        onCheckedChange={(checked) => {
                          handleStatChange(stat.id, "is_visible", checked);
                          updateStatMutation.mutate({ id: stat.id, is_visible: checked });
                        }}
                      />
                      {getStatValue(stat, "is_visible") ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    <Input
                      value={getStatValue(stat, "value") as string}
                      onChange={(e) => handleStatChange(stat.id, "value", e.target.value)}
                      className="w-24"
                      placeholder="Valeur"
                    />
                    <Input
                      value={getStatValue(stat, "suffix") as string ?? ""}
                      onChange={(e) => handleStatChange(stat.id, "suffix", e.target.value)}
                      className="w-16"
                      placeholder="Suffix"
                    />
                    <Input
                      value={getStatValue(stat, "label") as string}
                      onChange={(e) => handleStatChange(stat.id, "label", e.target.value)}
                      className="flex-1"
                      placeholder="Libellé"
                    />

                    {editedStats[stat.id] && (
                      <Button size="sm" onClick={() => saveStat(stat)}>
                        <Save className="h-4 w-4 mr-2" />
                        Enregistrer
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sections */}
            <div className="grid gap-6">
              {sections?.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{sectionLabels[section.section_key] || section.section_key}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={getSectionValue(section, "is_visible") as boolean}
                          onCheckedChange={(checked) => {
                            handleSectionChange(section.id, "is_visible", checked);
                            updateSectionMutation.mutate({ id: section.id, is_visible: checked });
                          }}
                        />
                        <Label>{getSectionValue(section, "is_visible") ? "Visible" : "Masqué"}</Label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Titre</Label>
                      <Input
                        value={(getSectionValue(section, "title") as string) ?? ""}
                        onChange={(e) => handleSectionChange(section.id, "title", e.target.value)}
                        placeholder="Titre de la section"
                      />
                    </div>

                    {section.content !== null && (
                      <div>
                        <Label>Contenu / Description</Label>
                        <Textarea
                          value={(getSectionValue(section, "content") as string) ?? ""}
                          onChange={(e) => handleSectionChange(section.id, "content", e.target.value)}
                          placeholder="Contenu de la section"
                          rows={3}
                        />
                      </div>
                    )}

                    {editedSections[section.id] && (
                      <Button onClick={() => saveSection(section)}>
                        <Save className="h-4 w-4 mr-2" />
                        Enregistrer les modifications
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default HomepageManager;
