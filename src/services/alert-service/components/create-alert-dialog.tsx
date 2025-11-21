import { useState } from 'react';
import type { CreateAlertInput } from '../types';

interface CreateAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (alert: CreateAlertInput) => void;
}

export function CreateAlertDialog({ open, onOpenChange, onSubmit }: CreateAlertDialogProps) {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    intensite: 'moyenne',
    userId: '',
    categorieId: '',
    latitude: '',
    longitude: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const alert: CreateAlertInput = {
      userId: parseInt(formData.userId) || 1,
      titre: formData.titre,
      description: formData.description,
      statut: 'ouverte',
      intensite: formData.intensite,
      latitude: parseFloat(formData.latitude) || 48.8566,
      longitude: parseFloat(formData.longitude) || 2.3522,
      categorieId: parseInt(formData.categorieId) || 1
    };

    onSubmit(alert);
    
    // Réinitialiser le formulaire
    setFormData({
      titre: '',
      description: '',
      intensite: 'moyenne',
      userId: '',
      categorieId: '',
      latitude: '',
      longitude: ''
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 pb-4">
          <h2 className="text-slate-900">Créer une nouvelle alerte</h2>
          <p className="text-slate-600 mt-2">
            Remplissez les informations pour créer une alerte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          <div className="space-y-2">
            <label htmlFor="titre" className="block text-sm text-slate-700 mb-1">
              Titre *
            </label>
            <input
              id="titre"
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              placeholder="Ex: Fuite d'eau importante"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez l'alerte en détail..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="intensite" className="block text-sm text-slate-700 mb-1">
                Intensité *
              </label>
              <select
                id="intensite"
                className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={formData.intensite}
                onChange={(e) => setFormData({ ...formData, intensite: e.target.value })}
              >
                <option value="faible">Faible</option>
                <option value="moyenne">Moyenne</option>
                <option value="élevée">Élevée</option>
                <option value="critique">Critique</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="categorieId" className="block text-sm text-slate-700 mb-1">
                ID Catégorie *
              </label>
              <input
                id="categorieId"
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={formData.categorieId}
                onChange={(e) => setFormData({ ...formData, categorieId: e.target.value })}
                placeholder="Ex: 1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="latitude" className="block text-sm text-slate-700 mb-1">
                Latitude *
              </label>
              <input
                id="latitude"
                type="number"
                step="any"
                className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="Ex: 48.8566"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="longitude" className="block text-sm text-slate-700 mb-1">
                Longitude *
              </label>
              <input
                id="longitude"
                type="number"
                step="any"
                className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="Ex: 2.3522"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="userId" className="block text-sm text-slate-700 mb-1">
              ID Utilisateur *
            </label>
            <input
              id="userId"
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              placeholder="Ex: 101"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded transition-colors bg-transparent hover:bg-slate-100 border border-slate-200"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded transition-colors bg-slate-900 text-white hover:bg-slate-800"
            >
              Créer l'alerte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
