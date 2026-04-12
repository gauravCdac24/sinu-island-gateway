import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/common/BackToTop';
import ResearchEthicsHero from '@/components/research-ethics/ResearchEthicsHero';
import ResearchEthicsOverview from '@/components/research-ethics/ResearchEthicsOverview';
import ResearchTypesSection from '@/components/research-ethics/ResearchTypesSection';
import MisconductSection from '@/components/research-ethics/MisconductSection';
import EthicsTrainingSection from '@/components/research-ethics/EthicsTrainingSection';
import PublicationEthicsSection from '@/components/research-ethics/PublicationEthicsSection';
import EthicsFormsSection from '@/components/research-ethics/EthicsFormsSection';
import EthicsContactSection from '@/components/research-ethics/EthicsContactSection';

const ResearchEthics = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ResearchEthicsHero />
        <ResearchEthicsOverview />
        <ResearchTypesSection />
        <MisconductSection />
        <EthicsTrainingSection />
        <PublicationEthicsSection />
        <EthicsFormsSection />
        <EthicsContactSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default ResearchEthics;