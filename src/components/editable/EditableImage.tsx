import { useState, useRef, ReactNode } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Check, Upload, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditableImageProps {
  children: ReactNode;
  table: string;
  column: string;
  id: string;
  idColumn?: string; // Default "id", but can be "key" for site_settings
  currentUrl: string;
  onUpdate?: (newUrl: string) => void;
  bucket?: string;
  folderPath?: string;
  className?: string;
}

const EditableImage = ({
  children,
  table,
  column,
  id,
  idColumn = "id",
  currentUrl,
  onUpdate,
  bucket = "media",
  folderPath = "images",
  className,
}: EditableImageProps) => {
  const { canEdit } = useAdminEdit();
  const [isOpen, setIsOpen] = useState(false);
  const [urlValue, setUrlValue] = useState(currentUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("❌ Fichier trop volumineux", {
        description: "La taille maximale est de 5 Mo.",
      });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("❌ Format non supporté", {
        description: "Utilisez JPG, PNG, WebP ou GIF.",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate secure filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split(".").pop();
      const fileName = `${folderPath}/${timestamp}-${randomId}.${extension}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setPreviewUrl(urlData.publicUrl);
      setUrlValue(urlData.publicUrl);

      toast.success("✅ Image téléversée", {
        description: "Cliquez sur Enregistrer pour valider.",
      });
    } catch (error: any) {
      toast.error("❌ Erreur d'upload", {
        description: error.message || "Impossible de téléverser l'image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (urlValue === currentUrl) {
      setIsOpen(false);
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from(table as any)
        .update({ [column]: urlValue } as any)
        .eq(idColumn, id);

      if (error) throw error;

      toast.success("✅ Image mise à jour", {
        description: "Le changement a été enregistré.",
      });

      onUpdate?.(urlValue);
      setIsOpen(false);
      setPreviewUrl(null);
    } catch (error: any) {
      toast.error("❌ Erreur de sauvegarde", {
        description: error.message || "Une erreur est survenue.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpen = () => {
    setUrlValue(currentUrl);
    setPreviewUrl(null);
    setIsOpen(true);
  };

  if (!canEdit) {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <div
        className={cn(
          className,
          "relative cursor-pointer group transition-all duration-200",
          "outline outline-2 outline-dashed outline-transparent",
          "hover:outline-primary/50 rounded-md overflow-hidden"
        )}
        onClick={handleOpen}
      >
        {children}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="flex items-center gap-2 bg-white/90 text-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
            <Camera className="h-4 w-4" />
            Modifier
          </span>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Modifier l'image
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Téléverser
              </TabsTrigger>
              <TabsTrigger value="url">
                <LinkIcon className="h-4 w-4 mr-2" />
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Téléversement...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Cliquez ou glissez une image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, WebP, GIF (max 5 Mo)
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">URL de l'image</Label>
                <Input
                  id="imageUrl"
                  value={urlValue}
                  onChange={(e) => {
                    setUrlValue(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview */}
          {(previewUrl || urlValue) && (
            <div className="mt-4">
              <Label className="text-sm font-medium mb-2 block">Aperçu</Label>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={previewUrl || urlValue}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSaving || isUploading}>
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

export default EditableImage;
