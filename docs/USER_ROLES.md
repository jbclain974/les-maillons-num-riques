# Rôles et Permissions

## 🎭 Vue d'Ensemble du Système de Rôles

Le système de rôles est basé sur une table dédiée `user_roles` avec contrôle d'accès granulaire via Row Level Security (RLS) de PostgreSQL.

### Architecture de Sécurité

```
┌─────────────────────────────────────────────────┐
│           UTILISATEUR AUTHENTIFIÉ                │
│              (auth.uid())                        │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│            TABLE: user_roles                     │
│  ┌──────────────────────────────────────┐       │
│  │ user_id │ role                        │       │
│  ├──────────────────────────────────────┤       │
│  │ uuid-1  │ admin                       │       │
│  │ uuid-2  │ editor                      │       │
│  │ uuid-3  │ animator                    │       │
│  └──────────────────────────────────────┘       │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│       FONCTION: has_role(user_id, role)         │
│         (SECURITY DEFINER)                       │
│                                                  │
│  Vérifie si l'utilisateur a le rôle demandé     │
│  Exécutée avec privilèges élevés                │
│  Bypass RLS pour éviter récursion               │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│        POLITIQUES RLS SUR TABLES                │
│                                                  │
│  USING (has_role(auth.uid(), 'admin'))          │
│  WITH CHECK (has_role(auth.uid(), 'editor'))    │
└─────────────────────────────────────────────────┘
```

## 👥 Rôles Disponibles

### ENUM app_role

```sql
CREATE TYPE app_role AS ENUM ('admin', 'editor', 'animator');
```

---

### 1. Admin (Administrateur)

**Niveau d'accès**: Complet (Super-utilisateur)

#### Permissions
- ✅ **Gestion complète des contenus** (tous types)
- ✅ **Gestion des utilisateurs et rôles**
- ✅ **Accès aux paramètres système**
- ✅ **Gestion des messages de contact**
- ✅ **Consultation de toutes les données**
- ✅ **Suppression de tout contenu**

#### Cas d'usage
- Direction de l'association
- Responsable IT
- Gestionnaire principal du site

#### Attribution
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'admin');
```

Le **premier utilisateur** inscrit reçoit automatiquement le rôle admin via trigger.

---

### 2. Editor (Éditeur)

**Niveau d'accès**: Gestion de contenu

#### Permissions
- ✅ **Articles** (Create, Read, Update, Delete)
- ✅ **Événements** (Create, Read, Update, Delete)
- ✅ **Témoignages** (Create, Read, Update, Delete)
- ✅ **Pages statiques** (Create, Read, Update, Delete)
- ✅ **FAQ** (Create, Read, Update, Delete)
- ✅ **Messages de contact** (Read, Update statut)
- ✅ **Médias** (Upload, gestion de la bibliothèque)
- ❌ Gestion des utilisateurs
- ❌ Gestion des rôles
- ❌ Paramètres système
- ❌ Suppression d'utilisateurs

#### Cas d'usage
- Responsable communication
- Rédacteur web
- Community manager
- Chargé de contenu

#### Attribution
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'editor');
```

---

### 3. Animator (Animateur)

**Niveau d'accès**: Gestion des activités

#### Permissions
- ✅ **Activités/Ateliers** (Create, Read, Update, Delete)
- ✅ **Événements** (Create, Read, Update, Delete)
- ✅ **Consultation** de tous les contenus
- ❌ Articles
- ❌ Témoignages
- ❌ Pages
- ❌ Messages de contact
- ❌ Gestion des utilisateurs
- ❌ Paramètres

#### Cas d'usage
- Animateurs d'ateliers
- Coordinateurs d'activités
- Responsables de projets terrain

#### Attribution
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'animator');
```

---

## 🔐 Implémentation Technique

### Fonction has_role()

```sql
CREATE OR REPLACE FUNCTION public.has_role(
  _user_id UUID, 
  _role app_role
)
RETURNS BOOLEAN
LANGUAGE SQL
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
```

**Caractéristiques clés:**
- `SECURITY DEFINER`: Exécution avec privilèges du propriétaire
- `STABLE`: Optimisation des requêtes (résultat constant pour mêmes params)
- `SET search_path`: Sécurité contre les attaques par injection de schéma

### Utilisation dans RLS

```sql
-- Exemple: Seuls les admins peuvent supprimer des posts
CREATE POLICY "Only admins can delete posts"
ON public.posts
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Exemple: Editors et admins peuvent créer des posts
CREATE POLICY "Editors and admins can create posts"
ON public.posts
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'editor')
);
```

### Vérification Côté Client

```typescript
// Hook useAuth
import { useAuth } from "@/lib/auth";

function AdminComponent() {
  const { user } = useAuth();
  
  // Vérifier le rôle côté client (pour UX)
  // ⚠️ JAMAIS pour la sécurité (toujours RLS côté serveur)
  const isAdmin = await supabase
    .rpc('has_role', { 
      _user_id: user.id, 
      _role: 'admin' 
    });
  
  if (!isAdmin.data) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <div>Admin Panel</div>;
}
```

⚠️ **IMPORTANT**: La vérification côté client est pour l'UX uniquement. La vraie sécurité est assurée par RLS côté serveur.

---

## 📋 Matrice Complète des Permissions

| Ressource | Opération | Admin | Editor | Animator | Public |
|-----------|-----------|-------|--------|----------|--------|
| **Articles** |
| | Lire (published) | ✅ | ✅ | ✅ | ✅ |
| | Lire (all) | ✅ | ✅ | ✅ | ❌ |
| | Créer | ✅ | ✅ | ❌ | ❌ |
| | Modifier | ✅ | ✅ | ❌ | ❌ |
| | Supprimer | ✅ | ✅ | ❌ | ❌ |
| **Événements** |
| | Lire (published) | ✅ | ✅ | ✅ | ✅ |
| | Lire (all) | ✅ | ✅ | ✅ | ❌ |
| | Créer | ✅ | ✅ | ✅ | ❌ |
| | Modifier | ✅ | ✅ | ✅ | ❌ |
| | Supprimer | ✅ | ✅ | ✅ | ❌ |
| **Activités** |
| | Lire (active) | ✅ | ✅ | ✅ | ✅ |
| | Lire (all) | ✅ | ✅ | ✅ | ❌ |
| | Créer | ✅ | ✅ | ✅ | ❌ |
| | Modifier | ✅ | ✅ | ✅ | ❌ |
| | Supprimer | ✅ | ✅ | ✅ | ❌ |
| **Témoignages** |
| | Lire | ✅ | ✅ | ✅ | ✅ |
| | Créer | ✅ | ✅ | ❌ | ❌ |
| | Modifier | ✅ | ✅ | ❌ | ❌ |
| | Supprimer | ✅ | ✅ | ❌ | ❌ |
| **Pages** |
| | Lire | ✅ | ✅ | ✅ | ✅ |
| | Créer | ✅ | ✅ | ❌ | ❌ |
| | Modifier | ✅ | ✅ | ❌ | ❌ |
| | Supprimer | ✅ | ✅ | ❌ | ❌ |
| **FAQ** |
| | Lire (published) | ✅ | ✅ | ✅ | ✅ |
| | Lire (all) | ✅ | ✅ | ✅ | ❌ |
| | Créer | ✅ | ✅ | ❌ | ❌ |
| | Modifier | ✅ | ✅ | ❌ | ❌ |
| | Supprimer | ✅ | ✅ | ❌ | ❌ |
| **Messages Contact** |
| | Créer | ✅ | ✅ | ✅ | ✅ |
| | Lire | ✅ | ✅ | ❌ | ❌ |
| | Modifier statut | ✅ | ✅ | ❌ | ❌ |
| | Supprimer | ✅ | ✅ | ❌ | ❌ |
| **Médias** |
| | Lire | ✅ | ✅ | ✅ | ✅ |
| | Upload | ✅ | ✅ | ❌ | ❌ |
| | Supprimer (own) | ✅ | ✅ | ❌ | ❌ |
| | Supprimer (all) | ✅ | ✅ | ❌ | ❌ |
| **Utilisateurs** |
| | Lire | ✅ | ❌ | ❌ | ❌ |
| | Modifier rôles | ✅ | ❌ | ❌ | ❌ |
| | Supprimer | ✅ | ❌ | ❌ | ❌ |
| **Paramètres** |
| | Lire | ✅ | ✅ | ✅ | ✅ |
| | Modifier | ✅ | ❌ | ❌ | ❌ |
| **Profils** |
| | Lire (own) | ✅ | ✅ | ✅ | ❌ |
| | Lire (all) | ✅ | ✅ | ✅ | ❌ |
| | Modifier (own) | ✅ | ✅ | ✅ | ❌ |

---

## 🔧 Gestion des Rôles

### Attribution d'un Rôle (Admin uniquement)

```typescript
// Interface admin pour attribuer un rôle
const assignRole = async (userId: string, role: 'admin' | 'editor' | 'animator') => {
  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role });
  
  if (error) throw error;
};
```

### Retrait d'un Rôle

```typescript
const removeRole = async (userId: string, role: string) => {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role', role);
  
  if (error) throw error;
};
```

### Consultation des Rôles d'un Utilisateur

```typescript
const getUserRoles = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data.map(r => r.role);
};
```

---

## 🛡️ Sécurité et Bonnes Pratiques

### ✅ À Faire

1. **Toujours utiliser RLS pour la sécurité réelle**
   - Ne jamais se fier uniquement aux vérifications côté client

2. **Utiliser SECURITY DEFINER avec précaution**
   - Toujours définir `search_path` explicitement
   - Limiter les fonctions aux opérations nécessaires

3. **Valider les rôles avant les opérations critiques**
   ```typescript
   // Vérifier avant une action sensible
   const isAuthorized = await supabase.rpc('has_role', {
     _user_id: user.id,
     _role: 'admin'
   });
   
   if (!isAuthorized.data) {
     throw new Error('Unauthorized');
   }
   ```

4. **Logger les changements de rôles**
   - Audit trail pour la sécurité
   - Trigger ou fonction pour historique

### ❌ À Éviter

1. **Stocker les rôles dans localStorage/sessionStorage**
   - Facilement manipulable côté client
   - Risque de privilege escalation

2. **Vérifier les rôles uniquement côté client**
   ```typescript
   // ❌ DANGEREUX - Facilement contournable
   if (user.role === 'admin') {
     deleteAllData();
   }
   ```

3. **Créer des politiques RLS qui référencent la même table**
   ```sql
   -- ❌ RÉCURSION INFINIE
   CREATE POLICY "bad_policy"
   ON user_roles FOR SELECT
   USING (
     (SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'admin'
   );
   ```

4. **Hardcoder les permissions dans le code frontend**
   - Toujours utiliser `has_role()` depuis la DB

---

## 📊 Exemples de Politiques RLS

### Lecture Conditionnelle (Published vs All)

```sql
-- Public peut lire les posts publiés
CREATE POLICY "Public can read published posts"
ON posts FOR SELECT
USING (status = 'published');

-- Authenticated peut lire tous les posts
CREATE POLICY "Authenticated can read all posts"
ON posts FOR SELECT
TO authenticated
USING (true);
```

### Création avec Vérification de Rôle

```sql
CREATE POLICY "Editors and admins can create posts"
ON posts FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'editor')
);
```

### Modification Conditionnelle

```sql
-- Admins et editors peuvent tout modifier
CREATE POLICY "Admins and editors can update posts"
ON posts FOR UPDATE
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'editor')
);
```

### Suppression Restreinte

```sql
-- Seuls les admins peuvent supprimer
CREATE POLICY "Only admins can delete posts"
ON posts FOR DELETE
USING (has_role(auth.uid(), 'admin'));
```

---

## 🧪 Tests et Validation

### Test Manuel des Permissions

```sql
-- Se connecter en tant qu'utilisateur test
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'user-uuid-here';

-- Tester la lecture
SELECT * FROM posts WHERE status = 'published';  -- Devrait fonctionner

-- Tester la création (sans rôle)
INSERT INTO posts (title, content) VALUES ('Test', 'Content');  -- Devrait échouer

-- Attribuer le rôle editor
INSERT INTO user_roles (user_id, role) VALUES ('user-uuid-here', 'editor');

-- Re-tester la création
INSERT INTO posts (title, content) VALUES ('Test', 'Content');  -- Devrait fonctionner
```

---

## 📚 Ressources Complémentaires

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Security Definer](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [OWASP Access Control](https://owasp.org/www-community/Access_Control)
