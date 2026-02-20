import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Zap, Activity, BookOpen } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import EditablePageText from "@/components/editable/EditablePageText";

const VeilleSanitaire = () => {
  const { getContent, updateContent } = usePageContent("veille_sanitaire");

  const articles = [
    {
      title: "L'activité physique et l'abstinence",
      category: "Sport & Santé",
      desc: "Comment le sport aide le cerveau à produire de la dopamine naturelle durant le sevrage.",
      icon: Activity,
    },
    {
      title: "Nutrition : Les aliments alliés du foie",
      category: "Nutrition",
      desc: "Les bons réflexes alimentaires pour aider la régénération hépatique après des années de consommation.",
      icon: Zap,
    },
    {
      title: "Le sommeil, pilier de la reconstruction",
      category: "Bien-être",
      desc: "Comprendre les cycles du sommeil pour retrouver une énergie durable.",
      icon: ShieldCheck,
    },
  ];

  return (
    <Layout>
      <section className="bg-gradient-to-br from-green-50 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-green-600">Santé & Prévention</Badge>
          <EditablePageText
            value={getContent("hero_title", "Veille Sanitaire")}
            onSave={(v) => updateContent("hero_title", v)}
            as="h1"
            className="mb-6 text-4xl md:text-5xl font-bold"
          />
          <EditablePageText
            value={getContent("hero_subtitle", "Informations, conseils et ressources pour une vie saine et durable à La Réunion.")}
            onSave={(v) => updateContent("hero_subtitle", v)}
            as="p"
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            multiline
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {articles.map((art, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <art.icon className="h-10 w-10 text-green-600 mb-4" />
                  <Badge variant="outline" className="w-fit">{art.category}</Badge>
                  <CardTitle className="mt-2">{art.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{art.desc}</p>
                  <button className="mt-4 text-green-600 font-medium hover:underline inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Lire la suite
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-green-600 text-white">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Besoin d'un conseil spécifique ?</h2>
                <p className="opacity-90">Nos bénévoles et partenaires de santé sont à votre écoute pour vous orienter vers les meilleures ressources à Saint-Denis.</p>
              </div>
              <a href="/contact" className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all">
                Nous contacter
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default VeilleSanitaire;
