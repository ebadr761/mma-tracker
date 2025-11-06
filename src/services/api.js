import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
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
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  checkAuth: async () => {
    const response = await api.get('/auth/check');
    return response.data;
  },
};

// Workouts API
export const workoutsAPI = {
  getAll: async (limit = 100, skip = 0) => {
    const response = await api.get('/workouts', { params: { limit, skip } });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  create: async (workoutData) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },

  update: async (id, workoutData) => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/workouts/stats');
    return response.data;
  },
};

export default api;
