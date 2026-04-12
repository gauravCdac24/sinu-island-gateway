import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import OptimizedImage from "@/components/common/OptimizedImage";

const DistanceHero = () => {
  const scrollToCenters = () => {
    document.getElementById("find-center")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative isolate min-h-[min(88vh,820px)] overflow-hidden bg-[#082952]"
      aria-labelledby="dfl-hero-title"
    >
      <div className="absolute inset-0" aria-hidden>
        <OptimizedImage
          src="/lovable-uploads/f8426703-80a1-4c9e-9221-91ae920e4fe2.jpg"
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
            Distance & flexible learning
          </p>
          <h1
            id="dfl-hero-title"
            className="text-4xl font-bold leading-tight text-white drop-shadow-md sm:text-5xl"
          >
            Study where you are, with support close to home
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/95 md:text-lg">
            Flexible delivery and learning centres across the Solomon Islands help you balance study
            with work and family. Apply online, browse programmes, or find a centre near you.
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
              type="button"
              size="lg"
              variant="outline"
              onClick={scrollToCenters}
              className="min-h-[48px] border-2 border-white/90 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white hover:text-[#082952] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#082952]"
            >
              Learning centres
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistanceHero;
