import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Newspaper,
  Calendar,
  Activity,
  MessageSquare,
  Users,
  ArrowRight,
  Zap,
} from "lucide-react";

const actions = [
  {
    label: "Nouvelle actualité",
    description: "Créer un article",
    icon: Newspaper,
    href: "/admin/posts/new",
    color: "text-primary",
    bgColor: "bg-primary/10 hover:bg-primary/20",
  },
  {
    label: "Nouvel événement",
    description: "Ajouter un projet",
    icon: Calendar,
    href: "/admin/events/new",
    color: "text-secondary",
    bgColor: "bg-secondary/10 hover:bg-secondary/20",
  },
  {
    label: "Nouvel atelier",
    description: "Planifier une activité",
    icon: Activity,
    href: "/admin/activities/new",
    color: "text-accent",
    bgColor: "bg-accent/10 hover:bg-accent/20",
  },
  {
    label: "Nouveau témoignage",
    description: "Ajouter un témoignage",
    icon: MessageSquare,
    href: "/admin/testimonials/new",
    color: "text-primary",
    bgColor: "bg-primary/10 hover:bg-primary/20",
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-accent" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.href}
              variant="ghost"
              className={`h-auto flex-col items-start p-4 ${action.bgColor} transition-all duration-200`}
              onClick={() => navigate(action.href)}
            >
              <div className="flex items-center gap-2 mb-1">
                <action.icon className={`h-4 w-4 ${action.color}`} />
                <span className="font-medium text-foreground">{action.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
