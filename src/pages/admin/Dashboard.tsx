import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { QuickActions } from "@/components/admin/QuickActions";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { ContentStats } from "@/components/admin/ContentStats";
import { MessagesAlert } from "@/components/admin/MessagesAlert";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Newspaper,
  Calendar,
  Activity,
  MessageSquare,
  Mail,
  Users,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  posts: { total: number; published: number; draft: number };
  events: { total: number; published: number; draft: number };
  activities: { total: number; active: number; inactive: number };
  testimonials: number;
  messages: { total: number; new: number };
  users: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    posts: { total: 0, published: 0, draft: 0 },
    events: { total: 0, published: 0, draft: 0 },
    activities: { total: 0, active: 0, inactive: 0 },
    testimonials: 0,
    messages: { total: 0, new: 0 },
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          postsAll,
          postsPublished,
          eventsAll,
          eventsPublished,
          activitiesAll,
          activitiesActive,
          testimonialsCount,
          messagesAll,
          messagesNew,
          usersCount,
        ] = await Promise.all([
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
          supabase.from("events").select("*", { count: "exact", head: true }),
          supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "published"),
          supabase.from("activities").select("*", { count: "exact", head: true }),
          supabase.from("activities").select("*", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("testimonials").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
        ]);

        const postsDraft = (postsAll.count || 0) - (postsPublished.count || 0);
        const eventsDraft = (eventsAll.count || 0) - (eventsPublished.count || 0);
        const activitiesInactive = (activitiesAll.count || 0) - (activitiesActive.count || 0);

        setStats({
          posts: {
            total: postsAll.count || 0,
            published: postsPublished.count || 0,
            draft: postsDraft,
          },
          events: {
            total: eventsAll.count || 0,
            published: eventsPublished.count || 0,
            draft: eventsDraft,
          },
          activities: {
            total: activitiesAll.count || 0,
            active: activitiesActive.count || 0,
            inactive: activitiesInactive,
          },
          testimonials: testimonialsCount.count || 0,
          messages: {
            total: messagesAll.count || 0,
            new: messagesNew.count || 0,
          },
          users: usersCount.count || 0,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-72 bg-muted animate-pulse rounded" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 bg-gradient-to-br from-background via-background to-muted/20 min-h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Bienvenue dans l'administration de Les Maillons de l'Espoir
          </p>
        </div>

        {/* Messages Alert */}
        <div className="mb-6">
          <MessagesAlert newMessages={stats.messages.new} />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatsCard
            title="Actualités"
            value={stats.posts.total}
            icon={<Newspaper className="h-6 w-6" />}
            variant="primary"
            trendLabel={`${stats.posts.published} publiées`}
            onClick={() => navigate("/admin/posts")}
          />
          <StatsCard
            title="Événements"
            value={stats.events.total}
            icon={<Calendar className="h-6 w-6" />}
            variant="secondary"
            trendLabel={`${stats.events.published} publiés`}
            onClick={() => navigate("/admin/events")}
          />
          <StatsCard
            title="Ateliers"
            value={stats.activities.total}
            icon={<Activity className="h-6 w-6" />}
            variant="accent"
            trendLabel={`${stats.activities.active} actifs`}
            onClick={() => navigate("/admin/activities")}
          />
          <StatsCard
            title="Témoignages"
            value={stats.testimonials}
            icon={<MessageSquare className="h-6 w-6" />}
            variant="primary"
            onClick={() => navigate("/admin/testimonials")}
          />
          <StatsCard
            title="Messages"
            value={stats.messages.total}
            icon={<Mail className="h-6 w-6" />}
            variant={stats.messages.new > 0 ? "accent" : "muted"}
            trendLabel={stats.messages.new > 0 ? `${stats.messages.new} nouveau(x)` : "Tous traités"}
            onClick={() => navigate("/admin/messages")}
          />
          <StatsCard
            title="Utilisateurs"
            value={stats.users}
            icon={<Users className="h-6 w-6" />}
            variant="muted"
            onClick={() => navigate("/admin/users")}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <QuickActions />
          <ContentStats
            posts={stats.posts}
            events={stats.events}
            activities={stats.activities}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentActivity />
          
          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Conseils d'optimisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/80">
                <div className="p-2 rounded-full bg-primary/20">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Publiez régulièrement</p>
                  <p className="text-xs text-muted-foreground">
                    Les contenus frais améliorent le référencement
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/80">
                <div className="p-2 rounded-full bg-secondary/20">
                  <MessageSquare className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Ajoutez des témoignages</p>
                  <p className="text-xs text-muted-foreground">
                    Renforcez la confiance des visiteurs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/80">
                <div className="p-2 rounded-full bg-accent/20">
                  <Calendar className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Planifiez vos événements</p>
                  <p className="text-xs text-muted-foreground">
                    Annoncez vos activités à l'avance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
