import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const ContactSupportSection = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call SAS",
      detail: "+677 12345678",
      hint: "Monday–Friday, 8:00 am–5:00 pm",
      href: "tel:+67712345678",
    },
    {
      icon: Mail,
      title: "Email",
      detail: "support@sinu.edu.sb",
      hint: "We aim to reply within 1–2 business days",
      href: "mailto:support@sinu.edu.sb",
    },
    {
      icon: MapPin,
      title: "Visit",
      detail: "Student Academic Services, main campus",
      hint: "Bring your student ID for faster service",
      href: null as string | null,
    },
    {
      icon: Clock,
      title: "After hours",
      detail: "Use email for non-urgent queries",
      hint: "Emergencies: follow local emergency numbers",
      href: "mailto:support@sinu.edu.sb",
    },
  ];

  return (
    <section
      id="contact-sas"
      aria-labelledby="contact-sas-heading"
      className="border-t border-slate-200/80 bg-gradient-to-b from-[#f0f7fb] to-white py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#219ebc]">Contact</p>
          <h2
            id="contact-sas-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-[#082952] sm:text-4xl"
          >
            Talk to Student Academic Services
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Not sure where to start? Reach out with your question—we’ll point you to the right desk,
            workshop, or online resource.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method) => (
            <div
              key={method.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#082952] text-white">
                <method.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{method.title}</h3>
              {method.href ? (
                <a
                  href={method.href}
                  className="mt-2 block break-words text-lg font-semibold text-[#082952] underline-offset-2 hover:underline"
                >
                  {method.detail}
                </a>
              ) : (
                <p className="mt-2 text-lg font-semibold text-[#082952]">{method.detail}</p>
              )}
              <p className="mt-2 text-sm text-slate-600">{method.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-[#082952]">
                <MessageCircle className="h-5 w-5 text-[#219ebc]" aria-hidden />
                <h3 className="text-xl font-bold">Common next steps</h3>
              </div>
              <p className="mt-2 text-slate-600">
                Use these shortcuts when you already know the type of help you need.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/admission-requirements"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#082952] px-5 text-sm font-semibold text-white transition hover:bg-[#082952]/90"
              >
                Entry & admission
              </Link>
              <Link
                to="/ict-services"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-[#219ebc] bg-white px-5 text-sm font-semibold text-[#082952] transition hover:bg-[#f0f7fb]"
              >
                IT & accounts
              </Link>
              <Link
                to="/policies-procedures"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-[#082952] transition hover:bg-slate-100"
              >
                Policies & forms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupportSection;
