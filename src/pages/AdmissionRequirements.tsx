
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdmissionHero from '@/components/admission/AdmissionHero';
import RequirementsOverviewSection from '@/components/admission/RequirementsOverviewSection';
import UndergraduateRequirementsSection from '@/components/admission/UndergraduateRequirementsSection';
import PostgraduateRequirementsSection from '@/components/admission/PostgraduateRequirementsSection';
import EnglishRequirementsSection from '@/components/admission/EnglishRequirementsSection';
import DocumentsSection from '@/components/admission/DocumentsSection';
import ApplicationProcessSection from '@/components/admission/ApplicationProcessSection';
import BackToTop from '@/components/common/BackToTop';
import InternationalTab from '@/components/admission/InternationalTabs';
import InternationalStudyOptions from '@/components/study-abroad/InternationalStudyOptions';
import InternationalFeaturedPrograms from '@/components/study-abroad/InternationalFeaturedPrograms';
import InternationalStudyOptionsSection from '@/components/study-abroad/InternationalStudyOptionsSection';
import InternationalKeyDates from '@/components/study-abroad/InternationalKeyDates';
import { StudentExperience } from '@/components/study-abroad/StudentExperience';
import InternationalEvents from './InternationalEvents';
import InternationalNewsEvents from '@/components/study-abroad/InternationalNewsEvents';

const AdmissionRequirements = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AdmissionHero />
        <InternationalTab />
        <RequirementsOverviewSection />
        <InternationalStudyOptions/>
        <InternationalFeaturedPrograms />
        <InternationalStudyOptionsSection />
        <StudentExperience />
        <InternationalNewsEvents />
      </main> 
      <Footer />
      <BackToTop />
    </div>
  );
};

export default AdmissionRequirements;
