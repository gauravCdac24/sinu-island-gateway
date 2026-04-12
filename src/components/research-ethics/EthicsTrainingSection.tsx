import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OptimizedImage from '@/components/common/OptimizedImage';

const modules = [
  {
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80&auto=format&fit=crop',
    imageAlt: 'Books on shelves in a library',
    title: 'Core principles',
    description:
      'Foundations of research integrity, consent, risk, confidentiality, and cultural respect in the Pacific context.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&auto=format&fit=crop',
    imageAlt: 'Person reviewing documents at a desk',
    title: 'Applications & protocols',
    description:
      'How to complete ethics forms, amend an approved study, and manage adverse events or protocol deviations.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80&auto=format&fit=crop',
    imageAlt: 'Graduates celebrating with caps',
    title: 'Supervisors & students',
    description:
      'Roles and responsibilities for HDR candidates, coursework research, and staff supervising field or community projects.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1544531586-ade2356a56cd?w=800&q=80&auto=format&fit=crop',
    imageAlt: 'People in a training or seminar setting',
    title: 'Refresher training',
    description:
      'Periodic updates on policy changes, data governance, and emerging issues in responsible conduct of research.',
  },
];

const EthicsTrainingSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mb-12 md:mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1 w-10 bg-university-gold rounded-full" />
            <span className="text-university-blue text-sm font-semibold uppercase tracking-widest">
              Training
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-university-dark-gray mb-6">
            Ethics education
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Training helps researchers understand their obligations and apply ethical thinking at
            every stage of a project—from design and consent through to storage, analysis, and
            dissemination.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Completion of specified training may be required before ethics applications are accepted
            or before data collection begins. Your faculty or school will confirm local requirements.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map(({ image, imageAlt, title, description }) => (
            <Card
              key={title}
              className="border border-gray-200/80 shadow-sm hover:shadow-md hover:border-university-blue/25 transition-all overflow-hidden group h-full flex flex-col"
            >
              <div className="relative h-44 sm:h-48 overflow-hidden flex-shrink-0">
                <OptimizedImage
                  src={image}
                  alt={imageAlt}
                  className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  objectFit="cover"
                  width={600}
                  height={320}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-university-dark-gray/70 via-university-dark-gray/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="text-base md:text-lg font-semibold text-white drop-shadow-sm leading-snug">
                    {title}
                  </h3>
                </div>
              </div>
              <CardContent className="p-5 md:p-6 flex-grow flex flex-col">
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-gray-200 bg-university-light-gray/80 p-6 md:p-8 text-center md:text-left">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-university-dark-gray">Need a tailored session?</strong> The
            Research Ethics Office can arrange briefings for faculties, research centres, or partner
            organisations. Use the contact section below to request a workshop or one-to-one
            consultation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EthicsTrainingSection;
