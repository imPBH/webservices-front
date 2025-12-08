export interface Category {
  id_category: number;
  title: string;
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
  id_participation: number;
  user_id: number;
  response: string;
  date_response: string;
  id_alert: number;
  alert_user_id: number;
}

export interface ParticipationInput {
  user_id: number;
  response?: string;
  id_alert: number;
  alert_user_id: number;
}

export type AlertStatus = "ouverte" | "en_cours" | "resolue";

export interface Alert {
  id_alert: number;
  user_id: number;
  title: string;
  description: string;
  status: AlertStatus;
  intensity: string;
  created_at: string;
  location_lat: number;
  location_lon: number;
  id_category: number;
  category?: Category;
  media?: Media[];
  participation?: Participation[];
}

export interface AlertInput {
  user_id: number;
  title: string;
  description: string;
  status?: AlertStatus;
  intensity: string;
  location_lat: number;
  location_lon: number;
  id_category: number;
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
