import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Ban, AlertTriangle, Gavel } from 'lucide-react';

const violations = [
  {
    title: 'Fabrication, falsification, and plagiarism',
    items: [
      'Inventing or altering data, results, or records.',
      'Misrepresenting methods, findings, or contributions.',
      'Using others’ work or words without appropriate acknowledgement.',
    ],
  },
  {
    title: 'Breaches of duty of care',
    items: [
      'Proceeding without required ethics approval or outside an approved protocol.',
      'Failing to obtain or document informed consent where required.',
      'Mishandling confidential, cultural, or sensitive information.',
    ],
  },
  {
    title: 'Authorship and peer review',
    items: [
      'Gift or ghost authorship; denying deserved credit.',
      'Exploiting confidential information from peer review or funding processes.',
    ],
  },
];

const MisconductSection = () => {
  return (
    <section className="py-16 md:py-20 bg-university-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mb-12 md:mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1 w-10 bg-university-gold rounded-full" />
            <span className="text-university-blue text-sm font-semibold uppercase tracking-widest">
              Standards
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-university-dark-gray mb-6">
            Research misconduct
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            SINU expects honest, rigorous, and accountable research. Allegations of misconduct are
            taken seriously, assessed fairly, and managed in line with institutional policy and
            natural justice.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {violations.map(({ title, items }) => (
            <Card
              key={title}
              className="border border-gray-200/80 shadow-sm bg-white border-l-4 border-l-university-gold"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Ban className="w-5 h-5 text-university-dark-gray" aria-hidden />
                  <h3 className="text-base font-semibold text-university-dark-gray">{title}</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 leading-relaxed list-disc pl-4">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-6 md:p-8 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
          <div className="w-12 h-12 rounded-full bg-university-gold/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-university-dark-gray" aria-hidden />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-university-dark-gray mb-2 flex items-center gap-2">
              <Gavel className="w-5 h-5 text-university-blue" aria-hidden />
              Reporting and outcomes
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Concerns can be raised confidentially with the Research Ethics Office or Research
              Integrity Committee. Substantiated misconduct may lead to corrective action, withdrawal
              of approvals, or other measures under University regulations. Retaliation against
              anyone raising a concern in good faith is not tolerated.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MisconductSection;
