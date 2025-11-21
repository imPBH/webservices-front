import { getCommonHeaders } from '../config/api-config';

// Types pour les réponses d'API
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Client API réutilisable avec gestion d'erreurs standardisée
export class ApiClient {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || `Erreur ${response.status}: ${response.statusText}`,
        status: response.status,
        code: errorData.code
      } as ApiError;
    }

    // Gérer les réponses vides (DELETE)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getCommonHeaders(),
        ...options?.headers
      },
      ...options
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getCommonHeaders(),
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...getCommonHeaders(),
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...getCommonHeaders(),
        ...options?.headers
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...getCommonHeaders(),
        ...options?.headers
      },
      ...options
    });

    return this.handleResponse<T>(response);
  }
}

// Instance singleton
export const apiClient = new ApiClient();
