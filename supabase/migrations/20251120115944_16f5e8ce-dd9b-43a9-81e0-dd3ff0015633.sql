-- ============================================
-- ÉTAPE 1.2: SCHÉMA COMPLET DE LA BASE DE DONNÉES
-- Les Maillons de l'Espoir - Application Full-Stack
-- ============================================

-- 1. Création de l'enum pour les rôles utilisateurs
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'animator', 'viewer');

-- 2. Création de l'enum pour les statuts de contenu
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');

-- 3. Création de l'enum pour les statuts de messages
CREATE TYPE public.message_status AS ENUM ('new', 'read', 'processed');

-- ============================================
-- TABLE: profiles (profils utilisateurs étendus)
-- ============================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour profiles
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- TABLE: user_roles (gestion sécurisée des rôles)
-- ============================================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction sécurisée pour vérifier les rôles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Politiques RLS pour user_roles
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- TABLE: pages (pages statiques du site)
-- ============================================
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour pages
CREATE POLICY "Pages are publicly readable"
  ON public.pages FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage pages"
  ON public.pages FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  );

-- ============================================
-- TABLE: posts (actualités/articles)
-- ============================================
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  category text,
  cover_image text,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status content_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour posts
CREATE POLICY "Published posts are publicly readable"
  ON public.posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can view all posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and editors can manage posts"
  ON public.posts FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  );

-- ============================================
-- TABLE: events (projets & événements)
-- ============================================
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text NOT NULL, -- 'caravane_velo', 'grand_raid', 'diner', 'loto', 'autre'
  start_date date,
  end_date date,
  location text,
  short_description text,
  content text,
  cover_image text,
  gallery jsonb DEFAULT '[]'::jsonb, -- Tableau d'URLs d'images
  video_url text,
  status content_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour events
CREATE POLICY "Published events are publicly readable"
  ON public.events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can view all events"
  ON public.events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins, editors and animators can manage events"
  ON public.events FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor') OR
    public.has_role(auth.uid(), 'animator')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor') OR
    public.has_role(auth.uid(), 'animator')
  );

-- ============================================
-- TABLE: activities (ateliers & actions)
-- ============================================
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL, -- 'groupe_parole', 'atelier_creatif', 'atelier_manuel', 'musical', 'sport', 'permanence_chu', 'prevention', 'autre'
  description_short text,
  description_long text,
  days_of_week text[], -- ['lundi', 'mercredi', 'vendredi']
  start_time time,
  end_time time,
  location text,
  facilitator text, -- Nom de l'animateur
  capacity_max integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour activities
CREATE POLICY "Active activities are publicly readable"
  ON public.activities FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all activities"
  ON public.activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins, editors and animators can manage activities"
  ON public.activities FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor') OR
    public.has_role(auth.uid(), 'animator')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor') OR
    public.has_role(auth.uid(), 'animator')
  );

-- ============================================
-- TABLE: testimonials (témoignages)
-- ============================================
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  content text NOT NULL,
  type text, -- 'retablissement', 'sport', 'atelier', 'grand_raid', etc.
  photo_url text,
  video_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_anonymous boolean NOT NULL DEFAULT false,
  order_position integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour testimonials
CREATE POLICY "Testimonials are publicly readable"
  ON public.testimonials FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  );

-- ============================================
-- TABLE: media (bibliothèque de médias)
-- ============================================
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path text NOT NULL,
  file_name text NOT NULL,
  alt_text text,
  category text, -- 'actualites', 'projets', 'ateliers', 'temoignages', 'general'
  size bigint, -- Taille en octets
  mime_type text,
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour media
CREATE POLICY "Media are publicly readable"
  ON public.media FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload media"
  ON public.media FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins and editors can manage all media"
  ON public.media FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  );

-- ============================================
-- TABLE: contact_messages (messages formulaire)
-- ============================================
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL, -- 'besoin_aide', 'info', 'partenariat', 'benevolat', 'autre'
  message text NOT NULL,
  status message_status NOT NULL DEFAULT 'new',
  notes text, -- Notes internes pour le traitement
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour contact_messages
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and editors can manage messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  );

-- ============================================
-- TABLE: faq_items (questions fréquentes)
-- ============================================
CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text, -- 'general', 'adhesion', 'ateliers', 'soutien', etc.
  order_position integer DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour faq_items
CREATE POLICY "Published FAQ items are publicly readable"
  ON public.faq_items FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all FAQ items"
  ON public.faq_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and editors can manage FAQ items"
  ON public.faq_items FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'editor')
  );

-- ============================================
-- TABLE: site_settings (paramètres du site)
-- ============================================
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour site_settings
CREATE POLICY "Settings are publicly readable"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGERS pour updated_at automatique
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Appliquer le trigger à toutes les tables avec updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.faq_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TRIGGER pour création automatique du profil
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- DONNÉES INITIALES (paramètres du site)
-- ============================================
INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_name', 'Les Maillons de l''Espoir', 'Nom de l''association'),
  ('address', '18 Allée Avé Maria, 97400 Saint-Denis', 'Adresse complète'),
  ('phone', '', 'Numéro de téléphone'),
  ('email', 'contact@maillonsespoir.re', 'Email de contact'),
  ('member_count', '120', 'Nombre d''adhérents'),
  ('abstinent_count', '80', 'Nombre d''adhérents abstinents'),
  ('membership_fee', '12', 'Cotisation annuelle en euros'),
  ('donation_link', '', 'Lien vers plateforme de don (HelloAsso, etc.)'),
  ('social_facebook', '', 'URL page Facebook'),
  ('social_instagram', '', 'URL compte Instagram'),
  ('social_youtube', '', 'URL chaîne YouTube');

-- Pages statiques initiales
INSERT INTO public.pages (slug, title, content, seo_title, seo_description) VALUES
  ('accueil', 'Accueil', 'Bienvenue sur le site des Maillons de l''Espoir', 'Les Maillons de l''Espoir - Association d''entraide à La Réunion', 'Groupe d''Entraide Mutuelle contre l''alcoolisme, l''exclusion et l''isolement à Saint-Denis, La Réunion'),
  ('association', 'L''Association', 'Présentation de l''association', 'Notre mission - Les Maillons de l''Espoir', 'Découvrez notre association et notre engagement contre l''alcoolisme et l''exclusion'),
  ('nos-actions', 'Nos Actions', 'Découvrez nos différentes actions', 'Nos Actions - Ateliers et Accompagnement', 'Groupes de parole, ateliers créatifs, sport et résilience pour lutter contre l''addiction'),
  ('soutenir', 'Soutenir l''Association', 'Comment nous soutenir', 'Soutenir notre action - Don et Bénévolat', 'Soutenez Les Maillons de l''Espoir par un don, une adhésion ou en devenant bénévole'),
  ('contact', 'Contact', 'Contactez-nous', 'Nous contacter - Les Maillons de l''Espoir', 'Contactez notre association à Saint-Denis de La Réunion'),
  ('mentions-legales', 'Mentions Légales', 'Mentions légales du site', 'Mentions Légales', 'Mentions légales et informations juridiques'),
  ('politique-confidentialite', 'Politique de Confidentialité', 'Notre politique de confidentialité', 'Politique de Confidentialité', 'Protection de vos données personnelles et politique RGPD');