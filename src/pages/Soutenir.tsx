import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Euro, HandHeart, Users } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import EditablePageText from "@/components/editable/EditablePageText";

const Soutenir = () => {
  const { getContent, updateContent } = usePageContent("soutenir");

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <EditablePageText
              value={getContent("hero_title", "Soutenir Notre Action")}
              onSave={(v) => updateContent("hero_title", v)}
              as="h1"
              className="mb-6"
            />
            <EditablePageText
              value={getContent(
                "hero_subtitle",
                "Votre soutien nous permet de continuer à accompagner les personnes en difficulté. Chaque geste compte !"
              )}
              onSave={(v) => updateContent("hero_subtitle", v)}
              as="p"
              className="text-xl text-muted-foreground"
              multiline
            />
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
                <EditablePageText
                  value={getContent("adhesion_prix", "12 €")}
                  onSave={(v) => updateContent("adhesion_prix", v)}
                  as="div"
                  className="text-4xl font-bold text-primary"
                />
                <EditablePageText
                  value={getContent(
                    "adhesion_desc",
                    "Adhésion annuelle donnant accès à tous nos ateliers et activités"
                  )}
                  onSave={(v) => updateContent("adhesion_desc", v)}
                  as="p"
                  className="text-muted-foreground"
                  multiline
                />
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
                <EditablePageText
                  value={getContent("don_montant", "Montant libre")}
                  onSave={(v) => updateContent("don_montant", v)}
                  as="div"
                  className="text-4xl font-bold text-secondary"
                />
                <EditablePageText
                  value={getContent(
                    "don_desc",
                    "Soutenez financièrement nos actions et projets"
                  )}
                  onSave={(v) => updateContent("don_desc", v)}
                  as="p"
                  className="text-muted-foreground"
                  multiline
                />
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
                <EditablePageText
                  value={getContent("benevole_titre", "Votre temps")}
                  onSave={(v) => updateContent("benevole_titre", v)}
                  as="div"
                  className="text-4xl font-bold text-accent"
                />
                <EditablePageText
                  value={getContent(
                    "benevole_desc",
                    "Donnez de votre temps pour accompagner et animer"
                  )}
                  onSave={(v) => updateContent("benevole_desc", v)}
                  as="p"
                  className="text-muted-foreground"
                  multiline
                />
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
            <EditablePageText
              value={getContent("impact_title", "L'Impact de Votre Soutien")}
              onSave={(v) => updateContent("impact_title", v)}
              as="h2"
              className="mb-12 text-center"
            />
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <EditablePageText
                        value={getContent("stat1_value", "120")}
                        onSave={(v) => updateContent("stat1_value", v)}
                        as="div"
                        className="text-2xl font-bold"
                      />
                      <EditablePageText
                        value={getContent("stat1_label", "Adhérents accompagnés")}
                        onSave={(v) => updateContent("stat1_label", v)}
                        as="div"
                        className="text-sm text-muted-foreground"
                      />
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
                      <EditablePageText
                        value={getContent("stat2_value", "80")}
                        onSave={(v) => updateContent("stat2_value", v)}
                        as="div"
                        className="text-2xl font-bold"
                      />
                      <EditablePageText
                        value={getContent("stat2_label", "Personnes en abstinence")}
                        onSave={(v) => updateContent("stat2_label", v)}
                        as="div"
                        className="text-sm text-muted-foreground"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <EditablePageText
                    value={getContent("impact_subtitle", "Concrètement, vos dons permettent :")}
                    onSave={(v) => updateContent("impact_subtitle", v)}
                    as="h3"
                    className="font-bold mb-3"
                  />
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
            <EditablePageText
              value={getContent("autres_title", "Autres Façons d'Aider")}
              onSave={(v) => updateContent("autres_title", v)}
              as="h2"
              className="mb-8 text-center"
            />
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <EditablePageText
                    value={getContent("autre1_title", "Parlez de nous")}
                    onSave={(v) => updateContent("autre1_title", v)}
                    as="h3"
                    className="font-bold mb-2"
                  />
                  <EditablePageText
                    value={getContent(
                      "autre1_desc",
                      "Partagez notre action autour de vous, sur les réseaux sociaux, avec les personnes qui pourraient avoir besoin d'aide ou souhaiter nous soutenir."
                    )}
                    onSave={(v) => updateContent("autre1_desc", v)}
                    as="p"
                    className="text-muted-foreground"
                    multiline
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <EditablePageText
                    value={getContent("autre2_title", "Dons en nature")}
                    onSave={(v) => updateContent("autre2_title", v)}
                    as="h3"
                    className="font-bold mb-2"
                  />
                  <EditablePageText
                    value={getContent(
                      "autre2_desc",
                      "Matériel d'atelier (peinture, toiles, outils), équipements sportifs (vélos, casques), ou fournitures de bureau sont toujours les bienvenus."
                    )}
                    onSave={(v) => updateContent("autre2_desc", v)}
                    as="p"
                    className="text-muted-foreground"
                    multiline
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <EditablePageText
                    value={getContent("autre3_title", "Partenariats entreprises")}
                    onSave={(v) => updateContent("autre3_title", v)}
                    as="h3"
                    className="font-bold mb-2"
                  />
                  <EditablePageText
                    value={getContent(
                      "autre3_desc",
                      "Vous êtes une entreprise et souhaitez soutenir notre action ? Nous proposons des partenariats adaptés à vos valeurs et objectifs RSE."
                    )}
                    onSave={(v) => updateContent("autre3_desc", v)}
                    as="p"
                    className="text-muted-foreground"
                    multiline
                  />
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
