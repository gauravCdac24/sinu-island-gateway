import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";
import SkipToMainLink from "@/components/study-levels/SkipToMainLink";

type StudentPageShellProps = {
  children: React.ReactNode;
  /** Default: bg-white */
  className?: string;
  showBackToTop?: boolean;
};

/**
 * Standard layout for public student-facing pages (matches Undergraduate: skip link, header, main landmark, footer).
 */
const StudentPageShell: React.FC<StudentPageShellProps> = ({
  children,
  className = "flex min-h-screen flex-col bg-white",
  showBackToTop = true,
}) => {
  return (
    <div className={className}>
      <SkipToMainLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-grow outline-none">
        {children}
      </main>
      <Footer />
      {showBackToTop ? <BackToTop /> : null}
    </div>
  );
};

export default StudentPageShell;
