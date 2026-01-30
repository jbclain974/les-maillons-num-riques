import { useState, useEffect } from "react";
import { useAdminEdit } from "@/contexts/AdminEditContext";
import { cn } from "@/lib/utils";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditablePageTextProps {
  value: string;
  onSave: (value: string) => Promise<boolean>;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

/**
 * A component for editing text content inline on any page.
 * Uses the page content system to persist changes.
 */
const EditablePageText = ({
  value,
  onSave,
  as: Component = "p",
  className,
  multiline = false,
  placeholder = "Cliquez pour modifier...",
}: EditablePageTextProps) => {
  const { canEdit } = useAdminEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    const success = await onSave(editValue);
    setSaving(false);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  // If not in edit mode, render normally
  if (!canEdit) {
    return <Component className={className}>{value || placeholder}</Component>;
  }

  // If editing this specific field
  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full p-2 border-2 border-primary rounded-md bg-background resize-y min-h-[100px]",
              className
            )}
            autoFocus
            disabled={saving}
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full p-2 border-2 border-primary rounded-md bg-background",
              className
            )}
            autoFocus
            disabled={saving}
          />
        )}
        <div className="absolute -top-10 right-0 flex gap-1">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="h-8 px-2"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
            className="h-8 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Editable state - show edit indicator on hover
  return (
    <div
      className={cn(
        "relative cursor-pointer group transition-all duration-200",
        "outline outline-2 outline-dashed outline-transparent",
        "hover:outline-primary/50 hover:bg-primary/5 rounded-md p-1 -m-1"
      )}
      onClick={() => setIsEditing(true)}
    >
      <Component className={className}>{value || placeholder}</Component>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="absolute top-1 right-1 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium shadow-lg">
          <Pencil className="h-3 w-3" />
          Modifier
        </span>
      </div>
    </div>
  );
};

export default EditablePageText;
