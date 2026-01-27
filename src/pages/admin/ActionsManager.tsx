import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, GripVertical, Save, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HomepageAction {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color_class: string;
  position: number;
  is_visible: boolean;
  link_anchor: string | null;
}

const iconOptions = [
  { value: "MessageCircle", label: "Message / Parole" },
  { value: "Palette", label: "Palette / Art" },
  { value: "Wrench", label: "Outil / Manuel" },
  { value: "Music", label: "Musique" },
  { value: "Bike", label: "Vélo / Sport" },
  { value: "Building2", label: "Bâtiment / CHU" },
  { value: "Users", label: "Personnes" },
  { value: "Heart", label: "Cœur" },
  { value: "Star", label: "Étoile" },
  { value: "Calendar", label: "Calendrier" },
];

const colorOptions = [
  { value: "primary", label: "Bleu (Principal)" },
  { value: "secondary", label: "Vert (Secondaire)" },
  { value: "accent", label: "Corail (Accent)" },
];

const ActionsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAction, setNewAction] = useState({
    title: "",
    description: "",
    icon: "MessageCircle",
    color_class: "primary",
    link_anchor: "",
  });

  const { data: actions, isLoading } = useQuery({
    queryKey: ["homepage-actions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_actions")
        .select("*")
        .order("position");
      if (error) throw error;
      return data as HomepageAction[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (action: typeof newAction) => {
      const maxPosition = actions?.length ?? 0;
      const { error } = await supabase.from("homepage_actions").insert({
        ...action,
        position: maxPosition,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-actions"] });
      toast({ title: "Action ajoutée" });
      setNewAction({ title: "", description: "", icon: "MessageCircle", color_class: "primary", link_anchor: "" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible d'ajouter", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (action: Partial<HomepageAction> & { id: string }) => {
      const { id, ...updateData } = action;
      const { error } = await supabase.from("homepage_actions").update(updateData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-actions"] });
      toast({ title: "Action mise à jour" });
      setEditingId(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de mettre à jour", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("homepage_actions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage-actions"] });
      toast({ title: "Action supprimée" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    },
  });

  const moveAction = async (action: HomepageAction, direction: "up" | "down") => {
    if (!actions) return;
    const currentIndex = actions.findIndex((a) => a.id === action.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= actions.length) return;

    const otherAction = actions[newIndex];
    await updateMutation.mutateAsync({ id: action.id, position: otherAction.position });
    await updateMutation.mutateAsync({ id: otherAction.id, position: action.position });
  };

  const [editedActions, setEditedActions] = useState<Record<string, Partial<HomepageAction>>>({});

  const handleChange = (id: string, field: keyof HomepageAction, value: unknown) => {
    setEditedActions((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const getValue = (action: HomepageAction, field: keyof HomepageAction) => {
    return editedActions[action.id]?.[field] ?? action[field];
  };

  const saveAction = (action: HomepageAction) => {
    const changes = editedActions[action.id];
    if (changes) {
      updateMutation.mutate({ id: action.id, ...changes });
      setEditedActions((prev) => {
        const newState = { ...prev };
        delete newState[action.id];
        return newState;
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Gestion des Actions</h1>
        <p className="text-muted-foreground">
          Gérez les vignettes "Nos Actions" affichées sur la page d'accueil et leur lien vers la page détaillée.
        </p>

        {/* Add new action */}
        <Card>
          <CardHeader>
            <CardTitle>Ajouter une action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Titre</Label>
                <Input
                  placeholder="Ex: Groupes de Parole"
                  value={newAction.title}
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Ancre (lien vers section)</Label>
                <Input
                  placeholder="Ex: groupes-de-parole"
                  value={newAction.link_anchor}
                  onChange={(e) => setNewAction({ ...newAction, link_anchor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Description courte</Label>
              <Textarea
                placeholder="Partage d'expériences dans un cadre bienveillant"
                value={newAction.description}
                onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Icône</Label>
                <Select value={newAction.icon} onValueChange={(v) => setNewAction({ ...newAction, icon: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Couleur</Label>
                <Select value={newAction.color_class} onValueChange={(v) => setNewAction({ ...newAction, color_class: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => createMutation.mutate(newAction)} disabled={!newAction.title || createMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter l'action
            </Button>
          </CardContent>
        </Card>

        {/* List of actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions existantes</CardTitle>
            <CardDescription>Réorganisez, modifiez ou supprimez les vignettes.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {actions?.map((action, index) => (
                  <div key={action.id} className="flex items-start gap-4 p-4 border rounded-lg bg-card">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />

                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="icon" onClick={() => moveAction(action, "up")} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveAction(action, "down")}
                        disabled={index === actions.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input
                          value={getValue(action, "title") as string}
                          onChange={(e) => handleChange(action.id, "title", e.target.value)}
                          placeholder="Titre"
                        />
                        <Input
                          value={(getValue(action, "link_anchor") as string) ?? ""}
                          onChange={(e) => handleChange(action.id, "link_anchor", e.target.value)}
                          placeholder="Ancre (lien)"
                        />
                      </div>
                      <Textarea
                        value={(getValue(action, "description") as string) ?? ""}
                        onChange={(e) => handleChange(action.id, "description", e.target.value)}
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="grid gap-3 md:grid-cols-2">
                        <Select
                          value={getValue(action, "icon") as string}
                          onValueChange={(v) => handleChange(action.id, "icon", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={getValue(action, "color_class") as string}
                          onValueChange={(v) => handleChange(action.id, "color_class", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colorOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={getValue(action, "is_visible") as boolean}
                          onCheckedChange={(checked) => {
                            handleChange(action.id, "is_visible", checked);
                            updateMutation.mutate({ id: action.id, is_visible: checked });
                          }}
                        />
                        {getValue(action, "is_visible") ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      {editedActions[action.id] && (
                        <Button size="sm" onClick={() => saveAction(action)}>
                          <Save className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Supprimer cette action ?")) {
                            deleteMutation.mutate(action.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ActionsManager;
