import { useState, ReactNode } from "react";
import { useAdminEdit } from "@/contexts/AdminEditContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Loader2, Check } from "lucide-react";

interface EditableTextProps {
  children: ReactNode;
  table: string;
  column: string;
  id: string;
  value: string;
  onUpdate?: (newValue: string) => void;
  multiline?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const EditableText = ({
  children,
  table,
  column,
  id,
  value,
  onUpdate,
  multiline = false,
  className,
  as: Tag = "span",
}: EditableTextProps) => {
  const { canEdit } = useAdminEdit();
  const [isOpen, setIsOpen] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (editValue === value) {
      setIsOpen(false);
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from(table as any)
        .update({ [column]: editValue } as any)
        .eq("id", id);

      if (error) throw error;

      toast.success("✅ Modification enregistrée", {
        description: `Le contenu a été mis à jour avec succès.`,
      });

      onUpdate?.(editValue);
      setIsOpen(false);
    } catch (error: any) {
      toast.error("❌ Erreur lors de la sauvegarde", {
        description: error.message || "Une erreur est survenue.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpen = () => {
    setEditValue(value);
    setIsOpen(true);
  };

  if (!canEdit) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <>
      <Tag
        className={cn(
          className,
          "relative cursor-pointer group transition-all duration-200",
          "outline outline-2 outline-dashed outline-transparent",
          "hover:outline-primary/50 hover:bg-primary/5 rounded-md"
        )}
        onClick={handleOpen}
      >
        {children}
        <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center justify-center h-5 w-5 bg-primary text-primary-foreground rounded-full shadow-lg">
            <Pencil className="h-3 w-3" />
          </span>
        </span>
      </Tag>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Modifier le contenu
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="editValue" className="text-sm font-medium mb-2 block">
              Nouveau contenu
            </Label>
            {multiline ? (
              <Textarea
                id="editValue"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={6}
                className="resize-none"
                placeholder="Entrez le texte..."
              />
            ) : (
              <Input
                id="editValue"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Entrez le texte..."
              />
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditableText;
