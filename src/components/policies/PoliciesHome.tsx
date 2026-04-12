import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getstudywithus, urlFor } from '../../../sanity/lib/sanity';
import OptimizedImage from '@/components/common/OptimizedImage';
import { Link } from 'react-router-dom';

export default function PoliciesHome() {
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
    <section id="policies-home" className="bg-white border-b border-gray-100">
      {studywithus
        .filter((program) => program.title === 'Study With Us in Policies Pages')
        .map((program, index) => (
          <div
            key={index}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20"
          >
            <div className="flex flex-col lg:flex-row items-stretch gap-10 lg:gap-14">
              <Card className="flex-1 border border-gray-200 shadow-md overflow-hidden lg:max-w-xl">
                <CardContent className="p-6 sm:p-8 md:p-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-1 w-10 bg-university-gold rounded-full" />
                    <span className="text-university-blue text-sm font-semibold uppercase tracking-widest">
                      About
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-university-dark-gray mb-4">
                    SINU policies
                    <span className="block h-1 w-16 bg-university-blue mt-3 rounded-full" />
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-justify text-sm sm:text-base">
                    {program.description}
                  </p>
                  <Button
                    className="mt-8 bg-university-blue hover:bg-university-dark-gray text-white"
                    type="button"
                    onClick={() =>
                      document
                        .getElementById('policies-search')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Go to policy library
                  </Button>
                </CardContent>
              </Card>

              <div className="flex-1 min-h-[280px] lg:min-h-[360px] rounded-xl overflow-hidden shadow-lg border border-gray-200/80">
                <OptimizedImage
                  src={getImageSrc(program.image)}
                  alt={program.title || 'SINU campus and community'}
                  className="w-full h-full min-h-[280px] lg:min-h-[360px]"
                  objectFit="cover"
                  width={900}
                  height={600}
                />
              </div>
            </div>
          </div>
        ))}

      <div className="bg-university-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Questions about a policy?
            </h2>
            <p className="text-white/85 text-sm md:text-base mt-2 max-w-xl">
              Contact the relevant faculty or corporate office, or reach out through our main
              enquiry channels.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-university-gold hover:bg-university-gold/90 text-university-dark-gray font-semibold shrink-0"
            asChild
          >
            <Link to="/undergraduate-study">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
