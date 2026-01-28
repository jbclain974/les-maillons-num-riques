import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  History, 
  User, 
  FileText, 
  Calendar, 
  Activity as ActivityIcon,
  Settings,
  ChevronRight,
  Clock
} from "lucide-react";
import { useAuditLogs } from "@/hooks/useAdminAnalytics";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const entityIcons: Record<string, React.ElementType> = {
  post: FileText,
  event: Calendar,
  activity: ActivityIcon,
  user: User,
  settings: Settings,
};

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-800 border-green-200",
  update: "bg-blue-100 text-blue-800 border-blue-200",
  delete: "bg-red-100 text-red-800 border-red-200",
  publish: "bg-purple-100 text-purple-800 border-purple-200",
  login: "bg-amber-100 text-amber-800 border-amber-200",
};

export function AuditLogsWidget() {
  const navigate = useNavigate();
  const { data: logs, isLoading } = useAuditLogs(10);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" />
            Traçabilité
          </CardTitle>
          <CardDescription>Dernières actions administratives</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/audit")}>
          Voir tout
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : logs?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucune activité récente</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {logs?.map((log) => {
                const Icon = entityIcons[log.entity_type] || Settings;
                const actionColor = actionColors[log.action] || "bg-gray-100 text-gray-800";
                
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`text-xs ${actionColor}`}>
                          {log.action}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {log.entity_type}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        {log.user_name || log.user_email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "d MMM à HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
