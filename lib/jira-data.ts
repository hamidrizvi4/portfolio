/**
 * jira-data.ts
 *
 * Transforms the site's real content (lib/personal-data.ts + lib/deep-dives.ts)
 * into the "Jira project" shape: epics, stories with issue keys, and a
 * timeline of phases. This is a derived layer, not hand-copied content —
 * every number and quote traces back to the two source files, so editing
 * those stays the single source of truth.
 */

import { caseStudies, type CaseStudy } from './personal-data';
import { deepDives, type DeepDive, type Decision, type TamSlide, type Outcome } from './deep-dives';

export type IssueStatus = 'Done' | 'In Progress' | 'To Do';

export interface JiraStory {
  key: string;
  title: string;
  status: IssueStatus;
  body: string;
}

export interface JiraEpic {
  key: string;
  title: string;
  summary: string;
  status: IssueStatus;
  stories: JiraStory[];
}

export interface TimelinePhase {
  label: string;
  window: string; // human-readable date range, e.g. "Sep 2025"
  status: IssueStatus;
  /** 0-1 start/end position along the project's own timeline track */
  startPct: number;
  endPct: number;
}

export interface ProjectSpace {
  slug: string;
  keyPrefix: string; // "LEX", "QTX", "ANL", "SQL"
  index: string;
  title: string;
  role: string;
  period: string;
  stack: string[];
  hero: string;
  problem: string;
  build: string;
  impact: string[];
  links: { label: string; url: string; type: 'github' | 'demo' | 'deep-dive' }[];
  epics: JiraEpic[];
  timeline: TimelinePhase[];
  retro: string[];
  lead: string;
  /** Market sizing, pricing, and unit economics — only present where the deep-dive has it (currently QuadTax). */
  tamSlide?: TamSlide;
  /** Stat+label outcome pairs from the deep-dive, distinct from the plain impact bullets. */
  outcomes: Outcome[];
}

const KEY_PREFIXES: Record<string, string> = {
  lextrack: 'LEX',
  quadtax: 'QTX',
  analytics: 'ANL',
  squirrel: 'SQL',
  equiply: 'EQP',
};

function decisionToEpic(decision: Decision, epicIndex: number, prefix: string): JiraEpic {
  const epicKey = `${prefix}-${epicIndex * 5 + 1}`;
  const storyDefs: { title: string; body: string }[] = [
    { title: 'Setup: the situation that forced a choice', body: decision.setup },
    { title: 'Tradeoff: what was genuinely in tension', body: decision.tradeoff },
    { title: 'The call: what I decided and why', body: decision.call },
    { title: 'Result: what happened because of it', body: decision.result },
  ];

  return {
    key: epicKey,
    title: decision.title,
    summary: decision.setup,
    status: 'Done',
    stories: storyDefs.map((s, i) => ({
      key: `${prefix}-${epicIndex * 5 + 2 + i}`,
      title: s.title,
      status: 'Done',
      body: s.body,
    })),
  };
}

// Coarse timeline phases per project, derived from period + decision order.
// Dates are quarter/month-level, matching the precision the résumé actually
// supports — no fabricated day-level precision.
const TIMELINE_BY_SLUG: Record<string, TimelinePhase[]> = {
  lextrack: [
    { label: 'Discovery & 25+ interviews', window: 'Sep 2025', status: 'Done', startPct: 0, endPct: 0.16 },
    { label: 'Architecture decisions', window: 'Oct 2025', status: 'Done', startPct: 0.16, endPct: 0.34 },
    { label: 'Build & capstone launch', window: 'Nov – Dec 2025', status: 'Done', startPct: 0.34, endPct: 0.55 },
    { label: 'Production scaling (internship)', window: 'Feb – May 2026', status: 'Done', startPct: 0.6, endPct: 1 },
  ],
  quadtax: [
    { label: 'Problem scoping', window: 'Apr 2026', status: 'Done', startPct: 0, endPct: 0.18 },
    { label: 'Deterministic-vs-LLM architecture', window: 'Apr 2026', status: 'Done', startPct: 0.18, endPct: 0.38 },
    { label: 'OCR pipeline & intake build', window: 'May 2026', status: 'Done', startPct: 0.38, endPct: 0.62 },
    { label: '5-person beta', window: 'Jun 2026', status: 'Done', startPct: 0.62, endPct: 0.8 },
    { label: 'State returns (next)', window: 'Present →', status: 'To Do', startPct: 0.82, endPct: 1 },
  ],
  analytics: [
    { label: 'Prototype & validation', window: 'Early Oct 2025', status: 'Done', startPct: 0, endPct: 0.3 },
    { label: 'Dashboard build', window: 'Mid Oct 2025', status: 'Done', startPct: 0.3, endPct: 0.65 },
    { label: 'Churn model & ship', window: 'Late Oct 2025', status: 'Done', startPct: 0.65, endPct: 1 },
  ],
  squirrel: [
    { label: 'Extraction engine', window: 'Early 2025', status: 'Done', startPct: 0, endPct: 0.34 },
    { label: 'Citation system', window: 'Mid 2025', status: 'Done', startPct: 0.34, endPct: 0.66 },
    { label: 'Caching layer', window: 'Late 2025', status: 'Done', startPct: 0.66, endPct: 1 },
  ],
  // Timed within Equiply's hiring tournament window rather than calendar
  // dates, since the sprint's phases are what the résumé actually supports.
  equiply: [
    { label: 'Brief scoping', window: 'Tournament', status: 'Done', startPct: 0, endPct: 0.25 },
    { label: 'Heuristic extraction pipeline', window: 'Tournament', status: 'Done', startPct: 0.25, endPct: 0.62 },
    { label: 'Dashboard & Optimal Tier submission', window: 'Tournament', status: 'Done', startPct: 0.62, endPct: 1 },
  ],
};

function buildProjectSpace(cs: CaseStudy, dive: DeepDive | undefined): ProjectSpace {
  const prefix = KEY_PREFIXES[cs.id] ?? cs.id.slice(0, 3).toUpperCase();

  const epics = (dive?.decisions ?? []).map((d, i) => decisionToEpic(d, i, prefix));

  const links: ProjectSpace['links'] = [];
  if (cs.cta) {
    links.push({ label: cs.cta.label, url: cs.cta.href, type: cs.cta.type === 'github' ? 'github' : 'demo' });
  }
  if (cs.deepDive) {
    links.push({ label: 'Full deep-dive narrative', url: cs.deepDive, type: 'deep-dive' });
  }

  return {
    slug: cs.id,
    keyPrefix: prefix,
    index: cs.index,
    title: cs.title,
    role: cs.role,
    period: cs.period,
    stack: cs.stack,
    hero: cs.hero,
    problem: cs.problem,
    build: cs.build,
    impact: cs.impact,
    links,
    epics,
    timeline: TIMELINE_BY_SLUG[cs.id] ?? [],
    retro: dive?.retro ?? [],
    lead: 'Hamid Rizvi',
    tamSlide: dive?.tamSlide,
    outcomes: dive?.outcomes ?? [],
  };
}

export const projectSpaces: ProjectSpace[] = caseStudies.map((cs) =>
  buildProjectSpace(
    cs,
    deepDives.find((d) => d.slug === cs.id)
  )
);

export function getProjectSpace(slug: string): ProjectSpace | undefined {
  return projectSpaces.find((p) => p.slug === slug);
}

export const STATUS_ORDER: IssueStatus[] = ['To Do', 'In Progress', 'Done'];
