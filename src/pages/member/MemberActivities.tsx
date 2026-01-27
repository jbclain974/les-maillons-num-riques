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
  Activity, 
  Clock, 
  MapPin, 
  User,
  ArrowLeft,
  Loader2,
  Check,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActivityItem {
  id: string;
  title: string;
  category: string;
  days_of_week: string[] | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  description_short: string | null;
  facilitator: string | null;
  is_registered?: boolean;
}

const MemberActivities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    if (!user) return;

    try {
      const { data: activitiesData, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (error) throw error;

      // Check registrations
      const { data: regs } = await supabase
        .from('activity_registrations')
        .select('activity_id')
        .eq('user_id', user.id)
        .eq('status', 'registered');

      const registeredIds = regs?.map(r => r.activity_id) || [];

      setActivities(
        (activitiesData || []).map(a => ({
          ...a,
          is_registered: registeredIds.includes(a.id)
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (activityId: string, isRegistered: boolean) => {
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
      fetchActivities();
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    }
  };

  const myActivities = activities.filter(a => a.is_registered);
  const availableActivities = activities.filter(a => !a.is_registered);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      sport: 'Sport',
      art: 'Art & Création',
      bien_etre: 'Bien-être',
      social: 'Social',
      formation: 'Formation',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      sport: 'bg-green-100 text-green-800',
      art: 'bg-purple-100 text-purple-800',
      bien_etre: 'bg-blue-100 text-blue-800',
      social: 'bg-amber-100 text-amber-800',
      formation: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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

  const ActivityCard = ({ activity }: { activity: ActivityItem }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className={getCategoryColor(activity.category)}>
            {getCategoryLabel(activity.category)}
          </Badge>
          {activity.is_registered && (
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Inscrit
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-2">{activity.title}</CardTitle>
        {activity.description_short && (
          <CardDescription>{activity.description_short}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          {activity.days_of_week && activity.days_of_week.length > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {activity.days_of_week.join(', ')}
              {activity.start_time && (
                <span>• {activity.start_time.slice(0, 5)}</span>
              )}
              {activity.end_time && (
                <span>- {activity.end_time.slice(0, 5)}</span>
              )}
            </div>
          )}
          {activity.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {activity.location}
            </div>
          )}
          {activity.facilitator && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Animé par {activity.facilitator}
            </div>
          )}
        </div>
        <Button
          className="w-full"
          variant={activity.is_registered ? "outline" : "default"}
          onClick={() => handleRegistration(activity.id, activity.is_registered || false)}
        >
          {activity.is_registered ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Se désinscrire
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
            <Activity className="h-8 w-8 text-primary" />
            Ateliers & Activités
          </h1>
          <p className="text-muted-foreground mt-1">
            Participez aux ateliers réguliers de l'association
          </p>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              Tous les ateliers ({activities.length})
            </TabsTrigger>
            <TabsTrigger value="registered">
              Mes inscriptions ({myActivities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {activities.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Aucun atelier disponible</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activities.map(activity => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="registered">
            {myActivities.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Aucune inscription</p>
                  <p className="text-muted-foreground">Inscrivez-vous aux ateliers qui vous intéressent</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myActivities.map(activity => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MemberActivities;
