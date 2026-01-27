import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { 
  Calendar, 
  Clock, 
  MapPin,
  ArrowLeft,
  Loader2,
  Check,
  X
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  type: string;
  short_description: string | null;
  is_registered?: boolean;
}

const MemberEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('id, title, start_date, end_date, location, type, short_description')
        .eq('status', 'published')
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Check registrations
      const { data: regs } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id)
        .eq('status', 'registered');

      const registeredIds = regs?.map(r => r.event_id) || [];

      setEvents(
        (eventsData || []).map(e => ({
          ...e,
          is_registered: registeredIds.includes(e.id)
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (eventId: string, isRegistered: boolean) => {
    if (!user) return;

    try {
      if (isRegistered) {
        await supabase
          .from('event_registrations')
          .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('event_id', eventId);

        toast.success("Inscription annulée");
      } else {
        await supabase
          .from('event_registrations')
          .insert({ user_id: user.id, event_id: eventId });

        toast.success("Inscription confirmée");
      }
      fetchEvents();
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    }
  };

  const now = new Date();
  const upcomingEvents = events.filter(e => !e.start_date || new Date(e.start_date) >= now);
  const pastEvents = events.filter(e => e.start_date && new Date(e.start_date) < now);
  const myEvents = events.filter(e => e.is_registered);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge variant="secondary">{event.type}</Badge>
          {event.is_registered && (
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Inscrit
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-2">{event.title}</CardTitle>
        {event.short_description && (
          <CardDescription>{event.short_description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          {event.start_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.start_date), 'd MMMM yyyy', { locale: fr })}
              {event.end_date && event.end_date !== event.start_date && (
                <span>→ {format(new Date(event.end_date), 'd MMMM yyyy', { locale: fr })}</span>
              )}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          )}
        </div>
        <Button
          className="w-full"
          variant={event.is_registered ? "outline" : "default"}
          onClick={() => handleRegistration(event.id, event.is_registered || false)}
        >
          {event.is_registered ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Annuler l'inscription
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              S'inscrire
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container py-12">
        <Button variant="ghost" onClick={() => navigate('/membre')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Événements
          </h1>
          <p className="text-muted-foreground mt-1">
            Découvrez et inscrivez-vous aux événements de l'association
          </p>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              À venir ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="registered">
              Mes inscriptions ({myEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Passés ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Aucun événement à venir</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="registered">
            {myEvents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Aucune inscription</p>
                  <p className="text-muted-foreground">Inscrivez-vous aux événements à venir</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastEvents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Aucun événement passé</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MemberEvents;
