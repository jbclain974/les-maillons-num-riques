-- Create homepage_actions table for managing "Nos Actions" vignettes
CREATE TABLE public.homepage_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'MessageCircle',
  color_class TEXT NOT NULL DEFAULT 'primary',
  position INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  link_anchor TEXT, -- anchor on /nos-actions page for navigation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_actions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Homepage actions are publicly readable"
  ON public.homepage_actions FOR SELECT
  USING (true);

-- Admin management
CREATE POLICY "Admins can manage homepage actions"
  ON public.homepage_actions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add hero_image to site_settings if not exists
INSERT INTO public.site_settings (key, value, description)
VALUES ('hero_image_url', '', 'URL de l''image de fond du hero sur la page d''accueil')
ON CONFLICT (key) DO NOTHING;

-- Seed initial homepage actions from current static data
INSERT INTO public.homepage_actions (title, description, icon, color_class, position, link_anchor) VALUES
  ('Groupes de Parole', 'Partage d''expériences dans un cadre bienveillant', 'MessageCircle', 'primary', 0, 'groupes-de-parole'),
  ('Ateliers Créatifs', 'Peinture, canevas, mosaïque pour s''exprimer', 'Palette', 'secondary', 1, 'ateliers-creatifs'),
  ('Ateliers Manuels', 'Jardinage, menuiserie, bricolage', 'Wrench', 'accent', 2, 'ateliers-manuels'),
  ('Atelier Musical', 'Expression artistique par la musique', 'Music', 'primary', 3, 'atelier-musical'),
  ('Sport & Résilience', 'Vélo, randonnées, préparation Grand Raid', 'Bike', 'secondary', 4, 'sport-resilience'),
  ('Permanence CHU Nord', 'Accompagnement addictologie', 'Building2', 'accent', 5, 'permanence-chu-nord'),
  ('Prévention Externe', 'Actions de sensibilisation', 'Users', 'primary', 6, 'prevention-sensibilisation');