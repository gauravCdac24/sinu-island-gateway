import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import exchangeHeroImage from '@/assets/exchange-program-hero.jpg';

const ExchangeHero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={exchangeHeroImage}
          alt="Students participating in exchange programs"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Global Exchange Programs
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md max-w-3xl mx-auto" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Experience world-class education and cultural immersion through our semester and year-long exchange programs with partner universities worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#ffb703] hover:bg-[#d7a12c] text-[#082952] font-semibold px-8 py-3"
              asChild
            >
              <Link to="/apply">Apply Now</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#082952] px-8 py-3"
            >
              Find Partner Universities
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExchangeHero;