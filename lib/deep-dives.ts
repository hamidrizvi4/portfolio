/**
 * deep-dives.ts
 *
 * Long-form case study content for /work/[slug] pages.
 *
 * Structure per study (the PM-interview arc):
 *   context → my role → the hard decisions (setup / tradeoff / call / result)
 *   → outcomes → what I'd do differently
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

export interface TamSlide {
  segments: Array<{ label: string; size: string; note: string }>;
  pricing: Array<{ tier: string; price: string; note: string }>;
  contextNote: string;
  unitEconomics: { arpu: string; cac: string; payback: string };
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
  architectureDiagram?: string;
  tamSlide?: TamSlide;
  decisions: Decision[];
  outcomes: Outcome[];
  retro: string[]; // What I'd do differently, numbered and honest
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
      'A zero-to-one restaurant reservation template inside a 1-click no-code platform, and the architecture decisions that cut onboarding from 30 minutes to 5.',
    role: 'AI/ML Product Engineering Intern · Capstone PM Lead',
    period: 'Feb - May 2026\nSep - Dec 2025',
    stack: ['TypeScript', 'RAG', 'Gemini', 'Prompt Engineering', 'Microservices'],
    context: [
      'SMB restaurants want what SevenRooms and OpenTable give the big chains (reservations, waitlists, guest profiles), but the pricing does not work at their scale. LexTrack\'s bet is a 1-click no-code platform where a merchant generates a custom app instead of buying a legacy one.',
      'The catch: "1-click" was marketing, not reality. Standing up a reservation app meant configuring 80+ metadata fields across 11 categories: table layouts, service windows, party-size rules, and deposit policies. Merchants were spending 30+ minutes in setup, and time-to-value is where SMB products die. The product worked; the onboarding killed it.',
    ],
    myRole: [
      'I led the reservation template as the capstone PM, managing a team of 3 engineers and 1 designer while writing code alongside them. I owned the problem definition, ran 25+ customer interviews and the competitive analysis (Toast, Square, Lightspeed), made the architecture calls below, and carried the product from zero to 50+ active users in 8 weeks.',
      'After the capstone shipped, LexTrack brought me back as an AI/ML Product Engineering intern. I now own the production side of the same system: RAG pipelines, model evaluation, and the cost and latency budget.',
    ],
    architectureDiagram: `\
Merchant: "Describe your restaurant"
                   │
                   ▼
         ┌─────────────────┐
         │   FIELD ROUTER  │
         │   (classifier)  │
         └────────┬────────┘
                  │
     ┌────────────┴────────────┐
     │                         │
     ▼                         ▼
┌──────────────┐       ┌───────────────────┐
│ DETERMINISTIC│       │    GEMINI LLM     │
│     ZONE     │       │                   │
│              │       │  Ambiguous only   │
│ Table counts │       │  Service style    │
│ Party sizes  │       │  Deposit rules    │
│ Booking hrs  │       │  Custom notes     │
│  ~40 fields  │       │   ~40 fields      │
└──────┬───────┘       └─────────┬─────────┘
       │                         │
       │               ┌─────────▼─────────┐
       │               │    3-LAYER        │
       │               │    FALLBACK       │
       │               │  1. Primary LLM   │
       │               │  2. Cached resp   │
       │               │  3. Deterministic │
       │               └─────────┬─────────┘
       └─────────────────────────┘
                       │
                       ▼
             ┌─────────────────┐
             │  REVIEW SCREEN  │
             │ (flagged fields │
             │  surfaced first)│
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │  LIVE APP READY │
             │  80+ fields     │
             │  in ~5 minutes  │
             └─────────────────┘`,
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
      'An AI tax compliance engine for 1.5 million international students, and why the most important architecture decision was where AI is not allowed to go.',
    role: 'Product Lead · 3-person team',
    period: 'Apr 2026 - Present',
    stack: ['Next.js', 'FastAPI', 'OpenAI Structured Outputs', 'Pydantic', 'Tesseract OCR'],
    context: [
      'Every April, 1.5 million international students (F-1/J-1 visa holders) hit the same wall: US nonresident tax rules are genuinely confusing, employers illegally withhold FICA tax from them (IRC § 3121(b)(19)), and TurboTax does not serve them at all. The incumbent, Sprintax, charges a premium for what is still a 35-minute manual intake process.',
      'I lived this problem as an F-1 student myself. That is also why I scoped it carefully: tax filing is the lowest-trust product category imaginable. One wrong number is not a bug, it is an IRS letter. Every product decision below flows from that constraint.',
    ],
    myRole: [
      'Product lead on a three-person team. I scoped the zero-to-one opportunity, designed the hybrid architecture, built the deterministic tax engine and the OCR intake pipeline, and ran the beta. The calls documented below were mine to make and defend.',
      'A three-person team with no external boss means you are your own stakeholders, and we treated that seriously. We killed scope creep in standing reviews: state returns, amended filings, and a dozen visa edge cases all got argued for and cut. We caught each other gold plating more than once, polish on screens no beta user had asked for, and pulled the time back into intake. And when two credible approaches collided, deterministic rules versus letting the model reason about brackets being the biggest, we made the case to each other with prototypes and picked a side rather than splitting the difference.',
    ],
    tamSlide: {
      segments: [
        {
          label: 'TAM',
          size: '~1.2M',
          note: 'F-1/J-1 students who file US nonresident returns annually. The market peaked near 1.5M and is contracting due to immigration policy shifts. I am sizing to the current reality, not the peak.',
        },
        {
          label: 'SAM',
          size: '~500K',
          note: 'Students not fully covered by university Sprintax partnerships, or those needing FICA recovery services that no existing tool provides. Roughly 40 to 45% of the total.',
        },
        {
          label: 'SOM',
          size: '~25K',
          note: 'Year-1 target via NYU network, international student associations, and April tax-season SEO. Verified distribution channels, not aspirational reach.',
        },
      ],
      pricing: [
        {
          tier: 'Federal only',
          price: '$39',
          note: 'Core 1040-NR and 8843. Matches Sprintax pricing; 3x faster on intake.',
        },
        {
          tier: 'Federal + state',
          price: '$59',
          note: 'Add one state return. Sprintax charges $40 to $60 per state on top of the federal fee.',
        },
        {
          tier: 'FICA Recovery Bundle',
          price: '$99',
          note: 'Identifies and files for recovery of illegally withheld FICA tax under IRC § 3121(b)(19). Average $600 to $1,200 back per student. Unique to QuadTax.',
        },
      ],
      contextNote: 'The FICA angle is the real product differentiation. Most international students do not know their employers are illegally withholding Social Security and Medicare tax from their paychecks. Most competitors do not surface it. QuadTax finds it automatically. "Your employer may owe you $800" is a sharper hook than "file your taxes faster."',
      unitEconomics: {
        arpu: '~$62',
        cac: '~$12',
        payback: 'Same season',
      },
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
        title: 'Three forms, five users, two rewrites',
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
    nextSlug: 'analytics',
  },

  // ==========================================================
  // AI PURCHASE ANALYTICS
  // ==========================================================
  {
    slug: 'analytics',
    index: '03',
    title: 'AI Purchase Analytics',
    subtitle:
      'An automated retail intelligence platform that collapsed a 4-hour Excel ritual into a 5-minute dashboard, and why the key architecture decision was letting Python do the math and Gemini do the thinking.',
    role: 'Solo Developer (Personal Project)',
    period: 'Oct 2025 · New York',
    stack: ['Python', 'Pandas', 'Gemini', 'Streamlit', 'Plotly', 'Scikit-learn'],
    context: [
      'Retail leadership teams spend entire workdays inside Excel every week: pulling customer segments by RFM score, calculating cohort retention by hand, re-running churn risk calculations on updated transaction exports. By the time the deck is ready for Monday\'s standup, the data is 48 hours stale. The analysis is technically correct and operationally useless.',
      'I had seen this firsthand: the problem is not that the math is hard, it is that it is repetitive, manual, and disconnected from action. The question I wanted to answer was what the same workflow looks like if Pandas handles the computation and Gemini handles the interpretation.',
    ],
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
    nextSlug: 'squirrel',
  },

  // ==========================================================
  // SQUIRREL AI
  // ==========================================================
  {
    slug: 'squirrel',
    index: '04',
    title: 'Squirrel AI',
    subtitle:
      'A codebase intelligence tool that gives you plain-English answers about any GitHub repo, and why the naive approach of dumping the whole repo into the context window does not survive contact with a real codebase.',
    role: 'Product Lead · 2-person team',
    period: '2025',
    stack: ['React', 'FastAPI', 'OpenAI', 'Embeddings', 'Python'],
    context: [
      'Onboarding to a new codebase is the worst part of any engineering job. The README describes the architecture as it was designed, not as it shipped. Code comments are six months stale. The engineer who built the authentication module left in March. Getting up to speed means reading thousands of lines of code and hoping someone has time to answer questions, which they usually do not.',
      'We built Squirrel AI to make that first week shorter. The bet: if you can extract the right structure from a codebase and index it correctly, a language model can answer context-aware questions faster and more accurately than grep or a senior engineer\'s calendar.',
    ],
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
    nextSlug: 'equiply',
  },

  // ==========================================================
  // EQUIPLY ASSET INTELLIGENCE
  // ==========================================================
  {
    slug: 'equiply',
    index: '05',
    title: 'Equiply Asset Intelligence',
    subtitle:
      'A hiring-tournament brief asked for two enriched CSV columns. We shipped a client-side data pipeline and a full asset-intelligence dashboard, and still exported the exact clean CSV the minimum tier asked for.',
    role: 'Optimal Tier submission',
    period: 'Hiring tournament',
    stack: ['React', 'Vite', 'Tailwind CSS', 'PapaParse', 'Custom SVG charts'],
    context: [
      'Hospitals struggle with dirty, incomplete equipment data. Equiply\'s hiring tournament handed contestants a raw CSV of hospital equipment records, manufacturer, model, and serial number, and asked for two enriched fields: manufactured date and device type. No external API or database was provided. How you got there was up to you.',
      'The brief was really a product question wearing a data-cleaning costume: what does a hospital operations team actually need from this data? Not a cleaner spreadsheet. They need to know which machines are about to die.',
    ],
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
    nextSlug: 'lextrack',
  },
];

export function getDeepDive(slug: string): DeepDive | undefined {
  return deepDives.find((d) => d.slug === slug);
}
