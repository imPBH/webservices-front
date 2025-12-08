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

  const [page, setPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [participationText, setParticipationText] = useState("");

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    intensity: string;
    location_lat: string;
    location_lon: string;
    id_category: string;
    status: AlertStatus;
  }>({
    title: "",
    description: "",
    intensity: "",
    location_lat: "",
    location_lon: "",
    id_category: "",
    status: "ouverte",
  });

  const { data: alertsData, isLoading } = useGetAlerts(page, 20);
  const { data: categories } = useGetCategories();
  const createMutation = useCreateAlert();
  const updateMutation = useUpdateAlert();
  const deleteMutation = useDeleteAlert();
  const participateMutation = useCreateParticipation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        user_id: userId,
        title: formData.title,
        description: formData.description,
        intensity: formData.intensity,
        location_lat: parseFloat(formData.location_lat),
        location_lon: parseFloat(formData.location_lon),
        id_category: parseInt(formData.id_category),
        status: formData.status,
      });
      setFormData({
        title: "",
        description: "",
        intensity: "",
        location_lat: "",
        location_lon: "",
        id_category: "",
        status: "ouverte",
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
        id: editingAlert.id_alert,
        payload: {
          user_id: editingAlert.user_id,
          title: formData.title,
          description: formData.description,
          intensity: formData.intensity,
          location_lat: parseFloat(formData.location_lat),
          location_lon: parseFloat(formData.location_lon),
          id_category: parseInt(formData.id_category),
          status: formData.status,
        },
      });
      setEditingAlert(null);
      setFormData({
        title: "",
        description: "",
        intensity: "",
        location_lat: "",
        location_lon: "",
        id_category: "",
        status: "ouverte",
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
        id: alert.id_alert,
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
        user_id: userId,
        response: participationText,
        id_alert: selectedAlert.id_alert,
        alert_user_id: selectedAlert.user_id,
      });
      setParticipationText("");
      toast.success("Participation ajoutée avec succès !");
    } catch (error) {
      console.error("Error creating participation:", error);
      toast.error("Erreur lors de l'ajout de la participation");
    }
  };

  const startEditing = (alert: Alert) => {
    setEditingAlert(alert);
    setFormData({
      title: alert.title,
      description: alert.description,
      intensity: alert.intensity,
      location_lat: alert.location_lat.toString(),
      location_lon: alert.location_lon.toString(),
      id_category: alert.id_category.toString(),
      status: alert.status,
    });
  };

  const cancelEditing = () => {
    setEditingAlert(null);
    setFormData({
      title: "",
      description: "",
      intensity: "",
      location_lat: "",
      location_lon: "",
      id_category: "",
      status: "ouverte",
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

  if (isLoading) {
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

  const alerts = alertsData?.items || [];

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
                  onClick={() => setIsCreating(true)}
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
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
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
                        setFormData({ ...formData, description: e.target.value })
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
                      value={formData.id_category}
                      onChange={(e) =>
                        setFormData({ ...formData, id_category: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner...</option>
                      {categories?.map((cat) => (
                        <option key={cat.id_category} value={cat.id_category}>
                          {cat.title}
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
                      value={formData.intensity}
                      onChange={(e) =>
                        setFormData({ ...formData, intensity: e.target.value })
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
                        value={formData.location_lat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location_lat: e.target.value,
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
                        value={formData.location_lon}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location_lon: e.target.value,
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
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "ouverte" | "en_cours" | "resolue",
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
                          title: "",
                          description: "",
                          intensity: "",
                          location_lat: "",
                          location_lon: "",
                          id_category: "",
                          status: "ouverte",
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
                  Liste des Alertes ({alertsData?.total_items || 0})
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
                      key={`${alert.id_alert}-${alert.user_id}`}
                      className="bg-slate-900/30 rounded-lg p-4 border border-white/5 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{alert.title}</h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(alert.status)}`}
                            >
                              {alert.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">
                            {alert.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            {alert.category && (
                              <span>📁 {alert.category.title}</span>
                            )}
                            <span>⚡ {alert.intensity}</span>
                            <span>
                              📅 {new Date(alert.created_at).toLocaleDateString()}
                            </span>
                            {alert.participation && (
                              <span>💬 {alert.participation.length} participations</span>
                            )}
                          </div>
                        </div>
                        {alert.user_id === userId && (
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
                      {selectedAlert?.id_alert === alert.id_alert && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-cyan-400" />
                            Participer
                          </h4>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={participationText}
                              onChange={(e) => setParticipationText(e.target.value)}
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
              {alertsData && alertsData.total_pages > 1 && (
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
              )}
            </motion.div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
