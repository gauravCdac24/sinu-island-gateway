import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";
import ResearchOverview from "@/components/research-centers/ResearchOverview";

const ResearchImpact = () => {
  return (
    <div className="flex min-h-screen flex-col bg-university-light-gray">
      <Header />
      <main id="main-content" className="flex-1">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-widest text-university-blue">
              Research at SINU
            </p>
            <h1 className="mt-2 text-3xl font-bold text-university-dark-gray sm:text-4xl">
              Research impact
            </h1>
            <p className="mt-3 max-w-3xl text-base text-gray-600">
              Explore projects by impact area and faculty—covering policy, community engagement, and
              discovery across Solomon Islands and the Pacific.
            </p>
          </div>
        </header>
        <ResearchOverview />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default ResearchImpact;
