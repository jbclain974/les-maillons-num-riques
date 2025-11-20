# Système de Design

## 🎨 Philosophie de Design

Le système de design est construit sur les principes suivants :
- **Cohérence**: Design tokens réutilisables pour une expérience unifiée
- **Accessibilité**: Composants conformes WCAG 2.1 AA minimum
- **Responsive**: Mobile-first avec breakpoints fluides
- **Thématisation**: Support dark/light mode via CSS variables
- **Performance**: Optimisé avec Tailwind CSS et classes utilitaires

## 🌈 Couleurs et Tokens

### Palette de Couleurs (HSL)

Toutes les couleurs sont définies en HSL dans `src/index.css` pour faciliter la thématisation.

```css
:root {
  /* Primary Colors */
  --primary: 221 83% 53%;           /* Bleu principal */
  --primary-foreground: 210 40% 98%; /* Texte sur primary */
  
  /* Secondary Colors */
  --secondary: 210 40% 96%;         /* Gris clair */
  --secondary-foreground: 222 47% 11%; /* Texte sur secondary */
  
  /* Accent Colors */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;
  
  /* Destructive/Error */
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;
  
  /* Background & Surfaces */
  --background: 0 0% 100%;          /* Fond principal */
  --foreground: 222 47% 11%;        /* Texte principal */
  
  /* Muted Elements */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  
  /* Card Components */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  
  /* Popovers & Dropdowns */
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  
  /* Borders */
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  
  /* Ring (Focus states) */
  --ring: 221 83% 53%;
  
  /* Radius */
  --radius: 0.5rem;
}

.dark {
  --primary: 217 91% 60%;
  --primary-foreground: 222 47% 11%;
  
  --secondary: 217 33% 17%;
  --secondary-foreground: 210 40% 98%;
  
  --accent: 217 33% 17%;
  --accent-foreground: 210 40% 98%;
  
  --destructive: 0 63% 31%;
  --destructive-foreground: 210 40% 98%;
  
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  
  --muted: 223 47% 11%;
  --muted-foreground: 215 16% 65%;
  
  --card: 224 71% 4%;
  --card-foreground: 213 31% 91%;
  
  --popover: 224 71% 4%;
  --popover-foreground: 213 31% 91%;
  
  --border: 216 34% 17%;
  --input: 216 34% 17%;
  
  --ring: 216 34% 17%;
}
```

### Utilisation des Tokens

```tsx
// ✅ CORRECT - Utiliser les tokens sémantiques
<Button className="bg-primary text-primary-foreground">
  Action
</Button>

<Card className="bg-card border-border">
  <CardHeader className="text-card-foreground">
    Titre
  </CardHeader>
</Card>

// ❌ INCORRECT - Éviter les couleurs directes
<div className="bg-blue-500 text-white">  // Ne pas faire
```

## 📐 Espacement et Dimensionnement

### Échelle d'Espacement

Tailwind fournit une échelle cohérente basée sur des multiples de 0.25rem (4px) :

```
0.5  → 2px
1    → 4px
2    → 8px
3    → 12px
4    → 16px
5    → 20px
6    → 24px
8    → 32px
10   → 40px
12   → 48px
16   → 64px
20   → 80px
24   → 96px
```

### Conventions d'Espacement

```tsx
// Padding intérieur des composants
<div className="p-4 md:p-6 lg:p-8">  // Mobile → Desktop

// Marges entre sections
<section className="space-y-6">      // Espacement vertical
<section className="space-x-4">      // Espacement horizontal

// Gaps dans les grids/flex
<div className="grid gap-4 md:gap-6">
```

## 📝 Typographie

### Échelle de Police

```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Échelle de tailles */
.text-xs     → 0.75rem (12px)
.text-sm     → 0.875rem (14px)
.text-base   → 1rem (16px)
.text-lg     → 1.125rem (18px)
.text-xl     → 1.25rem (20px)
.text-2xl    → 1.5rem (24px)
.text-3xl    → 1.875rem (30px)
.text-4xl    → 2.25rem (36px)
.text-5xl    → 3rem (48px)
```

### Hiérarchie de Titres

```tsx
// H1 - Page principale
<h1 className="text-4xl md:text-5xl font-bold text-foreground">

// H2 - Sections principales
<h2 className="text-3xl md:text-4xl font-semibold text-foreground">

// H3 - Sous-sections
<h3 className="text-2xl md:text-3xl font-semibold text-foreground">

// H4 - Titres de cartes
<h4 className="text-xl font-medium text-foreground">

// Body Text
<p className="text-base text-muted-foreground leading-relaxed">
```

## 🧩 Composants UI (shadcn-ui)

Tous les composants UI sont basés sur Radix UI et personnalisables via variants.

### Button

```tsx
import { Button } from "@/components/ui/button";

// Variants disponibles
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Contenu principal
  </CardContent>
  <CardFooter>
    Actions
  </CardFooter>
</Card>
```

### Form

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="email@example.com" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Ouvrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Contenu */}
  </DialogContent>
</Dialog>
```

## 📱 Responsive Design

### Breakpoints Tailwind

```tsx
// Mobile First Approach
<div className="w-full md:w-1/2 lg:w-1/3">

// Breakpoints:
// default (mobile): < 640px
// sm: >= 640px
// md: >= 768px
// lg: >= 1024px
// xl: >= 1280px
// 2xl: >= 1536px
```

### Grid Responsive

```tsx
// Grid adaptatif
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>

// Flex adaptatif
<div className="flex flex-col md:flex-row gap-4">
```

## 🎭 Animations et Transitions

```css
/* Transitions globales (index.css) */
* {
  @apply transition-colors duration-200;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}

/* Animations personnalisées */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}
```

## ♿ Accessibilité

### Focus States

```tsx
// Toujours inclure des focus states visibles
<button className="focus:ring-2 focus:ring-ring focus:ring-offset-2">
  Action
</button>
```

### ARIA Labels

```tsx
<Button aria-label="Fermer le dialog">
  <X className="h-4 w-4" />
</Button>

<img src="/image.jpg" alt="Description détaillée" />
```

### Contraste

- **Texte normal**: Ratio minimum 4.5:1
- **Texte large**: Ratio minimum 3:1
- **Éléments interactifs**: Ratio minimum 3:1

## 🔧 Configuration Tailwind

```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... autres couleurs
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## 📦 Composants Personnalisés

### NavLink

```tsx
// Composant de navigation avec état actif
import NavLink from "@/components/NavLink";

<NavLink to="/about" className="text-foreground hover:text-primary">
  À propos
</NavLink>
```

### Layout Components

```tsx
// Header, Footer, Layout
import Layout from "@/components/layout/Layout";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

<Layout>
  {/* Votre contenu */}
</Layout>
```

## 🎯 Best Practices

1. **Toujours utiliser les design tokens** plutôt que des couleurs directes
2. **Mobile-first** dans l'approche responsive
3. **Composer des composants** plutôt que dupliquer du code
4. **Utiliser les variants** des composants shadcn-ui
5. **Respecter l'accessibilité** (ARIA, focus, contraste)
6. **Tester en dark mode** systématiquement
7. **Optimiser les performances** (lazy loading, memoization)

## 📚 Ressources

- [shadcn-ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
