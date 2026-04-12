import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOurStories, urlFor } from '../../../sanity/lib/sanity';
import { Link } from 'react-router-dom';

const OurStories: React.FC = () => {
  const [ourstories, setOurStories] = useState<any[]>([]);

  const getImageSrc = (image: { sanityImage?: any; imageUrl?: string }) => {
    if (image?.sanityImage) return urlFor(image.sanityImage).url();
    if (image?.imageUrl) return image.imageUrl;
    return '';
  };

  useEffect(() => {
    getOurStories().then(setOurStories);
  }, []);

  const StoryLink: React.FC<{ href?: string; children: React.ReactNode }> = ({ href, children }) => {
    if (!href || href === '#') {
      return <span className="text-gray-400">{children}</span>;
    }
    if (href.startsWith('http')) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-semibold text-university-blue hover:text-university-dark-gray"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        to={href}
        className="inline-flex items-center font-semibold text-university-blue hover:text-university-dark-gray"
      >
        {children}
      </Link>
    );
  };

  return (
    <section className="bg-white py-12 md:py-20" aria-labelledby="stories-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 text-center sm:mb-12 md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-university-blue">
              Voices
            </span>
            <h2 id="stories-heading" className="mt-2 text-3xl font-bold text-university-dark-gray sm:text-4xl">
              Our stories
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600 md:mx-0 md:text-base">
              Students and graduates making an impact in the Pacific and beyond.
            </p>
          </div>
          <Button variant="outline" className="mx-auto border-university-blue md:mx-0" asChild>
            <Link to="/campus-events" className="inline-flex items-center gap-2">
              More campus news
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {ourstories.map((program, index) => (
            <article
              key={index}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={getImageSrc(program.image)}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-university-dark-gray">{program.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {program.description}
                </p>
                <div className="mt-4">
                  <StoryLink href={program.link}>
                    Read story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </StoryLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurStories;
