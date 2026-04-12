import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getstudywithus, urlFor } from '../../../sanity/lib/sanity';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MessageCircle } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';

export default function StudyWithUs() {
  const [studywithus, setStudyWithUs] = useState<any[]>([]);

  const getImageSrc = (image: { sanityImage?: any; imageUrl?: string }) => {
    if (image?.sanityImage) return urlFor(image.sanityImage).url();
    if (image?.imageUrl) return image.imageUrl;
    return '';
  };

  useEffect(() => {
    getstudywithus().then(setStudyWithUs);
  }, []);

  return (
    <section className="bg-white py-12 md:py-16">
      {studywithus
        .filter((program) => program.title === 'Study With Us')
        .map((program, index) => (
          <div key={index} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="order-2 overflow-hidden rounded-2xl border border-gray-200 shadow-xl lg:order-1">
                <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[5/4]">
                  <OptimizedImage
                    src={getImageSrc(program.image)}
                    alt={program.title || 'Students at SINU'}
                    className="h-full w-full"
                    objectFit="cover"
                    width={900}
                    height={700}
                  />
                </div>
              </div>

              <div className="order-1 space-y-5 lg:order-2 lg:pr-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-university-blue">
                    Your future
                  </span>
                  <h2 className="mt-2 text-3xl font-bold text-university-dark-gray sm:text-4xl">
                    {program.title}
                    <span className="mt-3 block h-1 w-16 rounded-full bg-university-gold" />
                  </h2>
                </div>
                <p className="text-justify text-base leading-relaxed text-gray-700 sm:text-lg">
                  {program.description}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    className="h-11 bg-university-blue font-semibold text-white hover:bg-university-dark-gray"
                    asChild
                  >
                    <Link to="/course-finder" className="inline-flex items-center gap-2">
                      <Compass className="h-4 w-4" aria-hidden />
                      Find a programme
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-11 border-university-blue font-semibold" asChild>
                    <Link to="/student-academic-support" className="inline-flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      Ask student support
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

      <div className="mt-12 border-t border-gray-100 bg-university-light-gray/80 md:mt-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-8 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <h3 className="text-xl font-bold text-university-dark-gray sm:text-2xl">
              Life on campus
            </h3>
            <p className="mt-1 max-w-xl text-sm text-gray-600 sm:text-base">
              Clubs, events, support services, and spaces where you will feel at home.
            </p>
          </div>
          <Button
            className="h-11 shrink-0 bg-university-gold font-bold text-university-dark-gray hover:bg-university-gold/90"
            asChild
          >
            <Link to="/student-clubs" className="inline-flex items-center gap-2">
              Explore student life
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
