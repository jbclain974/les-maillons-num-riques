import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  seo_title: string;
  seo_description: string;
}

const PageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const [showPreview, setShowPreview] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm<PageFormData>({
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      seo_title: "",
      seo_description: "",
    }
  });

  const titleValue = watch("title");
  const contentValue = watch("content");

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (page) {
      reset({
        title: page.title,
        slug: page.slug,
        content: page.content || "",
        seo_title: page.seo_title || "",
        seo_description: page.seo_description || "",
      });
    }
  }, [page, reset]);

  useEffect(() => {
    if (!isEditing && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, isEditing, setValue]);

  const saveMutation = useMutation({
    mutationFn: async (data: PageFormData) => {
      if (isEditing) {
        const { error } = await supabase
          .from("pages")
          .update(data)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("pages")
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
      toast({
        title: isEditing ? "Page modifiée" : "Page créée",
        description: `La page a été ${isEditing ? "modifiée" : "créée"} avec succès`,
      });
      navigate("/admin/pages");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: sanitizeError(error),
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("pages")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
      toast({
        title: "Page supprimée",
        description: "La page a été supprimée avec succès",
      });
      navigate("/admin/pages");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: sanitizeError(error),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PageFormData) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/pages")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? "Modifier la page" : "Nouvelle page"}
              </h1>
              {isEditing && page && (
                <p className="text-muted-foreground text-sm">
                  Dernière modification: {new Date(page.updated_at).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Masquer aperçu
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Aperçu
                    </>
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer la page</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette page ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate()}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : ""}`}>
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de la page</CardTitle>
                <CardDescription>
                  Définissez le titre et le contenu de votre page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de la page *</Label>
                  <Input
                    id="title"
                    {...register("title", { required: true })}
                    placeholder="Ex: Notre équipe"
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Le titre apparaîtra en haut de la page et dans le navigateur
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL de la page *</Label>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-muted-foreground">/page/</span>
                    <Input
                      id="slug"
                      {...register("slug", { required: true })}
                      placeholder="notre-equipe"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    L'URL unique pour accéder à cette page (généré automatiquement)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenu de la page</Label>
                  <Textarea
                    id="content"
                    {...register("content")}
                    placeholder="Rédigez le contenu de votre page...

Vous pouvez utiliser plusieurs paragraphes.

## Sous-titres

Et du texte formaté."
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Le contenu principal de la page. Utilisez des sauts de ligne pour créer des paragraphes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Référencement (SEO)</CardTitle>
                <CardDescription>
                  Optimisez la visibilité de votre page dans les moteurs de recherche
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">Titre SEO</Label>
                  <Input
                    id="seo_title"
                    {...register("seo_title")}
                    placeholder="Titre pour les moteurs de recherche"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum 60 caractères recommandé. Laissez vide pour utiliser le titre de la page.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description">Description SEO</Label>
                  <Textarea
                    id="seo_description"
                    {...register("seo_description")}
                    placeholder="Brève description pour les résultats de recherche..."
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum 160 caractères recommandé. Cette description apparaît dans les résultats Google.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/pages")}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={saveMutation.isPending} className="gap-2">
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isEditing ? "Enregistrer les modifications" : "Créer la page"}
              </Button>
            </div>
          </form>

          {/* Preview */}
          {showPreview && (
            <Card className="h-fit sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Aperçu
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h1>{titleValue || "Titre de la page"}</h1>
                <div className="whitespace-pre-wrap">
                  {contentValue || "Le contenu de la page apparaîtra ici..."}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PageForm;
