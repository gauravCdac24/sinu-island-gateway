import React from "react";
import { Link } from "react-router-dom";
import { Library, Laptop, Users2, CalendarDays, ExternalLink } from "lucide-react";

type ResourceItem = {
  icon: typeof Library;
  title: string;
  description: string;
  cta: string;
} & ({ to: string; external?: false } | { href: string; external: true });

const AcademicResourcesSection = () => {
  const resources: ResourceItem[] = [
    {
      icon: Library,
      title: "Library & research help",
      description:
        "Borrow print and online collections, get help with searching and referencing, and use quiet study spaces on campus.",
      cta: "Open library services",
      to: "/library-services",
    },
    {
      icon: Laptop,
      title: "Online learning (Moodle)",
      description:
        "Access course materials, submit tasks, and join learning activities. Use your SINU credentials provided at enrolment.",
      cta: "Go to Moodle",
      href: "https://elearn.sinu.edu.sb/login/index.php",
      external: true,
    },
    {
      icon: Users2,
      title: "Clubs & peer networks",
      description:
        "Connect with other students through clubs and activities—great for friendship, skills, and informal peer support.",
      cta: "Explore campus life",
      to: "/student-clubs",
    },
    {
      icon: CalendarDays,
      title: "Dates & events",
      description:
        "Stay across trimester dates, exams, and what’s happening on campus so you don’t miss deadlines or opportunities.",
      cta: "View campus events",
      to: "/campus-events",
    },
  ];

  return (
    <section
      id="student-resources"
      aria-labelledby="student-resources-heading"
      className="border-t border-slate-200/80 bg-gradient-to-b from-slate-50 to-white py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#219ebc]">Tools & places</p>
          <h2
            id="student-resources-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-[#082952] sm:text-4xl"
          >
            Resources you’ll use every week
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Bookmark these—they’re the fastest way to study, submit work, and stay organised.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <article
              key={resource.title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffb703]/20 text-[#082952]">
                <resource.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-[#082952]">{resource.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{resource.description}</p>
              {"to" in resource ? (
                <Link
                  to={resource.to}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#219ebc] underline-offset-4 hover:underline"
                >
                  {resource.cta}
                  <span aria-hidden>→</span>
                </Link>
              ) : (
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#219ebc] underline-offset-4 hover:underline"
                >
                  {resource.cta}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcademicResourcesSection;
