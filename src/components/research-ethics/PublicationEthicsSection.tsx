import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, Scale, Share2 } from 'lucide-react';

const topics = [
  {
    icon: Users,
    title: 'Authorship',
    body:
      'Authorship reflects substantial intellectual contribution. All authors should approve the final manuscript and meet discipline-relevant authorship criteria.',
  },
  {
    icon: Scale,
    title: 'Conflicts of interest',
    body:
      'Financial, personal, or institutional interests that could bias design, analysis, or reporting must be disclosed to editors, funders, and the University as required.',
  },
  {
    icon: FileText,
    title: 'Originality & duplication',
    body:
      'Avoid duplicate publication and “salami slicing.” Cite prior work clearly, including preprints and theses, and follow journal guidelines on overlapping submissions.',
  },
  {
    icon: Share2,
    title: 'Data & open science',
    body:
      'Plan for responsible data sharing in line with consent, Indigenous data governance, and funder or publisher policies. Where sharing is not possible, explain why.',
  },
];

const PublicationEthicsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-university-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mb-12 md:mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1 w-10 bg-university-gold rounded-full" />
            <span className="text-university-blue text-sm font-semibold uppercase tracking-widest">
              Dissemination
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-university-dark-gray mb-6">
            Publication ethics
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Publishing is part of the research lifecycle. Ethical publication practice protects
            participants, preserves trust in scholarship, and upholds SINU&apos;s reputation in
            the region and internationally.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {topics.map(({ icon: Icon, title, body }) => (
            <Card
              key={title}
              className="border border-gray-200/80 shadow-sm hover:shadow-md hover:border-university-blue/25 transition-all bg-white"
            >
              <CardContent className="p-6 md:p-8 flex gap-4">
                <div className="w-11 h-11 rounded-full bg-university-light-blue/40 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-university-dark-gray" aria-hidden />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-university-dark-gray mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-600 max-w-6xl">
          Researchers should follow the standards of bodies such as the Committee on Publication
          Ethics (COPE) and any discipline-specific codes. When in doubt, seek advice before
          submitting your manuscript.
        </p>
      </div>
    </section>
  );
};

export default PublicationEthicsSection;
