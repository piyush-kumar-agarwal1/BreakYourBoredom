import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MediaGrid from '@/components/MediaGrid';
import { animeService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const AnimePage = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const response = await animeService.getPopular();
        
        // Transform the data
        const transformedAnime = response.data.data.map(item => ({
          id: item.mal_id.toString(),
          title: item.title,
          description: item.synopsis || 'No description available',
          coverImage: item.images.jpg.image_url,
          rating: item.score / 2, // Convert from 10-point to 5-point scale
          releaseDate: item.aired?.from ? new Date(item.aired.from).toISOString().split('T')[0] : 'Unknown',
          episodes: item.episodes,
          genres: item.genres.map(genre => genre.name).join(', '),
          type: 'anime',
          watchProviders: getAnimeProviders(item.title, item.studios?.[0]?.name)
        }));
        
        setAnime(transformedAnime);
      } catch (error) {
        console.error('Failed to fetch anime:', error);
        toast({
          title: 'Error',
          description: 'Failed to load anime. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [toast]);

  // Helper function to provide common streaming platforms for anime
  function getAnimeProviders(title, studio) {
    const commonPlatforms = ['Crunchyroll', 'Funimation', 'Netflix', 'Hulu', 'Amazon Prime'];
    // For popular anime, you could add specific mappings
    if (title.includes('Naruto') || title.includes('One Piece')) {
      return 'Crunchyroll, Netflix';
    }
    if (studio === 'Kyoto Animation') {
      return 'Crunchyroll, Netflix';
    }
    // Return most common platforms as fallback
    return 'Crunchyroll, Funimation';
  }

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
      
      <main className="pt-8 pb-16">
        <div className="container">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-4">Anime</h1>
            <p className="text-muted-foreground">Explore the vivid world of Japanese animation, from action-packed adventures to emotional slice-of-life stories.</p>
          </div>
          
          <MediaGrid items={anime} type="anime" columns={5} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnimePage;
