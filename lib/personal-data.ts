/**
 * personal-data.ts
 *
 * Single source of truth for the entire portfolio.
 * Extracted from resume, LinkedIn, and project READMEs.
 * Update this file and the entire site updates.
 */

export type Role = 'pm' | 'engineer' | 'associate';

export const profile = {
  name: 'Hamid Rizvi',
  shortName: 'Hamid',
  tagline: 'I prototype before I write the spec.',
  location: 'New York, NY',
  email: 'hamidrizvi@stern.nyu.edu',
  phone: '(929) 420-6592',
  linkedin: 'https://linkedin.com/in/hamid-rizvi',
  github: 'https://github.com/hamidrizvi4',

  // Path to the downloadable resume PDF (served from /public)
  resume: '/Hamid-Rizvi-Resume.pdf',

  // Status line for the contact section
  availability: 'NYU \'26 grad, open to full-time PM roles, available immediately.',

  // The "about" paragraph, three flavors based on role-switcher
  bio: {
    pm: "As an AI Product Manager with a CS background, I don't write specs for things I haven't tested. I build the prototype before I write the PRD so that engineering has a roadmap grounded in technical reality. When a pure-LLM prototype at LexTrack AI was hallucinating and lagging, this hands-on approach allowed me to pivot to a hybrid architecture quickly, ultimately cutting user onboarding from 30 minutes to 5. Backed by a Master's from NYU, a Bachelor's in Computer Science, and CSPO/CSM certifications, I sit directly at the intersection of product vision and engineering execution.",
    engineer: "AI/ML engineer with a product instinct. Built production RAG systems and TypeScript microservices at LexTrack AI through May 2026. I obsess over the boring stuff that actually matters: latency budgets, cost per query, and the 99.5% uptime that keeps users from rage-quitting.",
    associate: "Product associate who prototypes before writing the spec. CS undergrad, NYU, CSPO and CSM certified. I drive zero-to-one work by getting close to users, the data, and the model — then turn what I learn into roadmaps that actually ship.",
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
    context: 'LexTrack: restaurant config cut from 30 min to 5 min',
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
    context: 'RAG and model evaluation experiments at LexTrack',
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
    label: 'Churn model performance',
    context: 'Surfaced a high-spend, high-churn segment invisible in aggregate reporting, a 15% improvement in retention targeting',
    weight: { pm: 0.7, engineer: 1, associate: 0.6 },
  },
  {
    value: 110,
    suffix: 'K',
    label: 'Transactions analyzed',
    context: 'Automated executive reporting: 4 hours to 5 minutes',
    weight: { pm: 1, engineer: 0.8, associate: 1 },
  },
] as const;

// ============================================
// CASE STUDIES — the five projects
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
  /** Route to the long-form decision narrative at /projects/[slug]/narrative */
  deepDive?: string;
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
    period: 'Feb - May 2026\nSep - Dec 2025',
    stack: ['TypeScript', 'RAG', 'Gemini', 'Prompt Eng', 'Microservices'],
    hero: 'Restaurant onboarding from 30 minutes to 5.',
    problem: 'SMB restaurants needed SevenRooms-grade reservation systems but could not afford them, and existing no-code tools required 30+ minutes of manual metadata config per merchant, killing time-to-value before users even saw the product.',
    build: 'Architected a zero-to-one reservation template inside a 1-click no-code platform. Hybrid AI architecture: deterministic rules with Gemini LLM handling the ambiguous cases. 80+ metadata fields across 11 categories, generated from a single prompt. A 3-layer fallback ensured the LLM never blocked critical paths.',
    impact: [
      '80% onboarding time reduction (30 min to 5 min), from replacing a multi-step wizard with a single prompt plus a post-generation review screen',
      '70% LLM cost reduction via caching and intelligent fallback',
      '99.5% uptime across 50+ active restaurant partners',
      '85% weekly retention, 4.2/5 CSAT in 8 weeks',
      '25+ interviews found merchants distrusted AI-generated config they could not verify, the reason the architecture stayed hybrid, not all-LLM, and sized a $2M+ TAM',
    ],
    accent: 'vermilion',
    deepDive: '/projects/lextrack/narrative',
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
    role: 'Product Lead · 3-person team',
    period: 'Apr 2026 - Present',
    stack: ['Next.js', 'FastAPI', 'OpenAI', 'Pydantic', 'Tesseract OCR'],
    hero: 'AI tax filing for 1.5M international students in the US.',
    problem: 'F-1/J-1 visa holders face the same tax filing nightmare every April: confusing IRS rules, FICA tax illegally withheld by employers (IRC § 3121(b)(19)), and a market underserved by TurboTax. Manual prep takes 35+ minutes per return and math errors are common.',
    build: 'Hybrid execution engine. LLM agents handle reasoning (residency determination, treaty evaluation, document parsing) while pure Python handles the math (tax brackets, regulatory lookups). 100% mathematical accuracy guaranteed because the deterministic zone never touches the LLM. OCR pipeline (Tesseract and pdfplumber) extracts W-2, 1042-S, and I-94 data automatically. Generates official IRS forms (1040-NR, 8843, 8833) as PDFs.',
    impact: [
      'Filing time cut from 35 min to under 10 min in self-testing, user timing data is the next validation step',
      '90% reduction in manual data entry',
      '100% math accuracy via deterministic execution zone',
      'FICA recovery module identifies illegal withholding',
    ],
    accent: 'paper',
    deepDive: '/projects/quadtax/narrative',
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
    build: 'Automated analytics platform. Pandas handles RFM segmentation and cohort retention. Gemini API generates strategic insights and revenue opportunities from the structured output. Streamlit delivers it as an interactive dashboard non-technical execs can actually use.',
    impact: [
      '95% reporting time reduction (4 hr to 5 min)',
      '110K+ transactions processed',
      '96K+ customer profiles served',
      'Churn prediction AUC 0.82, a 15% improvement in retention targeting',
    ],
    accent: 'pulp',
    deepDive: '/projects/analytics/narrative',
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
    role: 'Product Lead · 2-person team',
    period: '2025',
    stack: ['React', 'FastAPI', 'OpenAI', 'Embeddings'],
    hero: 'Plain-English explanations for any GitHub repo.',
    problem: 'Onboarding to a new codebase is the worst part of any engineering job. README files lie, code comments are stale, and ramp-up time bleeds productivity for weeks.',
    build: 'AI-powered repo analyzer. Pulls any public GitHub repo, extracts code structure (functions, classes, imports across 11 languages), generates a project summary, and lets users ask context-aware questions with file references in the answers.',
    impact: [
      '0 hallucinated file paths returned, a validation layer checks every citation before it reaches the answer',
      'Built the extraction engine before validating that users found the Q&A answers useful, the retro on this project is measuring that next, not adding more languages',
      'Sub-second subsequent queries on any previously analyzed repository',
    ],
    accent: 'pulp',
    deepDive: '/projects/squirrel/narrative',
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/Squirrel-AI',
    },
  },
  {
    id: 'equiply',
    index: '05',
    title: 'Equiply Asset Intelligence',
    role: 'Optimal Tier submission',
    period: 'Hiring tournament',
    stack: ['React', 'Vite', 'Tailwind CSS', 'PapaParse', 'Custom SVG charts'],
    hero: 'Hospital equipment CSVs turned into real-time lifecycle intelligence.',
    problem: 'Hospitals struggle with dirty, incomplete equipment data. The tournament brief provided a raw CSV of equipment records, manufacturer, model, and serial number, and asked for two enriched fields: manufactured date and device type. No external API or database was provided.',
    build: 'A privacy-first, 100% client-side data pipeline and EAM dashboard. A heuristic extraction engine decodes manufacture dates hidden inside proprietary serial formats across 50+ medical brands, a custom medical dictionary maps generic model names to standard device categories, and a predictive lifecycle engine flags every asset as Good, Warning, or Critical by device-specific lifespan. Confidence scoring flags low-certainty rows for human audit, and a one-click export produces the clean enriched CSV the minimum tier asked for.',
    impact: [
      '801 medical devices enriched across 25+ device types',
      '478 units flagged critical and 207 approaching end of life, replacement planning at a glance',
      '52% of serials parsed with high confidence, the rest visibly flagged at 30% for human audit instead of silently guessed',
      '100% client-side, equipment data never leaves the browser',
    ],
    accent: 'pulp',
    deepDive: '/projects/equiply/narrative',
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/equiply-intelligence',
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
    period: 'Feb 2026 - May 2026',
    location: 'New York, NY',
  },
  {
    company: 'LexTrack AI',
    role: 'Product Manager (Capstone)',
    period: 'Sep 2025 - Dec 2025',
    location: 'New York, NY',
  },

] as const;

export const education = [
  {
    school: 'New York University',
    degree: 'M.S. Technology Management',
    detail: 'GPA 3.75 · Sep 2024 - May 2026',
  },
  {
    school: 'SRM Institute of Science and Technology',
    degree: 'B.Tech Computer Science (Cloud Computing)',
    detail: 'Sep 2020 - May 2024',
  },
] as const;

export const certifications = [
  'CSPO: Certified Scrum Product Owner',
  'CSM: Certified Scrum Master',
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
// TESTIMONIALS — social proof strip
// ============================================
export const testimonials = [
  {
    quote: "Hamid owned the LexTrack reservation template end-to-end, scoped the hybrid AI architecture, ran the user interviews, wrote the code, shipped, and documented everything in 8 weeks. Most interns pick one of those things.",
    name: "Santrupth Vedanthi",
    title: "CEO, LexTrack AI",
  },
] as const;

// ============================================
// SKILLS — for the chat context + skills strip
// ============================================
export const skills = {
  ai: ['LLM Integration (GPT-4, Claude, Gemini)', 'RAG Systems', 'Prompt Engineering', 'Pydantic Structured Outputs', 'FastAPI', 'Multi-Agent Orchestration', 'Vector Databases', 'Model Evaluation', 'Cost Optimization'],
  product: ['0-to-1 Development', 'User Research', 'RICE Prioritization', 'Roadmapping', 'PRD Writing', 'Agile/Scrum (CSPO, CSM)', 'Jira', 'Figma', 'A/B Testing'],
  engineering: ['Python', 'TypeScript', 'Next.js', 'React', 'Node.js', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'Azure', 'CI/CD'],
  data: ['SQL', 'Pandas', 'NumPy', 'Cohort Analysis', 'Churn Modeling', 'OCR (Tesseract)', 'ETL Pipelines'],
} as const;
