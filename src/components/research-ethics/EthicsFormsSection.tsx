import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileDown, FileEdit, FileClock, FileQuestion } from 'lucide-react';

const forms = [
  {
    icon: FileDown,
    title: 'New ethics application',
    description:
      'Standard application for human, animal, or biosafety review. Submit before recruitment or experimental work begins.',
    href: '#ethics-application',
    action: 'Application pack',
  },
  {
    icon: FileEdit,
    title: 'Amendment or extension',
    description:
      'Request changes to an approved protocol, personnel, instruments, or sites, or apply to extend an approval period.',
    href: '#ethics-amendment',
    action: 'Amendment form',
  },
  {
    icon: FileClock,
    title: 'Progress & completion',
    description:
      'Annual or milestone reports, study closure, and final statements for archived projects.',
    href: '#ethics-reporting',
    action: 'Reporting templates',
  },
  {
    icon: FileQuestion,
    title: 'Low-risk / exempt checklist',
    description:
      'Where policy allows, a shortened pathway for teaching evaluations or genuinely low-risk secondary data use.',
    href: '#ethics-checklist',
    action: 'Eligibility checklist',
  },
];

const EthicsFormsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white" id="ethics-forms">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mb-12 md:mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1 w-10 bg-university-gold rounded-full" />
            <span className="text-university-blue text-sm font-semibold uppercase tracking-widest">
              Documents
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-university-dark-gray mb-6">
            Forms and templates
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Use the correct form for your review pathway. Final versions and submission instructions
            are issued by the Research Ethics Office; anchor links below are placeholders until your
            intranet or document library URLs are wired in.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {forms.map(({ icon: Icon, title, description, href, action }) => (
            <Card
              key={title}
              className="border border-gray-200/80 shadow-sm hover:shadow-md hover:border-university-blue/25 transition-all bg-university-light-gray/40"
            >
              <CardContent className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-university-blue/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-university-blue" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-university-dark-gray mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                  </div>
                </div>
                <a
                  href={href}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-university-blue hover:text-university-dark-gray transition-colors"
                >
                  <FileDown className="w-4 h-4" aria-hidden />
                  {action}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EthicsFormsSection;
