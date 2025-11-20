# Guide de Développement

## 🚀 Configuration de l'Environnement

### Prérequis

- **Node.js**: v18.0.0 ou supérieur
- **npm**: v9.0.0 ou supérieur
- **Git**: Pour le contrôle de version
- **Navigateur moderne**: Chrome, Firefox, Safari ou Edge (version récente)

### Installation Initiale

```bash
# 1. Cloner le repository
git clone <URL_DU_REPO>
cd <NOM_DU_PROJET>

# 2. Installer les dépendances
npm install

# 3. Vérifier la configuration
npm run dev
```

Le serveur de développement devrait démarrer sur `http://localhost:8080`

### Variables d'Environnement

Le fichier `.env` est généré automatiquement par Lovable Cloud et contient :

```env
# ⚠️ NE PAS MODIFIER CE FICHIER MANUELLEMENT
VITE_SUPABASE_URL=<auto-généré>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-généré>
VITE_SUPABASE_PROJECT_ID=<auto-généré>
```

---

## 📁 Structure du Projet Détaillée

```
├── src/
│   ├── components/          # Composants React réutilisables
│   │   ├── admin/           # Composants de l'interface admin
│   │   │   ├── AdminLayout.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── auth/            # Composants d'authentification
│   │   │   └── ProtectedRoute.tsx
│   │   ├── home/            # Composants de la page d'accueil
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ActionsOverview.tsx
│   │   │   └── CTASection.tsx
│   │   ├── layout/          # Composants de mise en page
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/              # Composants shadcn-ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       └── ... (40+ composants)
│   │
│   ├── pages/               # Pages de l'application
│   │   ├── Home.tsx
│   │   ├── Association.tsx
│   │   ├── Contact.tsx
│   │   └── admin/           # Pages admin
│   │       ├── Dashboard.tsx
│   │       ├── Posts.tsx
│   │       ├── Events.tsx
│   │       └── ...
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/                 # Utilitaires et configurations
│   │   ├── auth.tsx         # Contexte d'authentification
│   │   └── utils.ts         # Fonctions utilitaires
│   │
│   ├── integrations/        # Intégrations externes
│   │   └── supabase/
│   │       ├── client.ts    # ⚠️ Auto-généré
│   │       └── types.ts     # ⚠️ Auto-généré
│   │
│   ├── assets/              # Assets statiques (images, etc.)
│   ├── index.css            # Styles globaux + design tokens
│   ├── App.tsx              # Point d'entrée + routing
│   └── main.tsx             # Bootstrap React
│
├── public/                  # Fichiers publics
│   ├── robots.txt
│   └── ...
│
├── docs/                    # Documentation (ce dossier)
│
├── supabase/                # Configuration backend
│   ├── config.toml          # ⚠️ Auto-généré
│   └── migrations/          # Migrations SQL
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

### Fichiers à NE PAS Modifier

Ces fichiers sont auto-générés et mis à jour automatiquement :

- ⚠️ `.env`
- ⚠️ `supabase/config.toml`
- ⚠️ `src/integrations/supabase/client.ts`
- ⚠️ `src/integrations/supabase/types.ts`

---

## 🛠️ Commandes de Développement

### Scripts NPM

```bash
# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build

# Preview du build de production
npm run preview

# Linter (vérification du code)
npm run lint

# Type checking TypeScript
npm run type-check  # Si disponible
```

### Hot Module Replacement (HMR)

Vite fournit un HMR ultra-rapide. Les changements dans le code sont reflétés instantanément dans le navigateur sans rafraîchissement complet.

---

## 🎨 Développement de Composants

### Créer un Nouveau Composant

```tsx
// src/components/MyComponent.tsx
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  description?: string;
}

const MyComponent: FC<MyComponentProps> = ({ title, description }) => {
  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default MyComponent;
```

### Bonnes Pratiques

1. **Typage strict avec TypeScript**
   ```tsx
   // ✅ Bon
   interface Props {
     name: string;
     age: number;
   }
   
   // ❌ Éviter
   const MyComponent = (props: any) => { ... }
   ```

2. **Utiliser les Design Tokens**
   ```tsx
   // ✅ Bon
   <div className="bg-primary text-primary-foreground">
   
   // ❌ Éviter
   <div className="bg-blue-500 text-white">
   ```

3. **Décomposer les gros composants**
   ```tsx
   // Créer des sous-composants au lieu d'un composant monolithique
   <Card>
     <CardHeader />
     <CardContent />
     <CardFooter />
   </Card>
   ```

4. **Memoization pour performance**
   ```tsx
   import { memo, useCallback, useMemo } from 'react';
   
   const ExpensiveComponent = memo(({ data }) => {
     const processedData = useMemo(() => {
       return data.map(/* transformation coûteuse */);
     }, [data]);
     
     return <div>{/* render */}</div>;
   });
   ```

---

## 🔌 Intégration Backend (Supabase)

### Client Supabase

```tsx
import { supabase } from "@/integrations/supabase/client";

// Exemple de requête
const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
```

### Avec React Query

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

// Query
const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published');
      
      if (error) throw error;
      return data;
    },
  });
};

// Mutation
const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPost) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(newPost)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
```

---

## 📝 Gestion des Formulaires

### Avec React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Schéma de validation
const postSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères'),
  status: z.enum(['draft', 'published', 'archived']),
});

type PostFormValues = z.infer<typeof postSchema>;

const PostForm = () => {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'draft',
    },
  });
  
  const onSubmit = async (values: PostFormValues) => {
    // Logique de soumission
    console.log(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre de l'article" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Enregistrer</Button>
      </form>
    </Form>
  );
};
```

---

## 🔐 Authentification

### Utiliser le Contexte d'Auth

```tsx
import { useAuth } from '@/lib/auth';

const MyComponent = () => {
  const { user, loading, signIn, signOut } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  
  if (!user) {
    return <button onClick={() => signIn(email, password)}>Connexion</button>;
  }
  
  return (
    <div>
      <p>Connecté en tant que {user.email}</p>
      <button onClick={signOut}>Déconnexion</button>
    </div>
  );
};
```

### Routes Protégées

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 🎭 Gestion d'État

### Context API (Auth)

```tsx
// Déjà implémenté dans src/lib/auth.tsx
import { AuthProvider, useAuth } from '@/lib/auth';

// Dans App.tsx
<AuthProvider>
  <YourApp />
</AuthProvider>
```

### React Query (Server State)

```tsx
// Configuration globale
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

---

## 🐛 Debugging

### Console Logs

```tsx
// Development only
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}
```

### React DevTools

Installer l'extension React Developer Tools pour Chrome/Firefox.

### Network Tab

Utiliser l'onglet Network des DevTools pour inspecter les requêtes Supabase.

### Error Boundaries

```tsx
import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Une erreur s'est produite.</h1>;
    }
    
    return this.props.children;
  }
}
```

---

## ✅ Tests (À Implémenter)

### Structure Recommandée

```
src/
├── components/
│   ├── MyComponent.tsx
│   └── MyComponent.test.tsx
```

### Exemple avec Vitest + React Testing Library

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

## 📦 Ajout de Dépendances

```bash
# Ajouter une nouvelle dépendance
npm install <package-name>

# Ajouter une dépendance de développement
npm install -D <package-name>
```

**Note**: Les modifications de `package.json` sont automatiquement gérées.

---

## 🎨 Styling

### Tailwind CSS

```tsx
// Utiliser les classes Tailwind
<div className="flex items-center justify-between p-4 bg-card rounded-lg">
  <span className="text-foreground font-medium">Titre</span>
  <Button size="sm">Action</Button>
</div>
```

### Classe Conditionnelle

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}>
```

---

## 🔄 Git Workflow

### Branches

```bash
# Créer une nouvelle branche pour une feature
git checkout -b feature/ma-nouvelle-feature

# Commit
git add .
git commit -m "feat: description de la feature"

# Push
git push origin feature/ma-nouvelle-feature
```

### Conventional Commits

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour documentation
style: formatage du code
refactor: refactoring
test: ajout de tests
chore: tâches diverses
```

---

## 🚀 Performance

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));

<Suspense fallback={<div>Chargement...</div>}>
  <AdminDashboard />
</Suspense>
```

### Image Optimization

```tsx
<img 
  src="/image.jpg" 
  alt="Description"
  loading="lazy"  // Lazy load natif
  width={800}
  height={600}
/>
```

---

## 📚 Ressources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn-ui Components](https://ui.shadcn.com/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/)

---

## 💡 Conseils

1. **Commit souvent** avec des messages clairs
2. **Tester en mobile** régulièrement
3. **Utiliser TypeScript** pour éviter les bugs
4. **Performance first**: Lazy load, memoization
5. **Accessibilité**: ARIA labels, semantic HTML
6. **Code review**: Peer review avant merge
7. **Documentation**: Commenter le code complexe
