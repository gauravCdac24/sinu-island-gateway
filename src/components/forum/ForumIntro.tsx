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
    title: "Explore themes",
    text: "Review nine SINUSA forum areas covering learning, wellbeing, facilities, and governance.",
    icon: BookOpen,
  },
  {
    step: "02",
    title: "Sign in & ask",
    text: "Authenticated students can submit a clear, respectful question linked to a category.",
    icon: FileCheck,
  },
  {
    step: "03",
    title: "Management review",
    text: "Your question is routed to the relevant office for consideration and response.",
    icon: GraduationCap,
  },
  {
    step: "04",
    title: "Published answers",
    text: "Selected Q&A may be published for the benefit of the wider student community.",
    icon: Users,
  },
];

const SUPPORT = [
  {
    title: "Respectful dialogue",
    text: "Constructive questions focused on improving policy, services, and student experience.",
    icon: Headphones,
  },
  {
    title: "Student partnership",
    text: "SINUSA and university management collaborate through structured forum categories.",
    icon: MapPin,
  },
  {
    title: "Campus-wide benefit",
    text: "Published responses help all students understand decisions and next steps.",
    icon: Users,
  },
];

const ForumIntro = () => {
  return (
    <div className="bg-[#f4f7fb]">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="flex flex-col md:flex-row">
            <div className="w-2 shrink-0 bg-[#ffb703] md:w-3" aria-hidden />
            <CardContent className="flex-1 py-8 md:py-10 px-6 md:px-10">
              <p className="text-gray-800 leading-relaxed text-base md:text-lg">
                The Student–Management Forum is your channel to raise issues, seek clarity, and
                engage with university leadership in an open, structured way — modelled on student
                consultation practices used at leading Australian universities.
              </p>
              <p className="mt-6 font-semibold text-[#082952] text-lg">
                Browse SINUSA forum themes, read published management responses, and submit your
                own question when signed in to the student portal.
              </p>
            </CardContent>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 md:pb-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#082952] md:text-3xl">How the forum works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            A simple, transparent process — from question to published answer — so every student
            understands how their voice is heard.
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
                src="/lovable-uploads/bb44fb80-3e75-4c83-8246-f60f42997ac3.png"
                alt="Students in discussion at SINU"
                className="absolute inset-0 h-full w-full object-cover"
                width={800}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#082952]/80 to-transparent md:bg-gradient-to-t md:from-[#082952]/90 md:to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#8ecae6]">
                  Student voice
                </p>
                <p className="mt-2 text-xl font-bold leading-snug">
                  Your questions help shape a university that listens, responds, and improves.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-10">
              <h2 className="text-2xl font-bold text-[#082952]">Partnership in practice</h2>
              <p className="mt-4 leading-relaxed text-gray-700">
                Australian universities increasingly use student forums and consultation panels to
                strengthen governance and campus life. At SINU, the Vice-Chancellor Student Forum
                brings together SINUSA representatives and management to address real student
                concerns with accountability and follow-up.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb703]" />
                  Nine structured theme areas aligned with SINUSA priorities
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb703]" />
                  Official suggested questions plus space for your own
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb703]" />
                  Published answers visible to the whole student community
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="bg-[#082952] hover:bg-[#0d4080]">
                  <a href="#ask-question">Submit a question</a>
                </Button>
                <Button asChild variant="outline" className="border-[#082952] text-[#082952]">
                  <Link to="/student-login">Student sign in</Link>
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

export default ForumIntro;
