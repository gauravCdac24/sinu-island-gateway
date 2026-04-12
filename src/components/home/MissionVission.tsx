import React, { useEffect, useState } from "react";
import { getvision, getmission, getvalue, urlFor } from "../../../sanity/lib/sanity";

type FeatureItem = {
  title?: string;
  description?: string;
  image?: { sanityImage?: unknown; imageUrl?: string };
  type: string;
};

const MissionVission = () => {
  const [combinedData, setCombinedData] = useState<FeatureItem[]>([]);

  const getImageSrc = (image: FeatureItem["image"]) => {
    if (image?.sanityImage) return urlFor(image.sanityImage).url();
    if (image?.imageUrl) return image.imageUrl;
    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visionData, missionData, valueData] = await Promise.all([
          getvision(),
          getmission(),
          getvalue(),
        ]);

        const tagged: FeatureItem[] = [
          ...visionData.map((item: FeatureItem) => ({ ...item, type: "Our vision" })),
          ...missionData.map((item: FeatureItem) => ({ ...item, type: "Our mission" })),
          ...valueData.map((item: FeatureItem) => ({ ...item, type: "Our values" })),
        ];

        setCombinedData(tagged);
      } catch (error) {
        console.error("Error fetching mission data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-university-blue via-[#1e8fb5] to-university-dark-gray py-14 text-white md:py-20"
      aria-labelledby="mission-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M40 40m-20 0a20 20 0 1 1 40 0a20 20 0 1 1 -40 0'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-university-gold">
            Why SINU
          </span>
          <h2
            id="mission-heading"
            className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            Who we are
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
            Our vision, mission, and values guide every programme and every student experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {combinedData.map((feature, idx) => {
            const src = feature.image ? getImageSrc(feature.image) : "";
            return (
              <article
                key={feature.title || `${feature.type}-${idx}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-md transition hover:border-university-gold/50 hover:bg-white/15"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/20 sm:aspect-[4/3]">
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-university-light-blue/30 to-university-gold/20 text-4xl font-bold text-white/40">
                      SINU
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-sm font-bold uppercase tracking-wider text-university-gold">
                    {feature.type}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-sm leading-relaxed text-white/95 sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MissionVission;
