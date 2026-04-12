import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getNews, getEvents, urlFor } from '../../../sanity/lib/sanity';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  return { day, month };
};

const ScrollableCardRow: React.FC<{ cards: any[] }> = ({ cards }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const delay = 30;
    const step = 1;

    const interval = setInterval(() => {
      if (!isPaused && el) {
        if (direction === 'right') {
          el.scrollLeft += step;
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
            setDirection('left');
          }
        } else {
          el.scrollLeft -= step;
          if (el.scrollLeft <= 0) {
            setDirection('right');
          }
        }
      }
    }, delay);

    return () => clearInterval(interval);
  }, [direction, isPaused]);

  const getImageSrc = (image: { sanityImage?: any; imageUrl?: string }) => {
    if (image?.sanityImage) return urlFor(image.sanityImage).url();
    if (image?.imageUrl) return image.imageUrl;
    return '';
  };

  const CardLink: React.FC<{ href?: string; children: React.ReactNode }> = ({ href, children }) => {
    if (!href || href === '#') return <>{children}</>;
    if (href.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="contents">
          {children}
        </a>
      );
    }
    return (
      <Link to={href} className="contents">
        {children}
      </Link>
    );
  };

  return (
    <div
      ref={scrollRef}
      className="-mx-4 flex max-w-full gap-4 overflow-x-auto scroll-smooth px-4 pb-2 pt-2 sm:gap-5 sm:px-6 md:px-8 scrollbar-hide"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {cards.map((card, index) => {
        const { day, month } = formatDate(card.date);

        return (
          <CardLink key={index} href={card.link}>
            <article className="flex w-[min(78vw,300px)] shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition hover:shadow-lg sm:w-[300px]">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={getImageSrc(card.image)}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="px-4 pt-4">
                <div className="inline-flex flex-col rounded-lg border border-university-blue/40 bg-university-light-blue/20 px-3 py-1.5 text-center">
                  <span className="text-lg font-bold leading-none text-university-blue">{day}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-university-dark-gray">
                    {month}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4 pt-2">
                <h3 className="text-base font-bold text-university-dark-gray">{card.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">{card.description}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-university-blue">
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </article>
          </CardLink>
        );
      })}
    </div>
  );
};

const NewsEventsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    getNews().then(setNews);
    getEvents().then(setEvents);
  }, []);

  return (
    <section className="bg-university-light-gray/70 py-12 md:py-20" aria-label="News and events">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-university-blue">
              Stay in the loop
            </span>
            <h2 className="mt-2 text-3xl font-bold text-university-dark-gray sm:text-4xl">
              News &amp; events
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-600 sm:text-base">
              Deadlines, celebrations, and what is happening on campus.
            </p>
          </div>
          <Button variant="outline" className="border-university-blue shrink-0" asChild>
            <Link to="/campus-events" className="inline-flex items-center gap-2">
              Full events listing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mb-6 flex justify-center gap-2 sm:justify-start">
          {(['news', 'events'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeTab === tab
                  ? 'bg-university-dark-gray text-white shadow-md'
                  : 'bg-white text-university-dark-gray ring-1 ring-gray-200 hover:ring-university-blue/40'
              }`}
            >
              {tab === 'news' ? 'News' : 'Events'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'news' ? <ScrollableCardRow cards={news} /> : <ScrollableCardRow cards={events} />}
    </section>
  );
};

export default NewsEventsSection;
