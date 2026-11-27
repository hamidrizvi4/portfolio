/**
 * projects.ts
 *
 * The work index for the new site: tier, order, and presentation metadata
 * only. The write-ups themselves stay in lib/personal-data.ts (caseStudies)
 * and lib/deep-dives.ts, keyed by the same slug.
 *
 * Tiers follow the FDE "depth over volume" structure: LexTrack is
 * experience, three projects are featured, the rest is earlier work.
 *
 * Images live under public/work/<slug>/. A project without them renders a
 * tinted placeholder card in every slot (components/home/ProjectVisual.tsx).
 * TODO(hamid): images for the earlier-work projects.
 */

export type Tier = 'experience' | 'featured' | 'earlier';

export interface Shot {
  src: string;
  alt: string;
  /** Width / height. Detail shots keep their natural shape in galleries. */
  ratio?: number;
  /** false: case study only, left out of the home "Up close" strip. */
  upClose?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  year: string;
  role: string;
  /** One-line category shown in work rows. */
  category: string;
  tier: Tier;
  /** Status or disclosure line shown under the case study title. */
  note?: string;
  /** 16:9 case study hero. */
  hero?: Shot;
  /** 4:5 hover preview for the work list. */
  preview?: Shot;
  /** Detail shots for the "Up close" gallery. */
  details?: Shot[];
}

export const projects: Project[] = [
  {
    slug: 'lextrack',
    title: 'LexTrack AI',
    year: '2025 — 2026',
    role: 'AI/ML Product Engineering Intern · Capstone Lead AI Developer & PM',
    category: 'Production RAG, hybrid rules-plus-LLM',
    tier: 'experience',
    hero: {
      src: '/work/lextrack/team.jpeg',
      alt: 'Hamid and the LexTrack AI capstone team at NYU Tandon, standing beside the project poster with their faculty advisor.',
    },
    preview: {
      src: '/work/lextrack/poster.jpeg',
      alt: 'LexTrack AI capstone poster: sponsor vision, project scope, key findings, the reservation app user workflow, and the pricing model.',
    },
    details: [
      {
        src: '/work/lextrack/ai-metadata.png',
        alt: 'AI metadata enrichment feature: a user describes their restaurant in one line, the system generates the configuration with suggested fields, and the reservation app renders a live preview.',
        ratio: 2032 / 1008,
      },
      {
        src: '/work/lextrack/poster.jpeg',
        alt: 'LexTrack AI capstone poster: sponsor vision, project scope, key findings, the reservation app user workflow, and the pricing model.',
        ratio: 1179 / 860,
      },
    ],
  },
  {
    slug: 'residenceos',
    title: 'ResidenceOS',
    year: '2026',
    role: 'Solo build',
    category: 'Document intelligence for NYC compliance',
    tier: 'featured',
    note: 'Pre-launch. The live demo runs on a synthetic portfolio with Stripe in test mode, and there are no paying customers yet.',
    hero: {
      src: '/work/residenceos/hero.png',
      alt: 'ResidenceOS compliance table: obligations by law, building, due date, and status, with a source column showing whether each came from an uploaded document, a city database, or manual entry.',
    },
    preview: {
      src: '/work/residenceos/preview.png',
      alt: "ResidenceOS portfolio view for a firm admin: an AI compliance briefing, a compliance heatmap by building, and the items needing attention.",
    },
    details: [
      {
        src: '/work/residenceos/firm-admin.png',
        alt: "ResidenceOS portfolio view for a firm admin: a model-written compliance briefing ranking overdue, at-risk, and upcoming obligations by law and building, above the compliance heatmap.",
        ratio: 2855 / 1998,
      },
      {
        src: '/work/residenceos/board-member.png',
        alt: 'ResidenceOS building view for a board member: units on file, occupancy, and a compliance summary with due dates.',
        ratio: 2880 / 2000,
      },
      {
        src: '/work/residenceos/tenant.png',
        alt: "ResidenceOS tenant view of one unit: monthly rent, lease end date, and open requests.",
        ratio: 2880 / 2000,
      },
      {
        src: '/work/residenceos/maintenance.png',
        alt: 'ResidenceOS maintenance list with urgency, category, age against the acknowledgement SLA, and assigned vendor for each request.',
        ratio: 2880 / 2000,
      },
    ],
  },
  {
    slug: 'triage',
    title: 'Claude Support Triage Agent',
    year: '2026',
    role: 'Solo build, evaluation, and audit',
    category: 'Multi-agent triage, scored against hand labels',
    tier: 'featured',
    note: "Independent portfolio project, not affiliated with or endorsed by Anthropic. Built entirely on Anthropic's public developer documentation. Tickets are synthetic and the labels are mine.",
    hero: {
      src: '/work/triage/hero.png',
      alt: 'The triage agent\'s live intro site: "Resolves what the docs answer. Routes what they can\'t." Beside it, a run-triage card shows ticket 07 of 40 calling search_docs, check_status, and submit_resolution, scoring 0.87 confidence against the 0.8 threshold, and auto-resolving, decided by route(), not the model.',
    },
    preview: {
      src: '/work/triage/preview.png',
      alt: 'One triaged ticket: three tool calls, a confidence of 0.87 against the 0.8 auto-resolve threshold, and an auto-resolved verdict decided by route(), not the model.',
    },
    details: [
      {
        src: '/work/triage/hero.png',
        alt: 'The triage agent\'s intro page: "Resolves what the docs answer. Routes what they can\'t." Beside it, a run-triage card scores one ticket at 0.87 confidence against the 0.8 threshold and auto-resolves it, decided by route(), not the model.',
        ratio: 2880 / 1620,
      },
      {
        src: '/work/triage/evaluation.png',
        alt: 'Evaluation section of the triage agent\'s site, "Scored against hand labels, including what didn\'t work": must-escalate recall 93.1% (95% CI 86–99%), 1.7 unsafe auto-resolves per run, 84.7% auto-resolve precision, and 26.7% coverage on 40 hand-labeled tickets × 3 seeds.',
        ratio: 2280 / 1260,
      },
      {
        src: '/work/triage/dashboard.png',
        alt: 'Triage agent reporting dashboard: auto-resolve rate, escalation rate, documentation-gap rate, average time to draft, confidence calibration, and an escalation breakdown.',
        ratio: 2560 / 1600,
      },
      {
        src: '/work/triage/queue.png',
        alt: 'Triage agent review queue: each ticket with its category, routing reason, confidence, and age.',
        ratio: 2928 / 1736,
        upClose: false,
      },
      {
        src: '/work/triage/drawer.png',
        alt: 'One ticket in the triage agent: the original ticket, the reasoning trace of tool calls, the confidence breakdown against the 0.80 auto-resolve threshold, and reject, edit, and approve controls.',
        ratio: 959 / 1597,
        upClose: false,
      },
    ],
  },
  {
    slug: 'quadtax',
    title: 'QuadTax',
    year: '2026',
    role: 'Product lead · 3-person team',
    category: 'AI tax filing, deterministic math',
    tier: 'featured',
    hero: {
      src: '/work/quadtax/hero.png',
      alt: 'QuadTax landing page, "Photograph your W-2. We handle the rest.", with phone mockups of the document upload and personal details steps.',
    },
    preview: {
      src: '/work/quadtax/results.png',
      alt: 'QuadTax results screen for a sample return: federal, FICA, and New York refund amounts, and the filing package ready to download.',
    },
    details: [
      {
        src: '/work/quadtax/landing-mobile.png',
        alt: 'QuadTax landing page on a phone.',
        ratio: 388 / 755,
      },
      {
        src: '/work/quadtax/how-it-works.png',
        alt: 'QuadTax "How it works" section on a phone: snap your documents, then AI reads every box.',
        ratio: 387 / 807,
      },
      {
        src: '/work/quadtax/results.png',
        alt: 'QuadTax results screen for a sample return: federal, FICA, and New York refund amounts, and the filing package ready to download.',
        ratio: 430 / 932,
      },
    ],
  },
  {
    slug: 'analytics',
    title: 'AI Purchase Analytics',
    year: '2025',
    role: 'Personal project',
    category: 'Pandas computes, Gemini explains',
    tier: 'earlier',
  },
  {
    slug: 'squirrel',
    title: 'Squirrel AI',
    year: '2025',
    role: '2-person team',
    category: 'Codebase Q&A with validated citations',
    tier: 'earlier',
  },
  {
    slug: 'equiply',
    title: 'Equiply Asset Intelligence',
    year: 'Tournament',
    role: 'Optimal Tier submission',
    category: 'Client-side data enrichment',
    tier: 'earlier',
  },
];

export const byTier = (tier: Tier) => projects.filter((p) => p.tier === tier);

/** "Up close" strip: real detail shots only, no placeholders, in this project order. */
const UP_CLOSE_ORDER = ['triage', 'residenceos', 'quadtax', 'lextrack'];

export const galleryShots = UP_CLOSE_ORDER.flatMap((slug) => {
  const p = projects.find((x) => x.slug === slug)!;
  return (p.details ?? []).filter((shot) => shot.upClose !== false).map((shot) => ({ project: p, shot }));
});
