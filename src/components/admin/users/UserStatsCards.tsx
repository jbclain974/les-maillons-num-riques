import { Card, CardContent } from "@/components/ui/card";
import { Crown, PenLine, Sparkles, Eye, UserCheck, UserX } from "lucide-react";

type AppRole = "admin" | "editor" | "animator" | "viewer";

interface RoleConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
  description: string;
}

export const roleConfig: Record<AppRole, RoleConfig> = {
  admin: {
    label: "Administrateur",
    color: "text-red-700",
    bgColor: "bg-red-100 border-red-200",
    icon: Crown,
    description: "Accès complet à toutes les fonctionnalités",
  },
  editor: {
    label: "Éditeur",
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
    icon: PenLine,
    description: "Gestion des contenus (actualités, événements, ateliers, témoignages)",
  },
  animator: {
    label: "Animateur",
    color: "text-secondary",
    bgColor: "bg-secondary/10 border-secondary/20",
    icon: Sparkles,
    description: "Gestion des ateliers et événements uniquement",
  },
  viewer: {
    label: "Lecteur",
    color: "text-muted-foreground",
    bgColor: "bg-muted border-muted-foreground/20",
    icon: Eye,
    description: "Consultation uniquement, sans modification",
  },
};

interface UserStatsCardsProps {
  roleStats: Record<AppRole, number>;
  activeCount: number;
  inactiveCount: number;
  filterRole: string;
  filterStatus: string;
  onFilterRole: (role: string) => void;
  onFilterStatus: (status: string) => void;
}

export const UserStatsCards = ({
  roleStats,
  activeCount,
  inactiveCount,
  filterRole,
  filterStatus,
  onFilterRole,
  onFilterStatus,
}: UserStatsCardsProps) => {
  return (
    <div className="space-y-4">
      {/* Role Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.entries(roleConfig) as [AppRole, RoleConfig][]).map(([role, config]) => {
          const Icon = config.icon;
          return (
            <Card
              key={role}
              className={`cursor-pointer transition-all hover:scale-105 ${
                filterRole === role ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onFilterRole(filterRole === role ? "all" : role)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{roleStats[role]}</p>
                  <p className="text-xs text-muted-foreground">{config.label}s</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:scale-105 ${
            filterStatus === "active" ? "ring-2 ring-green-500" : ""
          }`}
          onClick={() => onFilterStatus(filterStatus === "active" ? "all" : "active")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 border-green-200">
              <UserCheck className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Comptes actifs</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:scale-105 ${
            filterStatus === "inactive" ? "ring-2 ring-orange-500" : ""
          }`}
          onClick={() => onFilterStatus(filterStatus === "inactive" ? "all" : "inactive")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 border-orange-200">
              <UserX className="h-5 w-5 text-orange-700" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inactiveCount}</p>
              <p className="text-xs text-muted-foreground">Comptes inactifs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
