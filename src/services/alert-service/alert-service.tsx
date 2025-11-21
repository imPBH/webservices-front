import { useState, useEffect } from 'react';
import { ServiceLayout } from '../../components/ui/service-layout';
import { AlertList } from './components/alert-list';
import { AlertDetail } from './components/alert-detail';
import { AlertMap } from './components/alert-map';
import { CreateAlertDialog } from './components/create-alert-dialog';
import { fetchAlerts, updateAlert, createAlert } from './api';
import type { Alert, AlertStatus, CreateAlertInput } from './types';

export function AlertService() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [intensiteFilter, setIntensiteFilter] = useState<string | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    let filtered = alerts;

    // Filtre de recherche
    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.categorie.nom.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre d'intensité
    if (intensiteFilter !== 'all') {
      filtered = filtered.filter(alert => alert.intensite === intensiteFilter);
    }

    // Filtre de statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(alert => alert.statut === statusFilter);
    }

    setFilteredAlerts(filtered);
  }, [searchQuery, intensiteFilter, statusFilter, alerts]);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAlerts();
      setAlerts(data);
      setFilteredAlerts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAlert = async (alertInput: CreateAlertInput) => {
    try {
      const newAlert = await createAlert(alertInput);
      setAlerts([newAlert, ...alerts]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
    }
  };

  const handleUpdateStatus = async (alertId: number, status: AlertStatus) => {
    try {
      const updatedAlert = await updateAlert(alertId, { statut: status });
      
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, statut: status } : alert
      ));
      
      if (selectedAlert?.id === alertId) {
        setSelectedAlert({ ...selectedAlert, statut: status });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  return (
    <ServiceLayout
      title="Service d'Alertes"
      description="Gestion et visualisation des alertes géolocalisées"
      actions={
        <button
          className="px-4 py-2 rounded transition-colors bg-slate-900 text-white hover:bg-slate-800"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Nouvelle alerte
        </button>
      }
    >
      <div className="space-y-6">
        {/* Carte */}
        <div className="w-full">
          <AlertMap
            alerts={filteredAlerts}
            selectedAlertId={selectedAlert?.id}
            onSelectAlert={setSelectedAlert}
          />
        </div>

        {/* Liste et détails */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Rechercher une alerte..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={intensiteFilter}
                onChange={(e) => setIntensiteFilter(e.target.value)}
              >
                <option value="all">Toutes les intensités</option>
                <option value="critique">Critique</option>
                <option value="élevée">Élevée</option>
                <option value="moyenne">Moyenne</option>
                <option value="faible">Faible</option>
              </select>

              <select
                className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AlertStatus | 'all')}
              >
                <option value="all">Tous les statuts</option>
                <option value="ouverte">Ouverte</option>
                <option value="en_cours">En cours</option>
                <option value="resolue">Résolue</option>
                <option value="fermee">Fermée</option>
              </select>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-slate-500">
                Chargement...
              </div>
            ) : (
              <AlertList
                alerts={filteredAlerts}
                selectedAlertId={selectedAlert?.id}
                onSelectAlert={setSelectedAlert}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedAlert ? (
              <AlertDetail 
                alert={selectedAlert}
                onUpdateStatus={handleUpdateStatus}
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] bg-white rounded-lg border-2 border-dashed border-slate-200">
                <p className="text-slate-500">
                  Sélectionnez une alerte pour voir les détails
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateAlertDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAlert}
      />
    </ServiceLayout>
  );
}