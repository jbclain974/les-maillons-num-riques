import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import heroImageDefault from "@/assets/hero-home.jpg";
import { useHomepageSections, useSiteStatistics } from "@/hooks/useSiteContent";
import { useHeroImageUrl } from "@/hooks/useHomepageActions";
import EditableText from "@/components/editable/EditableText";
import EditableImage from "@/components/editable/EditableImage";
import EditableWrapper from "@/components/editable/EditableWrapper";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button as DialogButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminEdit } from "@/contexts/AdminEditContext";

const HeroSection = () => {
  const { data: sections, refetch: refetchSections } = useHomepageSections();
  const { data: heroStats, refetch: refetchStats } = useSiteStatistics("hero");
  const { data: badgeStats, refetch: refetchBadgeStats } = useSiteStatistics("hero_badge");
  const { data: heroImageUrl, refetch: refetchImage } = useHeroImageUrl();
  const { canEdit } = useAdminEdit();
  const queryClient = useQueryClient();

  const [editingStat, setEditingStat] = useState<{
    id: string;
    value: string;
    label: string;
    suffix: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const heroBadge = sections?.hero_badge;
  const heroMain = sections?.hero_main;
  const badgeStat = badgeStats?.[0];

  // Parse title to highlight keywords
  const renderTitle = () => {
    const title = heroMain?.title || "Ensemble contre l'alcoolisme, l'exclusion et l'isolement";
    
    const parts = title.split(/(alcoolisme|exclusion|isolement)/gi);
    return parts.map((part, index) => {
      const lowerPart = part.toLowerCase();
      if (lowerPart === "alcoolisme") {
        return <span key={index} className="text-primary">{part}</span>;
      }
      if (lowerPart === "exclusion") {
        return <span key={index} className="text-secondary">{part}</span>;
      }
      if (lowerPart === "isolement") {
        return <span key={index} className="text-accent">{part}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSaveStat = async () => {
    if (!editingStat) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("site_statistics")
        .update({
          value: editingStat.value,
          label: editingStat.label,
          suffix: editingStat.suffix,
        })
        .eq("id", editingStat.id);

      if (error) throw error;

      toast.success("✅ Statistique mise à jour");
      refetchStats();
      refetchBadgeStats();
      setEditingStat(null);
    } catch (error: any) {
      toast.error("❌ Erreur", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpdate = () => {
    refetchImage();
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
  };

  const handleSectionUpdate = () => {
    refetchSections();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Contenu texte */}
          <div className="space-y-8">
            {heroBadge?.is_visible !== false && heroBadge && (
              <EditableText
                table="homepage_sections"
                column="title"
                id={heroBadge.id}
                value={heroBadge.title || ""}
                onUpdate={handleSectionUpdate}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                <Heart className="mr-2 h-4 w-4" fill="currentColor" />
                {heroBadge?.title || "Depuis 2007 à La Réunion"}
              </EditableText>
            )}
            
            {heroMain?.is_visible !== false && heroMain && (
              <>
                <EditableText
                  table="homepage_sections"
                  column="title"
                  id={heroMain.id}
                  value={heroMain.title || ""}
                  onUpdate={handleSectionUpdate}
                  as="h1"
                  className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                >
                  {renderTitle()}
                </EditableText>
                
                <EditableText
                  table="homepage_sections"
                  column="content"
                  id={heroMain.id}
                  value={heroMain.content || ""}
                  onUpdate={handleSectionUpdate}
                  multiline
                  as="p"
                  className="text-lg text-muted-foreground lg:text-xl"
                >
                  {heroMain?.content || "Les Maillons de l'Espoir est un Groupe d'Entraide Mutuelle (GEM) qui accompagne les personnes en difficulté à travers des ateliers, du sport et de l'entraide à Saint-Denis."}
                </EditableText>
              </>
            )}

            {/* Chiffres clés */}
            {heroStats && heroStats.length > 0 && (
              <div className="grid grid-cols-2 gap-6 pt-4">
                {heroStats.map((stat, index) => (
                  <EditableWrapper
                    key={stat.id}
                    onClick={() => setEditingStat({
                      id: stat.id,
                      value: stat.value,
                      label: stat.label,
                      suffix: stat.suffix || "",
                    })}
                    label="Modifier"
                  >
                    <div className="space-y-1">
                      <div className={`text-4xl font-bold ${index === 0 ? 'text-primary' : 'text-secondary'}`}>
                        {stat.value}{stat.suffix || ""}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </EditableWrapper>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="gradient-ocean shadow-elegant">
                <Link to="/nos-actions">
                  Découvrir nos actions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Besoin d'aide ?</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <EditableImage
              table="site_settings"
              column="value"
              id="hero_image_url"
              idColumn="key"
              currentUrl={heroImageUrl || heroImageDefault}
              onUpdate={handleImageUpdate}
              folderPath="hero"
              className="relative overflow-hidden rounded-2xl shadow-2xl"
            >
              <img
                src={heroImageUrl || heroImageDefault}
                alt="Solidarité et espoir à La Réunion"
                className="h-full w-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </EditableImage>
            
            {/* Badge flottant - conditionnel */}
            {badgeStat?.is_visible !== false && badgeStat && (
              <EditableWrapper
                onClick={() => setEditingStat({
                  id: badgeStat.id,
                  value: badgeStat.value,
                  label: badgeStat.label,
                  suffix: badgeStat.suffix || "%",
                })}
                label="Modifier"
                className="absolute -bottom-6 -right-6 rounded-xl bg-accent p-6 text-white shadow-xl"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold">{badgeStat.value}{badgeStat.suffix || "%"}</div>
                  <div className="text-sm">{badgeStat.label}</div>
                </div>
              </EditableWrapper>
            )}
          </div>
        </div>
      </div>

      {/* Dialog pour éditer les statistiques */}
      <Dialog open={!!editingStat} onOpenChange={() => setEditingStat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la statistique</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="statValue">Valeur</Label>
              <Input
                id="statValue"
                value={editingStat?.value || ""}
                onChange={(e) => setEditingStat(prev => prev ? { ...prev, value: e.target.value } : null)}
                placeholder="17"
              />
            </div>
            <div>
              <Label htmlFor="statSuffix">Suffixe (%, +, ans...)</Label>
              <Input
                id="statSuffix"
                value={editingStat?.suffix || ""}
                onChange={(e) => setEditingStat(prev => prev ? { ...prev, suffix: e.target.value } : null)}
                placeholder="%"
              />
            </div>
            <div>
              <Label htmlFor="statLabel">Label</Label>
              <Input
                id="statLabel"
                value={editingStat?.label || ""}
                onChange={(e) => setEditingStat(prev => prev ? { ...prev, label: e.target.value } : null)}
                placeholder="Taux d'abstinence"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogButton variant="outline" onClick={() => setEditingStat(null)}>
              Annuler
            </DialogButton>
            <DialogButton onClick={handleSaveStat} disabled={isSaving}>
              {isSaving ? "Sauvegarde..." : "Enregistrer"}
            </DialogButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
