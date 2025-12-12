import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/store";
import {
  useGetAlerts,
  useCreateAlert,
  useUpdateAlert,
  useDeleteAlert,
  useGetCategories,
  useCreateParticipation,
} from "../api/alerts/alerts";
import type { Alert, AlertStatus } from "../api/alerts/alerts.types";
import {
  BellRing,
  Plus,
  Edit,
  Trash2,
  MapPin,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { Container } from "../components/ui/Container";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import AlertsMap from "../components/maps/AlertsMap";
import { useToastContext } from "../contexts/ToastContext";

export default function AlertsPage() {
  const username = useStore((state) => state.username);
  const userId = useStore((state) => state.userId);
  const toast = useToastContext();

  const [page] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [participationText, setParticipationText] = useState("");

  const [formData, setFormData] = useState<{
    titre: string;
    description: string;
    intensite: string;
    latitude: string;
    longitude: string;
    categorieId: string;
    statut: AlertStatus;
  }>({
    titre: "",
    description: "",
    intensite: "",
    latitude: "",
    longitude: "",
    categorieId: "",
    statut: "ouverte",
  });

  const alertsRequest = useGetAlerts(page, 20);
  const categoriesRequest = useGetCategories();
  const createMutation = useCreateAlert();
  const updateMutation = useUpdateAlert();
  const deleteMutation = useDeleteAlert();
  const participateMutation = useCreateParticipation();

  const categories = categoriesRequest.data?.data;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        userId: userId,
        titre: formData.titre,
        description: formData.description,
        intensite: formData.intensite,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        categorieId: parseInt(formData.categorieId),
        statut: formData.statut,
      });
      setFormData({
        titre: "",
        description: "",
        intensite: "",
        latitude: "",
        longitude: "",
        categorieId: "",
        statut: "ouverte",
      });
      setIsCreating(false);
      toast.success("Alerte créée avec succès !");
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.error("Erreur lors de la création de l'alerte");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlert) return;

    try {
      await updateMutation.mutateAsync({
        id: editingAlert.id,
        payload: {
          userId: editingAlert.userId,
          titre: formData.titre,
          description: formData.description,
          intensite: formData.intensite,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          categorieId: parseInt(formData.categorieId),
          statut: formData.statut,
        },
      });
      setEditingAlert(null);
      setFormData({
        titre: "",
        description: "",
        intensite: "",
        latitude: "",
        longitude: "",
        categorieId: "",
        statut: "ouverte",
      });
      toast.success("Alerte mise à jour avec succès !");
    } catch (error) {
      console.error("Error updating alert:", error);
      toast.error("Erreur lors de la mise à jour de l'alerte");
    }
  };

  const handleDelete = async (alert: Alert) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette alerte ?")) return;

    try {
      await deleteMutation.mutateAsync({
        id: alert.id,
      });
      toast.success("Alerte supprimée avec succès !");
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast.error("Erreur lors de la suppression de l'alerte");
    }
  };

  const handleParticipate = async () => {
    if (!selectedAlert || !participationText.trim()) return;

    try {
      await participateMutation.mutateAsync({
        message: participationText,
        alerteId: selectedAlert.id,
        nom: username,
      });

      setParticipationText("");
      toast.success("Participation ajoutée avec succès !");

      await alertsRequest.refetch();
      const refreshed = alertsRequest.data?.data ?? [];
      const updated = refreshed.find((a: Alert) => a.id === selectedAlert.id);
      if (updated) setSelectedAlert(updated);
    } catch (error) {
      console.error("Error creating participation:", error);
      toast.error("Erreur lors de l'ajout de la participation");
    }
  };

  const startEditing = (alert: Alert) => {
    setEditingAlert(alert);
    setFormData({
      titre: alert.titre,
      description: alert.description,
      intensite: alert.intensite,
      latitude: alert.latitude.toString(),
      longitude: alert.longitude.toString(),
      categorieId: alert.categorieId.toString(),
      statut: alert.statut,
    });
  };

  const cancelEditing = () => {
    setEditingAlert(null);
    setFormData({
      titre: "",
      description: "",
      intensite: "",
      latitude: "",
      longitude: "",
      categorieId: "",
      statut: "ouverte",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ouverte":
        return "bg-red-500/80 text-white";
      case "en_cours":
        return "bg-orange-500/80 text-white";
      case "resolue":
        return "bg-green-500/80 text-white";
      default:
        return "bg-gray-500/80 text-white";
    }
  };

  const handleAddAlert = () => {
    setIsCreating(true);

    if (!navigator.geolocation) {
      console.error("La géolocalisation n'est pas supportée par ce navigateur");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));
        toast.success("Position GPS récupérée !");
      },
      (err) => {
        console.error(err);
        toast.error("Impossible de récupérer votre position");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  if (alertsRequest.isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Header />
        <Container>
          <div className="py-20 text-center">
            <p className="text-slate-400">Chargement...</p>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  const alerts = alertsRequest.data?.data || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-10 pt-20 sm:pt-24">
        {/* Background gradients */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-[-20%] h-[40rem] bg-[radial-gradient(60rem_60rem_at_top,theme(colors.cyan.500/.25),transparent_70%)]" />
          <div className="absolute inset-x-0 bottom-[-30%] h-[50rem] bg-[radial-gradient(55rem_55rem_at_bottom_right,theme(colors.sky.500/.2),transparent_70%)]" />
        </div>

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 shadow-lg shadow-cyan-500/30">
                <BellRing className="h-6 w-6 text-slate-950" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Alertes Citoyennes
                </h1>
                <p className="text-slate-400 mt-1">Bienvenue, {username}</p>
              </div>
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-cyan-400" />
                Carte des Alertes
              </h2>
              <div className="h-[500px] w-full rounded-xl overflow-hidden border border-white/5">
                {alerts.length > 0 ? (
                  <AlertsMap
                    alerts={alerts}
                    onMarkerClick={(alert) => setSelectedAlert(alert)}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-900/50">
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <p className="text-slate-500">Aucune alerte à afficher</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Create Alert Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur lg:col-span-1"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6 text-cyan-400" />
                {editingAlert ? "Modifier l'alerte" : "Nouvelle Alerte"}
              </h2>

              {!isCreating && !editingAlert ? (
                <button
                  onClick={handleAddAlert}
                  className="w-full px-6 py-4 bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Créer une alerte
                </button>
              ) : (
                <form
                  onSubmit={editingAlert ? handleUpdate : handleCreate}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.titre}
                      onChange={(e) =>
                        setFormData({ ...formData, titre: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Nid de poule sur la voirie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Décrivez le problème..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Catégorie *
                    </label>
                    <select
                      required
                      value={formData.categorieId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categorieId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner...</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Intensité *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.intensite}
                      onChange={(e) =>
                        setFormData({ ...formData, intensite: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Faible, Moyen, Élevé"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Latitude *
                      </label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={formData.latitude}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            latitude: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="48.8566"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Longitude *
                      </label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={formData.longitude}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            longitude: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="2.3522"
                      />
                    </div>
                  </div>
                  {editingAlert && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Statut
                      </label>
                      <select
                        value={formData.statut}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            statut: e.target.value as
                              | "ouverte"
                              | "en_cours"
                              | "resolue",
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="ouverte">Ouverte</option>
                        <option value="en_cours">En cours</option>
                        <option value="resolue">Résolue</option>
                      </select>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={
                        editingAlert
                          ? updateMutation.isPending
                          : createMutation.isPending
                      }
                      className="flex-1 px-4 py-3 bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
                    >
                      {editingAlert
                        ? updateMutation.isPending
                          ? "Mise à jour..."
                          : "Mettre à jour"
                        : createMutation.isPending
                        ? "Création..."
                        : "Créer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingAlert) {
                          cancelEditing();
                        } else {
                          setIsCreating(false);
                        }
                        setFormData({
                          titre: "",
                          description: "",
                          intensite: "",
                          latitude: "",
                          longitude: "",
                          categorieId: "",
                          statut: "ouverte",
                        });
                      }}
                      className="px-4 py-3 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Alerts List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur lg:col-span-2"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-cyan-400" />
                  Liste des Alertes ({alerts.length || 0})
                </span>
              </h2>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-white/5">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400 font-medium">
                      Aucune alerte pour le moment
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Créez votre première alerte citoyenne
                    </p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={`${alert.id}-${alert.userId}`}
                      onClick={() => setSelectedAlert(alert)}
                      className={`bg-slate-900/30 rounded-lg p-4 border transition-all cursor-pointer ${
                        selectedAlert?.id === alert.id
                          ? "border-cyan-500/50 shadow-[0_0_0_2px_rgba(34,211,238,0.25)]"
                          : "border-white/5 hover:border-cyan-500/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {alert.titre}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(
                                alert.statut
                              )}`}
                            >
                              {alert.statut}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">
                            {alert.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            {alert.categorie && (
                              <span>📁 {alert.categorie.nom}</span>
                            )}
                            <span>⚡ {alert.intensite}</span>
                            <span>
                              📅{" "}
                              {new Date(
                                alert.dateCreation
                              ).toLocaleDateString()}
                            </span>
                            {alert.participations && (
                              <span>
                                💬 {alert.participations.length} participations
                              </span>
                            )}
                          </div>
                        </div>
                        {alert.userId === userId && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(alert)}
                              className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(alert)}
                              disabled={deleteMutation.isPending}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      {selectedAlert?.id === alert.id && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-cyan-400" />
                            Participations
                          </h4>

                          {/* Liste des participations */}
                          <div className="space-y-3 mb-3">
                            {Array.isArray(selectedAlert.participations) &&
                            selectedAlert.participations.length > 0 ? (
                              [...selectedAlert.participations]
                                .sort(
                                  (a, b) =>
                                    new Date(b.dateParticipation).getTime() -
                                    new Date(a.dateParticipation).getTime()
                                )
                                .map((p) => (
                                  <div
                                    key={p.id}
                                    className="rounded-lg bg-slate-900/60 border border-white/10 p-3"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium text-slate-200">
                                        {p.nom}
                                      </span>
                                      <span className="text-[11px] text-slate-500">
                                        {new Date(
                                          p.dateParticipation
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-300">
                                      {p.message}
                                    </p>
                                  </div>
                                ))
                            ) : (
                              <p className="text-sm text-slate-500">
                                Aucune participation pour le moment.
                              </p>
                            )}
                          </div>

                          {/* Champ pour ajouter une participation */}
                          <h5 className="sr-only">Ajouter une participation</h5>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={participationText}
                              onChange={(e) =>
                                setParticipationText(e.target.value)
                              }
                              placeholder="Votre message..."
                              className="flex-1 px-3 py-2 text-sm rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                            <button
                              onClick={handleParticipate}
                              disabled={participateMutation.isPending}
                              className="px-4 py-2 text-sm bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
                            >
                              Envoyer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {/* {alertsData && alertsData.total_pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <span className="px-4 py-2 text-slate-400">
                    Page {page} / {alertsData.total_pages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(alertsData.total_pages, p + 1))
                    }
                    disabled={page === alertsData.total_pages}
                    className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              )} */}
            </motion.div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
