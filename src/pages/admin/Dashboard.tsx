import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { QuickActions } from "@/components/admin/QuickActions";
import { ContentStats } from "@/components/admin/ContentStats";
import { MessagesAlert } from "@/components/admin/MessagesAlert";
import { AuditLogsWidget } from "@/components/admin/AuditLogsWidget";
import { QuickLinksGrid } from "@/components/admin/QuickLinksGrid";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Calendar,
  Activity,
  MessageSquare,
  Mail,
  Users,
  TrendingUp,
  Eye,
  FileText,
  Settings,
  Menu,
  Home,
  Boxes,
  Shield,
  Image,
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
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    posts: { total: 0, published: 0, draft: 0 },
    events: { total: 0, published: 0, draft: 0 },
    activities: { total: 0, active: 0, inactive: 0 },
    testimonials: 0,
    messages: { total: 0, new: 0 },
    users: 0,
  });
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .maybeSingle();
          setProfile(profileData);
        }

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

    fetchData();
  }, [user]);

  const quickLinks = [
    {
      title: "Navigation",
      description: "Gérer les menus du site",
      icon: <Menu className="h-6 w-6 text-blue-600" />,
      href: "/admin/navigation",
      colorClass: "bg-blue-100",
    },
    {
      title: "Page d'accueil",
      description: "Textes, stats et image hero",
      icon: <Home className="h-6 w-6 text-purple-600" />,
      href: "/admin/homepage",
      colorClass: "bg-purple-100",
    },
    {
      title: "Nos Actions",
      description: "Vignettes de la page d'accueil",
      icon: <Boxes className="h-6 w-6 text-amber-600" />,
      href: "/admin/actions",
      colorClass: "bg-amber-100",
    },
    {
      title: "Utilisateurs",
      description: "Rôles et permissions",
      icon: <Users className="h-6 w-6 text-green-600" />,
      href: "/admin/users",
      colorClass: "bg-green-100",
    },
    {
      title: "Médias",
      description: "Images et fichiers",
      icon: <Image className="h-6 w-6 text-pink-600" />,
      href: "/admin/media",
      colorClass: "bg-pink-100",
    },
    {
      title: "Paramètres",
      description: "Configuration du site",
      icon: <Settings className="h-6 w-6 text-slate-600" />,
      href: "/admin/settings",
      colorClass: "bg-slate-100",
    },
  ];

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
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-secondary text-white">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bienvenue, {profile?.full_name || "Administrateur"} !
            </h1>
            <p className="text-muted-foreground">
              Administration de Les Maillons de l'Espoir
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0">
            <Shield className="h-3 w-3 mr-1" />
            Administrateur
          </Badge>
        </div>

        {/* Messages Alert */}
        <div className="mb-6">
          <MessagesAlert newMessages={stats.messages.new} />
        </div>

        {/* Stats Grid - Same style as member area */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/posts")}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Newspaper className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{stats.posts.total}</p>
                  <p className="text-sm text-blue-700">Actualités ({stats.posts.published} publiées)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/events")}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">{stats.events.total}</p>
                  <p className="text-sm text-purple-700">Événements ({stats.events.published} publiés)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/activities")}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Activity className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">{stats.activities.total}</p>
                  <p className="text-sm text-amber-700">Ateliers ({stats.activities.active} actifs)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/testimonials")}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-200 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900">{stats.testimonials}</p>
                  <p className="text-sm text-green-700">Témoignages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${stats.messages.new > 0 ? 'from-red-50 to-red-100 border-red-200' : 'from-slate-50 to-slate-100 border-slate-200'} cursor-pointer hover:shadow-lg transition-shadow`} onClick={() => navigate("/admin/messages")}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stats.messages.new > 0 ? 'bg-red-200' : 'bg-slate-200'}`}>
                  <Mail className={`h-5 w-5 ${stats.messages.new > 0 ? 'text-red-700' : 'text-slate-700'}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${stats.messages.new > 0 ? 'text-red-900' : 'text-slate-900'}`}>{stats.messages.total}</p>
                  <p className={`text-sm ${stats.messages.new > 0 ? 'text-red-700' : 'text-slate-700'}`}>
                    Messages {stats.messages.new > 0 && `(${stats.messages.new} nouveau${stats.messages.new > 1 ? 'x' : ''})`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/users")}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-200 rounded-lg">
                  <Users className="h-5 w-5 text-cyan-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-900">{stats.users}</p>
                  <p className="text-sm text-cyan-700">Utilisateurs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Accès rapide
          </h2>
          <QuickLinksGrid links={quickLinks} />
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

        {/* Audit Logs & Tips */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AuditLogsWidget />
          
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
