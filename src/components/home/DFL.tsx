import React from 'react';
import { ArrowRight, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DFL: React.FC = () => {
  return (
    <section
      className="relative isolate min-h-[320px] w-full overflow-hidden sm:min-h-[380px] md:min-h-[440px]"
      aria-labelledby="dfl-heading"
    >
      <img
        src="/lovable-uploads/ad9248e2-c248-4963-9342-2a48dcf11ed8.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25 md:from-black/75 md:via-black/40" />

      <div className="relative z-10 mx-auto flex h-full min-h-[320px] max-w-7xl flex-col justify-end px-4 py-10 sm:min-h-[380px] sm:px-6 md:min-h-[440px] md:justify-center md:py-16 lg:px-8">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-university-gold/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-university-dark-gray">
            <MonitorPlay className="h-3.5 w-3.5" aria-hidden />
            Study anywhere
          </span>
          <h2
            id="dfl-heading"
            className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl"
          >
            Distance &amp; flexible learning
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/90 sm:text-lg">
            Balance work, family, and study with online-friendly options and support from the Centre
            for Distance &amp; Flexible Learning.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              size="lg"
              className="h-12 bg-university-gold font-bold text-university-dark-gray hover:bg-university-gold/90"
              asChild
            >
              <Link to="/distance-flexible-learning" className="inline-flex items-center gap-2">
                Explore DFL options
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/70 bg-white/10 font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              asChild
            >
              <Link to="/course-finder">Browse programmes</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DFL;
