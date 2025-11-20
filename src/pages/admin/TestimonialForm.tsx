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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TestimonialFormData {
  display_name: string;
  content: string;
  type: string;
  photo_url: string;
  video_url: string;
  is_anonymous: boolean;
  is_featured: boolean;
  order_position: number;
}

const TestimonialForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm<TestimonialFormData>({
    defaultValues: {
      type: "text",
      is_anonymous: false,
      is_featured: false,
      order_position: 0,
    }
  });

  const isAnonymous = watch("is_anonymous");

  const { data: testimonial, isLoading } = useQuery({
    queryKey: ["testimonial", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (testimonial) {
      reset({
        display_name: testimonial.display_name,
        content: testimonial.content,
        type: testimonial.type || "text",
        photo_url: testimonial.photo_url || "",
        video_url: testimonial.video_url || "",
        is_anonymous: testimonial.is_anonymous,
        is_featured: testimonial.is_featured,
        order_position: testimonial.order_position || 0,
      });
    }
  }, [testimonial, reset]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);

      setValue("photo_url", publicUrl);
      toast({
        title: "Photo téléchargée",
        description: "La photo a été téléchargée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: TestimonialFormData) => {
      if (isEditing) {
        const { error } = await supabase
          .from("testimonials")
          .update(data)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("testimonials")
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast({
        title: isEditing ? "Témoignage modifié" : "Témoignage créé",
        description: `Le témoignage a été ${isEditing ? "modifié" : "créé"} avec succès`,
      });
      navigate("/admin/testimonials");
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le témoignage",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TestimonialFormData) => {
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
            onClick={() => navigate("/admin/testimonials")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Modifier le témoignage" : "Nouveau témoignage"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du témoignage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setValue("is_anonymous", checked as boolean)}
                />
                <Label htmlFor="is_anonymous">Témoignage anonyme</Label>
              </div>

              {!isAnonymous && (
                <div className="space-y-2">
                  <Label htmlFor="display_name">Nom affiché *</Label>
                  <Input
                    id="display_name"
                    {...register("display_name", { required: !isAnonymous })}
                    placeholder="Nom de la personne"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={watch("type")}
                  onValueChange={(value) => setValue("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texte</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Témoignage *</Label>
                <Textarea
                  id="content"
                  {...register("content", { required: true })}
                  placeholder="Contenu du témoignage..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                <div className="flex gap-2">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">URL Vidéo</Label>
                <Input
                  id="video_url"
                  {...register("video_url")}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_position">Position</Label>
                <Input
                  id="order_position"
                  type="number"
                  {...register("order_position", { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={watch("is_featured")}
                  onCheckedChange={(checked) => setValue("is_featured", checked as boolean)}
                />
                <Label htmlFor="is_featured">Mettre en vedette</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/testimonials")}
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

export default TestimonialForm;
