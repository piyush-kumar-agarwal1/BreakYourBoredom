import React from 'react';
import MediaCard from './MediaCard';
import { MediaItem } from '@/types/media';

interface MediaGridProps {
  items: MediaItem[];
  type: 'movie' | 'anime' | 'book' | 'series' | 'mixed';
  columns?: number | {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const MediaGrid: React.FC<MediaGridProps> = ({ items, type, columns = 4 }) => {
  // Determine grid columns based on the columns prop
  const getGridClasses = () => {
    if (typeof columns === 'number') {
      // Ensure we have proper class names for all standard column counts
      const columnClass = columns >= 1 && columns <= 12 ? `lg:grid-cols-${columns}` : 'lg:grid-cols-4';
      
      // Make sure 4 columns appear on medium-large screens
      return `grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ${columnClass} xl:grid-cols-${columns}`;
    }
    
    // Handle responsive column object with better defaults
    return `grid-cols-${columns.default} 
            ${columns.sm ? `sm:grid-cols-${columns.sm}` : 'sm:grid-cols-2'} 
            ${columns.md ? `md:grid-cols-${columns.md}` : 'md:grid-cols-3'} 
            ${columns.lg ? `lg:grid-cols-${columns.lg}` : 'lg:grid-cols-4'} 
            ${columns.xl ? `xl:grid-cols-${columns.xl}` : 'xl:grid-cols-5'}`;
  };

  return (
    <div className={`grid ${getGridClasses()} gap-4 md:gap-6`}>
      {items.map((item) => (
        <MediaCard key={`${item.type}-${item.id}`} item={item} type={type} />
      ))}
    </div>
  );
};

export default MediaGrid;