import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Users, Award } from "lucide-react";

const Association = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Notre Association</h1>
            <p className="text-xl text-muted-foreground">
              Depuis 2007, Les Maillons de l'Espoir accompagne les personnes en difficulté 
              face à l'alcoolisme, l'exclusion et l'isolement à Saint-Denis de La Réunion.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Notre Histoire</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg">
                Créée en 2007, Les Maillons de l'Espoir est un <strong>Groupe d'Entraide Mutuelle (GEM)</strong> 
                qui lutte activement contre l'alcoolisme, l'exclusion sociale et l'isolement à La Réunion.
              </p>
              <p className="text-muted-foreground text-lg mt-4">
                Notre association compte aujourd'hui <strong>120 adhérents</strong>, dont <strong>80 sont abstinents</strong>, 
                soit un taux de réussite de 66%. Ce chiffre témoigne de l'efficacité de notre approche basée 
                sur l'entraide, le sport, la créativité et l'accompagnement bienveillant.
              </p>
              <p className="text-muted-foreground text-lg mt-4">
                Basée à Saint-Denis, nous proposons un accompagnement diversifié à travers des ateliers créatifs, 
                des activités sportives, des groupes de parole et une permanence addictologie au CHU Nord.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Valeurs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center">Mission & Valeurs</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" fill="currentColor" />
                </div>
                <h3 className="text-xl font-bold">Entraide</h3>
                <p className="text-muted-foreground">
                  Créer du lien social et rompre l'isolement par le partage d'expériences
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Reconstruction</h3>
                <p className="text-muted-foreground">
                  Accompagner vers l'abstinence et la réinsertion sociale
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Bienveillance</h3>
                <p className="text-muted-foreground">
                  Accueillir sans jugement dans un cadre respectueux et sécurisant
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Résilience</h3>
                <p className="text-muted-foreground">
                  Développer la confiance en soi par le sport et la créativité
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Approche */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center">Notre Approche</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Accompagnement Addictologie</h3>
                  <p className="text-muted-foreground">
                    Nous assurons une permanence au CHU Nord en collaboration avec les services 
                    d'addictologie, permettant un suivi médical et psychologique adapté.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Sport & Résilience</h3>
                  <p className="text-muted-foreground">
                    Le sport est un pilier de notre accompagnement : vélo, randonnées, préparation 
                    au Grand Raid. Nous organisons également le <strong>Tour de l'île à vélo contre 
                    l'alcool et les drogues</strong> (Caravane Vélo), un événement majeur de prévention.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Ateliers & Créativité</h3>
                  <p className="text-muted-foreground">
                    Peinture, canevas, mosaïque, jardinage, menuiserie, musique... Nos ateliers 
                    permettent l'expression de soi et la reconstruction de l'estime de soi.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Groupes de Parole</h3>
                  <p className="text-muted-foreground">
                    Des espaces d'écoute et de partage où chacun peut s'exprimer librement 
                    dans un cadre bienveillant et confidentiel.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Informations pratiques */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-8">Rejoignez-nous</h2>
            <p className="text-lg text-muted-foreground mb-6">
              L'adhésion annuelle est de <strong>12 €</strong> et ouvre l'accès à tous nos ateliers 
              et activités.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 transition-colors"
              >
                Nous contacter
              </a>
              <a
                href="/nos-actions"
                className="inline-flex items-center justify-center rounded-lg border border-primary px-6 py-3 text-primary hover:bg-primary/10 transition-colors"
              >
                Découvrir nos actions
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Association;
