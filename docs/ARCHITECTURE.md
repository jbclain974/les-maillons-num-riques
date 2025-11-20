# Architecture Technique

## 🏗️ Vue d'Ensemble

Le projet suit une architecture moderne de type SPA (Single Page Application) avec un backend serverless.

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React SPA)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Public     │  │    Auth      │  │    Admin     │     │
│  │   Routes     │  │   System     │  │   Routes     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Component Library (shadcn-ui)                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│              LOVABLE CLOUD (Supabase Backend)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │     │
│  │   Database   │  │   Service    │  │   Buckets    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    Row Level Security (RLS) Policies                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Structure du Projet

```
src/
├── components/           # Composants React réutilisables
│   ├── admin/           # Composants spécifiques à l'admin
│   ├── auth/            # Composants d'authentification
│   ├── home/            # Composants de la page d'accueil
│   ├── layout/          # Composants de mise en page
│   └── ui/              # Composants UI (shadcn-ui)
├── pages/               # Pages de l'application
│   ├── admin/           # Pages de l'espace admin
│   └── [public pages]   # Pages publiques
├── hooks/               # Custom React hooks
├── lib/                 # Utilitaires et configurations
│   ├── auth.tsx         # Contexte d'authentification
│   └── utils.ts         # Fonctions utilitaires
├── integrations/        # Intégrations externes
│   └── supabase/        # Client et types Supabase
├── index.css            # Styles globaux et design tokens
└── App.tsx              # Point d'entrée et routing

docs/                    # Documentation complète
supabase/               # Configuration backend
├── config.toml         # Configuration Supabase
└── migrations/         # Migrations de base de données
```

## 🔐 Architecture de Sécurité

### Row Level Security (RLS)

Toutes les tables utilisent RLS pour garantir la sécurité des données :

```sql
-- Exemple de politique RLS
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all content"
ON public.posts FOR ALL
USING (has_role(auth.uid(), 'admin'));
```

### Système de Rôles

```
┌──────────────────────────────────────────────────────┐
│                    USER_ROLES                         │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  ADMIN   │  │  EDITOR  │  │ ANIMATOR │          │
│  │  (Full)  │  │ (Content)│  │(Activities)         │
│  └──────────┘  └──────────┘  └──────────┘          │
│       │             │              │                 │
│       └─────────────┴──────────────┘                │
│                     │                                │
│              has_role() function                     │
│         (Security Definer - Bypass RLS)             │
└──────────────────────────────────────────────────────┘
```

## 🔄 Flux de Données

### Authentification

```
User Input → AuthProvider → Supabase Auth → Session State
     ↓
Protected Routes Check → ProtectedRoute Component
     ↓
Allow/Redirect based on auth.uid()
```

### Opérations CRUD

```
User Action → React Component → Supabase Client
     ↓
RLS Policy Check (server-side)
     ↓
Database Operation
     ↓
React Query Cache Update
     ↓
UI Re-render
```

## 🎨 Architecture Frontend

### Routing

```typescript
<BrowserRouter>
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/association" element={<Association />} />
    <Route path="/contact" element={<Contact />} />
    
    {/* Protected Admin Routes */}
    <Route path="/admin/*" element={
      <ProtectedRoute>
        <AdminLayout>
          {/* Admin pages */}
        </AdminLayout>
      </ProtectedRoute>
    } />
  </Routes>
</BrowserRouter>
```

### State Management

- **Authentication State**: Context API (`AuthProvider`)
- **Server State**: React Query (`@tanstack/react-query`)
- **Form State**: React Hook Form (`react-hook-form`)
- **UI State**: Local component state (useState)

### Layouts

```
Public Layout:
┌─────────────────────────┐
│       Header            │ ← Navigation principale
├─────────────────────────┤
│                         │
│       Content           │ ← Pages publiques
│                         │
├─────────────────────────┤
│       Footer            │ ← Liens et informations
└─────────────────────────┘

Admin Layout:
┌──────┬──────────────────┐
│      │    Top Bar       │ ← Sidebar trigger
│ Side │                  │
│ bar  ├──────────────────┤
│      │                  │
│      │     Content      │ ← Pages admin
│      │                  │
└──────┴──────────────────┘
```

## 🛠️ Stack Technique Détaillé

### Frontend Core
- **React 18.3**: UI library avec hooks et concurrent features
- **TypeScript**: Type safety et meilleure DX
- **Vite**: Build tool ultra-rapide avec HMR

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn-ui**: Composants accessibles et customisables
- **Radix UI**: Primitives UI headless
- **Lucide React**: Icônes modernes

### Data & Forms
- **React Query**: Server state management et caching
- **React Hook Form**: Gestion de formulaires performante
- **Zod**: Validation de schémas TypeScript-first

### Routing & Navigation
- **React Router DOM v6**: Client-side routing

### Backend Services (Lovable Cloud)
- **Supabase Auth**: Authentification et gestion de sessions
- **PostgreSQL**: Base de données relationnelle
- **Supabase Storage**: Stockage de fichiers
- **Row Level Security**: Sécurité au niveau des lignes

## 🔌 Intégrations

### Supabase Client

```typescript
// Client configuré avec auth persistence
import { supabase } from "@/integrations/supabase/client";

// Types générés automatiquement
import type { Database } from "@/integrations/supabase/types";
```

### React Query

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
```

## 📊 Performance

### Optimisations
- Code splitting par route
- Lazy loading des composants
- Image optimization
- React Query caching
- Memoization (useMemo, useCallback)

### Monitoring
- Console logs en développement
- Error boundaries pour la gestion d'erreurs
- Loading states pour meilleure UX

## 🔄 CI/CD

Le projet utilise l'infrastructure Lovable pour le déploiement :
- **Frontend**: Déploiement automatique via mise à jour publish
- **Backend**: Déploiement automatique des migrations et edge functions
- **Preview**: URL de staging automatique

## 📱 Responsive Design

Le design est mobile-first avec breakpoints Tailwind :
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔍 SEO

- Meta tags dynamiques par page
- Semantic HTML
- Structured data (JSON-LD)
- Sitemap et robots.txt
- Performance optimisée (Core Web Vitals)
