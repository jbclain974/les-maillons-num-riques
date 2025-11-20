import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, Phone, MessageSquare, Check, Eye } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status: status as any })
        .eq("id", id);

      if (error) throw error;

      toast.success("Statut mis à jour");
      fetchMessages();
    } catch (error: any) {
      toast.error("Erreur");
      console.error(error);
    }
  };

  const saveNotes = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ notes })
        .eq("id", id);

      if (error) throw error;

      toast.success("Notes enregistrées");
      setSelectedMessage(null);
      fetchMessages();
    } catch (error: any) {
      toast.error("Erreur");
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      new: "bg-blue-100 text-blue-800",
      read: "bg-yellow-100 text-yellow-800",
      processed: "bg-green-100 text-green-800",
    };
    const labels = {
      new: "Nouveau",
      read: "Lu",
      processed: "Traité",
    };
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const subjectLabels: { [key: string]: string } = {
    besoin_aide: "Besoin d'aide",
    info: "Information",
    adhesion: "Adhésion",
    benevolat: "Bénévolat",
    partenariat: "Partenariat",
    autre: "Autre",
    don: "Don",
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages de Contact</h1>
          <p className="text-muted-foreground">
            Consultez et traitez les messages reçus via le formulaire de contact
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Aucun message pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <Card key={msg.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{msg.name}</h3>
                        {getStatusBadge(msg.status)}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${msg.email}`} className="text-primary hover:underline">
                            {msg.email}
                          </a>
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${msg.phone}`} className="text-primary hover:underline">
                              {msg.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium">{subjectLabels[msg.subject] || msg.subject}</span>
                        </div>
                        <div className="text-xs">
                          Reçu le {format(new Date(msg.created_at), "d MMMM yyyy à HH:mm", { locale: fr })}
                        </div>
                      </div>
                    </div>

                    <Select
                      value={msg.status}
                      onValueChange={(value) => updateStatus(msg.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Nouveau</SelectItem>
                        <SelectItem value="read">Lu</SelectItem>
                        <SelectItem value="processed">Traité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>

                  {selectedMessage?.id === msg.id ? (
                    <div className="space-y-3 border-t pt-4">
                      <Label>Notes internes</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ajoutez des notes sur ce message..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveNotes(msg.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Enregistrer
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelectedMessage(null)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {msg.notes && (
                        <div className="border-t pt-4 mb-2">
                          <p className="text-sm font-medium mb-1">Notes :</p>
                          <p className="text-sm text-muted-foreground">{msg.notes}</p>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMessage(msg);
                          setNotes(msg.notes || "");
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {msg.notes ? "Modifier les notes" : "Ajouter des notes"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Messages;
