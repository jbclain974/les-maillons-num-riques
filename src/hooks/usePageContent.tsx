import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PageContent {
  [key: string]: string;
}

export const usePageContent = (pageSlug: string) => {
  const [content, setContent] = useState<PageContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [pageSlug]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("content_key, content_value")
        .eq("page_slug", pageSlug);

      if (error) throw error;

      const contentMap: PageContent = {};
      data?.forEach((item) => {
        if (item.content_value) {
          contentMap[item.content_key] = item.content_value;
        }
      });
      setContent(contentMap);
    } catch (error) {
      console.error("Erreur lors du chargement du contenu:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = useCallback(
    async (contentKey: string, newValue: string) => {
      try {
        // Upsert the content (insert or update)
        const { error } = await supabase
          .from("page_content")
          .upsert(
            {
              page_slug: pageSlug,
              content_key: contentKey,
              content_value: newValue,
              content_type: "text",
            },
            {
              onConflict: "page_slug,content_key",
            }
          );

        if (error) throw error;

        // Update local state
        setContent((prev) => ({
          ...prev,
          [contentKey]: newValue,
        }));

        toast.success("Contenu mis à jour");
        return true;
      } catch (error: any) {
        console.error("Erreur lors de la mise à jour:", error);
        toast.error("Erreur lors de la mise à jour");
        return false;
      }
    },
    [pageSlug]
  );

  const getContent = useCallback(
    (contentKey: string, defaultValue: string): string => {
      return content[contentKey] ?? defaultValue;
    },
    [content]
  );

  return {
    content,
    loading,
    updateContent,
    getContent,
    refetch: fetchContent,
  };
};
