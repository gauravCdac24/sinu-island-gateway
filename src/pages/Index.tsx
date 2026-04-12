import React from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import FeaturedPrograms from '@/components/home/FeaturedPrograms';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/common/BackToTop';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import MissonVision from '@/components/home/MissionVission';
import StudyWithUs from '@/components/home/StudyWithUs';
import StudentServices from '@/components/home/StudentServices';
import OurStories from '@/components/home/OurStories';
import NewsAndEvents from '@/components/home/NewsAndEvents';
import DFL from '@/components/home/DFL';
import QuickLinks from '@/components/home/QuickLinks';

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-university-light-gray/50">
      {/* Light decorative watermark — valid CSS url (was broken: string without url()) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: "url('/lovable-uploads/DSC05719.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '100% 100%',
          backgroundSize: 'min(45vw, 520px)',
        }}
        aria-hidden
      />

      <Header />

      <div className="relative z-10">
        <Hero compact />
      </div>

      <main className="relative z-10 flex-grow w-full">
        <ErrorBoundary>
          <MissonVision />
        </ErrorBoundary>
        <ErrorBoundary>
          <StudyWithUs />
        </ErrorBoundary>
        <ErrorBoundary>
          <StudentServices />
        </ErrorBoundary>
        <ErrorBoundary>
          <FeaturedPrograms />
        </ErrorBoundary>
        <ErrorBoundary>
          <QuickLinks />
        </ErrorBoundary>
        <ErrorBoundary>
          <DFL />
        </ErrorBoundary>
        <ErrorBoundary>
          <OurStories />
        </ErrorBoundary>
        <ErrorBoundary>
          <NewsAndEvents />
        </ErrorBoundary>
      </main>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
      <BackToTop />
    </div>
  );
};

export default Index;
