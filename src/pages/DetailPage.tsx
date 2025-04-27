import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { movieService, seriesService, booksService, animeService } from '@/services/api';
import { userService } from '@/services/userService';
import { Loader } from 'lucide-react';

const DetailPage = () => {
  const { type, id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getTypeLabel = () => {
    switch(type) {
      case 'movie': return 'Movie';
      case 'series': return 'Web Series'; // Changed from "TV Series"
      case 'book': return 'Book';
      case 'anime': return 'Anime';
      default: return type;
    }
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!type || !id) {
        toast({
          title: 'Error',
          description: 'Invalid item type or ID',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        let response;
        let transformedItem;
        
        // Fetch item details based on type
        switch (type) {
          case 'movie':
            response = await movieService.getDetails(id);
            transformedItem = {
              id: response.data.id.toString(),
              title: response.data.title,
              description: response.data.overview,
              coverImage: `https://image.tmdb.org/t/p/w500${response.data.poster_path}`,
              backdropImage: `https://image.tmdb.org/t/p/original${response.data.backdrop_path}`,
              rating: response.data.vote_average / 2,
              releaseDate: response.data.release_date,
              genres: response.data.genres.map(g => g.name).join(', '),
              runtime: `${response.data.runtime} min`,
              type: 'movie'
            };

            // After fetching basic details, get watch providers
            try {
              const watchProvidersRes = await movieService.getWatchProviders(id);
              const providers = watchProvidersRes.data.results?.IN || watchProvidersRes.data.results?.US;
              
              if (providers) {
                transformedItem.watchProviders = providers.flatrate?.map(p => p.provider_name).join(", ") || 
                                                providers.rent?.map(p => p.provider_name).join(", ") ||
                                                "Not available for streaming";
              }
            } catch (error) {
              console.error("Failed to fetch watch providers:", error);
            }
            break;
            
          case 'series':
            response = await seriesService.getDetails(id);
            transformedItem = {
              id: response.data.id.toString(),
              title: response.data.name,
              description: response.data.overview,
              coverImage: `https://image.tmdb.org/t/p/w500${response.data.poster_path}`,
              backdropImage: `https://image.tmdb.org/t/p/original${response.data.backdrop_path}`,
              rating: response.data.vote_average / 2,
              releaseDate: response.data.first_air_date,
              genres: response.data.genres.map(g => g.name).join(', '),
              seasons: response.data.number_of_seasons,
              type: 'series'
            };
            break;
            
          case 'book':
            response = await booksService.getDetails(id);
            transformedItem = {
              id: response.data.id,
              title: response.data.volumeInfo.title,
              description: response.data.volumeInfo.description || 'No description available',
              coverImage: response.data.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
              rating: response.data.volumeInfo.averageRating || 0,
              author: response.data.volumeInfo.authors?.join(', ') || 'Unknown author',
              publishedDate: response.data.volumeInfo.publishedDate,
              pageCount: response.data.volumeInfo.pageCount,
              type: 'book'
            };
            break;
            
          case 'anime':
            response = await animeService.getDetails(id);
            transformedItem = {
              id: response.data.data.mal_id.toString(),
              title: response.data.data.title,
              description: response.data.data.synopsis || 'No description available',
              coverImage: response.data.data.images.jpg.large_image_url,
              rating: response.data.data.score / 2,
              releaseDate: response.data.data.aired?.from ? new Date(response.data.data.aired.from).toISOString().split('T')[0] : 'Unknown',
              episodes: response.data.data.episodes,
              genres: response.data.data.genres.map(genre => genre.name).join(', '),
              type: 'anime'
            };
            break;
            
          default:
            toast({
              title: 'Error',
              description: 'Invalid content type',
              variant: 'destructive',
            });
            navigate('/');
            return;
        }
        
        setItem(transformedItem);
        
        // Fetch similar items (simplified for this example)
        // In a real app, you'd make API calls to get similar items based on genre, etc.
        let similarResponse;
        switch (type) {
          case 'movie':
            similarResponse = await movieService.getPopular();
            setSimilarItems(similarResponse.data.results
              .filter(movie => movie.id.toString() !== id)
              .slice(0, 4)
              .map(movie => ({
                id: movie.id.toString(),
                title: movie.title,
                coverImage: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                rating: movie.vote_average / 2,
                type: 'movie'
              }))
            );
            break;
            
          // Add similar patterns for other types
          // ...
        }
        
        // If user is logged in, check watchlist and watched status
        if (user) {
          try {
            const [watchlistRes, watchedRes, ratingsRes] = await Promise.all([
              userService.getWatchlist(),
              userService.getWatchedItems(),
              userService.getUserRatings()
            ]);
            
            setIsInWatchlist(watchlistRes.data.data.some(
              item => item.itemType === type && item.itemId === id
            ));
            
            setIsWatched(watchedRes.data.data.some(
              item => item.itemType === type && item.itemId === id
            ));
            
            const userRatingItem = ratingsRes.data.data.find(
              item => item.itemType === type && item.itemId === id
            );
            
            if (userRatingItem) {
              setUserRating(userRatingItem.rating);
            }
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        }
        
      } catch (error) {
        console.error(`Failed to fetch ${type} details:`, error);
        toast({
          title: 'Error',
          description: `Failed to load ${type} details. Please try again later.`,
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [type, id, toast, navigate, user]);

  const handleAddToWatchlist = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your watchlist',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      
      if (isInWatchlist) {
        await userService.removeFromWatchlist(type, id);
        setIsInWatchlist(false);
        toast({
          title: 'Success',
          description: `Removed from watchlist`,
        });
      } else {
        await userService.addToWatchlist(type, id);
        setIsInWatchlist(true);
        toast({
          title: 'Success',
          description: `Added to watchlist`,
        });
      }
    } catch (error) {
      console.error('Watchlist action failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to update watchlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsWatched = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to mark items as watched',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      
      if (isWatched) {
        await userService.removeFromWatched(type, id);
        setIsWatched(false);
        toast({
          title: 'Success',
          description: `Removed from watched list`,
        });
      } else {
        await userService.markAsWatched(type, id);
        setIsWatched(true);
        toast({
          title: 'Success',
          description: `Marked as watched`,
        });
      }
    } catch (error) {
      console.error('Watched action failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to update watched status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRateItem = async (rating) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to rate items',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      await userService.rateItem(type, id, rating);
      setUserRating(rating);
      toast({
        title: 'Success',
        description: `Rating saved`,
      });
    } catch (error) {
      console.error('Rating failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to save rating. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-[70vh]">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Item Not Found</h1>
          <p className="text-muted-foreground mb-8">Sorry, we couldn't find the requested content.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero section with backdrop */}
      <div 
        className="h-[40vh] md:h-[50vh] relative bg-cover bg-center"
        style={{
          backgroundImage: item.backdropImage 
            ? `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${item.backdropImage})` 
            : 'none'
        }}
      >
        <div className="container h-full flex items-end pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{item.title}</h1>
        </div>
      </div>
      
      <main className="py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Cover image */}
            <div className="flex flex-col items-center">
              <img 
                src={item.coverImage} 
                alt={item.title}
                className="rounded-lg shadow-lg w-full max-w-[300px] h-auto object-cover"
              />
              
              {/* User actions */}
              <div className="mt-6 w-full max-w-[300px] space-y-3">
                <Button 
                  variant={isInWatchlist ? "secondary" : "outline"} 
                  className="w-full flex items-center gap-2 justify-center"
                  onClick={handleAddToWatchlist}
                  disabled={actionLoading}
                >
                  <Heart className={isInWatchlist ? "fill-current" : ""} size={16} />
                  {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>
                
                <Button 
                  variant={isWatched ? "secondary" : "outline"} 
                  className="w-full flex items-center gap-2 justify-center"
                  onClick={handleMarkAsWatched}
                  disabled={actionLoading}
                >
                  <Check size={16} />
                  {isWatched ? "Watched" : "Mark as Watched"}
                </Button>
              </div>
              
              {/* User rating */}
              <div className="mt-6 w-full max-w-[300px]">
                <h3 className="text-center mb-2 font-medium">Your Rating</h3>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRateItem(star)}
                      disabled={actionLoading}
                      className="p-1"
                    >
                      <Star 
                        size={24} 
                        className={userRating && userRating >= star 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-400"
                        } 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right column - Details */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="text-yellow-400 fill-yellow-400 h-5 w-5 mr-1" />
                  <span>{item.rating ? item.rating.toFixed(1) : 'N/A'}/5</span>
                </div>
                
                <div className="text-muted-foreground">
                  {item.releaseDate && `Released: ${item.releaseDate}`}
                </div>
                
                {item.type && (
                  <Badge variant="outline" className="capitalize">
                    {getTypeLabel()}
                  </Badge>
                )}
              </div>
              
              {item.genres && (
                <div className="mb-6">
                  <span className="text-muted-foreground">Genres: </span>
                  <span>{item.genres}</span>
                </div>
              )}

              {/* Where to Watch Section */}
              <div className="mb-6 mt-4">
                <h3 className="text-lg font-semibold mb-2">Where to Watch</h3>
                <div className="flex flex-wrap gap-2">
                  {item.watchProviders || item.streamingPlatform ? (
                    <Badge variant="outline" className="px-3 py-1">
                      {item.watchProviders || item.streamingPlatform}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">Information not available</span>
                  )}
                </div>
              </div>
              
              {/* Additional details based on type */}
              {item.type === 'movie' && item.runtime && (
                <div className="mb-6">
                  <span className="text-muted-foreground">Runtime: </span>
                  <span>{item.runtime}</span>
                </div>
              )}
              
              {item.type === 'series' && item.seasons && (
                <div className="mb-6">
                  <span className="text-muted-foreground">Seasons: </span>
                  <span>{item.seasons}</span>
                </div>
              )}
              
              {item.type === 'book' && (
                <div className="space-y-2 mb-6">
                  {item.author && (
                    <div>
                      <span className="text-muted-foreground">Author: </span>
                      <span>{item.author}</span>
                    </div>
                  )}
                  {item.pageCount && (
                    <div>
                      <span className="text-muted-foreground">Pages: </span>
                      <span>{item.pageCount}</span>
                    </div>
                  )}
                </div>
              )}
              
              {item.type === 'anime' && item.episodes && (
                <div className="mb-6">
                  <span className="text-muted-foreground">Episodes: </span>
                  <span>{item.episodes}</span>
                </div>
              )}
              
              {/* Description */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {item.description || 'No description available'}
                </p>
              </div>
              
              {/* Similar Items Section */}
              {similarItems.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-semibold mb-6">You Might Also Like</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {similarItems.map(similar => (
                      <Link 
                        key={similar.id} 
                        to={`/detail/${similar.type}/${similar.id}`}
                        className="block hover:opacity-80 transition-opacity"
                      >
                        <img 
                          src={similar.coverImage} 
                          alt={similar.title}
                          className="rounded-lg shadow-md w-full h-auto aspect-[2/3] object-cover"
                        />
                        <h3 className="mt-2 font-medium line-clamp-1">{similar.title}</h3>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DetailPage;
