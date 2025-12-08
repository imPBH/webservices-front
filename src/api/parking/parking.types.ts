export interface Parking {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  address: string | null;
  note: string | null;
  created_at: string;
}

export interface CreateParkingPayload {
  latitude: number;
  longitude: number;
  address?: string;
  note?: string;
}

export interface UpdateParkingPayload {
  address?: string;
  note?: string;
}

export interface ParkingResponse {
  message: string;
  parking: Parking;
}

export interface DeleteParkingResponse {
  message: string;
}

export interface StartTimerPayload {
  duration: number;
}

export interface TimerResponse {
  message: string;
  timer: {
    parkingId: number;
    duration: number;
    startTime: string;
    endTime: string;
  };
}

export interface ParkingError {
  error: string;
  message: string;
  details?: string[];
}
