import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import OptimizedImage from "@/components/common/OptimizedImage";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import StudentSupportSecondaryNav from "@/components/student-support/StudentSupportSecondaryNav";

const StudentSupportHero = () => {
  return (
    <>
      <section
        className="relative isolate min-h-[min(88vh,820px)] overflow-hidden bg-[#082952]"
        aria-labelledby="sas-hero-title"
      >
        <div className="absolute inset-0" aria-hidden>
          <OptimizedImage
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=2000&q=80&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover"
            objectFit="cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex min-h-[min(88vh,820px)] flex-col justify-end px-4 pb-10 pt-24 sm:px-8 md:px-12 md:pb-14 lg:px-16">
          <div className="mx-auto w-full max-w-3xl text-center md:mx-0 md:text-left">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#8ecae6]">
              Student Academic Services (SAS)
            </p>
            <h1
              id="sas-hero-title"
              className="text-4xl font-bold leading-tight text-white drop-shadow-md sm:text-5xl"
            >
              We’re here so you can focus on learning
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/95 md:text-lg">
              From course planning and study skills to wellbeing and campus life—get clear help in one
              place. Start online, drop in on campus, or reach the team when you need it.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
              Advising & study skills · Peer & learning support · Wellbeing & campus life
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                asChild
                size="lg"
                className="min-h-[48px] bg-[#ffb703] px-8 text-base font-semibold text-[#082952] shadow-lg hover:bg-[#e5a500] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#082952]"
              >
                <Link to="/apply">Apply now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-h-[48px] border-2 border-white/90 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white hover:text-[#082952] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#082952]"
              >
                <Link to="/course-finder">Find a programme</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="min-h-[48px] text-white hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white"
              >
                <Link to="/student-login">Student portal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <StudyLevelQuickActions className="border-t border-slate-200/90 bg-gradient-to-b from-slate-50/90 to-white shadow-none" />

        <StudentSupportSecondaryNav className="border-b border-t border-slate-200 bg-slate-50/50" />
      </div>
    </>
  );
};

export default StudentSupportHero;
