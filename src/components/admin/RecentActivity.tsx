import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Newspaper,
  Calendar,
  Activity,
  MessageSquare,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ActivityItem {
  id: string;
  type: "post" | "event" | "activity" | "testimonial" | "message";
  title: string;
  status?: string;
  created_at: string;
}

const typeConfig = {
  post: {
    icon: Newspaper,
    label: "Actualité",
    color: "text-primary",
    bgColor: "bg-primary/10",
    href: "/admin/posts",
  },
  event: {
    icon: Calendar,
    label: "Événement",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    href: "/admin/events",
  },
  activity: {
    icon: Activity,
    label: "Atelier",
    color: "text-accent",
    bgColor: "bg-accent/10",
    href: "/admin/activities",
  },
  testimonial: {
    icon: MessageSquare,
    label: "Témoignage",
    color: "text-primary",
    bgColor: "bg-primary/10",
    href: "/admin/testimonials",
  },
  message: {
    icon: Mail,
    label: "Message",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    href: "/admin/messages",
  },
};

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const [postsRes, eventsRes, activitiesRes, testimonialsRes, messagesRes] =
          await Promise.all([
            supabase
              .from("posts")
              .select("id, title, status, created_at")
              .order("created_at", { ascending: false })
              .limit(3),
            supabase
              .from("events")
              .select("id, title, status, created_at")
              .order("created_at", { ascending: false })
              .limit(3),
            supabase
              .from("activities")
              .select("id, title, is_active, created_at")
              .order("created_at", { ascending: false })
              .limit(3),
            supabase
              .from("testimonials")
              .select("id, display_name, created_at")
              .order("created_at", { ascending: false })
              .limit(3),
            supabase
              .from("contact_messages")
              .select("id, name, subject, status, created_at")
              .order("created_at", { ascending: false })
              .limit(3),
          ]);

        const allActivities: ActivityItem[] = [
          ...(postsRes.data?.map((p) => ({
            id: p.id,
            type: "post" as const,
            title: p.title,
            status: p.status,
            created_at: p.created_at,
          })) || []),
          ...(eventsRes.data?.map((e) => ({
            id: e.id,
            type: "event" as const,
            title: e.title,
            status: e.status,
            created_at: e.created_at,
          })) || []),
          ...(activitiesRes.data?.map((a) => ({
            id: a.id,
            type: "activity" as const,
            title: a.title,
            status: a.is_active ? "active" : "inactive",
            created_at: a.created_at,
          })) || []),
          ...(testimonialsRes.data?.map((t) => ({
            id: t.id,
            type: "testimonial" as const,
            title: `Témoignage de ${t.display_name}`,
            created_at: t.created_at,
          })) || []),
          ...(messagesRes.data?.map((m) => ({
            id: m.id,
            type: "message" as const,
            title: `${m.name}: ${m.subject}`,
            status: m.status,
            created_at: m.created_at,
          })) || []),
        ];

        // Sort by date and take top 8
        allActivities.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setActivities(allActivities.slice(0, 8));
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      published: { label: "Publié", variant: "default" },
      draft: { label: "Brouillon", variant: "secondary" },
      new: { label: "Nouveau", variant: "destructive" },
      read: { label: "Lu", variant: "outline" },
      active: { label: "Actif", variant: "default" },
      inactive: { label: "Inactif", variant: "secondary" },
    };

    const config = statusConfig[status];
    if (!config) return null;

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.map((activity) => {
            const config = typeConfig[activity.type];
            const Icon = config.icon;

            return (
              <button
                key={`${activity.type}-${activity.id}`}
                onClick={() => navigate(config.href)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(activity.status)}
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
