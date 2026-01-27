import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Clock, 
  FileText, 
  Calendar, 
  Eye, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Loader2 
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PendingContent {
  id: string;
  title: string;
  type: 'post' | 'event';
  validation_status: string;
  submitted_at: string | null;
  submitted_by: string | null;
  submitter_name?: string;
}

const ValidationQueue = () => {
  const [pendingEditor, setPendingEditor] = useState<PendingContent[]>([]);
  const [pendingAdmin, setPendingAdmin] = useState<PendingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isEditor } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const fetchPendingContent = async () => {
    try {
      // Fetch posts pending validation
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id, 
          title, 
          validation_status, 
          submitted_at, 
          submitted_by,
          profiles:submitted_by (full_name)
        `)
        .in('validation_status', ['pending_editor', 'pending_admin'])
        .order('submitted_at', { ascending: true });

      if (postsError) throw postsError;

      // Fetch events pending validation
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          id, 
          title, 
          validation_status, 
          submitted_at, 
          submitted_by,
          profiles:submitted_by (full_name)
        `)
        .in('validation_status', ['pending_editor', 'pending_admin'])
        .order('submitted_at', { ascending: true });

      if (eventsError) throw eventsError;

      // Combine and categorize
      const allContent: PendingContent[] = [
        ...(posts || []).map(p => ({
          id: p.id,
          title: p.title,
          type: 'post' as const,
          validation_status: p.validation_status,
          submitted_at: p.submitted_at,
          submitted_by: p.submitted_by,
          submitter_name: (p.profiles as any)?.full_name || 'Inconnu'
        })),
        ...(events || []).map(e => ({
          id: e.id,
          title: e.title,
          type: 'event' as const,
          validation_status: e.validation_status,
          submitted_at: e.submitted_at,
          submitted_by: e.submitted_by,
          submitter_name: (e.profiles as any)?.full_name || 'Inconnu'
        })),
      ];

      setPendingEditor(allContent.filter(c => c.validation_status === 'pending_editor'));
      setPendingAdmin(allContent.filter(c => c.validation_status === 'pending_admin'));
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item: PendingContent) => {
    if (item.type === 'post') {
      navigate(`/admin/posts/${item.id}`);
    } else {
      navigate(`/admin/events/${item.id}`);
    }
  };

  const ContentCard = ({ item }: { item: PendingContent }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {item.type === 'post' ? (
                <FileText className="h-4 w-4 text-blue-500" />
              ) : (
                <Calendar className="h-4 w-4 text-purple-500" />
              )}
              <Badge variant="outline">
                {item.type === 'post' ? 'Actualité' : 'Événement'}
              </Badge>
            </div>
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <div className="text-sm text-muted-foreground">
              Soumis par <span className="font-medium">{item.submitter_name}</span>
              {item.submitted_at && (
                <span> • {format(new Date(item.submitted_at), 'd MMM yyyy à HH:mm', { locale: fr })}</span>
              )}
            </div>
          </div>
          <Button size="sm" onClick={() => handleView(item)}>
            <Eye className="mr-2 h-4 w-4" />
            Examiner
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const showEditorQueue = isEditor || isAdmin;
  const showAdminQueue = isAdmin;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            File de validation
          </h1>
          <p className="text-muted-foreground mt-1">
            Contenus en attente de validation
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">{pendingEditor.length}</p>
                  <p className="text-sm text-amber-700">En attente éditeur</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{pendingAdmin.length}</p>
                  <p className="text-sm text-blue-700">En attente admin</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900">{pendingEditor.length + pendingAdmin.length}</p>
                  <p className="text-sm text-green-700">Total en attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={showAdminQueue ? "admin" : "editor"}>
          <TabsList className="mb-6">
            {showEditorQueue && (
              <TabsTrigger value="editor" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Validation éditeur
                {pendingEditor.length > 0 && (
                  <Badge className="ml-1 bg-amber-500">{pendingEditor.length}</Badge>
                )}
              </TabsTrigger>
            )}
            {showAdminQueue && (
              <TabsTrigger value="admin" className="gap-2">
                <Clock className="h-4 w-4" />
                Validation admin
                {pendingAdmin.length > 0 && (
                  <Badge className="ml-1 bg-blue-500">{pendingAdmin.length}</Badge>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          {showEditorQueue && (
            <TabsContent value="editor">
              {pendingEditor.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">Aucun contenu en attente</p>
                    <p className="text-muted-foreground">Tous les contenus ont été validés</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingEditor.map(item => (
                    <ContentCard key={`${item.type}-${item.id}`} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {showAdminQueue && (
            <TabsContent value="admin">
              {pendingAdmin.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">Aucun contenu en attente</p>
                    <p className="text-muted-foreground">Tous les contenus ont été validés par l'admin</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingAdmin.map(item => (
                    <ContentCard key={`${item.type}-${item.id}`} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ValidationQueue;
