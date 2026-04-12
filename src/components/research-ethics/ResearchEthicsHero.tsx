import React from 'react';

const ResearchEthicsHero = () => {
  return (
    <section className="relative bg-university-dark-gray text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1532094349884-543559c0c6e1?w=1600')",
        }}
      />
      <div className="absolute inset-0 bg-university-dark-gray/80" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4 mt-20">
            <span className="h-1 w-10 bg-university-gold rounded-full" />
            <span className="text-university-gold text-sm font-semibold uppercase tracking-widest">
              Research
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Research Ethics
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            SINU is committed to the highest standards of research integrity.
            Our ethics framework ensures all research involving human
            participants, animals, and sensitive data is conducted responsibly
            and ethically.
          </p>
        </div>
      </div>
      {/* Gold bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-university-gold" />
    </section>
  );
};

export default ResearchEthicsHero;