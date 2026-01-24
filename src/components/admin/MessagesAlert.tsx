import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle, ArrowRight } from "lucide-react";

interface MessagesAlertProps {
  newMessages: number;
}

export function MessagesAlert({ newMessages }: MessagesAlertProps) {
  const navigate = useNavigate();

  if (newMessages === 0) {
    return (
      <Card className="bg-secondary/5 border-secondary/20">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="p-3 rounded-full bg-secondary/20">
            <Mail className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-secondary">Aucun nouveau message</p>
            <p className="text-sm text-muted-foreground">
              Tous les messages ont été traités
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 animate-pulse">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="p-3 rounded-full bg-accent/20 relative">
          <Mail className="h-5 w-5 text-accent" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
            {newMessages > 9 ? "9+" : newMessages}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-accent-foreground">
            {newMessages} nouveau{newMessages > 1 ? "x" : ""} message{newMessages > 1 ? "s" : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            {newMessages > 1 ? "Nécessitent" : "Nécessite"} votre attention
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-accent/50 text-accent hover:bg-accent/10"
          onClick={() => navigate("/admin/messages")}
        >
          Voir
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
