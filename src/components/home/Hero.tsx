import React from 'react';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/common/OptimizedImage';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroProps {
  /** Smaller overlay card for the home page (used from Index). */
  compact?: boolean;
}

const Hero: React.FC<HeroProps> = ({ compact = false }) => {
  const [scrolled, setScrolled] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const maxPush = 200;
  const imagePush = Math.min(scrolled, maxPush);

  const imageSrc = '/lovable-uploads/DSC05873.jpg';
  const imageAlt = 'SINU campus and Solomon Islands coastline at dusk';

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-university-dark-gray',
        compact
          ? 'h-[82vh] min-h-[440px] sm:h-[86vh] md:h-[92vh]'
          : 'h-[86vh] min-h-[480px] sm:h-[88vh] md:h-[95vh] lg:h-[100vh]'
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${imagePush}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <OptimizedImage
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover object-center"
          objectFit="cover"
          priority
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/15" />
      </div>

      <div
        className={cn(
          'absolute z-10 flex px-4',
          compact
            ? 'inset-x-0 bottom-28 justify-center sm:bottom-24 sm:justify-start sm:pl-6 md:bottom-24 md:pl-10 lg:pl-12'
            : 'inset-x-0 bottom-24 justify-center px-4 sm:bottom-20 sm:justify-start sm:pl-6 md:pl-10 lg:pl-14'
        )}
      >
        <div
          className={cn(
            'rounded-2xl border border-white/25 bg-[#22a2bf]/50 shadow-2xl backdrop-blur-md',
            compact
              ? 'w-full max-w-[min(100%,20rem)] p-4 sm:max-w-[22rem] sm:p-5 md:max-w-sm'
              : 'w-full max-w-lg border border-white/20 bg-white/95 p-5 sm:max-w-xl md:max-w-2xl md:p-8 lg:max-w-2xl'
          )}
        >
          {compact ? (
            <>
              <h2 className="mb-1 text-lg font-bold leading-snug text-[#222] sm:text-xl md:text-2xl">
                New student? Apply now!
              </h2>
              <p className="mb-4 text-xs leading-snug text-[#222]/90 sm:text-sm">
                Undergraduate or postgraduate — start here.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  size="sm"
                  className="h-9 w-full bg-[#ffb703] text-sm font-bold text-[#082952] hover:bg-[#d7a12c] sm:w-auto sm:px-4"
                  asChild
                >
                  <Link to="/apply">Apply</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 w-full border-2 border-[#082952] bg-white text-sm font-bold text-[#082952] hover:bg-[#082952] hover:text-white sm:w-auto sm:px-4"
                  asChild
                >
                  <Link to="/undergraduate-study">Undergraduate</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 w-full border-[#082952]/50 text-sm font-semibold text-[#082952] hover:bg-white/80 sm:w-auto sm:px-3"
                  asChild
                >
                  <Link to="/postgraduate-study">Postgraduate</Link>
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-white/20 pt-3 text-xs font-semibold">
                <Link to="/course-finder" className="inline-flex items-center gap-1 text-[#082952] hover:underline">
                  <Search className="h-3.5 w-3.5" aria-hidden />
                  Find a programme
                </Link>
                <Link
                  to="/admission-requirements"
                  className="inline-flex items-center gap-1 text-[#082952] hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  Entry requirements
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-university-light-blue/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-university-dark-gray">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                Start your journey
              </p>
              <h1 className="mb-3 text-2xl font-bold leading-tight text-university-dark-gray sm:text-3xl md:text-4xl lg:text-5xl">
                Study at Solomon Islands National University
              </h1>
              <p className="mb-6 text-sm leading-relaxed text-gray-700 sm:text-base md:text-lg">
                Choose your level, explore programmes, and get the support you need—from application to
                graduation.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  size="lg"
                  className="h-12 w-full bg-university-gold font-bold text-university-dark-gray hover:bg-university-gold/90 sm:w-auto sm:px-6"
                  asChild
                >
                  <Link to="/apply">Apply now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-2 border-university-dark-gray bg-white font-bold text-university-dark-gray hover:bg-university-dark-gray hover:text-white sm:w-auto sm:px-6"
                  asChild
                >
                  <Link to="/undergraduate-study">Undergraduate</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-university-blue/40 font-semibold text-university-blue hover:bg-university-blue/10 sm:w-auto sm:px-5"
                  asChild
                >
                  <Link to="/postgraduate-study">Postgraduate</Link>
                </Button>
              </div>
              <div className="mt-5 flex flex-col gap-2 border-t border-gray-200 pt-5 sm:flex-row sm:flex-wrap sm:gap-3">
                <Link
                  to="/course-finder"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-university-blue hover:text-university-dark-gray sm:justify-start"
                >
                  <Search className="h-4 w-4 shrink-0" aria-hidden />
                  Find a programme
                </Link>
                <span className="hidden text-gray-300 sm:inline" aria-hidden>
                  |
                </span>
                <Link
                  to="/admission-requirements"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-university-blue hover:text-university-dark-gray sm:justify-start"
                >
                  <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                  Entry requirements
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-university-gold py-2.5 sm:py-3">
        <div className="animate-scroll whitespace-nowrap">
          <p className="inline-block px-4 text-xs font-semibold text-university-dark-gray sm:px-6 sm:text-sm md:text-base">
            Semester intakes and key dates — check the academic calendar and apply before deadlines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
