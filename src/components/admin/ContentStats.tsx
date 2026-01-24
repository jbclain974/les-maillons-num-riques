import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, FileText, CheckCircle, Clock, Archive } from "lucide-react";

interface ContentStatsProps {
  posts: { total: number; published: number; draft: number };
  events: { total: number; published: number; draft: number };
  activities: { total: number; active: number; inactive: number };
}

export function ContentStats({ posts, events, activities }: ContentStatsProps) {
  const getPublishedPercentage = (published: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((published / total) * 100);
  };

  const stats = [
    {
      name: "Actualités",
      total: posts.total,
      published: posts.published,
      draft: posts.draft,
      color: "bg-primary",
      percentage: getPublishedPercentage(posts.published, posts.total),
    },
    {
      name: "Événements",
      total: events.total,
      published: events.published,
      draft: events.draft,
      color: "bg-secondary",
      percentage: getPublishedPercentage(events.published, events.total),
    },
    {
      name: "Ateliers",
      total: activities.total,
      published: activities.active,
      draft: activities.inactive,
      color: "bg-accent",
      percentage: getPublishedPercentage(activities.active, activities.total),
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          État des contenus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((stat) => (
          <div key={stat.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{stat.name}</span>
              <span className="text-muted-foreground">
                {stat.published}/{stat.total} publiés
              </span>
            </div>
            <Progress value={stat.percentage} className="h-2" />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-secondary" />
                {stat.published} publiés
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-accent" />
                {stat.draft} brouillons
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
