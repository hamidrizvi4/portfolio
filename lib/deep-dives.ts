/**
 * deep-dives.ts
 *
 * Long-form case study content for /work/[slug] pages.
 *
 * Structure per study (the PM-interview arc):
 *   context → my role → the hard decisions (setup / tradeoff / call / result)
 *   → outcomes → what I'd do differently
 *
 * Every number here is sourced from the resume — keep the two in sync.
 */

export interface Decision {
  title: string;
  setup: string; // The situation that forced a choice
  tradeoff: string; // What was genuinely in tension
  call: string; // What I decided and why
  result: string; // What happened because of it
}

export interface Outcome {
  stat: string;
  label: string;
}

export interface DeepDive {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  role: string;
  period: string;
  stack: string[];
  context: string[];
  myRole: string[];
  decisions: Decision[];
  outcomes: Outcome[];
  retro: string[]; // What I'd do differently — numbered, honest
  cta?: {
    type: 'github' | 'demo';
    label: string;
    href: string;
  };
  nextSlug: string; // Cross-link to the other deep dive
}

export const deepDives: DeepDive[] = [
  // ==========================================================
  // LEXTRACK
  // ==========================================================
  {
    slug: 'lextrack',
    index: '01',
    title: 'LexTrack AI',
    subtitle:
      'A 0→1 restaurant reservation template inside a 1-click no-code platform — and the architecture decisions that cut onboarding from 30 minutes to 5.',
    role: 'PM & Developer (Capstone) → AI/ML Product Engineering Intern',
    period: 'Sep 2025 — Present · New York',
    stack: ['TypeScript', 'RAG', 'Gemini', 'Prompt Engineering', 'Microservices'],
    context: [
      'SMB restaurants want what SevenRooms and OpenTable give the big chains — reservations, waitlists, guest profiles — but the pricing doesn\'t work at their scale. LexTrack\'s bet is a 1-click no-code platform where a merchant generates a custom app instead of buying a legacy one.',
      'The catch: "1-click" was marketing, not reality. Standing up a reservation app meant configuring 80+ metadata fields across 11 categories — table layouts, service windows, party-size rules, deposit policies. Merchants were spending 30+ minutes in setup, and time-to-value is where SMB products die. The product worked; the onboarding killed it.',
    ],
    myRole: [
      'I led the reservation template as the capstone PM — a team of 3 engineers and 1 designer, with me writing code alongside them. I owned the problem definition, ran 25+ customer interviews and the competitive analysis (Toast, Square, Lightspeed), made the architecture calls below, and carried the product from zero to 50+ active users in 8 weeks.',
      'After the capstone shipped, LexTrack brought me back as an AI/ML Product Engineering intern. I now own the production side of the same system: RAG pipelines, model evaluation, and the cost/latency budget.',
    ],
    decisions: [
      {
        title: 'Hybrid AI, not LLM-everywhere',
        setup:
          'The obvious 2025 answer to "80+ config fields is too many" was to point an LLM at all of them. Our first prototype did exactly that — and it was slow, expensive, and confidently wrong in ways merchants couldn\'t predict. A table-count field doesn\'t need a language model. A free-text "describe your service style" field does.',
        tradeoff:
          'Pure LLM was one codepath and fast to build, but every generated config carried inference cost, multi-second latency, and a non-zero hallucination rate on fields that have exactly one right answer. Splitting the system meant maintaining two codepaths and deciding, field by field, which side owns it — more engineering up front for less risk per onboarding.',
        call:
          'I split the architecture: deterministic rules generate every field that has a verifiable right answer, and Gemini handles only the genuinely ambiguous ones. One prompt, narrowly scoped, with rules as the safety net. The team pushed back on the extra surface area; the interview data — merchants distrusted "magic" they couldn\'t verify — settled it.',
        result:
          'Response times landed at 1–2 seconds and LLM costs dropped 70% versus the all-LLM prototype, through prompt engineering, a caching strategy, and intelligent fallback. The hybrid split is now the template\'s standard architecture.',
      },
      {
        title: 'One prompt, not a wizard',
        setup:
          'For the merchant-facing flow we had two credible designs: a guided multi-step wizard (familiar, each field explained, every answer user-confirmed) or a single-prompt flow where the merchant describes their restaurant in a sentence and the system generates all 80+ fields at once.',
        tradeoff:
          'The wizard was safer — errors get caught at entry, and nobody has to trust generation. But it was also exactly the 30-minute slog we were trying to kill; competitors already had wizards. The single prompt was the differentiated bet, and it only works if merchants can review and correct the output afterward without feeling like they\'re doing the wizard anyway.',
        call:
          'Single prompt, plus a post-generation review screen that surfaces the fields most likely to need a human eye first. We spent design budget on the review experience instead of on input steps — moving the merchant\'s effort to after generation, where the system has already done 95% of the work.',
        result:
          'Onboarding fell from 30 minutes to 5 — the 80% cut that became the product\'s headline. Adoption went 0→50+ active users in 8 weeks with 85% weekly retention and a 4.2/5 satisfaction score on post-launch surveys.',
      },
      {
        title: 'The LLM never blocks a critical path',
        setup:
          'Once real merchants depended on the template, every Gemini timeout or rate-limit was a merchant staring at a spinner during their own setup — or worse, during service. Reliability stopped being an engineering metric and became the product.',
        tradeoff:
          'Guaranteeing uptime through fallbacks means sometimes serving a degraded answer: a cached response or a deterministic default instead of a fresh, tailored generation. The alternative — retry until the model answers — protects output quality but converts every provider hiccup into user-visible downtime. You can\'t have both; you have to pick which failure you\'d rather explain.',
        call:
          'I\'d rather explain "the suggestion was generic" than "the app didn\'t load." We built a 3-layer fallback — primary model, cached response, deterministic default — so the system always answers, and the LLM is never load-bearing for a critical path.',
        result:
          '99.5% uptime across 50+ active restaurant partners. As an intern I extended the same philosophy to cost: model evaluation experiments across GPT-4, Claude, and Gemini set the performance/cost benchmarks that guided production model selection — cutting inference costs another 40% while holding sub-2s p95 latency.',
      },
    ],
    outcomes: [
      { stat: '80%', label: 'Onboarding time cut (30 min → 5 min)' },
      { stat: '0→50+', label: 'Active users in 8 weeks, 85% weekly retention' },
      { stat: '70%', label: 'LLM cost reduction (capstone architecture)' },
      { stat: '40%', label: 'Further inference cost cut at sub-2s p95 (intern)' },
      { stat: '99.5%', label: 'Production uptime across restaurant partners' },
      { stat: '$2M+', label: 'TAM sized from 25+ interviews + competitive analysis' },
    ],
    retro: [
      'Instrument the funnel before launch, not after. Our early retention picture came from surveys; product analytics arrived later than they should have. I\'d wire up event tracking on day one so "where do merchants stall?" is a query, not a guess.',
      'Validate willingness to pay, not just usability. 25+ interviews told us merchants loved the flow — but I anchored on the $2M TAM without enough pricing conversations. The number held up; my confidence in it shouldn\'t have, yet.',
      'Build the eval harness before the model swap, not during. We compared GPT-4, Claude, and Gemini after the architecture was live. Writing the benchmark suite first would have made every later model decision a one-day experiment instead of a one-week one.',
    ],
    cta: {
      type: 'demo',
      label: 'Watch the product demo',
      href: 'https://drive.google.com/drive/folders/1AjIufAhjLeLkWnCcFtIbltJ1Eq_Q4sgE?usp=sharing',
    },
    nextSlug: 'quadtax',
  },

  // ==========================================================
  // QUADTAX
  // ==========================================================
  {
    slug: 'quadtax',
    index: '02',
    title: 'QuadTax',
    subtitle:
      'An AI tax compliance engine for 1.5M international students — and why the most important architecture decision was where the AI is not allowed to go.',
    role: 'Founder & Lead Engineer',
    period: 'Apr 2026 — Present',
    stack: ['Next.js', 'FastAPI', 'OpenAI Structured Outputs', 'Pydantic', 'Tesseract OCR'],
    context: [
      'Every April, 1.5M international students (F-1/J-1 visa holders) hit the same wall: US nonresident tax rules are genuinely confusing, employers illegally withhold FICA tax from them (IRC § 3121(b)(19)), and TurboTax doesn\'t serve them at all. The incumbent, Sprintax, charges a premium for what is still a ~35-minute manual intake slog.',
      'I lived this problem as an F-1 student myself. That\'s also why I scoped it carefully: tax filing is the lowest-trust product category imaginable. One wrong number isn\'t a bug, it\'s an IRS letter. Every product decision below flows from that constraint.',
    ],
    myRole: [
      'Founder and lead engineer — I scoped the 0→1 opportunity, designed the architecture, built the full stack (Next.js frontend, FastAPI backend), and ran the beta. There is no one else to credit or blame; every call below was mine.',
    ],
    decisions: [
      {
        title: 'The math never touches the LLM',
        setup:
          'The seductive design for an "AI tax engine" is an agent that does everything — reads your documents, reasons about your residency, computes your refund. Demos of that design are spectacular. Production is where it falls apart: LLMs are probabilistic, and tax math has exactly one right answer per input.',
        tradeoff:
          'Hand-coding IRS rules as deterministic Python is dramatically slower to build than prompting a model — every bracket, treaty threshold, and form rule written and tested by hand. The all-LLM path ships faster and handles edge cases "for free," but every output carries a small probability of a confidently wrong number, and in tax, one wrong number ends the user relationship permanently.',
        call:
          'I drew a hard line through the architecture. LLM agents handle what they\'re actually good at — parsing documents, classifying them, reasoning about residency and treaty eligibility. Every calculation runs through a deterministic, IRS-rule-based zone the LLM cannot reach. Trust and auditability over "AI-everywhere," explicitly.',
        result:
          '100% mathematical accuracy by construction — the deterministic zone is unit-testable against IRS examples, which no prompt can guarantee. "The AI never does your math" also became the product\'s best trust pitch to skeptical users.',
      },
      {
        title: 'Kill data entry before adding anything else',
        setup:
          'With the engine working, every direction competed for my next month: more visa situations, state returns, or the intake experience. Walking through Sprintax-style flows made the choice clearer — the misery isn\'t the tax logic, it\'s the 35 minutes of copying numbers from a W-2 into form fields.',
        tradeoff:
          'Breadth (more form types, more states) grows the addressable market — each addition serves users I currently turn away. Depth (automating intake) serves the users I already have, dramatically better, but document parsing is genuinely hard: OCR fails, layouts vary by employer, and a silent misread is worse than asking the user to type.',
        call:
          'Depth first. I built the OCR pipeline — Tesseract + pdfplumber for extraction, OpenAI Structured Outputs with Pydantic schemas for validation — so W-2, 1042-S, and I-94 data flows in from an upload. The schema layer was the key call: every extracted field validates against a typed contract, and anything that fails validation falls back to a human-confirm step instead of passing through silently.',
        result:
          '90% reduction in manual data entry, and total filing time from ~35 minutes to under 10 in self-testing. The structured-output contract meant OCR errors surfaced as "please confirm this field" — never as a wrong number on a form.',
      },
      {
        title: 'Three forms, five users, two rewrites',
        setup:
          'The form universe for nonresidents is deep: federal returns, state returns, treaty attachments, amended filings. As a solo founder with one tax season to hit, building "complete" coverage meant shipping nothing by April.',
        tradeoff:
          'Scoping to three federal forms — 1040-NR, 8843, 8833 — covers the core nonresident student case but turns away anyone needing state returns, which is most filers in most states. The alternative, broader coverage, meant missing the season entirely. A smaller product that exists beats a complete one that doesn\'t.',
        call:
          'Ship the three forms plus the FICA recovery module (the highest-value, most-ignored use case — identifying illegal withholding under IRC § 3121(b)(19)), then put the product in front of real filers immediately: a 5-person beta against live documents, watching where they hesitated rather than asking what they thought.',
        result:
          'The beta surfaced intake friction I\'d been blind to as the builder and drove two major iteration cycles on the intake experience before any wider release. The scope cut is also the roadmap: state returns are next, sequenced by beta demand rather than by my guesses.',
      },
    ],
    outcomes: [
      { stat: '<10 min', label: 'Filing time, down from ~35 min manual intake' },
      { stat: '90%', label: 'Reduction in manual data entry via OCR pipeline' },
      { stat: '100%', label: 'Math accuracy — deterministic zone, by construction' },
      { stat: '3', label: 'IRS forms generated as filing-ready PDFs (1040-NR, 8843, 8833)' },
      { stat: '5-person', label: 'Beta → two major iteration cycles on intake' },
      { stat: '1.5M', label: 'International students in the underserved market' },
    ],
    retro: [
      'Recruit beta users before building, not after. My five testers arrived once the product worked end-to-end — which means the first two months of decisions were validated only against my own filing experience. Even three committed early users would have re-ordered my backlog.',
      'The FICA recovery module deserved the spotlight, not a supporting role. "Your employer may owe you money back" is a sharper hook than "file your taxes faster," and I under-positioned it. Distribution thinking should have started at the architecture stage.',
      'Self-testing time savings aren\'t a metric, they\'re a hypothesis. "35 → under 10 minutes" comes from my own runs; the honest version needs timing data from users who\'ve never seen the product. That instrumentation is in the next cycle.',
    ],
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/QuadTax',
    },
    nextSlug: 'lextrack',
  },
];

export function getDeepDive(slug: string): DeepDive | undefined {
  return deepDives.find((d) => d.slug === slug);
}
