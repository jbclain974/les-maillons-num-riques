# Guide de Déploiement

## 🚀 Déploiement via Lovable

### Vue d'Ensemble

Le projet utilise l'infrastructure Lovable pour un déploiement simplifié et automatisé.

**Caractéristiques:**
- ✅ Déploiement automatique du frontend
- ✅ Déploiement automatique des migrations DB
- ✅ URL de staging automatique
- ✅ SSL/HTTPS intégré
- ✅ CDN global

---

## 📱 Déploiement Frontend

### Étapes de Déploiement

1. **Accéder au Bouton Publish**
   - Desktop: En haut à droite de l'éditeur
   - Mobile: En bas à droite en mode Preview

2. **Publier les Changements**
   - Cliquer sur "Publish"
   - Vérifier les changements listés
   - Cliquer sur "Update" pour déployer

3. **Vérification**
   - Attendre la fin du déploiement (généralement < 2 min)
   - Visiter l'URL de production
   - Tester les fonctionnalités clés

### URL de Production

```
https://[votre-projet].lovable.app
```

### Staging vs Production

**Staging (automatique):**
- Accessible immédiatement lors du développement
- URL: `https://[votre-projet]-staging.lovable.app`
- Pas besoin de déployer manuellement

**Production:**
- Nécessite un clic sur "Update" dans le dialog Publish
- URL: `https://[votre-projet].lovable.app`
- Sert le contenu aux utilisateurs finaux

---

## 🗄️ Déploiement Backend

### Migrations de Base de Données

**Déploiement automatique:**
Les migrations sont déployées automatiquement lors de leur création via l'outil de migration.

```sql
-- Exemple de migration
-- Fichier: supabase/migrations/20250120000000_add_new_feature.sql

CREATE TABLE public.new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
ON public.new_table FOR SELECT
USING (true);
```

**Vérification:**
```bash
# Les types TypeScript sont auto-générés après migration
# Vérifier src/integrations/supabase/types.ts
```

### Edge Functions (Si Utilisées)

Les edge functions sont déployées automatiquement après modification.

**Structure:**
```
supabase/functions/
├── my-function/
│   └── index.ts
```

**Exemple de fonction:**
```typescript
// supabase/functions/my-function/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  return new Response(
    JSON.stringify({ message: "Hello from edge function!" }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

---

## 🔐 Secrets et Variables d'Environnement

### Variables Automatiques

Ces variables sont gérées automatiquement par Lovable Cloud :

```env
VITE_SUPABASE_URL=<auto>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto>
VITE_SUPABASE_PROJECT_ID=<auto>
```

### Ajouter des Secrets Personnalisés

Pour des intégrations tierces (Stripe, SendGrid, etc.) :

1. **Via l'interface Lovable:**
   - Project > Settings > Secrets
   - Ajouter la clé et la valeur

2. **Utilisation dans le code:**
   ```typescript
   const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
   ```

3. **Utilisation dans Edge Functions:**
   ```typescript
   const secretKey = Deno.env.get('SECRET_API_KEY');
   ```

---

## 🌍 Domaine Personnalisé

### Configuration

1. **Accéder aux paramètres de domaine:**
   - Project > Settings > Domains
   - Cliquer sur "Connect Domain"

2. **Configurer le DNS:**
   
   **Pour un domaine racine (example.com):**
   ```
   Type: A
   Name: @
   Value: [IP fournie par Lovable]
   ```
   
   **Pour un sous-domaine (www.example.com):**
   ```
   Type: CNAME
   Name: www
   Value: [domaine fourni par Lovable]
   ```

3. **Vérification:**
   - Attendre la propagation DNS (jusqu'à 48h, souvent < 1h)
   - Lovable vérifie automatiquement et active HTTPS

### SSL/HTTPS

- ✅ Certificat SSL automatique via Let's Encrypt
- ✅ Renouvellement automatique
- ✅ Redirection HTTP → HTTPS automatique

---

## 🔄 Process de Déploiement Complet

### Checklist Pre-Déploiement

```
□ Tests locaux passent
□ Pas d'erreurs dans la console
□ Responsive testé (mobile, tablet, desktop)
□ Migrations DB testées
□ Types TypeScript à jour
□ RLS policies vérifiées
□ Images optimisées
□ Performance acceptable
□ Accessibilité vérifiée (contraste, ARIA)
```

### Workflow Recommandé

1. **Développement Local**
   ```bash
   npm run dev
   # Tester les fonctionnalités
   ```

2. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: description"
   git push origin main
   ```

3. **Vérification Staging**
   - Tester sur l'URL staging
   - Valider avec l'équipe

4. **Déploiement Production**
   - Cliquer sur "Publish" > "Update"
   - Vérifier en production

5. **Post-Déploiement**
   - Tester les chemins critiques
   - Vérifier les logs (si erreurs)
   - Communiquer aux utilisateurs (si breaking changes)

---

## 📊 Monitoring et Logs

### Logs Backend (Supabase)

**Accéder aux logs:**
- Via Lovable interface: Project > Cloud > Logs

**Types de logs:**
- Database queries
- Auth events
- Edge function calls
- API requests

### Logs Frontend

**Console Browser:**
```typescript
// Production: Éviter les logs sensibles
if (import.meta.env.DEV) {
  console.log('Debug info');
}

// Alternative: Utiliser un service de logging
```

**Error Tracking (Recommandé):**
- Sentry
- LogRocket
- Rollbar

### Performance Monitoring

**Core Web Vitals:**
- Utiliser Lighthouse dans DevTools
- Vérifier :
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

---

## 🔧 Rollback et Recovery

### Rollback de Version

**Via Git:**
```bash
# Revenir à un commit précédent
git revert <commit-hash>
git push origin main

# Redéployer via Lovable
```

**Via Lovable:**
- Project > Settings > History
- Restaurer une version précédente

### Rollback de Migration DB

**⚠️ Attention**: Les rollbacks de DB sont délicats.

```sql
-- Créer une migration de rollback manuelle
-- supabase/migrations/20250120000001_rollback_feature.sql

DROP TABLE IF EXISTS public.new_table;
-- Restaurer l'état précédent
```

**Best Practice:**
- Toujours tester les migrations sur staging
- Avoir un plan de rollback
- Backup réguliers de la DB

---

## 💾 Backups

### Base de Données

**Lovable Cloud inclut:**
- ✅ Backups automatiques quotidiens
- ✅ Rétention selon le plan (7-30 jours)

**Backup manuel:**
Via Lovable interface:
- Cloud > Database > Export

**Restauration:**
- Contacter le support Lovable
- Ou importer le backup manuellement

### Médias (Storage)

**Backup des fichiers:**
```typescript
// Script de backup des fichiers Storage
import { supabase } from './client';

const backupStorage = async () => {
  const { data } = await supabase.storage
    .from('media')
    .list();
  
  // Télécharger tous les fichiers
  for (const file of data) {
    const { data: blob } = await supabase.storage
      .from('media')
      .download(file.name);
    
    // Sauvegarder localement ou sur S3
  }
};
```

---

## 🚦 CI/CD (Optionnel)

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Lovable

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      # Lovable déploie automatiquement après push
```

---

## 🔒 Sécurité en Production

### Checklist de Sécurité

```
□ HTTPS activé (SSL)
□ RLS policies en place sur toutes les tables
□ Pas de secrets hardcodés dans le code
□ Variables d'environnement sécurisées
□ Validation des inputs côté serveur
□ Rate limiting sur les endpoints sensibles
□ CORS configuré correctement
□ Headers de sécurité (CSP, X-Frame-Options)
□ Authentification robuste (pas d'anonymous signup)
□ Logs d'audit pour actions sensibles
```

### Configuration CORS

```typescript
// Si nécessaire, configurer dans edge functions
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

---

## 📈 Scaling

### Automatic Scaling

Lovable Cloud scale automatiquement :
- Frontend: CDN global
- Database: Selon le plan Lovable
- Storage: Illimité (selon plan)

### Optimisations

**Frontend:**
- Code splitting par route
- Lazy loading des images
- Compression Gzip/Brotli (automatique)
- Caching agressif des assets

**Backend:**
- Indexes sur colonnes fréquemment requêtées
- Connection pooling (automatique)
- Query optimization

**Database Indexes:**
```sql
-- Ajouter des indexes pour performance
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at DESC);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
```

---

## 🐛 Troubleshooting

### Erreurs Communes

**1. Build Failed**
```
Cause: Erreur TypeScript ou dépendance manquante
Solution: Vérifier les logs, corriger les erreurs, redéployer
```

**2. RLS Policy Error**
```
Cause: Politique RLS trop restrictive ou mal configurée
Solution: Vérifier les policies dans Database, ajuster
```

**3. 404 sur Routes**
```
Cause: React Router n'est pas configuré pour SPA
Solution: Vérifier la config Vite (devrait être OK par défaut)
```

**4. CORS Error**
```
Cause: Domaine non autorisé pour les requêtes API
Solution: Configurer CORS dans Supabase settings
```

### Logs de Debug

```bash
# Vérifier les logs backend
# Via Lovable: Project > Cloud > Logs

# Vérifier les logs frontend
# Ouvrir DevTools > Console dans le navigateur
```

---

## 📞 Support

### Lovable Support

- **Documentation**: [docs.lovable.dev](https://docs.lovable.dev/)
- **Discord**: [Lovable Community](https://discord.gg/lovable)
- **Email**: support@lovable.dev

### Urgences Production

En cas de problème critique en production :

1. Vérifier les logs (Cloud > Logs)
2. Rollback si nécessaire (Git revert)
3. Contacter le support Lovable
4. Documenter l'incident pour post-mortem

---

## ✅ Post-Déploiement

### Tests de Smoke

Après chaque déploiement, tester :

```
□ Page d'accueil charge correctement
□ Authentification fonctionne
□ CRUD sur entités principales (posts, events)
□ Formulaire de contact fonctionne
□ Images chargent correctement
□ Navigation fonctionne (toutes les routes)
□ Responsive OK (mobile, tablet, desktop)
□ Performance acceptable (< 3s load time)
```

### Communication

- Informer les stakeholders du déploiement
- Si breaking changes : communiquer aux utilisateurs
- Documenter les nouveautés dans CHANGELOG.md

---

## 📚 Ressources

- [Lovable Deployment Guide](https://docs.lovable.dev/deployment)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [React Production](https://react.dev/learn/start-a-new-react-project)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
