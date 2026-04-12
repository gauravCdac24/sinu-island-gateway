export type ImpactCategory = 'Impact' | 'Engagement' | 'Discovery';
export type FacultyCode = 'FEH' | 'FAFF' | 'FST' | 'FNMHS' | 'ORPS';

export interface ResearchProject {
  id: string;
  title: string;
  category: ImpactCategory;
  faculty: string;
  funder: string;
  partner: string | null;
  status: string;
  grant: number | null;
  area: string;
  description: string;
}

export const researchProjects: ResearchProject[] = [
  {
    id: 'RP-2025-001',
    title: 'Climate Security in Solomon Islands',
    category: 'Impact',
    faculty: 'FEH',
    funder: 'UNSW',
    partner: 'University of New South Wales',
    status: 'Active',
    grant: null,
    area: 'Climate & Security',
    description:
      'Investigates the intersection of climate change and national security, informing policy on climate resilience and adaptive governance in the Pacific.',
  },
  {
    id: 'RP-2025-002',
    title: '2024 Solomon Islands National Election Observation Report',
    category: 'Impact',
    faculty: 'FEH',
    funder: 'DFAT',
    partner: 'ANU',
    status: 'Concluded',
    grant: null,
    area: 'Governance & Democracy',
    description:
      'Independent observation and reporting on the 2024 national elections, supporting democratic transparency and governance accountability.',
  },
  {
    id: 'RP-2025-003',
    title: 'Improving Agricultural Development for Female Smallholders in Rural Solomon Islands',
    category: 'Engagement',
    faculty: 'FEH',
    funder: 'ACIAR',
    partner: 'ACIAR & Live & Learn',
    status: 'Active',
    grant: null,
    area: 'Agriculture & Gender',
    description:
      'End-of-project evaluation examining gender-responsive agricultural development interventions supporting rural female smallholder farmers.',
  },
  {
    id: 'RP-2025-004',
    title: 'Malaita Outer Islands Sea Cucumber Fisheries: Market & Trade Analysis and Community Management Plan',
    category: 'Engagement',
    faculty: 'FEH',
    funder: 'FAO',
    partner: 'MFMR',
    status: 'Active',
    grant: null,
    area: 'Fisheries & Community',
    description:
      'Market analysis and co-design of community-led sea cucumber management and development plans for Luaniua and Pelau communities.',
  },
  {
    id: 'RP-2025-005',
    title: 'National Security Studies Program',
    category: 'Impact',
    faculty: 'FEH',
    funder: 'DFAT',
    partner: 'UCQ, UNSW',
    status: 'Active',
    grant: null,
    area: 'Security Studies',
    description:
      'Development of postgraduate certificate and diploma qualifications in national security studies to build regional security capacity.',
  },
  {
    id: 'RP-2025-006',
    title: 'Investing in Context: Culturally Sensitive Approaches to Foreign Investment in Solomon Islands',
    category: 'Engagement',
    faculty: 'FEH',
    funder: 'Ritsumeikan University',
    partner: 'Ritsumeikan University',
    status: 'Concluded',
    grant: null,
    area: 'Cultural Studies',
    description:
      'A research collaboration exploring culturally sensitive frameworks for foreign investment decisions, bridging Pacific and global academic perspectives.',
  },
  {
    id: 'RP-2025-007',
    title: 'Environmental DNA Research',
    category: 'Discovery',
    faculty: 'FAFF',
    funder: 'ETH Zurich',
    partner: 'ETH Zurich, Switzerland',
    status: 'Active',
    grant: null,
    area: 'Environmental Science',
    description:
      'Pioneering environmental DNA (eDNA) sampling methodologies to detect and monitor aquatic biodiversity in Solomon Islands waterways.',
  },
  {
    id: 'RP-2025-008',
    title: 'SAFE Project: Safeguarding Solomon Islands Endemic Biodiversity from Invasive Species & Unsustainable Land Use',
    category: 'Impact',
    faculty: 'FAFF',
    funder: 'GEF',
    partner: 'MAL, MECDM, UNDP',
    status: 'Active',
    grant: 1181565,
    area: 'Biodiversity',
    description:
      'Large-scale biodiversity protection project tackling invasive alien species and unsustainable land use practices across Solomon Islands ecosystems.',
  },
  {
    id: 'RP-2025-009',
    title: 'Marine Eutrophication Research',
    category: 'Discovery',
    faculty: 'FAFF',
    funder: 'Fisheries & Oceans Canada',
    partner: null,
    status: 'Active',
    grant: 30000,
    area: 'Marine Science',
    description:
      'Scientific investigation of nutrient enrichment and eutrophication processes in Solomon Islands coastal and marine environments.',
  },
  {
    id: 'RP-2025-010',
    title: 'Fish Biology Research',
    category: 'Discovery',
    faculty: 'FAFF',
    funder: 'SPC',
    partner: 'SPC',
    status: 'Active',
    grant: 10000,
    area: 'Marine Science',
    description:
      'Monthly sampling and biological assessment of commercially important fish species to inform sustainable fisheries management.',
  },
  {
    id: 'RP-2025-011',
    title: 'Ocean Acidification Research',
    category: 'Discovery',
    faculty: 'FAFF',
    funder: 'Ocean Foundation',
    partner: null,
    status: 'Active',
    grant: 40000,
    area: 'Marine Science',
    description:
      'Investigating the effects of ocean acidification on coral reef ecosystems and marine biodiversity in the Solomon Islands archipelago.',
  },
  {
    id: 'RP-2025-012',
    title: 'Solomons Research into Community Marine Management',
    category: 'Engagement',
    faculty: 'FAFF',
    funder: 'MFAT NZ',
    partner: 'MECDM, MFMR, Ocean12',
    status: 'Negotiation',
    grant: 705000,
    area: 'Marine Management',
    description:
      'Building collective capacity for marine spatial planning and community-led marine protection that builds climate resilience across Solomon Islands.',
  },
  {
    id: 'RP-2025-013',
    title: 'Climate Justice in Higher Education',
    category: 'Impact',
    faculty: '—',
    funder: '—',
    partner: null,
    status: 'Pending',
    grant: null,
    area: 'Climate Justice',
    description:
      'Exploring frameworks for embedding climate justice principles within Pacific higher education curricula and institutional practices.',
  },
  {
    id: 'RP-2025-014',
    title: 'Barriers to Female Leadership in STEM — PWL Project',
    category: 'Engagement',
    faculty: 'FST',
    funder: 'AusAID',
    partner: 'USP, FNU, NUS',
    status: 'Active',
    grant: 136861,
    area: 'Gender & STEM',
    description:
      'Pacific-wide study identifying systemic barriers to female leadership in STEM fields and developing actionable pathways for equity and inclusion.',
  },
  {
    id: 'RP-2025-015',
    title: 'Female Death Registration in Solomon Islands',
    category: 'Impact',
    faculty: 'FNMHS',
    funder: 'USAID',
    partner: 'Johns Hopkins University',
    status: 'Active',
    grant: null,
    area: 'Public Health',
    description:
      'Improving civil registration and vital statistics systems to better capture female mortality data, supporting health policy and planning.',
  },
  {
    id: 'RP-2025-016',
    title: 'Durability of Mosquito Nets in Remote Solomon Islands Communities',
    category: 'Impact',
    faculty: 'ORPS',
    funder: 'WHO',
    partner: 'Kyoto University',
    status: 'Active',
    grant: null,
    area: 'Public Health',
    description:
      'Field study assessing long-lasting insecticidal net durability and effectiveness in remote communities to inform malaria prevention strategies.',
  },
  {
    id: 'RP-2025-017',
    title: 'Net Weaving of Traditional Indigenous Knowledge',
    category: 'Engagement',
    faculty: 'ORPS',
    funder: 'PIURN, H2020',
    partner: 'Univ. of New Caledonia, Univ. of French Polynesia',
    status: 'Active',
    grant: null,
    area: 'Indigenous Knowledge',
    description:
      'Pacific network collaboration preserving and revitalising traditional indigenous knowledge systems across Melanesian and Polynesian communities.',
  },
  {
    id: 'RP-2025-018',
    title: 'Small Livestock Feed — Nutrition Value of Local Feeds',
    category: 'Engagement',
    faculty: 'ORPS',
    funder: 'CSIRO',
    partner: 'SINU (FST/FAFF), CSIRO',
    status: 'Active',
    grant: 50000,
    area: 'Agriculture',
    description:
      'Nutritional analysis of locally sourced livestock feeds to improve food security and smallholder agricultural productivity in Solomon Islands.',
  },
];

export const FACULTIES: { code: string; label: string }[] = [
  { code: 'all', label: 'All Faculties' },
  { code: 'FEH', label: 'FEH' },
  { code: 'FAFF', label: 'FAFF' },
  { code: 'FST', label: 'FST' },
  { code: 'FNMHS', label: 'FNMHS' },
  { code: 'ORPS', label: 'ORPS' },
];

export const CATEGORIES: { key: string; label: string; color: string }[] = [
  { key: 'all', label: 'All Projects', color: '' },
  { key: 'Impact', label: 'Impact', color: 'bg-amber-100 text-amber-800' },
  { key: 'Engagement', label: 'Engagement', color: 'bg-green-100 text-green-800' },
  { key: 'Discovery', label: 'Discovery', color: 'bg-blue-100 text-blue-800' },
];