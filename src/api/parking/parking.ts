import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jsonApi } from "../jsonApi";
import type {
  CreateParkingPayload,
  DeleteParkingResponse,
  Parking,
  ParkingError,
  ParkingResponse,
  StartTimerPayload,
  TimerResponse,
  UpdateParkingPayload,
} from "./parking.types";
import { useStore } from "../../store/store";

const PARKING_SERVICE_URL: string = import.meta.env.VITE_PARKING_SERVICE_URL;
const parkingEndpoint = PARKING_SERVICE_URL + "/api/v1/parking";

export function createParking({
  userId,
  payload,
  apiKey,
}: {
  userId: string;
  payload: CreateParkingPayload;
  apiKey: string;
}): Promise<ParkingResponse> {
  return jsonApi.post({
    url: `${parkingEndpoint}/${userId}`,
    content: payload,
    bearerToken: apiKey,
  });
}

export function useCreateParking() {
  const accessToken = useStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation<
    ParkingResponse,
    ParkingError,
    { userId: string; payload: CreateParkingPayload }
  >({
    mutationFn: ({ userId, payload }) =>
      createParking({ userId, payload, apiKey: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking"] });
    },
  });
}

export function getCurrentParking({
  userId,
  apiKey,
}: {
  userId: string;
  apiKey: string;
}): Promise<{ parking: Parking }> {
  return jsonApi.get({
    url: `${parkingEndpoint}/${userId}/current`,
    bearerToken: apiKey,
  });
}

export function useGetCurrentParking(userId: string) {
  const accessToken = useStore((state) => state.accessToken);

  return useQuery<{ parking: Parking }, ParkingError>({
    queryKey: ["parking", userId, "current"],
    queryFn: () => getCurrentParking({ userId, apiKey: accessToken }),
    enabled: !!userId && !!accessToken,
  });
}

export function getParkingById({
  userId,
  parkingId,
  apiKey,
}: {
  userId: string;
  parkingId: number;
  apiKey: string;
}): Promise<{ parking: Parking }> {
  return jsonApi.get({
    url: `${parkingEndpoint}/${userId}/${parkingId}`,
    bearerToken: apiKey,
  });
}

export function useGetParkingById(userId: string, parkingId: number) {
  const accessToken = useStore((state) => state.accessToken);

  return useQuery<{ parking: Parking }, ParkingError>({
    queryKey: ["parking", userId, parkingId],
    queryFn: () => getParkingById({ userId, parkingId, apiKey: accessToken }),
    enabled: !!userId && !!parkingId && !!accessToken,
  });
}

export function updateParking({
  userId,
  parkingId,
  payload,
  apiKey,
}: {
  userId: string;
  parkingId: number;
  payload: UpdateParkingPayload;
  apiKey: string;
}): Promise<ParkingResponse> {
  return jsonApi.put({
    url: `${parkingEndpoint}/${userId}/${parkingId}`,
    content: payload,
    bearerToken: apiKey,
  });
}

export function useUpdateParking() {
  const accessToken = useStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation<
    ParkingResponse,
    ParkingError,
    { userId: string; parkingId: number; payload: UpdateParkingPayload }
  >({
    mutationFn: ({ userId, parkingId, payload }) =>
      updateParking({ userId, parkingId, payload, apiKey: accessToken }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["parking"] });
      queryClient.invalidateQueries({
        queryKey: ["parking", variables.userId, variables.parkingId],
      });
    },
  });
}

export function deleteParking({
  userId,
  parkingId,
  apiKey,
}: {
  userId: string;
  parkingId: number;
  apiKey: string;
}): Promise<DeleteParkingResponse> {
  return jsonApi.delete({
    url: `${parkingEndpoint}/${userId}/${parkingId}`,
    bearerToken: apiKey,
  });
}

export function useDeleteParking() {
  const accessToken = useStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation<
    DeleteParkingResponse,
    ParkingError,
    { userId: string; parkingId: number }
  >({
    mutationFn: ({ userId, parkingId }) =>
      deleteParking({ userId, parkingId, apiKey: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking"] });
    },
  });
}

export function startTimer({
  userId,
  parkingId,
  payload,
  apiKey,
}: {
  userId: string;
  parkingId: number;
  payload: StartTimerPayload;
  apiKey: string;
}): Promise<TimerResponse> {
  return jsonApi.post({
    url: `${parkingEndpoint}/${userId}/${parkingId}/start-timer`,
    content: payload,
    bearerToken: apiKey,
  });
}

export function useStartTimer() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<
    TimerResponse,
    ParkingError,
    { userId: string; parkingId: number; payload: StartTimerPayload }
  >({
    mutationFn: ({ userId, parkingId, payload }) =>
      startTimer({ userId, parkingId, payload, apiKey: accessToken }),
  });
}
