import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Palette, Wrench, Music, Bike, Building2, Users, Heart } from "lucide-react";

const actions = [
  {
    icon: MessageCircle,
    title: "Groupes de Parole",
    category: "Accompagnement",
    description: "Des espaces d'écoute bienveillants où chacun peut partager son expérience sans jugement.",
    details: "Nos groupes de parole sont animés par des pairs et se réunissent régulièrement pour créer du lien et rompre l'isolement. Dans un cadre confidentiel et respectueux, chacun peut s'exprimer librement sur son parcours, ses difficultés et ses réussites.",
    schedule: "Mardi et Jeudi • 14h00 - 16h00",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Palette,
    title: "Ateliers Créatifs",
    category: "Expression artistique",
    description: "Peinture, canevas, mosaïque : libérez votre créativité et reconstruisez votre estime de soi.",
    details: "L'art-thérapie est un puissant outil de reconstruction. Nos ateliers de peinture sur toile, canevas et mosaïque permettent l'expression des émotions et le développement de nouvelles compétences. Aucun niveau requis, juste l'envie de créer !",
    schedule: "Lundi, Mercredi et Vendredi • 9h00 - 12h00",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Wrench,
    title: "Ateliers Manuels",
    category: "Travaux pratiques",
    description: "Jardinage, menuiserie, bricolage : développez de nouvelles compétences concrètes.",
    details: "Nos ateliers manuels permettent d'apprendre des savoir-faire utiles tout en retrouvant confiance en ses capacités. Jardinage bio, menuiserie, petits travaux de bricolage... Des activités concrètes qui valorisent et structurent.",
    schedule: "Mardi et Jeudi • 9h00 - 12h00",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Music,
    title: "Atelier Musical",
    category: "Expression artistique",
    description: "Découvrez le plaisir de jouer ensemble et exprimez-vous par la musique.",
    details: "Que vous soyez débutant ou musicien confirmé, notre atelier musical vous accueille pour partager des moments conviviaux autour de la musique. Guitare, percussions, chant... La musique comme langage universel de l'espoir.",
    schedule: "Vendredi • 14h00 - 17h00",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Bike,
    title: "Sport & Résilience",
    category: "Activités physiques",
    description: "Vélo, randonnées, préparation au Grand Raid : le sport comme moteur de reconstruction.",
    details: "Le sport est un pilier fondamental de notre accompagnement. Sorties vélo hebdomadaires, randonnées en montagne, et pour les plus motivés, préparation au Grand Raid de La Réunion, y compris en joëlette pour les personnes en situation de handicap. Nous organisons également la Caravane Vélo, un tour de l'île de prévention contre l'alcool et les drogues.",
    schedule: "Mercredi et Samedi • Horaires variables selon activités",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Building2,
    title: "Permanence CHU Nord",
    category: "Accompagnement médical",
    description: "Accompagnement addictologie en collaboration avec les services hospitaliers.",
    details: "En partenariat avec le CHU de Saint-Denis, nous assurons une permanence dans le service d'addictologie. Cette présence permet un accompagnement de pairs, un soutien complémentaire au suivi médical et psychologique, et facilite la transition vers notre association.",
    schedule: "Lundi • 10h00 - 12h00",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Prévention & Sensibilisation",
    category: "Action externe",
    description: "Interventions de prévention auprès des jeunes et du grand public.",
    details: "Nous intervenons régulièrement dans les établissements scolaires, les centres de formation et lors d'événements publics pour sensibiliser aux dangers de l'alcoolisme et des addictions. Notre message : l'abstinence est possible, et il existe des solutions d'accompagnement.",
    schedule: "Sur demande • Planning adapté",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const NosActions = () => {
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
          <div className="space-y-8">
            {actions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
                    {/* Icon & Title */}
                    <div className="flex flex-col items-center lg:items-start space-y-4">
                      <div className={`${action.bgColor} w-20 h-20 rounded-xl flex items-center justify-center`}>
                        <action.icon className={`h-10 w-10 ${action.color}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <span className={`text-sm font-medium ${action.color}`}>
                          {action.category}
                        </span>
                        <h3 className="text-2xl font-bold mt-1">{action.title}</h3>
                      </div>
                      
                      <p className="text-lg text-muted-foreground">
                        {action.description}
                      </p>
                      
                      <p className="text-muted-foreground">
                        {action.details}
                      </p>
                      
                      {action.schedule && (
                        <div className="flex items-center space-x-2 text-sm font-medium">
                          <Heart className="h-4 w-4 text-primary" fill="currentColor" />
                          <span>{action.schedule}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
