
import { toast } from 'sonner';

// Use environment variable for base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/arduino';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: defaultHeaders,
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      // Handle common error responses
      if (response.status === 401) {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }

      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unknown error occurred');
    }
    throw error;
  }
}

// Organization API calls
export const organizationsApi = {
  getAll: () => apiRequest<{ organizations: any[] }>('/organizations'),
  getById: (id: string) => apiRequest<{ organization: any }>(`/organizations/${id}`),
  create: (data: any) => apiRequest<{ organization: any }>('/organizations', { 
    method: 'POST', 
    body: data 
  }),
  update: (id: string, data: any) => apiRequest<{ organization: any }>(`/organizations/${id}`, { 
    method: 'PUT', 
    body: data 
  }),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/organizations/${id}`, { 
    method: 'DELETE' 
  }),
};

// User API calls
export const usersApi = {
  getAll: (orgId?: string) => apiRequest<{ users: any[] }>(`/users${orgId ? `?orgId=${orgId}` : ''}`),
  getById: (id: string) => apiRequest<{ user: any }>(`/users/${id}`),
  create: (data: any) => apiRequest<{ user: any }>('/users', { 
    method: 'POST', 
    body: data 
  }),
  update: (id: string, data: any) => apiRequest<{ user: any }>(`/users/${id}`, { 
    method: 'PUT', 
    body: data 
  }),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/users/${id}`, { 
    method: 'DELETE' 
  }),
};

// IoT Devices API calls
export const devicesApi = {
  getAll: (orgId?: string) => apiRequest<{ devices: any[] }>(`/devices${orgId ? `?orgId=${orgId}` : ''}`),
  getById: (id: string) => apiRequest<{ device: any }>(`/devices/${id}`),
  create: (data: any) => apiRequest<{ device: any }>('/devices', { 
    method: 'POST', 
    body: data 
  }),
  update: (id: string, data: any) => apiRequest<{ device: any }>(`/devices/${id}`, { 
    method: 'PUT', 
    body: data 
  }),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/devices/${id}`, { 
    method: 'DELETE' 
  }),
  updateStatus: (id: string, status: boolean) => apiRequest<{ device: any }>(`/devices/${id}/status`, { 
    method: 'PUT', 
    body: { status } 
  }),
};
