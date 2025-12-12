# 🌐 WebServices Front - Projet Intégration d'APIs

> Application web moderne intégrant deux services web distincts : gestion de parking intelligent et alertes citoyennes géolocalisées.

## 📋 Table des matières

- [Description du projet](#-description-du-projet)
- [Architecture générale](#-architecture-générale)
- [Stack technique](#-stack-technique)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du code](#-structure-du-code)
- [APIs intégrées](#-apis-intégrées)
- [Authentification et sécurité](#-authentification-et-sécurité)
- [Fonctionnalités principales](#-fonctionnalités-principales)

---

## 🎯 Description du projet

Ce projet est une application web full-stack frontend développée dans le cadre d'un projet scolaire d'intégration de services web. L'objectif est de démontrer la capacité à :

- **Intégrer plusieurs APIs externes** dans une interface unique
- **Gérer l'authentification** de manière centralisée
- **Manipuler des données géolocalisées** (cartes, coordonnées GPS)
- **Créer une expérience utilisateur fluide** avec gestion d'état moderne

### Les deux services intégrés

#### 🅿️ **Service de Gestion de Parking**
- Enregistrement de positions de stationnement avec coordonnées GPS
- Suivi de l'historique des parkings utilisés
- Visualisation sur carte interactive (Leaflet)
- Ajout de notes et d'adresses personnalisées
- Système de chronométrage pour les durées de stationnement

#### 🚨 **Service d'Alertes Citoyennes**
- Signalement d'incidents géolocalisés (routes, propreté, éclairage public)
- Système de catégorisation des alertes
- Upload de médias (photos) pour documenter les incidents
- Système de participation citoyenne
- Suivi du statut de traitement des alertes

---

## 🏗️ Architecture générale

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  - Authentification unique (JWT)                            │
│  - Interface utilisateur unifiée                             │
│  - Gestion d'état globale (Zustand)                         │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    │ Bearer Token (JWT)
                    │
        ┌───────────▼────────────┐
        │   AUTH SERVICE API     │
        │   (Proxy sécurisé)     │
        │                        │
        │  - Authentification    │
        │  - Injection API Keys  │
        │  - Extraction userId   │
        └──┬──────────────────┬──┘
           │                  │
  API Key  │                  │  API Key
  Parking  │                  │  Alerts
           │                  │
    ┌──────▼──────┐    ┌──────▼──────┐
    │   PARKING   │    │   ALERTS    │
    │     API     │    │     API     │
    │  (Groupe 1) │    │  (Groupe 2) │
    └─────────────┘    └─────────────┘
```

### Flux de données

1. **Inscription/Connexion** : L'utilisateur se connecte via le service d'authentification
2. **Stockage des tokens** : Les tokens JWT sont sauvegardés dans le localStorage
3. **Appels API** : Chaque requête utilise le token JWT
4. **Proxy sécurisé** : L'API d'authentification :
   - Décode le JWT pour extraire le `userId`
   - Injecte les clés API des services externes
   - Transforme les routes et transmet les requêtes
5. **Réponse** : Les données sont retournées et mises en cache par React Query

### Avantages de cette architecture

- ✅ **Sécurité** : Les clés API externes ne sont jamais exposées au frontend
- ✅ **Simplicité** : Une seule URL d'API à configurer
- ✅ **Centralisation** : Gestion de l'authentification en un point
- ✅ **Isolation** : Le frontend n'est pas couplé aux APIs externes

---

## 🛠️ Stack technique

### Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 18.3 | Framework UI |
| **TypeScript** | 5.6 | Typage statique |
| **Vite** | 7.1 | Build tool & dev server |
| **Tailwind CSS** | 4.0 | Styling (utility-first) |
| **Zustand** | 5.0 | State management |
| **TanStack Query** | 5.62 | Data fetching & caching |
| **React Router** | 7.1 | Routing |
| **Leaflet** | 1.9 | Cartes interactives |
| **Framer Motion** | 11.15 | Animations |
| **Lucide React** | 0.468 | Icônes |

### Outils de développement

- **ESLint** : Linting du code TypeScript/React
- **TypeScript Compiler** : Vérification des types
- **Vite HMR** : Hot Module Replacement pour développement rapide

---

## 📦 Installation

### Prérequis

- **Node.js** : version 20.19+ ou 22.12+
- **npm** ou **yarn**
- **Git**

### Étapes d'installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd webservices-front

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env

# 4. Configurer les variables d'environnement (voir section suivante)
# Éditer le fichier .env

# 5. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

---

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# URL du service d'authentification (qui agit comme proxy)
VITE_AUTH_SERVICE_URL=http://localhost:3333
```

> **Note** : Une seule variable d'environnement est nécessaire ! Le service d'authentification agit comme proxy pour tous les autres services.

### Configuration backend requise

Pour que l'application fonctionne, le backend (API d'authentification) doit :

1. Exposer les routes d'authentification :
   - `POST /auth/login`
   - `POST /auth/register`
   - `GET /auth/google/redirect`
   - `GET /auth/google/callback`
   - `POST /auth/refresh`
   - `PUT /auth/update`
   - `DELETE /auth/delete`

2. Agir comme proxy pour les services externes :
   - Routes parking : `/api/parking/*`
   - Routes alertes : `/api/alertes_citoyennes/*`

3. Gérer les API keys des services externes côté backend

---

## 🚀 Utilisation

### Commandes disponibles

```bash
# Développement
npm run dev          # Démarre le serveur de développement (port 5173)

# Build
npm run build        # Compile pour la production (dossier dist/)
npm run preview      # Prévisualise le build de production

# Qualité du code
npm run lint         # Vérifie le code avec ESLint
```

### Première utilisation

1. **S'inscrire** : Créer un compte sur `/register`
2. **Se connecter** : Login avec email/mot de passe ou Google OAuth
3. **Accéder au parking** : Page `/parking` pour enregistrer des positions
4. **Gérer les alertes** : Page `/alerts` pour signaler des incidents

---

## 📁 Structure du code

```
webservices-front/
├── src/
│   ├── api/                      # Couche API et data fetching
│   │   ├── jsonApi.ts           # Client HTTP (gère fetch + headers)
│   │   ├── common.types.ts      # Types partagés
│   │   ├── auth/                # API d'authentification
│   │   │   ├── auth.ts          # Hooks React Query (useLogin, useRegister...)
│   │   │   └── auth.types.ts    # Types TypeScript
│   │   ├── parking/             # API de gestion de parking
│   │   │   ├── parking.ts       # Hooks (useCreateParking, useGetCurrentParking...)
│   │   │   └── parking.types.ts # Types
│   │   └── alerts/              # API d'alertes citoyennes
│   │       ├── alerts.ts        # Hooks (useCreateAlert, useGetAlerts...)
│   │       └── alerts.types.ts  # Types
│   │
│   ├── components/              # Composants React réutilisables
│   │   ├── layout/              # Layout (Header, Footer)
│   │   ├── sections/            # Sections de landing page
│   │   ├── cards/               # Cards (ApiCard, FeatureCard...)
│   │   ├── maps/                # Composants cartes Leaflet
│   │   └── ui/                  # Composants UI de base
│   │
│   ├── contexts/                # React Contexts
│   │   └── ToastContext.tsx     # Système de notifications
│   │
│   ├── pages/                   # Pages de l'application
│   │   ├── LandingPage.tsx      # Page d'accueil
│   │   ├── ParkingPage.tsx      # Gestion de parking
│   │   ├── AlertsPage.tsx       # Gestion des alertes
│   │   ├── ProfilePage.tsx      # Profil utilisateur
│   │   └── auth/                # Pages d'authentification
│   │       ├── LoginPage.tsx
│   │       ├── RegisterPage.tsx
│   │       └── GoogleCallbackPage.tsx
│   │
│   ├── routes/                  # Configuration du routing
│   │   └── AppRouter.tsx        # Routes React Router
│   │
│   ├── store/                   # State management global
│   │   └── store.ts             # Store Zustand (avec persistence)
│   │
│   ├── data/                    # Données statiques
│   │   └── site.ts              # Contenu de la landing page
│   │
│   ├── types/                   # Types TypeScript globaux
│   │   └── index.ts
│   │
│   ├── App.tsx                  # Composant racine
│   ├── main.tsx                 # Point d'entrée
│   └── index.css                # Styles globaux
│
├── public/                      # Assets statiques
├── .env.example                 # Template de configuration
├── package.json                 # Dépendances
├── tsconfig.json                # Configuration TypeScript
├── vite.config.ts               # Configuration Vite
└── README.md                    # Ce fichier
```

---

## 🔌 APIs intégrées

### API Parking

**Base URL** : `${VITE_AUTH_SERVICE_URL}/api/parking`

| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| `POST` | `/` | Créer une position de parking | `{ latitude, longitude, address?, note? }` |
| `GET` | `/current` | Récupérer la position actuelle | - |
| `GET` | `/history?limit={n}&offset={m}` | Historique paginé | - |
| `GET` | `/{id}` | Obtenir un parking spécifique | - |
| `PATCH` | `/{id}` | Modifier un parking | `{ address?, note? }` |
| `DELETE` | `/{id}` | Supprimer un parking | - |
| `POST` | `/{id}/start-timer` | Démarrer un chronomètre | `{ duration? }` |

**Exemple de requête** :
```typescript
import { useCreateParking } from '@/api/parking/parking';

const createParking = useCreateParking();

await createParking.mutateAsync({
  payload: {
    latitude: 48.8566,
    longitude: 2.3522,
    address: "75001 Paris",
    note: "Près du Louvre"
  }
});
```

### API Alertes Citoyennes

**Base URL** : `${VITE_AUTH_SERVICE_URL}/api/alertes_citoyennes`

#### Endpoints Alertes

| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| `GET` | `/alerts?page={n}&limit={m}` | Liste paginée | - |
| `GET` | `/alerts/{id}` | Détail d'une alerte | - |
| `POST` | `/alerts` | Créer une alerte | `{ user_id, title, description, latitude, longitude, category_id, status?, priority? }` |
| `PUT` | `/alerts/{id}` | Modifier une alerte | `{ user_id, title?, description?, ... }` |
| `DELETE` | `/alerts/{id}` | Supprimer une alerte | - |

#### Autres ressources

- **Catégories** : CRUD complet sur `/categories`
- **Médias** : Gestion via `/medias`
- **Participations** : CRUD via `/participations`

**Exemple de requête** :
```typescript
import { useCreateAlert } from '@/api/alerts/alerts';

const createAlert = useCreateAlert();

await createAlert.mutateAsync({
  payload: {
    user_id: userId,
    title: "Nid de poule",
    description: "Trou important dans la chaussée",
    latitude: 48.8566,
    longitude: 2.3522,
    category_id: 1,
    status: "pending",
    priority: 2
  }
});
```

---

## 🔐 Authentification et sécurité

### Système d'authentification

L'application utilise un système JWT (JSON Web Token) :

1. **Login/Register** : Obtient `accessToken` + `refreshToken`
2. **Stockage** : Tokens sauvegardés dans le localStorage (via Zustand persist)
3. **Requêtes** : Header `Authorization: Bearer <accessToken>` ajouté automatiquement
4. **Refresh** : Si le token expire, utilisation du `refreshToken` pour en obtenir un nouveau
5. **Logout** : Suppression des tokens du store

### Store Zustand (State global)

```typescript
interface Store {
  // État d'authentification
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;

  // Données utilisateur
  userId: number;
  username: string;
  email: string;
  role: number;

  // Setters
  setLoggedIn: (value: boolean) => void;
  setAccessToken: (value: string) => void;
  setRefreshToken: (value: string) => void;
  setUserId: (value: number) => void;
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  setRole: (value: number) => void;
}
```

Le store est **persisté dans le localStorage** sous la clé `webservice-storage`.

### Flux d'authentification complet

#### 1. Login classique (email/mot de passe)

```typescript
// LoginPage.tsx
const login = useLogin();

await login.mutateAsync({
  email: "user@example.com",
  password: "password123"
});

// Backend retourne :
// {
//   token: {
//     accessToken: "eyJ...",
//     refreshToken: "abc...",
//     user: { id: 1, username: "john", email: "...", role: 1 }
//   }
// }

// useLogin() stocke automatiquement dans le store :
// - accessToken, refreshToken
// - userId, username, email, role
// - isLoggedIn = true
```

#### 2. Login Google OAuth

```typescript
// 1. Obtenir l'URL de redirection
const { url } = await getGoogleRedirect();
window.location.href = url;

// 2. Google redirige vers /auth/google/callback?code=...

// 3. GoogleCallbackPage.tsx traite le callback
// Backend retourne la même structure que le login classique

// 4. Stockage automatique dans le store
```

#### 3. Refresh du token

```typescript
const refreshToken = useRefreshToken();

await refreshToken.mutateAsync();

// Backend retourne : { accessToken: "eyJ..." }
// Le nouveau accessToken est stocké dans le store
```

#### 4. Logout

```typescript
const logout = useLogout();

await logout.mutateAsync();

// Le store est réinitialisé :
// - isLoggedIn = false
// - accessToken = ""
// - refreshToken = ""
// - userId = NaN
// - username = ""
// - email = ""
// - role = NaN
```

### Sécurité

- ✅ **Tokens stockés localement** : Persistent entre les sessions
- ✅ **HTTPS en production** : Toujours utiliser HTTPS pour protéger les tokens
- ✅ **Expiration des tokens** : `accessToken` expire en 15 minutes
- ✅ **Refresh token** : Valable 30 jours pour renouveler l'access token
- ✅ **API Keys cachées** : Les clés API externes sont stockées côté backend uniquement
- ✅ **Proxy sécurisé** : Le frontend ne connaît jamais les clés API des services externes
- ⚠️ **XSS Protection** : Ne jamais injecter de contenu non sanitizé dans le DOM
- ⚠️ **CORS** : Le backend doit autoriser l'origine du frontend

---

## ✨ Fonctionnalités principales

### 🅿️ Gestion de Parking

#### Créer une position de parking
- Formulaire avec latitude, longitude, adresse et note
- Validation des coordonnées GPS
- Affichage immédiat sur la carte

#### Visualiser la position actuelle
- Requête `GET /api/parking/current`
- Marqueur sur la carte Leaflet
- Affichage des détails (adresse, note, date de création)

#### Consulter l'historique
- Liste paginée des parkings précédents
- Filtres de recherche
- Export possible

#### Modifier/Supprimer
- Édition des informations (adresse, note)
- Suppression avec confirmation

#### Chronomètre de stationnement
- Démarrage d'un timer pour un parking
- Calcul automatique de la durée
- Notifications à l'expiration (si implémenté)

### 🚨 Alertes Citoyennes

#### Créer une alerte
- Formulaire complet : titre, description, localisation
- Sélection de catégorie (route, propreté, éclairage...)
- Ajout de photos (upload de médias)
- Choix de priorité (1 = Faible, 2 = Moyenne, 3 = Haute)

#### Visualiser les alertes
- Liste paginée avec filtres
- Carte avec marqueurs géolocalisés
- Détail complet de chaque alerte

#### Participer aux alertes
- Système de participation citoyenne
- Ajout de commentaires/photos supplémentaires
- Suivi du statut de traitement

#### Gérer ses alertes
- Modification de ses propres alertes
- Suppression avec confirmation
- Historique des modifications

### 🗺️ Cartes interactives

- **Leaflet** : Cartes OpenStreetMap
- **Marqueurs personnalisés** : Icônes différentes selon le type (parking, alerte)
- **Popups** : Informations détaillées au clic
- **Géolocalisation** : Utilisation de la position de l'utilisateur
- **Responsive** : Adaptation mobile/desktop

### 🎨 Interface utilisateur

- **Design moderne** : Tailwind CSS avec thème sombre (slate)
- **Animations fluides** : Framer Motion pour les transitions
- **Responsive** : Mobile-first design
- **Toast notifications** : Système de notifications contextuelles
- **Loading states** : Indicateurs de chargement sur toutes les actions
- **Error handling** : Gestion gracieuse des erreurs

---

## 📚 Ressources et documentation

### Documentation officielle des technologies

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [Leaflet](https://leafletjs.com/)

### Patterns utilisés

- **React Query hooks** : Pattern de data fetching moderne
- **Custom hooks** : Encapsulation de la logique métier
- **Zustand store** : State management minimal et performant
- **Proxy architecture** : Sécurisation des clés API
- **Type-safe API** : TypeScript pour éviter les erreurs

---

## 🎓 Notes pour l'évaluation

### Critères du projet

- ✅ **Intégration de 2 APIs distinctes** : Parking + Alertes citoyennes
- ✅ **Authentification centralisée** : JWT avec refresh token
- ✅ **Interface moderne et responsive** : React + Tailwind CSS
- ✅ **Gestion d'état** : Zustand avec persistence
- ✅ **Data fetching optimisé** : TanStack Query avec cache
- ✅ **Géolocalisation** : Cartes Leaflet avec marqueurs
- ✅ **TypeScript** : Code entièrement typé
- ✅ **Architecture propre** : Séparation des responsabilités
- ✅ **Sécurité** : Proxy pour cacher les API keys

### Points techniques avancés

- **Architecture proxy** : Le service d'authentification agit comme proxy pour sécuriser les clés API
- **Extraction du userId** : Le backend extrait le `userId` du JWT et l'injecte dans les requêtes
- **Transformation des routes** : Les routes frontend ne correspondent pas directement aux APIs externes
- **Cache intelligent** : React Query invalide automatiquement le cache après mutations
- **Optimistic updates** : Mise à jour de l'UI avant la réponse du serveur (peut être ajouté)
- **Error boundaries** : Gestion gracieuse des erreurs React

---

## 👨‍💻 Auteur

Projet réalisé par MBANZULU Myriam, PROVO Alexis, GUERRA Lucas


