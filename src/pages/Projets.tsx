import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, MapPin } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import EditablePageText from "@/components/editable/EditablePageText";

interface Event {
  id: string;
  title: string;
  slug: string;
  type: string;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  short_description: string | null;
  cover_image: string | null;
}

const typeLabels: { [key: string]: string } = {
  caravane_velo: "Caravane Vélo",
  grand_raid: "Grand Raid",
  diner: "Dîner Dansant",
  loto: "Loto Quine",
  autre: "Autre",
};

const Projets = () => {
  const { getContent, updateContent } = usePageContent("projets");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .order("start_date", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
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
            <EditablePageText
              value={getContent("hero_title", "Projets & Événements")}
              onSave={(v) => updateContent("hero_title", v)}
              as="h1"
              className="mb-6"
            />
            <EditablePageText
              value={getContent(
                "hero_subtitle",
                "Découvrez nos événements phares : Caravane Vélo, Grand Raid, et toutes nos actions de prévention"
              )}
              onSave={(v) => updateContent("hero_subtitle", v)}
              as="p"
              className="text-xl text-muted-foreground"
              multiline
            />
          </div>
        </div>
      </section>

      {/* Liste des événements */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun événement pour le moment</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    {/* Image placeholder */}
                    {event.cover_image ? (
                      <img
                        src={event.cover_image}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-t-lg" />
                    )}
                    
                    <div className="p-6 space-y-3">
                      <Badge variant="secondary">{typeLabels[event.type] || event.type}</Badge>
                      
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      
                      {event.short_description && (
                        <p className="text-muted-foreground line-clamp-3">
                          {event.short_description}
                        </p>
                      )}
                      
                      <div className="space-y-2 pt-2">
                        {event.start_date && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            {event.end_date && event.start_date !== event.end_date ? (
                              <span>
                                Du {format(new Date(event.start_date), "d MMM", { locale: fr })} au{" "}
                                {format(new Date(event.end_date), "d MMMM yyyy", { locale: fr })}
                              </span>
                            ) : (
                              <span>
                                {format(new Date(event.start_date), "d MMMM yyyy", { locale: fr })}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Événements phares */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <EditablePageText
              value={getContent("phares_title", "Nos Événements Phares")}
              onSave={(v) => updateContent("phares_title", v)}
              as="h2"
            />
            
            <div className="grid gap-6 md:grid-cols-2 text-left">
              <Card>
                <CardContent className="p-6">
                  <EditablePageText
                    value={getContent("phare1_title", "Caravane Vélo")}
                    onSave={(v) => updateContent("phare1_title", v)}
                    as="h3"
                    className="text-xl font-bold mb-3"
                  />
                  <EditablePageText
                    value={getContent(
                      "phare1_desc",
                      "Notre événement majeur de prévention : un tour complet de l'île à vélo pour sensibiliser contre l'alcool et les drogues. Une semaine d'actions, de rencontres et de solidarité."
                    )}
                    onSave={(v) => updateContent("phare1_desc", v)}
                    as="p"
                    className="text-muted-foreground"
                    multiline
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <EditablePageText
                    value={getContent("phare2_title", "Grand Raid & Joëlettes")}
                    onSave={(v) => updateContent("phare2_title", v)}
                    as="h3"
                    className="text-xl font-bold mb-3"
                  />
                  <EditablePageText
                    value={getContent(
                      "phare2_desc",
                      "Nous préparons nos adhérents au Grand Raid et permettons à des personnes en situation de handicap de vivre cette aventure exceptionnelle grâce aux joëlettes."
                    )}
                    onSave={(v) => updateContent("phare2_desc", v)}
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
    </Layout>
  );
};

export default Projets;
