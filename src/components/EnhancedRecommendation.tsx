import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Film, 
  BookOpen, 
  MonitorPlay, 
  Tv, 
  Shuffle,
  Sparkles,
  Laugh,
  BrainCircuit,
  HeartPulse,
  AlertCircle
} from 'lucide-react';
import { mockMovies, mockAnime, mockBooks, mockSeries, indianMovies, indianAnime, indianBooks, indianSeries } from '@/data/mockData';
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

const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", 
  "Historical", "Crime"
];

const moods = [
  { label: "Feel-Good", icon: <Sparkles className="h-4 w-4" /> },
  { label: "Suspenseful", icon: <AlertCircle className="h-4 w-4" /> },
  { label: "Light-Hearted", icon: <Laugh className="h-4 w-4" /> },
  { label: "Mind-Bending", icon: <BrainCircuit className="h-4 w-4" /> }
];

const languages = ["English", "Hindi", "Japanese", "Korean", "Spanish", "French", "German"];
const platforms = ["Netflix", "Amazon Prime", "Disney+", "HBO Max", "Hulu", "Apple TV+"];

const yearRange = [1950, new Date().getFullYear()];

const EnhancedRecommendation = () => {
  const [contentTypes, setContentTypes] = useState<string[]>(['movie']);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [previousLikes, setPreviousLikes] = useState('');
  const [years, setYears] = useState(yearRange);
  const [language, setLanguage] = useState('English');
  const [platform, setPlatform] = useState('Netflix');
  const [surpriseMe, setSurpriseMe] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { indiaMode } = useIndiaMode();

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

  const getRecommendations = () => {
    if (contentTypes.length === 0) {
      toast({
        title: "No content type selected",
        description: "Please select at least one content type",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setFormSubmitted(true);

    // Choose data source based on India Mode
    const movies = indiaMode ? indianMovies : mockMovies;
    const anime = indiaMode ? indianAnime : mockAnime;
    const books = indiaMode ? indianBooks : mockBooks;
    const series = indiaMode ? indianSeries : mockSeries;

    // Get combined array based on selected types
    let combinedArray: any[] = [];
    if (contentTypes.includes('movie')) combinedArray.push(...movies);
    if (contentTypes.includes('anime')) combinedArray.push(...anime);
    if (contentTypes.includes('book')) combinedArray.push(...books);
    if (contentTypes.includes('series')) combinedArray.push(...series);

    // Filter by selected criteria
    let filteredItems = combinedArray.filter(item => {
      // Filter by year
      const itemYear = typeof item.year === 'number' ? item.year : parseInt(item.year);
      if (itemYear < years[0] || itemYear > years[1]) return false;

      // Filter by genres if any are selected
      if (selectedGenres.length > 0) {
        const itemGenres = item.genres || [];
        if (!selectedGenres.some(g => itemGenres.includes(g))) return false;
      }

      // Add more filters based on mood, platform, language etc.
      // This would be more sophisticated in a real implementation

      return true;
    });

    // Sort by relevance (in a real implementation, this would be much more sophisticated)
    filteredItems.sort((a, b) => b.rating - a.rating);

    // Limit results or take just one for surprise me
    if (surpriseMe) {
      // Just pick one random item from the top 5
      const topItems = filteredItems.slice(0, 5);
      const randomIndex = Math.floor(Math.random() * topItems.length);
      filteredItems = topItems.length > 0 ? [topItems[randomIndex]] : [];
    } else {
      // Limit to a reasonable number
      filteredItems = filteredItems.slice(0, 6);
    }

    setRecommendations(filteredItems);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      
      if (filteredItems.length === 0) {
        toast({
          title: "No matches found",
          description: "Try adjusting your filters for more results",
          variant: "destructive",
        });
      } else {
        toast({
          title: filteredItems.length > 1 ? `Found ${filteredItems.length} recommendations` : "Found a perfect match!",
          description: "Hope we can break your boredom",
        });
      }
    }, 1500);
  };

  const resetForm = () => {
    setContentTypes(['movie']);
    setSelectedGenres([]);
    setSelectedMood(null);
    setPreviousLikes('');
    setYears(yearRange);
    setLanguage('English');
    setPlatform('Netflix');
    setSurpriseMe(false);
    setFormSubmitted(false);
    setRecommendations([]);
  };

  return (
    <div className="space-y-8 pb-8">
      {!formSubmitted ? (
        <div className="space-y-6">
          <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="text-2xl">What do you want to watch or read?</CardTitle>
              <CardDescription>
                Let us help you break your boredom with personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="space-y-6">
                {/* Content Type Selection */}
                <div>
                  <h3 className="font-medium mb-3">Type of Content</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        contentTypes.includes('movie') 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => handleTypeToggle('movie')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Film className="h-5 w-5" />
                        <span className="font-medium">Movies</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        contentTypes.includes('series') 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => handleTypeToggle('series')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <MonitorPlay className="h-5 w-5" />
                        <span className="font-medium">Web Series</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        contentTypes.includes('book') 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => handleTypeToggle('book')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium">Books</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        contentTypes.includes('anime') 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => handleTypeToggle('anime')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Tv className="h-5 w-5" />
                        <span className="font-medium">Anime</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Genre Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Genres (Select up to 3)</h3>
                    <span className="text-xs text-muted-foreground">{selectedGenres.length}/3 selected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                      <Badge 
                        key={genre}
                        variant={selectedGenres.includes(genre) ? "default" : "outline"}
                        className={`cursor-pointer ${selectedGenres.includes(genre) ? '' : 'hover:bg-secondary'}`}
                        onClick={() => handleGenreToggle(genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Mood-Based Selection */}
                <div>
                  <h3 className="font-medium mb-3">What mood are you in?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {moods.map(mood => (
                      <div 
                        key={mood.label}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          selectedMood === mood.label
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-card hover:bg-muted'
                        }`}
                        onClick={() => setSelectedMood(mood.label === selectedMood ? null : mood.label)}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          {mood.icon}
                          <span className="font-medium">{mood.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Years Range Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Year Range</h3>
                    <span className="text-sm">{years[0]} - {years[1]}</span>
                  </div>
                  <Slider 
                    defaultValue={yearRange} 
                    min={yearRange[0]} 
                    max={yearRange[1]} 
                    step={1}
                    value={years}
                    onValueChange={setYears}
                    className="my-6"
                  />
                </div>
                
                {/* Languages and Platforms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language" className="font-medium mb-3 block">Preferred Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
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
                    <Label htmlFor="platform" className="font-medium mb-3 block">Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Previous Likes */}
                <div>
                  <Label htmlFor="likes" className="font-medium mb-3 block">
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
                
                {/* Surprise Me Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="surprise" className="font-medium">
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
                onClick={getRecommendations}
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg rounded-full font-bold bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 shadow-md hover:shadow-lg transition-all hover:scale-105 group relative overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-primary opacity-0 group-hover:opacity-30 transition-opacity"></span>
                <div className="relative flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span>🎬 Break My Boredom!</span>
                </div>
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Recommendations</h2>
            <Button variant="outline" onClick={resetForm}>Start Over</Button>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Finding the perfect content to break your boredom...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((item, index) => (
                <div 
                  key={`${item.id}-${index}`} 
                  className="group relative h-[400px] perspective"
                >
                  <div className="card-flip absolute inset-0 transform-style-3d transition-transform duration-700 w-full h-full preserve-3d group-hover:rotate-y-180">
                    {/* Front of card */}
                    <div className="front absolute inset-0 bg-card rounded-xl overflow-hidden shadow-lg transform-gpu backface-hidden">
                      <div className="relative h-full">
                        <img 
                          src={item.coverImage} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-bold text-white">{item.title}</h3>
                          <div className="flex items-center text-white/80 space-x-2 mt-1">
                            <span>{item.year}</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1">{item.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary/80">{getContentTypeLabel(item)}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back of card */}
                    <div className="back absolute inset-0 bg-card rounded-xl p-4 shadow-lg transform-gpu backface-hidden rotate-y-180 overflow-y-auto">
                      <div className="flex flex-col h-full">
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.genres?.map((genre: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">{genre}</Badge>
                          ))}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 flex-grow overflow-y-auto">
                          {item.description}
                        </p>
                        
                        <div className="mt-auto">
                          {/* Show relevant information based on content type */}
                          {item.type === 'movie' && (
                            <p className="text-sm mb-1">
                              <span className="font-medium">Director:</span> {item.director}
                            </p>
                          )}
                          
                          {item.type === 'book' && (
                            <p className="text-sm mb-1">
                              <span className="font-medium">Author:</span> {item.author}
                            </p>
                          )}
                          
                          {(item.type === 'series' || item.type === 'anime') && item.episodes && (
                            <p className="text-sm mb-1">
                              <span className="font-medium">Episodes:</span> {item.episodes}
                            </p>
                          )}
                          
                          {/* Where to watch section with appropriate info */}
                          <div className="mt-3">
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full"
                              onClick={() => navigate(`/detail/${item.type || getContentTypeFromId(item.id)}/${item.id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

function getContentTypeLabel(item: any) {
  if (item.type) return capitalizeFirstLetter(item.type);
  if (item.id.includes('movie')) return 'Movie';
  if (item.id.includes('series')) return 'Series';
  if (item.id.includes('book')) return 'Book';
  if (item.id.includes('anime')) return 'Anime';
  return 'Content';
}

function getContentTypeFromId(id: string) {
  if (id.includes('movie')) return 'movie';
  if (id.includes('series')) return 'series';
  if (id.includes('book')) return 'book';
  if (id.includes('anime')) return 'anime';
  return 'movie';
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default EnhancedRecommendation;