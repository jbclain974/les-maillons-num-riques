import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users as UsersIcon, 
  FileText, 
  MessageSquare,
  Activity,
  Award,
  ChevronRight,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  is_active_member: boolean;
  membership_start: string | null;
  membership_end: string | null;
  participation_count: number;
  badges: any[];
}

interface UpcomingEvent {
  id: string;
  title: string;
  start_date: string | null;
  location: string | null;
  type: string;
  is_registered?: boolean;
}

interface UpcomingActivity {
  id: string;
  title: string;
  days_of_week: string[] | null;
  start_time: string | null;
  location: string | null;
  is_registered?: boolean;
}

const MemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [activities, setActivities] = useState<UpcomingActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData as UserProfile);

      // Fetch upcoming events
      const { data: events } = await supabase
        .from('events')
        .select('id, title, start_date, location, type')
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true })
        .limit(5);

      // Check registrations
      const { data: eventRegs } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id)
        .eq('status', 'registered');

      const registeredEventIds = eventRegs?.map(r => r.event_id) || [];

      setUpcomingEvents(
        (events || []).map(e => ({
          ...e,
          is_registered: registeredEventIds.includes(e.id)
        }))
      );

      // Fetch activities
      const { data: acts } = await supabase
        .from('activities')
        .select('id, title, days_of_week, start_time, location')
        .eq('is_active', true)
        .order('title');

      // Check activity registrations
      const { data: actRegs } = await supabase
        .from('activity_registrations')
        .select('activity_id')
        .eq('user_id', user.id)
        .eq('status', 'registered');

      const registeredActIds = actRegs?.map(r => r.activity_id) || [];

      setActivities(
        (acts || []).map(a => ({
          ...a,
          is_registered: registeredActIds.includes(a.id)
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleEventRegistration = async (eventId: string, isRegistered: boolean) => {
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
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    }
  };

  const handleActivityRegistration = async (activityId: string, isRegistered: boolean) => {
    if (!user) return;

    try {
      if (isRegistered) {
        await supabase
          .from('activity_registrations')
          .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('activity_id', activityId);

        toast.success("Inscription annulée");
      } else {
        await supabase
          .from('activity_registrations')
          .insert({ user_id: user.id, activity_id: activityId });

        toast.success("Inscription confirmée");
      }
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              Bienvenue, {profile?.full_name || 'Adhérent'} !
            </h1>
            <div className="flex flex-wrap gap-2">
              {profile?.is_active_member ? (
                <Badge className="bg-green-100 text-green-800">Membre actif</Badge>
              ) : (
                <Badge variant="secondary">Membre</Badge>
              )}
              {profile?.participation_count && profile.participation_count > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Activity className="h-3 w-3" />
                  {profile.participation_count} participations
                </Badge>
              )}
            </div>
          </div>
          <Button onClick={() => navigate('/membre/profil')}>
            Modifier mon profil
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">
                    {upcomingEvents.filter(e => e.is_registered).length}
                  </p>
                  <p className="text-sm text-blue-700">Événements inscrits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">
                    {activities.filter(a => a.is_registered).length}
                  </p>
                  <p className="text-sm text-purple-700">Ateliers suivis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Award className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">
                    {profile?.badges?.length || 0}
                  </p>
                  <p className="text-sm text-amber-700">Badges obtenus</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-200 rounded-lg">
                  <UsersIcon className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900">
                    {profile?.participation_count || 0}
                  </p>
                  <p className="text-sm text-green-700">Participations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Prochains événements
                </CardTitle>
                <CardDescription>Inscrivez-vous aux événements à venir</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/membre/evenements')}>
                Voir tout
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucun événement à venir
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                          {event.start_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(event.start_date), 'd MMMM yyyy', { locale: fr })}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={event.is_registered ? "outline" : "default"}
                        onClick={() => handleEventRegistration(event.id, event.is_registered || false)}
                      >
                        {event.is_registered ? "Annuler" : "S'inscrire"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Ateliers disponibles
                </CardTitle>
                <CardDescription>Participez aux activités régulières</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/membre/ateliers')}>
                Voir tout
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucun atelier disponible
                </p>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 5).map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                          {activity.days_of_week && activity.days_of_week.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {activity.days_of_week.join(', ')}
                              {activity.start_time && ` • ${activity.start_time.slice(0, 5)}`}
                            </span>
                          )}
                          {activity.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {activity.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={activity.is_registered ? "outline" : "default"}
                        onClick={() => handleActivityRegistration(activity.id, activity.is_registered || false)}
                      >
                        {activity.is_registered ? "Se désinscrire" : "S'inscrire"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/membre/documents')}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Documents</h3>
                <p className="text-sm text-muted-foreground">Accédez aux ressources</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/membre/communaute')}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Communauté</h3>
                <p className="text-sm text-muted-foreground">Échangez avec les membres</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/membre/annuaire')}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Annuaire</h3>
                <p className="text-sm text-muted-foreground">Retrouvez les adhérents</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MemberDashboard;
