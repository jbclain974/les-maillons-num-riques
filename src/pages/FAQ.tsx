import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { usePageContent } from "@/hooks/usePageContent";
import EditablePageText from "@/components/editable/EditablePageText";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

const FAQ = () => {
  const { getContent, updateContent } = usePageContent("faq");
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    try {
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .eq("is_published", true)
        .order("order_position", { ascending: true });

      if (error) throw error;
      setFaqItems(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement de la FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  // Grouper par catégorie
  const categories = [...new Set(faqItems.map((item) => item.category || "Général"))];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <EditablePageText
              value={getContent("hero_title", "Questions Fréquentes")}
              onSave={(v) => updateContent("hero_title", v)}
              as="h1"
              className="mb-6"
            />
            <EditablePageText
              value={getContent(
                "hero_subtitle",
                "Trouvez rapidement les réponses à vos questions sur l'association, l'adhésion et nos activités"
              )}
              onSave={(v) => updateContent("hero_subtitle", v)}
              as="p"
              className="text-xl text-muted-foreground"
              multiline
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : faqItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune question pour le moment</p>
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map((category) => {
                  const items = faqItems.filter((item) => (item.category || "Général") === category);
                  if (items.length === 0) return null;

                  return (
                    <div key={category}>
                      <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
                      <Accordion type="single" collapsible className="space-y-2">
                        {items.map((item) => (
                          <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-6">
                            <AccordionTrigger className="text-left hover:no-underline">
                              <span className="font-medium">{item.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <EditablePageText
                  value={getContent("cta_title", "Vous n'avez pas trouvé votre réponse ?")}
                  onSave={(v) => updateContent("cta_title", v)}
                  as="h2"
                  className="text-2xl font-bold"
                />
                <EditablePageText
                  value={getContent(
                    "cta_desc",
                    "Notre équipe est là pour répondre à toutes vos questions. N'hésitez pas à nous contacter !"
                  )}
                  onSave={(v) => updateContent("cta_desc", v)}
                  as="p"
                  className="text-muted-foreground"
                  multiline
                />
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg gradient-ocean px-8 py-3 text-white hover:opacity-90 transition-opacity"
                >
                  Nous contacter
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
