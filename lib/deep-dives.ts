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

export interface Lesson {
  title: string;
  body: string;
}

export interface Checklist {
  title: string;
  items: string[];
}

export interface DeepDive {
  slug: string;
  subtitle: string;
  stack: string[];
  myRole: string[];
  architectureDiagram?: string;
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
    architectureDiagram: `\
        MODEL              │        CODE AND PEOPLE
                           │
                           │  Upload (PDF / image)
                           │    → validate (magic bytes, size)
                           │    → normalize image to sRGB
                           │    → store (building-scoped path)
                           │
 vision model reads  ◀─────┤
 the page                  │
   → fixed JSON schema     │
     (no action fields) ───┼─▶ needs_review
                           │    → human confirms
                           │    → deterministic cycle table
                           │      (TypeScript, versioned)
                           │      computes the due date
                           │    → compliance_obligation
                           │      (source: extracted_from_document)
                           │    → portfolio heatmap

 Everything the model touches ends at needs_review.`,
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
      'An agent that triages developer support tickets against real documentation, routes on stakes rather than raw confidence, then goes through a 7-point external code review the way a senior engineer works one: verify everything, fix what the review found, and fix what it missed too.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'pgvector', 'OpenRouter'],
    myRole: [
      'Solo build and solo audit. I designed the agent loop and the routing engine, built the ingestion pipeline against real documentation, and shipped the review queue and reporting dashboard on top.',
      'Once the core product was live, I ran the repo through a 7-point external code review and treated the findings the way I\'d want a senior engineer to treat feedback on my own code: verify everything independently against the live system before touching anything, and don\'t assume the review\'s scope was complete. In three of the seven areas, the actual problem was larger than what was reported.',
    ],
    architectureDiagram: `\
docs.claude.com ────┐
support.claude.com ─┼──▶ ingestion: chunk + embed ──▶ Supabase / pgvector
status.claude.com ──┘                                    RLS enabled, default-deny

ticket ──▶ agent orchestrator: tool-calling loop ──▶ routing engine
                     │                                     │
                     ▼                                     ├──▶ auto-resolve
              tool_calls: audit trail                      └──▶ human review queue`,
    decisions: [
      {
        title: 'The routing engine decides, not the model',
        setup:
          'With five tools and a forced structured final output, the obvious design is to let the model itself decide when it is confident enough to auto-resolve a ticket. Confidence is right there in the output, so why not use it directly.',
        tradeoff:
          'Model confidence is a probabilistic self-report, and a single wrong autonomous answer on a billing or security ticket costs far more than a slow answer on a rate-limit question. Letting the model gate its own escalation is simpler to build, but it puts a probability distribution in charge of a decision that should be categorical.',
        call:
          'A rules-based routing engine sits outside the model and makes the final call. Billing, security, sales, and bug-report categories always escalate to a human, regardless of how confident the model claims to be. Everything else routes on a blended score, 0.6 times retrieval score plus 0.4 times self-certainty, against a 0.8 threshold. The asymmetric-risk categories get a hard rule, not a probability.',
        result:
          'Every ticket now carries a category-based override or a measured threshold decision, and every tool call behind that decision is logged. The confidence formula itself had no empirical validation at first, a gap the audit phase below closes.',
      },
      {
        title: 'Verify the review, do not just implement it',
        setup:
          'An external code review flagged Row-Level Security as disabled and named thin test coverage on a function that had already caused two real dashboard-corrupting bugs. The fast path is to patch exactly what is named and move on.',
        tradeoff:
          'Trusting a review\'s scope is faster. Verifying independently against the live system is slower and sometimes finds the review understated the problem, which is only useful if you actually do it rather than assume the report was complete.',
        call:
          'I ran Supabase\'s own advisor tooling against the live project instead of taking the finding on faith, and confirmed RLS disabled at ERROR level on all six tables, plus a WARN on a mutable function search path. Reading the migration history explained why: an earlier, unrelated fix had granted the anon and authenticated roles full read and write on every table as a side effect. On the test-coverage finding, trying to actually write the tests surfaced the real cause: the file was gated by an import that throws unconditionally outside a bundler, making it structurally untestable, not just untested.',
        result:
          'Fixed the security exposure with two independent layers, revoked the unintended grants and enabled RLS default-deny, then verified with a second advisor scan showing both the ERROR and the WARN gone. Extracted the untestable logic into a pure module with no server-only gate and wrote real coverage against it, including the specific ordering bug that had caused the prior corruption. Four test suites now run as one command.',
      },
      {
        title: 'Disclose the free-tier number instead of burying it',
        setup:
          'The free-tier run against a real 40-ticket set came back 50% incomplete. That is a true, disclosed finding, and also a number that reads as "the demo does not work" to someone skimming.',
        tradeoff:
          'Reframe the story, quietly rerun until a better number appears, or spend real money on a clean paid run. Every option is defensible, and picking one alone and presenting it as the only option would have hidden the actual tradeoff the project exists to demonstrate.',
        call:
          'Surfaced it as an explicit choice rather than picking the flattering one silently, then spent a small budget, about $10, on an Exacto-routed paid rerun of the identical ticket set. Both configurations stay in the write-up.',
        result:
          'Free tier: 8 resolved, 12 escalated, 20 incomplete, $0. Paid: 15 resolved, 22 escalated, 3 incomplete, $0.25. Both rows verified independently, the free-tier figure recomputed from the database against the dashboard\'s own classification rules, the cost figure pulled from OpenRouter\'s billing API rather than estimated.',
      },
      {
        title: 'Route the judgment calls, not just the tickets',
        setup:
          'Three separate moments came up where the easy move was to decide something alone and make the story tidier: squash the git history into a cleaner narrative, pick whichever framing of the incomplete-rate number looked best, and quietly smooth over a git discrepancy where a single commit covered what should have been roughly a dozen files with no record of the session that produced it.',
        tradeoff:
          'Every one of those calls would have been easy to make alone, and nobody reviewing the finished product would have known. But the entire thesis of this agent is that some decisions get routed to a human because the output alone cannot tell you whether skipping that step was safe.',
        call:
          'Left the git history alone rather than rewriting published commits. Surfaced the incomplete-rate number as a three-way choice instead of silently picking the best-looking one. Reported the commit discrepancy plainly and asked before proceeding rather than guessing at an explanation.',
        result:
          'One of those moments got a decision, the $10 paid rerun, made as an explicit opt-in. The other two got left alone, on the record. Both outcomes are visible in the repo, which is the same audit trail the product itself produces for every ticket it routes.',
      },
    ],
    outcomes: [
      { stat: '7', label: 'External review findings, 3 of 7 larger than reported once independently verified' },
      { stat: '2', label: 'Independent fix layers for a live pre-launch RLS security exposure' },
      { stat: '4', label: 'Test suites added after extracting untestable logic into a pure module' },
      { stat: '$0.25', label: 'Cost to cut the incomplete rate from 50% to 7.5% on the same 40-ticket set' },
      { stat: '12', label: 'Verified bugs fixed across the build, the audit, and the paid rerun' },
      { stat: '0', label: 'Unilateral rewrites of git history or silently cherry-picked numbers' },
    ],
    retro: [
      'Raise the max-token limit and re-verify. One ticket in the paid rerun came back with truncated JSON, almost certainly the output ceiling cutting a long response mid-payload, a clear next fix rather than a mystery.',
      'Turn the doc-gap signal into an actual feedback loop. Right now it surfaces on the dashboard as a list of low-retrieval tickets, and it should feed directly into documentation planning instead of waiting to be read.',
      'The reviewer-overturn calibration metric is only meaningful at scale. At launch it reflected exactly one real human review, a single data point dressed up as a percentage, and it needs a real sample before anyone should trust it.',
    ],
    cta: {
      type: 'github',
      label: 'Check out the GitHub repo',
      href: 'https://github.com/hamidrizvi4/claude-support-triage-agent',
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
