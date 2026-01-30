import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import EditablePageText from "@/components/editable/EditablePageText";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  cover_image: string | null;
  published_at: string | null;
}

const Actualites = () => {
  const { getContent, updateContent } = usePageContent("actualites");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <EditablePageText
              value={getContent("hero_title", "Actualités")}
              onSave={(v) => updateContent("hero_title", v)}
              as="h1"
              className="mb-6"
            />
            <EditablePageText
              value={getContent(
                "hero_subtitle",
                "Suivez nos dernières nouvelles, événements et réussites"
              )}
              onSave={(v) => updateContent("hero_subtitle", v)}
              as="p"
              className="text-xl text-muted-foreground"
              multiline
            />
          </div>
        </div>
      </section>

      {/* Liste des actualités */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune actualité pour le moment</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    {/* Image placeholder */}
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg" />
                    )}
                    
                    <div className="p-6 space-y-3">
                      {post.category && (
                        <Badge variant="secondary">{post.category}</Badge>
                      )}
                      
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      
                      {post.published_at && (
                        <div className="flex items-center text-sm text-muted-foreground pt-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(post.published_at), "d MMMM yyyy", { locale: fr })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Actualites;
