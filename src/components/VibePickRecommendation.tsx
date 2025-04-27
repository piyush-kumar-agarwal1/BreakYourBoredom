import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Film, 
  BookOpen, 
  MonitorPlay, 
  Tv, 
  Sparkles,
  Laugh,
  BrainCircuit,
  AlertCircle,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { useIndiaMode } from '@/contexts/IndiaModeContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import MediaGrid from '@/components/MediaGrid';
import { movieService, seriesService, booksService, animeService } from '@/services/api';
import axios from 'axios';

const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", 
  "Historical", "Crime"
];

const moods = [
  { label: "Feel-Good", icon: <Sparkles className="h-4 w-4" />, genres: ["Comedy", "Adventure", "Romance"] },
  { label: "Suspenseful", icon: <AlertCircle className="h-4 w-4" />, genres: ["Thriller", "Horror", "Crime"] },
  { label: "Light-Hearted", icon: <Laugh className="h-4 w-4" />, genres: ["Comedy", "Adventure", "Romance"] },
  { label: "Mind-Bending", icon: <BrainCircuit className="h-4 w-4" />, genres: ["Sci-Fi", "Mystery", "Fantasy"] }
];

const languages = ["English", "Hindi", "Japanese", "Korean", "Spanish", "French", "German"];

const VibePickRecommendation = () => {
  const [contentTypes, setContentTypes] = useState<string[]>(['movie']);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [previousLikes, setPreviousLikes] = useState('');
  const [language, setLanguage] = useState('English');
  const [surpriseMe, setSurpriseMe] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { indiaMode } = useIndiaMode();

  // Helper function to map genre IDs to names for TMDB API
  const getGenreNameById = (id: number, type: 'movie' | 'tv') => {
    const movieGenres = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 
      80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
      14: 'Fantasy', 36: 'Historical', 27: 'Horror', 10402: 'Music',
      9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
      53: 'Thriller', 10752: 'War', 37: 'Western'
    };
    
    const tvGenres = {
      10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
      99: 'Documentary', 18: 'Drama', 10751: 'Family', 10762: 'Kids',
      9648: 'Mystery', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy',
      10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics', 37: 'Western'
    };
    
    return type === 'movie' 
      ? movieGenres[id as keyof typeof movieGenres] || 'Other'
      : tvGenres[id as keyof typeof tvGenres] || 'Other';
  };

  // Add this function to help with API requests
  function getGenreIds(selectedGenres, type) {
    const movieGenreMap = {
      'Action': 28, 'Adventure': 12, 'Comedy': 35, 'Drama': 18, 
      'Fantasy': 14, 'Horror': 27, 'Mystery': 9648, 'Romance': 10749,
      'Sci-Fi': 878, 'Thriller': 53, 'Historical': 36, 'Crime': 80
    };
    
    const tvGenreMap = {
      'Action': 10759, 'Adventure': 10759, 'Comedy': 35, 'Drama': 18,
      'Fantasy': 10765, 'Horror': 9648, 'Mystery': 9648, 'Romance': 10749,
      'Sci-Fi': 10765, 'Thriller': 9648, 'Historical': 10768, 'Crime': 80
    };
    
    const genreMap = type === 'movie' ? movieGenreMap : tvGenreMap;
    
    return selectedGenres
      .map(genre => genreMap[genre])
      .filter(id => id !== undefined);
  }

  const handleTypeToggle = (type: string) => {
    setContentTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else {
        // Limit to 3 genres
        if (prev.length >= 3) {
          toast({
            title: "Maximum 3 genres",
            description: "Please select a maximum of 3 genres",
          });
          return prev;
        }
        return [...prev, genre];
      }
    });
  };

  const handleMoodSelect = (moodLabel: string) => {
    const newMood = moodLabel === selectedMood ? null : moodLabel;
    setSelectedMood(newMood);
    
    if (newMood) {
      const mood = moods.find(m => m.label === newMood);
      if (mood) {
        setSelectedGenres(mood.genres);
      }
    } else {
      setSelectedGenres([]);
    }
  };

  // Add new helper function to extract meaningful keywords from previous likes
  function extractKeywordsFromLikes(likes) {
    if (!likes || typeof likes !== 'string' || likes.trim() === '') return [];
    
    // Split by common separators and clean up
    const titles = likes.split(/[,;\/\n]+/)
      .map(title => title.trim())
      .filter(title => title.length > 2);
    
    // Remove common words that might create noise
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'of', 'in', 'on'];
    const keywords = titles.flatMap(title => {
      // Extract meaningful parts, giving preference to longer phrases
      if (title.length > 20) {
        // For long titles, try to get the main part
        return title.split(' ').slice(0, 3).join(' ');
      }
      return title;
    });
    
    return keywords.slice(0, 3); // Limit to 3 most relevant titles
  }

  // Update getRecommendations to use these keywords for all content types
  const getRecommendations = async (mode = 'initial', page = 1) => {
    if (contentTypes.length === 0) {
      toast({
        title: "No content type selected",
        description: "Please select at least one content type",
        variant: "destructive",
      });
      return;
    }
  
    // Set appropriate loading states based on mode
    if (mode === 'initial') {
      setIsLoading(true);
      setFormSubmitted(true);
    } else if (mode === 'refresh') {
      setIsRefreshing(true);
    } else if (mode === 'loadMore') {
      setIsLoadingMore(true);
    }
    
    // Simplified approach - only use axios with direct API key
    const tmdbApiKey = 'f81669c9b178d14a4ded8c2928e7a996';
    let allItems = [];
    const promises = [];
    
    // Process previous likes early to use across all content types
    const previousLikesKeywords = extractKeywordsFromLikes(previousLikes);
    
    if (contentTypes.includes('movie')) {
      promises.push(
        axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: tmdbApiKey,
            language: 'en-US',
            sort_by: 'popularity.desc',
            include_adult: false,
            include_video: false,
            page: page, // Use the page parameter
            'vote_count.gte': 100, 
            with_genres: selectedGenres.length > 0 ? getGenreIds(selectedGenres, 'movie').join(',') : undefined,
            with_original_language: language === 'Hindi' ? 'hi' : undefined,
            // Use query if we have previous likes for better recommendations
            ...(previousLikesKeywords.length > 0 && {
              with_keywords: getRelatedKeywords(previousLikesKeywords[0])
            })
          }
        })
        .then(res => {
          const movies = res.data.results?.map(movie => ({
            id: movie.id.toString(),
            title: movie.title || 'Unknown Title',
            description: movie.overview || 'No description available',
            coverImage: movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
              : '/placeholder.svg',
            rating: movie.vote_average ? movie.vote_average / 2 : 0,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2020,
            genres: movie.genre_ids?.map(id => getGenreNameById(id, 'movie')) || [],
            type: 'movie',
            india: movie.original_language === 'hi' || false
          })) || [];
          allItems = [...allItems, ...movies];
        })
        .catch(err => {
          console.error('Error fetching movies:', err);
          const fallbackMovies = getFallbackMovies();
          allItems = [...allItems, ...fallbackMovies];
        })
      );
      
      // If we have previous likes, also try a search request for each one
      if (previousLikesKeywords.length > 0) {
        previousLikesKeywords.forEach(keyword => {
          promises.push(
            axios.get('https://api.themoviedb.org/3/search/movie', {
              params: {
                api_key: tmdbApiKey,
                query: keyword,
                language: 'en-US',
                include_adult: false,
                page: 1
              }
            })
            .then(res => {
              // Process results to find similar movies
              if (res.data.results && res.data.results.length > 0) {
                // Get the first result's ID to find similar movies
                const movieId = res.data.results[0].id;
                
                // Make a request for similar movies
                return axios.get(`https://api.themoviedb.org/3/movie/${movieId}/similar`, {
                  params: {
                    api_key: tmdbApiKey,
                    language: 'en-US',
                    page: 1
                  }
                });
              }
              throw new Error('No results found');
            })
            .then(similarRes => {
              const similarMovies = similarRes.data.results?.map(movie => ({
                id: movie.id.toString(),
                title: movie.title || 'Unknown Title',
                description: movie.overview || 'No description available',
                coverImage: movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                  : '/placeholder.svg',
                rating: movie.vote_average ? movie.vote_average / 2 : 0,
                year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2020,
                genres: movie.genre_ids?.map(id => getGenreNameById(id, 'movie')) || [],
                type: 'movie',
                india: movie.original_language === 'hi' || false,
                // Add a flag to indicate this came from previous likes
                fromPreviousLikes: true
              })) || [];
              
              // Add these to our items collection with higher preference
              allItems = [...allItems, ...similarMovies];
            })
            .catch(err => {
              console.error(`Error finding similar content for ${keyword}:`, err);
            })
          );
        });
      }
    }
    
    if (contentTypes.includes('series')) {
      promises.push(
        axios.get('https://api.themoviedb.org/3/discover/tv', {
          params: {
            api_key: tmdbApiKey,
            language: 'en-US',
            sort_by: 'popularity.desc',
            include_adult: false,
            page: page, // Use the page parameter
            'vote_count.gte': 50,
            with_genres: selectedGenres.length > 0 ? getGenreIds(selectedGenres, 'tv').join(',') : undefined,
            with_original_language: language === 'Hindi' ? 'hi' : undefined
          }
        })
        .then(res => {
          const series = res.data.results?.map(show => ({
            id: show.id.toString(),
            title: show.name || 'Unknown Title',
            description: show.overview || 'No description available',
            coverImage: show.poster_path 
              ? `https://image.tmdb.org/t/p/w500${show.poster_path}` 
              : '/placeholder.svg',
            rating: show.vote_average ? show.vote_average / 2 : 0,
            year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : 2020,
            genres: show.genre_ids?.map(id => getGenreNameById(id, 'tv')) || [],
            type: 'series',
            india: show.origin_country?.includes('IN') || false
          })) || [];
          allItems = [...allItems, ...series];
        })
        .catch(err => {
          console.error('Error fetching series:', err);
          const fallbackSeries = getFallbackSeries();
          allItems = [...allItems, ...fallbackSeries];
        })
      );
      
      // Also add similar search if we have previous likes
      if (previousLikesKeywords.length > 0) {
        previousLikesKeywords.forEach(keyword => {
          promises.push(
            axios.get('https://api.themoviedb.org/3/search/tv', {
              params: {
                api_key: tmdbApiKey,
                query: keyword,
                language: 'en-US',
                include_adult: false,
                page: 1
              }
            })
            .then(res => {
              if (res.data.results && res.data.results.length > 0) {
                const showId = res.data.results[0].id;
                
                return axios.get(`https://api.themoviedb.org/3/tv/${showId}/similar`, {
                  params: {
                    api_key: tmdbApiKey,
                    language: 'en-US',
                    page: 1
                  }
                });
              }
              throw new Error('No results found');
            })
            .then(similarRes => {
              const similarShows = similarRes.data.results?.map(show => ({
                id: show.id.toString(),
                title: show.name || 'Unknown Title',
                description: show.overview || 'No description available',
                coverImage: show.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${show.poster_path}` 
                  : '/placeholder.svg',
                rating: show.vote_average ? show.vote_average / 2 : 0,
                year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : 2020,
                genres: show.genre_ids?.map(id => getGenreNameById(id, 'tv')) || [],
                type: 'series',
                india: show.origin_country?.includes('IN') || false,
                fromPreviousLikes: true
              })) || [];
              
              allItems = [...allItems, ...similarShows];
            })
            .catch(err => {
              console.error(`Error finding similar series for ${keyword}:`, err);
            })
          );
        });
      }
    }
    
    if (contentTypes.includes('book')) {
      // Map selected genres to better book search terms
      const genreToBookCategory = {
        "Action": "action adventure",
        "Adventure": "adventure fiction",
        "Comedy": "humor",
        "Drama": "drama fiction",
        "Fantasy": "fantasy fiction", 
        "Horror": "horror fiction",
        "Mystery": "mystery fiction",
        "Romance": "romance fiction",
        "Sci-Fi": "science fiction",
        "Thriller": "thriller fiction",
        "Historical": "historical fiction",
        "Crime": "crime fiction"
      };
      
      // Build a more targeted query
      let queryParts = ['popular'];
      
      if (selectedGenres.length > 0) {
        // Use the first selected genre for better results
        const mainGenre = selectedGenres[0];
        const bookCategory = genreToBookCategory[mainGenre] || mainGenre;
        queryParts.push(bookCategory);
      }
      
      // Use all keywords from previous likes for books
      if (previousLikesKeywords.length > 0) {
        // For books we can use multiple keywords in the query
        queryParts.push(...previousLikesKeywords);
      }
      
      if (indiaMode && language === 'Hindi') {
        queryParts.push('indian author');
      }
      
      // Join with '+' for Google Books API
      const query = queryParts.join('+');
      
      promises.push(
        axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: query,
            maxResults: 20,
            orderBy: 'relevance',
            startIndex: (page - 1) * 10 // For pagination
          }
        })
        .then(res => {
          // Guard against undefined or empty results
          if (!res.data.items || res.data.items.length === 0) {
            throw new Error('No books found');
          }
          
          const books = res.data.items.map(book => ({
            id: book.id,
            title: book.volumeInfo?.title || 'Unknown Title',
            description: book.volumeInfo?.description || 'No description available',
            coverImage: book.volumeInfo?.imageLinks?.thumbnail || '/placeholder.svg',
            rating: book.volumeInfo?.averageRating || 3.8, // Default to a reasonable rating
            year: book.volumeInfo?.publishedDate 
              ? parseInt(book.volumeInfo.publishedDate.substring(0, 4)) 
              : 2020,
            author: book.volumeInfo?.authors?.join(', ') || 'Unknown',
            // Store original categories and our selected genres for better filtering
            genres: [
              ...(book.volumeInfo?.categories || []),
              ...(selectedGenres.length > 0 ? selectedGenres : [])
            ],
            type: 'book',
            india: indiaMode && language === 'Hindi'
          }));
          
          // Filter out books with very short descriptions
          const filteredBooks = books.filter(book => 
            book.description && book.description !== 'No description available' && 
            book.description.length > 50
          );
          
          // If we have enough books after filtering, use them
          if (filteredBooks.length >= 3) {
            allItems = [...allItems, ...filteredBooks];
          } else {
            // Otherwise use all books
            allItems = [...allItems, ...books];
          }
        })
        .catch(err => {
          console.error('Error fetching books:', err);
          // Use fallback books
          const fallbackBooks = getFallbackBooks();
          allItems = [...allItems, ...fallbackBooks];
        })
      );
    }
    
    if (contentTypes.includes('anime')) {
      promises.push(
        animeService.getPopular(page) // Pass page parameter if your service supports it
          .then(res => {
            const animeList = res.data.data.map(anime => ({
              id: anime.mal_id.toString(),
              title: anime.title || 'Unknown Title',
              description: anime.synopsis || 'No description available',
              coverImage: anime.images.jpg.image_url || '/placeholder.svg',
              rating: anime.score ? anime.score / 2 : 0,
              year: anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 2020,
              genres: anime.genres?.map(g => g.name) || [],
              episodes: anime.episodes,
              type: 'anime',
              india: false
            }));
            allItems = [...allItems, ...animeList];
          })
          .catch(err => {
            console.error('Error fetching anime:', err);
            // Add fallback anime if needed
          })
      );
    }
    
    try {
      await Promise.all(promises);
      
      // More relaxed filtering to ensure we get results
      let filteredItems = allItems.filter(item => {
        // Only apply genre filtering if we have enough items
        if (allItems.length > 10 && selectedGenres.length > 0) {
          const itemGenres = item.genres || [];
          
          // Special handling for books
          if (item.type === 'book') {
            // Books often have less specific genre info, so be more lenient
            if (selectedGenres.some(g => 
              itemGenres.some(ig => {
                const normalizedItemGenre = (ig || '').toLowerCase();
                const normalizedSelectedGenre = g.toLowerCase();
                
                // More generous matching for books
                return normalizedItemGenre.includes(normalizedSelectedGenre) || 
                       normalizedSelectedGenre.includes(normalizedItemGenre) ||
                       // Try to match related genres
                       (normalizedSelectedGenre === 'action' && normalizedItemGenre.includes('adventure')) ||
                       (normalizedSelectedGenre === 'fantasy' && (
                         normalizedItemGenre.includes('magic') || 
                         normalizedItemGenre.includes('supernatural')
                       )) ||
                       (normalizedSelectedGenre === 'thriller' && (
                         normalizedItemGenre.includes('suspense') || 
                         normalizedItemGenre.includes('crime')
                       ));
              })
            )) {
              return true;
            } else {
              return false;
            }
          } 
          // Existing filtering for movies/series/anime
          else {
            if (!selectedGenres.some(g => 
              itemGenres.some(ig => {
                // Case insensitive partial matching
                return ig.toLowerCase().includes(g.toLowerCase()) || 
                       g.toLowerCase().includes(ig.toLowerCase());
              })
            )) return false;
          }
        }
        
        // Rest of your filtering code...
        return true;
      });
      
      // Boost ranking for items matching previous likes keywords
      if (previousLikesKeywords.length > 0) {
        filteredItems = filteredItems.sort((a, b) => {
          // Items explicitly from previous likes searches get higher priority
          if (a.fromPreviousLikes && !b.fromPreviousLikes) return -1;
          if (!a.fromPreviousLikes && b.fromPreviousLikes) return 1;
          
          // Then check if title matches any keywords
          const aTitleMatchesKeyword = previousLikesKeywords.some(keyword => 
            (a.title || '').toLowerCase().includes(keyword.toLowerCase()) ||
            (a.author || '').toLowerCase().includes(keyword.toLowerCase())
          );
          
          const bTitleMatchesKeyword = previousLikesKeywords.some(keyword => 
            (b.title || '').toLowerCase().includes(keyword.toLowerCase()) ||
            (b.author || '').toLowerCase().includes(keyword.toLowerCase())
          );
          
          if (aTitleMatchesKeyword && !bTitleMatchesKeyword) return -1;
          if (!aTitleMatchesKeyword && bTitleMatchesKeyword) return 1;
          
          // Default to rating sort
          return b.rating - a.rating;
        });
      } else {
        // Standard rating sort if no previous likes
        filteredItems.sort((a, b) => b.rating - a.rating);
      }
      
      // Handle surprise me mode
      if (surpriseMe && filteredItems.length > 0) {
        const topItems = filteredItems.slice(0, 5);
        const randomIndex = Math.floor(Math.random() * topItems.length);
        filteredItems = [topItems[randomIndex]];
        setHasMore(false); // No more to load in surprise mode
      } else {
        // Check if we have more results to potentially load
        setHasMore(filteredItems.length >= 9);
      }
      
      // Update recommendations based on mode
      if (mode === 'initial' || mode === 'refresh') {
        setRecommendations(filteredItems);
        setCurrentPage(1);
        
        // Show appropriate toast message for refresh
        if (mode === 'refresh') {
          toast({
            title: "Recommendations refreshed",
            description: "Check out your new picks!",
          });
        } else {
          toast({
            title: filteredItems.length > 1 ? `Found ${filteredItems.length} recommendations` : "Found a perfect match!",
            description: "Hope we can break your boredom",
          });
        }
      } else if (mode === 'loadMore') {
        // Avoid duplicates by checking IDs
        const existingIds = new Set(recommendations.map(item => item.id));
        const uniqueNewItems = filteredItems.filter(item => !existingIds.has(item.id));
        
        // If we got no new items after filtering, we've reached the end
        if (uniqueNewItems.length === 0) {
          setHasMore(false);
          toast({
            title: "No more results",
            description: "You've seen all available recommendations",
          });
        } else {
          setRecommendations(prev => [...prev, ...uniqueNewItems]);
          setCurrentPage(page);
          
          toast({
            title: `Loaded ${uniqueNewItems.length} more items`,
            description: "Scroll down to see more recommendations",
          });
        }
      }
    } catch (error) {
      console.error(`Error ${mode} recommendations:`, error);
      
      // Handle errors based on mode
      if (mode === 'initial' || mode === 'refresh') {
        const fallbackItems = getFallbackMovies().slice(0, surpriseMe ? 1 : 3);
        setRecommendations(fallbackItems);
        
        toast({
          title: "Using backup recommendations",
          description: "We've found some great content for you!",
        });
      } else if (mode === 'loadMore') {
        toast({
          title: "Couldn't load more",
          description: "There was an error loading additional content",
          variant: "destructive",
        });
      }
    } finally {
      // Clear appropriate loading state
      if (mode === 'initial') {
        setIsLoading(false);
      } else if (mode === 'refresh') {
        setIsRefreshing(false);
      } else if (mode === 'loadMore') {
        setIsLoadingMore(false);
      }
    }
  };

  // Add refresh function
  // const refreshRecommendations = () => {
  //   getRecommendations('refresh');
  // };

  // Add load more function
  const loadMoreRecommendations = () => {
    getRecommendations('loadMore', currentPage + 1);
  };

  // Add this function after getRecommendations
  const refreshRecommendations = () => {
    // Add randomness to ensure different results
    const newPage = currentPage > 1 ? 1 : 2; // Alternate between pages 1 and 2
    
    // When refreshing, slightly modify the content types if only one is selected
    // to ensure variety in results
    if (contentTypes.length === 1) {
      // Temporarily add a second content type just for this request
      const allTypes = ['movie', 'series', 'book', 'anime'];
      const availableTypes = allTypes.filter(type => !contentTypes.includes(type));
      const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      
      setContentTypes(prev => [...prev, randomType]);
      
      // Call the regular refresh but with the delayed current page reset
      getRecommendations('refresh', newPage);
      
      // Restore original content type after a short delay
      setTimeout(() => {
        setContentTypes(prev => prev.filter(type => type !== randomType));
      }, 1000);
    } else {
      // If multiple content types are selected, just refresh normally
      getRecommendations('refresh', newPage);
    }
  };

  const resetForm = () => {
    setContentTypes(['movie']);
    setSelectedGenres([]);
    setSelectedMood(null);
    setPreviousLikes('');
    setLanguage('English');
    setSurpriseMe(false);
    setFormSubmitted(false);
    setRecommendations([]);
  };

  return (
    <div className="space-y-8 pb-8">
      {!formSubmitted ? (
        <div className="space-y-6">
          <Card className="border border-border shadow-sm">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/5">
              <CardTitle className="text-2xl">Tell us what you're in the mood for</CardTitle>
              <CardDescription>
                We'll find the perfect content to match your vibe
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Type of Content</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        contentTypes.includes('movie') 
                          ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => handleTypeToggle('movie')}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Film className="h-6 w-6" />
                        <span className="font-medium">Movies</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        contentTypes.includes('series') 
                          ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => handleTypeToggle('series')}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <MonitorPlay className="h-6 w-6" />
                        <span className="font-medium">Web Series</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        contentTypes.includes('book') 
                          ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => handleTypeToggle('book')}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <BookOpen className="h-6 w-6" />
                        <span className="font-medium">Books</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        contentTypes.includes('anime') 
                          ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => handleTypeToggle('anime')}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Tv className="h-6 w-6" />
                        <span className="font-medium">Anime</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">What's your mood?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {moods.map(mood => (
                      <div 
                        key={mood.label}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedMood === mood.label
                            ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
                            : 'bg-card hover:bg-muted'
                        }`}
                        onClick={() => handleMoodSelect(mood.label)}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          {mood.icon}
                          <span className="font-medium">{mood.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {!selectedMood && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium">Genres (Select up to 3)</h3>
                      <span className="text-xs text-muted-foreground">{selectedGenres.length}/3 selected</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {genres.map(genre => (
                        <Badge 
                          key={genre}
                          variant={selectedGenres.includes(genre) ? "default" : "outline"}
                          className={`cursor-pointer px-3 py-1 text-sm ${
                            selectedGenres.includes(genre) 
                              ? 'shadow-[0_0_5px_rgba(var(--primary),0.3)]' 
                              : 'hover:bg-secondary'
                          }`}
                          onClick={() => handleGenreToggle(genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="language" className="text-lg font-medium mb-3 block">Preferred Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="likes" className="text-lg font-medium mb-3 block">
                    Titles you've enjoyed before (optional)
                  </Label>
                  <Textarea 
                    id="likes"
                    placeholder="E.g. Breaking Bad, The Shawshank Redemption, Harry Potter"
                    value={previousLikes}
                    onChange={e => setPreviousLikes(e.target.value)}
                    className="resize-none"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="surprise" className="text-lg font-medium">
                      Surprise Me!
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get one perfect recommendation
                    </p>
                  </div>
                  <Switch 
                    id="surprise"
                    checked={surpriseMe}
                    onCheckedChange={setSurpriseMe}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6 pt-2">
              <Button 
                onClick={() => getRecommendations('initial')}
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg font-bold bg-gradient-to-r from-primary to-primary/80
                hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.4)] hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] 
                transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span>Find My Perfect Match</span>
                </div>
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Recommendations</h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={refreshRecommendations}
                disabled={isRefreshing}
                className="flex items-center gap-1"
              >
                {isRefreshing ? (
                  <>
                    <div className="animate-spin mr-1 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    <span>Refresh</span>
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>Start Over</Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Finding the perfect content to match your vibe...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-8">
              <MediaGrid items={recommendations} type="mixed" columns={surpriseMe ? 1 : 3} />
              
              {/* Load More button - only show if there's more content and not in surprise me mode */}
              {hasMore && !surpriseMe && (
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline"
                    onClick={loadMoreRecommendations}
                    disabled={isLoadingMore}
                    className="min-w-[200px]"
                    size="lg"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted mb-4">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to get more recommendations.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VibePickRecommendation;

// Add these fallback functions to provide content when API calls fail
function getFallbackMovies() {
  return [
    {
      id: "299536",
      title: "Avengers: Infinity War",
      description: "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos.",
      coverImage: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
      rating: 4.2,
      year: 2018,
      genres: ["Action", "Adventure", "Sci-Fi"],
      type: "movie",
      india: false
    },
    {
      id: "299534",
      title: "Avengers: Endgame",
      description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.",
      coverImage: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      rating: 4.3,
      year: 2019,
      genres: ["Action", "Adventure", "Sci-Fi"],
      type: "movie",
      india: false
    },
    {
      id: "361743",
      title: "Top Gun: Maverick",
      description: "After more than thirty years of service as a top naval aviator, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.",
      coverImage: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
      rating: 4.3,
      year: 2022,
      genres: ["Action", "Drama"],
      type: "movie",
      india: false
    }
  ];
}

// Add this function after getFallbackMovies
function getFallbackSeries() {
  return [
    {
      id: "1399",
      title: "Game of Thrones",
      description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.",
      coverImage: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
      rating: 4.4,
      year: 2011,
      genres: ["Drama", "Fantasy", "Adventure"],
      type: "series",
      india: false
    },
    {
      id: "66732",
      title: "Stranger Things",
      description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying forces in order to get him back.",
      coverImage: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
      rating: 4.3,
      year: 2016,
      genres: ["Drama", "Fantasy", "Horror", "Mystery", "Sci-Fi"],
      type: "series",
      india: false
    },
    {
      id: "88040",
      title: "Sacred Games",
      description: "A link in their pasts leads an honest cop to a fugitive gang boss, whose cryptic warning spurs the officer on a quest to save Mumbai from cataclysm.",
      coverImage: "https://image.tmdb.org/t/p/w500/AvspCRQXEJXCMdFxBk9SQxBuL1p.jpg",
      rating: 4.2,
      year: 2018,
      genres: ["Crime", "Drama", "Thriller"],
      type: "series",
      india: true
    }
  ];
}

// Add this function after getFallbackSeries
function getFallbackBooks() {
  return [
    {
      id: "book1",
      title: "The Harry Potter Series",
      description: "The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry.",
      coverImage: "https://books.google.com/books/content?id=f280CwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      rating: 4.8,
      year: 1997,
      author: "J.K. Rowling",
      genres: ["Fantasy", "Fiction", "Young Adult"],
      type: "book",
      india: false
    },
    {
      id: "book2",
      title: "The Lord of the Rings",
      description: "The Lord of the Rings is an epic high-fantasy novel by English author and scholar J. R. R. Tolkien.",
      coverImage: "https://books.google.com/books/content?id=yl4dILkcqm4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      rating: 4.7,
      year: 1954,
      author: "J.R.R. Tolkien",
      genres: ["Fantasy", "Fiction", "Adventure"],
      type: "book",
      india: false
    },
    {
      id: "book3",
      title: "The Da Vinci Code",
      description: "A murder in Paris's Louvre Museum and cryptic clues in some of Leonardo da Vinci's most famous paintings lead to the discovery of a religious mystery.",
      coverImage: "https://books.google.com/books/content?id=ivzfRJGrdFsC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      rating: 4.3,
      year: 2003,
      author: "Dan Brown",
      genres: ["Mystery", "Thriller", "Fiction"],
      type: "book",
      india: false
    }
  ];
}

// Helper function to retrieve related keywords for TMDB API
function getRelatedKeywords(query) {
  // This would ideally call a keywords API endpoint
  // For simplicity, we're using a mock approach
  // In a production app, you might want to fetch actual keyword IDs from TMDB
  
  // This is a placeholder - in a real implementation, you'd fetch keyword IDs 
  // from TMDB's keyword API based on the query
  return '';
}