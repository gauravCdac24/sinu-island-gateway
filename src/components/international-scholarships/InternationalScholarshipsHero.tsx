import internationalScholarshipsHero from "@/assets/international-scholarships-hero.jpg";
import { Link } from "react-router-dom";

export function InternationalScholarshipsHero() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${internationalScholarshipsHero})` }}
      />
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow-lg">
          International Scholarships
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-shadow font-medium">
          Unlock your potential with generous scholarships designed to support international students at SINU
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-[#082952] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg">
            Explore Scholarships
          </button>
          <Link
            to="/apply"
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#082952] transition-colors text-lg inline-block text-center"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  );
}