import axios from 'axios';

// TMDB API for Movies and TV Shows
const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY
  }
});

// Google Books API
const booksClient = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1',
  params: {
    key: import.meta.env.VITE_BOOKS_API_KEY
  }
});

// Jikan API for Anime (No API key required)
const animeClient = axios.create({
  baseURL: 'https://api.jikan.moe/v4'
});

// Movies API Service with India mode support
export const movieService = {
  getPopular: (indiaMode = false) => tmdbClient.get(
    indiaMode ? '/discover/movie' : '/movie/popular', // Use simpler endpoint in global mode
    {
      params: indiaMode 
        ? { 
            with_original_language: 'hi',
            region: 'IN',
            sort_by: 'popularity.desc',
          } 
        : {
            // Minimal parameters for global mode to ensure results
            language: 'en-US',
            page: 1
          }
    }
  ),
  
  getTrending: (indiaMode = false) => tmdbClient.get(
    indiaMode ? '/discover/movie' : '/trending/movie/week', 
    {
      params: indiaMode 
        ? { 
            with_original_language: 'hi',
            region: 'IN',
            sort_by: 'popularity.desc',
          } 
        : {
            // Minimal parameters for global mode
            language: 'en-US'
          }
    }
  ),
  
  getDetails: (id: string) => tmdbClient.get(`/movie/${id}`),
  getWatchProviders: (id: string) => tmdbClient.get(`/movie/${id}/watch/providers`),
  search: (query: string, indiaMode = false) => tmdbClient.get(
    '/search/movie', 
    { 
      params: { 
        query, 
        ...(indiaMode ? { with_original_language: 'hi', region: 'IN' } : {})
      } 
    }
  )
};

// Update the seriesService to focus specifically on Netflix and other streaming shows
export const seriesService = {
  getPopular: (indiaMode = false) => {
    // Use the discover endpoint with explicit network parameters
    return tmdbClient.get('/discover/tv', {
      params: {
        // For Netflix, use network_id 213
        with_networks: indiaMode ? '4353,3575,4818,2489' : '213', // Netflix is 213
        sort_by: 'popularity.desc',
        // Only recent shows
        'first_air_date.gte': '2016-01-01',
        // Exclude documentaries and news shows
        without_genres: '99,10763',
        // At least somewhat popular shows
        'vote_count.gte': '50',
        ...(indiaMode ? { with_original_language: 'hi' } : {})
      }
    });
  },
  
  // Fix the getNetworkShows method to properly handle India mode
  getNetworkShows: (networkId, indiaMode = false) => {
    if (indiaMode) {
      // Much more relaxed parameters for India mode to ensure we get results
      return tmdbClient.get('/discover/tv', {
        params: {
          with_networks: networkId,
          // Support more Indian languages instead of just Hindi
          with_original_language: 'hi', // Hindi, Tamil, Telugu, Malayalam, Bengali, etc.
          // Remove the original region filter which might be restricting results
          'first_air_date.gte': '2010-01-01', // Include older content
          // Lower vote count threshold dramatically 
          'vote_count.gte': '5',
          sort_by: 'popularity.desc'
        }
      });
    } else {
      // Global mode - keep as is, but lower threshold
      return tmdbClient.get('/discover/tv', {
        params: {
          with_networks: networkId,
          sort_by: 'popularity.desc',
          'vote_count.gte': '10'
        }
      });
    }
  },
  
  getTrending: (indiaMode = false) => {
    return tmdbClient.get('/trending/tv/week', {
      params: indiaMode ? { with_original_language: 'hi' } : {}
    });
  },
  
  getDetails: (id: string) => tmdbClient.get(`/tv/${id}`),
  getWatchProviders: (id: string) => tmdbClient.get(`/tv/${id}/watch/providers`),
  search: (query: string, indiaMode = false) => {
    return tmdbClient.get('/search/tv', {
      params: {
        query,
        ...(indiaMode ? { with_original_language: 'hi' } : {})
      }
    });
  }
};

// Books API Service - simplified for more reliable results
export const booksService = {
  getPopular: (indiaMode = false) => booksClient.get('/volumes', { 
    params: { 
      q: indiaMode 
        ? 'bestseller indian OR inauthor:"Chetan Bhagat" OR inauthor:"Amish Tripathi"'
        : 'bestseller fiction OR "Harry Potter" OR "Game of Thrones" OR "Stephen King"', 
      orderBy: 'relevance',
      maxResults: 40
    }
  }),
  
  getByCategory: (category) => booksClient.get('/volumes', {
    params: {
      q: `subject:${category} bestseller`,
      orderBy: 'relevance',
      maxResults: 20
    }
  }),
  
  getDetails: (id: string) => booksClient.get(`/volumes/${id}`),
  
  search: (query: string, indiaMode = false) => booksClient.get('/volumes', { 
    params: { 
      q: indiaMode ? `${query} indian bestseller` : `${query} bestseller`,
      orderBy: 'relevance',
      maxResults: 20
    } 
  })
};

// Anime API Service with partial India mode support (limited options for this)
export const animeService = {
  getPopular: () => animeClient.get('/top/anime'),
  getDetails: (id: string) => animeClient.get(`/anime/${id}`),
  search: (query: string) => animeClient.get('/anime', { params: { q: query } })
};

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Create auth client that includes cookies for auth
export const authClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
});

// Create secured client with auth token
export const securedClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add auth token to secured requests
securedClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create user client
export const userClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add auth token to user requests
userClient.interceptors.request.use(config => {
  // Get token from localStorage - adjust based on how your auth is stored
  const token = localStorage.getItem('authToken');
  console.log("Using auth token:", token ? "Token found" : "No token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
userClient.interceptors.response.use(
  response => {
    console.log(`${response.config.method?.toUpperCase()} ${response.config.url} succeeded`);
    return response;
  },
  error => {
    console.error(`API error:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);