import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "@/components/common/OptimizedImage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileCheck,
  GraduationCap,
  Headphones,
  MapPin,
  Users,
} from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Choose your programme",
    text: "Use the course finder or catalogue to shortlist up to three programmes in priority order.",
    icon: BookOpen,
  },
  {
    step: "02",
    title: "Prepare your documents",
    text: "Transcripts, photo ID, statement of purpose, and English language evidence where required.",
    icon: FileCheck,
  },
  {
    step: "03",
    title: "Complete the online form",
    text: "Work through each step at your own pace. You can review everything before you submit.",
    icon: GraduationCap,
  },
  {
    step: "04",
    title: "Track your application",
    text: "After submission, sign in to the student portal for updates from the admissions team.",
    icon: Users,
  },
];

const SUPPORT = [
  {
    title: "Admissions advice",
    text: "Guidance on entry requirements, pathways, and programme fit for Solomon Islands and international applicants.",
    icon: Headphones,
  },
  {
    title: "Campus life",
    text: "Study at Honiara and regional centres with dual-sector higher education and TVET options.",
    icon: MapPin,
  },
  {
    title: "Student community",
    text: "Join a growing national university community with clubs, support services, and student voice forums.",
    icon: Users,
  },
];

const ApplyIntro = () => {
  return (
    <div className="bg-[#f4f7fb]">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="flex flex-col md:flex-row">
            <div className="w-2 shrink-0 bg-[#ffb703] md:w-3" aria-hidden />
            <CardContent className="flex-1 py-8 md:py-10 px-6 md:px-10">
              <p className="text-gray-800 leading-relaxed text-base md:text-lg">
                Welcome to online applications at Solomon Islands National University. Whether you
                are a school leaver, a mature-age student, or transferring from another institution,
                this portal guides you through a structured application — similar to leading
                Australian universities — with clear document requirements and step-by-step progress.
              </p>
              <p className="mt-6 font-semibold text-[#082952] text-lg">
                Have your documents ready, take your time on each step, and submit when you are
                confident your application is complete.
              </p>
            </CardContent>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 md:pb-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#082952] md:text-3xl">Your application journey</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Inspired by leading Australian university practice — clear steps, transparent requirements,
            and support at every stage of your application.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.step} className="border border-gray-100 bg-white shadow-sm">
                <CardContent className="pt-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#219ebc]">
                    Step {s.step}
                  </span>
                  <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#082952]/10 text-[#082952]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-semibold text-[#082952]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 md:pb-16">
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[280px] md:min-h-full">
              <OptimizedImage
                src="/lovable-uploads/1763956138152.jpg"
                alt="Students collaborating on campus"
                className="absolute inset-0 h-full w-full object-cover"
                width={800}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#082952]/80 to-transparent md:bg-gradient-to-t md:from-[#082952]/90 md:to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#8ecae6]">
                  National university
                </p>
                <p className="mt-2 text-xl font-bold leading-snug">
                  A place to grow academically, professionally, and as part of our Pacific community.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-10">
              <h2 className="text-2xl font-bold text-[#082952]">Why study at SINU?</h2>
              <p className="mt-4 leading-relaxed text-gray-700">
                Solomon Islands National University is the country&apos;s dual-sector university,
                offering higher education and TVET across multiple campuses and distance pathways.
                Our admissions process is designed to be fair, clear, and supportive — whether you
                are applying from Honiara, the provinces, or overseas.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb703]" />
                  Recognised programmes aligned with national workforce and development priorities
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb703]" />
                  Scholarships and support services for eligible students
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb703]" />
                  Vibrant campus culture with student leadership and forums
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="bg-[#082952] hover:bg-[#0d4080]">
                  <Link to="/undergraduate-study">Undergraduate study</Link>
                </Button>
                <Button asChild variant="outline" className="border-[#082952] text-[#082952]">
                  <Link to="/postgraduate-study">Postgraduate study</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {SUPPORT.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-0 bg-[#082952] text-white shadow-lg">
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 text-[#ffb703]" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">{item.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ApplyIntro;
