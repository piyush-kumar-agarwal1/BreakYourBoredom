export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  rating: number;
  type?: 'movie' | 'series' | 'book' | 'anime';
  genres?: string[];
  releaseDate?: string;
  author?: string;
  episodes?: number;
  seasons?: number;
  pageCount?: number;
  india?: boolean;
  streamingPlatform?: string; // Add this property
}

export interface Movie extends MediaItem {
  director: string;
  duration: number; // in minutes
  cast: string[];
}

export interface Anime extends MediaItem {
  studio: string;
  status: 'ongoing' | 'completed';
}

export interface Book extends MediaItem {
  publisher: string;
}

export interface Series extends MediaItem {
  network: string;
  status: 'ongoing' | 'completed';
}

export type MediaType = 'movie' | 'anime' | 'book' | 'series';

export interface RecommendationRequest {
  type: MediaType;
  genre?: string;
  year?: number;
  rating?: number;
}

export interface UserPreferences {
  favoriteGenres: string[];
  contentTypes: MediaType[];
  ageRating?: string;
}
