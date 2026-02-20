import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, GripVertical, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { useNavigation } from "@/hooks/useSiteContent";
import { useAuth } from "@/lib/auth";
import { useAdminEdit } from "@/contexts/AdminEditContext";
import EditableWrapper from "@/components/editable/EditableWrapper";
import logoAssociation from "@/assets/logo-maillons-espoir.svg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: navigationItems, refetch } = useNavigation();
  const { user } = useAuth();
  const { canEdit } = useAdminEdit();
  const queryClient = useQueryClient();

  const [editingItem, setEditingItem] = useState<{
    id: string;
    label: string;
    url: string;
    isNew?: boolean;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fallback navigation while loading or if no data
  const defaultNavigation = [
    { id: "default-1", label: "Accueil", url: "/" },
    { id: "default-2", label: "L'Association", url: "/association" },
    { id: "default-2b", label: "Organigramme", url: "/organigramme" },
    { id: "default-3", label: "Nos Actions", url: "/nos-actions" },
    { id: "default-4", label: "Projets & Événements", url: "/projets" },
    { id: "default-4b", label: "Programme 2026", url: "/programme-annuel" },
    { id: "default-5", label: "Actualités", url: "/actualites" },
    { id: "default-5b", label: "Veille Sanitaire", url: "/veille-sanitaire" },
    { id: "default-5c", label: "Documents", url: "/documents-officiels" },
    { id: "default-6", label: "Témoignages", url: "/temoignages" },
    { id: "default-7", label: "Contact", url: "/contact" },
  ];

  const navigation = navigationItems && navigationItems.length > 0 
    ? navigationItems 
    : defaultNavigation;

  const handleSaveItem = async () => {
    if (!editingItem) return;
    setIsSaving(true);

    try {
      if (editingItem.isNew) {
        const { error } = await supabase
          .from("navigation_items")
          .insert({
            label: editingItem.label,
            url: editingItem.url,
            position: navigation.length,
            is_visible: true,
          });

        if (error) throw error;
        toast.success("✅ Lien ajouté au menu");
      } else {
        const { error } = await supabase
          .from("navigation_items")
          .update({
            label: editingItem.label,
            url: editingItem.url,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("✅ Lien modifié");
      }

      refetch();
      queryClient.invalidateQueries({ queryKey: ["public-navigation"] });
      setEditingItem(null);
    } catch (error: any) {
      toast.error("❌ Erreur", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Supprimer ce lien du menu ?")) return;

    try {
      const { error } = await supabase
        .from("navigation_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("✅ Lien supprimé");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["public-navigation"] });
    } catch (error: any) {
      toast.error("❌ Erreur", { description: error.message });
    }
  };

  const handleAddNewItem = () => {
    setEditingItem({
      id: "new",
      label: "",
      url: "/",
      isNew: true,
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src={logoAssociation} 
            alt="Les Maillons de l'Espoir" 
            className="h-10 w-10 object-contain"
            onError={(e) => {
              // Fallback si le logo n'est pas encore disponible
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-xl font-bold text-foreground">
            Les Maillons de l'Espoir
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 lg:flex">
          {navigation.map((item) => (
            canEdit ? (
              <div key={item.id} className="flex items-center gap-1 group">
                <EditableWrapper
                  onClick={() => setEditingItem({
                    id: item.id,
                    label: item.label,
                    url: item.url,
                  })}
                  label="Modifier"
                >
                  <span className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
                    {item.label}
                  </span>
                </EditableWrapper>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              </div>
            ) : (
              <Link
                key={item.id}
                to={item.url}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            )
          ))}
          
          {/* Add new menu item button */}
          {canEdit && (
            <button
              onClick={handleAddNewItem}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors border border-dashed border-primary/30 rounded-full px-2 py-1"
            >
              <Plus className="h-3 w-3" />
              Ajouter
            </button>
          )}
        </div>

        {/* CTA Buttons - TOUJOURS afficher Espace membre et Admin */}
        <div className="hidden items-center space-x-4 lg:flex">
          <Button asChild variant="outline" size="sm">
            <Link to={user ? "/membre" : "/auth"}>
              <User className="h-4 w-4 mr-2" />
              Espace membre
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin">Admin</Link>
          </Button>
          <Button asChild className="gradient-sunset">
            <Link to="/soutenir">Soutenir</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Ouvrir le menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link to={user ? "/membre" : "/auth"} onClick={() => setMobileMenuOpen(false)}>
                  <User className="h-4 w-4 mr-2" />
                  Espace membre
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
              </Button>
              <Button asChild className="w-full gradient-sunset">
                <Link to="/soutenir" onClick={() => setMobileMenuOpen(false)}>Soutenir</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem?.isNew ? "Ajouter un lien" : "Modifier le lien"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="menuLabel">Libellé</Label>
              <Input
                id="menuLabel"
                value={editingItem?.label || ""}
                onChange={(e) => setEditingItem(prev => prev ? { ...prev, label: e.target.value } : null)}
                placeholder="Accueil"
              />
            </div>
            <div>
              <Label htmlFor="menuUrl">URL</Label>
              <Input
                id="menuUrl"
                value={editingItem?.url || ""}
                onChange={(e) => setEditingItem(prev => prev ? { ...prev, url: e.target.value } : null)}
                placeholder="/contact"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Annuler
            </Button>
            <Button onClick={handleSaveItem} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {editingItem?.isNew ? "Ajouter" : "Enregistrer"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;