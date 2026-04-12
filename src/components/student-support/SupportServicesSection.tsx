import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, FileText, Calculator, Globe, ArrowRight } from "lucide-react";

const SupportServicesSection = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "Academic advising",
      description:
        "Plan your degree, understand prerequisites, and choose courses that keep you on track—whether you’re in first year or preparing to graduate.",
      bullets: ["Degree planning", "Course selection", "Program rules", "Pathways & careers"],
      cta: { label: "See entry & admission info", to: "/admission-requirements" },
    },
    {
      icon: FileText,
      title: "Writing & study skills",
      description:
        "Build confidence in academic writing, referencing, and study habits. Ask about workshops and one-to-one help through the library and learning teams.",
      bullets: ["Essays & reports", "Research & reading", "Time management", "Exam preparation"],
      cta: { label: "Library & learning support", to: "/library-services" },
    },
    {
      icon: Calculator,
      title: "Maths, stats & science help",
      description:
        "Extra help when concepts get tough—drop-in sessions, tutorials, and peer-supported study spaces (availability varies by campus and trimester).",
      bullets: ["Foundation maths", "Statistics", "Lab sciences", "Revision sessions"],
      cta: { label: "Contact SAS below", href: "#contact-sas" },
    },
    {
      icon: Globe,
      title: "International students",
      description:
        "Practical guidance on visas, orientation, and settling into study in Solomon Islands—so you can focus on your classes, not paperwork alone.",
      bullets: ["Orientation", "Visa & compliance pointers", "Cultural transition", "Academic integration"],
      cta: { label: "International student hub", to: "/international-student-support" },
    },
  ];

  return (
    <section
      id="support-services"
      aria-labelledby="support-services-heading"
      className="border-t border-slate-200/80 bg-white py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#219ebc]">For students</p>
          <h2
            id="support-services-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-[#082952] sm:text-4xl"
          >
            How we help you succeed
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Pick the area that matches what you need today—each card links to the next practical step
            on the website or to the SAS contact section at the bottom of this page.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              className="group flex flex-col rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg md:p-8"
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#219ebc]/15 text-[#082952] ring-1 ring-[#219ebc]/20">
                  <service.icon className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#082952]">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
                </div>
              </div>
              <ul className="mb-6 flex flex-wrap gap-2">
                {service.bullets.map((b) => (
                  <li
                    key={b}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#082952] ring-1 ring-slate-200"
                  >
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-2">
                <Button
                  asChild
                  className="w-full bg-[#082952] text-white hover:bg-[#082952]/90 sm:w-auto"
                >
                  {"to" in service.cta ? (
                    <Link to={service.cta.to} className="inline-flex items-center gap-2">
                      {service.cta.label}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  ) : (
                    <a href={service.cta.href} className="inline-flex items-center gap-2">
                      {service.cta.label}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                  )}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportServicesSection;
