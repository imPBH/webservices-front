const ENV = {
  ALERT_API_URL: '',
  TEMPLATE_API_URL: '',
  API_KEY: ''
};

export const API_CONFIG = {
  alerts: {
    baseUrl: ENV.ALERT_API_URL || 'https://api.example.com',
    endpoints: {
      list: '/alerts',
      detail: '/alerts/:id',
      create: '/alerts',
      update: '/alerts/:id',
      delete: '/alerts/:id'
    }
  },
  // Template pour nouveau service (exemple)
  template: {
    baseUrl: ENV.TEMPLATE_API_URL || 'https://api.example.com',
    endpoints: {
      list: '/items',
      detail: '/items/:id',
      create: '/items',
      update: '/items/:id',
      delete: '/items/:id'
    }
  }
};

// Headers communs pour toutes les requêtes
export const getCommonHeaders = () => ({
  'Content-Type': 'application/json',
  // Ajouter vos headers d'authentification ici
  // 'Authorization': `Bearer ${getToken()}`,
  // 'X-API-Key': ENV.API_KEY || '',
});

// Helper pour construire les URLs avec paramètres
export const buildUrl = (baseUrl: string, endpoint: string, params?: Record<string, string | number>) => {
  let url = `${baseUrl}${endpoint}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  
  return url;
};