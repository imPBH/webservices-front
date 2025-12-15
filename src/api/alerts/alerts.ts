import { useMutation, useQuery } from "@tanstack/react-query";
import { jsonApi } from "../jsonApi";
import type {
  Alert,
  AlertInput,
  Alerts,
  AlertsError,
  Categories,
  Category,
  CategoryInput,
  Media,
  MediaInput,
  Participation,
  ParticipationInput,
} from "./alerts.types";
import { useStore } from "../../store/store";
import { queryClient } from "../client";

const AUTH_SERVICE_URL: string = import.meta.env.VITE_AUTH_SERVICE_URL;
const alertsEndpoint = AUTH_SERVICE_URL + "/api/alertes_citoyennes";

export function getAlerts({
  page = 1,
  limit = 20,
  bearerToken,
}: {
  page?: number;
  limit?: number;
  bearerToken: string;
}): Promise<Alerts> {
  return jsonApi.get({
    url: `${alertsEndpoint}/alerts?page=${page}&limit=${limit}`,
    bearerToken,
  });
}

export function useGetAlerts(page = 1, limit = 20) {
  const accessToken = useStore((state) => state.accessToken);

  return useQuery<Alerts, AlertsError>({
    queryKey: ["alerts", page, limit],
    queryFn: () => getAlerts({ page, limit, bearerToken: accessToken }),
    enabled: !!accessToken,
  });
}

export function getAlertById({
  id,
  bearerToken,
}: {
  id: number;
  bearerToken: string;
}): Promise<Alert> {
  return jsonApi.get({
    url: `${alertsEndpoint}/alerts/${id}`,
    bearerToken,
  });
}

export function useGetAlertById(id: number) {
  const accessToken = useStore((state) => state.accessToken);

  return useQuery<Alert, AlertsError>({
    queryKey: ["alert", id],
    queryFn: () => getAlertById({ id, bearerToken: accessToken }),
    enabled: !!id && !!accessToken,
  });
}

export function createAlert({
  payload,
  bearerToken,
}: {
  payload: AlertInput;
  bearerToken: string;
}): Promise<Alert> {
  return jsonApi.post({
    url: `${alertsEndpoint}/alerts`,
    content: payload,
    bearerToken,
  });
}

export function useCreateAlert() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<Alert, AlertsError, AlertInput>({
    mutationFn: (payload: AlertInput) =>
      createAlert({ payload, bearerToken: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function updateAlert({
  id,
  payload,
  bearerToken,
}: {
  id: number;
  payload: AlertInput;
  bearerToken: string;
}): Promise<Alert> {
  return jsonApi.put({
    url: `${alertsEndpoint}/alerts/${id}`,
    content: payload,
    bearerToken,
  });
}

export function useUpdateAlert() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<Alert, AlertsError, { id: number; payload: AlertInput }>({
    mutationFn: ({ id, payload }) =>
      updateAlert({ id, payload, bearerToken: accessToken }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({
        queryKey: ["alert", variables.id],
      });
    },
  });
}

// STOPPED HERE

export function deleteAlert({
  id,
  bearerToken,
}: {
  id: number;
  bearerToken: string;
}): Promise<void> {
  return jsonApi.delete({
    url: `${alertsEndpoint}/alerts/${id}`,
    bearerToken,
  });
}

export function useDeleteAlert() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<void, AlertsError, { id: number }>({
    mutationFn: ({ id }) => deleteAlert({ id, bearerToken: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function getCategories(bearerToken: string): Promise<Categories> {
  return jsonApi.get({
    url: `${alertsEndpoint}/categories`,
    bearerToken,
  });
}

export function useGetCategories() {
  const accessToken = useStore((state) => state.accessToken);

  return useQuery<Categories, AlertsError>({
    queryKey: ["categories"],
    queryFn: () => getCategories(accessToken),
    enabled: !!accessToken,
  });
}

export function createCategory({
  payload,
  bearerToken,
}: {
  payload: CategoryInput;
  bearerToken: string;
}): Promise<Category> {
  return jsonApi.post({
    url: `${alertsEndpoint}/categories`,
    content: payload,
    bearerToken,
  });
}

export function useCreateCategory() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<Category, AlertsError, CategoryInput>({
    mutationFn: (payload: CategoryInput) =>
      createCategory({ payload, bearerToken: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function getMedias(bearerToken: string): Promise<Media[]> {
  return jsonApi.get({
    url: `${alertsEndpoint}/medias`,
    bearerToken,
  });
}

export function useGetMedias() {
  const accessToken = useStore((state) => state.accessToken);

  return useQuery<Media[], AlertsError>({
    queryKey: ["medias"],
    queryFn: () => getMedias(accessToken),
    enabled: !!accessToken,
  });
}

export function createMedia({
  payload,
  bearerToken,
}: {
  payload: MediaInput;
  bearerToken: string;
}): Promise<Media> {
  return jsonApi.post({
    url: `${alertsEndpoint}/medias`,
    content: payload,
    bearerToken,
  });
}

export function useCreateMedia() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<Media, AlertsError, MediaInput>({
    mutationFn: (payload: MediaInput) =>
      createMedia({ payload, bearerToken: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
}

export function deleteMedia({
  id,
  bearerToken,
}: {
  id: number;
  bearerToken: string;
}): Promise<void> {
  return jsonApi.delete({
    url: `${alertsEndpoint}/medias/${id}`,
    bearerToken,
  });
}

export function useDeleteMedia() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<void, AlertsError, number>({
    mutationFn: (id: number) => deleteMedia({ id, bearerToken: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
}

export function getParticipations(
  bearerToken: string
): Promise<Participation[]> {
  return jsonApi.get({
    url: `${alertsEndpoint}/participations`,
    bearerToken,
  });
}

export function useGetParticipations() {
  const accessToken = useStore((state) => state.accessToken);

  return useQuery<Participation[], AlertsError>({
    queryKey: ["participations"],
    queryFn: () => getParticipations(accessToken),
    enabled: !!accessToken,
  });
}

export function createParticipation({
  payload,
  bearerToken,
}: {
  payload: ParticipationInput;
  bearerToken: string;
}): Promise<Participation> {
  return jsonApi.post({
    url: `${alertsEndpoint}/participations`,
    content: payload,
    bearerToken,
  });
}

export function useCreateParticipation() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<Participation, AlertsError, ParticipationInput>({
    mutationFn: (payload: ParticipationInput) =>
      createParticipation({ payload, bearerToken: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participations"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function deleteParticipation({
  id,
  bearerToken,
}: {
  id: number;
  bearerToken: string;
}): Promise<void> {
  return jsonApi.delete({
    url: `${alertsEndpoint}/participations/${id}`,
    bearerToken,
  });
}

export function useDeleteParticipation() {
  const accessToken = useStore((state) => state.accessToken);

  return useMutation<void, AlertsError, number>({
    mutationFn: (id: number) =>
      deleteParticipation({ id, bearerToken: accessToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participations"] });
    },
  });
}
