/**
 * personal-data.ts
 *
 * Single source of truth for the entire portfolio.
 * Extracted from resume, LinkedIn, and project READMEs.
 * Update this file and the entire site updates.
 */

export const profile = {
  name: 'Hamid Rizvi',
  location: 'New York, NY',
  email: 'hamidrizvi@stern.nyu.edu',
  linkedin: 'https://linkedin.com/in/hamid-rizvi',
  github: 'https://github.com/hamidrizvi4',

  // Path to the downloadable resume PDF (served from /public)
  resume: '/Hamid-Rizvi-Resume.pdf',

  // Status line for the contact page
  availability: 'NYU \'26, open to Forward Deployed Engineer and AI Engineer roles. Available now.',

  // /about, one entry per paragraph. Every claim traces to lib/hamid-knowledge.md.
  bio: [
    'I build AI systems for workflows where a wrong answer is expensive, and I stay with them until they hold up in production.',
    'At LexTrack AI I ran 25+ merchant interviews and found the real blocker: 30+ minutes of manual setup per merchant. I shipped a hybrid rules-plus-LLM template that cut it to 5, then owned it in production as an intern, where a 3-layer fallback held 99.5% uptime across 50+ restaurant partners.',
    'Since then I have built ResidenceOS, where a vision model reads NYC inspection reports but versioned code computes the legal deadlines (pre-launch, no customers yet), and a support agent that routes on stakes instead of model confidence.',
    "Background: a B.Tech in Computer Science (cloud computing), an M.S. in Management of Technology from NYU, and a product background. I led the LexTrack capstone as PM and hold CSPO and CSM certifications. I sit between the customer's problem, the system architecture, and production reliability.",
  ],
} as const;

// ============================================
// CASE STUDIES — the seven projects, in display priority order
// ============================================
export interface CaseStudy {
  id: string;
  problem: string;
  build: string;
  impact: string[];
  links?: { label: string; url: string }[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'lextrack',
    problem: 'SMB restaurants needed SevenRooms-grade reservation systems but could not afford them, and existing no-code tools required 30+ minutes of manual metadata config per merchant, killing time-to-value before users even saw the product.',
    build: 'Architected a zero-to-one reservation template inside a 1-click no-code platform. Hybrid AI architecture: deterministic rules with Gemini LLM handling the ambiguous cases. 80+ metadata fields across 11 categories, generated from a single prompt. A 3-layer fallback ensured the LLM never blocked critical paths.',
    impact: [
      'Ran 25+ merchant interviews and found merchants distrusted AI-generated config they could not verify, so I kept the architecture hybrid: deterministic rules for every field with one right answer, Gemini only for the ambiguous rest',
      'Replaced a multi-step wizard with one prompt plus a review screen that surfaces the riskiest fields first, cutting onboarding 80% (30 min to 5 min)',
      'Built a 3-layer fallback (primary model, cached response, deterministic default) so a provider outage never blocks a merchant: 99.5% uptime across 50+ active restaurant partners',
      'Cut LLM cost 70% with caching and fallback, then a further 40% as an intern by running model evals across GPT-4, Claude, and Gemini while holding sub-2s p95 latency',
      'Adoption: 0 to 50+ active users in 8 weeks, 85% weekly retention, 4.2/5 CSAT',
    ],
  },
  {
    id: 'residenceos',
    problem: "New York property managers run a stack of overlapping compliance laws, each on its own clock: LL97 emissions penalties ($268 per ton over the cap, every year), LL11 facades, LL152 gas piping, LL84 and LL88 energy reporting, HPD registration. The city tracks some of these. LL152 it does not, so the only evidence a deadline exists is an inspection report in someone's inbox. AppFolio and Buildium assume clean data and know nothing of NYC rules, and the compliance trackers scrape city databases, so they cannot see the obligations that have none.",
    build: "An all-in-one operations platform for NYC firms with 5 to 500 units: buildings, units, leases, maintenance, rent collection, communications, and reporting. A manager uploads a scanned lease or inspection report, a vision model proposes structured fields, and nothing becomes official until a person confirms it. When a report implies a recurring deadline with no city database behind it, the obligation lands on the portfolio compliance view with the due date computed by a versioned TypeScript rule table and the working shown. The model reads and proposes. Plain code and people decide.",
    impact: [
      '4 roles (firm admin, manager, board member, tenant), each enforced by the database, not the UI',
      '14/14 field accuracy on extraction fixtures, matching the baseline model at about one ninth of the cost',
      '18 findings from an independent audit, all worked through and verified against production',
      '14 test suites with 300+ automated checks, run as one serial pass before every release',
      'Published per-door pricing from $49/mo, no unit minimum, no quote gate',
      'Status: live demo, pre-launch, no paying customers yet. All data is synthetic and payments run in Stripe test mode',
    ],
    links: [
      { label: 'LL152 and the compliance deadline with no city database', url: 'https://residencesystem.vercel.app/writing/ll152-nyc-compliance-deadline' },
      { label: 'Capability is the easy half', url: 'https://residencesystem.vercel.app/writing/what-ai-is-not-allowed-to-do' },
      { label: "The $268 question hanging over New York's buildings", url: 'https://residencesystem.vercel.app/writing/ll97-nyc-compliance-deadline' },
      { label: 'Onboarding a NYC property management firm without a CSV importer', url: 'https://residencesystem.vercel.app/writing/onboarding-a-nyc-property-management-firm' },
    ],
  },
  {
    id: 'triage',
    problem: 'Every API company faces the same support-ops problem. A large tier of repetitive, doc-answerable tickets sits next to a smaller tier of billing, security, and sales tickets where a wrong autonomous answer is expensive. Most teams give every ticket the same attention regardless of which tier it is in.',
    build: 'An agent loop with five tools, grounded in real public developer documentation rather than a toy dataset. A rules-based routing engine, not the model itself, makes the final call: billing, security, sales, and bug-report tickets always escalate to a human regardless of model confidence, everything else routes on a blended confidence threshold. Every tool call is logged for a full audit trail, with a review queue, a ticket dashboard, and a doc-gap view that surfaces where the documentation itself is thin.',
    impact: [
      'Ran the shipped build through a 7-point external code review and worked it the way a senior engineer works one: verified every claim independently instead of trusting the write-up',
      'Found and closed a live pre-launch security exposure: Row-Level Security disabled on all six tables, plus an unintended full-privilege grant to unauthenticated roles',
      'Measured, not guessed, the free-to-paid model tradeoff: $0.25 across 40 tickets cut the incomplete rate from 50% to 7.5%',
      'Fixed 12 verified bugs across the build, the audit, and the paid rerun, including a structural issue that made core logic untestable',
    ],
  },
  {
    id: 'quadtax',
    problem: 'F-1/J-1 visa holders face the same tax filing nightmare every April: confusing IRS rules, FICA tax illegally withheld by employers (IRC § 3121(b)(19)), and a market underserved by TurboTax. Manual prep takes 35+ minutes per return and math errors are common.',
    build: 'Hybrid execution engine. LLM agents handle reasoning (residency determination, treaty evaluation, document parsing) while pure Python handles the math (tax brackets, regulatory lookups). 100% mathematical accuracy guaranteed because the deterministic zone never touches the LLM. OCR pipeline (Tesseract and pdfplumber) extracts W-2, 1042-S, and I-94 data automatically. Generates official IRS forms (1040-NR, 8843, 8833) as PDFs.',
    impact: [
      'Drew a hard line: LLM agents parse documents and reason about residency and treaties, deterministic Python does every calculation, so math accuracy is 100% by construction and unit-testable against IRS examples',
      'Built the OCR intake (Tesseract, pdfplumber, Pydantic-validated structured outputs) so a failed extraction becomes a confirm-this-field prompt, never a wrong number: 90% less manual entry',
      'Ran a 5-person beta on real documents that drove two major iteration cycles on the intake flow',
      'Filing time from 35 min to under 10 in self-testing only; timing data from real users is the next validation step',
      'FICA recovery module flags employer withholding that is illegal under IRC § 3121(b)(19)',
    ],
  },
  {
    id: 'analytics',
    problem: 'Retail leadership teams burn entire workdays pulling RFM segments, churn risk scores, and cohort retention by hand in Excel. By the time the deck is ready, the data is stale.',
    build: 'Automated analytics platform. Pandas handles RFM segmentation and cohort retention. Gemini API generates strategic insights and revenue opportunities from the structured output. Streamlit delivers it as an interactive dashboard non-technical execs can actually use.',
    impact: [
      'First prototype let the LLM read raw data and it fabricated numbers, so I split it: Pandas computes every metric, Gemini only explains validated output',
      '95% reporting time reduction (4 hr to 5 min) on 110K+ real transactions and 96K+ customer profiles',
      'Churn model at AUC 0.82 on held-out data, a 15% improvement in retention targeting over the rule-based baseline',
      'Honest scope: a personal project; the churn model has not yet driven a real retention decision',
    ],
  },
  {
    id: 'squirrel',
    problem: 'Onboarding to a new codebase is the worst part of any engineering job. README files lie, code comments are stale, and ramp-up time bleeds productivity for weeks.',
    build: 'AI-powered repo analyzer. Pulls any public GitHub repo, extracts code structure (functions, classes, imports across 11 languages), generates a project summary, and lets users ask context-aware questions with file references in the answers.',
    impact: [
      '0 hallucinated file paths returned, a validation layer checks every citation before it reaches the answer',
      'Built the extraction engine before validating that users found the Q&A answers useful, the retro on this project is measuring that next, not adding more languages',
      'Sub-second subsequent queries on any previously analyzed repository',
    ],
  },
  {
    id: 'equiply',
    problem: 'Hospitals struggle with dirty, incomplete equipment data. The tournament brief provided a raw CSV of equipment records, manufacturer, model, and serial number, and asked for two enriched fields: manufactured date and device type. No external API or database was provided.',
    build: 'A privacy-first, 100% client-side data pipeline and EAM dashboard. A heuristic extraction engine decodes manufacture dates hidden inside proprietary serial formats across 50+ medical brands, a custom medical dictionary maps generic model names to standard device categories, and a predictive lifecycle engine flags every asset as Good, Warning, or Critical by device-specific lifespan. Confidence scoring flags low-certainty rows for human audit, and a one-click export produces the clean enriched CSV the minimum tier asked for.',
    impact: [
      '801 medical devices enriched across 25+ device types',
      '478 units flagged critical and 207 approaching end of life, replacement planning at a glance',
      '52% of serials parsed with high confidence, the rest visibly flagged at 30% for human audit instead of silently guessed',
      '100% client-side, equipment data never leaves the browser',
    ],
  },
];

// ============================================
// EXPERIENCE TIMELINE — /about
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
    role: 'Lead AI Developer & Product Manager (capstone)',
    period: 'Sep 2025 - Dec 2025',
    location: 'New York, NY',
  },
] as const;

export const education = [
  {
    school: 'New York University',
    degree: 'M.S. in Management of Technology',
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
// SKILLS — /about; mirrors "## Skills" in lib/hamid-knowledge.md
// ============================================
export const skills = [
  {
    group: 'AI systems',
    items: ['LLM integration (OpenAI, Anthropic, Gemini)', 'RAG', 'Agentic workflows and tool use', 'Structured outputs (Pydantic)', 'Vector databases (pgvector)', 'Model evaluation', 'Guardrails', 'Cost and latency optimization', 'OCR (Tesseract)'],
  },
  {
    group: 'Engineering',
    items: ['Python', 'TypeScript', 'JavaScript', 'Next.js', 'React', 'FastAPI', 'Node.js', 'PostgreSQL', 'Supabase (Row-Level Security)', 'Stripe', 'REST APIs', 'Docker', 'AWS', 'CI/CD', 'Git'],
  },
  {
    group: 'Customer and product',
    items: ['Discovery interviews', 'Scoping', 'RICE prioritization', 'PRD writing', 'A/B testing', 'Cohort analysis', 'Go-to-market'],
  },
] as const;
