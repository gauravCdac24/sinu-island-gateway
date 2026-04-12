import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, Scale, BookMarked } from 'lucide-react';

const pillars = [
  {
    icon: Shield,
    title: 'Integrity & safety',
    description:
      'Research is designed and conducted to protect participants, communities, and the reputation of the University.',
  },
  {
    icon: Users,
    title: 'Respect & fairness',
    description:
      'Informed consent, cultural sensitivity, and equitable inclusion guide how we engage people and partners.',
  },
  {
    icon: Scale,
    title: 'Compliance',
    description:
      'Projects follow applicable laws, institutional policy, and recognised ethical standards before work begins.',
  },
  {
    icon: BookMarked,
    title: 'Transparency',
    description:
      'Clear documentation, responsible data handling, and honest reporting underpin trustworthy scholarship.',
  },
];

const ResearchEthicsOverview = () => {
  return (
    <section className="py-16 md:py-20 bg-university-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mb-12 md:mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1 w-10 bg-university-gold rounded-full" />
            <span className="text-university-blue text-sm font-semibold uppercase tracking-widest">
              Overview
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-university-dark-gray mb-6">
            Ethics at Solomon Islands National University
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            SINU&apos;s research ethics framework supports staff, students, and affiliates who
            undertake research across the University. It applies to studies involving human
            participants, personal or sensitive data, animals (where relevant), and other work
            that requires ethical clearance or institutional oversight.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            The aim is simple: research should be safe, respectful, and methodologically sound.
            Researchers are expected to plan for ethics early, seek approval when required, and
            maintain high standards of conduct throughout the project lifecycle.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pillars.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="border border-gray-200/80 shadow-sm hover:shadow-md hover:border-university-blue/25 transition-all bg-white"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-university-light-blue/40 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-university-dark-gray" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-university-dark-gray mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm border-l-4 border-l-university-gold">
          <h3 className="text-xl font-semibold text-university-dark-gray mb-3">
            Before you start
          </h3>
          <p className="text-gray-700 leading-relaxed">
            If your project needs ethical review, contact the relevant office early and allow time
            for assessment. The sections below outline types of research, misconduct expectations,
            training, publication ethics, forms, and how to get help.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResearchEthicsOverview;
