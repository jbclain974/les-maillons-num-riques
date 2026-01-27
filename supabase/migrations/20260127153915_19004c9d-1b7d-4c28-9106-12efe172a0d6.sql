-- ==============================================
-- SYSTÈME DE PERMISSIONS GRANULAIRES PAR SECTION
-- ==============================================

-- Enum pour les modules/sections du site
CREATE TYPE public.app_module AS ENUM (
  'dashboard',
  'pages',
  'posts',
  'events',
  'activities',
  'testimonials',
  'messages',
  'media',
  'users',
  'settings',
  'members'
);

-- Enum pour les actions possibles
CREATE TYPE public.app_permission AS ENUM (
  'view',
  'create',
  'edit',
  'delete',
  'publish',
  'validate'
);

-- Enum pour le statut de validation multi-niveaux
CREATE TYPE public.validation_status AS ENUM (
  'draft',
  'pending_editor',
  'pending_admin',
  'published',
  'rejected'
);

-- Table des permissions par rôle et section
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  module app_module NOT NULL,
  permission app_permission NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(role, module, permission)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS: Lecture publique pour vérifier les permissions, gestion par admin
CREATE POLICY "Role permissions are publicly readable" ON public.role_permissions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage role permissions" ON public.role_permissions
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- ==============================================
-- WORKFLOW DE VALIDATION MULTI-NIVEAUX
-- ==============================================

-- Ajouter colonnes validation aux posts
ALTER TABLE public.posts 
  ADD COLUMN validation_status validation_status NOT NULL DEFAULT 'draft',
  ADD COLUMN submitted_by UUID REFERENCES public.profiles(id),
  ADD COLUMN reviewed_by UUID REFERENCES public.profiles(id),
  ADD COLUMN validated_by UUID REFERENCES public.profiles(id),
  ADD COLUMN review_notes TEXT,
  ADD COLUMN rejection_reason TEXT,
  ADD COLUMN submitted_at TIMESTAMPTZ,
  ADD COLUMN reviewed_at TIMESTAMPTZ,
  ADD COLUMN validated_at TIMESTAMPTZ;

-- Ajouter colonnes validation aux events
ALTER TABLE public.events 
  ADD COLUMN validation_status validation_status NOT NULL DEFAULT 'draft',
  ADD COLUMN submitted_by UUID REFERENCES public.profiles(id),
  ADD COLUMN reviewed_by UUID REFERENCES public.profiles(id),
  ADD COLUMN validated_by UUID REFERENCES public.profiles(id),
  ADD COLUMN review_notes TEXT,
  ADD COLUMN rejection_reason TEXT,
  ADD COLUMN submitted_at TIMESTAMPTZ,
  ADD COLUMN reviewed_at TIMESTAMPTZ,
  ADD COLUMN validated_at TIMESTAMPTZ;

-- Table pour historique des validations
CREATE TABLE public.validation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- 'post', 'event', 'activity'
  content_id UUID NOT NULL,
  from_status validation_status,
  to_status validation_status NOT NULL,
  action_by UUID NOT NULL REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.validation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view validation history" ON public.validation_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create validation history entries" ON public.validation_history
  FOR INSERT TO authenticated WITH CHECK (action_by = auth.uid());

-- ==============================================
-- ESPACE ADHÉRENTS COMPLET
-- ==============================================

-- Enrichir la table profiles pour les adhérents
ALTER TABLE public.profiles
  ADD COLUMN bio TEXT,
  ADD COLUMN phone TEXT,
  ADD COLUMN address TEXT,
  ADD COLUMN date_of_birth DATE,
  ADD COLUMN membership_start DATE,
  ADD COLUMN membership_end DATE,
  ADD COLUMN emergency_contact TEXT,
  ADD COLUMN emergency_phone TEXT,
  ADD COLUMN is_active_member BOOLEAN DEFAULT false,
  ADD COLUMN badges JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN participation_count INTEGER DEFAULT 0;

-- Table des inscriptions aux activités
CREATE TABLE public.activity_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended', 'no_show')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(user_id, activity_id)
);

ALTER TABLE public.activity_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their registrations" ON public.activity_registrations
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'animator'));

CREATE POLICY "Users can register themselves" ON public.activity_registrations
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own registrations" ON public.activity_registrations
  FOR UPDATE TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations" ON public.activity_registrations
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Table des inscriptions aux événements
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended', 'no_show')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(user_id, event_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their event registrations" ON public.event_registrations
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'animator'));

CREATE POLICY "Users can register to events" ON public.event_registrations
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their event registrations" ON public.event_registrations
  FOR UPDATE TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete event registrations" ON public.event_registrations
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Table des messages communautaires (forum simple)
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view community posts" ON public.community_posts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Active members can create community posts" ON public.community_posts
  FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and admins can update community posts" ON public.community_posts
  FOR UPDATE TO authenticated USING (author_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete community posts" ON public.community_posts
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Table des réponses aux messages communautaires
CREATE TABLE public.community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view replies" ON public.community_replies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Active members can create replies" ON public.community_replies
  FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and admins can update replies" ON public.community_replies
  FOR UPDATE TO authenticated USING (author_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete replies" ON public.community_replies
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ==============================================
-- DOCUMENTS INTERNES POUR ADHÉRENTS
-- ==============================================

CREATE TABLE public.member_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES public.profiles(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.member_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view documents" ON public.member_documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and editors can manage documents" ON public.member_documents
  FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

-- ==============================================
-- FONCTION DE VÉRIFICATION PERMISSION PAR MODULE
-- ==============================================

CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _module app_module, _permission app_permission)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Admin a toujours toutes les permissions
  IF has_role(_user_id, 'admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Récupérer le rôle de l'utilisateur
  SELECT role INTO user_role FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
  
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Vérifier si le rôle a cette permission pour ce module
  RETURN EXISTS (
    SELECT 1 FROM public.role_permissions
    WHERE role = user_role
      AND module = _module
      AND permission = _permission
  );
END;
$$;

-- ==============================================
-- PERMISSIONS PAR DÉFAUT
-- ==============================================

-- Admin: toutes les permissions (implicites via has_permission)

-- Editor: peut tout faire sur le contenu sauf users/settings
INSERT INTO public.role_permissions (role, module, permission) VALUES
  ('editor', 'pages', 'view'), ('editor', 'pages', 'create'), ('editor', 'pages', 'edit'), ('editor', 'pages', 'delete'), ('editor', 'pages', 'publish'),
  ('editor', 'posts', 'view'), ('editor', 'posts', 'create'), ('editor', 'posts', 'edit'), ('editor', 'posts', 'delete'), ('editor', 'posts', 'publish'), ('editor', 'posts', 'validate'),
  ('editor', 'events', 'view'), ('editor', 'events', 'create'), ('editor', 'events', 'edit'), ('editor', 'events', 'delete'), ('editor', 'events', 'publish'), ('editor', 'events', 'validate'),
  ('editor', 'activities', 'view'), ('editor', 'activities', 'create'), ('editor', 'activities', 'edit'), ('editor', 'activities', 'delete'),
  ('editor', 'testimonials', 'view'), ('editor', 'testimonials', 'create'), ('editor', 'testimonials', 'edit'), ('editor', 'testimonials', 'delete'),
  ('editor', 'messages', 'view'),
  ('editor', 'media', 'view'), ('editor', 'media', 'create'), ('editor', 'media', 'edit'), ('editor', 'media', 'delete'),
  ('editor', 'dashboard', 'view'),
  ('editor', 'members', 'view');

-- Animator: peut gérer events et activities
INSERT INTO public.role_permissions (role, module, permission) VALUES
  ('animator', 'events', 'view'), ('animator', 'events', 'create'), ('animator', 'events', 'edit'),
  ('animator', 'activities', 'view'), ('animator', 'activities', 'create'), ('animator', 'activities', 'edit'),
  ('animator', 'dashboard', 'view'),
  ('animator', 'members', 'view');

-- Viewer: lecture seule
INSERT INTO public.role_permissions (role, module, permission) VALUES
  ('viewer', 'dashboard', 'view'),
  ('viewer', 'members', 'view');

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_community_replies_updated_at BEFORE UPDATE ON public.community_replies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();