import React from "react";
import { Link } from "react-router-dom";

type ServiceLink = {
  title: string;
  image: string;
  href?: string;
};

const services: ServiceLink[] = [
  {
    title: "Student–Management Forum",
    image: "/lovable-uploads/bb44fb80-3e75-4c83-8246-f60f42997ac3.png",
    href: "/student-management-forum",
  },
  { title: "Library Services", image: "/lovable-uploads/bb44fb80-3e75-4c83-8246-f60f42997ac3.png" },
  { title: "IT Support", image: "/lovable-uploads/bb44fb80-3e75-4c83-8246-f60f42997ac3.png" },
  { title: "Counseling", image: "/lovable-uploads/bb44fb80-3e75-4c83-8246-f60f42997ac3.png" },
  { title: "Career Services", image: "/lovable-uploads/bb44fb80-3e75-4c83-8246-f60f42997ac3.png" },
  { title: "Student Housing", image: "/lovable-uploads/bb44fb80-3e75-4c83-8246-f60f42997ac3.png" },
  { title: "Health Services", image: "/lovable-uploads/bb44fb80-3e75-4c83-8246-f60f42997ac3.png" },
  { title: "Research Support", image: "/lovable-uploads/bb44fb80-3e75-4c83-8246-f60f42997ac3.png" },
  { title: "Financial Aid", image: "/lovable-uploads/bb44fb80-3e75-4c83-8246-f60f42997ac3.png" },
];

const cardClassName =
  "relative block h-40 overflow-hidden rounded-lg shadow-lg group cursor-pointer sm:h-48 md:h-52";

const ServiceCard: React.FC<{ service: ServiceLink }> = ({ service }) => (
  <>
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: `url(${service.image})` }}
    />
    <div className="absolute inset-0 bg-black/40 transition group-hover:bg-black/50" />
    <div className="absolute top-4 w-full transform px-4 text-center transition-all duration-500 group-hover:top-1/2 group-hover:-translate-y-1/2">
      <h3 className="text-lg font-semibold text-white drop-shadow-md sm:text-xl">
        {service.title}
      </h3>
    </div>
  </>
);

const StudentsQuickLinks: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 md:pb-40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#222222] mb-12">
          Students Quick Links
          <span className="block h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-sm"></span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) =>
            service.href ? (
              <Link key={index} to={service.href} className={cardClassName}>
                <ServiceCard service={service} />
              </Link>
            ) : (
              <div key={index} className={cardClassName}>
                <ServiceCard service={service} />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentsQuickLinks;
