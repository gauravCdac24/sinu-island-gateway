import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudentSupportHero from "@/components/student-support/StudentSupportHero";
import SupportServicesSection from "@/components/student-support/SupportServicesSection";
import AcademicResourcesSection from "@/components/student-support/AcademicResourcesSection";
import StudentLifeSection from "@/components/student-support/StudentLifeSection";
import ContactSupportSection from "@/components/student-support/ContactSupportSection";
import BackToTop from "@/components/common/BackToTop";
import SkipToMainLink from "@/components/study-levels/SkipToMainLink";

const StudentAcademicSupport = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SkipToMainLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <StudentSupportHero />
        <SupportServicesSection />
        <AcademicResourcesSection />
        <StudentLifeSection />
        <ContactSupportSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default StudentAcademicSupport;
