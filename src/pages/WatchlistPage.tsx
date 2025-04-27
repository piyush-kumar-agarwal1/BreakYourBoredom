import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { movieService, seriesService, animeService, booksService } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MediaGrid from '@/components/MediaGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, PlusCircle, ListChecks, Film, Tv } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MediaItem } from '@/types/media';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const WatchlistPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
  const [watchedItems, setWatchedItems] = useState<MediaItem[]>([]);
  const [seriesList, setSeriesList] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchUserContent = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch watchlist and watched items
        const [watchlistRes, watchedRes] = await Promise.all([
          userService.getWatchlist(),
          userService.getWatchedItems()
        ]);

        // Check if we received data in the expected format
        if (!watchlistRes.data.data) {
          toast({
            title: 'Data Format Error',
            description: 'The watchlist data is not in the expected format',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        // Use the correct data structure - backend returns {success, data}
        const watchlistItems = await fetchDetailsForItems(watchlistRes.data.data || []);
        const watchedItemsDetails = await fetchDetailsForItems(watchedRes.data.data || []);

        const filteredWatchlist = watchlistItems.filter(Boolean);
        const filteredWatched = watchedItemsDetails.filter(Boolean);
        
        setWatchlist(filteredWatchlist);
        setWatchedItems(filteredWatched);
        
        // Extract series from both watchlist and watched items
        const allSeriesItems = [
          ...filteredWatchlist.filter(item => item.type === 'series'),
          ...filteredWatched.filter(item => item.type === 'series')
        ];
        
        // Remove duplicates by ID
        const uniqueSeries = allSeriesItems.filter(
          (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        );
        
        setSeriesList(uniqueSeries);
      } catch (error) {
        console.error('Failed to fetch user content', error);
        const errorMessage = error.response?.data?.message || 'Failed to load your content';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserContent();
  }, [user, toast]);

  const fetchDetailsForItems = async (items) => {
    return Promise.all(
      items.map(async (item) => {
        try {
          let details;
          
          switch (item.itemType) {
            case 'movie':
              details = await movieService.getDetails(item.itemId);
              if (!details.data || !details.data.title) {
                throw new Error('Invalid movie data');
              }
              return {
                id: item.itemId,
                title: details.data.title,
                description: details.data.overview || 'No description available',
                coverImage: details.data.poster_path
                  ? `https://image.tmdb.org/t/p/w500${details.data.poster_path}`
                  : '/placeholder.svg',
                type: 'movie',
                rating: details.data.vote_average ? details.data.vote_average / 2 : 0,
              };
            case 'series':
              details = await seriesService.getDetails(item.itemId);
              if (!details.data || !details.data.name) {
                throw new Error('Invalid series data');
              }
              return {
                id: item.itemId,
                title: details.data.name,
                description: details.data.overview || 'No description available',
                coverImage: details.data.poster_path
                  ? `https://image.tmdb.org/t/p/w500${details.data.poster_path}`
                  : '/placeholder.svg',
                type: 'series',
                rating: details.data.vote_average ? details.data.vote_average / 2 : 0,
              };
            case 'anime':
              details = await animeService.getDetails(item.itemId);
              if (!details.data || !details.data.title) {
                throw new Error('Invalid anime data');
              }
              return {
                id: item.itemId,
                title: details.data.title,
                description: details.data.synopsis || 'No description available',
                coverImage: details.data.images.jpg.large_image_url || '/placeholder.svg',
                type: 'anime',
                rating: details.data.score ? details.data.score / 2 : 0,
              };
            case 'book':
              details = await booksService.getDetails(item.itemId);
              if (!details.data || !details.data.volumeInfo.title) {
                throw new Error('Invalid book data');
              }
              return {
                id: item.itemId,
                title: details.data.volumeInfo.title,
                description: details.data.volumeInfo.description || 'No description available',
                coverImage: details.data.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
                type: 'book',
                rating: details.data.volumeInfo.averageRating || 0,
              };
            default:
              throw new Error('Unknown item type');
          }
        } catch (error) {
          console.error(`Failed to fetch details for ${item.itemType} ${item.itemId}:`, error);
          return {
            id: item.itemId,
            title: `${item.itemType} (details unavailable)`,
            description: 'Could not load details for this item',
            coverImage: '/placeholder.svg',
            type: item.itemType,
            rating: 0,
            error: true
          };
        }
      })
    );
  };

  // Empty state component for better UI
  const EmptyState = ({ type, icon, message, buttonText }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/20 rounded-lg">
      {icon}
      <h3 className="text-xl font-medium mt-4 mb-2">{message}</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {type === 'watchlist' && "Add items to your watchlist to keep track of what you want to watch later."}
        {type === 'watched' && "Mark items as watched to keep track of your entertainment history."}
        {type === 'series' && "Add series to your watchlist or mark them as watched to see them here."}
      </p>
      <Button onClick={() => navigate('/')} variant="outline">
        {buttonText}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-[70vh]">
          <Loader size={40} className="animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Lists</h1>
          
          <Tabs defaultValue="watchlist" className="w-full">
            <TabsList className="mb-6 w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="watchlist" className="gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>Watchlist</span>
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {watchlist.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="watched" className="gap-2">
                <ListChecks className="w-4 h-4" />
                <span>Watched</span>
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {watchedItems.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="series" className="gap-2">
                <Tv className="w-4 h-4" />
                <span>Web Series</span>
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {seriesList.length}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <div className="bg-card border rounded-lg p-5">
              <TabsContent value="watchlist">
                {watchlist.length === 0 ? (
                  <EmptyState
                    type="watchlist"
                    icon={<PlusCircle className="h-12 w-12 text-muted-foreground/60" />}
                    message="Your watchlist is empty"
                    buttonText="Browse Content"
                  />
                ) : (
                  <MediaGrid 
                    items={watchlist} 
                    type="mixed" 
                    columns={{
                      default: 2,
                      sm: 3,
                      md: 4,
                      lg: 5
                    }}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="watched">
                {watchedItems.length === 0 ? (
                  <EmptyState
                    type="watched"
                    icon={<ListChecks className="h-12 w-12 text-muted-foreground/60" />}
                    message="You haven't marked anything as watched"
                    buttonText="Discover Content"
                  />
                ) : (
                  <MediaGrid 
                    items={watchedItems} 
                    type="mixed" 
                    columns={{
                      default: 2,
                      sm: 3,
                      md: 4,
                      lg: 5
                    }} 
                  />
                )}
              </TabsContent>

              <TabsContent value="series">
                {seriesList.length === 0 ? (
                  <EmptyState
                    type="series"
                    icon={<Tv className="h-12 w-12 text-muted-foreground/60" />}
                    message="No web series in your lists"
                    buttonText="Explore Web Series"
                  />
                ) : (
                  <MediaGrid 
                    items={seriesList} 
                    type="series" 
                    columns={{
                      default: 2,
                      sm: 3,
                      md: 4,
                      lg: 5
                    }}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WatchlistPage;