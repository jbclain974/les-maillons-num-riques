import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const { register, handleSubmit, reset, watch, setValue } = useForm<PageFormData>();
  const titleValue = watch("title");

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
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la page",
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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/pages")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Modifier la page" : "Nouvelle page"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de la page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  {...register("title", { required: true })}
                  placeholder="Titre de la page"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug", { required: true })}
                  placeholder="slug-de-la-page"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  {...register("content")}
                  placeholder="Contenu de la page..."
                  rows={10}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">Titre SEO</Label>
                <Input
                  id="seo_title"
                  {...register("seo_title")}
                  placeholder="Titre pour les moteurs de recherche"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">Description SEO</Label>
                <Textarea
                  id="seo_description"
                  {...register("seo_description")}
                  placeholder="Description pour les moteurs de recherche"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/pages")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PageForm;
