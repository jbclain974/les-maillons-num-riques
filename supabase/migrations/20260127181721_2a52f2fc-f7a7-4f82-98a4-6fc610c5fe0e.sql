-- Table pour les éléments de navigation/menus
CREATE TABLE public.navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  position integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  target text DEFAULT '_self',
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour le contenu des sections de la page d'accueil
CREATE TABLE public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text,
  subtitle text,
  content text,
  is_visible boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table pour les statistiques affichées sur le site
CREATE TABLE public.site_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_key text UNIQUE NOT NULL,
  label text NOT NULL,
  value text NOT NULL,
  suffix text,
  is_visible boolean DEFAULT true,
  position integer DEFAULT 0,
  section text DEFAULT 'hero',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Navigation items are publicly readable" ON public.navigation_items FOR SELECT USING (true);
CREATE POLICY "Homepage sections are publicly readable" ON public.homepage_sections FOR SELECT USING (true);
CREATE POLICY "Site statistics are publicly readable" ON public.site_statistics FOR SELECT USING (true);

-- Admin management policies
CREATE POLICY "Admins can manage navigation" ON public.navigation_items FOR ALL 
  USING (has_role(auth.uid(), 'admin')) 
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage homepage sections" ON public.homepage_sections FOR ALL 
  USING (has_role(auth.uid(), 'admin')) 
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage statistics" ON public.site_statistics FOR ALL 
  USING (has_role(auth.uid(), 'admin')) 
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON public.navigation_items 
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON public.homepage_sections 
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_site_statistics_updated_at BEFORE UPDATE ON public.site_statistics 
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert default navigation items
INSERT INTO public.navigation_items (label, url, position, is_visible) VALUES
  ('Accueil', '/', 0, true),
  ('L''Association', '/association', 1, true),
  ('Nos Actions', '/nos-actions', 2, true),
  ('Projets & Événements', '/projets', 3, true),
  ('Actualités', '/actualites', 4, true),
  ('Témoignages', '/temoignages', 5, true),
  ('Contact', '/contact', 6, true);

-- Insert default homepage sections
INSERT INTO public.homepage_sections (section_key, title, subtitle, content, is_visible, settings) VALUES
  ('hero_badge', 'Depuis 2007 à La Réunion', NULL, NULL, true, '{}'),
  ('hero_main', 'Ensemble contre l''alcoolisme, l''exclusion et l''isolement', NULL, 
   'Les Maillons de l''Espoir est un Groupe d''Entraide Mutuelle (GEM) qui accompagne les personnes en difficulté à travers des ateliers, du sport et de l''entraide à Saint-Denis.', 
   true, '{"highlight_words": ["alcoolisme", "exclusion", "isolement"]}'),
  ('cta_help', 'Besoin d''aide ?', NULL, 'Vous ou un proche êtes en difficulté ? Nous sommes là pour vous écouter et vous accompagner.', true, '{}'),
  ('cta_join', 'Rejoindre', NULL, 'Participez à nos ateliers et trouvez du soutien au sein d''un groupe bienveillant.', true, '{}'),
  ('cta_support', 'Soutenir', NULL, 'Aidez-nous à poursuivre notre mission par un don, une adhésion ou comme bénévole.', true, '{}');

-- Insert default statistics
INSERT INTO public.site_statistics (stat_key, label, value, suffix, is_visible, position, section) VALUES
  ('adherents', 'Adhérents', '120', NULL, true, 0, 'hero'),
  ('abstinents', 'Abstinents', '80', NULL, true, 1, 'hero'),
  ('taux_abstinence', 'Taux d''abstinence', '66', '%', true, 2, 'hero_badge');