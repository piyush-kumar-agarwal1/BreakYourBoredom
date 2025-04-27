import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MediaGrid from '@/components/MediaGrid';
import { seriesService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { useIndiaMode } from '@/contexts/IndiaModeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Platform information
const PLATFORMS = {
  'netflix': { id: 213, name: 'Netflix' },
  'prime': { id: 1024, name: 'Amazon Prime' },
  'disney': { id: 2739, name: 'Disney+' },
  'apple': { id: 2552, name: 'Apple TV+' },
  'hbo': { id: 384, name: 'HBO' },
  'hulu': { id: 3186, name: 'Hulu' },
  // Indian platforms
  'hotstar': { id: 4353, name: 'Hotstar' },
  'sonyliv': { id: 3575, name: 'SonyLIV' },
  'zee5': { id: 4818, name: 'ZEE5' },
};

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [platformSeries, setPlatformSeries] = useState({
    'netflix': [],
    'prime': [],
    'disney': [],
    'all': []
  });
  const [activeTab, setActiveTab] = useState('netflix');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { indiaMode } = useIndiaMode();

  useEffect(() => {
    const fetchNetflixShows = async () => {
      try {
        setLoading(true);
        
        // Get Netflix shows first (always show these)
        const netflixResponse = await seriesService.getNetworkShows(213, indiaMode); // Pass indiaMode
        
        // Get Amazon Prime shows
        const primeResponse = await seriesService.getNetworkShows(1024, indiaMode); // Pass indiaMode
        
        // Get Disney+ shows
        const disneyResponse = await seriesService.getNetworkShows(2739, indiaMode); // Pass indiaMode
        
        // Transform the Netflix data
        const netflixShows = netflixResponse.data.results.map(show => ({
          id: show.id.toString(),
          title: show.name || "Unknown Title",
          description: show.overview || 'No description available',
          coverImage: show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : '/placeholder.svg',
          rating: show.vote_average ? show.vote_average / 2 : 0,
          releaseDate: show.first_air_date,
          type: 'series',
          india: show.origin_country?.includes('IN') || false,
          streamingPlatform: 'Netflix',
          watchProviders: 'Netflix'
        }));
        
        const primeShows = primeResponse.data.results.map(show => ({
          id: show.id.toString(),
          title: show.name || "Unknown Title",
          description: show.overview || 'No description available',
          coverImage: show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : '/placeholder.svg',
          rating: show.vote_average ? show.vote_average / 2 : 0,
          releaseDate: show.first_air_date,
          type: 'series',
          india: show.origin_country?.includes('IN') || false,
          streamingPlatform: 'Amazon Prime'
        }));
        
        const disneyShows = disneyResponse.data.results.map(show => ({
          id: show.id.toString(),
          title: show.name || "Unknown Title",
          description: show.overview || 'No description available',
          coverImage: show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : '/placeholder.svg',
          rating: show.vote_average ? show.vote_average / 2 : 0,
          releaseDate: show.first_air_date,
          type: 'series',
          india: show.origin_country?.includes('IN') || false,
          streamingPlatform: 'Disney+'
        }));
        
        // Combine all shows for the "All" tab
        const allShows = [...netflixShows, ...primeShows, ...disneyShows];
        
        // Update the state
        setPlatformSeries({
          'netflix': netflixShows,
          'prime': primeShows,
          'disney': disneyShows,
          'all': allShows
        });
        
        // Also set the series state based on the active tab
        setSeries(netflixShows); // Default to Netflix
        
      } catch (error) {
        console.error('Failed to fetch web series:', error);
        toast({
          title: 'Error',
          description: 'Failed to load web series. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNetflixShows();
  }, [toast, indiaMode]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSeries(platformSeries[value]);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-12">
        <div className="container">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-4">Web Series</h1>
            <p className="text-muted-foreground mb-6">
              {indiaMode 
                ? "Discover popular Hindi web series from Netflix, Amazon Prime, and Disney+."
                : "Discover popular web series from major streaming platforms."}
            </p>
            
            <Tabs defaultValue="netflix" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="netflix">Netflix</TabsTrigger>
                <TabsTrigger value="prime">Amazon Prime</TabsTrigger>
                <TabsTrigger value="disney">Disney+</TabsTrigger>
                <TabsTrigger value="all">All Platforms</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {series.length > 0 ? (
            <MediaGrid items={series} type="series" columns={5} />
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl font-semibold mb-2">No web series found</p>
              <p className="text-muted-foreground">
                We couldn't find any streaming series. Try again later or check your filters.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SeriesPage;
