import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Euro, HandHeart, Users } from "lucide-react";

const Soutenir = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Soutenir Notre Action</h1>
            <p className="text-xl text-muted-foreground">
              Votre soutien nous permet de continuer à accompagner les personnes en difficulté. 
              Chaque geste compte !
            </p>
          </div>
        </div>
      </section>

      {/* Moyens de soutien */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Adhésion */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-primary" fill="currentColor" />
                </div>
                <CardTitle className="text-2xl">Adhérer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="text-4xl font-bold text-primary">12 €</div>
                <p className="text-muted-foreground">
                  Adhésion annuelle donnant accès à tous nos ateliers et activités
                </p>
                <ul className="text-sm text-left space-y-2 text-muted-foreground">
                  <li>✓ Accès à tous les ateliers</li>
                  <li>✓ Participation aux sorties sportives</li>
                  <li>✓ Groupes de parole illimités</li>
                  <li>✓ Soutien de la communauté</li>
                </ul>
                <Button asChild className="w-full gradient-ocean">
                  <a href="/contact?subject=adhesion">Adhérer maintenant</a>
                </Button>
              </CardContent>
            </Card>

            {/* Don */}
            <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Euro className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Faire un don</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="text-4xl font-bold text-secondary">Montant libre</div>
                <p className="text-muted-foreground">
                  Soutenez financièrement nos actions et projets
                </p>
                <ul className="text-sm text-left space-y-2 text-muted-foreground">
                  <li>✓ Don déductible des impôts (66%)</li>
                  <li>✓ Paiement sécurisé</li>
                  <li>✓ Reçu fiscal automatique</li>
                  <li>✓ Impact direct sur nos missions</li>
                </ul>
                <Button asChild className="w-full" variant="outline">
                  <a href="/contact?subject=don">Faire un don</a>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Plateforme de don sécurisée à venir
                </p>
              </CardContent>
            </Card>

            {/* Bénévolat */}
            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <HandHeart className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Devenir bénévole</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="text-4xl font-bold text-accent">Votre temps</div>
                <p className="text-muted-foreground">
                  Donnez de votre temps pour accompagner et animer
                </p>
                <ul className="text-sm text-left space-y-2 text-muted-foreground">
                  <li>✓ Animation d'ateliers</li>
                  <li>✓ Accompagnement sportif</li>
                  <li>✓ Soutien administratif</li>
                  <li>✓ Organisation d'événements</li>
                </ul>
                <Button asChild className="w-full gradient-sunset">
                  <a href="/contact?subject=benevolat">Proposer mon aide</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12 text-center">L'Impact de Votre Soutien</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">120</div>
                      <div className="text-sm text-muted-foreground">Adhérents accompagnés</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-secondary" fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">80</div>
                      <div className="text-sm text-muted-foreground">Personnes en abstinence</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3">Concrètement, vos dons permettent :</h3>
                  <ul className="grid gap-3 md:grid-cols-2 text-sm text-muted-foreground">
                    <li>✓ Financer les sorties vélo et randonnées</li>
                    <li>✓ Acheter du matériel pour les ateliers créatifs</li>
                    <li>✓ Organiser la Caravane Vélo de prévention</li>
                    <li>✓ Financer les équipements sportifs</li>
                    <li>✓ Soutenir les projets Grand Raid avec joëlettes</li>
                    <li>✓ Développer de nouveaux ateliers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Autres façons d'aider */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-8 text-center">Autres Façons d'Aider</h2>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Parlez de nous</h3>
                  <p className="text-muted-foreground">
                    Partagez notre action autour de vous, sur les réseaux sociaux, avec les personnes 
                    qui pourraient avoir besoin d'aide ou souhaiter nous soutenir.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Dons en nature</h3>
                  <p className="text-muted-foreground">
                    Matériel d'atelier (peinture, toiles, outils), équipements sportifs (vélos, 
                    casques), ou fournitures de bureau sont toujours les bienvenus.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Partenariats entreprises</h3>
                  <p className="text-muted-foreground">
                    Vous êtes une entreprise et souhaitez soutenir notre action ? Nous proposons 
                    des partenariats adaptés à vos valeurs et objectifs RSE.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg" className="gradient-ocean">
                <a href="/contact">Contactez-nous pour en savoir plus</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Soutenir;
