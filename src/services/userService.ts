import axios from 'axios';

// Create a client with the correct base URL and authentication
export const userClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add an interceptor to include the authentication token with every request
userClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const userService = {
  // Watchlist operations
  getWatchlist: async () => {
    const response = await userClient.get('/user/watchlist');
    // Log the actual response structure for debugging
    console.log("Backend watchlist response:", response);
    return response;
  },
  
  addToWatchlist: async (itemType, itemId) => {
    try {
      console.log(`Adding to watchlist: ${itemType} ${itemId}`);
      const response = await userClient.post('/user/watchlist', { itemType, itemId });
      console.log("Add to watchlist response:", response);
      return response;
    } catch (error) {
      console.error("Add to watchlist error:", error);
      throw error;
    }
  },
  
  removeFromWatchlist: async (itemType, itemId) => {
    try {
      console.log(`Removing from watchlist: ${itemType} ${itemId}`);
      const response = await userClient.delete(`/user/watchlist/${itemType}/${itemId}`);
      console.log("Remove from watchlist response:", response);
      return response;
    } catch (error) {
      console.error("Remove from watchlist error:", error);
      throw error;
    }
  },
  
  // Watched items operations
  getWatchedItems: async () => {
    const response = await userClient.get('/user/watched');
    console.log("Backend watched items response:", response);
    return response;
  },
  
  markAsWatched: async (itemType, itemId) => {
    try {
      console.log(`Marking as watched: ${itemType} ${itemId}`);
      const response = await userClient.post('/user/watched', { itemType, itemId });
      console.log("Mark as watched response:", response);
      return response;
    } catch (error) {
      console.error("Mark as watched error:", error);
      throw error;
    }
  },
  
  removeFromWatched: async (itemType, itemId) => {
    try {
      console.log(`Removing from watched: ${itemType} ${itemId}`);
      const response = await userClient.delete(`/user/watched/${itemType}/${itemId}`);
      console.log("Remove from watched response:", response);
      return response;
    } catch (error) {
      console.error("Remove from watched error:", error);
      throw error;
    }
  },
  
  // Rating operations
  getUserRatings: async () => {
    const response = await userClient.get('/user/ratings');
    console.log("Backend user ratings response:", response);
    return response;
  },
  
  rateItem: async (itemType, itemId, rating) => {
    try {
      console.log(`Rating item: ${itemType} ${itemId} with rating ${rating}`);
      const response = await userClient.post('/user/ratings', { itemType, itemId, rating });
      console.log("Rate item response:", response);
      return response;
    } catch (error) {
      console.error("Rate item error:", error);
      throw error;
    }
  },
};