
import { GraduationCap, Globe, Users, FileCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const AdmissionHero = () => {
  return (
    <section className="bg-[#082952] py-16 relative overflow-hidden">
      {/* World Map Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mt-20 md:mt-40 mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            International Students 
          </h1>
          <p className="text-lg md:text-xl text-[#fff] mb-8 leading-relaxed" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Join our diverse international community at SINU. Discover the admission requirements and application process for international students seeking undergraduate and postgraduate study opportunities.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 py-8">
                <Button className="bg-blue-600 hover:bg-[#082952] text-white px-8 py-3" asChild>
                  <Link to="/apply">Apply Now</Link>
                </Button>
                <Button className="bg-white text-[#082952] hover:bg-[#082952] hover:text-white border-0 px-8 py-3 transition-all duration-300">
                  Browse Programs
                </Button>
              </div>
              
      </div>
    </section>
  );
};

export default AdmissionHero;
