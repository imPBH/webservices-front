// Types pour le service d'alertes - basés sur le contrat API

export type AlertStatus = 'ouverte' | 'en_cours' | 'resolue' | 'fermee';

// Types de média
export type MediaType = 'image' | 'video' | 'document';

// Catégorie d'alerte
export interface Categorie {
  id: number;
  nom: string;
  description: string;
}

// Catégorie d'alerte
export interface CategorieInput {
  nom: string;
  description: string;
}

// Média attaché à une alerte
export interface Media {
  id: number;
  url: string;
  type: MediaType;
  alerteId: number;
}

// Média attaché à une alerte
export interface MediaInput {
  fichier: string;
  type: MediaType;
  alerteId: number;
}

// Participation sur une alerte
export interface Participation {
  id: number;
  nom: string;
  message: string;
  dateParticipation: string; // Format ISO 8601
  alerteId: number;
}

// Participation sur une alerte
export interface ParticipationInput {
  nom: string;
  message: string;
  alerteId: number;
}

// Alerte principale
export interface Alerte {
  id: number;
  userId: number;
  titre: string;
  description: string;
  statut: AlertStatus;
  intensite: string;
  dateCreation: string; // Format ISO 8601
  latitude: number;
  longitude: number;
  categorieId: number;
  categorie: Categorie;
  medias: Media[];
  participations: Participation[];
}

// Alerte principale
export interface AlerteInput {
  userId: number;
  titre: string;
  description: string;
  statut: AlertStatus;
  intensite: string;
  latitude: number;
  longitude: number;
  categorieId: number;
  medias: MediaInput[];
  alerteId: number;
}

// Type pour créer une alerte
export type CreateAlertInput = Omit<Alerte, 'id' | 'dateCreation' | 'categorie' | 'medias' | 'participations'>;

// Type pour mettre à jour une alerte
export type UpdateAlertInput = Partial<Omit<Alerte, 'id' | 'categorie' | 'medias' | 'participations'>>;