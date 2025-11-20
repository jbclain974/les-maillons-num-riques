import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  display_name: string;
  content: string;
  type: string | null;
  is_featured: boolean;
}

const Temoignages = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des témoignages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Témoignages</h1>
            <p className="text-xl text-muted-foreground">
              Des parcours de vie, des réussites, de l'espoir. 
              Ils ont franchi le pas et témoignent de leur reconstruction.
            </p>
          </div>
        </div>
      </section>

      {/* Témoignages en avant */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun témoignage pour le moment</p>
            </div>
          ) : (
            <>
              {/* Témoignages featured */}
              <div className="max-w-5xl mx-auto mb-16">
                <h2 className="text-center mb-12">Témoignages Marquants</h2>
                <div className="grid gap-8 md:grid-cols-2">
                  {testimonials
                    .filter((t) => t.is_featured)
                    .map((testimonial) => (
                      <Card key={testimonial.id} className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
                        <CardContent className="p-8">
                          <Quote className="h-12 w-12 text-primary/30 mb-4" />
                          <p className="text-lg mb-6 italic">"{testimonial.content}"</p>
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-primary">
                              — {testimonial.display_name}
                            </div>
                            {testimonial.type && (
                              <div className="text-sm text-muted-foreground capitalize">
                                {testimonial.type.replace("_", " ")}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Autres témoignages */}
              {testimonials.filter((t) => !t.is_featured).length > 0 && (
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-center mb-12">Autres Témoignages</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials
                      .filter((t) => !t.is_featured)
                      .map((testimonial) => (
                        <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <Quote className="h-8 w-8 text-primary/20 mb-3" />
                            <p className="text-sm mb-4 italic line-clamp-6">
                              "{testimonial.content}"
                            </p>
                            <div className="text-sm font-semibold text-primary">
                              — {testimonial.display_name}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2>Vous Aussi, Écrivez Votre Histoire</h2>
            <p className="text-lg text-muted-foreground">
              Si vous souhaitez partager votre témoignage et inspirer d'autres personnes, 
              n'hésitez pas à nous contacter. Votre histoire peut aider quelqu'un à franchir le pas.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg gradient-ocean px-8 py-3 text-white hover:opacity-90 transition-opacity"
            >
              Partager mon témoignage
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Temoignages;
