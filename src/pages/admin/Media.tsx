import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Trash2,
  Search,
  Image as ImageIcon,
  Copy,
  Check,
  Upload,
  FileImage,
  Grid,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/lib/auth";
import { validateFileUpload, generateSecureFilename, sanitizeError } from "@/lib/errorSanitizer";

interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  alt_text: string | null;
  category: string | null;
  mime_type: string | null;
  size: number | null;
  uploaded_by: string | null;
  created_at: string;
}

const Media = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<MediaItem | null>(null);
  
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: media, isLoading } = useQuery({
    queryKey: ["admin-media", categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false });

      if (categoryFilter && categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MediaItem[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (item: MediaItem) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([item.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("media")
        .delete()
        .eq("id", item.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      toast.success("Média supprimé");
      setDeleteDialog(null);
    },
    onError: (error) => {
      toast.error(sanitizeError(error));
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateFileUpload(file);

        if (!validation.valid) {
          toast.error(`${file.name}: ${validation.error}`);
          continue;
        }

        const fileName = generateSecureFilename(file.name);
        const filePath = `uploads/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`Erreur upload ${file.name}: ${sanitizeError(uploadError)}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("media")
          .getPublicUrl(filePath);

        // Save to database
        const { error: dbError } = await supabase.from("media").insert({
          file_name: file.name,
          file_path: filePath,
          mime_type: file.type,
          size: file.size,
          uploaded_by: user?.id,
          category: "general",
        });

        if (dbError) {
          toast.error(`Erreur enregistrement ${file.name}`);
        } else {
          toast.success(`${file.name} uploadé`);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    } catch (error) {
      toast.error(sanitizeError(error));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const getPublicUrl = (filePath: string) => {
    const { data: { publicUrl } } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);
    return publicUrl;
  };

  const copyUrl = (item: MediaItem) => {
    const url = getPublicUrl(item.file_path);
    navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    toast.success("URL copiée");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredMedia = media?.filter((item) =>
    item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.alt_text?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(media?.map((m) => m.category).filter(Boolean) || []));

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Médiathèque</h1>
            <p className="text-muted-foreground">
              Gérez les images et fichiers du site
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleUpload}
                disabled={uploading}
              />
              <Button disabled={uploading}>
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Télécharger
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="general">Général</SelectItem>
                  <SelectItem value="posts">Articles</SelectItem>
                  <SelectItem value="events">Événements</SelectItem>
                  <SelectItem value="testimonials">Témoignages</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat!}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileImage className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{media?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Total fichiers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <ImageIcon className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {media?.filter((m) => m.mime_type?.startsWith("image")).length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Images</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredMedia?.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Aucun média</p>
              <div className="relative inline-block">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleUpload}
                />
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger des fichiers
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia?.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-muted">
                  {item.mime_type?.startsWith("image") ? (
                    <img
                      src={getPublicUrl(item.file_path)}
                      alt={item.alt_text || item.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileImage className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => copyUrl(item)}
                    >
                      {copiedId === item.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setDeleteDialog(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-2">
                  <p className="text-xs truncate font-medium">{item.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.size)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-3">Fichier</th>
                    <th className="text-left p-3">Catégorie</th>
                    <th className="text-left p-3">Taille</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia?.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                            {item.mime_type?.startsWith("image") ? (
                              <img
                                src={getPublicUrl(item.file_path)}
                                alt={item.alt_text || item.file_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileImage className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <span className="font-medium text-sm truncate max-w-xs">
                            {item.file_name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{item.category || "Général"}</Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {formatFileSize(item.size)}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {format(new Date(item.created_at), "d MMM yyyy", { locale: fr })}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyUrl(item)}
                          >
                            {copiedId === item.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteDialog(item)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Delete Dialog */}
        <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le média</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer "{deleteDialog?.file_name}" ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog(null)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteDialog && deleteMutation.mutate(deleteDialog)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Media;
