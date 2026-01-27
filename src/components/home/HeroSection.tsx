import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import heroImageDefault from "@/assets/hero-home.jpg";
import { useHomepageSections, useSiteStatistics } from "@/hooks/useSiteContent";
import { useHeroImageUrl } from "@/hooks/useHomepageActions";

const HeroSection = () => {
  const { data: sections } = useHomepageSections();
  const { data: heroStats } = useSiteStatistics("hero");
  const { data: badgeStats } = useSiteStatistics("hero_badge");
  const { data: heroImageUrl } = useHeroImageUrl();

  const heroBadge = sections?.hero_badge;
  const heroMain = sections?.hero_main;
  const badgeStat = badgeStats?.[0]; // The abstinence rate badge

  // Parse title to highlight keywords
  const renderTitle = () => {
    const title = heroMain?.title || "Ensemble contre l'alcoolisme, l'exclusion et l'isolement";
    
    // Split and highlight keywords
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

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Contenu texte */}
          <div className="space-y-8">
            {heroBadge?.is_visible !== false && (
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                <Heart className="mr-2 h-4 w-4" fill="currentColor" />
                {heroBadge?.title || "Depuis 2007 à La Réunion"}
              </div>
            )}
            
            {heroMain?.is_visible !== false && (
              <>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {renderTitle()}
                </h1>
                
                <p className="text-lg text-muted-foreground lg:text-xl">
                  {heroMain?.content || "Les Maillons de l'Espoir est un Groupe d'Entraide Mutuelle (GEM) qui accompagne les personnes en difficulté à travers des ateliers, du sport et de l'entraide à Saint-Denis."}
                </p>
              </>
            )}

            {/* Chiffres clés */}
            {heroStats && heroStats.length > 0 && (
              <div className="grid grid-cols-2 gap-6 pt-4">
                {heroStats.map((stat, index) => (
                  <div key={stat.id} className="space-y-1">
                    <div className={`text-4xl font-bold ${index === 0 ? 'text-primary' : 'text-secondary'}`}>
                      {stat.value}{stat.suffix || ""}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
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

          {/* Image hero */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={heroImageUrl || heroImageDefault}
                alt="Solidarité et espoir à La Réunion"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            {/* Badge flottant - conditionnel */}
            {badgeStat?.is_visible !== false && badgeStat && (
              <div className="absolute -bottom-6 -right-6 rounded-xl bg-accent p-6 text-white shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold">{badgeStat.value}{badgeStat.suffix || "%"}</div>
                  <div className="text-sm">{badgeStat.label}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
