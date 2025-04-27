
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroProps {
  title: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
}

const Hero: React.FC<HeroProps> = ({ title, description, image, link, buttonText }) => {
  return (
    <div className="relative overflow-hidden h-[500px] md:h-[600px] w-full">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20"></div>
      </div>
      
      {/* Content */}
      <div className="container relative h-full flex flex-col justify-end pb-16 md:pb-20">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 heading-gradient">{title}</h1>
          <p className="text-lg mb-6 text-foreground/80">{description}</p>
          <Link to={link}>
            <Button size="lg" className="bg-primary hover:bg-primary/90">{buttonText}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
