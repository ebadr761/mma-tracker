import axios, { AxiosInstance } from 'axios';
import {
  User,
  WorkoutInput,
  AuthResponse,
  WorkoutsResponse,
  WorkoutResponse,
  WorkoutStats
} from '../types';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { username, email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  },

  checkAuth: async (): Promise<{ authenticated: boolean }> => {
    const response = await api.get<{ authenticated: boolean }>('/auth/check');
    return response.data;
  },
};

// Workouts API
export const workoutsAPI = {
  getAll: async (limit: number = 100, skip: number = 0): Promise<WorkoutsResponse> => {
    const response = await api.get<WorkoutsResponse>('/workouts', { params: { limit, skip } });
    return response.data;
  },

  getById: async (id: string): Promise<WorkoutResponse> => {
    const response = await api.get<WorkoutResponse>(`/workouts/${id}`);
    return response.data;
  },

  create: async (workoutData: WorkoutInput): Promise<WorkoutResponse> => {
    const response = await api.post<WorkoutResponse>('/workouts', workoutData);
    return response.data;
  },

  update: async (id: string, workoutData: Partial<WorkoutInput>): Promise<WorkoutResponse> => {
    const response = await api.put<WorkoutResponse>(`/workouts/${id}`, workoutData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/workouts/${id}`);
    return response.data;
  },

  getStats: async (): Promise<{ stats: WorkoutStats }> => {
    const response = await api.get<{ stats: WorkoutStats }>('/workouts/stats/summary');
    return response.data;
  },
};

export default api;
