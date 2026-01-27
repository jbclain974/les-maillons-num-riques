import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, GripVertical, Save, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  position: number;
  is_visible: boolean;
  parent_id: string | null;
  target: string;
  icon: string | null;
}

const NavigationManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [newItem, setNewItem] = useState({ label: "", url: "" });

  const { data: items, isLoading } = useQuery({
    queryKey: ["navigation-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*")
        .order("position");
      if (error) throw error;
      return data as NavigationItem[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (item: Partial<NavigationItem> & { id: string }) => {
      const { error } = await supabase
        .from("navigation_items")
        .update(item)
        .eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast({ title: "Navigation mise à jour" });
      setEditingItem(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de mettre à jour", variant: "destructive" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: { label: string; url: string }) => {
      const maxPosition = items?.length ?? 0;
      const { error } = await supabase
        .from("navigation_items")
        .insert({ ...item, position: maxPosition });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast({ title: "Élément ajouté" });
      setNewItem({ label: "", url: "" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible d'ajouter", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("navigation_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast({ title: "Élément supprimé" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    },
  });

  const moveItem = async (item: NavigationItem, direction: "up" | "down") => {
    if (!items) return;
    const currentIndex = items.findIndex((i) => i.id === item.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const otherItem = items[newIndex];
    await updateMutation.mutateAsync({ id: item.id, position: otherItem.position });
    await updateMutation.mutateAsync({ id: otherItem.id, position: item.position });
  };

  const handleToggleVisibility = (item: NavigationItem) => {
    updateMutation.mutate({ id: item.id, is_visible: !item.is_visible });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Gestion de la Navigation</h1>

        <Card>
          <CardHeader>
            <CardTitle>Ajouter un élément</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Libellé (ex: Accueil)"
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
              />
              <Input
                placeholder="URL (ex: /contact)"
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
              />
              <Button
                onClick={() => createMutation.mutate(newItem)}
                disabled={!newItem.label || !newItem.url || createMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Éléments du menu</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {items?.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg bg-card"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveItem(item, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveItem(item, "down")}
                        disabled={index === items.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {editingItem?.id === item.id ? (
                      <>
                        <Input
                          value={editingItem.label}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, label: e.target.value })
                          }
                          className="flex-1"
                        />
                        <Input
                          value={editingItem.url}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, url: e.target.value })
                          }
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => updateMutation.mutate(editingItem)}
                          disabled={updateMutation.isPending}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingItem(null)}
                        >
                          Annuler
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground ml-2">({item.url})</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(item)}
                        >
                          Modifier
                        </Button>
                      </>
                    )}

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.is_visible}
                        onCheckedChange={() => handleToggleVisibility(item)}
                      />
                      <Label className="text-sm">Visible</Label>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Supprimer cet élément ?")) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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

export default NavigationManager;
