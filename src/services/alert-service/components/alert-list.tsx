import type { Alert, AlertStatus } from '../types';

interface AlertListProps {
  alerts: Alert[];
  selectedAlertId?: number;
  onSelectAlert: (alert: Alert) => void;
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

export function AlertList({ alerts, selectedAlertId, onSelectAlert }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Aucune alerte trouvée
      </div>
    );
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const intensiteInfo = intensiteConfig[alert.intensite] || intensiteConfig['moyenne'];
        
        return (
          <div
            key={alert.id}
            className={`bg-white rounded-lg border border-slate-200 cursor-pointer transition-all hover:shadow-md ${
              selectedAlertId === alert.id ? 'ring-2 ring-slate-900 bg-slate-50' : ''
            }`}
            onClick={() => onSelectAlert(alert)}
          >
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-slate-900 flex-1">{alert.titre}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs ${intensiteInfo.className}`}>
                    {intensiteInfo.label}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2">
                  {alert.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {alert.categorie.nom} • {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs ${statusConfig[alert.statut].className}`}>
                    {statusConfig[alert.statut].label}
                  </span>
                </div>
                
                <div className="text-xs text-slate-400">
                  {formatTime(alert.dateCreation)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}