/** Official SINUSA Vice-Chancellor Student Forum categories and questions (May 2026). */

export type ForumSeedCategory = {
  title: string;
  slug: string;
  description?: string;
  sortOrder: number;
  questions: { label: string; body: string }[];
};

export const FORUM_SEED_CATEGORIES: ForumSeedCategory[] = [
  {
    title: "Academic Quality and Teaching",
    slug: "academic-quality-and-teaching",
    sortOrder: 1,
    questions: [
      {
        label: "a",
        body: "What measures is the university taking to improve the quality of teaching and learning across all faculties?",
      },
      {
        label: "b",
        body: "How is SINU addressing concerns about delayed results, incomplete marks, and academic administration issues?",
      },
      {
        label: "c",
        body: "What strategies are in place to ensure lecturers attend classes consistently and complete course outlines on time?",
      },
      {
        label: "d",
        body: "Are there plans to expand postgraduate programs and research opportunities for students?",
      },
      {
        label: "e",
        body: "How does the university ensure that programs offered remain relevant to the current job market, national development needs and even internationally?",
      },
    ],
  },
  {
    title: "Student Welfare and Support Services",
    slug: "student-welfare-and-support-services",
    sortOrder: 2,
    questions: [
      {
        label: "a",
        body: "What is management doing to improve student welfare services, including counselling, health, and academic support?",
      },
      {
        label: "b",
        body: "Are there plans to improve internet access, library resources, and ICT facilities for students?",
      },
      {
        label: "c",
        body: "What actions are being taken to improve accommodation and sanitation (Ablution Blocks for Day scholars) at campuses and hostels?",
      },
      {
        label: "d",
        body: "How can students better access financial assistance, scholarships, or flexible payment arrangements?",
      },
      {
        label: "e",
        body: "What support systems are available for students facing mental health challenges, stress, or personal difficulties?",
      },
    ],
  },
  {
    title: "Governance, Communication, and Transparency",
    slug: "governance-communication-and-transparency",
    sortOrder: 3,
    questions: [
      {
        label: "a",
        body: "How can management and students strengthen communication and mutual understanding?",
      },
      {
        label: "b",
        body: "What are the actions taken for staff absenteeism?",
      },
      {
        label: "c",
        body: "How transparent is the university regarding decisions affecting students, including fees and policy changes?",
      },
      {
        label: "d",
        body: "What role does management expect SINUSA to play in university governance and student representation?",
      },
      {
        label: "e",
        body: "How can students contribute meaningfully to university decision-making processes?",
      },
    ],
  },
  {
    title: "Infrastructure and Campus Development",
    slug: "infrastructure-and-campus-development",
    sortOrder: 4,
    questions: [
      {
        label: "a",
        body: "What are the university's future plans for campus development and infrastructure improvement?",
      },
      {
        label: "b",
        body: "Are there plans to improve classroom space, laboratories, and learning environments? Some classrooms like Faculty of Nursing and FST had never been improved since 1970.",
      },
      {
        label: "c",
        body: "How is SINU preparing for increasing student enrolment in the coming years? How does management plan to maintain university facilities and ensure a conducive learning environment (study spaces, labs, classrooms, etc.)?",
      },
      {
        label: "d",
        body: "What progress has been made regarding campus security and student safety?",
      },
      {
        label: "e",
        body: "How does management plan to maintain university facilities and ensure a conducive learning environment?",
      },
    ],
  },
  {
    title: "Employment, Innovation, and Student Opportunities",
    slug: "employment-innovation-and-student-opportunities",
    sortOrder: 5,
    questions: [
      {
        label: "a",
        body: "What partnerships does SINU have with government, private sector, and international organizations to support student internships and employment?",
      },
      {
        label: "b",
        body: "Are there plans to create more entrepreneurship and innovation programs for students?",
      },
      {
        label: "c",
        body: "How can students gain more practical and hands-on experience before graduation?",
      },
      {
        label: "d",
        body: "What initiatives are being developed to prepare graduates for leadership and nation-building?",
      },
    ],
  },
  {
    title: "Unity, Culture, and Student Life",
    slug: "unity-culture-and-student-life",
    sortOrder: 6,
    questions: [
      {
        label: "a",
        body: "How can the university promote unity and respect among students from different provinces and backgrounds? What values and culture does the university want to build among students and staff?",
      },
      {
        label: "b",
        body: "What is management's view on strengthening student clubs, associations, sports, and cultural activities?",
      },
      {
        label: "c",
        body: "How can the university management address issues such as alcohol abuse, violence, harassment, and anti-social behaviour on campus? What are the responses to unlawful activities affecting university property?",
      },
    ],
  },
  {
    title: "Strategic and Future Vision Questions",
    slug: "strategic-and-future-vision",
    sortOrder: 7,
    questions: [
      {
        label: "a",
        body: "What is the long-term vision of SINU over the next 5–10 years?",
      },
      {
        label: "b",
        body: "What challenges does the university currently face, and how can students become part of the solution?",
      },
      {
        label: "c",
        body: "How can students and management build genuine partnership rather than confrontation?",
      },
      {
        label: "d",
        body: "What message does the Vice-Chancellor and Management have for students regarding unity, discipline, leadership, and academic excellence?",
      },
    ],
  },
  {
    title: "Staff Attendance, Professionalism and Customer Services",
    slug: "staff-attendance-professionalism-and-customer-services",
    sortOrder: 8,
    questions: [
      {
        label: "a",
        body: "What measures is the university management taking to address staff absenteeism during official working hours?",
      },
      {
        label: "b",
        body: "How does management monitor staff attendance and ensure offices remain operational and accessible to students throughout the day?",
      },
      {
        label: "c",
        body: "Students sometimes experience difficulty accessing staff members during office hours. What systems can be introduced to improve accountability and service delivery to students?",
      },
      {
        label: "d",
        body: "What is management's position on staff leaving offices during working hours for non-work-related activities while students are seeking assistance?",
      },
    ],
  },
  {
    title: "Staff Workplace Conduct",
    slug: "staff-workplace-conduct",
    sortOrder: 9,
    questions: [
      {
        label: "a",
        body: "What policies exist regarding staff engaging in recreational games during official working hours on campus?",
      },
      {
        label: "b",
        body: "How does management ensure that university staff maintain professionalism and set positive examples for students within the university environment?",
      },
      {
        label: "c",
        body: "What disciplinary or awareness measures are in place regarding smoking and chewing betel-nut on campus during working hours?",
      },
      {
        label: "d",
        body: "What reporting mechanisms are available for students to respectfully raise concerns about staff conduct without fear of victimization?",
      },
    ],
  },
];

export const FORUM_THEME =
  "Building a Stronger University Community Through Dialogue and Partnership";

export const FORUM_EVENT_LABEL =
  "SINUSA–Management Dialogue · Thursday, 21 May 2026 · KLT Lecture Theatre";
