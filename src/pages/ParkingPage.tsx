import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/store";
import {
  useCreateParking,
  useGetCurrentParking,
  useUpdateParking,
  useDeleteParking,
} from "../api/parking/parking";
import { MapPin, Trash2, Edit, Save, X, Plus, Car } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import ParkingMap from "../components/maps/ParkingMap";
import { useToastContext } from "../contexts/ToastContext";

export default function ParkingPage() {
  const username = useStore((state) => state.username);
  const toast = useToastContext();

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    address: "",
    note: "",
  });

  const { data: currentParkingData, isLoading } = useGetCurrentParking();
  const createMutation = useCreateParking();
  const updateMutation = useUpdateParking();
  const deleteMutation = useDeleteParking();

  const currentParking = currentParkingData?.parking;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        payload: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          address: formData.address || undefined,
          note: formData.note || undefined,
        },
      });
      setFormData({ latitude: "", longitude: "", address: "", note: "" });
      setIsCreating(false);
      toast.success("Parking créé avec succès !");
    } catch (error) {
      console.error("Error creating parking:", error);
      toast.error("Erreur lors de la création du parking");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentParking) return;

    try {
      await updateMutation.mutateAsync({
        id: currentParking.id,
        payload: {
          address: formData.address || undefined,
          note: formData.note || undefined,
        },
      });
      setIsEditing(false);
      toast.success("Parking mis à jour avec succès !");
    } catch (error) {
      console.error("Error updating parking:", error);
      toast.error("Erreur lors de la mise à jour du parking");
    }
  };

  const handleDelete = async () => {
    if (!currentParking) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce parking ?")) return;

    try {
      await deleteMutation.mutateAsync({
        id: currentParking.id,
      });
      toast.success("Parking supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting parking:", error);
      toast.error("Erreur lors de la suppression du parking");
    }
  };

  const startEditing = () => {
    if (currentParking) {
      setFormData({
        latitude: "",
        longitude: "",
        address: currentParking.address || "",
        note: currentParking.note || "",
      });
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData({ latitude: "", longitude: "", address: "", note: "" });
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
                <Car className="h-6 w-6 text-slate-950" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Gestion de Parking
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
                Carte des Parkings
              </h2>
              <div className="h-[500px] w-full rounded-xl overflow-hidden border border-white/5">
                {currentParking ? (
                  <ParkingMap parkings={[currentParking]} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-900/50">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <p className="text-slate-500">Aucun parking à afficher</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Parking Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-cyan-400" />
                Position Actuelle
              </h2>

              {currentParking ? (
                <div className="space-y-4">
                  {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Adresse
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                          className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Note
                        </label>
                        <textarea
                          value={formData.note}
                          onChange={(e) =>
                            setFormData({ ...formData, note: e.target.value })
                          }
                          rows={3}
                          className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={updateMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {updateMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="space-y-2 bg-slate-900/30 rounded-lg p-4 border border-white/5">
                        <p className="text-sm text-slate-300">
                          <strong className="text-cyan-400">ID:</strong> {currentParking.id}
                        </p>
                        <p className="text-sm text-slate-300">
                          <strong className="text-cyan-400">Latitude:</strong> {currentParking.latitude}
                        </p>
                        <p className="text-sm text-slate-300">
                          <strong className="text-cyan-400">Longitude:</strong> {currentParking.longitude}
                        </p>
                        {currentParking.address && (
                          <p className="text-sm text-slate-300">
                            <strong className="text-cyan-400">Adresse:</strong> {currentParking.address}
                          </p>
                        )}
                        {currentParking.note && (
                          <p className="text-sm text-slate-300">
                            <strong className="text-cyan-400">Note:</strong> {currentParking.note}
                          </p>
                        )}
                        <p className="text-sm text-slate-400">
                          <strong className="text-cyan-400">Créé le:</strong>{" "}
                          {new Date(currentParking.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={startEditing}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={deleteMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-white/5">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400 font-medium">Aucune position enregistrée</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Créez votre première position de parking
                  </p>
                </div>
              )}
            </motion.div>

            {/* Create Parking Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6 text-cyan-400" />
                {isCreating ? "Nouvelle Position" : "Créer un Parking"}
              </h2>

              {!isCreating ? (
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full px-6 py-4 bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Créer une nouvelle position
                </button>
              ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      min="-90"
                      max="90"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: e.target.value })
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
                      min="-180"
                      max="180"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="2.3522"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Place de la Concorde, Paris"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Note
                    </label>
                    <textarea
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Ajouter une note..."
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="flex-1 px-4 py-3 bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
                    >
                      {createMutation.isPending ? "Création..." : "Créer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setFormData({
                          latitude: "",
                          longitude: "",
                          address: "",
                          note: "",
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
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
