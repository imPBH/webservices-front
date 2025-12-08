# WebServices Front

## Description

Application web React + Vite + TypeScript qui sert de frontend pour : 
- **Service de gestion de parking** : Création et suivi de positions de stationnement
- **Service d'alertes citoyennes** : Gestion d'incidents géolocalisés (routes, éclairage, propreté...)

Les utilisateurs s'authentifient une fois via un service d'authentification centralisé, puis accèdent aux deux services via leurs clés API respectives.

## Stack Technique

- **Framework** : React 18 + Vite
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **State Management** : Zustand (avec persistence localStorage)
- **Data Fetching** : TanStack Query (React Query)
- **Routing** : React Router v7
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **Maps** : Leaflet + React Leaflet

## Prérequis

- Node.js 20.19+ ou 22.12+
- npm ou yarn

## Installation

1. Cloner le dépôt :
```bash
git clone <url-du-repo>
cd webservices-front
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
```

4. Éditer le fichier `.env` avec vos valeurs :
```env
# Service d'authentification
VITE_AUTH_SERVICE_URL=http://localhost:3000

# Service de parking
VITE_PARKING_SERVICE_URL=http://localhost:3001
VITE_PARKING_API_KEY=votre_cle_api_parking

# Service d'alertes
VITE_ALERTS_SERVICE_URL=http://localhost:3002
VITE_ALERTS_API_KEY=votre_cle_api_alertes
```

## Commandes

```bash
# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Linter le code
npm run lint

# Prévisualiser le build de production
npm run preview
```

## Architecture

### Systèmes d'authentification

Le projet utilise 3 mécanismes d'authentification distincts :

1. **JWT Bearer tokens** (Service d'authentification)
   - Login/Register des utilisateurs
   - Header : `Authorization: Bearer <token>`
   - Tokens : `accessToken` + `refreshToken`

2. **API Key Parking** (Service de parking)
   - Header : `X-API-Key: <key>`
   - Clé stockée dans les variables d'environnement

3. **API Key Alerts** (Service d'alertes)
   - Header : `X-API-Key: <key>`
   - Clé stockée dans les variables d'environnement

### Structure du code

```
src/
├── api/                    # Couche API
│   ├── jsonApi.ts         # Client HTTP (gère Bearer + API Keys)
│   ├── auth/              # Hooks d'authentification
│   ├── parking/           # Hooks API parking
│   └── alerts/            # Hooks API alertes
├── store/
│   └── store.ts           # Store Zustand (state global)
├── pages/                 # Pages de l'application
├── components/            # Composants React
├── routes/                # Configuration routing
└── data/                  # Contenu statique
```

### Flux de données

1. **Authentification** : User → Login → Auth API → Store tokens → Redirect
2. **Appel API Parking** : User → Action → Hook récupère parkingApiKey → jsonApi avec X-API-Key → API
3. **Appel API Alerts** : User → Action → Hook récupère alertsApiKey → jsonApi avec X-API-Key → API

React Query gère automatiquement le cache et les invalidations.

## APIs intégrées

### API Parking

Endpoints disponibles :
- `POST /api/v1/parking` - Créer une position
- `GET /api/v1/parking/current` - Récupérer la dernière position
- `GET /api/v1/parking/history` - Historique paginé
- `PATCH /api/v1/parking/{user_id}/{id}` - Modifier (address/note)
- `DELETE /api/v1/parking/{user_id}/{id}` - Supprimer

### API Alertes

4 ressources principales :

**Alertes**
- `GET /api/alerts` - Liste paginée
- `GET /api/alerts/{id_alert}/{user_id}` - Détail
- `POST /api/alerts` - Créer
- `PUT /api/alerts/{id_alert}/{user_id}` - Modifier
- `DELETE /api/alerts/{id_alert}/{user_id}` - Supprimer

**Catégories** - CRUD complet sur `/api/categories`

**Médias** - Gestion via `/api/medias` (URL pré-uploadée)

**Participations** - CRUD via `/api/participations`

## Routing

**Routes publiques** :
- `/` - Page d'accueil
- `/login` - Connexion
- `/register` - Inscription
- `/auth/google/callback` - Callback OAuth Google

**Routes protégées** :
- `/profile` - Profil utilisateur
- `/parking` - Gestion de parking
- `/alerts` - Gestion des alertes

## Utilisation des hooks

### Exemple : Créer une position de parking

```typescript
import { useCreateParking } from '@/api/parking/parking';

function ParkingForm() {
  const createParking = useCreateParking();

  const handleSubmit = async (data) => {
    await createParking.mutateAsync({
      payload: {
        user_id: 1,
        latitude: 48.8566,
        longitude: 2.3522,
        address: "Paris",
        note: "Près du métro"
      }
    });
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={createParking.isPending}
    >
      {createParking.isPending ? 'Création...' : 'Créer'}
    </button>
  );
}
```

### Exemple : Récupérer les alertes

```typescript
import { useGetAlerts } from '@/api/alerts/alerts';

function AlertsList() {
  const { data, isLoading } = useGetAlerts(1, 20);

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div>
      {data?.items.map(alert => (
        <div key={alert.id_alert}>
          <h3>{alert.title}</h3>
          <p>{alert.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Sécurité

- Les tokens JWT sont stockés dans localStorage via Zustand persist
- Les API keys sont chargées depuis les variables d'environnement
- Ne jamais committer les vraies clés API dans le code source
- Utiliser `.env` pour le développement local
- Configurer les variables d'environnement sur la plateforme de déploiement


