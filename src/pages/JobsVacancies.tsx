import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import JobsHero from "@/components/jobs/JobsHero";
import JobsContent from "@/components/jobs/JobsContent";

const JobsVacancies = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-university-light-gray/50">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: "url('/lovable-uploads/DSC05719.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "100% 100%",
          backgroundSize: "min(45vw, 520px)",
        }}
        aria-hidden
      />

      <Header />

      <div className="relative z-10">
        <ErrorBoundary>
          <JobsHero />
        </ErrorBoundary>
      </div>

      <main className="relative z-10 flex-grow w-full">
        <ErrorBoundary>
          <JobsContent />
        </ErrorBoundary>
      </main>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
      <BackToTop />
    </div>
  );
};

export default JobsVacancies;
