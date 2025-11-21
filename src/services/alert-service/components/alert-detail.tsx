import type { Alert, AlertStatus } from '../types';

interface AlertDetailProps {
  alert: Alert;
  onUpdateStatus?: (alertId: number, status: AlertStatus) => void;
}

// Configuration pour l'intensité
const intensiteConfig: Record<string, { label: string; className: string }> = {
  'faible': { label: 'Faible', className: 'bg-blue-100 text-blue-800' },
  'moyenne': { label: 'Moyenne', className: 'bg-yellow-100 text-yellow-800' },
  'élevée': { label: 'Élevée', className: 'bg-orange-100 text-orange-800' },
  'critique': { label: 'Critique', className: 'bg-red-100 text-red-800' }
};

const statusConfig: Record<AlertStatus, { label: string; className: string }> = {
  ouverte: { label: 'Ouverte', className: 'bg-green-100 text-green-800' },
  en_cours: { label: 'En cours', className: 'bg-purple-100 text-purple-800' },
  resolue: { label: 'Résolue', className: 'bg-slate-100 text-slate-800' },
  fermee: { label: 'Fermée', className: 'bg-slate-100 text-slate-800' }
};

export function AlertDetail({ alert, onUpdateStatus }: AlertDetailProps) {
  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const intensiteInfo = intensiteConfig[alert.intensite] || intensiteConfig['moyenne'];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-slate-900 flex-1">{alert.titre}</h3>
            <div className="flex gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs ${intensiteInfo.className}`}>
                {intensiteInfo.label}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs ${statusConfig[alert.statut].className}`}>
                {statusConfig[alert.statut].label}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div>
            <h4 className="text-sm text-slate-500 mb-1">Description</h4>
            <p className="text-slate-900">{alert.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-slate-500 mb-1">Date de création</h4>
              <p className="text-slate-900">{formatDateTime(alert.dateCreation)}</p>
            </div>

            <div>
              <h4 className="text-sm text-slate-500 mb-1">Catégorie</h4>
              <p className="text-slate-900">{alert.categorie.nom}</p>
              <p className="text-xs text-slate-500">{alert.categorie.description}</p>
            </div>

            <div>
              <h4 className="text-sm text-slate-500 mb-1">Utilisateur</h4>
              <p className="text-slate-900">ID: {alert.userId}</p>
            </div>

            <div>
              <h4 className="text-sm text-slate-500 mb-1">Intensité</h4>
              <p className="text-slate-900">{alert.intensite}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-slate-500 mb-1">Localisation</h4>
            <p className="text-slate-900">
              Latitude: {alert.latitude.toFixed(6)} • Longitude: {alert.longitude.toFixed(6)}
            </p>
          </div>

          {/* Médias */}
          {alert.medias.length > 0 && (
            <div>
              <h4 className="text-sm text-slate-500 mb-2">Médias ({alert.medias.length})</h4>
              <div className="grid grid-cols-2 gap-2">
                {alert.medias.map((media) => (
                  <div key={media.id} className="p-3 bg-slate-50 rounded border text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs bg-slate-100 text-slate-900">{media.type}</span>
                      <span className="text-slate-600 truncate">{media.url.split('/').pop()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Participations */}
          {alert.participations.length > 0 && (
            <div>
              <h4 className="text-sm text-slate-500 mb-2">Participations ({alert.participations.length})</h4>
              <div className="space-y-2">
                {alert.participations.map((participation) => (
                  <div key={participation.id} className="p-3 bg-slate-50 rounded border">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-slate-900">{participation.nom}</span>
                      <span className="text-xs text-slate-500">
                        {formatDateTime(participation.dateParticipation)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{participation.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {onUpdateStatus && alert.statut !== 'resolue' && alert.statut !== 'fermee' && (
            <div className="flex gap-2 pt-4 border-t">
              {alert.statut === 'ouverte' && (
                <button
                  className="px-4 py-2 rounded transition-colors bg-transparent hover:bg-slate-100 border border-slate-200"
                  onClick={() => onUpdateStatus(alert.id, 'en_cours')}
                >
                  Marquer en cours
                </button>
              )}
              <button
                className="px-4 py-2 rounded transition-colors bg-slate-900 text-white hover:bg-slate-800"
                onClick={() => onUpdateStatus(alert.id, 'resolue')}
              >
                Marquer comme résolue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}