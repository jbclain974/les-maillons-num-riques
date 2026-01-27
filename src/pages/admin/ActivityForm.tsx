import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Trash2, Save, Calendar, Clock, MapPin, Users } from "lucide-react";
import { sanitizeError } from "@/lib/errorSanitizer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Atelier supprimé");
      navigate("/admin/activities");
    } catch (error: any) {
      toast.error(sanitizeError(error));
    } finally {
      setDeleting(false);
    }
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
      toast.error(sanitizeError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/activities")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {id ? "Modifier l'atelier" : "Nouvel atelier"}
              </h1>
              <p className="text-muted-foreground">
                {id ? "Modifiez les détails de l'atelier" : "Créez un nouvel atelier ou action"}
              </p>
            </div>
          </div>
          {id && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" disabled={deleting}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer l'atelier</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer cet atelier ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informations principales
              </CardTitle>
              <CardDescription>
                Les informations de base de l'atelier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'atelier *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Marche nordique"
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
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Lieu
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Saint-Denis, La Réunion"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilitator" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Animateur
                  </Label>
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
                  <p className="text-xs text-muted-foreground">
                    Laissez vide pour une capacité illimitée
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    <span className="font-medium">Atelier actif</span>
                    <p className="text-xs text-muted-foreground">
                      Les ateliers inactifs n'apparaissent pas sur le site
                    </p>
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_short">Description courte</Label>
                <Textarea
                  id="description_short"
                  value={formData.description_short}
                  onChange={(e) => setFormData({ ...formData, description_short: e.target.value })}
                  rows={2}
                  placeholder="Un résumé en 1-2 phrases..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_long">Description détaillée</Label>
                <Textarea
                  id="description_long"
                  value={formData.description_long}
                  onChange={(e) => setFormData({ ...formData, description_long: e.target.value })}
                  rows={6}
                  placeholder="Description complète de l'atelier, objectifs, déroulement..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horaires
              </CardTitle>
              <CardDescription>
                Définissez les jours et heures de l'atelier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Jours de la semaine</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DAYS_OF_WEEK.map((day) => (
                    <div
                      key={day.value}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.days_of_week.includes(day.value)
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleDayToggle(day.value)}
                    >
                      <Checkbox
                        id={day.value}
                        checked={formData.days_of_week.includes(day.value)}
                        onCheckedChange={() => handleDayToggle(day.value)}
                      />
                      <Label htmlFor={day.value} className="cursor-pointer flex-1">
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

          <div className="flex justify-between items-center">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/activities")}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {id ? "Enregistrer les modifications" : "Créer l'atelier"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ActivityForm;
