import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OptimizedImage from '@/components/common/OptimizedImage';

const types = [
  {
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop',
    imageAlt: 'Researchers collaborating around a table',
    title: 'Human participants',
    body:
      'Interviews, surveys, focus groups, observation, intervention studies, and community-based research where people are involved directly or indirectly.',
    note: 'Typically requires Human Research Ethics Committee (HREC) review before recruitment begins.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop',
    imageAlt: 'Charts and data on a laptop screen',
    title: 'Secondary data & records',
    body:
      'Use of administrative datasets, student or health records, registries, or other identifiable information originally collected for non-research purposes.',
    note: 'Ethical and legal safeguards for privacy, consent, and data sharing still apply.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1544735711-ea742f1756c5?w=800&q=80&auto=format&fit=crop',
    imageAlt: 'Wildlife in a natural habitat',
    title: 'Animal-based research',
    body:
      'Any study involving animals for teaching or research, including field work that may affect animal welfare.',
    note: 'Animal Ethics Committee (AEC) approval is required where applicable.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80&auto=format&fit=crop',
    imageAlt: 'Laboratory workspace with equipment',
    title: 'Biosafety & hazardous materials',
    body:
      'Work with biological agents, genetically modified organisms, or materials that pose biosafety or biosecurity risks.',
    note: 'May require Biosafety Committee clearance in addition to other approvals.',
  },
];

const ResearchTypesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mb-12 md:mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1 w-10 bg-university-gold rounded-full" />
            <span className="text-university-blue text-sm font-semibold uppercase tracking-widest">
              Scope
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-university-dark-gray mb-6">
            Types of research covered
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Different kinds of research trigger different review pathways. If you are unsure whether
            your project needs ethics clearance, contact the Research Ethics Office for advice before
            you collect data or begin fieldwork.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {types.map(({ image, imageAlt, title, body, note }) => (
            <Card
              key={title}
              className="border border-gray-200/80 shadow-sm hover:shadow-md hover:border-university-blue/25 transition-all overflow-hidden group"
            >
              <div className="relative h-48 md:h-52 overflow-hidden">
                <OptimizedImage
                  src={image}
                  alt={imageAlt}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  objectFit="cover"
                  width={800}
                  height={416}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-university-dark-gray/70 via-university-dark-gray/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-sm">
                    {title}
                  </h3>
                </div>
              </div>
              <CardContent className="p-6 md:p-8">
                <p className="text-gray-700 leading-relaxed text-sm mb-3">{body}</p>
                <p className="text-sm text-university-blue font-medium leading-relaxed">{note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchTypesSection;
