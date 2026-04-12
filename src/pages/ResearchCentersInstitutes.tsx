import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/common/BackToTop';
import ResearchCentersHero from '@/components/research-centers/ResearchCentersHero';
import ResearchOverview from '@/components/research-centers/ResearchOverview';
import ResearchInstitutes from '@/components/research-centers/ResearchInstitutes';
import ResearchCenters from '@/components/research-centers/ResearchCenters';
import ResearchThemes from '@/components/research-centers/ResearchThemes';
import ResearchCategoryTabs from '@/components/research-centers/ResearchCategoryTab';

const ResearchCentersInstitutes = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ResearchCentersHero />
        <ResearchCategoryTabs />
        <ResearchOverview />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default ResearchCentersInstitutes;