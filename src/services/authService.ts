import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://byb-backend-1.onrender.com';

const authClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
});

// Add auth token to all requests if available
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await authClient.post('/api/auth/register', {
        name,
        email,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const response = await authClient.post('/api/auth/login', {
        email,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    localStorage.removeItem('authToken');
    return await authClient.post('/api/auth/logout');
  },
  
  getCurrentUser: async () => {
    try {
      return await authClient.get('/api/auth/me');
    } catch (error) {
      // If 401, it means user is not logged in, which is expected
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('User not logged in');
      } else {
        console.error('Get current user error:', error);
      }
      throw error;
    }
  },
};