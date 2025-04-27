
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Film, 
  BookOpen, 
  MonitorPlay, 
  Tv, 
  Shuffle
} from 'lucide-react';
import { mockMovies, mockAnime, mockBooks, mockSeries, indianMovies, indianAnime, indianBooks, indianSeries } from '@/data/mockData';
import { useIndiaMode } from '@/contexts/IndiaModeContext';

const RandomRecommendation = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['movie', 'anime', 'book', 'series']);
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { indiaMode } = useIndiaMode();

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const getRandomRecommendation = () => {
    if (selectedTypes.length === 0) {
      toast({
        title: "No content type selected",
        description: "Please select at least one content type",
        variant: "destructive",
      });
      return;
    }

    // Choose data source based on India Mode
    const movies = indiaMode ? indianMovies : mockMovies;
    const anime = indiaMode ? indianAnime : mockAnime;
    const books = indiaMode ? indianBooks : mockBooks;
    const series = indiaMode ? indianSeries : mockSeries;

    // Get combined array based on selected types
    let combinedArray: any[] = [];
    if (selectedTypes.includes('movie')) combinedArray = [...combinedArray, ...movies];
    if (selectedTypes.includes('anime')) combinedArray = [...combinedArray, ...anime];
    if (selectedTypes.includes('book')) combinedArray = [...combinedArray, ...books];
    if (selectedTypes.includes('series')) combinedArray = [...combinedArray, ...series];
    
    // Randomly select an item
    const randomIndex = Math.floor(Math.random() * combinedArray.length);
    const randomItem = combinedArray[randomIndex];
    
    setRecommendation(randomItem);
    
    toast({
      title: "Found something for you!",
      description: `How about: ${randomItem.title}`,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
        <h2 className="text-xl font-semibold mb-4">What are you in the mood for?</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox 
              checked={selectedTypes.includes('movie')} 
              onCheckedChange={() => handleTypeToggle('movie')}
            />
            <span className="flex items-center gap-1">
              <Film size={16} />
              <span>{indiaMode ? "Indian Movies" : "Movies"}</span>
            </span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox 
              checked={selectedTypes.includes('anime')} 
              onCheckedChange={() => handleTypeToggle('anime')}
            />
            <span className="flex items-center gap-1">
              <Tv size={16} />
              <span>{indiaMode ? "Anime (Hindi Dub)" : "Anime"}</span>
            </span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox 
              checked={selectedTypes.includes('book')} 
              onCheckedChange={() => handleTypeToggle('book')}
            />
            <span className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>{indiaMode ? "Indian Books" : "Books"}</span>
            </span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox 
              checked={selectedTypes.includes('series')} 
              onCheckedChange={() => handleTypeToggle('series')}
            />
            <span className="flex items-center gap-1">
              <MonitorPlay size={16} />
              <span>{indiaMode ? "Indian Web Series" : "Web Series"}</span>
            </span>
          </label>
        </div>
        
        <Button 
          onClick={getRandomRecommendation} 
          className="w-full flex items-center justify-center gap-2"
        >
          <Shuffle size={16} />
          <span>Get Random Recommendation</span>
        </Button>
      </div>
      
      {recommendation && (
        <div className="mt-8 bg-card rounded-lg p-6 shadow-sm border border-border/50">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <img 
                src={recommendation.coverImage} 
                alt={recommendation.title} 
                className="w-full h-auto rounded-md object-cover aspect-[2/3]"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">{recommendation.title}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {recommendation.genres.map((genre: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                    {genre}
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6">{recommendation.description}</p>
              <Button 
                onClick={() => {
                  let type = '';
                  if (mockMovies.some(m => m.id === recommendation.id)) type = 'movie';
                  else if (mockAnime.some(a => a.id === recommendation.id)) type = 'anime';
                  else if (mockBooks.some(b => b.id === recommendation.id)) type = 'book';
                  else if (mockSeries.some(s => s.id === recommendation.id)) type = 'series';
                  
                  navigate(`/${type}/${recommendation.id}`);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomRecommendation;
