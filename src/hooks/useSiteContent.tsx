import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  position: number;
  is_visible: boolean;
  parent_id: string | null;
}

interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  is_visible: boolean;
  settings: Record<string, unknown>;
}

interface SiteStatistic {
  id: string;
  stat_key: string;
  label: string;
  value: string;
  suffix: string | null;
  is_visible: boolean;
  position: number;
  section: string;
}

export function useNavigation() {
  return useQuery({
    queryKey: ["public-navigation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*")
        .eq("is_visible", true)
        .order("position");
      if (error) throw error;
      return data as NavigationItem[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useHomepageSections() {
  return useQuery({
    queryKey: ["public-homepage-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("*");
      if (error) throw error;
      
      // Convert to a map for easy access
      const sectionsMap: Record<string, HomepageSection> = {};
      data.forEach((section) => {
        sectionsMap[section.section_key] = section as HomepageSection;
      });
      return sectionsMap;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSiteStatistics(section?: string) {
  return useQuery({
    queryKey: ["public-site-statistics", section],
    queryFn: async () => {
      let query = supabase
        .from("site_statistics")
        .select("*")
        .eq("is_visible", true)
        .order("position");
      
      if (section) {
        query = query.eq("section", section);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as SiteStatistic[];
    },
    staleTime: 1000 * 60 * 5,
  });
}
