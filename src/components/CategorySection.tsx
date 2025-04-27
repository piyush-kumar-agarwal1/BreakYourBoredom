import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MediaGrid from './MediaGrid';
import { MediaItem } from '@/types/media';

interface CategorySectionProps {
  title: string;
  description: string;
  items: MediaItem[];
  type: 'movie' | 'series' | 'book' | 'anime' | 'mixed';
  linkTo: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  description,
  items,
  type,
  linkTo
}) => {
  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        </div>
        <Link to={linkTo}>
          <Button variant="outline">See All</Button>
        </Link>
      </div>
      
      {items && items.length > 0 ? (
        <MediaGrid items={items} type={type} columns={5} />
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          No items to display. Check back later!
        </div>
      )}
    </section>
  );
};

export default CategorySection;
