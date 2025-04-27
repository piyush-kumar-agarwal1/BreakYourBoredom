import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MediaGrid from '@/components/MediaGrid';
import { movieService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { useIndiaMode } from '@/contexts/IndiaModeContext';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { indiaMode } = useIndiaMode();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getPopular(indiaMode);
        
        // Transform the data format to match what your MediaGrid component expects
        const transformedMovies = response.data.results.map(movie => ({
          id: movie.id.toString(),
          title: movie.title || 'Unknown Title',
          description: movie.overview || 'No description available',
          coverImage: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : '/placeholder.svg',
          rating: movie.vote_average ? movie.vote_average / 2 : 0, // Convert from 10-point to 5-point scale
          releaseDate: movie.release_date,
          type: 'movie',
          india: indiaMode || 
            (movie.origin_country && movie.origin_country.includes('IN')) ||
            (movie.original_language === 'hi') ||
            (movie.production_countries && movie.production_countries.some(c => c.iso_3166_1 === 'IN'))
        }));
        
        setMovies(transformedMovies);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        toast({
          title: 'Error',
          description: 'Failed to load movies. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [toast, indiaMode]); // Add indiaMode as a dependency

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
            <h1 className="text-3xl font-bold mb-4">Movies</h1>
            <p className="text-muted-foreground">Break your boredom by discovering a wide range of movies from around the world, across various genres and eras.</p>
          </div>
          
          <MediaGrid items={movies} type="movie" columns={5} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MoviesPage;
