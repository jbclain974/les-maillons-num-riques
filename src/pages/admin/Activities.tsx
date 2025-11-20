import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Activity {
  id: string;
  title: string;
  category: string;
  days_of_week: string[] | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  is_active: boolean;
}

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("is_active", { ascending: false })
        .order("title");

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet atelier ?")) return;

    try {
      const { error } = await supabase.from("activities").delete().eq("id", id);
      if (error) throw error;

      toast.success("Atelier supprimé");
      fetchActivities();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Ateliers & Actions</h1>
            <p className="text-muted-foreground">Gérez les activités proposées aux adhérents</p>
          </div>
          <Button className="gradient-ocean" onClick={() => navigate("/admin/activities/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel atelier
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">Aucun atelier</p>
              <Button className="gradient-ocean" onClick={() => navigate("/admin/activities/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Créer le premier atelier
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                      <Badge className={activity.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {activity.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/admin/activities/${activity.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(activity.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="capitalize">{activity.category.replace("_", " ")}</div>
                    {activity.days_of_week && activity.days_of_week.length > 0 && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {activity.days_of_week.join(", ")}
                        {activity.start_time && ` • ${activity.start_time.slice(0, 5)}`}
                        {activity.end_time && ` - ${activity.end_time.slice(0, 5)}`}
                      </div>
                    )}
                    {activity.location && <div>📍 {activity.location}</div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Activities;
