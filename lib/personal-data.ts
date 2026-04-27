/**
 * personal-data.ts
 *
 * Single source of truth for the entire portfolio.
 * Extracted from resume, LinkedIn, and project READMEs.
 * Update this file → entire site updates.
 */

export type Role = 'pm' | 'engineer' | 'associate';

export const profile = {
  name: 'Hamid Rizvi',
  shortName: 'Hamid',
  tagline: 'I turn AI capabilities into shipped products.',
  pullQuote: 'Because the hard part is what\'s actually possible.',
  location: 'New York, NY',
  email: 'hamidrizvi@stern.nyu.edu',
  phone: '(929) 420-6592',
  linkedin: 'https://linkedin.com/in/hamid-rizvi',
  github: 'https://github.com/hamidrizvi4',

  // Status line for the contact section
  availability: 'Graduating May 2026 — currently interviewing for full-time PM roles.',

  // The "about" paragraph, three flavors based on role-switcher
  bio: {
    pm: "AI Product Manager at the intersection of technical architecture and product strategy. CS undergrad, NYU Stern grad student, CSPO and CSM certified. I take ambiguous AI capabilities and turn them into shipping products — PRDs that the engineering team can build from on day one because I've already prototyped the hard parts.",
    engineer: "AI/ML engineer with a product instinct. CS background, currently building production RAG systems and TypeScript microservices at LexTrack AI. I optimize for the boring stuff that matters: latency budgets, cost per query, and the 99.5% uptime that keeps users from rage-quitting.",
    associate: "Product associate who prototypes before writing the spec. CS undergrad, NYU Stern, CSPO and CSM certified. I drive 0→1 work by getting close to users, the data, and the model — then translate what I learn into roadmaps that ship.",
  },
} as const;

// ============================================
// HEADLINE METRICS — the "scroll-stopping" numbers
// ============================================
export const metrics = [
  {
    value: 80,
    suffix: '%',
    label: 'Onboarding time cut',
    context: 'LexTrack — 30 min → 5 min restaurant config',
    weight: { pm: 1, engineer: 0.7, associate: 1 },
  },
  {
    value: 70,
    suffix: '%',
    label: 'LLM cost reduction',
    context: 'Hybrid AI architecture, prompt caching, fallback logic',
    weight: { pm: 0.8, engineer: 1, associate: 0.7 },
  },
  {
    value: 40,
    suffix: '%',
    label: 'Inference cost cut',
    context: 'RAG + model evaluation experiments at LexTrack',
    weight: { pm: 0.7, engineer: 1, associate: 0.6 },
  },
  {
    value: 99.5,
    suffix: '%',
    label: 'Production uptime',
    context: '3-layer fallback, 50+ active restaurant partners',
    weight: { pm: 0.9, engineer: 1, associate: 0.8 },
  },
  {
    value: 0.82,
    suffix: '',
    prefix: 'AUC ',
    label: 'Churn model accuracy',
    context: 'ML pipeline serving 96K+ customer profiles',
    weight: { pm: 0.7, engineer: 1, associate: 0.6 },
  },
  {
    value: 110,
    suffix: 'K',
    label: 'Transactions analyzed',
    context: 'Automated executive reporting — 4hr → 5min',
    weight: { pm: 1, engineer: 0.8, associate: 1 },
  },
] as const;

// ============================================
// CASE STUDIES — the four projects
// ============================================
export interface CaseStudy {
  id: string;
  index: string;
  title: string;
  role: string;
  period: string;
  stack: string[];
  hero: string; // One-line headline
  problem: string;
  build: string;
  impact: string[];
  links?: { label: string; url: string }[];
  accent?: 'vermilion' | 'paper' | 'pulp';
  cta?: {
    type: 'github' | 'demo';
    label: string;
    href: string;
    placeholder?: boolean;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'lextrack',
    index: '01',
    title: 'LexTrack AI',
    role: 'AI/ML Product Engineering Intern · Capstone PM Lead',
    period: 'Sep 2025 — Present',
    stack: ['TypeScript', 'RAG', 'Gemini', 'Prompt Eng', 'Microservices'],
    hero: 'Restaurant onboarding from 30 minutes to 5.',
    problem: 'SMB restaurants needed SevenRooms-grade reservation systems but couldn\'t afford them, and existing no-code tools required 30+ minutes of manual metadata config per merchant — killing time-to-value before users even saw the product.',
    build: 'Architected a 0→1 reservation template inside a 1-click no-code platform. Hybrid AI architecture: deterministic rules + Gemini LLM for the ambiguous cases. 80+ metadata fields across 11 categories, generated from a single prompt. 3-layer fallback ensured the LLM never blocked critical paths.',
    impact: [
      '80% onboarding time cut (30 min → 5 min)',
      '70% LLM cost reduction via caching + intelligent fallback',
      '99.5% uptime across 50+ active restaurant partners',
      '85% weekly retention, 4.2/5 CSAT in 8 weeks',
      '$2M+ TAM identified through 25+ user interviews',
    ],
    accent: 'vermilion',
    cta: {
      type: 'demo',
      label: 'Watch the product demo',
      href: 'https://drive.google.com/drive/folders/1AjIufAhjLeLkWnCcFtIbltJ1Eq_Q4sgE?usp=sharing',
      placeholder: false,
    },
  },
  {
    id: 'quadtax',
    index: '02',
    title: 'QuadTax',
    role: 'Founder & Lead Engineer',
    period: 'Mar 2026 — Present',
    stack: ['Next.js', 'FastAPI', 'OpenAI', 'Pydantic', 'Tesseract OCR'],
    hero: 'AI tax filing for 2M+ nonresident aliens in the US.',
    problem: 'F-1/J-1 visa holders face the same tax filing nightmare every April: confusing IRS rules, FICA tax illegally withheld by employers (IRC § 3121(b)(19)), and a market underserved by TurboTax. Manual prep takes 35+ minutes per return and the math errors are common.',
    build: 'Hybrid execution engine. LLM agents handle reasoning (residency determination, treaty evaluation, document parsing) while pure Python handles the math (tax brackets, regulatory lookups). 100% mathematical accuracy guaranteed because the deterministic zone never sees the LLM. OCR pipeline (Tesseract + pdfplumber) extracts W-2, 1042-S, I-94 data automatically. Generates official IRS forms (1040-NR, 8843, 8833) as PDFs.',
    impact: [
      '35 min → <10 min total prep time',
      '90% reduction in manual data entry',
      '100% math accuracy via deterministic execution zone',
      'FICA recovery module identifies illegal withholding',
    ],
    accent: 'paper',
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/QuadTax',
    },
  },
  {
    id: 'analytics',
    index: '03',
    title: 'AI Purchase Analytics',
    role: 'Personal Project',
    period: 'Oct 2025',
    stack: ['Python', 'Pandas', 'Gemini', 'Streamlit', 'Plotly'],
    hero: 'Executive reporting from 4 hours to 5 minutes.',
    problem: 'Retail leadership teams burn entire workdays pulling RFM segments, churn risk scores, and cohort retention by hand in Excel. By the time the deck is ready, the data is stale.',
    build: 'Automated analytics platform. Pandas does the heavy lift on RFM segmentation and cohort retention. Gemini API generates strategic insights and revenue opportunities from the structured output. Streamlit delivers it as an interactive dashboard non-technical execs can actually use.',
    impact: [
      '95% reporting time reduction (4 hr → 5 min)',
      '110K+ transactions processed',
      '96K+ customer profiles served',
      'Churn prediction AUC 0.82 — 15% improvement in retention targeting',
    ],
    accent: 'pulp',
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/Purchase-Analytics-AI',
    },
  },
  {
    id: 'squirrel',
    index: '04',
    title: 'Squirrel AI',
    role: 'Product Vision & Lead Developer',
    period: '2025',
    stack: ['React', 'FastAPI', 'OpenAI', 'Embeddings'],
    hero: 'Plain-English explanations for any GitHub repo.',
    problem: 'Onboarding to a new codebase is the worst part of any engineering job. README files lie, code comments are stale, and ramp-up time bleeds productivity for weeks.',
    build: 'AI-powered repo analyzer. Pulls any public GitHub repo, extracts code structure (functions, classes, imports across 11 languages), generates a project summary, and lets users ask context-aware questions with file references in the answers.',
    impact: [
      'Multi-language support (Python, JS, TS, Go, Java, +)',
      'Context-aware Q&A with cited file references',
      'Cached repo analysis for sub-second subsequent queries',
    ],
    accent: 'pulp',
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/Squirrel-AI',
    },
  },
];

// ============================================
// EXPERIENCE TIMELINE — for the contact section
// ============================================
export const experience = [
  {
    company: 'LexTrack AI',
    role: 'AI/ML Product Engineering Intern',
    period: 'Feb 2026 — Present',
    location: 'New York, NY',
  },
  {
    company: 'LexTrack AI',
    role: 'Product Manager (Capstone)',
    period: 'Sep 2025 — Dec 2025',
    location: 'New York, NY',
  },
  {
    company: 'two19',
    role: 'Product Fellow',
    period: 'Jul 2025 — Aug 2025',
    location: 'New York, NY',
  },
] as const;

export const education = [
  {
    school: 'New York University',
    degree: 'M.S. Technology Management',
    detail: 'GPA 3.7 · Sep 2024 — May 2026',
  },
  {
    school: 'SRM Institute of Science and Technology',
    degree: 'B.Tech Computer Science (Cloud Computing)',
    detail: 'Sep 2020 — May 2024',
  },
] as const;

export const certifications = [
  'CSPO — Certified Scrum Product Owner',
  'CSM — Certified Scrum Master',
  'Google Project Management Professional',
  'AI for Product Management (Pendo.io)',
] as const;

// ============================================
// OFF-DUTY — interests carousel
// ============================================
export const interests = [
  {
    id: 'photography',
    title: 'Photography',
    blurb: 'Street and editorial. New York is the studio.',
    eyebrow: 'On the side',
  },
  {
    id: 'chess',
    title: 'Chess',
    blurb: 'Live rating updates from chess.com. The endgame teaches you to ship.',
    eyebrow: 'Daily practice',
  },
  {
    id: 'case-studies',
    title: 'AI-driven case study practice',
    blurb: 'Two PM case interviews per day with Gemini. Compounding product sense.',
    eyebrow: 'Self-improvement loop',
  },
] as const;

// ============================================
// SKILLS — for the chat context + skills strip
// ============================================
export const skills = {
  ai: ['LLM Integration (GPT-4, Claude, Gemini)', 'RAG Systems', 'Prompt Engineering', 'Pydantic Structured Outputs', 'FastAPI', 'Multi-Agent Orchestration', 'Vector Databases', 'Model Evaluation', 'Cost Optimization'],
  product: ['0→1 Development', 'User Research', 'RICE Prioritization', 'Roadmapping', 'PRD Writing', 'Agile/Scrum (CSPO, CSM)', 'Jira', 'Figma', 'A/B Testing'],
  engineering: ['Python', 'TypeScript', 'Next.js', 'React', 'Node.js', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'Azure', 'CI/CD'],
  data: ['SQL', 'Pandas', 'NumPy', 'Cohort Analysis', 'Churn Modeling', 'OCR (Tesseract)', 'ETL Pipelines'],
} as const;
