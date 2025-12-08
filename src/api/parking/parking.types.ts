export interface Parking {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  address: string | null;
  note: string | null;
  created_at: string;
}

export interface ParkingRequest {
  latitude: number;
  longitude: number;
  address?: string;
  note?: string;
}

export interface UpdateParkingRequest {
  address?: string;
  note?: string;
}

export interface ParkingResponse {
  message: string;
  parking: Parking;
}

export interface CurrentParkingResponse {
  parking: Parking;
}

export interface ParkingHistoryResponse {
  parkings: Parking[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface DeleteParkingResponse {
  message: string;
}

export interface ParkingApiError {
  error: string;
  message?: string;
  details?: string[];
}

export interface GetParkingResponse {
  parking: Parking;
}

export interface StartTimerRequest {
  duration?: number;
}

export interface StartTimerResponse {
  message: string;
  timer: {
    parkingId: number;
    duration: number;
    startTime: string;
    endTime: string;
  };
}
