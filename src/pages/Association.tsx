import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Users, Award } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import EditablePageText from "@/components/editable/EditablePageText";

const Association = () => {
  const { getContent, updateContent, loading } = usePageContent("association");

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <EditablePageText
              value={getContent("hero_title", "Notre Association")}
              onSave={(v) => updateContent("hero_title", v)}
              as="h1"
              className="mb-6"
            />
            <EditablePageText
              value={getContent(
                "hero_subtitle",
                "Depuis 2007, Les Maillons de l'Espoir accompagne les personnes en difficulté face à l'alcoolisme, l'exclusion et l'isolement à Saint-Denis de La Réunion."
              )}
              onSave={(v) => updateContent("hero_subtitle", v)}
              as="p"
              className="text-xl text-muted-foreground"
              multiline
            />
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <EditablePageText
              value={getContent("histoire_title", "Notre Histoire")}
              onSave={(v) => updateContent("histoire_title", v)}
              as="h2"
              className="mb-8 text-center"
            />
            <div className="prose prose-lg max-w-none space-y-4">
              <EditablePageText
                value={getContent(
                  "histoire_p1",
                  "Créée en 2007, Les Maillons de l'Espoir est un Groupe d'Entraide Mutuelle (GEM) qui lutte activement contre l'alcoolisme, l'exclusion sociale et l'isolement à La Réunion."
                )}
                onSave={(v) => updateContent("histoire_p1", v)}
                as="p"
                className="text-muted-foreground text-lg"
                multiline
              />
              <EditablePageText
                value={getContent(
                  "histoire_p2",
                  "Notre association compte aujourd'hui 120 adhérents, dont 80 sont abstinents, soit un taux de réussite de 66%. Ce chiffre témoigne de l'efficacité de notre approche basée sur l'entraide, le sport, la créativité et l'accompagnement bienveillant."
                )}
                onSave={(v) => updateContent("histoire_p2", v)}
                as="p"
                className="text-muted-foreground text-lg"
                multiline
              />
              <EditablePageText
                value={getContent(
                  "histoire_p3",
                  "Basée à Saint-Denis, nous proposons un accompagnement diversifié à travers des ateliers créatifs, des activités sportives, des groupes de parole et une permanence addictologie au CHU Nord."
                )}
                onSave={(v) => updateContent("histoire_p3", v)}
                as="p"
                className="text-muted-foreground text-lg"
                multiline
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Valeurs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <EditablePageText
            value={getContent("valeurs_title", "Mission & Valeurs")}
            onSave={(v) => updateContent("valeurs_title", v)}
            as="h2"
            className="mb-12 text-center"
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" fill="currentColor" />
                </div>
                <EditablePageText
                  value={getContent("valeur1_title", "Entraide")}
                  onSave={(v) => updateContent("valeur1_title", v)}
                  as="h3"
                  className="text-xl font-bold"
                />
                <EditablePageText
                  value={getContent(
                    "valeur1_desc",
                    "Créer du lien social et rompre l'isolement par le partage d'expériences"
                  )}
                  onSave={(v) => updateContent("valeur1_desc", v)}
                  as="p"
                  className="text-muted-foreground"
                  multiline
                />
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-secondary" />
                </div>
                <EditablePageText
                  value={getContent("valeur2_title", "Reconstruction")}
                  onSave={(v) => updateContent("valeur2_title", v)}
                  as="h3"
                  className="text-xl font-bold"
                />
                <EditablePageText
                  value={getContent(
                    "valeur2_desc",
                    "Accompagner vers l'abstinence et la réinsertion sociale"
                  )}
                  onSave={(v) => updateContent("valeur2_desc", v)}
                  as="p"
                  className="text-muted-foreground"
                  multiline
                />
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <EditablePageText
                  value={getContent("valeur3_title", "Bienveillance")}
                  onSave={(v) => updateContent("valeur3_title", v)}
                  as="h3"
                  className="text-xl font-bold"
                />
                <EditablePageText
                  value={getContent(
                    "valeur3_desc",
                    "Accueillir sans jugement dans un cadre respectueux et sécurisant"
                  )}
                  onSave={(v) => updateContent("valeur3_desc", v)}
                  as="p"
                  className="text-muted-foreground"
                  multiline
                />
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <EditablePageText
                  value={getContent("valeur4_title", "Résilience")}
                  onSave={(v) => updateContent("valeur4_title", v)}
                  as="h3"
                  className="text-xl font-bold"
                />
                <EditablePageText
                  value={getContent(
                    "valeur4_desc",
                    "Développer la confiance en soi par le sport et la créativité"
                  )}
                  onSave={(v) => updateContent("valeur4_desc", v)}
                  as="p"
                  className="text-muted-foreground"
                  multiline
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Approche */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <EditablePageText
              value={getContent("approche_title", "Notre Approche")}
              onSave={(v) => updateContent("approche_title", v)}
              as="h2"
              className="mb-8 text-center"
            />
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <EditablePageText
                    value={getContent("approche1_title", "Accompagnement Addictologie")}
                    onSave={(v) => updateContent("approche1_title", v)}
                    as="h3"
                    className="text-xl font-bold mb-3"
                  />
                  <EditablePageText
                    value={getContent(
                      "approche1_desc",
                      "Nous assurons une permanence au CHU Nord en collaboration avec les services d'addictologie, permettant un suivi médical et psychologique adapté."
                    )}
                    onSave={(v) => updateContent("approche1_desc", v)}
                    as="p"
                    className="text-muted-foreground"
                    multiline
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <EditablePageText
                    value={getContent("approche2_title", "Sport & Résilience")}
                    onSave={(v) => updateContent("approche2_title", v)}
                    as="h3"
                    className="text-xl font-bold mb-3"
                  />
                  <EditablePageText
                    value={getContent(
                      "approche2_desc",
                      "Le sport est un pilier de notre accompagnement : vélo, randonnées, préparation au Grand Raid. Nous organisons également le Tour de l'île à vélo contre l'alcool et les drogues (Caravane Vélo), un événement majeur de prévention."
                    )}
                    onSave={(v) => updateContent("approche2_desc", v)}
                    as="p"
                    className="text-muted-foreground"
                    multiline
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <EditablePageText
                    value={getContent("approche3_title", "Ateliers & Créativité")}
                    onSave={(v) => updateContent("approche3_title", v)}
                    as="h3"
                    className="text-xl font-bold mb-3"
                  />
                  <EditablePageText
                    value={getContent(
                      "approche3_desc",
                      "Peinture, canevas, mosaïque, jardinage, menuiserie, musique... Nos ateliers permettent l'expression de soi et la reconstruction de l'estime de soi."
                    )}
                    onSave={(v) => updateContent("approche3_desc", v)}
                    as="p"
                    className="text-muted-foreground"
                    multiline
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <EditablePageText
                    value={getContent("approche4_title", "Groupes de Parole")}
                    onSave={(v) => updateContent("approche4_title", v)}
                    as="h3"
                    className="text-xl font-bold mb-3"
                  />
                  <EditablePageText
                    value={getContent(
                      "approche4_desc",
                      "Des espaces d'écoute et de partage où chacun peut s'exprimer librement dans un cadre bienveillant et confidentiel."
                    )}
                    onSave={(v) => updateContent("approche4_desc", v)}
                    as="p"
                    className="text-muted-foreground"
                    multiline
                  />
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
            <EditablePageText
              value={getContent("rejoindre_title", "Rejoignez-nous")}
              onSave={(v) => updateContent("rejoindre_title", v)}
              as="h2"
              className="mb-8"
            />
            <EditablePageText
              value={getContent(
                "rejoindre_desc",
                "L'adhésion annuelle est de 12 € et ouvre l'accès à tous nos ateliers et activités."
              )}
              onSave={(v) => updateContent("rejoindre_desc", v)}
              as="p"
              className="text-lg text-muted-foreground mb-6"
              multiline
            />
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
