import React from "react";
import OptimizedImage from "@/components/common/OptimizedImage";

/**
 * Full-width hero for the Apply page. Sits flush under the viewport top so the
 * campus image extends behind the absolute Header (logo + nav).
 */
const ApplyHero: React.FC = () => {
  return (
    <section
      className="relative h-[42vh] min-h-[260px] w-full overflow-hidden bg-[#023047] sm:h-[46vh] sm:min-h-[300px] md:h-[50vh] lg:h-[54vh]"
      aria-label="Apply to study"
    >
      <div className="absolute inset-0">
        <OptimizedImage
          src="/lovable-uploads/DSC05873.jpg"
          alt="Solomon Islands National University campus"
          className="h-full w-full object-cover"
          priority
          width={1920}
          height={1080}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#023047]/75 via-[#023047]/50 to-[#023047]/70"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] flex h-full flex-col items-center justify-start px-4 pb-8 pt-36 text-center text-white sm:pt-40 md:pt-44 lg:pt-48">
        <h1 className="max-w-4xl text-3xl font-bold leading-tight drop-shadow-md sm:text-4xl md:text-5xl">
          Apply to study at SINU
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/95 drop-shadow sm:text-base md:text-lg">
          Online application — work through each step and upload your documents securely.
        </p>
      </div>
    </section>
  );
};

export default ApplyHero;
