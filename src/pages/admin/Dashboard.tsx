import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Calendar, Activity, MessageSquare, Mail, Users } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    posts: 0,
    events: 0,
    activities: 0,
    testimonials: 0,
    messages: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsCount, eventsCount, activitiesCount, testimonialsCount, messagesCount, usersCount] = 
          await Promise.all([
            supabase.from("posts").select("*", { count: "exact", head: true }),
            supabase.from("events").select("*", { count: "exact", head: true }),
            supabase.from("activities").select("*", { count: "exact", head: true }),
            supabase.from("testimonials").select("*", { count: "exact", head: true }),
            supabase.from("contact_messages").select("*", { count: "exact", head: true }),
            supabase.from("profiles").select("*", { count: "exact", head: true }),
          ]);

        setStats({
          posts: postsCount.count || 0,
          events: eventsCount.count || 0,
          activities: activitiesCount.count || 0,
          testimonials: testimonialsCount.count || 0,
          messages: messagesCount.count || 0,
          users: usersCount.count || 0,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Actualités",
      value: stats.posts,
      icon: Newspaper,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Événements",
      value: stats.events,
      icon: Calendar,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Ateliers",
      value: stats.activities,
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Témoignages",
      value: stats.testimonials,
      icon: MessageSquare,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: Mail,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Utilisateurs",
      value: stats.users,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de l'administration
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vous êtes connecté au backoffice de Les Maillons de l'Espoir.
                Utilisez le menu latéral pour gérer les contenus du site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/admin/posts"
                className="block p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="font-medium">Créer une actualité</div>
                <div className="text-sm text-muted-foreground">
                  Publiez une nouvelle actualité
                </div>
              </a>
              <a
                href="/admin/events"
                className="block p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="font-medium">Ajouter un événement</div>
                <div className="text-sm text-muted-foreground">
                  Créez un nouveau projet ou événement
                </div>
              </a>
              <a
                href="/admin/messages"
                className="block p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="font-medium">Voir les messages</div>
                <div className="text-sm text-muted-foreground">
                  Consultez les messages de contact
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
