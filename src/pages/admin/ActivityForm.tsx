import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: "lundi", label: "Lundi" },
  { value: "mardi", label: "Mardi" },
  { value: "mercredi", label: "Mercredi" },
  { value: "jeudi", label: "Jeudi" },
  { value: "vendredi", label: "Vendredi" },
  { value: "samedi", label: "Samedi" },
  { value: "dimanche", label: "Dimanche" },
];

const CATEGORIES = [
  { value: "sport_adapte", label: "Sport adapté" },
  { value: "bien_etre", label: "Bien-être" },
  { value: "loisirs", label: "Loisirs" },
  { value: "accompagnement", label: "Accompagnement" },
  { value: "formation", label: "Formation" },
  { value: "autre", label: "Autre" },
];

const ActivityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description_short: "",
    description_long: "",
    days_of_week: [] as string[],
    start_time: "",
    end_time: "",
    location: "",
    facilitator: "",
    capacity_max: "",
    is_active: true,
  });

  useEffect(() => {
    if (id) fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        category: data.category,
        description_short: data.description_short || "",
        description_long: data.description_long || "",
        days_of_week: data.days_of_week || [],
        start_time: data.start_time?.slice(0, 5) || "",
        end_time: data.end_time?.slice(0, 5) || "",
        location: data.location || "",
        facilitator: data.facilitator || "",
        capacity_max: data.capacity_max?.toString() || "",
        is_active: data.is_active,
      });
    } catch (error: any) {
      toast.error("Erreur lors du chargement");
      console.error(error);
    }
  };

  const handleDayToggle = (day: string) => {
    const newDays = formData.days_of_week.includes(day)
      ? formData.days_of_week.filter((d) => d !== day)
      : [...formData.days_of_week, day];
    setFormData({ ...formData, days_of_week: newDays });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category) {
      toast.error("Titre et catégorie obligatoires");
      return;
    }

    setLoading(true);
    try {
      const activityData = {
        title: formData.title,
        category: formData.category,
        description_short: formData.description_short || null,
        description_long: formData.description_long || null,
        days_of_week: formData.days_of_week.length > 0 ? formData.days_of_week : null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        location: formData.location || null,
        facilitator: formData.facilitator || null,
        capacity_max: formData.capacity_max ? parseInt(formData.capacity_max) : null,
        is_active: formData.is_active,
      };

      if (id) {
        const { error } = await supabase
          .from("activities")
          .update(activityData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Atelier mis à jour");
      } else {
        const { error } = await supabase.from("activities").insert([activityData]);

        if (error) throw error;
        toast.success("Atelier créé");
      }

      navigate("/admin/activities");
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <Button variant="ghost" onClick={() => navigate("/admin/activities")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux ateliers
        </Button>

        <h1 className="text-3xl font-bold mb-8">
          {id ? "Modifier l'atelier" : "Nouvel atelier"}
        </h1>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Lieu</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Saint-Denis, La Réunion"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilitator">Animateur</Label>
                  <Input
                    id="facilitator"
                    value={formData.facilitator}
                    onChange={(e) => setFormData({ ...formData, facilitator: e.target.value })}
                    placeholder="Nom de l'animateur"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="capacity_max">Capacité maximale</Label>
                  <Input
                    id="capacity_max"
                    type="number"
                    value={formData.capacity_max}
                    onChange={(e) => setFormData({ ...formData, capacity_max: e.target.value })}
                    placeholder="20"
                  />
                </div>

                <div className="flex items-center gap-2 pt-8">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Atelier actif</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_short">Description courte</Label>
                <Textarea
                  id="description_short"
                  value={formData.description_short}
                  onChange={(e) => setFormData({ ...formData, description_short: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_long">Description détaillée</Label>
                <Textarea
                  id="description_long"
                  value={formData.description_long}
                  onChange={(e) => setFormData({ ...formData, description_long: e.target.value })}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Jours de la semaine</Label>
                <div className="flex flex-wrap gap-4">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day.value} className="flex items-center gap-2">
                      <Checkbox
                        id={day.value}
                        checked={formData.days_of_week.includes(day.value)}
                        onCheckedChange={() => handleDayToggle(day.value)}
                      />
                      <Label htmlFor={day.value} className="cursor-pointer">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Heure de début</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">Heure de fin</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="gradient-ocean" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>{id ? "Mettre à jour" : "Créer l'atelier"}</>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/activities")}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ActivityForm;
