export interface Category {
  id: number;
  nom: string;
  description: string;
}

export interface Categories {
  data: Category[];
}

export interface CategoryInput {
  title: string;
}

export interface Media {
  id_media: number;
  file_type: string;
  file_url: string;
  uploaded_at: string;
  id_alert: number;
  user_id: number;
}

export interface MediaInput {
  file_url: string;
  file_type: string;
  id_alert: number;
  user_id: number;
}

export interface Participation {
  id: number;
  nom: string;
  message: string;
  dateParticipation: string;
  alerteId: number;
}

export interface ParticipationInput {
  nom: string;
  message: string;
  alerteId: number;
}

export type AlertStatus = "ouverte" | "en_cours" | "resolue";

export interface Alert {
  id: number;
  userId: number;
  titre: string;
  description: string;
  statut: AlertStatus;
  intensite: string;
  dateCreation: string;
  latitude: number;
  longitude: number;
  categorieId: number;
  categorie?: Category;
  medias?: Media[];
  participations?: Participation[];
}

export interface AlertInput {
  userId: number;
  titre: string;
  description: string;
  statut?: AlertStatus;
  intensite: string;
  latitude: number;
  longitude: number;
  categorieId: number;
}

export interface AlertPage {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  items: Alert[];
}

export interface AlertsError {
  error: string;
  message: string;
  details?: string[];
}

export interface Alerts {
  data: Alert[];
}
