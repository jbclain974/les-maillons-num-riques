import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  variant?: "primary" | "secondary" | "accent" | "muted";
  onClick?: () => void;
}

const variantStyles = {
  primary: {
    card: "border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15",
    icon: "bg-primary/20 text-primary",
    value: "text-primary",
  },
  secondary: {
    card: "border-l-4 border-l-secondary bg-gradient-to-br from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/15",
    icon: "bg-secondary/20 text-secondary",
    value: "text-secondary",
  },
  accent: {
    card: "border-l-4 border-l-accent bg-gradient-to-br from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/15",
    icon: "bg-accent/20 text-accent",
    value: "text-accent",
  },
  muted: {
    card: "border-l-4 border-l-muted-foreground/30 bg-gradient-to-br from-muted/50 to-muted hover:from-muted hover:to-muted/80",
    icon: "bg-muted-foreground/20 text-muted-foreground",
    value: "text-foreground",
  },
};

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  variant = "primary",
  onClick,
}: StatsCardProps) {
  const styles = variantStyles[variant];

  const getTrendIcon = () => {
    if (trend === undefined || trend === 0) return <Minus className="h-3 w-3" />;
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-secondary" />;
    return <TrendingDown className="h-3 w-3 text-destructive" />;
  };

  const getTrendColor = () => {
    if (trend === undefined || trend === 0) return "text-muted-foreground";
    if (trend > 0) return "text-secondary";
    return "text-destructive";
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 cursor-pointer",
        styles.card,
        onClick && "hover:shadow-lg hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-3xl font-bold tracking-tight", styles.value)}>
              {value}
            </p>
            {(trend !== undefined || trendLabel) && (
              <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
                {getTrendIcon()}
                <span>
                  {trend !== undefined && trend !== 0 && (
                    <span className="font-medium">{trend > 0 ? "+" : ""}{trend}%</span>
                  )}
                  {trendLabel && <span className="ml-1">{trendLabel}</span>}
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", styles.icon)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
