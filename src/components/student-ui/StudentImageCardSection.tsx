import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "@/components/common/OptimizedImage";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export type StudentImageCardItem = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  href?: string;
  /** Optional label when href is set */
  linkLabel?: string;
};

type StudentImageCardSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cards: StudentImageCardItem[];
  className?: string;
  columns?: 2 | 3;
};

/**
 * Image-on-top cards (student-friendly, matches Undergraduate programme cards tone).
 */
const StudentImageCardSection: React.FC<StudentImageCardSectionProps> = ({
  id,
  eyebrow,
  title,
  subtitle,
  cards,
  className,
  columns = 3,
}) => {
  const grid =
    columns === 2
      ? "grid grid-cols-1 gap-8 md:grid-cols-2"
      : "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section id={id} className={cn("bg-slate-50 py-16 md:py-20", className)}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
          {eyebrow ? (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#219ebc]">{eyebrow}</p>
          ) : null}
          <h2 className="text-3xl font-bold text-[#082952] md:text-4xl">{title}</h2>
          {subtitle ? <p className="mt-4 text-lg leading-relaxed text-slate-600">{subtitle}</p> : null}
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#ffb703]" aria-hidden />
        </div>

        <ul className={cn(grid, "list-none")}>
          {cards.map((card, i) => (
            <li key={`${card.title}-${i}`}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-[#8ecae6] hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <OptimizedImage
                    src={card.imageSrc}
                    alt={card.imageAlt ?? card.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#082952]/50 to-transparent opacity-80" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-[#082952]">{card.title}</h3>
                  <p className="mt-3 flex-1 text-slate-600 leading-relaxed">{card.description}</p>
                  {card.href ? (
                    <Link
                      to={card.href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#219ebc] hover:text-[#082952]"
                    >
                      {card.linkLabel ?? "Learn more"}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StudentImageCardSection;
