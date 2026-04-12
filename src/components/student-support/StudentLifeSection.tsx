import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const StudentLifeSection = () => {
  const lifeSupport = [
    {
      title: "Wellbeing & counselling",
      description: "Counselling, wellness activities, and support when you need it.",
      cta: "Health & wellness",
      to: "/health-wellness",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&auto=format&fit=crop",
    },
    {
      title: "Accommodation",
      description: "On-campus and off-campus options—plan ahead for each trimester.",
      cta: "Student accommodation",
      to: "/student-accommodation",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80&auto=format&fit=crop",
    },
    {
      title: "Food on campus",
      description: "Cafés and dining to keep you fuelled between lectures.",
      cta: "Dining services",
      to: "/dining-services",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db1?w=900&q=80&auto=format&fit=crop",
    },
    {
      title: "Sport & recreation",
      description: "Clubs, facilities, and activities to stay active and connected.",
      cta: "Sports & recreation",
      to: "/sports-recreation",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80&auto=format&fit=crop",
    },
  ];

  return (
    <section
      id="life-support"
      aria-labelledby="life-support-heading"
      className="border-t border-slate-200/80 bg-white py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl md:mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#219ebc]">
            Beyond the lecture room
          </p>
          <h2
            id="life-support-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-[#082952] sm:text-4xl"
          >
            Life outside class
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            A good study experience includes where you live, what you eat, and how you stay well. Each
            card shows the topic on the photo—details sit underneath.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {lifeSupport.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#219ebc]"
            >
              {/* Stretched image band — title overlaid on image only */}
              <div className="relative w-full overflow-hidden">
                <div className="relative aspect-[16/11] min-h-[180px] w-full sm:aspect-[16/10] sm:min-h-[200px] md:min-h-[220px]">
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 pt-12 md:p-5 md:pt-16">
                    <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm md:text-xl">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Copy below the image */}
              <div className="flex flex-1 flex-col gap-3 border-t border-slate-100 p-4 md:p-5">
                <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#219ebc]">
                  {item.cta}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentLifeSection;
