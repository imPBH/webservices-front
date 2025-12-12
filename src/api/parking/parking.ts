import { useMutation, useQuery } from "@tanstack/react-query";
import { jsonApi } from "../jsonApi";
import type {
  ParkingRequest,
  UpdateParkingRequest,
  ParkingResponse,
  CurrentParkingResponse,
  ParkingHistoryResponse,
  DeleteParkingResponse,
  ParkingApiError,
  GetParkingResponse,
  StartTimerRequest,
  StartTimerResponse,
} from "./parking.types";
import { useStore } from "../../store/store";
import { queryClient } from "../client";

const AUTH_SERVICE_URL: string = import.meta.env.VITE_AUTH_SERVICE_URL;

export function createParking({
  payload,
  bearerToken,
}: {
  payload: ParkingRequest;
  bearerToken: string;
}): Promise<ParkingResponse> {
  return jsonApi.post({
    url: `${AUTH_SERVICE_URL}/api/parking`,
    content: payload,
    bearerToken,
  });
}

export function useCreateParking() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<
    ParkingResponse,
    ParkingApiError,
    { payload: ParkingRequest }
  >({
    mutationFn: ({ payload }) =>
      createParking({ payload, bearerToken: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking"] });
    },
  });
}

export function getCurrentParking({
  bearerToken,
}: {
  bearerToken: string;
}): Promise<CurrentParkingResponse> {
  return jsonApi.get({
    url: `${AUTH_SERVICE_URL}/api/parking/current`,
    bearerToken,
  });
}

export function useGetCurrentParking() {
  const accessToken = useStore((state) => state.accessToken);

  return useQuery<CurrentParkingResponse, ParkingApiError>({
    queryKey: ["parking", "current"],
    queryFn: () => getCurrentParking({ bearerToken: accessToken }),
    enabled: !!accessToken,
  });
}

export function getParkingHistory({
  limit = 50,
  offset = 0,
  bearerToken,
}: {
  limit?: number;
  offset?: number;
  bearerToken: string;
}): Promise<ParkingHistoryResponse> {
  return jsonApi.get({
    url: `${AUTH_SERVICE_URL}/api/parking/history?limit=${limit}&offset=${offset}`,
    bearerToken,
  });
}

export function useGetParkingHistory(limit: number = 50, offset: number = 0) {
  const accessToken = useStore((state) => state.accessToken);

  return useQuery<ParkingHistoryResponse, ParkingApiError>({
    queryKey: ["parking", "history", limit, offset],
    queryFn: () =>
      getParkingHistory({ limit, offset, bearerToken: accessToken }),
    enabled: !!accessToken,
  });
}

export function getParking({
  id,
  bearerToken,
}: {
  id: number;
  bearerToken: string;
}): Promise<GetParkingResponse> {
  return jsonApi.get({
    url: `${AUTH_SERVICE_URL}/api/parking/${id}`,
    bearerToken,
  });
}

export function useGetParking(id: number) {
  const accessToken = useStore((state) => state.accessToken);

  return useQuery<GetParkingResponse, ParkingApiError>({
    queryKey: ["parking", id],
    queryFn: () => getParking({ id, bearerToken: accessToken }),
    enabled: !!id && !!accessToken,
  });
}

export function updateParking({
  id,
  payload,
  bearerToken,
}: {
  id: number;
  payload: UpdateParkingRequest;
  bearerToken: string;
}): Promise<ParkingResponse> {
  return jsonApi.patch({
    url: `${AUTH_SERVICE_URL}/api/parking/${id}`,
    content: payload,
    bearerToken,
  });
}

export function useUpdateParking() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<
    ParkingResponse,
    ParkingApiError,
    { id: number; payload: UpdateParkingRequest }
  >({
    mutationFn: ({ id, payload }) =>
      updateParking({ id, payload, bearerToken: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking"] });
      queryClient.invalidateQueries({
        queryKey: ["parking", "current"],
      });
    },
  });
}

export function deleteParking({
  id,
  bearerToken,
}: {
  id: number;
  bearerToken: string;
}): Promise<DeleteParkingResponse> {
  return jsonApi.delete({
    url: `${AUTH_SERVICE_URL}/api/parking/${id}`,
    bearerToken,
  });
}

export function useDeleteParking() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<DeleteParkingResponse, ParkingApiError, { id: number }>({
    mutationFn: ({ id }) => deleteParking({ id, bearerToken: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parking"] });
    },
  });
}

export function startParkingTimer({
  id,
  payload,
  bearerToken,
}: {
  id: number;
  payload?: StartTimerRequest;
  bearerToken: string;
}): Promise<StartTimerResponse> {
  return jsonApi.post({
    url: `${AUTH_SERVICE_URL}/api/parking/${id}/start-timer`,
    content: payload || {},
    bearerToken,
  });
}

export function useStartParkingTimer() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<
    StartTimerResponse,
    ParkingApiError,
    { id: number; payload?: StartTimerRequest }
  >({
    mutationFn: ({ id, payload }) =>
      startParkingTimer({ id, payload, bearerToken: accessToken }),
  });
}
