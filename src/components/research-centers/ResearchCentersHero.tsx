import React from 'react';

const ResearchImpactHero = () => {
  return (
    <section className="relative bg-university-dark-gray text-white overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600')" }}
      />
      {/* Decorative circle */}
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-university-blue/20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl  md:py-32">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1 w-10 bg-university-gold rounded-full" />
            <span className="text-university-gold text-sm font-semibold uppercase tracking-widest">
              Research at SINU
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Driving Impact Across the Pacific
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Explore how Solomon Islands National University's research programmes
            are creating real-world change — from climate resilience and marine
            conservation to gender equity and community development.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden">
          {[
            { value: '18', label: 'Active Projects' },
            { value: '7', label: 'Impact Projects' },
            { value: '7', label: 'Engagement Projects' },
            { value: '4', label: 'Discovery Projects' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-university-dark-gray px-6 py-5 text-center">
              <span className="block text-3xl font-bold text-university-gold">{value}</span>
              <span className="block text-xs text-gray-400 uppercase tracking-widest mt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-university-gold" />
    </section>
  );
};

export default ResearchImpactHero;
