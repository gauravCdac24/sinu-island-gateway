import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "@/components/common/OptimizedImage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Globe2,
  Handshake,
  Leaf,
  MapPin,
  Waves,
} from "lucide-react";

const PILLARS = [
  {
    step: "01",
    title: "Climate & oceans",
    text: "Adaptation science, marine conservation, and blue-economy research for Pacific livelihoods.",
    icon: Waves,
  },
  {
    step: "02",
    title: "Sustainable islands",
    text: "Food security, renewable energy, and resilient infrastructure aligned with SDGs.",
    icon: Leaf,
  },
  {
    step: "03",
    title: "Culture & knowledge",
    text: "Indigenous and local knowledge integrated with contemporary research methods.",
    icon: BookOpen,
  },
  {
    step: "04",
    title: "Policy & governance",
    text: "Evidence for regional policy, youth leadership, and inclusive island governance.",
    icon: Globe2,
  },
];

const OFFERINGS = [
  {
    title: "Joint research",
    text: "Co-designed projects with Australian and Pacific universities, NGOs, and government.",
    icon: Handshake,
  },
  {
    title: "Field schools",
    text: "Immersive study tours linking students with communities and environmental monitoring.",
    icon: MapPin,
  },
  {
    title: "Policy briefs",
    text: "Accessible outputs for ministers, councils, and regional forums such as the PIF.",
    icon: BookOpen,
  },
];

const IslandsFutureIntro = () => {
  return (
    <div className="bg-[#f4f7fb]">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="flex flex-col md:flex-row">
            <div className="w-2 shrink-0 bg-[#ffb703] md:w-3" aria-hidden />
            <CardContent className="flex-1 py-8 md:py-10 px-6 md:px-10">
              <p className="text-gray-800 leading-relaxed text-base md:text-lg">
                The <strong>Centre for Islands Future</strong> at SINU connects Pacific scholarship
                with international partners to tackle climate risk, ocean health, sustainable
                development, and cultural resilience — in the tradition of leading Australian
                university research institutes focused on the Indo-Pacific.
              </p>
              <p className="mt-6 font-semibold text-[#082952] text-lg">
                Explore our pillars, partnership pathways, and linked research centres across the
                Collaboration menu.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-[#082952] hover:bg-[#0d4080]">
                  <Link to="/research-partnerships">Research partnerships</Link>
                </Button>
                <Button asChild variant="outline" className="border-[#082952] text-[#082952]">
                  <Link to="/global-research-collaborations">Global collaborations</Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 md:pb-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#082952] md:text-3xl">Research pillars</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Four interconnected themes guide our work — connecting SINU faculties with regional
            priorities and international collaboration networks.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((s) => {
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
                src="/lovable-uploads/DSC05719.jpg"
                alt="Pacific islands research and community at SINU"
                className="absolute inset-0 h-full w-full object-cover"
                width={800}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#082952]/80 to-transparent md:bg-gradient-to-t md:from-[#082952]/90 md:to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#8ecae6]">
                  Islands future
                </p>
                <p className="mt-2 text-xl font-bold leading-snug">
                  Research that respects place, strengthens communities, and informs policy.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-10">
              <h2 className="text-2xl font-bold text-[#082952]">Partner with the centre</h2>
              <p className="mt-4 leading-relaxed text-gray-700">
                We work with Australian universities, Pacific regional bodies, and Solomon Islands
                ministries on co-funded research, student exchanges, and community-based monitoring.
                Proposals are reviewed for ethical conduct, local benefit, and alignment with SINU
                research strategy.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb703]" />
                  Memoranda of understanding with international institutions
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb703]" />
                  HDR supervision and early-career researcher mentoring
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb703]" />
                  Public seminars and policy roundtables in Honiara and provinces
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="bg-[#082952] hover:bg-[#0d4080]">
                  <Link to="/indigenous-knowledge">Indigenous knowledge</Link>
                </Button>
                <Button asChild variant="outline" className="border-[#082952] text-[#082952]">
                  <Link to="/sustainable-development">Sustainable development</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {OFFERINGS.map((item) => {
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

export default IslandsFutureIntro;
