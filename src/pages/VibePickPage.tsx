import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VibePickRecommendation from '@/components/VibePickRecommendation';

const VibePickPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-8 pb-16">
        <div className="container">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-4 heading-gradient">Find Your Perfect Vibe</h1>
            <p className="text-muted-foreground max-w-2xl">
              Tell us what you're in the mood for, and we'll curate personalized recommendations 
              from our vast collection of movies, series, books, and anime.
            </p>
          </div>
          
          <VibePickRecommendation />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VibePickPage;