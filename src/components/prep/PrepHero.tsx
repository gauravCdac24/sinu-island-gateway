
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';

const PrepHero = () => {
  return (
    <section className="bg-[#edf4ff] relative overflow-hidden">
      {/* Background Image Container with Responsive Aspect Ratios */}
      <div className="relative w-full">
        {/* Desktop: 16:9 aspect ratio */}
        <div className="hidden lg:block aspect-video w-full">
          <OptimizedImage
            src="/lovable-uploads/3f6b006d-a695-4295-8a23-6c4049ec7033.png"
            alt="Students studying preparatory courses"
            className="w-full h-full object-cover"
            objectFit="cover"
          />
        </div>
        
        {/* Tablet: 4:3 aspect ratio */}
        <div className="hidden md:block lg:hidden aspect-[4/3] w-full">
          <OptimizedImage
            src="/lovable-uploads/3f6b006d-a695-4295-8a23-6c4049ec7033.png"
            alt="Students studying preparatory courses"
            className="w-full h-full object-cover"
            objectFit="cover"
          />
        </div>
        
        {/* Mobile: 9:16 aspect ratio - centered on person's face */}
        <div className="block md:hidden aspect-[9/16] w-full">
          <OptimizedImage
            src="/lovable-uploads/3f6b006d-a695-4295-8a23-6c4049ec7033.png"
            alt="Students studying preparatory courses"
            className="w-full h-full object-cover object-[center_30%]"
            objectFit="cover"
          />
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-[#ffb703] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-10 w-10 text-[#082952]" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                University Preparatory Courses
              </h1>
              
              <p className="text-xl text-white mb-8 max-w-3xl mx-auto" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                Build the skills and confidence you need to succeed at university. Our preparatory programs 
                provide a pathway to undergraduate study for students who don't meet direct entry requirements.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-[#219ebc] hover:bg-[#219ebc]/90 text-white px-8 py-3 text-lg" asChild>
                  <Link to="/apply" className="inline-flex items-center">
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button className="bg-white text-[#082952] hover:bg-[#082952] hover:text-white px-8 py-3 text-lg transition-colors">
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrepHero;
