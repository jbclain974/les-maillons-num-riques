import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Loader2, MessageCircle, Palette, Wrench, Music, Bike, Building2, Users, Star, Calendar, LucideIcon } from "lucide-react";
import { useHomepageActions } from "@/hooks/useHomepageActions";

const iconMap: Record<string, LucideIcon> = {
  MessageCircle,
  Palette,
  Wrench,
  Music,
  Bike,
  Building2,
  Users,
  Heart,
  Star,
  Calendar,
};

const colorMap: Record<string, { text: string; bg: string }> = {
  primary: { text: "text-primary", bg: "bg-primary/10" },
  secondary: { text: "text-secondary", bg: "bg-secondary/10" },
  accent: { text: "text-accent", bg: "bg-accent/10" },
};

// Extended details for each action (keyed by link_anchor)
const actionDetails: Record<string, { category: string; details: string; schedule: string }> = {
  "groupes-de-parole": {
    category: "Accompagnement",
    details: "Nos groupes de parole sont animés par des pairs et se réunissent régulièrement pour créer du lien et rompre l'isolement. Dans un cadre confidentiel et respectueux, chacun peut s'exprimer librement sur son parcours, ses difficultés et ses réussites.",
    schedule: "Mardi et Jeudi • 14h00 - 16h00",
  },
  "ateliers-creatifs": {
    category: "Expression artistique",
    details: "L'art-thérapie est un puissant outil de reconstruction. Nos ateliers de peinture sur toile, canevas et mosaïque permettent l'expression des émotions et le développement de nouvelles compétences. Aucun niveau requis, juste l'envie de créer !",
    schedule: "Lundi, Mercredi et Vendredi • 9h00 - 12h00",
  },
  "ateliers-manuels": {
    category: "Travaux pratiques",
    details: "Nos ateliers manuels permettent d'apprendre des savoir-faire utiles tout en retrouvant confiance en ses capacités. Jardinage bio, menuiserie, petits travaux de bricolage... Des activités concrètes qui valorisent et structurent.",
    schedule: "Mardi et Jeudi • 9h00 - 12h00",
  },
  "atelier-musical": {
    category: "Expression artistique",
    details: "Que vous soyez débutant ou musicien confirmé, notre atelier musical vous accueille pour partager des moments conviviaux autour de la musique. Guitare, percussions, chant... La musique comme langage universel de l'espoir.",
    schedule: "Vendredi • 14h00 - 17h00",
  },
  "sport-resilience": {
    category: "Activités physiques",
    details: "Le sport est un pilier fondamental de notre accompagnement. Sorties vélo hebdomadaires, randonnées en montagne, et pour les plus motivés, préparation au Grand Raid de La Réunion, y compris en joëlette pour les personnes en situation de handicap. Nous organisons également la Caravane Vélo, un tour de l'île de prévention contre l'alcool et les drogues.",
    schedule: "Mercredi et Samedi • Horaires variables selon activités",
  },
  "permanence-chu-nord": {
    category: "Accompagnement médical",
    details: "En partenariat avec le CHU de Saint-Denis, nous assurons une permanence dans le service d'addictologie. Cette présence permet un accompagnement de pairs, un soutien complémentaire au suivi médical et psychologique, et facilite la transition vers notre association.",
    schedule: "Lundi • 10h00 - 12h00",
  },
  "prevention-sensibilisation": {
    category: "Action externe",
    details: "Nous intervenons régulièrement dans les établissements scolaires, les centres de formation et lors d'événements publics pour sensibiliser aux dangers de l'alcoolisme et des addictions. Notre message : l'abstinence est possible, et il existe des solutions d'accompagnement.",
    schedule: "Sur demande • Planning adapté",
  },
};

const NosActions = () => {
  const location = useLocation();
  const { data: actions, isLoading } = useHomepageActions();

  // Scroll to anchor on mount or hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Nos Actions</h1>
            <p className="text-xl text-muted-foreground">
              Un accompagnement complet et diversifié pour reconstruire sa vie à travers 
              l'entraide, la créativité, le sport et l'expression de soi.
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8">
              {actions?.map((action) => {
                const IconComponent = iconMap[action.icon] || MessageCircle;
                const colors = colorMap[action.color_class] || colorMap.primary;
                const details = actionDetails[action.link_anchor || ""];

                return (
                  <Card
                    key={action.id}
                    id={action.link_anchor || undefined}
                    className="hover:shadow-lg transition-shadow scroll-mt-24"
                  >
                    <CardContent className="p-8">
                      <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
                        {/* Icon & Title */}
                        <div className="flex flex-col items-center lg:items-start space-y-4">
                          <div className={`${colors.bg} w-20 h-20 rounded-xl flex items-center justify-center`}>
                            <IconComponent className={`h-10 w-10 ${colors.text}`} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                          <div>
                            {details?.category && (
                              <span className={`text-sm font-medium ${colors.text}`}>
                                {details.category}
                              </span>
                            )}
                            <h3 className="text-2xl font-bold mt-1">{action.title}</h3>
                          </div>

                          <p className="text-lg text-muted-foreground">
                            {action.description}
                          </p>

                          {details?.details && (
                            <p className="text-muted-foreground">
                              {details.details}
                            </p>
                          )}

                          {details?.schedule && (
                            <div className="flex items-center space-x-2 text-sm font-medium">
                              <Heart className="h-4 w-4 text-primary" fill="currentColor" />
                              <span>{details.schedule}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2>Envie de participer ?</h2>
            <p className="text-lg text-muted-foreground">
              Toutes nos activités sont ouvertes à nos adhérents. L'adhésion annuelle est de 
              <strong> 12 €</strong> et vous donne accès à l'ensemble de nos ateliers et activités.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg gradient-ocean px-8 py-3 text-white hover:opacity-90 transition-opacity"
              >
                Nous contacter
              </a>
              <a
                href="/association"
                className="inline-flex items-center justify-center rounded-lg border border-primary px-8 py-3 text-primary hover:bg-primary/10 transition-colors"
              >
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NosActions;
