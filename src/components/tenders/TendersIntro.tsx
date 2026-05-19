import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const TendersIntro = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-2 md:w-3 shrink-0 bg-[#219ebc]" aria-hidden />
          <CardContent className="flex-1 py-8 md:py-10 px-6 md:px-10">
            <p className="text-gray-800 leading-relaxed text-base md:text-lg">
              Solomon Islands National University publishes tenders and expressions of interest (EOI)
              for goods, services, and partnerships. All opportunities listed below are official
              SINU publications with stated closing dates and supporting documentation.
            </p>
            <p className="mt-6 text-[#082952] font-semibold text-lg">
              Review the details carefully and submit your response before the closing date.
            </p>
          </CardContent>
        </div>
      </Card>
    </section>
  );
};

export default TendersIntro;
