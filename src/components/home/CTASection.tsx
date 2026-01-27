import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, HandHeart, Phone } from "lucide-react";
import { useHomepageSections } from "@/hooks/useSiteContent";

const CTASection = () => {
  const { data: sections } = useHomepageSections();

  const ctaHelp = sections?.cta_help;
  const ctaJoin = sections?.cta_join;
  const ctaSupport = sections?.cta_support;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Besoin d'aide */}
          {ctaHelp?.is_visible !== false && (
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{ctaHelp?.title || "Besoin d'aide ?"}</h3>
                <p className="text-muted-foreground">
                  {ctaHelp?.content || "Vous ou un proche êtes en difficulté ? Nous sommes là pour vous écouter et vous accompagner."}
                </p>
                <Button asChild className="w-full gradient-ocean">
                  <Link to="/contact">Nous contacter</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Rejoindre */}
          {ctaJoin?.is_visible !== false && (
            <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-secondary" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold">{ctaJoin?.title || "Rejoindre"}</h3>
                <p className="text-muted-foreground">
                  {ctaJoin?.content || "Participez à nos ateliers et trouvez du soutien au sein d'un groupe bienveillant."}
                </p>
                <Button asChild variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white">
                  <Link to="/nos-actions">Découvrir les ateliers</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Soutenir */}
          {ctaSupport?.is_visible !== false && (
            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <HandHeart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">{ctaSupport?.title || "Soutenir"}</h3>
                <p className="text-muted-foreground">
                  {ctaSupport?.content || "Aidez-nous à poursuivre notre mission par un don, une adhésion ou comme bénévole."}
                </p>
                <Button asChild className="w-full gradient-sunset">
                  <Link to="/soutenir">Comment aider</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
