import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HomepageAction {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color_class: string;
  position: number;
  is_visible: boolean;
  link_anchor: string | null;
}

export function useHomepageActions() {
  return useQuery({
    queryKey: ["public-homepage-actions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_actions")
        .select("*")
        .eq("is_visible", true)
        .order("position");
      if (error) throw error;
      return data as HomepageAction[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useHeroImageUrl() {
  return useQuery({
    queryKey: ["hero-image-url"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_image_url")
        .single();
      if (error) throw error;
      return data?.value || "";
    },
    staleTime: 1000 * 60 * 5,
  });
}
