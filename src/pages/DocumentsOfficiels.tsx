import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, FileCheck, FileCode } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import EditablePageText from "@/components/editable/EditablePageText";

const DocumentsOfficiels = () => {
  const { getContent, updateContent } = usePageContent("documents_officiels");

  const docs = [
    { title: "Statuts de l'Association", type: "PDF", size: "1.2 Mo", icon: FileText },
    { title: "Rapport d'Activité 2024", type: "PDF", size: "2.4 Mo", icon: FileCheck },
    { title: "RIB de l'Association", type: "PDF", size: "0.5 Mo", icon: FileCode },
    { title: "Fiche d'adhésion 2026", type: "PDF", size: "0.8 Mo", icon: FileText },
  ];

  return (
    <Layout>
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <EditablePageText
            value={getContent("hero_title", "Documents Officiels")}
            onSave={(v) => updateContent("hero_title", v)}
            as="h1"
            className="mb-6"
          />
          <EditablePageText
            value={getContent("hero_subtitle", "Téléchargez les documents administratifs et ressources de l'association.")}
            onSave={(v) => updateContent("hero_subtitle", v)}
            as="p"
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            multiline
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {docs.map((doc, i) => (
              <Card key={i} className="group hover:border-primary transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <doc.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="group-hover:text-primary">
                    <Download className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/10 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">Ces documents sont mis à disposition pour la transparence et l'information de nos adhérents.</p>
          <p className="text-sm font-medium">Pour toute demande spécifique, merci de contacter le secrétariat.</p>
        </div>
      </section>
    </Layout>
  );
};

export default DocumentsOfficiels;
