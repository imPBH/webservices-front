import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jsonApi } from "../jsonApi";
import type {
  ParkingRequest,
  UpdateParkingRequest,
  ParkingResponse,
  CurrentParkingResponse,
  ParkingHistoryResponse,
  DeleteParkingResponse,
  ParkingApiError,
} from "./parking.types";
import { useStore } from "../../store/store";

const PARKING_SERVICE_URL: string = import.meta.env.VITE_PARKING_SERVICE_URL;

export function createParking({
  payload,
  apiKey,
}: {
  payload: ParkingRequest;
  apiKey: string;
}): Promise<ParkingResponse> {
  return jsonApi.post({
    url: `${PARKING_SERVICE_URL}/api/v1/parking`,
    content: payload,
    apiKey,
  });
}

export function useCreateParking() {
  const parkingApiKey = useStore((state) => state.parkingApiKey);
  const queryClient = useQueryClient();

  return useMutation<
    ParkingResponse,
    ParkingApiError,
    { payload: ParkingRequest }
  >({
    mutationFn: ({ payload }) => createParking({ payload, apiKey: parkingApiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking"] });
    },
  });
}

export function getCurrentParking({
  userId,
  apiKey,
}: {
  userId: number;
  apiKey: string;
}): Promise<CurrentParkingResponse> {
  return jsonApi.get({
    url: `${PARKING_SERVICE_URL}/api/v1/parking/current?user_id=${userId}`,
    apiKey,
  });
}

export function useGetCurrentParking(userId: number) {
  const parkingApiKey = useStore((state) => state.parkingApiKey);

  return useQuery<CurrentParkingResponse, ParkingApiError>({
    queryKey: ["parking", "current", userId],
    queryFn: () => getCurrentParking({ userId, apiKey: parkingApiKey }),
    enabled: !!userId && !!parkingApiKey,
  });
}

export function getParkingHistory({
  userId,
  limit = 50,
  offset = 0,
  apiKey,
}: {
  userId: number;
  limit?: number;
  offset?: number;
  apiKey: string;
}): Promise<ParkingHistoryResponse> {
  return jsonApi.get({
    url: `${PARKING_SERVICE_URL}/api/v1/parking/history?user_id=${userId}&limit=${limit}&offset=${offset}`,
    apiKey,
  });
}

export function useGetParkingHistory(
  userId: number,
  limit: number = 50,
  offset: number = 0
) {
  const parkingApiKey = useStore((state) => state.parkingApiKey);

  return useQuery<ParkingHistoryResponse, ParkingApiError>({
    queryKey: ["parking", "history", userId, limit, offset],
    queryFn: () =>
      getParkingHistory({ userId, limit, offset, apiKey: parkingApiKey }),
    enabled: !!userId && !!parkingApiKey,
  });
}

export function updateParking({
  userId,
  parkingId,
  payload,
  apiKey,
}: {
  userId: number;
  parkingId: number;
  payload: UpdateParkingRequest;
  apiKey: string;
}): Promise<ParkingResponse> {
  return jsonApi.patch({
    url: `${PARKING_SERVICE_URL}/api/v1/parking/${userId}/${parkingId}`,
    content: payload,
    apiKey,
  });
}

export function useUpdateParking() {
  const parkingApiKey = useStore((state) => state.parkingApiKey);
  const queryClient = useQueryClient();

  return useMutation<
    ParkingResponse,
    ParkingApiError,
    { userId: number; parkingId: number; payload: UpdateParkingRequest }
  >({
    mutationFn: ({ userId, parkingId, payload }) =>
      updateParking({ userId, parkingId, payload, apiKey: parkingApiKey }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["parking"] });
      queryClient.invalidateQueries({
        queryKey: ["parking", "current", variables.userId],
      });
    },
  });
}

export function deleteParking({
  userId,
  parkingId,
  apiKey,
}: {
  userId: number;
  parkingId: number;
  apiKey: string;
}): Promise<DeleteParkingResponse> {
  return jsonApi.delete({
    url: `${PARKING_SERVICE_URL}/api/v1/parking/${userId}/${parkingId}`,
    apiKey,
  });
}

export function useDeleteParking() {
  const parkingApiKey = useStore((state) => state.parkingApiKey);
  const queryClient = useQueryClient();

  return useMutation<
    DeleteParkingResponse,
    ParkingApiError,
    { userId: number; parkingId: number }
  >({
    mutationFn: ({ userId, parkingId }) =>
      deleteParking({ userId, parkingId, apiKey: parkingApiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking"] });
    },
  });
}
