import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MediaGrid from '@/components/MediaGrid';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from 'lucide-react';
import { movieService, seriesService, animeService, booksService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useIndiaMode } from '@/contexts/IndiaModeContext';
import axios from 'axios';

// List of common genres for detection
const COMMON_GENRES = [
  "action", "adventure", "animation", "comedy", "crime", "documentary", 
  "drama", "family", "fantasy", "history", "horror", "music", "mystery",
  "romance", "science fiction", "sci-fi", "thriller", "war", "western"
];

// TMDB genre IDs for mapping
const MOVIE_GENRE_IDS = {
  "action": 28, "adventure": 12, "animation": 16, "comedy": 35, 
  "crime": 80, "documentary": 99, "drama": 18, "family": 10751,
  "fantasy": 14, "history": 36, "horror": 27, "music": 10402,
  "mystery": 9648, "romance": 10749, "science fiction": 878, 
  "sci-fi": 878, "thriller": 53, "war": 10752, "western": 37
};

const TV_GENRE_IDS = {
  "action": 10759, "adventure": 10759, "animation": 16, "comedy": 35, 
  "crime": 80, "documentary": 99, "drama": 18, "family": 10751,
  "fantasy": 10765, "horror": 9648, "mystery": 9648, "romance": 10749,
  "science fiction": 10765, "sci-fi": 10765, "thriller": 9648
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState({
    all: [],
    movies: [],
    series: [],
    anime: [],
    books: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { indiaMode } = useIndiaMode();
  
  const [currentPage, setCurrentPage] = useState({
    all: 1,
    movies: 1,
    series: 1,
    anime: 1,
    books: 1,
  });
  const [hasMore, setHasMore] = useState({
    all: true,
    movies: true,
    series: true,
    anime: true,
    books: true,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Helper function to detect if search term is a genre
  const isGenreSearch = (term) => {
    if (!term) return false;
    
    // Normalize the term (remove extra spaces, lowercase)
    const normalizedTerm = term.toLowerCase().trim();
    
    // Direct match
    if (COMMON_GENRES.includes(normalizedTerm)) {
      return true;
    }
    
    // Check for plural forms (e.g. "action movies" -> "action")
    for (const genre of COMMON_GENRES) {
      if (normalizedTerm.startsWith(genre) || normalizedTerm.endsWith(genre)) {
        return true;
      }
    }
    
    return false;
  };
  
  useEffect(() => {
    if (!searchTerm) return;
    
    const fetchResults = async () => {
      setLoading(true);
      
      try {
        const isSearchingGenre = isGenreSearch(searchTerm);
        const tmdbApiKey = 'f81669c9b178d14a4ded8c2928e7a996'; // Your TMDB API key from the context
        let movieResults = [], seriesResults = [], animeResults = [], booksResults = [];
        
        console.log("Search term:", searchTerm);
        console.log("Is genre search:", isSearchingGenre);

        // MOVIE SEARCH
        if (isSearchingGenre) {
          try {
            const genreId = MOVIE_GENRE_IDS[searchTerm.toLowerCase()];
            
            // Add debug logging
            console.log("Movie genre search:", searchTerm, "Genre ID:", genreId);
            
            if (genreId) {
              const movieGenreRes = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                params: {
                  api_key: tmdbApiKey,
                  with_genres: genreId,
                  sort_by: 'primary_release_date.desc', // Sort by newest first
                  include_adult: false,
                  page: 1,
                  'vote_count.gte': 50, // Ensure some popularity
                  ...(indiaMode ? { with_original_language: 'hi' } : {})
                }
              });
              
              console.log("Movie genre results count:", movieGenreRes.data.results?.length || 0);
              
              movieResults = movieGenreRes.data.results.map(movie => ({
                id: movie.id.toString(),
                title: movie.title,
                description: movie.overview || 'No description available',
                coverImage: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
                type: 'movie',
                rating: movie.vote_average / 2,
                releaseDate: movie.release_date,
                year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null,
                india: movie.original_language === 'hi' || false
              }));
            } else {
              // If we don't have a direct mapping, try keyword search as fallback
              console.log("No direct genre mapping, trying fallback keyword search");
              const movieSearchRes = await movieService.search(searchTerm, indiaMode);
              movieResults = movieSearchRes.data.results.map(movie => ({
                id: movie.id.toString(),
                title: movie.title,
                description: movie.overview || 'No description available',
                coverImage: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
                type: 'movie',
                rating: movie.vote_average / 2,
                releaseDate: movie.release_date,
                year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null,
                india: movie.original_language === 'hi' || false
              }));
            }
          } catch (err) {
            console.error("Error in movie genre search:", err);
            // Add fallback to regular search
          }
        } else {
          // Regular title search
          const movieSearchRes = await movieService.search(searchTerm, indiaMode);
          
          // Process exact title matches
          movieResults = movieSearchRes.data.results.map(movie => ({
            id: movie.id.toString(),
            title: movie.title,
            description: movie.overview || 'No description available',
            coverImage: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
            type: 'movie',
            rating: movie.vote_average / 2,
            releaseDate: movie.release_date,
            year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null,
            india: movie.original_language === 'hi' || false
          }));
          
          // If we found at least one movie, also get similar movies to the top result
          if (movieResults.length > 0) {
            try {
              const topMovieId = movieResults[0].id;
              const similarRes = await axios.get(`https://api.themoviedb.org/3/movie/${topMovieId}/similar`, {
                params: {
                  api_key: tmdbApiKey,
                  language: 'en-US',
                  page: 1
                }
              });
              
              // Add similar movies to results, avoiding duplicates
              const similarMovies = similarRes.data.results.map(movie => ({
                id: movie.id.toString(),
                title: movie.title,
                description: movie.overview || 'No description available',
                coverImage: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
                type: 'movie',
                rating: movie.vote_average / 2,
                releaseDate: movie.release_date,
                year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null,
                india: movie.original_language === 'hi' || false,
                isSimilar: true // Flag to identify similar content
              }));
              
              // Filter out duplicates
              const existingIds = new Set(movieResults.map(m => m.id));
              const uniqueSimilarMovies = similarMovies.filter(m => !existingIds.has(m.id));
              
              // Add unique similar movies
              movieResults = [...movieResults, ...uniqueSimilarMovies];
            } catch (err) {
              console.error("Error fetching similar movies:", err);
            }
          }
        }
        
        // TV SERIES SEARCH (similar approach)
        if (isSearchingGenre) {
          const genreId = TV_GENRE_IDS[searchTerm.toLowerCase()];
          
          if (genreId) {
            const seriesGenreRes = await axios.get('https://api.themoviedb.org/3/discover/tv', {
              params: {
                api_key: tmdbApiKey,
                with_genres: genreId,
                sort_by: 'first_air_date.desc', // Sort by newest first
                include_adult: false,
                page: 1,
                'vote_count.gte': 50,
                ...(indiaMode ? { with_original_language: 'hi' } : {})
              }
            });
            
            seriesResults = seriesGenreRes.data.results.map(show => ({
              id: show.id.toString(),
              title: show.name,
              description: show.overview || 'No description available',
              coverImage: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder.svg',
              type: 'series',
              rating: show.vote_average / 2,
              releaseDate: show.first_air_date,
              year: show.first_air_date ? parseInt(show.first_air_date.split('-')[0]) : null
            }));
          }
        } else {
          // Regular title search for series
          const seriesSearchRes = await seriesService.search(searchTerm, indiaMode);
          
          seriesResults = seriesSearchRes.data.results.map(show => ({
            id: show.id.toString(),
            title: show.name,
            description: show.overview || 'No description available',
            coverImage: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder.svg',
            type: 'series',
            rating: show.vote_average / 2,
            releaseDate: show.first_air_date,
            year: show.first_air_date ? parseInt(show.first_air_date.split('-')[0]) : null
          }));
          
          // Similar series logic, like movies
          if (seriesResults.length > 0) {
            try {
              const topSeriesId = seriesResults[0].id;
              const similarRes = await axios.get(`https://api.themoviedb.org/3/tv/${topSeriesId}/similar`, {
                params: {
                  api_key: tmdbApiKey,
                  language: 'en-US',
                  page: 1
                }
              });
              
              const similarSeries = similarRes.data.results.map(show => ({
                id: show.id.toString(),
                title: show.name,
                description: show.overview || 'No description available',
                coverImage: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder.svg',
                type: 'series',
                rating: show.vote_average / 2,
                releaseDate: show.first_air_date,
                year: show.first_air_date ? parseInt(show.first_air_date.split('-')[0]) : null,
                isSimilar: true
              }));
              
              const existingIds = new Set(seriesResults.map(s => s.id));
              const uniqueSimilarSeries = similarSeries.filter(s => !existingIds.has(s.id));
              
              seriesResults = [...seriesResults, ...uniqueSimilarSeries];
            } catch (err) {
              console.error("Error fetching similar series:", err);
            }
          }
        }
        
        // ANIME SEARCH
        // For anime, we'll adapt the search to handle genres differently
        if (isSearchingGenre) {
          try {
            // If the searchByGenre method doesn't exist, use this direct implementation
            const genre = searchTerm.toLowerCase();
            const animeGenreRes = await axios.get('https://api.jikan.moe/v4/anime', {
              params: {
                genres: genre, // Jikan API accepts genre names directly
                order_by: 'start_date',
                sort: 'desc',
                limit: 20
              }
            });
            
            animeResults = animeGenreRes.data.data ? animeGenreRes.data.data.map(item => ({
              id: item.mal_id.toString(),
              title: item.title,
              description: item.synopsis || 'No description available',
              coverImage: item.images?.jpg?.image_url || '/placeholder.svg',
              type: 'anime',
              rating: item.score ? item.score / 2 : 0,
              releaseDate: item.aired?.from,
              year: item.aired?.from ? new Date(item.aired.from).getFullYear() : null
            })) : [];
            
            // Sort by newest first
            animeResults.sort((a, b) => {
              if (!a.year || !b.year) return 0;
              return b.year - a.year;
            });
          } catch (err) {
            console.error("Error fetching anime by genre:", err);
            // Fallback to regular search if genre search fails
            const animeRes = await animeService.search(searchTerm);
            animeResults = animeRes.data.data ? animeRes.data.data.map(item => ({
              id: item.mal_id.toString(),
              title: item.title,
              description: item.synopsis || 'No description available',
              coverImage: item.images?.jpg?.image_url || '/placeholder.svg',
              type: 'anime',
              rating: item.score ? item.score / 2 : 0,
              releaseDate: item.aired?.from,
              year: item.aired?.from ? new Date(item.aired.from).getFullYear() : null
            })) : [];
          }
        } else {
          // Regular anime search
          const animeRes = await animeService.search(searchTerm);
          animeResults = animeRes.data.data ? animeRes.data.data.map(item => ({
            id: item.mal_id.toString(),
            title: item.title,
            description: item.synopsis || 'No description available',
            coverImage: item.images?.jpg?.image_url || '/placeholder.svg',
            type: 'anime',
            rating: item.score ? item.score / 2 : 0,
            releaseDate: item.aired?.from,
            year: item.aired?.from ? new Date(item.aired.from).getFullYear() : null
          })) : [];
          
          // If we have a top result, try to get recommendations
          if (animeResults.length > 0) {
            try {
              const topAnimeId = animeResults[0].id;
              const recommendationsRes = await axios.get(`https://api.jikan.moe/v4/anime/${topAnimeId}/recommendations`);
              
              const similarAnime = recommendationsRes.data.data.slice(0, 10).map(rec => ({
                id: rec.entry.mal_id.toString(),
                title: rec.entry.title,
                description: 'Related to your search', // Limited API data
                coverImage: rec.entry.images?.jpg?.image_url || '/placeholder.svg',
                type: 'anime',
                rating: 0, // Score not available in recommendations
                isSimilar: true
              }));
              
              const existingIds = new Set(animeResults.map(a => a.id));
              const uniqueSimilarAnime = similarAnime.filter(a => !existingIds.has(a.id));
              
              animeResults = [...animeResults, ...uniqueSimilarAnime];
            } catch (err) {
              console.error("Error fetching similar anime:", err);
            }
          }
        }
        
        // BOOK SEARCH
        // For books, handle genre search differently
        if (isSearchingGenre) {
          // Google Books supports subject searches
          const booksGenreRes = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
              q: `subject:${searchTerm}`,
              maxResults: 20,
              orderBy: 'newest' // Sort by newest first
            }
          });
          
          booksResults = booksGenreRes.data.items ? booksGenreRes.data.items.map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            description: book.volumeInfo.description || 'No description available',
            coverImage: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
            type: 'book',
            rating: book.volumeInfo.averageRating || 0,
            releaseDate: book.volumeInfo.publishedDate,
            year: book.volumeInfo.publishedDate ? parseInt(book.volumeInfo.publishedDate.split('-')[0]) : null,
            author: book.volumeInfo.authors?.join(', ') || 'Unknown'
          })) : [];
        } else {
          // Regular book search
          const booksRes = await booksService.search(searchTerm, indiaMode);
          
          booksResults = booksRes.data.items ? booksRes.data.items.map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            description: book.volumeInfo.description || 'No description available',
            coverImage: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
            type: 'book',
            rating: book.volumeInfo.averageRating || 0,
            releaseDate: book.volumeInfo.publishedDate,
            year: book.volumeInfo.publishedDate ? parseInt(book.volumeInfo.publishedDate.split('-')[0]) : null,
            author: book.volumeInfo.authors?.join(', ') || 'Unknown'
          })) : [];
          
          // If we have results, search for similar books by the same author or in the same category
          if (booksResults.length > 0 && booksResults[0].author && booksResults[0].author !== 'Unknown') {
            try {
              const authorQuery = booksResults[0].author.split(',')[0]; // Use first author
              const similarBooksRes = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: {
                  q: `inauthor:${authorQuery}`,
                  maxResults: 10
                }
              });
              
              const similarBooks = similarBooksRes.data.items ? similarBooksRes.data.items.map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                description: book.volumeInfo.description || 'No description available',
                coverImage: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
                type: 'book',
                rating: book.volumeInfo.averageRating || 0,
                releaseDate: book.volumeInfo.publishedDate,
                year: book.volumeInfo.publishedDate ? parseInt(book.volumeInfo.publishedDate.split('-')[0]) : null,
                author: book.volumeInfo.authors?.join(', ') || 'Unknown',
                isSimilar: true
              })) : [];
              
              const existingIds = new Set(booksResults.map(b => b.id));
              const uniqueSimilarBooks = similarBooks.filter(b => !existingIds.has(b.id));
              
              booksResults = [...booksResults, ...uniqueSimilarBooks];
            } catch (err) {
              console.error("Error fetching similar books:", err);
            }
          }
        }
        
        // Sort by release date (newest first) and make sure exact matches come first
        const sortByReleaseDateAndRelevance = (items) => {
          return items.sort((a, b) => {
            // Exact matches come first
            const aExactMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
            const bExactMatch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (aExactMatch && !bExactMatch) return -1;
            if (!aExactMatch && bExactMatch) return 1;
            
            // Similar items come after exact matches but before others
            if (!a.isSimilar && b.isSimilar) return -1;
            if (a.isSimilar && !b.isSimilar) return 1;
            
            // Sort by year (newest first)
            if (a.year && b.year) return b.year - a.year;
            if (a.year && !b.year) return -1;
            if (!a.year && b.year) return 1;
            
            // Sort by rating as fallback
            return b.rating - a.rating;
          });
        };
        
        // Sort all result types
        movieResults = sortByReleaseDateAndRelevance(movieResults);
        seriesResults = sortByReleaseDateAndRelevance(seriesResults);
        animeResults = sortByReleaseDateAndRelevance(animeResults);
        booksResults = sortByReleaseDateAndRelevance(booksResults);
        
        // Combine all results for the "all" tab
        const allResults = [
          ...movieResults,
          ...seriesResults,
          ...animeResults,
          ...booksResults
        ];
        
        setResults({
          all: allResults,
          movies: movieResults,
          series: seriesResults,
          anime: animeResults,
          books: booksResults
        });
      } catch (error) {
        console.error('Error searching:', error);
        toast({
          title: 'Error',
          description: 'Failed to get search results',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [searchTerm, toast, indiaMode]);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    
    try {
      const isSearchingGenre = isGenreSearch(searchTerm);
      const tmdbApiKey = 'f81669c9b178d14a4ded8c2928e7a996';
      
      // Determine which content to load more of based on active tab
      let newResults = { ...results };
      let newPages = { ...currentPage };
      let newHasMore = { ...hasMore };
      
      if (activeTab === 'all' || activeTab === 'movies') {
        const nextPage = currentPage.movies + 1;
        let movieResults = [];
        
        if (isSearchingGenre) {
          const genreId = MOVIE_GENRE_IDS[searchTerm.toLowerCase()];
          if (genreId) {
            const movieGenreRes = await axios.get('https://api.themoviedb.org/3/discover/movie', {
              params: {
                api_key: tmdbApiKey,
                with_genres: genreId,
                sort_by: 'primary_release_date.desc',
                include_adult: false,
                page: nextPage,
                'vote_count.gte': 50,
                ...(indiaMode ? { with_original_language: 'hi' } : {})
              }
            });
            
            if (movieGenreRes.data.results?.length) {
              movieResults = movieGenreRes.data.results.map(movie => ({
                id: movie.id.toString(),
                title: movie.title,
                description: movie.overview || 'No description available',
                coverImage: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
                type: 'movie',
                rating: movie.vote_average / 2,
                releaseDate: movie.release_date,
                year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null,
                india: movie.original_language === 'hi' || false
              }));
            }
          }
        } else {
          const movieSearchRes = await movieService.search(searchTerm, indiaMode, nextPage);
          if (movieSearchRes.data.results?.length) {
            movieResults = movieSearchRes.data.results.map(movie => ({
              id: movie.id.toString(),
              title: movie.title,
              description: movie.overview || 'No description available',
              coverImage: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
              type: 'movie',
              rating: movie.vote_average / 2,
              releaseDate: movie.release_date,
              year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null,
              india: movie.original_language === 'hi' || false
            }));
          }
        }
        
        // Add the new movies to our existing results, avoiding duplicates
        if (movieResults.length > 0) {
          const existingIds = new Set(newResults.movies.map(m => m.id));
          const uniqueMovies = movieResults.filter(m => !existingIds.has(m.id));
          
          if (uniqueMovies.length > 0) {
            newResults.movies = [...newResults.movies, ...uniqueMovies];
            newPages.movies = nextPage;
          } else {
            newHasMore.movies = false;
          }
        } else {
          newHasMore.movies = false;
        }
      }
      
      // Similar implementation for other content types
      if (activeTab === 'all' || activeTab === 'series') {
        // Load more series (similar to above)
        const nextPage = currentPage.series + 1;
        let seriesResults = [];
        
        // Implementation for series...
        if (isSearchingGenre) {
          const genreId = TV_GENRE_IDS[searchTerm.toLowerCase()];
          if (genreId) {
            const seriesGenreRes = await axios.get('https://api.themoviedb.org/3/discover/tv', {
              params: {
                api_key: tmdbApiKey,
                with_genres: genreId,
                sort_by: 'first_air_date.desc',
                include_adult: false,
                page: nextPage,
                'vote_count.gte': 50,
                ...(indiaMode ? { with_original_language: 'hi' } : {})
              }
            });
            
            if (seriesGenreRes.data.results?.length) {
              seriesResults = seriesGenreRes.data.results.map(show => ({
                id: show.id.toString(),
                title: show.name,
                description: show.overview || 'No description available',
                coverImage: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder.svg',
                type: 'series',
                rating: show.vote_average / 2,
                releaseDate: show.first_air_date,
                year: show.first_air_date ? parseInt(show.first_air_date.split('-')[0]) : null
              }));
            }
          }
        } else {
          const seriesSearchRes = await seriesService.search(searchTerm, indiaMode, nextPage);
          if (seriesSearchRes.data.results?.length) {
            seriesResults = seriesSearchRes.data.results.map(show => ({
              id: show.id.toString(),
              title: show.name,
              description: show.overview || 'No description available',
              coverImage: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder.svg',
              type: 'series',
              rating: show.vote_average / 2,
              releaseDate: show.first_air_date,
              year: show.first_air_date ? parseInt(show.first_air_date.split('-')[0]) : null
            }));
          }
        }
        
        // Add new series results
        if (seriesResults.length > 0) {
          const existingIds = new Set(newResults.series.map(s => s.id));
          const uniqueSeries = seriesResults.filter(s => !existingIds.has(s.id));
          
          if (uniqueSeries.length > 0) {
            newResults.series = [...newResults.series, ...uniqueSeries];
            newPages.series = nextPage;
          } else {
            newHasMore.series = false;
          }
        } else {
          newHasMore.series = false;
        }
      }
      
      if (activeTab === 'all' || activeTab === 'anime') {
        // Load more anime
        const nextPage = currentPage.anime + 1;
        let animeResults = [];
        
        if (isSearchingGenre) {
          try {
            const genre = searchTerm.toLowerCase();
            const animeGenreRes = await axios.get('https://api.jikan.moe/v4/anime', {
              params: {
                genres: genre,
                order_by: 'start_date',
                sort: 'desc',
                page: nextPage,
                limit: 20
              }
            });
            
            if (animeGenreRes.data.data?.length) {
              animeResults = animeGenreRes.data.data.map(item => ({
                id: item.mal_id.toString(),
                title: item.title,
                description: item.synopsis || 'No description available',
                coverImage: item.images?.jpg?.image_url || '/placeholder.svg',
                type: 'anime',
                rating: item.score ? item.score / 2 : 0,
                releaseDate: item.aired?.from,
                year: item.aired?.from ? new Date(item.aired.from).getFullYear() : null
              }));
            }
          } catch (err) {
            console.error("Error loading more anime by genre:", err);
          }
        } else {
          try {
            const animeRes = await animeService.search(searchTerm, nextPage);
            if (animeRes.data.data?.length) {
              animeResults = animeRes.data.data.map(item => ({
                id: item.mal_id.toString(),
                title: item.title,
                description: item.synopsis || 'No description available',
                coverImage: item.images?.jpg?.image_url || '/placeholder.svg',
                type: 'anime',
                rating: item.score ? item.score / 2 : 0,
                releaseDate: item.aired?.from,
                year: item.aired?.from ? new Date(item.aired.from).getFullYear() : null
              }));
            }
          } catch (err) {
            console.error("Error loading more anime:", err);
          }
        }
        
        // Add new anime results
        if (animeResults.length > 0) {
          const existingIds = new Set(newResults.anime.map(a => a.id));
          const uniqueAnime = animeResults.filter(a => !existingIds.has(a.id));
          
          if (uniqueAnime.length > 0) {
            newResults.anime = [...newResults.anime, ...uniqueAnime];
            newPages.anime = nextPage;
          } else {
            newHasMore.anime = false;
          }
        } else {
          newHasMore.anime = false;
        }
      }
      
      if (activeTab === 'all' || activeTab === 'books') {
        // Load more books
        const nextPage = currentPage.books + 1;
        let booksResults = [];
        
        try {
          const startIndex = (nextPage - 1) * 20; // Google Books uses startIndex instead of page
          
          if (isSearchingGenre) {
            const booksGenreRes = await axios.get('https://www.googleapis.com/books/v1/volumes', {
              params: {
                q: `subject:${searchTerm}`,
                maxResults: 20,
                orderBy: 'newest',
                startIndex
              }
            });
            
            if (booksGenreRes.data.items?.length) {
              booksResults = booksGenreRes.data.items.map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                description: book.volumeInfo.description || 'No description available',
                coverImage: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
                type: 'book',
                rating: book.volumeInfo.averageRating || 0,
                releaseDate: book.volumeInfo.publishedDate,
                year: book.volumeInfo.publishedDate ? parseInt(book.volumeInfo.publishedDate.split('-')[0]) : null,
                author: book.volumeInfo.authors?.join(', ') || 'Unknown'
              }));
            }
          } else {
            const booksRes = await booksService.search(searchTerm, indiaMode, startIndex);
            
            if (booksRes.data.items?.length) {
              booksResults = booksRes.data.items.map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                description: book.volumeInfo.description || 'No description available',
                coverImage: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
                type: 'book',
                rating: book.volumeInfo.averageRating || 0,
                releaseDate: book.volumeInfo.publishedDate,
                year: book.volumeInfo.publishedDate ? parseInt(book.volumeInfo.publishedDate.split('-')[0]) : null,
                author: book.volumeInfo.authors?.join(', ') || 'Unknown'
              }));
            }
          }
        } catch (err) {
          console.error("Error loading more books:", err);
        }
        
        // Add new book results
        if (booksResults.length > 0) {
          const existingIds = new Set(newResults.books.map(b => b.id));
          const uniqueBooks = booksResults.filter(b => !existingIds.has(b.id));
          
          if (uniqueBooks.length > 0) {
            newResults.books = [...newResults.books, ...uniqueBooks];
            newPages.books = nextPage;
          } else {
            newHasMore.books = false;
          }
        } else {
          newHasMore.books = false;
        }
      }
      
      // Update the "all" tab with combined results
      if (activeTab === 'all') {
        newResults.all = [
          ...newResults.movies,
          ...newResults.series,
          ...newResults.anime,
          ...newResults.books
        ];
        
        // Sort by relevance as before
        const sortByReleaseDateAndRelevance = (items) => {
          return items.sort((a, b) => {
            // Exact matches come first
            const aExactMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
            const bExactMatch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (aExactMatch && !bExactMatch) return -1;
            if (!aExactMatch && bExactMatch) return 1;
            
            // Similar items come after exact matches but before others
            if (!a.isSimilar && b.isSimilar) return -1;
            if (a.isSimilar && !b.isSimilar) return 1;
            
            // Sort by year (newest first)
            if (a.year && b.year) return b.year - a.year;
            if (a.year && !b.year) return -1;
            if (!a.year && b.year) return 1;
            
            // Sort by rating as fallback
            return b.rating - a.rating;
          });
        };
        
        newResults.all = sortByReleaseDateAndRelevance(newResults.all);
        newPages.all = currentPage.all + 1;
        
        // Check if any content type still has more
        newHasMore.all = newHasMore.movies || newHasMore.series || newHasMore.anime || newHasMore.books;
      }
      
      // Update state with new results, pages, and hasMore flags
      setResults(newResults);
      setCurrentPage(newPages);
      setHasMore(newHasMore);
      
    } catch (error) {
      console.error('Error loading more results:', error);
      toast({
        title: 'Error',
        description: 'Failed to load more results',
        variant: 'destructive'
      });
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar initialSearchTerm={searchTerm} />
      
      <main className="py-4 md:py-8">
        <div className="container px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Search Results</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-8 break-words">
            Results for "{searchTerm}"
          </p>
          
          {loading ? (
            <div className="flex flex-col justify-center items-center h-[40vh] md:h-[50vh]">
              <Loader className="h-8 w-8 animate-spin mb-3" />
              <p className="text-muted-foreground text-sm md:text-base">
                Searching for "{searchTerm}"...
              </p>
            </div>
          ) : (
            <>
              <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
                <div className="mb-6 overflow-x-auto pb-2">
                  <TabsList className="w-full sm:w-auto flex flex-nowrap min-w-max">
                    <TabsTrigger value="all" className="text-sm md:text-base">All ({results.all.length})</TabsTrigger>
                    <TabsTrigger value="movies" className="text-sm md:text-base">Movies ({results.movies.length})</TabsTrigger>
                    <TabsTrigger value="series" className="text-sm md:text-base">Series ({results.series.length})</TabsTrigger>
                    <TabsTrigger value="anime" className="text-sm md:text-base">Anime ({results.anime.length})</TabsTrigger>
                    <TabsTrigger value="books" className="text-sm md:text-base">Books ({results.books.length})</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all">
                  {results.all.length > 0 ? (
                    <MediaGrid items={results.all} type="mixed" columns={5} />
                  ) : (
                    <p className="text-center text-muted-foreground py-10">No results found</p>
                  )}
                </TabsContent>
                
                <TabsContent value="movies">
                  {results.movies.length > 0 ? (
                    <MediaGrid items={results.movies} type="movie" columns={5} />
                  ) : (
                    <p className="text-center text-muted-foreground py-10">No movies found</p>
                  )}
                </TabsContent>
                
                <TabsContent value="series">
                  {results.series.length > 0 ? (
                    <MediaGrid items={results.series} type="series" columns={5} />
                  ) : (
                    <p className="text-center text-muted-foreground py-10">No series found</p>
                  )}
                </TabsContent>
                
                <TabsContent value="anime">
                  {results.anime.length > 0 ? (
                    <MediaGrid items={results.anime} type="anime" columns={5} />
                  ) : (
                    <p className="text-center text-muted-foreground py-10">No anime found</p>
                  )}
                </TabsContent>
                
                <TabsContent value="books">
                  {results.books.length > 0 ? (
                    <MediaGrid items={results.books} type="book" columns={5} />
                  ) : (
                    <p className="text-center text-muted-foreground py-10">No books found</p>
                  )}
                </TabsContent>
              </Tabs>
              {hasMore[activeTab] && (
                <div className="flex justify-center mt-6 mb-8">
                  <button
                    className="px-6 py-3 min-h-[44px] bg-primary hover:bg-primary/90 text-white rounded-md w-full sm:w-auto max-w-xs transition-colors"
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <span className="flex items-center justify-center">
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchPage;