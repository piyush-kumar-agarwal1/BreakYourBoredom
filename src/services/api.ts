import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://byb-backend-1.onrender.com';

// Create a unified client for all API calls
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 20000, // 20 seconds is generally good for proxied requests
});

// Add auth token to all requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error(`API error:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Movies API Service with India mode support
export const movieService = {
  getPopular: (indiaMode = false) => 
    apiClient.get(`/api/proxy/movies/popular`, { params: { indiaMode } }),
  
  getDetails: (id) => 
    apiClient.get(`/api/proxy/movies/${id}`),
  
  search: (query, indiaMode = false) => 
    apiClient.get(`/api/proxy/movies/search`, { params: { query, indiaMode } })
};

// Series API Service
export const seriesService = {
  getPopular: (indiaMode = false) => 
    apiClient.get(`/api/proxy/series/popular`, { params: { indiaMode } }),
  
  getNetworkShows: (networkId, indiaMode = false) => 
    apiClient.get(`/api/proxy/series/network/${networkId}`, { params: { indiaMode } })
};

// Books API Service
export const booksService = {
  getPopular: () => 
    apiClient.get(`/api/proxy/books/popular`),
  
  search: (query) => 
    apiClient.get(`/api/proxy/books/search`, { params: { query } })
};

// Anime API Service
export const animeService = {
  getPopular: () => 
    apiClient.get(`/api/proxy/anime/popular`),
  
  getDetails: (id) => 
    apiClient.get(`/api/proxy/anime/${id}`),
  
  search: (query) => 
    apiClient.get(`/api/proxy/anime/search`, { params: { query } })
};

// Export the client for other services
export { apiClient };