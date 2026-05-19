
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import Index from "./pages/Index";
import CourseFinder from "./pages/CourseFinder";
import CourseCatalog from "./pages/CourseCatalog";
import UndergraduateStudy from "./pages/UndergraduateStudy";
import PostgraduateStudy from "./pages/PostgraduateStudy";
import DistanceFlexibleLearning from "./pages/DistanceFlexibleLearning";
import SinuTafeVvet from "./pages/SinuTafeVvet";
import UniversityPreparatory from "./pages/UniversityPreparatory";
import ShortCourses from "./pages/ShortCourses";
import LibraryServices from "./pages/LibraryServices";
import SchoolsFaculties from "./pages/SchoolsFaculties";
import StudentAcademicSupport from "./pages/StudentAcademicSupport";
import Scholarships from "./pages/Scholarships";
import IctServices from "./pages/IctServices";
import AdmissionRequirements from "./pages/AdmissionRequirements";
import VisaInformation from "./pages/VisaInformation";
import StudentAccommodation from "./pages/StudentAccommodation";
import EnglishLanguagePrograms from "./pages/EnglishLanguagePrograms";
import CulturalOrientation from "./pages/CulturalOrientation";
import InternationalStudentSupport from "./pages/InternationalStudentSupport";
import ExchangeProgram from "./pages/ExchangeProgram";
import PartnerUniversities from "./pages/PartnerUniversities";
import StudyAbroad from "./pages/StudyAbroad";
import InternationalScholarships from "./pages/InternationalScholarships";
import GlobalResearchCollaborations from "./pages/GlobalResearchCollaborations";
import InternationalEvents from "./pages/InternationalEvents";
import MarineScienceConservation from "./pages/MarineScienceConservation";
import ClimateChangeAdaptation from "./pages/ClimateChangeAdaptation";
import SustainableDevelopment from "./pages/SustainableDevelopment";
import IndigenousKnowledge from "./pages/IndigenousKnowledge";
import PublicHealth from "./pages/PublicHealth";
import ResearchCentersInstitutes from "./pages/ResearchCentersInstitutes";
import ResearchImpact from "./pages/ResearchImpact";
import Publications from "./pages/Publications";
import ResearchGrants from "./pages/ResearchGrants";
import EthicsCommittee from "./pages/EthicsCommittee";
import ResearchPartnerships from "./pages/ResearchPartnerships";
import ResearchSeminars from "./pages/ResearchSeminars";
import StudentClubs from "./pages/StudentClubs";
import SportsRecreation from "./pages/SportsRecreation";
import ArtsCulture from "./pages/ArtsCulture";
import DiningServices from "./pages/DiningServices";
import HealthWellness from "./pages/HealthWellness";
import CampusEvents from "./pages/CampusEvents";
import CampusAccommodation from "./pages/CampusAccommodation";
import Transportation from "./pages/Transportation";
import StaffLogin from "./pages/StaffLogin";
import StudentLogin from "./pages/StudentLogin";
import StudentForgotPassword from "./pages/StudentForgotPassword";
import StudentResetPassword from "./pages/StudentResetPassword";
import StudentPortal from "./pages/StudentsPortal";
import ApplicantLogin from "./pages/ApplicantLogin";
import NotFound from "./pages/NotFound";
import TafeEnrollment from "./pages/TafeEnrollment";
import Policies from "./pages/Policies";
import JobsVacancies from "./pages/JobsVacancies";
import JobApply from "./pages/JobApply";
import { ProgramDetails } from "./components/study-abroad/ProgramDetails";
import ProgrammeDetails from "./pages/ProgrammeDetails";
import ResearchEthics from "./pages/ResearchEthics";
import Apply from "./pages/Apply";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplicationsList from "./pages/admin/AdminApplicationsList";
import AdminApplicationDetail from "./pages/admin/AdminApplicationDetail";
import HrLogin from "./pages/hr/HrLogin";
import HrLayout from "./pages/hr/HrLayout";
import HrDashboard from "./pages/hr/HrDashboard";
import HrJobsList from "./pages/hr/HrJobsList";
import HrCreateJob from "./pages/hr/HrCreateJob";
import HrApplications from "./pages/hr/HrApplications";
import HrApplicationDetail from "./pages/hr/HrApplicationDetail";
import JobsArchived from "./pages/JobsArchived";
import TendersEoi from "./pages/TendersEoi";
import AdminTendersList from "./pages/admin/AdminTendersList";
import AdminCreateTender from "./pages/admin/AdminCreateTender";
import StudentManagementForum from "./pages/StudentManagementForum";
import AdminForumList from "./pages/admin/AdminForumList";
import AdminForumDetail from "./pages/admin/AdminForumDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/course-finder" element={<CourseFinder />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/course-catalog" element={<CourseCatalog />} />
          <Route path="/undergraduate-study" element={<UndergraduateStudy />} />
          <Route path="/postgraduate-study" element={<PostgraduateStudy />} />
          <Route path="/distance-flexible-learning" element={<DistanceFlexibleLearning />} />
          <Route path="/sinu-tafe-vvet" element={<SinuTafeVvet />} />
          <Route path="/university-preparatory" element={<UniversityPreparatory />} />
          <Route path="/short-courses" element={<ShortCourses />} />
          <Route path="/library-services" element={<LibraryServices />} />
          <Route path="/schools-faculties" element={<SchoolsFaculties />} />
          <Route path="/student-academic-support" element={<StudentAcademicSupport />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/ict-services" element={<IctServices />} />
          <Route path="/admission-requirements" element={<AdmissionRequirements />} />
          <Route path="/visa-information" element={<VisaInformation />} />
          <Route path="/student-accommodation" element={<StudentAccommodation />} />
          <Route path="/english-language-programs" element={<EnglishLanguagePrograms />} />
          <Route path="/cultural-orientation" element={<CulturalOrientation />} />
          <Route path="/international-student-support" element={<InternationalStudentSupport />} />
          <Route path="/exchange-program" element={<ExchangeProgram />} />
          <Route path="/partner-universities" element={<PartnerUniversities />} />
          <Route path="/study-abroad" element={<StudyAbroad />} />
          <Route path="/international-scholarships" element={<InternationalScholarships />} />
          <Route path="/global-research-collaborations" element={<GlobalResearchCollaborations />} />
          <Route path="/international-events" element={<InternationalEvents />} />
          <Route path="/marine-science-conservation" element={<MarineScienceConservation />} />
          <Route path="/climate-change-adaptation" element={<ClimateChangeAdaptation />} />
          <Route path="/sustainable-development" element={<SustainableDevelopment />} />
          <Route path="/indigenous-knowledge" element={<IndigenousKnowledge />} />
          <Route path="/public-health" element={<PublicHealth />} />
          <Route path="/research-centers-institutes" element={<ResearchCentersInstitutes />} />
          <Route path="/research-impact" element={<ResearchImpact />} />
          <Route path="/research-ethics" element={<ResearchEthics />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/research-grants" element={<ResearchGrants />} />
          <Route path="/ethics-committee" element={<EthicsCommittee />} />
          <Route path="/research-partnerships" element={<ResearchPartnerships />} />
          <Route path="/research-seminars" element={<ResearchSeminars />} />
          <Route path="/student-clubs" element={<StudentClubs />} />
          <Route path="/sports-recreation" element={<SportsRecreation />} />
          <Route path="/arts-culture" element={<ArtsCulture />} />
          <Route path="/dining-services" element={<DiningServices />} />
          <Route path="/health-wellness" element={<HealthWellness />} />
          <Route path="/campus-events" element={<CampusEvents />} />
          <Route path="/campus-accommodation" element={<CampusAccommodation />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-forgot-password" element={<StudentForgotPassword />} />
          <Route path="/student-reset-password" element={<StudentResetPassword />} />
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route path="/student-management-forum" element={<StudentManagementForum />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="applied" element={<AdminApplicationsList status="pending" />} />
            <Route path="accepted" element={<AdminApplicationsList status="approved" />} />
            <Route path="rejected" element={<AdminApplicationsList status="rejected" />} />
            <Route path="application/:id" element={<AdminApplicationDetail />} />
            <Route path="tenders" element={<AdminTendersList />} />
            <Route path="tenders/new" element={<AdminCreateTender />} />
            <Route path="tenders/:id/edit" element={<AdminCreateTender />} />
            <Route path="forum" element={<AdminForumList />} />
            <Route path="forum/:id" element={<AdminForumDetail />} />
          </Route>
          <Route path="/applicant-login" element={<ApplicantLogin />} />
          <Route path="/tafe-enroll" element={<TafeEnrollment />} />
          <Route path="/policies-procedures" element={<Policies/>}/>
          <Route path="/tenders-eoi" element={<TendersEoi />} />
          <Route path="/jobs-vacancies" element={<JobsVacancies />} />
          <Route path="/jobs-vacancies/archived" element={<JobsArchived />} />
          <Route path="/jobs-vacancies/apply" element={<JobApply />} />
          <Route path="/hr/login" element={<HrLogin />} />
          <Route path="/hr" element={<HrLayout />}>
            <Route index element={<Navigate to="/hr/dashboard" replace />} />
            <Route path="dashboard" element={<HrDashboard />} />
            <Route path="jobs" element={<HrJobsList />} />
            <Route path="jobs/new" element={<HrCreateJob />} />
            <Route path="jobs/:id/edit" element={<HrCreateJob />} />
            <Route path="applications" element={<HrApplications />} />
            <Route path="applications/:id" element={<HrApplicationDetail />} />
          </Route>
          <Route path="/programme/:code" element={<ProgrammeDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
