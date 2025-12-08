import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jsonApi } from "../jsonApi";
import type {
  Alert,
  AlertInput,
  AlertPage,
  AlertsError,
  Category,
  CategoryInput,
  Media,
  MediaInput,
  Participation,
  ParticipationInput,
} from "./alerts.types";
import { useStore } from "../../store/store";

const ALERTS_SERVICE_URL: string = import.meta.env.VITE_ALERTS_SERVICE_URL;
const alertsEndpoint = ALERTS_SERVICE_URL + "/api";

export function getAlerts({
  page = 1,
  limit = 20,
  apiKey,
}: {
  page?: number;
  limit?: number;
  apiKey: string;
}): Promise<AlertPage> {
  return jsonApi.get({
    url: `${alertsEndpoint}/alerts?page=${page}&limit=${limit}`,
    apiKey,
  });
}

export function useGetAlerts(page = 1, limit = 20) {
  const alertsApiKey = useStore((state) => state.alertsApiKey);

  return useQuery<AlertPage, AlertsError>({
    queryKey: ["alerts", page, limit],
    queryFn: () => getAlerts({ page, limit, apiKey: alertsApiKey }),
    enabled: !!alertsApiKey,
  });
}

export function getAlertById({
  id_alert,
  user_id,
  apiKey,
}: {
  id_alert: number;
  user_id: number;
  apiKey: string;
}): Promise<Alert> {
  return jsonApi.get({
    url: `${alertsEndpoint}/alerts/${id_alert}/${user_id}`,
    apiKey,
  });
}

export function useGetAlertById(id_alert: number, user_id: number) {
  const alertsApiKey = useStore((state) => state.alertsApiKey);

  return useQuery<Alert, AlertsError>({
    queryKey: ["alert", id_alert, user_id],
    queryFn: () => getAlertById({ id_alert, user_id, apiKey: alertsApiKey }),
    enabled: !!id_alert && !!user_id && !!alertsApiKey,
  });
}

export function createAlert({
  payload,
  apiKey,
}: {
  payload: AlertInput;
  apiKey: string;
}): Promise<Alert> {
  return jsonApi.post({
    url: `${alertsEndpoint}/alerts`,
    content: payload,
    apiKey,
  });
}

export function useCreateAlert() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);
  const queryClient = useQueryClient();

  return useMutation<Alert, AlertsError, AlertInput>({
    mutationFn: (payload: AlertInput) => createAlert({ payload, apiKey: alertsApiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function updateAlert({
  id_alert,
  user_id,
  payload,
  apiKey,
}: {
  id_alert: number;
  user_id: number;
  payload: AlertInput;
  apiKey: string;
}): Promise<Alert> {
  return jsonApi.put({
    url: `${alertsEndpoint}/alerts/${id_alert}/${user_id}`,
    content: payload,
    apiKey,
  });
}

export function useUpdateAlert() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);
  const queryClient = useQueryClient();

  return useMutation<
    Alert,
    AlertsError,
    { id_alert: number; user_id: number; payload: AlertInput }
  >({
    mutationFn: ({ id_alert, user_id, payload }) =>
      updateAlert({ id_alert, user_id, payload, apiKey: alertsApiKey }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({
        queryKey: ["alert", variables.id_alert, variables.user_id],
      });
    },
  });
}

export function deleteAlert({
  id_alert,
  user_id,
  apiKey,
}: {
  id_alert: number;
  user_id: number;
  apiKey: string;
}): Promise<void> {
  return jsonApi.delete({
    url: `${alertsEndpoint}/alerts/${id_alert}/${user_id}`,
    apiKey,
  });
}

export function useDeleteAlert() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);
  const queryClient = useQueryClient();

  return useMutation<void, AlertsError, { id_alert: number; user_id: number }>({
    mutationFn: ({ id_alert, user_id }) => deleteAlert({ id_alert, user_id, apiKey: alertsApiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function getCategories(apiKey: string): Promise<Category[]> {
  return jsonApi.get({
    url: `${alertsEndpoint}/categories`,
    apiKey,
  });
}

export function useGetCategories() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);

  return useQuery<Category[], AlertsError>({
    queryKey: ["categories"],
    queryFn: () => getCategories(alertsApiKey),
    enabled: !!alertsApiKey,
  });
}

export function createCategory({
  payload,
  apiKey,
}: {
  payload: CategoryInput;
  apiKey: string;
}): Promise<Category> {
  return jsonApi.post({
    url: `${alertsEndpoint}/categories`,
    content: payload,
    apiKey,
  });
}

export function useCreateCategory() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);
  const queryClient = useQueryClient();

  return useMutation<Category, AlertsError, CategoryInput>({
    mutationFn: (payload: CategoryInput) => createCategory({ payload, apiKey: alertsApiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function getMedias(apiKey: string): Promise<Media[]> {
  return jsonApi.get({
    url: `${alertsEndpoint}/medias`,
    apiKey,
  });
}

export function useGetMedias() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);

  return useQuery<Media[], AlertsError>({
    queryKey: ["medias"],
    queryFn: () => getMedias(alertsApiKey),
    enabled: !!alertsApiKey,
  });
}

export function createMedia({
  payload,
  apiKey,
}: {
  payload: MediaInput;
  apiKey: string;
}): Promise<Media> {
  return jsonApi.post({
    url: `${alertsEndpoint}/medias`,
    content: payload,
    apiKey,
  });
}

export function useCreateMedia() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);
  const queryClient = useQueryClient();

  return useMutation<Media, AlertsError, MediaInput>({
    mutationFn: (payload: MediaInput) => createMedia({ payload, apiKey: alertsApiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
}

export function deleteMedia({
  id_media,
  apiKey,
}: {
  id_media: number;
  apiKey: string;
}): Promise<void> {
  return jsonApi.delete({
    url: `${alertsEndpoint}/medias/${id_media}`,
    apiKey,
  });
}

export function useDeleteMedia() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);
  const queryClient = useQueryClient();

  return useMutation<void, AlertsError, number>({
    mutationFn: (id_media: number) => deleteMedia({ id_media, apiKey: alertsApiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
}

export function getParticipations(apiKey: string): Promise<Participation[]> {
  return jsonApi.get({
    url: `${alertsEndpoint}/participations`,
    apiKey,
  });
}

export function useGetParticipations() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);

  return useQuery<Participation[], AlertsError>({
    queryKey: ["participations"],
    queryFn: () => getParticipations(alertsApiKey),
    enabled: !!alertsApiKey,
  });
}

export function createParticipation({
  payload,
  apiKey,
}: {
  payload: ParticipationInput;
  apiKey: string;
}): Promise<Participation> {
  return jsonApi.post({
    url: `${alertsEndpoint}/participations`,
    content: payload,
    apiKey,
  });
}

export function useCreateParticipation() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);
  const queryClient = useQueryClient();

  return useMutation<Participation, AlertsError, ParticipationInput>({
    mutationFn: (payload: ParticipationInput) =>
      createParticipation({ payload, apiKey: alertsApiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participations"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function deleteParticipation({
  id_participation,
  apiKey,
}: {
  id_participation: number;
  apiKey: string;
}): Promise<void> {
  return jsonApi.delete({
    url: `${alertsEndpoint}/participations/${id_participation}`,
    apiKey,
  });
}

export function useDeleteParticipation() {
  const alertsApiKey = useStore((state) => state.alertsApiKey);
  const queryClient = useQueryClient();

  return useMutation<void, AlertsError, number>({
    mutationFn: (id_participation: number) =>
      deleteParticipation({ id_participation, apiKey: alertsApiKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participations"] });
    },
  });
}
