import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import IslandsFutureHero from "@/components/islands-future/IslandsFutureHero";
import IslandsFutureIntro from "@/components/islands-future/IslandsFutureIntro";

const CentreForIslandsFuture = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-university-light-gray/50">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: "url('/lovable-uploads/1763956138152.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "100% 100%",
          backgroundSize: "min(45vw, 520px)",
        }}
        aria-hidden
      />

      <Header />

      <div className="relative z-10">
        <ErrorBoundary>
          <IslandsFutureHero />
        </ErrorBoundary>
      </div>

      <main id="islands-future-content" className="relative z-10 flex-grow w-full">
        <ErrorBoundary>
          <IslandsFutureIntro />
        </ErrorBoundary>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default CentreForIslandsFuture;
