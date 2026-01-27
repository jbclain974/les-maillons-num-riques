import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Trash2, X, Upload } from "lucide-react";
import { sanitizeError, validateFileUpload, generateSecureFilename } from "@/lib/errorSanitizer";
import { ValidationWorkflow, ValidationStatus } from "@/components/admin/ValidationWorkflow";
import { useAuth } from "@/lib/auth";
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

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    cover_image: "",
    status: "draft" as "draft" | "published",
    validation_status: "draft" as ValidationStatus,
    review_notes: null as string | null,
    rejection_reason: null as string | null,
  });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content || "",
        category: data.category || "",
        cover_image: data.cover_image || "",
        status: (data.status === "archived" ? "draft" : data.status) as "draft" | "published",
        validation_status: (data.validation_status || "draft") as ValidationStatus,
        review_notes: data.review_notes,
        rejection_reason: data.rejection_reason,
      });
    } catch (error: any) {
      toast.error("Erreur lors du chargement");
      console.error(error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file before upload
    const validation = validateFileUpload(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setUploading(true);
    try {
      const fileName = generateSecureFilename(file.name);
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      setFormData({ ...formData, cover_image: publicUrl });
      toast.success("Image téléchargée");
    } catch (error: any) {
      toast.error(sanitizeError(error));
    } finally {
      setUploading(false);
    }
  };

  const handleValidationChange = async (newStatus: ValidationStatus, notes?: string) => {
    if (!id || !user) return;

    try {
      const updateData: any = {
        validation_status: newStatus,
      };

      if (newStatus === 'pending_editor') {
        updateData.submitted_by = user.id;
        updateData.submitted_at = new Date().toISOString();
      } else if (newStatus === 'pending_admin') {
        updateData.reviewed_by = user.id;
        updateData.reviewed_at = new Date().toISOString();
        updateData.review_notes = notes;
      } else if (newStatus === 'published') {
        updateData.validated_by = user.id;
        updateData.validated_at = new Date().toISOString();
        updateData.status = 'published';
        updateData.published_at = new Date().toISOString();
      } else if (newStatus === 'rejected') {
        updateData.rejection_reason = notes;
      } else if (newStatus === 'draft') {
        updateData.status = 'draft';
      }

      const { error } = await supabase
        .from("posts")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Log validation history
      await supabase.from("validation_history").insert({
        content_type: 'post',
        content_id: id,
        from_status: formData.validation_status,
        to_status: newStatus,
        action_by: user.id,
        notes,
      });

      toast.success("Statut mis à jour");
      fetchPost();
    } catch (error: any) {
      toast.error(sanitizeError(error));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error("Titre et slug obligatoires");
      return;
    }

    setLoading(true);
    try {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        cover_image: formData.cover_image,
        status: formData.status,
        published_at: formData.status === "published" ? new Date().toISOString() : null,
      };

      if (id) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Actualité mise à jour");
      } else {
        const { error } = await supabase.from("posts").insert([{
          ...postData,
          validation_status: 'draft',
          submitted_by: user?.id,
        }]);

        if (error) throw error;
        toast.success("Actualité créée");
      }

      navigate("/admin/posts");
    } catch (error: any) {
      toast.error(sanitizeError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/admin/posts")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux actualités
          </Button>
          <h1 className="text-3xl font-bold">
            {id ? "Modifier l'actualité" : "Nouvelle actualité"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Titre de l'actualité"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="url-de-l-actualite"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  L'URL de l'actualité : /actualites/{formData.slug}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Événements">Événements</SelectItem>
                      <SelectItem value="Ateliers">Ateliers</SelectItem>
                      <SelectItem value="Sport">Sport</SelectItem>
                      <SelectItem value="Témoignages">Témoignages</SelectItem>
                      <SelectItem value="Association">Association</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "draft" | "published") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Résumé de l'actualité (affiché dans la liste)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenu complet de l'actualité"
                  rows={12}
                />
              </div>
            </CardContent>
          </Card>

          {/* Validation Workflow - only show for existing posts */}
          {id && (
            <ValidationWorkflow
              currentStatus={formData.validation_status}
              onStatusChange={handleValidationChange}
              contentType="post"
              reviewNotes={formData.review_notes}
              rejectionReason={formData.rejection_reason}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Image de couverture</CardTitle>
              <CardDescription>
                Une image attrayante pour illustrer l'actualité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.cover_image ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={formData.cover_image}
                      alt="Aperçu"
                      className="max-w-md rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData({ ...formData, cover_image: "" })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cliquez sur le X pour supprimer l'image
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <Label htmlFor="image" className="cursor-pointer">
                      <span className="text-primary hover:underline">Cliquez pour télécharger</span>
                      <span className="text-muted-foreground"> ou glissez-déposez</span>
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WEBP, GIF - Max 5 MB
                    </p>
                  </div>
                  {uploading && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Téléchargement...</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="gradient-ocean"
              disabled={loading || uploading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>{id ? "Mettre à jour" : "Créer l'actualité"}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/posts")}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PostForm;
