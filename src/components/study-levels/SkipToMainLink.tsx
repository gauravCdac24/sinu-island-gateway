import React from "react";

/** Visible on keyboard focus — WCAG 2.4.1 Bypass Blocks */
const SkipToMainLink = () => (
  <a
    href="#main-content"
    className="sr-only z-[100] rounded-md bg-[#082952] px-4 py-2 text-sm font-semibold text-white shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white"
  >
    Skip to main content
  </a>
);

export default SkipToMainLink;
