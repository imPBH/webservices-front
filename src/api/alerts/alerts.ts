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

// ============ ALERTS ============

export function getAlerts({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}): Promise<AlertPage> {
  return jsonApi.get({
    url: `${alertsEndpoint}/alerts?page=${page}&limit=${limit}`,
  });
}

export function useGetAlerts(page = 1, limit = 20) {
  return useQuery<AlertPage, AlertsError>({
    queryKey: ["alerts", page, limit],
    queryFn: () => getAlerts({ page, limit }),
  });
}

export function getAlertById({
  id_alert,
  user_id,
}: {
  id_alert: number;
  user_id: number;
}): Promise<Alert> {
  return jsonApi.get({
    url: `${alertsEndpoint}/alerts/${id_alert}/${user_id}`,
  });
}

export function useGetAlertById(id_alert: number, user_id: number) {
  return useQuery<Alert, AlertsError>({
    queryKey: ["alert", id_alert, user_id],
    queryFn: () => getAlertById({ id_alert, user_id }),
    enabled: !!id_alert && !!user_id,
  });
}

export function createAlert(payload: AlertInput): Promise<Alert> {
  return jsonApi.post({
    url: `${alertsEndpoint}/alerts`,
    content: payload,
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation<Alert, AlertsError, AlertInput>({
    mutationFn: (payload: AlertInput) => createAlert(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function updateAlert({
  id_alert,
  user_id,
  payload,
}: {
  id_alert: number;
  user_id: number;
  payload: AlertInput;
}): Promise<Alert> {
  return jsonApi.put({
    url: `${alertsEndpoint}/alerts/${id_alert}/${user_id}`,
    content: payload,
  });
}

export function useUpdateAlert() {
  const queryClient = useQueryClient();

  return useMutation<
    Alert,
    AlertsError,
    { id_alert: number; user_id: number; payload: AlertInput }
  >({
    mutationFn: ({ id_alert, user_id, payload }) =>
      updateAlert({ id_alert, user_id, payload }),
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
}: {
  id_alert: number;
  user_id: number;
}): Promise<void> {
  return jsonApi.delete({
    url: `${alertsEndpoint}/alerts/${id_alert}/${user_id}`,
  });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();

  return useMutation<void, AlertsError, { id_alert: number; user_id: number }>({
    mutationFn: ({ id_alert, user_id }) => deleteAlert({ id_alert, user_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

// ============ CATEGORIES ============

export function getCategories(): Promise<Category[]> {
  return jsonApi.get({
    url: `${alertsEndpoint}/categories`,
  });
}

export function useGetCategories() {
  return useQuery<Category[], AlertsError>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
}

export function createCategory(payload: CategoryInput): Promise<Category> {
  return jsonApi.post({
    url: `${alertsEndpoint}/categories`,
    content: payload,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, AlertsError, CategoryInput>({
    mutationFn: (payload: CategoryInput) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// ============ MEDIAS ============

export function getMedias(): Promise<Media[]> {
  return jsonApi.get({
    url: `${alertsEndpoint}/medias`,
  });
}

export function useGetMedias() {
  return useQuery<Media[], AlertsError>({
    queryKey: ["medias"],
    queryFn: () => getMedias(),
  });
}

export function createMedia(payload: MediaInput): Promise<Media> {
  return jsonApi.post({
    url: `${alertsEndpoint}/medias`,
    content: payload,
  });
}

export function useCreateMedia() {
  const queryClient = useQueryClient();

  return useMutation<Media, AlertsError, MediaInput>({
    mutationFn: (payload: MediaInput) => createMedia(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
}

export function deleteMedia(id_media: number): Promise<void> {
  return jsonApi.delete({
    url: `${alertsEndpoint}/medias/${id_media}`,
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation<void, AlertsError, number>({
    mutationFn: (id_media: number) => deleteMedia(id_media),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
}

// ============ PARTICIPATIONS ============

export function getParticipations(): Promise<Participation[]> {
  return jsonApi.get({
    url: `${alertsEndpoint}/participations`,
  });
}

export function useGetParticipations() {
  return useQuery<Participation[], AlertsError>({
    queryKey: ["participations"],
    queryFn: () => getParticipations(),
  });
}

export function createParticipation(
  payload: ParticipationInput
): Promise<Participation> {
  return jsonApi.post({
    url: `${alertsEndpoint}/participations`,
    content: payload,
  });
}

export function useCreateParticipation() {
  const queryClient = useQueryClient();
  const userId = useStore((state) => state.username);

  return useMutation<Participation, AlertsError, ParticipationInput>({
    mutationFn: (payload: ParticipationInput) =>
      createParticipation({ ...payload, user_id: parseInt(userId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participations"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function deleteParticipation(id_participation: number): Promise<void> {
  return jsonApi.delete({
    url: `${alertsEndpoint}/participations/${id_participation}`,
  });
}

export function useDeleteParticipation() {
  const queryClient = useQueryClient();

  return useMutation<void, AlertsError, number>({
    mutationFn: (id_participation: number) =>
      deleteParticipation(id_participation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participations"] });
    },
  });
}
