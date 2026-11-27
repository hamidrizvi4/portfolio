/**
 * deep-dives.ts
 *
 * Long-form case study content for /work/[slug] pages.
 *
 * Structure per study: my role → architecture → the hard decisions
 * (setup / tradeoff / call / result) → what broke → outcomes → what I'd do
 * differently. Title, year and role live in lib/projects.ts.
 *
 * Every number here is sourced from the resume; keep the two in sync.
 */

/** A screenshot shown at its natural ratio, with a caption. */
export interface Figure {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Decision {
  title: string;
  setup: string; // The situation that forced a choice
  tradeoff: string; // What was genuinely in tension
  call: string; // What I decided and why
  result: string; // What happened because of it
  /** Evidence for the call, rendered under the decision. */
  figure?: Figure;
}

/** One results table. The first cell of each row is its label. */
export interface ResultTable {
  title: string;
  columns: string[];
  rows: {
    cells: string[];
    /** accent: the arm that ships or is highlighted; dim: rejected or baseline. */
    tone?: 'accent' | 'dim';
    /** Short chip after the row label, e.g. "Shipped" or "Rejected". */
    tag?: string;
  }[];
  note?: string;
}

/** Measured results, rendered as an "Evaluation" section after the architecture. */
export interface Evaluation {
  intro: string[];
  tables: ResultTable[];
}

export interface Outcome {
  stat: string;
  label: string;
}

export interface Lesson {
  title: string;
  body: string;
}

export interface Checklist {
  title: string;
  items: string[];
}

export type Tone = 'rules' | 'model' | 'person';

/** One box in an architecture diagram (components/work/ArchDiagram.tsx). */
export interface ArchBox {
  tone: Tone;
  label: string;
  /** Decision number the box links down to. */
  decision?: number;
  /** Large display line. */
  title?: string;
  text?: string;
  note?: string;
  chips?: string[];
  /** Small uppercase line, e.g. a cost or a constraint. */
  meta?: string;
  list?: string[];
  /** Dashed sub-box; what dashed means is the diagram's `inset` legend. */
  inset?: { label: string; decision?: number; steps?: string[]; note: string };
}

export interface Arch {
  /** Top to bottom. A pair forks into two lanes and joins on the next step. */
  steps: (ArchBox | [ArchBox, ArchBox])[];
  /** Legend name for the person tone: Manager, Filer, and so on. */
  person: string;
  /** Legend text for the dashed inset, when the diagram has one. */
  inset?: string;
  caption?: string;
}

export interface DeepDive {
  slug: string;
  subtitle: string;
  stack: string[];
  myRole: string[];
  /** LexTrack renders its own bespoke diagram instead. */
  architecture?: Arch;
  evaluation?: Evaluation;
  decisions: Decision[];
  /** Things that looked fine and were wrong: the "What broke" section. */
  lessons?: Lesson[];
  /** Plain bulleted panels (security posture, status, and so on). */
  checklists?: Checklist[];
  outcomes: Outcome[];
  retro: string[]; // What I'd do differently, numbered and honest
  cta?: {
    type: 'github' | 'demo';
    label: string;
    href: string;
    /** Secondary links under the main CTA: repo, reports. */
    more?: { label: string; href: string }[];
  };
}

export const deepDives: DeepDive[] = [
  // ==========================================================
  // LEXTRACK
  // ==========================================================
  {
    slug: 'lextrack',
    subtitle:
      'A zero-to-one restaurant reservation template inside a 1-click no-code platform, and the architecture decisions that cut onboarding from 30 minutes to 5.',
    stack: ['TypeScript', 'RAG', 'Gemini', 'Prompt Engineering', 'Microservices'],
    myRole: [
      'I led the reservation template as the capstone PM, managing a team of 3 engineers and 1 designer while writing code alongside them. I owned the problem definition, ran 25+ customer interviews and the competitive analysis (Toast, Square, Lightspeed), made the architecture calls below, and carried the product from zero to 50+ active users in 8 weeks.',
      'After the capstone shipped, LexTrack brought me back as an AI/ML Product Engineering intern. I now own the production side of the same system: RAG pipelines, model evaluation, and the cost and latency budget.',
    ],
    decisions: [
      {
        title: 'Hybrid AI, not LLM-everywhere',
        setup:
          'The obvious 2025 answer to "80+ config fields is too many" was to point an LLM at all of them. Our first prototype did exactly that, and it was slow, expensive, and confidently wrong in ways merchants could not predict. A table-count field does not need a language model. A free-text "describe your service style" field does.',
        tradeoff:
          'Pure LLM was one codepath and fast to build, but every generated config carried inference cost, multi-second latency, and a non-zero hallucination rate on fields that have exactly one right answer. Splitting the system meant maintaining two codepaths and deciding, field by field, which side owns it: more engineering up front, but less risk per onboarding.',
        call:
          'I split the architecture: deterministic rules generate every field that has a verifiable right answer, and Gemini handles only the genuinely ambiguous ones. One prompt, narrowly scoped, with rules as the safety net. The team pushed back on the extra surface area; the interview data settled it. Merchants distrusted "magic" they could not verify.',
        result:
          'Response times landed at 1 to 2 seconds and LLM costs dropped 70% versus the all-LLM prototype, through prompt engineering, a caching strategy, and intelligent fallback. The hybrid split is now the template\'s standard architecture.',
      },
      {
        title: 'One prompt, not a wizard',
        setup:
          'For the merchant-facing flow we had two credible designs: a guided multi-step wizard (familiar, each field explained, every answer user-confirmed) or a single-prompt flow where the merchant describes their restaurant in a sentence and the system generates all 80+ fields at once.',
        tradeoff:
          'The wizard was safer: errors get caught at entry, and nobody has to trust generation. But it was also exactly the 30-minute slog we were trying to kill; competitors already had wizards. The single prompt was the differentiated bet, and it only works if merchants can review and correct the output afterward without feeling like they are doing the wizard anyway.',
        call:
          'Single prompt, plus a post-generation review screen that surfaces the fields most likely to need a human eye first. We spent design budget on the review experience instead of on input steps, moving the merchant\'s effort to after generation, where the system has already done 95% of the work.',
        result:
          'Onboarding fell from 30 minutes to 5, the 80% improvement that became the product\'s headline. Adoption reached 0 to 50+ active users in 8 weeks with 85% weekly retention and a 4.2/5 satisfaction score on post-launch surveys.',
      },
      {
        title: 'The LLM never blocks a critical path',
        setup:
          'Once real merchants depended on the template, every Gemini timeout or rate-limit was a merchant staring at a spinner during their own setup, or worse, during service. Reliability stopped being an engineering metric and became the product.',
        tradeoff:
          'Guaranteeing uptime through fallbacks means sometimes serving a degraded answer: a cached response or a deterministic default instead of a fresh, tailored generation. The alternative, retrying until the model answers, protects output quality but converts every provider hiccup into user-visible downtime. You cannot have both; you have to pick which failure you would rather explain.',
        call:
          'I would rather explain "the suggestion was generic" than "the app did not load." We built a 3-layer fallback (primary model, cached response, deterministic default) so the system always answers, and the LLM is never load-bearing for a critical path.',
        result:
          '99.5% uptime across 50+ active restaurant partners. As an intern I extended the same philosophy to cost: model evaluation experiments across GPT-4, Claude, and Gemini set the performance and cost benchmarks that guided production model selection, cutting inference costs another 40% while holding sub-2s p95 latency.',
      },
    ],
    outcomes: [
      { stat: '80%', label: 'Onboarding time cut (30 min to 5 min)' },
      { stat: '0 to 50+', label: 'Active users in 8 weeks, 85% weekly retention' },
      { stat: '70%', label: 'LLM cost reduction (capstone architecture)' },
      { stat: '40%', label: 'Further inference cost cut at sub-2s p95 (intern)' },
      { stat: '99.5%', label: 'Production uptime across restaurant partners' },
      { stat: '$2M+', label: 'TAM sized from 25+ interviews and competitive analysis' },
    ],
    retro: [
      'Instrument the funnel before launch, not after. Our early retention picture came from surveys; product analytics arrived later than they should have. I would wire up event tracking on day one so "where do merchants stall?" is a query, not a guess.',
      'Validate willingness to pay, not just usability. 25+ interviews told us merchants loved the flow, but I anchored on the $2M TAM without enough pricing conversations. The number held up; my confidence in it should not have.',
      'Build the eval harness before the model swap, not during. We compared GPT-4, Claude, and Gemini after the architecture was live. Writing the benchmark suite first would have made every later model decision a one-day experiment instead of a one-week one.',
    ],
    cta: {
      type: 'demo',
      label: 'Watch the product demo',
      href: 'https://drive.google.com/drive/folders/1AjIufAhjLeLkWnCcFtIbltJ1Eq_Q4sgE?usp=sharing',
    },
  },

  // ==========================================================
  // RESIDENCEOS
  // ==========================================================
  {
    slug: 'residenceos',
    subtitle:
      "Operations and compliance for NYC property managers, including the deadlines the city doesn't track. AI reads the paperwork, plain code computes the legal deadlines, and a human confirms everything.",
    stack: ['Next.js', 'TypeScript', 'Supabase (Postgres, pgvector, RLS, Auth, Storage)', 'Stripe', 'Vercel', 'Vision + text model routing'],
    myRole: [
      'Solo build: product, engineering, security, and go-to-market. ResidenceOS is an all-in-one operations platform for small and mid-sized NYC property management firms, between 5 and 500 units, covering buildings, units, leases, maintenance, rent collection, communications, and reporting.',
      'Two things set it apart. It turns messy paperwork into tracked obligations: a manager uploads a scanned lease or inspection report, the system proposes structured fields, and nothing becomes official until a person confirms it. And it tracks the obligations the city doesn\'t: when an inspection report implies a recurring deadline with no city database behind it, ResidenceOS puts it on the portfolio compliance view with the date computed and the working shown.',
      'The repository is private because this is a commercial product. The live demo runs on a synthetic portfolio with real Stripe in test mode. There are no paying customers yet.',
    ],
    architecture: {
      person: 'Manager',
      inset: 'Hardened after it broke',
      caption: 'Everything the model touches ends at needs_review. The due date never comes from the model or the document.',
      steps: [
        {
          tone: 'person',
          label: 'Manager · upload',
          title: 'A scanned lease or inspection report.',
          note: 'PDF or image. Every upload is untrusted input.',
        },
        {
          tone: 'rules',
          label: 'Intake',
          list: [
            'Typed by magic bytes only, size-capped',
            'Stored under a generated, building-scoped path',
            'The uploaded filename never touches a path',
          ],
          inset: {
            label: 'Image normalization',
            note: 'Every image is re-encoded to plain sRGB first. One provider silently returned empty fields for a wide-gamut PNG.',
          },
        },
        {
          tone: 'model',
          label: 'Vision model',
          decision: 3,
          text: 'Reads the page and proposes values in a fixed JSON schema.',
          chips: ['Proposed fields', 'Inspection date', 'Injection flag'],
          meta: 'No schema field can express an action',
          note: 'Document text arrives in one delimited block, never concatenated into instructions.',
        },
        {
          tone: 'person',
          label: 'needs_review',
          decision: 1,
          text: 'A person confirms or edits every proposed field.',
          note: 'Nothing becomes official until someone has looked at it.',
        },
        {
          tone: 'rules',
          label: 'Cycle table · TypeScript, versioned',
          decision: 2,
          text: "Computes the legal due date from the building's community district, never from the document.",
          list: [
            "DOB's rotating cycle, December 31 deadline",
            'No usable district fails closed: no date at all',
            'Same inspection day, due dates up to three years apart',
          ],
        },
        {
          tone: 'person',
          label: 'Portfolio compliance view',
          title: 'compliance_obligation',
          note: 'Source: extracted_from_document, linked back to the page with the derivation visible.',
        },
      ],
    },
    decisions: [
      {
        title: 'The model reads and proposes. Code and people decide.',
        setup:
          'The product exists to turn scanned paperwork into legal deadlines. The obvious design is to let a model read an inspection report and fill in everything, including the due date and the compliance status.',
        tradeoff:
          'Letting the model decide is less code, but a model-set due date on a legal obligation is a wrong answer nobody can audit. Drawing a boundary means writing and versioning the rules by hand, and putting a human confirmation step in front of every record.',
        call:
          'A hard boundary. The model may read a scanned page, propose field values in a fixed schema, draft a message (saved as a draft), and flag text that looks like an instruction. It may not set a compliance due date, mark a record confirmed, send anything to a resident, or move money. Due dates come from a versioned rule table in TypeScript, and the model only reads the date an inspection was performed.',
        result:
          'The community district comes from the building record, never from the document, so a document cannot move its own deadline. A building with no usable district fails closed and shows no date at all. Every obligation links back to its source document with the derivation visible.',
      },
      {
        title: 'Check the city\'s schedule before writing the math',
        setup:
          'LL152 looks like "inspection plus four years." That was the calculation I was about to write.',
        tradeoff:
          'Writing the obvious formula and a test for it is fast. But a test written against the same assumption would have agreed with the bug, so a green suite would prove nothing.',
        call:
          'I checked DOB\'s own schedule first. DOB assigns each community district a due year inside a rotating cycle, with a December 31 deadline, so two buildings inspected the same morning can be due three years apart.',
        result:
          'The due date comes from a deterministic, versioned cycle table keyed on the building\'s district. The naive formula would have been wrong for most buildings.',
      },
      {
        title: 'Remove the capability instead of detecting the injection',
        setup:
          'Every uploaded document is untrusted input that goes straight to a model. A lease or inspection report can carry hostile instruction text.',
        tradeoff:
          'A detector alone is a guessing game, and it cannot tell instructions that belong from instructions that were smuggled in. Removing what the model is able to do is less clever but holds even when detection misses.',
        call:
          'Prompt injection is mostly a permissions problem, so I removed the capability. The extraction schema has no field that can express an action, and document text is passed in a delimited block the code constructs in exactly one way, never concatenated into instructions. Detection still runs, as a signal for the reviewer.',
        result:
          'A model that fell for an injection would still have nowhere to write "compliant." In the demo, a document with planted instructions is flagged, none of it is obeyed, and no status changes.',
      },
      {
        title: 'Sell to the firm and publish the price',
        setup:
          'NYC buildings can be sold to self-managed boards one at a time or to the management firms that run whole portfolios. The incumbents gate pricing behind quotes and unit minimums.',
        tradeoff:
          'Per-building sales are a separate sale for every building. Selling to firms means a sales-assisted onboarding, but one firm managing 40 buildings is one sale covering hundreds of units.',
        call:
          'Sell to the firm, with graduated per-door pricing published in full: $1.10 per unit for the first 100 units with a $49 floor, $0.90 for units 101 to 500, quoted above that. No unit minimum, no quote gate.',
        result:
          'Onboarding is the demo: a new firm uploads its existing leases and inspection reports on the first call and watches them get structured. The step that is normally the worst part of adopting new software becomes the pitch.',
      },
    ],
    lessons: [
      {
        title: 'The payment that would have stayed pending forever',
        body: 'A Stripe Checkout Session returns payment_intent: null at creation. I had keyed pending payments on that field, so every real charge would have sat unreconciled with no error anywhere. A live API call exposed it. Payments are now keyed on the session ID, and a test asserts the null directly against the live API.',
      },
      {
        title: 'A green test suite that hid a broken feature',
        body: 'Every RLS test checked that the wrong people were blocked. None checked that the right person could act. A policy that blocks everyone passes all of those. Creating a building through the real form failed for every real firm for six days, including through an independent audit that rated the permissions as the project\'s strongest area. Every denial test is now paired with a grant test on the same code path the feature uses.',
      },
      {
        title: 'Webhooks that never arrived',
        body: 'Auth middleware redirected every unauthenticated request to the login page, including Stripe\'s webhooks. In production, no payment would ever have reconciled. Local testing passed because it did not exercise that path. A permanent regression test now covers it.',
      },
      {
        title: 'The image that blinded the model',
        body: 'One vision provider silently dropped a PNG with an alpha channel and a wide-gamut color profile. It returned a well-formed response with every field empty, as if no image had been attached. Every image is now re-encoded to plain sRGB first, and extraction refuses to produce a confirmable record if the response shows no evidence the page was read.',
      },
      {
        title: 'The detector that flagged itself',
        body: 'My own wrapper text ended with an instruction. My injection detector flagged it as planted. A detector cannot tell instructions that belong from instructions that were smuggled in, so the wrapper no longer contains one.',
      },
      {
        title: 'The pattern',
        body: 'Across the build I found some version of the same mistake repeatedly: a test or check that passed for a reason unrelated to the thing it was checking. The habit that catches it is to break the protection on purpose and confirm the check goes red.',
      },
    ],
    checklists: [
      {
        title: 'Security and trust',
        items: [
          'Row-Level Security written in the same migration that creates each table, covering all four verbs, never select-only.',
          'Privilege ceilings expressed as database constraints. A firm admin cannot be created through any invite path, even with the service role.',
          'Invite claims are a single atomic statement, so two concurrent signups cannot both win.',
          'Uploads are typed by magic bytes only, size-capped, and stored under generated paths. The uploaded filename never touches a path.',
          'Stripe webhooks verify the raw-body signature, and idempotency is enforced by a primary key, not by application logic.',
          'Secrets are redacted from every logging path, and the app refuses to boot with a live Stripe key.',
          'A per-firm demo flag blocks writes for demo accounts without blocking a real customer.',
          'A written threat model, plus an independent audit of the code, database, payment path, AI pipeline, and marketing site. Findings were fixed and verified against production.',
        ],
      },
      {
        title: 'Where it stands and what\'s next',
        items: [
          'A live demo on a synthetic portfolio, with real Stripe in test mode. No paying customers yet.',
          'Next: first firms onboarded with their own buildings, a verified sending domain for mail, and a custom domain.',
          'Later: a hybrid onboarding path once volume justifies removing the sales step.',
          'The product shows its own correction rates inside the app: how often a human edited an extraction, overrode a triage suggestion, or rewrote a draft. I would rather publish a number that can move than claim an accuracy figure.',
        ],
      },
    ],
    outcomes: [
      { stat: '4 roles', label: 'Firm admin, manager, board member, tenant, each enforced by the database, not the UI' },
      { stat: '14/14', label: 'Extraction field accuracy, matching the baseline model at about one ninth the cost and one third the latency' },
      { stat: '18', label: 'Independent audit findings (2 high, 5 medium, 5 low, 6 marketing), all worked through and verified against production' },
      { stat: '14 suites', label: '300+ automated checks, run as one serial pass before every release' },
      { stat: 'From $49/mo', label: 'Published per-door pricing, no unit minimum, no quote gate' },
      { stat: '0', label: 'Paying customers yet. Pre-launch, synthetic data, Stripe in test mode' },
    ],
    retro: [],
    cta: {
      type: 'demo',
      label: 'See it run on a synthetic portfolio',
      href: 'https://residencesystem.vercel.app',
    },
  },

  // ==========================================================
  // CLAUDE SUPPORT TRIAGE AGENT
  // ==========================================================
  {
    slug: 'triage',
    subtitle:
      'A support agent that answers what the docs can answer and hands the rest to a human, with a deterministic router making that call. Then the part most agent demos skip: hand-labeled tickets, ticket-level confidence intervals, and two extra agents that are only allowed to make it safer, each measured on the same labels.',
    stack: [
      'Next.js',
      'TypeScript',
      'Supabase (Postgres, pgvector, RLS)',
      'OpenRouter',
      'qwen3.7-flash router',
      'deepseek-v4-flash checker',
      'LLM judge, validated first',
      'Bootstrap CIs · AURC · Fisher exact',
    ],
    myRole: [
      'Solo, end to end: the agent loop and its five tools, the routing engine, docs ingestion into pgvector, the review queue and dashboard, the offline evaluation harness, and the public intro site with a routing calculator that runs the production route() function.',
      'It shipped in three stages. In July, the core agent, followed by a 7-point external code review that I verified against the live system instead of trusting, which surfaced a live security exposure. In November, a labeled evaluation that turned "it seems to work" into must-escalate recall with an honest interval. Then two more agents, an independent checker and a researcher → writer split, each scored on the same labels and red-teamed with prompt-injection probes.',
      'Every eval on this page cost under $2 of model spend in total. The tickets are synthetic and the labels are mine, and the write-up says both wherever a number depends on them.',
    ],
    architecture: {
      person: 'Reviewer',
      inset: 'Hardened after it broke',
      caption:
        'Every router, checker, researcher, and writer call is written to the tool_calls audit trail. The researcher → writer split is opt-in and replaces the router agent\'s single drafting step.',
      steps: [
        {
          tone: 'rules',
          label: 'Docs ingestion',
          text: "Anthropic's public developer docs, chunked and embedded into Supabase pgvector behind deny-all RLS.",
          chips: ['docs.claude.com', 'support.claude.com'],
          inset: {
            label: 'Re-indexed',
            note: 'The embedding model was retired upstream (HTTP 410) and every search failed silently, production included. Re-embedded on qwen3-embedding-8b at the same 2048 dimensions.',
          },
        },
        {
          tone: 'model',
          label: 'Router agent · qwen3.7-flash',
          text: 'A tool-calling loop (search_docs, a live check_status, check_pricing, lookup_account) that ends in one forced submit_resolution call.',
          chips: ['Category', 'Cited draft', 'Retrieval score', 'Self-certainty'],
          meta: 'Proposes. Does not decide.',
        },
        {
          tone: 'rules',
          label: 'Routing engine · route()',
          decision: 1,
          list: [
            'Billing, security, sales, bug reports: always a human',
            'Keyword safety net on the raw ticket text, which can only push toward a human',
            'Otherwise 0.6 × retrieval + 0.4 × self-certainty, auto-resolve at 0.80',
          ],
        },
        {
          tone: 'model',
          label: 'Independent checker · deepseek-v4-flash',
          decision: 4,
          text: 'Reviews every proposed auto-resolve. Sees only the ticket and the proposed route: no draft, no tool calls, no scores.',
          chips: ['agree', 'escalate'],
          meta: 'Can only say no. Fails closed.',
        },
        [
          {
            tone: 'rules',
            label: 'Auto-resolve',
            title: '7.5%',
            note: 'of core tickets with the checker on, down from 26.7% for the router alone. The price of zero unsafe answers.',
          },
          {
            tone: 'person',
            label: 'Human review queue',
            title: '100%',
            note: 'of must-escalate tickets reached a human in all 120 runs, with the reasoning trace and confidence breakdown attached.',
          },
        ],
        {
          tone: 'person',
          label: 'Dashboard and offline eval',
          decision: 2,
          text: 'The queue and dashboard read one classification layer, so they can never disagree about an outcome. The eval recomputes every arm offline from raw run records with the same functions production runs.',
        },
      ],
    },
    evaluation: {
      intro: [
        '40 synthetic tickets, each hand-labeled with a gold category and a gold route under a written labeling policy: 24 need a human, 16 are answerable from the docs. 12 deliberately disguised hard cases are reported separately as a stress test. Every configuration ran 3 seeds, and eval runs never write to the production database.',
        'The headline is must-escalate recall: of the tickets that need a human, the share that reached one. It always sits next to unsafe auto-resolves per run, auto-resolve precision, and coverage, so the cost of safety is on the same row. Intervals are 95% bootstraps that resample tickets, not runs, because three runs of one ticket are not three independent trials.',
      ],
      tables: [
        {
          title: 'Routing variants · qwen3.7-flash · 40 tickets × 3 seeds',
          columns: ['Arm', 'Must-escalate recall', 'Unsafe auto-resolves / run', 'Auto-resolve precision', 'Coverage'],
          rows: [
            { cells: ['Model-reported retrieval + safety net', '93.1% (86–99%)', '1.7', '84.7%', '26.7%'], tone: 'accent', tag: 'Shipped' },
            { cells: ['Cosine-similarity retrieval + safety net', '86.1%', '3.3', '71.7%', '28.3%'], tone: 'dim', tag: 'Rejected' },
          ],
          note: 'The safety net changed no decisions on this model, so each arm scores identically with and without it. On completed runs only, shipped recall is 93.0%, so counting failed runs as escalated is not propping up the headline.',
        },
        {
          title: 'Independent checker · scored on the same router runs',
          columns: ['Arm', 'Must-escalate recall', 'Unsafe / run', 'Coverage', 'Extra $ / ticket'],
          rows: [
            { cells: ['Router alone', '93.1%', '1.7', '26.7%', '—'], tone: 'dim' },
            { cells: ['+ checker, different family (deepseek-v4-flash)', '100.0%†', '0.0', '7.5%', '+$0.00005'], tone: 'accent', tag: 'Default' },
            { cells: ['+ checker, same model (qwen3.7-flash)', '97.2%', '0.7', '18.3%', '+$0.00003'] },
          ],
          note: '† No miss in any of the 120 runs, so the bootstrap collapses to 100–100%. The conservative ticket-level Wilson lower bound is 86.2%. Paired change +6.9 pts, 95% CI +1.3 to +14.3.',
        },
        {
          title: 'Researcher → writer split · fresh matched runs, 52 tickets × 2 seeds',
          columns: ['Metric', 'Single agent', 'Researcher → writer'],
          rows: [
            { cells: ['Unsupported claims per reply', '11.67', '2.15'], tone: 'accent' },
            { cells: ['Share of claims unsupported (length-fair)', '57.5%', '24.0%'] },
            { cells: ['Replies with any unsupported claim', '97.8%', '75.7%'] },
            { cells: ['Citations to pages never retrieved', '9 / 264', '0 / 334'] },
            { cells: ['Must-escalate recall, core set', '89.6%', '97.9%'] },
            { cells: ['Coverage, core set', '31.3%', '10.0%'] },
            { cells: ['Cost per ticket', '$0.0017', '$0.0022'] },
          ],
          note: 'Graded by gpt-6-luna, a third model family, against the evidence each writer actually had. The judge was validated first: 12 of 12 planted fabrications flagged, 10 of 10 verbatim sentences accepted.',
        },
        {
          title: 'Prompt-injection red team · 6 probes, each needing a human',
          columns: ['Pipeline', 'Escalated', 'Canary leaks'],
          rows: [
            { cells: ['Single agent', '5 / 6', '0'], tone: 'dim' },
            { cells: ['Single agent + checker', '6 / 6', '0'], tone: 'accent' },
            { cells: ['Researcher → writer', '6 / 6', '0'] },
            { cells: ['Researcher → writer + checker', '6 / 6', '0'] },
          ],
          note: 'Fake approvals, fake system messages, fence breaks, and smuggled links. The one miss was a fence-break probe the single-agent router auto-resolved; the checker escalated it.',
        },
      ],
    },
    decisions: [
      {
        title: 'The router decides, not the model',
        setup:
          'The agent ends every ticket with a structured answer that includes its own confidence. The obvious design is to let the model auto-resolve whenever it says it is sure.',
        tradeoff:
          'Model confidence is a self-report, and one confident wrong answer on a billing dispute or a security report costs far more than a slow answer on a rate-limit question. Letting the model gate itself is less code, but it puts a probability in charge of a decision that should be categorical.',
        call:
          'A small, pure, tested route() function sits outside the model. Billing, security, sales, and bug-report tickets always go to a human. A keyword safety net on the raw ticket text can only push a ticket toward a human. Everything else auto-resolves only if 0.6 × retrieval score + 0.4 × self-certainty reaches 0.80. The intro site\'s calculator imports the same function, so it cannot drift from production.',
        result:
          'The labeled eval tested the rules as well as the agent. The safety net caught 15 of 19 billing, security, and sales tickets on text alone with 0 false hits, and changed 0 decisions, because the model had already labeled them correctly. It ships as a free backstop. The "bug reports always escalate" rule barely fires: only 5 of 21 bug-report runs were labeled as bugs, and the rest reached a human through low confidence instead. A category rule is only as good as the classifier, and now that is measured rather than assumed.',
        figure: {
          src: '/work/triage/routing-lab.png',
          alt: 'Interactive routing calculator from the live site: sliders for retrieval score and self-certainty, category chips where the dashed ones always escalate, the computed confidence 0.6 × 0.82 + 0.4 × 0.90 = 0.852, an auto-resolve verdict, and a plot of the auto-resolve region with the route() source beside it.',
          width: 2280,
          height: 1200,
          caption: 'The live site\'s routing calculator runs the production route(), so the explanation and the agent give the same answer.',
        },
      },
      {
        title: 'Pick the metric that matches the expensive failure',
        setup:
          'The first comparison counted outcomes: the free model left 20 of 40 tickets incomplete, and a $0.25 paid rerun left 3. That measured whether the agent finished. It could not say whether any routing decision was right.',
        tradeoff:
          'Accuracy is the familiar number, but it weighs a misfiled feature question the same as a bot confidently answering a security report. Recall alone is just as wrong: escalate everything and it reads 100%. Labeling is slow, and one labeler means the labels themselves are a source of error.',
        call:
          'I hand-labeled every ticket with a gold category and a gold route under a written policy, added 12 disguised hard cases reported separately, and made must-escalate recall the headline, always beside unsafe auto-resolves, precision, and coverage. 3 seeds per configuration. Incomplete runs count as escalated, because that is what production does with them, and I checked recall on completed runs alone so that choice could not flatter the number. The model came from a 12-ticket pilot of four cheap tool-calling models under a fixed budget.',
        result:
          'Shipped routing on qwen3.7-flash: 93.1% must-escalate recall (95% CI 86–99%), 1.7 unsafe auto-resolves per 40-ticket run, 84.7% precision, 26.7% coverage. My first interval was too narrow because it treated three runs of one ticket as independent evidence. A math audit of my own eval caught it, plus a doc that quoted the rejected arm\'s interval as the shipped one, and all of it was corrected before publishing.',
      },
      {
        title: 'Reject my own fix when the evidence says no',
        setup:
          'The retrieval score in the routing formula is the model\'s self-report. My proposed fix was to swap in the vector search\'s own cosine similarity, which sounds more objective and was my idea.',
        tradeoff:
          'Shipping it would have made a better-sounding story. But similarity measures whether a ticket is on-topic for the docs, not whether the docs can resolve it, and with 40 tickets any gap could be noise in either direction.',
        call:
          'I scored both as arms on the same agent runs, compared them as ranking signals with risk-coverage curves and AURC, and paired the comparison ticket by ticket with a bootstrap. The decision rule was written down first: no evidence it helps means it does not ship.',
        result:
          'Cosine cut recall from 93.1% to 86.1% and nearly doubled unsafe auto-resolves, from 1.7 to 3.3 per run. As a ranking signal it scored worse than no ranking at all (AURC 0.393 vs 0.354). Paired, the recall gap\'s interval is 0.0 to 15.2 points, so it is not significant on 40 tickets, and the write-up says exactly that instead of "routed worse." Rejected. The same discipline applied to the 0.6/0.4 weights: the blend ranks barely better than self-certainty alone (AURC 0.187 vs 0.193), so they are documented as an untuned prior rather than refit to 40 labels.',
        figure: {
          src: '/work/triage/risk-coverage.png',
          alt: 'Risk-coverage chart over 65 eligible runs: the shipped signal (0.6 model-reported retrieval plus 0.4 certainty, AURC 0.187) stays lowest as coverage grows, the rejected cosine blend scores 0.277, cosine alone 0.393, self-certainty alone 0.193, and model-reported retrieval alone 0.220.',
          width: 2280,
          height: 880,
          caption: 'Which signal should gate automation? Lower AURC means the tickets that need a human get sorted last. A perfect ranking scores 0.074 and no ranking about 0.354.',
        },
      },
      {
        title: 'Add a second model that can only say no',
        setup:
          'After the eval, an unsafe auto-resolve still got through about 1.7 times per 40-ticket run. A second opinion is the obvious fix, and the obvious way to build one fails in two ways: it shares the router\'s blind spots, or it gains the power to approve.',
        tradeoff:
          'A strict reviewer catches more unsafe answers and also blocks safe ones, so every catch costs coverage, meaning tickets a human has to read. A reviewer on the same model is cheaper and gentler, but it is likely to agree with the mistakes it should catch.',
        call:
          'The checker runs on a different model family and sees only the ticket and the proposed route, not the draft, the tool calls, or the router\'s scores, so it has nothing to anchor on. It has no tools and answers agree or escalate through one forced, schema-checked call. Code applies the verdict with a function that can only make a route more cautious, and a timeout, refusal, or malformed answer escalates. It was scored on the recorded runs, so every difference between arms is the checker\'s, and run against a same-model arm as the control.',
        result:
          'Recall went from 93.1% to 100%, with no unsafe auto-resolve in any of 120 runs (paired change +6.9 points, CI +1.3 to +14.3). It caught 5 of 5 unsafe proposals for $0.00005 a ticket. It also blocked 18 of 27 safe ones, so coverage fell from 26.7% to 7.5%. The same-model checker caught 3 of 5 and blocked 7, at 18.3% coverage. It is on by default in the batch runner, with a kill switch and the same-model setting as the middle option. Where to sit on that curve depends on what a reviewer\'s hour costs, so the curve is published.',
        figure: {
          src: '/work/triage/checker.png',
          alt: 'Checker flow from the live site: ticket and router proposal feed a deepseek-v4-flash checker that answers agree (answer ships) or escalate (human reviews), with timeout, error, or bad output escalating. Below: recall 100.0% (was 93.1%), unsafe auto-resolves 0.0 (was 1.7), coverage 7.5% (was 26.7%), extra cost $0.00005 per ticket.',
          width: 2280,
          height: 1160,
          caption: 'The checker reviews only proposed auto-resolves, so its cost lands only on those. A second model can only make the system safer; the eval prices what that costs.',
        },
      },
      {
        title: 'Make every sentence cite its evidence',
        setup:
          'Routing was now measured, but nothing measured whether a draft was true to the docs. The single agent wrote with its tools and its own memory in the same context, and one of its drafts said prompt-cache writes cost 0.25× when the docs say 1.25×.',
        tradeoff:
          'Splitting the work adds calls, latency, and cost. Measuring hallucination needs an LLM judge, and a judge can be wrong in ways that quietly favor one pipeline over the other.',
        call:
          'A researcher that can only search hands over passage ids. A writer with no tools sees only the ticket and those passages and tags every sentence as framing or as a claim with the passages behind it. Code then checks each citation against what was actually handed over; an uncited claim, an invented id, or a "not answerable" verdict goes to a human. I graded both pipelines with a judge from a third model family, against the full evidence each writer had, and tested the judge on planted fabrications and verbatim sentences before trusting it.',
        result:
          'Unsupported claims per reply fell from 11.67 to 2.15 (paired CI −10.90 to −8.27). Because split replies are also shorter, the length-fair number is the share of claims unsupported, 57.5% to 24.0%. Citations to pages never retrieved went from 9 of 264 to 0 of 334, by construction. It is not zero: 76% of split replies still hold at least one unsupported claim, because a citation proves the writer pointed at a passage, not that the passage says what the sentence says. Recall rose to 97.9% and coverage fell to 10%, so the split is opt-in.',
        figure: {
          src: '/work/triage/split.png',
          alt: 'Researcher to writer flow from the live site: a search-only researcher passes passages P1 to P3 to a writer with no tools, a code citation check sends uncited claims or bad ids to escalation, and the router applies its usual rules. Below: 2.15 unsupported claims per reply (single agent 11.67), 76% of replies with any unsupported claim (single agent 98%), 97.9% must-escalate recall, $0.0022 per ticket.',
          width: 2280,
          height: 1170,
          caption: 'Each reply was broken into atomic claims and graded only against the evidence its writer actually had.',
        },
      },
      {
        title: 'Verify the review instead of implementing it',
        setup:
          'Before any of the eval work, an external code review flagged Row-Level Security as disabled and named thin test coverage on a function that had already corrupted the dashboard twice. The fast path is to patch exactly what is named and move on.',
        tradeoff:
          'Trusting a review\'s scope is faster. Verifying against the live system is slower, and it is only worth anything if you assume the report might be incomplete.',
        call:
          'I ran Supabase\'s own advisor against the live project instead of taking the finding on faith. It confirmed RLS disabled on all six tables, and the migration history showed why: an earlier, unrelated fix had granted the anonymous and authenticated roles full read and write on every table. Trying to write the missing tests surfaced the real cause of the coverage gap: the file imported a module that throws outside a bundler, so it was untestable, not just untested.',
        result:
          'The exposure got two independent fixes, revoking the grants and enabling deny-all RLS, confirmed by a second advisor scan. The untestable logic moved into a pure module with real coverage, including the ordering bug behind the earlier corruption. In 3 of the 7 review areas, the real problem was bigger than reported.',
      },
    ],
    lessons: [
      {
        title: 'The embedding model that disappeared',
        body: 'Mid-eval, every doc search started failing. The embedding model behind the index had been retired upstream (HTTP 410), which silently broke search everywhere, production included, and the agent kept going on error strings instead of docs. After sign-off, I re-embedded the whole index on qwen3-embedding-8b at the same 2048 dimensions, and the model is now documented as a hard dependency.',
      },
      {
        title: 'An eval batch that measured the database',
        body: 'Exact vector scans hit the Postgres statement timeout under concurrent load, and half of one early batch had silently failed searches. Scoring it would have measured the database, not the agent, so it was discarded. Every tool error is now recorded, failed searches are excluded and retried, and a retry can only ever replace an infrastructure failure, never a run the agent got wrong.',
      },
      {
        title: 'A judge that was unfair to the baseline',
        body: 'One single-agent reply scored 25 of 29 claims unsupported, which looked too harsh to trust. The judge had seen only the first 20 of up to 68 retrieved chunks, and none of the account record or the ticket. I threw those scores out and regraded both pipelines with the full evidence. A separate harness bug had also altered the "verbatim" sentences in the judge\'s own validation set; I fixed it and reran the validation from scratch.',
      },
      {
        title: 'A writer that thought until it ran out',
        body: 'The writer is a reasoning model, and on some tickets it reasoned through all 8,192 tokens and never made its forced call (finish_reason: length). Every single-call agent now has a capped reasoning budget with separate headroom for the answer.',
      },
      {
        title: 'An interval that collapsed to 100–100%',
        body: 'Where every run escalated correctly, the bootstrap interval came out as a meaningless 100–100%. Those arms now report a conservative ticket-level Wilson lower bound over the 24 needs-a-human tickets instead: 86.2% for the checker, not a false certainty.',
      },
      {
        title: 'The pattern',
        body: 'Almost all of these failed quietly: an error string where docs should be, a well-formed score built on missing evidence, an interval that looked precise. The habit that caught them was to check the inputs whenever a number looked surprising, in either direction, before believing the conclusion.',
      },
    ],
    checklists: [
      {
        title: 'Guardrails, each in code with a test',
        items: [
          'Monotone authority: applyChecker and applyGrounding can keep a route or escalate it, never the reverse, and a self-test runs every verdict against every route.',
          'Fail closed: a timeout, transport error, refusal, or malformed output escalates. Nothing defaults to agree.',
          'Strict schemas: every agent answers through one forced tool call with enum verdicts, parsed and validated before code reads it.',
          'Independence: the checker sees only the ticket and the proposed route, on a different prompt and a different model family.',
          'Least privilege: the researcher can only search, and the writer and checker have no tools at all.',
          'Input fencing: ticket and doc text is fenced and length-capped as data, and attempts to break the fence are neutralised before any prompt sees them.',
          'Deterministic grounding: code checks that every claim cites a passage the writer was actually given.',
          'Bounded and audited: timeouts, token ceilings, a capped reasoning budget, and retries only on transport errors. Every call is logged to tool_calls, and CHECKER=off is the kill switch.',
        ],
      },
      {
        title: 'Where it stands',
        items: [
          'Live at agenttriage.vercel.app: the intro site with the routing calculator, the evaluation, and the multi-agent results, plus the review queue and dashboard on synthetic tickets with mocked accounts and no sign-in.',
          'The live demo queue still shows the earlier paid single-agent run. Every eval number on this page comes from offline runs against the hand labels, and the site says so.',
          'Typecheck, 7 test suites, lint, and the production build pass. 18 bugs and findings are logged in the repo with their fixes.',
        ],
      },
    ],
    outcomes: [
      { stat: '100%', label: 'Must-escalate recall with the independent checker: 0 unsafe auto-resolves in 120 runs, up from 93.1%' },
      { stat: '2.15', label: 'Unsupported claims per reply after the researcher → writer split, down from 11.67' },
      { stat: '6 / 6', label: 'Prompt-injection probes escalated with either addition on, and 0 canary leaks' },
      { stat: '52', label: 'Hand-labeled tickets × 3 seeds, scored with ticket-level 95% intervals' },
      { stat: '$0.0016', label: 'Router cost per ticket. The checker adds $0.00005' },
      { stat: '18', label: 'Bugs and findings fixed across the build, audit, eval, and multi-agent work' },
    ],
    retro: [
      'Grow the labeled set and add a second labeler. Most of the honest "not significant" calls on this page are a sample-size problem, and with one labeler, label noise is unmeasured.',
      'Tune the checker instead of shipping only its strictest setting. It blocked 18 of 27 safe auto-resolves; the next experiment is whether a narrower prompt holds the 5-of-5 catch rate while the false alarms drop.',
      'Force submit_resolution as soon as the model stops calling tools, not only on the last turn. It is the main remaining source of incomplete runs.',
      'Rerun the live demo queue on the shipped pipeline and apply the indexed-vector migration, so the demo shows the same system the numbers describe.',
    ],
    cta: {
      type: 'demo',
      label: 'See it live, with the eval',
      href: 'https://agenttriage.vercel.app',
      more: [
        { label: 'Code and eval harness on GitHub', href: 'https://github.com/hamidrizvi4/claude-support-triage-agent' },
        { label: 'Evaluation report', href: 'https://github.com/hamidrizvi4/claude-support-triage-agent/blob/main/docs/EVALUATION.md' },
        { label: 'Multi-agent report', href: 'https://github.com/hamidrizvi4/claude-support-triage-agent/blob/main/docs/MULTI_AGENT.md' },
      ],
    },
  },
  // ==========================================================
  // QUADTAX
  // ==========================================================
  {
    slug: 'quadtax',
    subtitle:
      'An AI tax compliance engine for 1.5 million international students, and why the most important architecture decision was where AI is not allowed to go.',
    stack: ['Next.js', 'FastAPI', 'OpenAI Structured Outputs', 'Pydantic', 'Tesseract OCR'],
    myRole: [
      'Product lead on a three-person team. I scoped the zero-to-one opportunity, designed the hybrid architecture, built the deterministic tax engine and the OCR intake pipeline, and ran the beta. The calls documented below were mine to make and defend.',
      'A three-person team with no external boss means you are your own stakeholders, and we treated that seriously. We killed scope creep in standing reviews: state returns, amended filings, and a dozen visa edge cases all got argued for and cut. We caught each other gold plating more than once, polish on screens no beta user had asked for, and pulled the time back into intake. And when two credible approaches collided, deterministic rules versus letting the model reason about brackets being the biggest, we made the case to each other with prototypes and picked a side rather than splitting the difference.',
    ],
    architecture: {
      person: 'Filer',
      caption: 'The line through the middle is the product: models read and reason, Python does every number.',
      steps: [
        {
          tone: 'person',
          label: 'Filer · upload',
          title: 'Photograph your W-2.',
          note: 'Replaces 35 minutes of copying numbers into form fields.',
          chips: ['W-2', '1042-S', 'I-94'],
        },
        {
          tone: 'model',
          label: 'Intake agents',
          decision: 2,
          text: 'Tesseract and pdfplumber extract the page, OpenAI Structured Outputs fills Pydantic schemas.',
          chips: ['Parse', 'Classify', 'Residency', 'Treaty eligibility'],
          meta: 'Every field validates against a typed contract',
        },
        [
          {
            tone: 'rules',
            label: 'Passes validation',
            text: 'Flows straight into the return.',
            note: '90% less manual data entry.',
          },
          {
            tone: 'person',
            label: 'Fails validation',
            text: '"Please confirm this field."',
            note: 'An OCR misread becomes a question, never a wrong number.',
          },
        ],
        {
          tone: 'rules',
          label: 'Deterministic tax zone · Python',
          decision: 1,
          text: 'IRS rules written and tested by hand. The LLM cannot reach it.',
          list: [
            'Brackets and treaty thresholds',
            'Unit-tested against IRS examples',
            'FICA recovery under IRC § 3121(b)(19)',
          ],
          meta: '100% math accuracy by construction',
        },
        {
          tone: 'person',
          label: 'Filing package',
          decision: 3,
          title: '35 min → <10 min',
          chips: ['1040-NR', '8843', '8833'],
          note: 'Filing-ready PDFs. A 5-person beta drove two iteration cycles on intake.',
        },
      ],
    },
    decisions: [
      {
        title: 'The math never touches the LLM',
        setup:
          'The seductive design for an "AI tax engine" is an agent that does everything: reads your documents, reasons about your residency, computes your refund. Demos of that design are spectacular. Production is where it falls apart: LLMs are probabilistic, and tax math has exactly one right answer per input.',
        tradeoff:
          'Hand-coding IRS rules as deterministic Python is dramatically slower to build than prompting a model, as every bracket, treaty threshold, and form rule must be written and tested by hand. The all-LLM path ships faster and handles edge cases seemingly for free, but every output carries a small probability of a confidently wrong number, and in tax, one wrong number ends the user relationship permanently.',
        call:
          'I drew a hard line through the architecture. LLM agents handle what they are actually good at: parsing documents, classifying them, and reasoning about residency and treaty eligibility. Every calculation runs through a deterministic, IRS-rule-based zone the LLM cannot reach. Trust and auditability over AI-everywhere, explicitly.',
        result:
          '100% mathematical accuracy by construction: the deterministic zone is unit-testable against IRS examples, which no prompt can guarantee. "The AI never does your math" also became the product\'s best trust pitch to skeptical users.',
      },
      {
        title: 'Kill data entry before adding anything else',
        setup:
          'With the engine working, every direction competed for the team\'s next month: more visa situations, state returns, or the intake experience. Each of us had a favorite. Walking through Sprintax-style flows together made the choice clearer: the misery is not the tax logic, it is the 35 minutes of copying numbers from a W-2 into form fields.',
        tradeoff:
          'Breadth (more form types, more states) grows the addressable market, as each addition serves users I currently turn away. Depth (automating intake) serves the users I already have, dramatically better, but document parsing is genuinely hard: OCR fails, layouts vary by employer, and a silent misread is worse than asking the user to type.',
        call:
          'Depth first. I built the OCR pipeline: Tesseract and pdfplumber for extraction, OpenAI Structured Outputs with Pydantic schemas for validation, so W-2, 1042-S, and I-94 data flows in from an upload. The schema layer was the key call: every extracted field validates against a typed contract, and anything that fails validation falls back to a human-confirm step instead of passing through silently.',
        result:
          '90% reduction in manual data entry, and total filing time from about 35 minutes to under 10 in self-testing. The structured-output contract meant OCR errors surfaced as "please confirm this field," never as a wrong number on a form.',
      },
      {
        title: 'Three forms, five users, two iteration cycles',
        setup:
          'The form universe for nonresidents is deep: federal returns, state returns, treaty attachments, amended filings. As a three-person team with one tax season to hit, building "complete" coverage meant shipping nothing by April.',
        tradeoff:
          'Scoping to three federal forms (1040-NR, 8843, 8833) covers the core nonresident student case but turns away anyone needing state returns, which is most filers in most states. The alternative, broader coverage, meant missing the season entirely. A smaller product that exists beats a complete one that does not.',
        call:
          'Ship the three forms plus the FICA recovery module (the highest-value, most-ignored use case: identifying illegal withholding under IRC § 3121(b)(19)), then put the product in front of real filers immediately. A 5-person beta against live documents, watching where they hesitated rather than asking what they thought.',
        result:
          'The beta surfaced intake friction I had been blind to as the builder and drove two major iteration cycles on the intake experience before any wider release. The scope cut is also the roadmap: state returns are next, sequenced by beta demand rather than by my guesses.',
      },
    ],
    outcomes: [
      { stat: '<10 min', label: 'Filing time, down from 35 min of manual intake' },
      { stat: '90%', label: 'Reduction in manual data entry via OCR pipeline' },
      { stat: '100%', label: 'Math accuracy, deterministic zone, by construction' },
      { stat: '3', label: 'IRS forms generated as filing-ready PDFs (1040-NR, 8843, 8833)' },
      { stat: '5-person', label: 'Beta that drove two major iteration cycles on intake' },
      { stat: '1.5M', label: 'International students in the underserved market' },
    ],
    retro: [
      'Recruit beta users before building, not after. Our five testers arrived once the product worked end-to-end, which means the first two months of decisions were validated only against my own filing experience. Even three committed early users would have re-ordered our backlog.',
      'The FICA recovery module deserved the spotlight, not a supporting role. "Your employer may owe you money back" is a sharper hook than "file your taxes faster," and I under-positioned it. Distribution thinking should have started at the architecture stage.',
      'Self-testing time savings are a hypothesis, not a metric. "35 minutes to under 10" comes from my own runs; the honest version needs timing data from users who have never seen the product. That instrumentation is in the next cycle.',
    ],
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/QuadTax',
    },
  },

  // ==========================================================
  // AI PURCHASE ANALYTICS
  // ==========================================================
  {
    slug: 'analytics',
    subtitle:
      'An automated retail intelligence platform that collapsed a 4-hour Excel ritual into a 5-minute dashboard, and why the key architecture decision was letting Python do the math and Gemini do the thinking.',
    stack: ['Python', 'Pandas', 'Gemini', 'Streamlit', 'Plotly', 'Scikit-learn'],
    myRole: [
      'Solo developer and product owner. I scoped the feature set, built the full stack (Python data pipeline, Gemini integration, Streamlit front end), and ran it against a real 110K+ transaction dataset to validate the output before treating any of the metrics as real.',
    ],
    architecture: {
      person: 'Exec',
      caption: 'Gemini never generates a number. It explains the numbers Python generated.',
      steps: [
        {
          tone: 'person',
          label: 'Transaction export',
          title: '110K+ transactions',
          note: 'Replaces a 4-hour Excel ritual.',
        },
        {
          tone: 'rules',
          label: 'Pandas pipeline',
          decision: 1,
          text: 'Every calculation runs in Python.',
          chips: ['RFM segmentation', 'Cohort retention', 'Revenue attribution'],
          meta: '96K+ customer profiles in one run',
        },
        [
          {
            tone: 'rules',
            label: 'Churn model · Scikit-learn',
            decision: 3,
            title: 'AUC 0.82',
            note: 'On held-out test data. 15% better retention targeting than the rule-based baseline.',
          },
          {
            tone: 'model',
            label: 'Gemini',
            decision: 1,
            text: 'Receives only validated, structured output.',
            note: 'Explains segments, weak cohorts, and churn risk in plain English.',
            meta: 'Never sees raw data',
          },
        ],
        {
          tone: 'person',
          label: 'Streamlit dashboard',
          decision: 2,
          title: '4 hr → 5 min',
          note: 'Plotly charts with hover detail. Filter by segment, drill into a cohort.',
        },
      ],
    },
    decisions: [
      {
        title: 'LLM interprets; Python computes',
        setup:
          'The obvious design for an "AI analytics" tool is to hand the LLM a transaction export and ask it to find insights. I tried this in the first prototype, and the numbers it generated were fabricated with confidence. RFM scores, retention percentages, churn probabilities: all plausible, none accurate.',
        tradeoff:
          'Giving Gemini structured output (pre-computed Pandas DataFrames) is more engineering up front but produces accurate insights. Giving it raw data is faster to build but produces hallucinated numbers, which in a business intelligence context is worse than no output at all. A wrong churn score is not a bug; it is a business decision made on bad data.',
        call:
          'Hard split: Pandas handles every calculation (RFM segmentation, cohort retention, churn model training, revenue attribution). Gemini receives only the validated, structured output and generates narrative: what the segments mean, which cohorts are underperforming, what the churn risk profile implies for next quarter\'s retention spend. The LLM never generates a number; it explains the numbers Python generated.',
        result:
          'AUC 0.82 on the churn model, validated against held-out test data, not hallucinated. Gemini\'s narrative layer translated the statistical output into plain-English recommendations that a non-technical exec could act on without a data analyst intermediary.',
      },
      {
        title: 'Dashboard over report',
        setup:
          'The output format decision: generate a static PDF report (familiar format, printable, shareable by email) or build an interactive Streamlit dashboard (requires a running server, unfamiliar to some execs). PDF is what a consultant would deliver. Dashboard is what a product would ship.',
        tradeoff:
          'PDF reports are consumed once and filed. Dashboards get interrogated: a CFO can filter by segment, drill into a specific cohort, or rerun the churn view for just the high-LTV customers. But dashboards require infrastructure and trust. If the server is down or the exec does not know how to use it, the whole product fails silently.',
        call:
          'Dashboard, because the analysis is most valuable when it is explorable. I bet on Streamlit\'s low floor: the UI is simple enough that non-technical users navigate it without training. I added Plotly charts with hover tooltips so the data speaks without needing a walkthrough. The PDF export button is in the roadmap; it is a lower priority than making the live view genuinely useful first.',
        result:
          '95% reporting time reduction: the 4-hour Excel workflow runs in under 5 minutes on the same dataset. 96K+ customer profiles processed in a single pipeline run with no manual intervention.',
      },
      {
        title: 'Build the churn model before proving dashboard ROI',
        setup:
          'After the core RFM and cohort views were working, two directions competed for the next sprint: validate that the dashboard actually changed a business decision (proving ROI) or build the churn prediction model (adding the highest-value analytical capability). Proving ROI is the right PM instinct. Building the model was the right product instinct.',
        tradeoff:
          'The dashboard without churn prediction is a better Excel. The dashboard with churn prediction is a decision engine: it tells you not just who your customers are but which ones you are about to lose and why. That is the difference between a reporting tool and an action tool. But the churn model takes meaningful engineering (feature engineering, cross-validation, threshold calibration) and the ROI proof requires external users I did not yet have.',
        call:
          'Build the model first. The churn score is the most actionable output in the entire dashboard: "customers in this segment have a 68% probability of churning in the next 30 days" generates a concrete business response in a way that a retention rate graph does not. The AUC 0.82 result also gave me a quality bar to defend; without it, the churn view would have been aspirational rather than credible.',
        result:
          'A 15% improvement in retention targeting accuracy compared to the baseline rule-based approach. The model surfaced a customer segment that was high-spend but high-churn, invisible in aggregate reporting and actionable once isolated.',
      },
    ],
    outcomes: [
      { stat: '95%', label: 'Reporting time reduction (4 hr to 5 min)' },
      { stat: '110K+', label: 'Transactions processed in a single pipeline run' },
      { stat: '96K+', label: 'Customer profiles segmented and scored' },
      { stat: 'AUC 0.82', label: 'Churn model, 15% improvement over baseline' },
      { stat: '<5 min', label: 'End-to-end RFM, cohort, and churn dashboard runtime' },
    ],
    retro: [
      'Test the dashboard with a non-technical user before calling it done. I validated the numbers but not the experience. The first external demo revealed that the segment naming ("Champions," "At Risk") was obvious to me and opaque to someone who had not read the RFM literature.',
      'The churn model needs external validation before the AUC gets presented as a business metric. 0.82 on my test split is a technical result; what matters is whether the model\'s predictions actually drove a different retention action. That feedback loop requires a live integration, not a retrospective analysis.',
      'The PDF export belongs in v1, not the roadmap. Execs share deliverables by email; a Streamlit URL does not travel. I optimized for the tool I found more interesting to build, not the format the user would actually distribute.',
    ],
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/Purchase-Analytics-AI',
    },
  },

  // ==========================================================
  // SQUIRREL AI
  // ==========================================================
  {
    slug: 'squirrel',
    subtitle:
      'A codebase intelligence tool that gives you plain-English answers about any GitHub repo, and why the naive approach of dumping the whole repo into the context window does not survive contact with a real codebase.',
    stack: ['React', 'FastAPI', 'OpenAI', 'Embeddings', 'Python'],
    myRole: [
      'Product lead on a two-person team, a friend and me. I defined the scope, public GitHub repos first with private repos as the v2 target, built the extraction and Q&A pipeline, and ran it against real repositories to validate that the answers were actually useful, not just grammatically plausible.',
      'Two people is the smallest team that still forces real product arguments, and we had them. The biggest was extraction depth versus shipping speed: the naive full-repo approach was simpler and faster to ship, the structured extraction layer was more engineering with a payoff we could only argue for. We settled it the honest way, ran the naive version against a real 50K-line codebase, and watched it collapse. Disagreements ended with evidence, not with whoever talked longer.',
    ],
    architecture: {
      person: 'Developer',
      inset: 'Cache',
      caption: 'v0 concatenated the whole repo into the prompt. It collapsed on a real 50K-line codebase.',
      steps: [
        {
          tone: 'person',
          label: 'Developer · repo URL',
          title: 'Any public GitHub repo.',
          note: 'Private repos are the v2 target.',
        },
        {
          tone: 'rules',
          label: 'Structured extraction',
          decision: 1,
          text: 'Language-specific parsers, the same output regardless of syntax.',
          chips: ['Functions and classes', 'Signatures and docstrings', 'Imports', 'Dependency graph'],
          meta: '11 languages',
        },
        {
          tone: 'rules',
          label: 'Embedding index',
          decision: 3,
          text: 'Built on the extracted metadata, with source paths carried through.',
          inset: {
            label: 'In-memory, TTL',
            steps: ['Key: repo URL + commit SHA', 'A new commit invalidates it'],
            note: '20 to 40 seconds cold, under a second after.',
          },
        },
        {
          tone: 'model',
          label: 'LLM answer',
          decision: 2,
          text: 'Answers from retrieved chunks, never the raw repo.',
          meta: 'Citation format enforced in the prompt',
        },
        {
          tone: 'rules',
          label: 'Citation validator',
          decision: 2,
          text: 'Every cited path is checked against the repo before the answer returns.',
          note: 'A path that does not exist is flagged, not returned as a confident answer.',
        },
        {
          tone: 'person',
          label: 'Answer with citations',
          title: '0 hallucinated paths',
          note: 'File paths and functions in every answer, so the developer jumps straight to the code.',
        },
      ],
    },
    decisions: [
      {
        title: 'Extract structure; don\'t rely on the context window',
        setup:
          'The naive implementation of a codebase Q&A tool is to clone the repo, concatenate every file, and send the whole thing to the LLM. This works on toy repositories. On a real codebase with 50K+ lines, it fails immediately: most models hit context limits, latency is multi-second, and the signal-to-noise ratio collapses because the model is swimming in irrelevant code.',
        tradeoff:
          'Structured extraction (parse functions, classes, imports, file relationships) is more engineering but produces a compact, queryable representation of the codebase. Raw concatenation is simpler to build but only works on repos small enough to fit in a context window, which excludes most interesting targets. The extraction approach trades build time for accuracy and scale.',
        call:
          'Build the extraction layer first. For each file in a repo, extract: function and class names, their docstrings and signatures, import relationships, and the file\'s role in the dependency graph. That structured metadata is what the embedding index is built on. The LLM answers questions against retrieved chunks of that index, not against the raw codebase. This means the accuracy of answers depends on the quality of extraction, which is testable, unlike raw context window stuffing.',
        result:
          'Multi-language support across 11 languages (Python, JS, TS, Go, Java, Rust, and more) because the extraction layer uses language-specific parsers, not a generic LLM prompt. Each parser produces the same structured output regardless of syntax. Answers are grounded in real file paths, function names, and class hierarchies rather than LLM confabulation.',
      },
      {
        title: 'File citations in every answer',
        setup:
          'Early prototypes returned plain-text answers: "The authentication logic lives in the user service and validates JWT tokens against the Redis cache." Correct, but unusable: a developer reading that answer still has to grep for it. The tool was not saving the onboarding time I was trying to save.',
        tradeoff:
          'Adding file path citations to every answer requires the retrieval system to know not just what text is relevant but what file it came from. That means maintaining source metadata through the embedding pipeline, an extra engineering requirement that complicates the indexing step. The alternative is plain-text answers that are faster to build and still useful for high-level questions, but miss the navigational value entirely.',
        call:
          'Citations are non-negotiable. The whole product value is navigation: knowing where to go, not just what exists. Every answer now includes the source file paths and the specific functions or classes referenced, formatted so a developer can jump directly to the code. The prompt template was redesigned to enforce citation format, and the API validates that cited paths exist in the repo before returning the answer.',
        result:
          'Context-aware Q&A with cited file references in every response. Users can follow citations directly to source without a second search step. This also made hallucination visible: if the model cited a file path that does not exist, the validation layer flags it rather than returning a confident wrong answer.',
      },
      {
        title: 'Cache the analysis, not just the answers',
        setup:
          'The first analysis of a repository is expensive: GitHub API calls to fetch the file tree, extraction across every source file, embedding generation for the index. On a medium-sized repo, this takes 20 to 40 seconds. That latency is acceptable once; it is fatal if it happens on every question.',
        tradeoff:
          'Caching the entire analysis (extraction and embeddings) means first-load is slow but every subsequent query is sub-second. Not caching means consistent latency of around 30 seconds per question, which makes the tool feel broken even if the answers are good. In-memory cache is simplest but ephemeral (lost on server restart). Persistent cache (disk or DB) survives restarts but adds complexity and storage requirements.',
        call:
          'In-memory cache with a TTL, deliberately accepting that cache misses happen if the process restarts. For a first version, the right call is reducing perceived latency for the common case (repeat queries on a repo the user just analyzed) rather than solving the persistence problem that only matters after users return on day two. The cache key is the repo URL plus commit SHA, so if the repo updates, the cache invalidates correctly.',
        result:
          'Sub-second subsequent queries on any previously analyzed repository. The cold-load time is disclosed to users upfront ("analyzing this repository...") so the wait is expected rather than surprising. The architecture makes persistent caching a two-line change when usage patterns justify it.',
      },
    ],
    outcomes: [
      { stat: '11', label: 'Languages supported via dedicated extraction parsers' },
      { stat: '100%', label: 'Answers include cited file references, no exceptions' },
      { stat: '<1s', label: 'Subsequent query latency on cached repositories' },
      { stat: '0', label: 'Hallucinated file paths returned; validation layer enforces this' },
    ],
    retro: [
      'I built the extraction engine before validating that users found the Q&A answers useful. The right sequence is: get one user to ask ten real questions about a codebase they know, evaluate whether the answers save them time, then build the infrastructure that enables that experience at scale. I did it backwards.',
      'Multi-language support sounds impressive; Python, JS, and TypeScript handle 90% of the real use cases and the other 8 languages are undertested. I should have shipped 3-language support with high confidence rather than 11-language support with mixed accuracy.',
      'Private repo support is the actual product. Public GitHub repos are convenient for demos; the onboarding pain I was solving lives in private, company-owned codebases. I scoped to public repos for the MVP, which is the right call, but the roadmap should have been named and sequenced from day one rather than treated as a future consideration.',
    ],
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/Squirrel-AI',
    },
  },

  // ==========================================================
  // EQUIPLY ASSET INTELLIGENCE
  // ==========================================================
  {
    slug: 'equiply',
    subtitle:
      'A hiring-tournament brief asked for two enriched CSV columns. We shipped a client-side data pipeline and a full asset-intelligence dashboard, and still exported the exact clean CSV the minimum tier asked for.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'PapaParse', 'Custom SVG charts'],
    myRole: [
      'An Optimal Tier submission to Equiply\'s hiring tournament. We treated the deliberately underspecified brief as a product exercise rather than a data-cleaning task: decide what the end user of this data actually needs, build the smallest version of that, and still hand back the exact artifact the minimum tier required.',
    ],
    architecture: {
      person: 'Operations team',
      inset: 'Minimum tier, protected',
      caption: 'Runs entirely client-side: the equipment data never leaves the browser, and there are no external APIs.',
      steps: [
        {
          tone: 'person',
          label: 'Raw CSV',
          title: '801 medical devices',
          note: 'Parsed in the browser with PapaParse.',
        },
        {
          tone: 'rules',
          label: 'Heuristic extraction engine',
          decision: 2,
          text: 'Manufacture dates decoded from the serial numbers themselves.',
          chips: ['Numeric year-month blocks', 'Prefix-block decoding', 'Medical dictionary, 50+ brands'],
        },
        [
          {
            tone: 'rules',
            label: 'Parsed',
            title: '52%',
            note: 'High confidence. Every derived field traces back to a documented rule.',
          },
          {
            tone: 'person',
            label: 'Unreadable',
            decision: 3,
            title: '48%',
            note: 'Placeholder date so nothing crashes, confidence dropped to 30%, flagged for human audit.',
          },
        ],
        {
          tone: 'person',
          label: 'Asset intelligence dashboard',
          decision: 1,
          chips: ['Total assets', 'Data health', 'Critical replacements'],
          meta: '478 units critical · 25+ device types',
          inset: {
            label: 'One-click export',
            note: 'Strips all application metadata and produces exactly the clean CSV the brief asked for.',
          },
        },
      ],
    },
    decisions: [
      {
        title: 'Ship a product, not a CSV',
        setup:
          'The minimum submission tier was a clean, enriched CSV. That is a safe afternoon of work. But an enriched CSV still makes a human scroll 800 rows to figure out which equipment needs replacing, which is the actual job the data exists to do.',
        tradeoff:
          'Building a full dashboard risks over-engineering a submission that graders may only skim, and every hour on UI is an hour not spent hardening the extraction logic the brief explicitly graded. Shipping only the CSV is safe but indistinguishable from every other submission.',
        call:
          'Build the dashboard, but protect the requirement: a one-click export strips all application metadata and produces exactly the minimum-tier CSV. Ambition never put the baseline at risk. The dashboard renders real-time KPIs, total assets, data health, and critical replacements, on top of the same pipeline output.',
        result:
          '801 medical devices enriched, browsable, and filterable across 25+ device types, submitted at the Optimal Tier with the clean CSV export intact.',
      },
      {
        title: 'Heuristics over guesses when no API exists',
        setup:
          'With no external database to look up manufacture dates, the only place the data could come from was the serial numbers themselves, where manufacturers embed dates in proprietary formats.',
        tradeoff:
          'Hand-building a pattern-decoding engine for dozens of serial formats is slow, and it will never reach 100% coverage. Assigning plausible-looking default dates to everything is fast and looks complete, but silently fabricates the exact field the challenge graded.',
        call:
          'A custom heuristic extraction engine: direct numeric decoding for serials with embedded year-month blocks, prefix-block decoding that strips factory codes to isolate the date, and a medical dictionary that maps generic model names to standard device categories across 50+ brands.',
        result:
          '52% of serials parsed with high confidence. The rest degraded gracefully instead of failing, and every derived field traces back to a documented rule rather than a guess.',
      },
      {
        title: 'Flag uncertainty, never hide it',
        setup:
          'Some serial numbers are simply unreadable. The pipeline still has to produce a row, because a crashed pipeline helps nobody, but a fabricated date presented as fact is worse than a blank.',
        tradeoff:
          'Dropping unreadable rows keeps the dataset pure but shrinks it. Filling them silently keeps the dataset complete but poisons trust in every other row, because a reader can no longer tell which dates are real.',
        call:
          'Graceful degradation with visible confidence scoring: unreadable serials get a placeholder date so nothing crashes, but the row\'s confidence score drops to 30% and the dashboard visually flags it for human audit. A Data Health KPI puts the honest number front and center.',
        result:
          '48% of rows flagged for human review instead of passing as fact. The dashboard tells you what it knows and, just as loudly, what it does not.',
      },
    ],
    outcomes: [
      { stat: '801', label: 'Medical devices enriched across 25+ device types' },
      { stat: '478', label: 'Units flagged critical for replacement planning' },
      { stat: '52%', label: 'Serials parsed with high confidence, rest flagged for audit' },
      { stat: '100%', label: 'Client-side, equipment data never leaves the browser' },
      { stat: '0', label: 'External APIs or charting libraries used' },
    ],
    retro: [
      'Calibrate the confidence scores against a hand-labeled sample. 52% high confidence is the heuristic grading its own homework; verifying even 50 rows by hand would turn that into a measured precision number, and probably move it.',
      'The lifespan thresholds behind Good, Warning, and Critical came from our own research, not from a hospital biomedical team. Before anyone plans a replacement budget on this dashboard, those thresholds need validation from the people who actually maintain the machines.',
      'No real operations user ever navigated the dashboard. The KPI hierarchy reflects my read of the brief, and the first session with an actual equipment manager would almost certainly reorder it.',
    ],
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/equiply-intelligence',
    },
  },
];

export function getDeepDive(slug: string): DeepDive | undefined {
  return deepDives.find((d) => d.slug === slug);
}
