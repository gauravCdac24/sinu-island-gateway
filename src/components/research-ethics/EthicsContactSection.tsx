import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Users,
  FileText,
  MessageCircle,
} from 'lucide-react';

const office = {
  title: 'Research Ethics Office',
  email: 'ethics@sinu.edu.sb',
  phone: '+677 30145',
  location: 'Research Building, Level 2, Room 205',
  hours: 'Monday – Friday: 8:00 AM – 5:00 PM',
};

const committees = [
  {
    name: 'Human Research Ethics Committee (HREC)',
    chair: 'Prof. Dr. Mary Taukila',
    email: 'hrec@sinu.edu.sb',
    secretary: 'Ms. Jane Maeluta',
    meetings: 'Second Tuesday of each month',
  },
  {
    name: 'Animal Ethics Committee (AEC)',
    chair: 'Dr. James Waigani',
    email: 'aec@sinu.edu.sb',
    secretary: 'Mr. David Qalo',
    meetings: 'First Thursday of each month',
  },
  {
    name: 'Biosafety Committee',
    chair: 'Dr. Sarah Kere',
    email: 'biosafety@sinu.edu.sb',
    secretary: 'Ms. Ruth Maetala',
    meetings: 'Third Wednesday of each month',
  },
  {
    name: 'Research Integrity Committee',
    chair: 'Prof. Dr. Peter Qalo',
    email: 'integrity@sinu.edu.sb',
    secretary: 'Dr. Grace Pollard',
    meetings: 'As required',
  },
];

const quickLinks = [
  {
    title: 'Ethics application',
    description: 'Guidance on submitting a new application.',
    action: 'mailto:ethics@sinu.edu.sb?subject=Ethics%20application',
    label: 'Email office',
    icon: FileText,
  },
  {
    title: 'Book a consultation',
    description: 'Discuss study design or consent before you apply.',
    action: 'mailto:ethics@sinu.edu.sb?subject=Ethics%20consultation',
    label: 'Request meeting',
    icon: Calendar,
  },
  {
    title: 'Training enquiries',
    description: 'Register interest in ethics workshops or refreshers.',
    action: 'mailto:ethics@sinu.edu.sb?subject=Ethics%20training',
    label: 'Contact training',
    icon: Users,
  },
  {
    title: 'Report a concern',
    description: 'Raise an integrity or ethics issue in confidence.',
    action: 'mailto:integrity@sinu.edu.sb?subject=Research%20ethics%20concern',
    label: 'Email integrity',
    icon: MessageCircle,
  },
];

const EthicsContactSection = () => {
  return (
    <section className="py-16 md:py-20 bg-university-dark-gray text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mb-12 md:mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1 w-10 bg-university-gold rounded-full" />
            <span className="text-university-gold text-sm font-semibold uppercase tracking-widest">
              Contact
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get support</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            The Research Ethics Office and standing committees are your first point of contact for
            applications, amendments, and advice on responsible research practice.
          </p>
        </div>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm mb-10">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">{office.title}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div className="w-10 h-10 rounded-full bg-university-gold/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-university-gold" aria-hidden />
                </div>
                <span className="text-xs uppercase tracking-wider text-gray-400">Email</span>
                <a
                  href={`mailto:${office.email}`}
                  className="text-sm text-white hover:text-university-gold transition-colors break-all"
                >
                  {office.email}
                </a>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div className="w-10 h-10 rounded-full bg-university-blue/30 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-university-light-blue" aria-hidden />
                </div>
                <span className="text-xs uppercase tracking-wider text-gray-400">Phone</span>
                <a
                  href={`tel:${office.phone.replace(/\s/g, '')}`}
                  className="text-sm text-white hover:text-university-gold transition-colors"
                >
                  {office.phone}
                </a>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div className="w-10 h-10 rounded-full bg-university-blue/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-university-light-blue" aria-hidden />
                </div>
                <span className="text-xs uppercase tracking-wider text-gray-400">Location</span>
                <p className="text-sm text-gray-300">{office.location}</p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div className="w-10 h-10 rounded-full bg-university-gold/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-university-gold" aria-hidden />
                </div>
                <span className="text-xs uppercase tracking-wider text-gray-400">Hours</span>
                <p className="text-sm text-gray-300">{office.hours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-xl font-semibold text-white text-center mb-8">Committee contacts</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {committees.map((c) => (
            <Card key={c.name} className="border border-white/10 bg-white text-university-dark-gray">
              <CardContent className="p-6">
                <h4 className="text-base font-bold text-university-dark-gray mb-4">{c.name}</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <Users className="w-4 h-4 text-university-blue flex-shrink-0 mt-0.5" aria-hidden />
                    <span>
                      <strong>Chair:</strong> {c.chair}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Mail className="w-4 h-4 text-university-blue flex-shrink-0 mt-0.5" aria-hidden />
                    <a href={`mailto:${c.email}`} className="text-university-blue hover:underline">
                      {c.email}
                    </a>
                  </li>
                  <li className="flex gap-2">
                    <Users className="w-4 h-4 text-university-blue flex-shrink-0 mt-0.5" aria-hidden />
                    <span>
                      <strong>Secretary:</strong> {c.secretary}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Calendar className="w-4 h-4 text-university-blue flex-shrink-0 mt-0.5" aria-hidden />
                    <span>
                      <strong>Meetings:</strong> {c.meetings}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-white text-center mb-8">Quick links</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {quickLinks.map(({ title, description, action, label, icon: Icon }) => (
            <Card
              key={title}
              className="border border-white/10 bg-white/95 text-university-dark-gray hover:bg-white transition-colors"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="w-11 h-11 rounded-full bg-university-light-blue/50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-university-dark-gray" aria-hidden />
                </div>
                <h4 className="font-semibold mb-2">{title}</h4>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>
                <Button asChild variant="default" className="w-full bg-university-blue hover:bg-university-dark-gray">
                  <a href={action}>{label}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-xl border border-university-gold/40 bg-university-dark-gray/80 p-6 md:p-8 text-center">
          <h3 className="text-lg font-semibold text-university-gold mb-2">Urgent concerns</h3>
          <p className="text-gray-300 text-sm mb-4">
            For serious ethics-related issues outside standard office hours, use the emergency
            contacts below.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <a
              href="tel:+67730199"
              className="inline-flex items-center gap-2 text-white hover:text-university-gold"
            >
              <Phone className="w-4 h-4" aria-hidden />
              Emergency: +677 30199
            </a>
            <span className="hidden sm:inline text-gray-500">|</span>
            <a
              href="mailto:urgent.ethics@sinu.edu.sb"
              className="inline-flex items-center gap-2 text-white hover:text-university-gold break-all"
            >
              <Mail className="w-4 h-4 flex-shrink-0" aria-hidden />
              urgent.ethics@sinu.edu.sb
            </a>
          </div>
        </div>
      </div>
      <div className="h-1 bg-university-gold mt-16" aria-hidden />
    </section>
  );
};

export default EthicsContactSection;
