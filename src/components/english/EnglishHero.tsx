
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GraduationCap, Globe, BookOpen } from 'lucide-react';

const EnglishHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#219ebc] to-[#8ecae6] text-white py-20 overflow-hidden">
      {/* Background Image with Dark Blue Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80&auto=format&fit=crop)',
        }}
      >
        
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#ffb703] p-4 rounded-full">
              <Globe className="h-12 w-12 text-[#082952]" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            English Language Programs
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-[#edf4ff]">
            Develop your English language skills and prepare for academic success at SINU
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="bg-[#ffb703] text-[#082952] hover:bg-[#d7a12c] px-8 py-3 text-lg" asChild>
              <Link to="/apply">Apply Now</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#219ebc] px-8 py-3 text-lg">
              Download Brochure
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <GraduationCap className="h-8 w-8 mx-auto mb-3 text-[#ffb703]" />
              <h3 className="text-lg font-semibold mb-2">Academic Preparation</h3>
              <p className="text-[#edf4ff]">Prepare for university study with academic English skills</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <BookOpen className="h-8 w-8 mx-auto mb-3 text-[#ffb703]" />
              <h3 className="text-lg font-semibold mb-2">Flexible Learning</h3>
              <p className="text-[#edf4ff]">Choose from full-time or part-time study options</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Globe className="h-8 w-8 mx-auto mb-3 text-[#ffb703]" />
              <h3 className="text-lg font-semibold mb-2">Cultural Integration</h3>
              <p className="text-[#edf4ff]">Learn English while experiencing Solomon Islands culture</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnglishHero;
