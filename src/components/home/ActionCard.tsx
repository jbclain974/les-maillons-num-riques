import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Palette,
  Wrench,
  Music,
  Bike,
  Building2,
  Users,
  Heart,
  Star,
  Calendar,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  MessageCircle,
  Palette,
  Wrench,
  Music,
  Bike,
  Building2,
  Users,
  Heart,
  Star,
  Calendar,
};

const colorMap: Record<string, { text: string; bg: string }> = {
  primary: { text: "text-primary", bg: "bg-primary/10" },
  secondary: { text: "text-secondary", bg: "bg-secondary/10" },
  accent: { text: "text-accent", bg: "bg-accent/10" },
};

interface ActionCardProps {
  title: string;
  description: string | null;
  icon: string;
  colorClass: string;
  linkAnchor: string | null;
}

const ActionCard = ({ title, description, icon, colorClass, linkAnchor }: ActionCardProps) => {
  const IconComponent = iconMap[icon] || MessageCircle;
  const colors = colorMap[colorClass] || colorMap.primary;

  const cardContent = (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
      <CardContent className="p-6 space-y-4">
        <div
          className={cn(
            colors.bg,
            "w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
          )}
        >
          <IconComponent className={cn("h-6 w-6", colors.text)} />
        </div>
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );

  if (linkAnchor) {
    return (
      <Link to={`/nos-actions#${linkAnchor}`} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default ActionCard;
