import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Palette, Wrench, Music, Bike, Building2, Users, ArrowRight, Heart, Star } from "lucide-react";

const actions = [
  {
    icon: MessageCircle,
    title: "Groupes de Parole",
    description: "Partage d'expériences dans un cadre bienveillant",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Palette,
    title: "Ateliers Créatifs",
    description: "Peinture, canevas, mosaïque pour s'exprimer",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Music,
    title: "Atelier Musical",
    description: "Expression artistique par la musique",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Bike,
    title: "Sport & Résilience",
    description: "Vélo, randonnées, trails et renforcement musculaire",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Building2,
    title: "Intervention CHU Nord",
    description: "Accompagnement addictologie",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Heart,
    title: "Bien-Être",
    description: "Massage, Yoga, Réflexologie, Sophrologie",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Actions de Prévention",
    description: "Actions de sensibilisation",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Star,
    title: "Évènementiels",
    description: "Soirées festives, diner dansant sans alcool",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const ActionsOverview = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Actions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un accompagnement diversifié pour reconstruire sa vie à travers l'entraide, 
            la créativité et le sport
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {actions.map((action, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 space-y-4">
                <div className={`${action.bgColor} w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild variant="outline" className="group">
            <Link to="/nos-actions">
              Voir toutes nos actions
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ActionsOverview;
