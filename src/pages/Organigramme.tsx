import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePageContent } from "@/hooks/usePageContent";
import EditablePageText from "@/components/editable/EditablePageText";
import { Users, ShieldCheck, HeartHandshake } from "lucide-react";

const Organigramme = () => {
  const { getContent, updateContent } = usePageContent("organigramme");

  const sections = [
    {
      title: "Le Bureau",
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      members: [
        { role: "Président(e)", name: "À définir", desc: "Direction stratégique et représentation" },
        { role: "Secrétaire", name: "À définir", desc: "Gestion administrative et comptes-rendus" },
        { role: "Trésorier(e)", name: "À définir", desc: "Gestion financière et transparence" },
      ]
    },
    {
      title: "L'Équipe Technique",
      icon: <Users className="h-6 w-6 text-secondary" />,
      members: [
        { role: "Coordinateur / Directeur", name: "À définir", desc: "Pilotage opérationnel du GEM" },
        { role: "Animateur(trice)", name: "À définir", desc: "Animation des ateliers et suivi social" },
        { role: "Chargé de projet", name: "À définir", desc: "Développement des actions de terrain" },
      ]
    },
    {
      title: "Les Bénévoles Actifs",
      icon: <HeartHandshake className="h-6 w-6 text-accent" />,
      members: [
        { role: "Référent Sport", name: "À définir", desc: "Accompagnement randonnées et vélo" },
        { role: "Référent Culture", name: "À définir", desc: "Organisation des sorties et événements" },
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <EditablePageText
              value={getContent("hero_title", "Notre Organigramme")}
              onSave={(v) => updateContent("hero_title", v)}
              as="h1"
              className="mb-6"
            />
            <EditablePageText
              value={getContent(
                "hero_subtitle",
                "Découvrez les visages et les rôles de ceux qui font battre le cœur des Maillons de l'Espoir au quotidien."
              )}
              onSave={(v) => updateContent("hero_subtitle", v)}
              as="p"
              className="text-xl text-muted-foreground"
              multiline
            />
          </div>
        </div>
      </section>

      {/* Structure Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-8">
                <div className="flex items-center gap-3 border-b pb-4">
                  {section.icon}
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {section.members.map((member, mIdx) => (
                    <Card key={mIdx} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16 border-2 border-primary/10">
                            <AvatarFallback className="bg-primary/5 text-primary">
                              {member.role.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-primary uppercase tracking-wider">
                              {member.role}
                            </p>
                            <h3 className="text-xl font-bold">
                              {member.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {member.desc}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Vous souhaitez rejoindre l'équipe ?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Que ce soit pour du bénévolat ponctuel ou un engagement régulier, vos compétences et votre bienveillance sont les bienvenues.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-white hover:bg-primary/90 transition-colors"
          >
            Devenir Bénévole
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Organigramme;
