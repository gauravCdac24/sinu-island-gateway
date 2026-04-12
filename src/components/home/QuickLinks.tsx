import React from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const quickLinks = [
  {
    title: 'Find a programme',
    subtitle: 'Search by name, faculty, or level',
    link: '/course-finder',
    image: '/lovable-uploads/DSC05873.jpg',
  },
  {
    title: 'Research',
    subtitle: 'Impact, engagement, and discovery projects',
    link: '/research-impact',
    image:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Library & learning',
    subtitle: 'Spaces, collections, and study help',
    link: '/library-services',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Student support',
    subtitle: 'Academic skills and advice',
    link: '/student-academic-support',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Campus life',
    subtitle: 'Clubs, culture, and events',
    link: '/student-clubs',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Policies & forms',
    subtitle: 'Official documents in one place',
    link: '/policies-procedures',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&auto=format&fit=crop',
  },
];

const QuickLinks = () => {
  return (
    <ErrorBoundary>
      <section className="py-12 md:py-20" aria-labelledby="quick-links-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center md:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-university-blue">
              Get started
            </span>
            <h2
              id="quick-links-heading"
              className="mt-2 text-3xl font-bold text-university-dark-gray sm:text-4xl"
            >
              Popular next steps
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              Tap a tile—each opens a detailed page so you can plan your study journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {quickLinks.map((item) => (
              <ErrorBoundary key={item.link}>
                <Link
                  to={item.link}
                  className="group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-2xl border border-gray-200/80 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-university-blue sm:min-h-[220px]"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
                  <div className="relative z-10 flex flex-col gap-1 p-5 text-white sm:p-6">
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      Go
                      <ArrowUpRight className="h-3 w-3" aria-hidden />
                    </span>
                    <h3 className="text-lg font-bold leading-tight sm:text-xl">{item.title}</h3>
                    <p className="text-sm text-white/90">{item.subtitle}</p>
                  </div>
                </Link>
              </ErrorBoundary>
            ))}
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default QuickLinks;
