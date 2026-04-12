import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { gethome_studentservices, urlFor } from '../../../sanity/lib/sanity';
import { Link } from 'react-router-dom';
import { HeartHandshake, BookMarked, ArrowRight } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';

export default function StudentServices() {
  const [studentservices, setStudentServices] = useState<any[]>([]);

  const getImageSrc = (image: { sanityImage?: any; imageUrl?: string }) => {
    if (image?.sanityImage) return urlFor(image.sanityImage).url();
    if (image?.imageUrl) return image.imageUrl;
    return '';
  };

  useEffect(() => {
    gethome_studentservices().then(setStudentServices);
  }, []);

  return (
    <section className="bg-university-light-gray/60 py-12 md:py-16">
      {studentservices.map((program, index) => (
        <div key={index} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-university-blue">
                Here for you
              </span>
              <h2 className="text-3xl font-bold text-university-dark-gray sm:text-4xl">
                {program.title}
                <span className="mt-3 block h-1 w-16 rounded-full bg-university-gold" />
              </h2>
              <p className="text-justify text-base leading-relaxed text-gray-700 sm:text-lg">
                {program.description}
              </p>
              <ul className="space-y-2 text-sm text-gray-600 sm:text-base">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-university-blue" />
                  Academic advice, learning skills, and progression planning.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-university-blue" />
                  Wellbeing, counselling, and inclusion support.
                </li>
              </ul>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button className="h-11 bg-university-blue font-semibold hover:bg-university-dark-gray" asChild>
                  <Link to="/student-academic-support" className="inline-flex items-center gap-2">
                    <BookMarked className="h-4 w-4" aria-hidden />
                    Academic support
                  </Link>
                </Button>
                <Button variant="outline" className="h-11 border-university-blue font-semibold" asChild>
                  <Link to="/health-wellness" className="inline-flex items-center gap-2">
                    <HeartHandshake className="h-4 w-4" aria-hidden />
                    Health &amp; wellness
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[5/4]">
                <OptimizedImage
                  src={getImageSrc(program.image)}
                  alt={program.title || 'Student support at SINU'}
                  className="h-full w-full"
                  objectFit="cover"
                  width={900}
                  height={700}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
