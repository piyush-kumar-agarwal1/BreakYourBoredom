import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MediaItem } from '@/types/media';
import { useIndiaMode } from '@/contexts/IndiaModeContext';

interface MediaCardProps {
  item: MediaItem;
  type: 'movie' | 'anime' | 'book' | 'series' | 'mixed';
}

// If you're displaying the media type label anywhere
const getTypeLabel = (type) => {
  switch(type) {
    case 'movie': return 'Movie';
    case 'series': return 'Web Series'; // Changed from "TV Series"
    case 'book': return 'Book';
    case 'anime': return 'Anime';
    default: return type;
  }
};

const MediaCard: React.FC<MediaCardProps> = ({ item, type }) => {
  const { indiaMode } = useIndiaMode();
  
  // Handle missing data
  if (!item) {
    return <div className="media-card animate-pulse bg-muted h-[300px]"></div>;
  }

  // Safely truncate description with null checks
  const truncatedDescription = item.description 
    ? item.description.slice(0, 100) + (item.description.length > 100 ? '...' : '') 
    : 'No description available';

  return (
    <Link to={`/detail/${item.type || type}/${item.id}`} className="media-card group block">
      <div className="relative overflow-hidden rounded-md">
        <img 
          src={item.coverImage || '/placeholder.svg'} 
          alt={item.title || 'Media item'} 
          className="w-full h-auto aspect-[2/3] object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="h-3 w-3 text-yellow-500" />
          <span className="text-xs font-medium">
            {typeof item.rating === 'number' ? item.rating.toFixed(1) : '0.0'}
          </span>
        </div>
        
        {/* Show India badge when in India mode and the item is marked as Indian content */}
        {indiaMode && item.india && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            <Flag className="h-3 w-3 mr-1" />
            Indian
          </Badge>
        )}

        {/* Show streaming platform badge for series */}
        {item.type === 'series' && item.streamingPlatform && (
          <Badge variant="outline" className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm">
            {item.streamingPlatform}
          </Badge>
        )}

        {/* Show watch provider badge for all content types */}
        {(item.watchProviders || item.streamingPlatform) && (
          <Badge 
            variant="outline" 
            className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm"
          >
            {item.watchProviders || item.streamingPlatform}
          </Badge>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{item.title || 'Untitled'}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{truncatedDescription}</p>
      </div>
    </Link>
  );
};

export default MediaCard;
