import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/common/BackToTop';
import PoliciesHero from '@/components/policies/PoliciesHero';
import PoliciesTab from '@/components/policies/PoliciesTab';
import PoliciesHome from '@/components/policies/PoliciesHome';
import PoliciesSearch from '@/components/policies/PoliciesSearch';

const Policies = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow w-full">
        <div className="flex flex-col">
          <PoliciesHero />
          <PoliciesTab />
          <PoliciesHome />
          <PoliciesSearch />
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Policies;
