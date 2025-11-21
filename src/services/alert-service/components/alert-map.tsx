import { useEffect, useRef } from 'react';
import type { Alert } from '../types';

interface AlertMapProps {
  alerts: Alert[];
  selectedAlertId?: number;
  onSelectAlert: (alert: Alert) => void;
}

// Couleurs selon l'intensité
const intensiteColors: Record<string, string> = {
  'faible': '#3b82f6',      // blue
  'moyenne': '#eab308',   // yellow
  'élevée': '#f97316',     // orange
  'critique': '#ef4444'  // red
};

export function AlertMap({ alerts, selectedAlertId, onSelectAlert }: AlertMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Définir la taille du canvas
    const width = canvas.width;
    const height = canvas.height;

    // Effacer le canvas
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, width, height);

    // Dessiner une grille pour simuler une carte
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Calculer les coordonnées min/max pour la normalisation
    if (alerts.length === 0) return;

    const lats = alerts.map(a => a.latitude);
    const lngs = alerts.map(a => a.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Ajouter un padding
    const padding = 50;
    const mapWidth = width - padding * 2;
    const mapHeight = height - padding * 2;

    // Fonction pour convertir lat/lng en coordonnées canvas
    const toCanvasCoords = (lat: number, lng: number) => {
      const x = padding + ((lng - minLng) / (maxLng - minLng)) * mapWidth;
      const y = padding + ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
      return { x, y };
    };

    // Dessiner les alertes
    alerts.forEach((alert) => {
      const { x, y } = toCanvasCoords(alert.latitude, alert.longitude);
      const isSelected = alert.id === selectedAlertId;
      const radius = isSelected ? 20 : 15;
      
      const color = intensiteColors[alert.intensite] || intensiteColors['moyenne'];

      // Ombre pour l'alerte sélectionnée
      if (isSelected) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
      }

      // Cercle extérieur (pulse pour les alertes ouvertes)
      if (alert.statut === 'ouverte') {
        ctx.fillStyle = color + '40';
        ctx.beginPath();
        ctx.arc(x, y, radius + 8, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Cercle principal
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Bordure blanche
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Réinitialiser l'ombre
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Numéro de l'alerte
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${isSelected ? '14px' : '12px'} sans-serif`;
      ctx.fillText(alert.id.toString(), x, y);
    });

    // Légende
    const legendX = 20;
    const legendY = height - 120;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(legendX - 10, legendY - 10, 180, 110);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 10, legendY - 10, 180, 110);

    ctx.textAlign = 'left';
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Intensité', legendX, legendY);

    const intensites = ['critique', 'élevée', 'moyenne', 'faible'];
    const labels = { 
      'critique': 'Critique', 
      'élevée': 'Élevée', 
      'moyenne': 'Moyenne', 
      'faible': 'Faible' 
    };

    intensites.forEach((intensite, index) => {
      const y = legendY + 20 + index * 20;
      
      // Cercle de couleur
      ctx.fillStyle = intensiteColors[intensite];
      ctx.beginPath();
      ctx.arc(legendX + 7, y, 7, 0, 2 * Math.PI);
      ctx.fill();

      // Label
      ctx.fillStyle = '#475569';
      ctx.fillText(labels[intensite as keyof typeof labels], legendX + 20, y + 4);
    });

  }, [alerts, selectedAlertId]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (alerts.length === 0) return;

    const lats = alerts.map(a => a.latitude);
    const lngs = alerts.map(a => a.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const padding = 50;
    const mapWidth = canvas.width - padding * 2;
    const mapHeight = canvas.height - padding * 2;

    // Vérifier si le clic est sur une alerte
    for (const alert of alerts) {
      const canvasX = padding + ((alert.longitude - minLng) / (maxLng - minLng)) * mapWidth;
      const canvasY = padding + ((maxLat - alert.latitude) / (maxLat - minLat)) * mapHeight;
      const radius = alert.id === selectedAlertId ? 20 : 15;

      const distance = Math.sqrt(Math.pow(x - canvasX, 2) + Math.pow(y - canvasY, 2));
      if (distance <= radius) {
        onSelectAlert(alert);
        break;
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-auto cursor-pointer"
        onClick={handleCanvasClick}
      />
    </div>
  );
}