# Schéma de Base de Données

## 📊 Vue d'Ensemble

Le schéma de la base de données PostgreSQL est conçu pour gérer tous les aspects d'une plateforme associative, avec un focus sur la sécurité et les permissions granulaires.

## 🗂️ Tables Principales

### 1. profiles
Table des profils utilisateurs, liée à `auth.users`.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,  -- Lié à auth.users(id)
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies:**
- ✅ Profils visibles par tous les utilisateurs authentifiés
- ✅ Utilisateurs peuvent mettre à jour leur propre profil
- ❌ Pas de suppression directe (cascade via auth.users)

---

### 2. user_roles
Table de gestion des rôles utilisateurs (système de permissions).

```sql
CREATE TYPE app_role AS ENUM ('admin', 'editor', 'animator');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);
```

**Rôles:**
- `admin`: Accès complet à toutes les fonctionnalités
- `editor`: Gestion du contenu (posts, events, testimonials)
- `animator`: Gestion des activités

**RLS Policies:**
- ✅ Admins peuvent gérer tous les rôles
- ✅ Utilisateurs peuvent voir leurs propres rôles

**Fonction de Sécurité:**
```sql
CREATE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

---

### 3. posts
Articles et actualités du site.

```sql
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  status content_status DEFAULT 'draft' NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies:**
- ✅ Articles publiés visibles publiquement
- ✅ Utilisateurs authentifiés voient tous les articles
- ✅ Admins et editors peuvent gérer les articles

---

### 4. events
Événements et actualités de l'association.

```sql
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  short_description TEXT,
  content TEXT,
  cover_image TEXT,
  video_url TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  gallery JSONB DEFAULT '[]',
  status content_status DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies:**
- ✅ Événements publiés visibles publiquement
- ✅ Utilisateurs authentifiés voient tous les événements
- ✅ Admins, editors et animators peuvent gérer les événements

---

### 5. activities
Ateliers et activités régulières.

```sql
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description_short TEXT,
  description_long TEXT,
  location TEXT,
  facilitator TEXT,
  start_time TIME,
  end_time TIME,
  days_of_week TEXT[],  -- ['lundi', 'mercredi', 'vendredi']
  capacity_max INTEGER,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies:**
- ✅ Activités actives visibles publiquement
- ✅ Utilisateurs authentifiés voient toutes les activités
- ✅ Admins, editors et animators peuvent gérer les activités

---

### 6. testimonials
Témoignages de bénéficiaires et partenaires.

```sql
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT,  -- 'text', 'video'
  photo_url TEXT,
  video_url TEXT,
  is_anonymous BOOLEAN DEFAULT false NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies:**
- ✅ Témoignages visibles publiquement
- ✅ Admins et editors peuvent gérer les témoignages

---

### 7. contact_messages
Messages du formulaire de contact.

```sql
CREATE TYPE message_status AS ENUM ('new', 'in_progress', 'resolved', 'archived');

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status message_status DEFAULT 'new' NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies:**
- ✅ N'importe qui peut soumettre un message
- ✅ Utilisateurs authentifiés peuvent voir les messages
- ✅ Admins et editors peuvent gérer les messages

---

### 8. faq_items
Questions fréquemment posées.

```sql
CREATE TABLE public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_position INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies:**
- ✅ FAQs publiées visibles publiquement
- ✅ Utilisateurs authentifiés voient toutes les FAQs
- ✅ Admins et editors peuvent gérer les FAQs

---

### 9. pages
Pages statiques personnalisables.

```sql
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies:**
- ✅ Pages visibles publiquement
- ✅ Admins et editors peuvent gérer les pages

---

### 10. media
Bibliothèque de médias (images, vidéos, documents).

```sql
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT,
  size BIGINT,
  category TEXT,
  alt_text TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies:**
- ✅ Médias visibles publiquement
- ✅ Utilisateurs authentifiés peuvent uploader des médias
- ✅ Admins et editors peuvent gérer tous les médias

---

### 11. site_settings
Paramètres globaux du site.

```sql
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies:**
- ✅ Paramètres visibles publiquement
- ✅ Seuls les admins peuvent modifier les paramètres

---

## 🔗 Relations

```
auth.users (Supabase)
    │
    ├──→ profiles (1:1)
    │
    ├──→ user_roles (1:N)
    │
    ├──→ posts.author_id (1:N)
    │
    └──→ media.uploaded_by (1:N)
```

## 🔐 Triggers et Fonctions

### handle_new_user()
Crée automatiquement un profil lors de l'inscription.

```sql
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
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
```

### assign_admin_to_first_user()
Attribue automatiquement le rôle admin au premier utilisateur.

```sql
CREATE FUNCTION public.assign_admin_to_first_user()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER assign_first_admin
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_admin_to_first_user();
```

### handle_updated_at()
Met à jour automatiquement le champ `updated_at`.

```sql
CREATE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Appliqué sur toutes les tables avec updated_at
```

## 📦 Storage Buckets

### media
Bucket public pour les images et fichiers médias.

```sql
-- Bucket configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

-- RLS Policies
CREATE POLICY "Media files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Admins and editors can manage all media"
ON storage.objects FOR ALL
USING (bucket_id = 'media' AND has_role(auth.uid(), 'admin'));
```

## 🔍 Indexes

```sql
-- Performance indexes
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(published_at);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_activities_active ON activities(is_active);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
```

## 📈 Diagramme ERD

```
┌──────────────┐
│ auth.users   │
│ (Supabase)   │
└──────┬───────┘
       │
       ├─────────────────────────────┐
       │                             │
       ▼                             ▼
┌─────────────┐              ┌──────────────┐
│  profiles   │              │  user_roles  │
├─────────────┤              ├──────────────┤
│ id (PK)     │              │ id (PK)      │
│ email       │              │ user_id (FK) │
│ full_name   │              │ role         │
│ avatar_url  │              └──────────────┘
└─────────────┘
       │
       │ (author_id)
       ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│    posts    │     │    events    │     │  activities  │
├─────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)     │     │ id (PK)      │     │ id (PK)      │
│ title       │     │ title        │     │ title        │
│ slug        │     │ slug         │     │ category     │
│ content     │     │ content      │     │ location     │
│ status      │     │ status       │     │ is_active    │
│ author_id   │     │ type         │     │ days_of_week │
└─────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ testimonials │    │contact_msgs  │    │  faq_items   │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ id (PK)      │    │ id (PK)      │    │ id (PK)      │
│ display_name │    │ name         │    │ question     │
│ content      │    │ email        │    │ answer       │
│ is_featured  │    │ message      │    │ category     │
│ photo_url    │    │ status       │    │ is_published │
└──────────────┘    └──────────────┘    └──────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    pages     │    │    media     │    │site_settings │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ id (PK)      │    │ id (PK)      │    │ key (PK)     │
│ slug         │    │ file_path    │    │ value        │
│ title        │    │ uploaded_by  │    │ description  │
│ content      │    │ category     │    └──────────────┘
│ seo_*        │    └──────────────┘
└──────────────┘
```

## 🔄 Migrations

Toutes les migrations sont versionnées dans `supabase/migrations/` et déployées automatiquement lors des modifications de schéma.
