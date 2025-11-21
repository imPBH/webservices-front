import type { Alert, CreateAlertInput, UpdateAlertInput } from './types';
import { apiClient } from '../../lib/api-client';
import { API_CONFIG, buildUrl } from '../../config/api-config';

// Configuration de l'API
const config = API_CONFIG.alerts;

// Données mock pour la démonstration
const USE_MOCK_DATA = true;

const mockAlerts: Alert[] = [
  {
    id: 1,
    userId: 101,
    titre: 'Fuite d\'eau importante',
    description: 'Fuite d\'eau détectée rue Victor Hugo, nécessite une intervention urgente',
    statut: 'ouverte',
    intensite: 'critique',
    dateCreation: new Date(Date.now() - 3600000).toISOString(),
    latitude: 48.8566,
    longitude: 2.3522,
    categorieId: 1,
    categorie: {
      id: 1,
      nom: 'Eau et Assainissement',
      description: 'Problèmes liés au réseau d\'eau'
    },
    medias: [
      {
        id: 1,
        url: 'https://example.com/photo1.jpg',
        type: 'image',
        alerteId: 1
      }
    ],
    participations: [
      {
        id: 1,
        nom: 'Jean Dupont',
        message: 'J\'ai également constaté la fuite ce matin',
        dateParticipation: new Date(Date.now() - 1800000).toISOString(),
        alerteId: 1
      }
    ]
  },
  {
    id: 2,
    userId: 102,
    titre: 'Lampadaire défectueux',
    description: 'Lampadaire éteint depuis plusieurs jours, zone dangereuse la nuit',
    statut: 'en_cours',
    intensite: 'moyenne',
    dateCreation: new Date(Date.now() - 7200000).toISOString(),
    latitude: 48.8606,
    longitude: 2.3376,
    categorieId: 2,
    categorie: {
      id: 2,
      nom: 'Éclairage Public',
      description: 'Problèmes d\'éclairage urbain'
    },
    medias: [],
    participations: []
  },
  {
    id: 3,
    userId: 103,
    titre: 'Nid de poule dangereux',
    description: 'Gros trou dans la chaussée avenue de la République',
    statut: 'ouverte',
    intensite: 'élevée',
    dateCreation: new Date(Date.now() - 1800000).toISOString(),
    latitude: 48.8738,
    longitude: 2.2950,
    categorieId: 3,
    categorie: {
      id: 3,
      nom: 'Voirie',
      description: 'État des routes et trottoirs'
    },
    medias: [
      {
        id: 2,
        url: 'https://example.com/photo2.jpg',
        type: 'image',
        alerteId: 3
      }
    ],
    participations: [
      {
        id: 2,
        nom: 'Marie Martin',
        message: 'Très dangereux pour les cyclistes',
        dateParticipation: new Date(Date.now() - 900000).toISOString(),
        alerteId: 3
      }
    ]
  },
  {
    id: 4,
    userId: 104,
    titre: 'Déchets sauvages',
    description: 'Dépôt sauvage de déchets encombrants dans le parc',
    statut: 'resolue',
    intensite: 'faible',
    dateCreation: new Date(Date.now() - 14400000).toISOString(),
    latitude: 48.8529,
    longitude: 2.3499,
    categorieId: 4,
    categorie: {
      id: 4,
      nom: 'Propreté',
      description: 'Déchets et salubrité'
    },
    medias: [],
    participations: []
  },
  {
    id: 5,
    userId: 105,
    titre: 'Arbre dangereux',
    description: 'Arbre penché menaçant de tomber sur la route',
    statut: 'ouverte',
    intensite: 'critique',
    dateCreation: new Date(Date.now() - 900000).toISOString(),
    latitude: 48.8448,
    longitude: 2.3739,
    categorieId: 5,
    categorie: {
      id: 5,
      nom: 'Espaces Verts',
      description: 'Arbres et végétation'
    },
    medias: [
      {
        id: 3,
        url: 'https://example.com/photo3.jpg',
        type: 'image',
        alerteId: 5
      }
    ],
    participations: [
      {
        id: 3,
        nom: 'Pierre Durand',
        message: 'Cet arbre est effectivement très incliné',
        dateParticipation: new Date(Date.now() - 600000).toISOString(),
        alerteId: 5
      },
      {
        id: 4,
        nom: 'Sophie Lefebvre',
        message: 'À traiter en urgence avant les prochaines intempéries',
        dateParticipation: new Date(Date.now() - 300000).toISOString(),
        alerteId: 5
      }
    ]
  },
  {
    id: 6,
    userId: 106,
    titre: 'Banc cassé',
    description: 'Banc public endommagé dans le square',
    statut: 'en_cours',
    intensite: 'faible',
    dateCreation: new Date(Date.now() - 5400000).toISOString(),
    latitude: 48.8656,
    longitude: 2.3212,
    categorieId: 6,
    categorie: {
      id: 6,
      nom: 'Mobilier Urbain',
      description: 'Équipements urbains'
    },
    medias: [],
    participations: []
  }
];

// Récupérer toutes les alertes
export async function fetchAlerts(): Promise<Alert[]> {
  if (USE_MOCK_DATA) {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAlerts;
  }

  // Utilisation de la vraie API
  const url = buildUrl(config.baseUrl, config.endpoints.list);
  return apiClient.get<Alert[]>(url);
}

// Récupérer une alerte par ID
export async function fetchAlertById(id: number): Promise<Alert> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const alert = mockAlerts.find(a => a.id === id);
    if (!alert) {
      throw new Error('Alerte non trouvée');
    }
    return alert;
  }

  const url = buildUrl(config.baseUrl, config.endpoints.detail, { id });
  return apiClient.get<Alert>(url);
}

// Créer une alerte
export async function createAlert(alertInput: CreateAlertInput): Promise<Alert> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newAlert: Alert = {
      ...alertInput,
      id: Math.max(...mockAlerts.map(a => a.id), 0) + 1,
      dateCreation: new Date().toISOString(),
      categorie: {
        id: alertInput.categorieId,
        nom: 'Catégorie temporaire',
        description: 'À définir'
      },
      medias: [],
      participations: []
    };
    return newAlert;
  }

  const url = buildUrl(config.baseUrl, config.endpoints.create);
  return apiClient.post<Alert>(url, alertInput);
}

// Mettre à jour une alerte
export async function updateAlert(id: number, alertUpdate: UpdateAlertInput): Promise<Alert> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const existingAlert = mockAlerts.find(a => a.id === id);
    if (!existingAlert) {
      throw new Error('Alerte non trouvée');
    }
    return { ...existingAlert, ...alertUpdate };
  }

  const url = buildUrl(config.baseUrl, config.endpoints.update, { id });
  return apiClient.put<Alert>(url, alertUpdate);
}

// Supprimer une alerte
export async function deleteAlert(id: number): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return;
  }

  const url = buildUrl(config.baseUrl, config.endpoints.delete, { id });
  return apiClient.delete<void>(url);
}