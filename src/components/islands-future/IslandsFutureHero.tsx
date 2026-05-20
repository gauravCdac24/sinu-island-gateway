import React from "react";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/common/OptimizedImage";
import { Link } from "react-router-dom";
import { Globe2, Handshake, BookOpen, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const scrollToContent = () => {
  document.getElementById("islands-future-content")?.scrollIntoView({ behavior: "smooth" });
};

const IslandsFutureHero = () => {
  const [scrolled, setScrolled] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const maxPush = 200;
  const imagePush = Math.min(scrolled, maxPush);

  return (
    <div className="relative overflow-hidden bg-university-dark-gray h-[82vh] min-h-[440px] sm:h-[86vh] md:h-[92vh]">
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${imagePush}px)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        <OptimizedImage
          src="/lovable-uploads/1763956138152.jpg"
          alt="Pacific islands — Centre for Islands Future at SINU"
          className="h-full w-full object-cover object-center"
          objectFit="cover"
          priority
          width={1920}
          height={1080}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/15" />
      </div>

      <div
        className={cn(
          "absolute z-10 flex px-4",
          "inset-x-0 bottom-28 justify-center sm:bottom-24 sm:justify-start sm:pl-6 md:bottom-24 md:pl-10 lg:pl-12"
        )}
      >
        <div
          className={cn(
            "rounded-2xl border border-white/25 bg-[#22a2bf]/50 shadow-2xl backdrop-blur-md",
            "w-full max-w-[min(100%,22rem)] p-4 sm:max-w-md sm:p-5 md:max-w-lg"
          )}
        >
          <p className="mb-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#082952]">
            <Globe2 className="h-3.5 w-3.5" aria-hidden />
            Collaboration
          </p>
          <h1 className="mb-2 text-xl font-bold leading-snug text-[#082952] sm:text-2xl md:text-3xl">
            Centre for Islands Future
          </h1>
          <p className="mb-4 text-xs leading-relaxed text-[#082952]/90 sm:text-sm">
            A SINU hub for Pacific-led research, policy dialogue, and partnerships shaping resilient
            island communities.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              size="sm"
              className="h-9 w-full bg-[#ffb703] text-sm font-bold text-[#082952] hover:bg-[#d7a12c] sm:w-auto sm:px-4"
              onClick={scrollToContent}
            >
              Explore the centre
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 w-full border-2 border-[#082952] bg-white text-sm font-bold text-[#082952] hover:bg-[#082952] hover:text-white sm:w-auto sm:px-4"
              asChild
            >
              <Link to="/research-partnerships">Partner with us</Link>
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-white/20 pt-3 text-xs font-semibold">
            <Link
              to="/marine-science-conservation"
              className="inline-flex items-center gap-1 text-[#082952] hover:underline"
            >
              <Waves className="h-3.5 w-3.5" aria-hidden />
              Marine science
            </Link>
            <Link
              to="/climate-change-adaptation"
              className="inline-flex items-center gap-1 text-[#082952] hover:underline"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Climate adaptation
            </Link>
            <Link
              to="/global-research-collaborations"
              className="inline-flex items-center gap-1 text-[#082952] hover:underline"
            >
              <Handshake className="h-3.5 w-3.5" aria-hidden />
              Global collaborations
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-university-gold py-2.5 sm:py-3">
        <div className="animate-scroll whitespace-nowrap">
          <p className="inline-block px-4 text-xs font-semibold text-university-dark-gray sm:px-6 sm:text-sm md:text-base">
            Pacific futures — interdisciplinary research, community engagement, and international
            university partnerships across the Blue Pacific.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IslandsFutureHero;
