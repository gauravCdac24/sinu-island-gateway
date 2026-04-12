import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';
import ErrorBoundary from '../common/ErrorBoundary';
import { getFeatureProgrammes, urlFor } from '../../../sanity/lib/sanity';
import { Link } from 'react-router-dom';

const FeaturedPrograms = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [featuredPrograms, setFeaturedPrograms] = useState<any[]>([]);

  const getImageSrc = (image: { sanityImage?: any; imageUrl?: string }) => {
    if (image?.sanityImage) return urlFor(image.sanityImage).url();
    if (image?.imageUrl) return image.imageUrl;
    return '';
  };

  useEffect(() => {
    getFeatureProgrammes().then(setFeaturedPrograms);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollStep = 1;
    const delay = 30;

    const interval = setInterval(() => {
      if (!isPaused && container) {
        if (direction === 'right') {
          container.scrollLeft += scrollStep;
          if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
            setDirection('left');
          }
        } else {
          container.scrollLeft -= scrollStep;
          if (container.scrollLeft <= 0) {
            setDirection('right');
          }
        }
      }
    }, delay);

    return () => clearInterval(interval);
  }, [isPaused, direction]);

  return (
    <ErrorBoundary>
      <section className="bg-white py-12 md:py-20" aria-labelledby="featured-programmes-heading">
        <div className="mx-auto mb-8 max-w-3xl px-4 text-center sm:px-6 md:mb-12 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-university-blue">
            Programmes
          </span>
          <h2
            id="featured-programmes-heading"
            className="mt-2 text-3xl font-bold text-university-dark-gray sm:text-4xl"
          >
            Featured areas of study
          </h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            A snapshot of what you can explore—use the course finder to search every qualification.
          </p>
          <Button variant="link" className="mt-2 h-auto p-0 text-university-blue" asChild>
            <Link to="/course-finder" className="inline-flex items-center gap-1 font-semibold">
              Open full course finder
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 pt-2 sm:gap-6 sm:px-6 md:px-8 lg:px-10 scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {featuredPrograms.map((program, index) => (
            <ErrorBoundary key={index}>
              <Card className="flex w-[min(85vw,280px)] shrink-0 flex-col overflow-hidden border-university-blue/25 shadow-md transition-shadow hover:shadow-lg sm:w-72 md:w-80">
                <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-52 md:h-56">
                  <OptimizedImage
                    src={getImageSrc(program.image)}
                    alt={program.title || 'Programme'}
                    className="h-full w-full object-cover"
                    width={480}
                    height={320}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <CardHeader className="flex-1 space-y-2 px-4 pb-2 pt-4">
                  <CardTitle className="text-center text-lg font-bold text-university-dark-gray sm:text-left">
                    {program.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-center text-sm text-gray-600 sm:text-left">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="px-4 pb-4 pt-0">
                  <Button
                    variant="outline"
                    className="h-10 w-full border-university-blue font-semibold text-university-blue hover:bg-university-blue hover:text-white"
                    asChild
                  >
                    <Link to="/course-finder" className="inline-flex items-center justify-center gap-2">
                      Explore programmes
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </ErrorBoundary>
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default FeaturedPrograms;
