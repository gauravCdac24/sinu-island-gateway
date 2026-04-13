import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import OptimizedImage from "@/components/common/OptimizedImage";

export type HeroAction = {
  label: string;
  to: string;
  variant?: "primary" | "outline" | "ghost";
};

type StudentStudyHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** Full-bleed background image (same pattern as Undergraduate) */
  imageSrc: string;
  imageAlt?: string;
  titleId?: string;
  actions?: HeroAction[];
};

/**
 * Hero aligned with Undergraduate study pages: full-width image, navy gradient, gold primary CTA.
 */
const StudentStudyHero: React.FC<StudentStudyHeroProps> = ({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt = "",
  titleId = "student-hero-title",
  actions,
}) => {
  const defaultActions: HeroAction[] = actions ?? [
    { label: "Apply now", to: "/apply", variant: "primary" },
    { label: "Find a programme", to: "/course-finder", variant: "outline" },
    { label: "Entry requirements", to: "/admission-requirements", variant: "ghost" },
  ];

  return (
    <section
      className="relative isolate min-h-[min(72vh,720px)] overflow-hidden bg-[#082952]"
      aria-labelledby={titleId}
    >
      <div className="absolute inset-0" aria-hidden>
        <OptimizedImage
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
          objectFit="cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-[min(72vh,720px)] flex-col justify-end px-4 pb-10 pt-24 sm:px-8 md:px-12 md:pb-14 lg:px-16">
        <div className="mx-auto w-full max-w-3xl text-center md:mx-0 md:text-left">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#8ecae6]">{eyebrow}</p>
          <h1 id={titleId} className="text-4xl font-bold leading-tight text-white drop-shadow-md sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/95 md:text-lg">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {defaultActions.map((a, idx) => {
              if (a.variant === "outline") {
                return (
                  <Button
                    key={`${a.to}-${idx}`}
                    asChild
                    size="lg"
                    variant="outline"
                    className="min-h-[48px] border-2 border-white/90 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white hover:text-[#082952] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#082952]"
                  >
                    <Link to={a.to}>{a.label}</Link>
                  </Button>
                );
              }
              if (a.variant === "ghost") {
                return (
                  <Button
                    key={`${a.to}-${idx}`}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="min-h-[48px] text-white hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Link to={a.to}>{a.label}</Link>
                  </Button>
                );
              }
              return (
                <Button
                  key={`${a.to}-${idx}`}
                  asChild
                  size="lg"
                  className="min-h-[48px] bg-[#ffb703] px-8 text-base font-semibold text-[#082952] shadow-lg hover:bg-[#e5a500] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#082952]"
                >
                  <Link to={a.to}>{a.label}</Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentStudyHero;
