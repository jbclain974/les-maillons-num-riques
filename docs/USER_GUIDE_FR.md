# 📖 Guide Utilisateur Complet

## Les Maillons de l'Espoir - Manuel d'utilisation

> Ce guide accompagne tous les utilisateurs du site, des visiteurs aux administrateurs.

---

## 📑 Sommaire

- [Partie 1 : Visiteur / Invité](#partie-1--visiteur--invité)
- [Partie 2 : Membre Inscrit](#partie-2--membre-inscrit)
- [Partie 3 : Rôle Lecteur](#partie-3--rôle-lecteur)
- [Partie 4 : Rôle Animateur](#partie-4--rôle-animateur)
- [Partie 5 : Rôle Éditeur](#partie-5--rôle-éditeur)
- [Partie 6 : Rôle Administrateur](#partie-6--rôle-administrateur)
- [Annexes](#annexes)

---

# Partie 1 : Visiteur / Invité

## 🌐 Accès Public

Tout visiteur peut accéder aux pages publiques du site sans inscription.

### Pages disponibles

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Présentation générale de l'association |
| L'Association | `/association` | Mission, valeurs, équipe et histoire |
| Nos Actions | `/nos-actions` | Activités et ateliers proposés |
| Actualités | `/actualites` | Articles et nouvelles |
| Projets | `/projets` | Événements passés et à venir |
| Témoignages | `/temoignages` | Retours d'expérience |
| Contact | `/contact` | Formulaire et coordonnées |
| FAQ | `/faq` | Questions fréquentes |
| Nous Soutenir | `/soutenir` | Options de soutien |

### Navigation

Le menu principal en haut de page permet d'accéder à toutes les sections. Sur mobile, un menu hamburger remplace les liens.

### Formulaire de contact

1. Accédez à la page **Contact**
2. Remplissez les champs obligatoires (nom, email, sujet, message)
3. Cliquez sur **Envoyer**
4. Un message de confirmation s'affiche

---

# Partie 2 : Membre Inscrit

## 🔐 Inscription et Connexion

### Créer un compte

1. Cliquez sur **"Admin"** ou **"Espace membre"**
2. Sélectionnez l'onglet **"Inscription"**
3. Remplissez :
   - Nom complet
   - Email
   - Mot de passe (min. 6 caractères)
   - Confirmation du mot de passe
4. Cliquez sur **"Créer un compte"**
5. Vérifiez votre email si demandé

### Se connecter

1. Accédez à `/auth`
2. Entrez votre email et mot de passe
3. Cliquez sur **"Se connecter"**

### Espace Membre

Après connexion, accédez à votre espace via le menu **"Espace membre"**.

#### Fonctionnalités disponibles

| Section | Description |
|---------|-------------|
| **Mon Profil** | Modifier vos informations personnelles, photo, contact d'urgence |
| **Mes Activités** | Consulter et s'inscrire aux activités |
| **Mes Événements** | Voir les événements et s'inscrire |
| **Communauté** | Forum d'échange entre membres |
| **Documents** | Accéder aux documents internes |
| **Annuaire** | Consulter le répertoire des membres |

---

# Partie 3 : Rôle Lecteur

> ℹ️ Le rôle **Lecteur (Viewer)** est attribué par défaut à tout nouvel inscrit.

## Permissions

| Action | Autorisée |
|--------|-----------|
| Consulter le site public | ✅ |
| Accéder à l'espace membre | ✅ |
| S'inscrire aux activités | ✅ |
| Participer au forum | ✅ |
| Accéder à l'administration | ❌ |
| Modifier du contenu | ❌ |

## Ce que vous pouvez faire

- Naviguer sur toutes les pages publiques
- Gérer votre profil membre
- Participer aux activités et événements
- Échanger avec la communauté

## Obtenir plus de droits

Contactez un administrateur pour demander une promotion de rôle.

---

# Partie 4 : Rôle Animateur

> Le rôle **Animateur** permet de gérer les activités et événements.

## Permissions détaillées

| Module | Voir | Créer | Modifier | Supprimer |
|--------|------|-------|----------|-----------|
| Dashboard | ✅ | - | - | - |
| Activités | ✅ | ✅ | ✅ | ✅ |
| Événements | ✅ | ✅ | ✅ | ✅ |
| Membres | ✅ | ❌ | ❌ | ❌ |
| Articles | ✅ | ❌ | ❌ | ❌ |

## Accéder à l'administration

1. Connectez-vous avec votre compte
2. Cliquez sur **"Admin"** dans le menu
3. Accédez au tableau de bord simplifié

## Gérer les Activités

### Créer une activité

1. Menu latéral → **"Activités"**
2. Cliquez sur **"Nouvelle activité"**
3. Remplissez le formulaire :

| Champ | Description |
|-------|-------------|
| Titre | Nom de l'activité |
| Catégorie | Type (artistique, sportif, culturel...) |
| Description courte | Résumé pour les listes |
| Description longue | Détails complets |
| Lieu | Adresse ou salle |
| Animateur | Responsable de l'activité |
| Jours | Jours de la semaine |
| Horaires | Début et fin |
| Capacité | Nombre max de participants |
| Active | Visible sur le site |

4. Cliquez sur **"Enregistrer"**

### Modifier une activité

1. Trouvez l'activité dans la liste
2. Cliquez sur l'icône **crayon**
3. Modifiez les champs souhaités
4. Cliquez sur **"Enregistrer"**

### Supprimer une activité

1. Cliquez sur l'icône **poubelle**
2. Confirmez la suppression

## Gérer les Événements

Même processus que pour les activités, avec des champs spécifiques :
- Date de début et fin
- Image de couverture
- Galerie photos
- URL vidéo

---

# Partie 5 : Rôle Éditeur

> Le rôle **Éditeur** gère tout le contenu éditorial du site.

## Permissions complètes

| Module | Voir | Créer | Modifier | Supprimer | Publier |
|--------|------|-------|----------|-----------|---------|
| Dashboard | ✅ | - | - | - | - |
| Articles | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pages | ✅ | ✅ | ✅ | ✅ | ✅ |
| Événements | ✅ | ✅ | ✅ | ✅ | ✅ |
| Activités | ✅ | ✅ | ✅ | ✅ | - |
| Témoignages | ✅ | ✅ | ✅ | ✅ | ✅ |
| Messages | ✅ | - | ✅ | - | - |
| Médias | ✅ | ✅ | ✅ | ✅ | - |
| Utilisateurs | ❌ | ❌ | ❌ | ❌ | ❌ |

## Gérer les Articles

### Créer un article

1. Menu → **"Articles"** → **"Nouvel article"**
2. Remplissez :

| Champ | Description |
|-------|-------------|
| Titre | Titre de l'article |
| Slug | URL (auto-généré) |
| Extrait | Résumé court |
| Contenu | Corps de l'article |
| Image | Photo de couverture |
| Catégorie | Classification |
| Statut | Brouillon / Publié |

3. Cliquez sur **"Enregistrer"**

### Workflow de validation

```
Brouillon → En attente éditeur → En attente admin → Publié
                                                  ↓
                                              Rejeté
```

1. **Brouillon** : En cours de rédaction
2. **En attente éditeur** : Soumis pour relecture
3. **En attente admin** : Validation finale requise
4. **Publié** : Visible sur le site
5. **Rejeté** : À corriger (avec commentaires)

## Mode Édition Inline

### Activer le mode édition

1. Accédez au **Dashboard admin**
2. Activez le **"Mode Édition"** dans les paramètres
3. Naviguez sur le site public

### Modifier du contenu

1. Survolez un élément éditable (icône crayon visible)
2. Cliquez pour ouvrir l'éditeur
3. Modifiez le texte
4. Cliquez sur **"Enregistrer"** ou appuyez sur **Entrée**
5. Appuyez sur **Échap** pour annuler

### Éléments modifiables

- Titres et sous-titres
- Paragraphes
- Boutons (texte)
- Descriptions

## Gérer les Témoignages

1. Menu → **"Témoignages"**
2. Créez avec les options :
   - **Anonyme** : Masque l'identité
   - **Mis en avant** : Affichage prioritaire
   - **Type** : Texte ou Vidéo

## Gérer les Médias

### Téléverser un fichier

1. Menu → **"Médias"**
2. Cliquez sur **"Ajouter"**
3. Sélectionnez le fichier
4. Remplissez le texte alternatif
5. Choisissez une catégorie

### Utiliser un média

Lors de la création d'un article ou événement, cliquez sur l'icône image pour sélectionner un média existant.

## Traiter les Messages

1. Menu → **"Messages"**
2. Consultez les messages reçus
3. Changez le statut :
   - **Nouveau** → **Lu** → **Traité**
4. Ajoutez des notes internes

---

# Partie 6 : Rôle Administrateur

> L'**Administrateur** dispose de **tous les droits** sur le site.

## Toutes les permissions

✅ Accès complet à tous les modules, incluant :
- Gestion des utilisateurs
- Attribution des rôles
- Configuration des permissions
- Paramètres du site
- Validation du contenu
- Logs d'audit

## Gestion des Utilisateurs

### Voir tous les utilisateurs

1. Menu → **"Utilisateurs"**
2. Consultez la liste avec :
   - Nom et email
   - Rôle actuel
   - Date d'inscription
   - Statut du compte

### Créer un utilisateur

1. Cliquez sur **"Nouvel utilisateur"**
2. Remplissez :
   - Email
   - Nom complet
   - Mot de passe
   - Rôle
3. Cliquez sur **"Créer"**

### Modifier un rôle

1. Trouvez l'utilisateur
2. Cliquez sur **"Modifier"**
3. Sélectionnez le nouveau rôle
4. Enregistrez

### Rôles disponibles

| Rôle | Description |
|------|-------------|
| **Viewer** | Lecture seule (défaut) |
| **Animator** | Gestion activités/événements |
| **Editor** | Gestion contenu éditorial |
| **Admin** | Accès complet |

## Configuration des Permissions

1. Menu → **"Permissions"**
2. Sélectionnez un rôle
3. Pour chaque module, cochez les permissions :
   - Voir
   - Créer
   - Modifier
   - Supprimer
   - Publier
   - Valider
4. Enregistrez

## File de Validation

### Examiner les contenus

1. Menu → **"Validation"**
2. Consultez les articles/événements en attente
3. Pour chaque élément :
   - **Approuver** : Publie le contenu
   - **Rejeter** : Renvoie avec commentaires

### Ajouter des notes

Lors du rejet, ajoutez un commentaire explicatif pour guider l'auteur.

## Paramètres du Site

### Informations générales

1. Menu → **"Paramètres"**
2. Modifiez :
   - Nom de l'association
   - Description
   - Logo
   - Coordonnées (adresse, téléphone, email)

### Configuration SEO

- Titre du site
- Meta description
- Mots-clés

### Réseaux sociaux

Configurez les liens vers vos pages sociales.

## Gestion de la Page d'Accueil

1. Menu → **"Page d'accueil"**
2. Configurez :
   - Sections visibles/masquées
   - Ordre d'affichage
   - Contenu du hero
   - Actions affichées

## Navigation du Site

1. Menu → **"Navigation"**
2. Gérez les liens :
   - Ajouter/supprimer des entrées
   - Réorganiser l'ordre
   - Créer des sous-menus
   - Liens internes ou externes

## Logs d'Audit

1. Menu → **"Tableau de bord"** → Widget **"Activité récente"**
2. Consultez :
   - Utilisateur ayant effectué l'action
   - Type d'action
   - Date et heure
   - Élément concerné

---

# Annexes

## Tableau récapitulatif

| Fonctionnalité | Invité | Membre | Viewer | Animateur | Éditeur | Admin |
|----------------|:------:|:------:|:------:|:---------:|:-------:|:-----:|
| Pages publiques | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Espace membre | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard admin | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Activités (CRUD) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Articles (CRUD) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Témoignages | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Messages | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Utilisateurs | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Permissions | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Paramètres | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Raccourcis clavier

| Action | Raccourci |
|--------|-----------|
| Sauvegarder | `Ctrl/Cmd + S` |
| Annuler édition | `Échap` |
| Valider | `Entrée` |

## Résolution de problèmes

### Connexion impossible
- Vérifiez email/mot de passe
- Vérifiez votre boîte email (confirmation)
- Contactez un administrateur

### Fonctionnalités manquantes
- Votre rôle n'a pas les permissions requises
- Contactez un administrateur

### Contenu non visible
- Vérifiez le statut de publication
- Le contenu est peut-être en validation

### Erreur d'enregistrement
- Vérifiez les champs obligatoires
- Vérifiez votre connexion
- Réessayez ultérieurement

## Contact Support

- **Email** : support@maillonsdelespoir.fr
- **Page Contact** : `/contact`

---

*Documentation v1.0 - Février 2026*
