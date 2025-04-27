import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnhancedRecommendation from '@/components/EnhancedRecommendation';

const RandomPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-8 pb-16">
        <div className="container">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-4 heading-gradient">Break Your Boredom</h1>
            <p className="text-muted-foreground max-w-2xl">
              Find your next favorite movie, series, book, or anime with our personalized recommendation engine. 
              Select your preferences below and let us help you discover great content!
            </p>
          </div>
          
          <EnhancedRecommendation />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RandomPage;
