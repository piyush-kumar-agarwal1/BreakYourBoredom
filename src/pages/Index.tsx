import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import { movieService, seriesService, animeService, booksService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { MediaItem } from '@/types/media';
import { useIndiaMode } from '@/contexts/IndiaModeContext';

const Index = () => {
  const [featuredItem, setFeaturedItem] = useState<any>(null);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [series, setSeries] = useState<MediaItem[]>([]);
  const [anime, setAnime] = useState<MediaItem[]>([]);
  const [books, setBooks] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { indiaMode } = useIndiaMode();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        setLoading(true);

        console.log("Fetching data with indiaMode:", indiaMode);

        // Log each API call
        const trendingPromise = movieService.getTrending(indiaMode);
        const moviesPromise = movieService.getPopular(indiaMode);
        const seriesPromise = seriesService.getPopular(indiaMode);
        const animePromise = animeService.getPopular();
        const booksPromise = booksService.getPopular(indiaMode);

        // Wait for all promises with individual error handling
        const results = await Promise.allSettled([
          trendingPromise,
          moviesPromise,
          seriesPromise,
          animePromise,
          booksPromise
        ]);

        // Log results
        console.log("API results status:", {
          trending: results[0].status,
          movies: results[1].status,
          series: results[2].status,
          anime: results[3].status,
          books: results[4].status
        });

        // Process successful responses
        const trendingRes = results[0].status === 'fulfilled' ? results[0].value : { data: { results: [] } };
        const moviesRes = results[1].status === 'fulfilled' ? results[1].value : { data: { results: [] } };
        const seriesRes = results[2].status === 'fulfilled' ? results[2].value : { data: { results: [] } };
        const animeRes = results[3].status === 'fulfilled' ? results[3].value : { data: { data: [] } };
        const booksRes = results[4].status === 'fulfilled' ? results[4].value : { data: { items: [] } };

        // Process featured item
        if (trendingRes.data && trendingRes.data.results && trendingRes.data.results.length > 0) {
          const featured = trendingRes.data.results[0];
          setFeaturedItem({
            title: featured.title || 'Featured Title',
            description: featured.overview || 'No description available',
            image: featured.backdrop_path
              ? `https://image.tmdb.org/t/p/original${featured.backdrop_path}`
              : '/placeholder.svg',
            link: `/detail/movie/${featured.id}`,
            buttonText: 'View Details'
          });
        }

        // Add an "india" property to each item so we can display the badge if needed
        const transformedTrending = trendingRes.data && trendingRes.data.results 
          ? trendingRes.data.results
              .slice(1, 6)
              .map(movie => ({
                id: movie.id.toString(),
                title: movie.title || 'Unknown Title',
                description: movie.overview || 'No description available',
                coverImage: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/placeholder.svg',
                rating: movie.vote_average ? movie.vote_average / 2 : 0,
                type: 'movie',
                india: movie.origin_country?.includes('IN') || false
              }))
          : [];

        const transformedMovies = moviesRes.data && moviesRes.data.results 
          ? moviesRes.data.results
              .slice(0, 5)
              .map(movie => ({
                id: movie.id.toString(),
                title: movie.title || 'Unknown Title',
                description: movie.overview || 'No description available',
                coverImage: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/placeholder.svg',
                rating: movie.vote_average ? movie.vote_average / 2 : 0,
                type: 'movie',
                // Check multiple indicators for Indian content
                india: indiaMode ||
                  (movie.origin_country && movie.origin_country.includes('IN')) ||
                  (movie.original_language === 'hi') ||
                  (movie.production_countries && movie.production_countries.some(c => c.iso_3166_1 === 'IN'))
              }))
          : [];

        // After fetching regular movie data, fetch watch providers
        const moviesWithProviders = await Promise.all(
          transformedMovies.map(async (movie) => {
            try {
              const providersRes = await movieService.getWatchProviders(movie.id);
              const providers = providersRes.data.results?.IN || providersRes.data.results?.US;
              return {
                ...movie,
                watchProviders: providers?.flatrate?.map(p => p.provider_name).join(", ") || 
                               providers?.rent?.map(p => p.provider_name).join(", ") ||
                               "Not available for streaming"
              };
            } catch (error) {
              return movie; // Return original movie if watch providers can't be fetched
            }
          })
        );

        const transformedSeries = seriesRes.data && seriesRes.data.results 
          ? seriesRes.data.results
              .slice(0, 5)
              .map(show => ({
                id: show.id.toString(),
                title: show.name || 'Unknown Title',
                description: show.overview || 'No description available',
                coverImage: show.poster_path
                  ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                  : '/placeholder.svg',
                rating: show.vote_average ? show.vote_average / 2 : 0,
                type: 'series',
                india: show.origin_country?.includes('IN') || false
              }))
          : [];

        const transformedAnime = animeRes.data && animeRes.data.data 
          ? animeRes.data.data
              .slice(0, 5)
              .map(item => ({
                id: item.mal_id.toString(),
                title: item.title || 'Unknown Title',
                description: item.synopsis || 'No description available',
                coverImage: item.images && item.images.jpg && item.images.jpg.image_url
                  ? item.images.jpg.image_url
                  : '/placeholder.svg',
                rating: item.score ? item.score / 2 : 0,
                type: 'anime',
                india: false // Anime is typically Japanese, but you could add logic here if needed
              }))
          : [];

        // Add more robust checking for books data
        const transformedBooks = booksRes.data && booksRes.data.items 
          ? booksRes.data.items
            .slice(0, 5)
            .map(book => ({
              id: book.id || 'unknown',
              title: book.volumeInfo?.title || 'Unknown Title',
              description: book.volumeInfo?.description || 'No description available',
              coverImage: book.volumeInfo?.imageLinks?.thumbnail
                ? book.volumeInfo.imageLinks.thumbnail
                : '/placeholder.svg',
              rating: book.volumeInfo?.averageRating || 0,
              type: 'book',
              india: indiaMode ||
                (book.volumeInfo?.authors && book.volumeInfo.authors.join(' ').includes('Indian')) ||
                (book.volumeInfo?.publisher && book.volumeInfo.publisher.includes('India'))
            }))
          : []; // Return empty array if books data is missing

        // Add additional logging to help diagnose the issue
        console.log("Books API response structure:", {
          hasData: !!booksRes.data,
          hasItems: !!(booksRes.data && booksRes.data.items),
          itemsLength: booksRes.data && booksRes.data.items ? booksRes.data.items.length : 0
        });

        setTrending(transformedTrending);
        setMovies(moviesWithProviders);
        setSeries(transformedSeries);
        setAnime(transformedAnime);
        setBooks(transformedBooks);
      } catch (error) {
        console.error('Failed to fetch content:', error);
        toast({
          title: 'Error',
          description: 'Failed to load content. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, indiaMode]); // Add indiaMode as a dependency to refetch when it changes

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

      {/* Hero Section with Featured Content */}
      {featuredItem && (
        <Hero
          title={featuredItem.title}
          description={featuredItem.description}
          image={featuredItem.image}
          link={featuredItem.link}
          buttonText={featuredItem.buttonText}
        />
      )}

      <main className="py-8">
        <div className="container space-y-16">
          {/* Trending Section */}
          <CategorySection
            title="Trending Now"
            description="What everyone's watching this week - don't miss out!"
            items={trending}
            type="movie"
            linkTo="/movies"
          />

          <CategorySection
            title="Movies"
            description="Break your boredom with our curated selection of films across various genres."
            items={movies}
            type="movie"
            linkTo="/movies"
          />

          <CategorySection
            title="Web Series"
            description="Immerse yourself in binge-worthy shows from Netflix, Prime Video, Disney+ and other streaming platforms."
            items={series}
            type="series"
            linkTo="/series"
          />

          <CategorySection
            title="Books"
            description="Discover captivating stories and thought-provoking non-fiction."
            items={books}
            type="book"
            linkTo="/books"
          />

          <CategorySection
            title="Anime"
            description="Explore the vivid world of Japanese animation from action-packed adventures to emotional stories."
            items={anime}
            type="anime"
            linkTo="/anime"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;