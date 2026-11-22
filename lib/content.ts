// Single source of truth for every word on the site.
// Rule: facts only. Nothing here may claim more than the CVs or the live sites show.

export const site = {
  name: "Rossrival M. Bendillo",
  short: "Ross Bendillo",
  role: "AI Engineer & Full-Stack Developer",
  location: "Bataan, Philippines",
  availability: "Open to remote AI engineering roles and client projects across AU, UK and beyond.",
  email: "camrynchelsea01@gmail.com",
  phone: "+63 967 125 2731",
  github: "github.com/Kashea",
  web: "rbendillo-portfolio.vercel.app",
  cv: "/cv/Rossrival-Bendillo-Resume.pdf",
  // Set NEXT_PUBLIC_SITE_URL once a custom domain is live; Vercel's production URL covers it until then.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  eyebrow: "// RIVAL PEREGRINE",
  headline: ["I build AI that", "asks first, then ships", "like a peregrine."],
  lede: "AI engineer and full-stack developer with 15 years across IT systems and software. I ship Next.js products and automation where AI prepares the work, people approve it, and every step is tested and logged.",
  proof: [
    { value: "27", label: "automation workflows on one client platform" },
    { value: "40/40", label: "test suites gating each deploy" },
    { value: "15", label: "written runbooks for operating it" },
    { value: "15 yrs", label: "across IT systems and software" },
  ],
};

// Rival Peregrine: the alter ego and signature. Ross Bendillo stays the primary name.
export const identity = {
  alterEgo: "Rival Peregrine",
  callsign: "Rival",
  codeTag: "0xRIVAL",
  mantra: "Jack in. Lock on. Strike clean.",
  tagline: "AI that asks first. Ships like a peregrine.",
  origin:
    "\u201cRival\u201d comes from my name, Rossrival. The peregrine falcon is the fastest hunter on Earth, and it is fast because it is precise. It circles at altitude, reads the whole field, locks on, and only then dives. That is how I build AI: observe everything, gate on confidence, put a human on the trigger, then ship clean, tested and logged.",
  signature: "\u2014 Ross \u00b7 0xRIVAL",
};

export type StageId = "altitude" | "lock_on" | "human_trigger" | "dive" | "trail";

// The Peregrine Protocol: the falcon's hunt mapped onto the human-in-the-loop method.
export const protocol: { id: StageId; label: string; name: string; falcon: string; engineering: string }[] = [
  {
    id: "altitude",
    label: "01",
    name: "Altitude",
    falcon: "Circles high and reads the whole field.",
    engineering: "Map the system, data and failure modes first. One decision service, no blind spots.",
  },
  {
    id: "lock_on",
    label: "02",
    name: "Lock On",
    falcon: "Commits only when the target is certain.",
    engineering: "Confidence and risk scores gate every AI action. Low confidence routes to a person.",
  },
  {
    id: "human_trigger",
    label: "03",
    name: "Human on the Trigger",
    falcon: "The handler decides the strike.",
    engineering: "Edit before send, approve or block. AI prepares, people approve.",
  },
  {
    id: "dive",
    label: "04",
    name: "The Dive",
    falcon: "Fastest strike in nature, and it does not miss.",
    engineering: "Deploys are blocked unless every test suite passes. Ship fast because it is safe.",
  },
  {
    id: "trail",
    label: "05",
    name: "The Trail",
    falcon: "Every hunt leaves a record.",
    engineering: "Tamper-evident change log, audit trails and written runbooks.",
  },
];

export const stageName = (id: StageId) => protocol.find((st) => st.id === id)!.name;

export type CoverKind = "rigsafe" | "ai" | "karate" | "chito";

export type Section = { heading: string; body?: string; bullets?: string[]; diagram?: "rigsafe" };

export type Metric = { value: string; label: string };

export type Shot = { src: string; alt: string; label: string };

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  url: string | null;
  visibility: "featured" | "listed" | "hidden";
  role: string;
  year: string;
  status?: string;
  summary: string;
  stack: string[];
  cover?: CoverKind;
  image?: Shot; // real screenshot; replaces the illustrative cover
  imageNote?: string;
  gallery?: Shot[];
  highlights?: string[];
  metrics?: Metric[];
  metricsNote?: string;
  protocol?: StageId[];
  sections?: Section[];
};

export const projects: Project[] = [
  {
    slug: "rigsafe-crm",
    title: "Rigsafe CRM",
    kicker: "CRM & AI automation platform · Lifting solutions",
    url: null, // private, sign-in only
    visibility: "featured",
    role: "AI engineer & full-stack developer",
    year: "2026",
    status: "Live with client",
    summary:
      "A live CRM and automation platform for a cranes, transport and projects business. Every change goes through one decision service, 27 workflows move the data, and tests gate every deploy.",
    stack: ["Next.js", "TypeScript", "n8n", "Postgres", "Caddy", "PWA"],
    cover: "rigsafe",
    highlights: [
      "One decision service and a tamper-evident change log",
      "Unconfirmed data queued for a person, never guessed",
      "Every outgoing email approved by a person first",
      "Deploys blocked unless every test suite passes",
    ],
    metrics: [
      { value: "27", label: "n8n workflows" },
      { value: "40/40", label: "test suites passing" },
      { value: "15", label: "operating runbooks" },
      { value: "7", label: "business areas served" },
    ],
    metricsNote: "Engineering figures from September 2026. Client business data is deliberately left out.",
    protocol: ["altitude", "lock_on", "human_trigger", "dive", "trail"],
    sections: [
      {
        heading: "The problem",
        body: "A lifting-solutions business running cranes, transport and project divisions tracked tenders, pricing and forecasts across spreadsheets and separate systems. Nobody had one view of what was waiting, what was overdue, or what the pipeline was really worth.",
      },
      {
        heading: "What I built",
        bullets: [
          "Staff Hub: one home for seven business areas, from Commercial Growth and Operations to Safety & Compliance and Executive.",
          "Tender register with a staged pipeline from intake to negotiation, win chance, due dates and estimator assignment.",
          "Pipeline triage and board, follow-ups, jobs to price, a rate library, BD leads and a company directory.",
          "Live jobs, a resource forecast, and a dashboard filtered by financial year and division.",
          "Deterministic tender review checks that raise blockers and warnings across pricing, take-off and supplier quotes.",
          "A separate integration engine in n8n: connectors for field, forms, mail and file systems, a daily ingest chain and scheduled reports.",
        ],
      },
      {
        heading: "Architecture",
        diagram: "rigsafe",
        body: "In the CRM, every change goes through a decision service that records who and when in a tamper-evident log, and a stale save is rejected rather than overwritten. In the engine, source systems stay the system of record: data is pulled in, normalised and verified before anything reads it, and anything that fails verification goes to a person.",
      },
      {
        heading: "AI readiness",
        body: "The CRM does not call a model yet, on purpose. Its chat is a deterministic keyword engine that says so. The parts that make AI safe came first: one decision service for every write, a tamper-evident log, a human-approved email outbox, role permissions and deterministic checks. The AI layer is designed to sit on top as proposals only. A model will call typed, read-only tools, code will compute every figure, and the keyword engine stays as the fallback.",
        bullets: [
          "Data review queue: every imported result, formula or reference that could not be confirmed waits for a person.",
          "AI roadmap scored against a 100-question AI engineering checklist, with evaluation gates and prompt-injection containment defined before any model ships.",
        ],
      },
      {
        heading: "Trade-offs",
        bullets: [
          "n8n over custom workers: operations can see every run and step. The cost is that visual workflows drift, so reports are generated by scripts in version control and covered by tests.",
          "Trust before AI: fixing the data first is slower to demo, but a model repeats whatever the system gets wrong, and does it convincingly.",
          "Human approval over full automation: slower per item, but one wrong figure in a tender costs more than the review does.",
          "Self-hosted over managed services: the data stays on infrastructure we control, in exchange for owning the patching, backups and runbooks.",
        ],
      },
      {
        heading: "How it is measured",
        bullets: [
          "40 automated test suites run before a change ships, and it only commits if all of them pass.",
          "An independent read-back checks results from outside n8n, so a workflow cannot mark its own homework.",
          "The ingest chain ends with an assertion on the whole outcome, not just on each step having run.",
          "The daily site brief flags anomalies for a person to check, such as a submitted shift with no hours recorded.",
        ],
      },
      {
        heading: "Failure modes I designed for",
        bullets: [
          "A connector fails mid-chain: every step has an error path into a shared handler, and the chain fails loudly instead of reporting partial success.",
          "A step runs but the data is wrong: verification and the end-of-chain assertion catch it before it reaches staff.",
          "A scheduled run fires before it should: an activation gate holds it, and a manual rehearsal trigger proves the chain first.",
          "An import is uncertain: it goes to the exception queue for a person, with a written procedure for clearing it.",
          "A release goes bad: release, rollback and schema-migration runbooks are written down before they are needed.",
        ],
      },
      {
        heading: "Security",
        bullets: [
          "Passwordless sign-in by emailed code for staff, with role-based permissions for admin, approver, estimator and take-off.",
          "Strict Content-Security-Policy, HSTS, frame-ancestors none, nosniff and a locked-down permissions policy.",
          "Next.js App Router served behind Caddy over HTTPS.",
        ],
      },
    ],
  },
  {
    slug: "ai-approval-workflows",
    title: "AI Approval-Queue Workflows",
    kicker: "Human-in-the-loop automation",
    url: null,
    visibility: "featured",
    role: "AI engineer",
    year: "2025",
    summary:
      "AI pipelines that never act alone: confidence and risk gates, edit-before-send, approve or block, and an audit trail on every decision.",
    stack: ["n8n", "Claude", "Power Automate", "Microsoft Teams", "Microsoft 365", "Entra ID"],
    cover: "ai",
    highlights: ["Confidence & risk gating", "Edit before send", "Approve / block", "Audit-oriented states"],
    metrics: [
      { value: "6", label: "stages from input to audit" },
      { value: "3", label: "reviewer actions: edit, approve, block" },
    ],
    protocol: ["lock_on", "human_trigger", "trail"],
    sections: [
      {
        heading: "The problem",
        body: "AI output is useful, but it cannot be sent to a client or acted on without control. The business needed the speed of AI drafting without giving up human judgement.",
      },
      {
        heading: "Design",
        bullets: [
          "Every AI result carries a confidence and risk assessment.",
          "Low-risk, high-confidence items move quickly; anything else stops at a human gate.",
          "Reviewers can edit before sending, approve, or block.",
          "Each step writes an audit-oriented state, so every outcome can be traced.",
        ],
      },
      {
        heading: "Trade-offs",
        bullets: [
          "A gate adds waiting time, so thresholds decide what truly needs a person. Gating everything would just move the bottleneck.",
          "Edit-before-send keeps drafts useful when they are almost right, instead of forcing a rejection and a rewrite.",
        ],
      },
      {
        heading: "Failure modes I designed for",
        bullets: [
          "The model is confidently wrong: risk is assessed alongside confidence, so a sure answer on a risky item still stops at a person.",
          "Someone needs to know what happened later: audit states record the decision, not only the final message.",
        ],
      },
      {
        heading: "Integration",
        body: "Pipelines were built in n8n with AI tooling and human approval steps, including Teams-based AI and chat-intelligence workflows on Microsoft 365 with Entra identity.",
      },
    ],
  },
  {
    slug: "karate-institute",
    title: "The Karate Institute",
    kicker: "Marketing & booking site · Sydney",
    url: "https://www.karateinstitute.au",
    visibility: "featured",
    role: "Full-stack developer",
    year: "2025",
    summary: "Multi-page marketing and free-trial booking site for a Chito-Ryu dojo in Sydney, driven by a headless CMS.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity", "Vercel", "Google Tag Manager"],
    cover: "karate",
    image: {
      src: "/images/work/karate-institute.webp",
      alt: "The Karate Institute home page with hero image and free-trial booking form",
      label: "karateinstitute.au",
    },
    imageNote: "Live site, captured October 2026.",
    highlights: ["Sanity content model", "Free-trial booking", "Local SEO", "Optimised images"],
    sections: [
      {
        heading: "The problem",
        body: "A long-established dojo with no scalable site and weak local search presence.",
      },
      {
        heading: "What I built",
        bullets: [
          "Content model in Sanity for programs, schedule, instructors, gallery, testimonials and areas served.",
          "Free-trial booking form capturing age group, class time and source.",
          "Per-page metadata, Open Graph and Twitter cards for local SEO.",
          "next/image on the Sanity CDN for fast, responsive images.",
        ],
      },
      {
        heading: "Trade-offs",
        bullets: [
          "Headless CMS over a template: more setup up front, but content can change without a developer or a redeploy.",
        ],
      },
    ],
  },
  {
    slug: "chito-ryu-international",
    title: "Chito-Ryu International",
    kicker: "Bilingual federation platform",
    url: "https://chitoryukaratedo.vercel.app/en",
    visibility: "featured",
    role: "Full-stack developer",
    year: "2025",
    summary: "Bilingual federation platform with a worldwide dojo directory, events, resources and member and admin access.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "i18n", "Vercel"],
    cover: "chito",
    image: {
      src: "/images/work/chito-ryu-international.webp",
      alt: "International Chito-Ryu Karate-Do Federation home page in English",
      label: "chitoryukaratedo / en",
    },
    imageNote: "Live site, captured October 2026.",
    highlights: ["English & Japanese routes", "Dojo directory", "Role-based admin", "Resources & exams"],
    sections: [
      {
        heading: "The problem",
        body: "A worldwide federation with no single directory or registry for its dojos and teachers.",
      },
      {
        heading: "What I built",
        bullets: [
          "Localised English and Japanese routes.",
          "Dojo directory with country and region filtering.",
          "Login and admin area with role-based access.",
          "Events, examinations, downloads and technical resources.",
        ],
      },
      {
        heading: "Trade-offs",
        bullets: [
          "Localised routes over a translate widget: each language needs its own content, but pages stay readable to search engines and to members in Japan.",
        ],
      },
    ],
  },
  {
    slug: "bj-live",
    title: "BJ Live",
    kicker: "Content & review platform",
    url: "https://www.bj.live",
    visibility: "listed",
    role: "Senior web developer · Central One Bataan",
    year: "2024",
    summary: "Content platform with categories, ratings, guides and news on a large, content-driven route tree.",
    stack: ["Next.js", "React", "TypeScript", "Headless CMS", "AWS"],
  },
  {
    slug: "citinow",
    title: "Citinow",
    kicker: "Brand site",
    url: "https://citinowonlinecasino.com",
    visibility: "listed",
    role: "Senior web developer · Central One Bataan",
    year: "2024",
    summary: "Brand site with a CMS-driven news section and structured category pages.",
    stack: ["Next.js", "React", "TypeScript", "Headless CMS"],
  },
  {
    slug: "wordpress-properties",
    title: "Managed WordPress properties",
    kicker: "karate.org.au · noonan.com.au",
    url: "https://karate.org.au",
    visibility: "listed",
    role: "Administration & maintenance",
    year: "2025",
    summary: "Ongoing administration and maintenance of WordPress sites for Noonan Real Estate and related organisations.",
    stack: ["WordPress"],
  },
];

export const visible = projects.filter((p) => p.visibility !== "hidden");
export const featured = projects.filter((p) => p.visibility === "featured");
export const listed = projects.filter((p) => p.visibility === "listed");
export const caseStudies = featured.filter((p) => p.sections?.length);

export type Role = { role: string; org: string; dates: string; bullets: string[] };

export const experience: Role[] = [
  {
    role: "AI Engineer & Full-Stack Developer",
    org: "ICTouch",
    dates: "2026 — Present",
    bullets: [
      "Built Rigsafe CRM, a live Next.js and TypeScript platform covering tenders, pricing, pipeline, forecasting and staff operations across 7 business areas.",
      "Built its integration engine: 27 n8n workflows, including a daily ingest chain that pulls, normalises, verifies and reports on field, forms, mail and file data.",
      "Gated deploys on 40 automated test suites plus an independent read-back from outside n8n, committing only when all of them pass.",
      "Built a decision service with a tamper-evident change log, a human-approved email outbox and a no-guess data review queue as the base for AI.",
      "Designed the AI layer: an LLM over typed read-only tools, hybrid retrieval with citations, evaluation gates and prompt-injection containment.",
      "Wrote 15 runbooks covering ingest, exception queues, schema migration, release and rollback, and compliance evidence.",
    ],
  },
  {
    role: "Full-Stack Developer",
    org: "Noonan Real Estate",
    dates: "2025 — Present",
    bullets: [
      "Designed AI reasoning workflows with confidence and risk gates, edit-before-send, approve or block, and audit states.",
      "Built n8n pipelines with AI tooling and human approval steps, including Teams-based chat intelligence.",
      "Built and shipped karateinstitute.au with Next.js and Sanity, from frontend through production release.",
      "Administered Microsoft 365 and Entra ID; maintained karate.org.au and noonan.com.au.",
    ],
  },
  {
    role: "Senior Web Developer",
    org: "Central One Bataan",
    dates: "2023 — 2024",
    bullets: [
      "Led web projects from Figma prototypes through implementation, deployment and live management.",
      "Built full-stack apps with Next.js, React and TypeScript on headless CMS architectures.",
      "Configured and deployed multitenant application accounts and servers on AWS in Agile delivery.",
    ],
  },
  {
    role: "L2 3CX VoIP Engineer",
    org: "Axecom Pty. Ltd.",
    dates: "2022 — 2023",
    bullets: [
      "Provisioned and maintained multitenant AWS Lightsail servers for 3CX environments.",
      "Maintained 3CX systems, Raspberry Pi security and RMM nodes, and production communications.",
    ],
  },
];

export const earlier: Role[] = [
  {
    role: "L2 MSP Support Engineer",
    org: "Far Out Solutions",
    dates: "2021 — 2022",
    bullets: ["Owned escalated issues through ConnectWise and Autotask PSA, with onsite and network support."],
  },
  {
    role: "Network & NOC Engineer",
    org: "Hospitality WiFi / Telna",
    dates: "2020 — 2021",
    bullets: ["Cisco Meraki and MikroTik with RADIUS gateway integrations; NOC monitoring and L2 escalation."],
  },
  {
    role: "Enterprise Support, Tier 1–2",
    org: "Cognizant (UBS), Dell, Microsoft / Sutherland, Verizon / Teleperformance",
    dates: "2009 — 2016",
    bullets: ["OS, network, identity and application support; knowledge-base authoring and structured escalation."],
  },
];

// Where each AI engineering area is proven in shipped work. Only list what is real; "growing" is allowed.
export const capabilities: { area: string; proof: string[] }[] = [
  {
    area: "LLMs & grounding",
    proof: [
      "Claude in Teams chat-intelligence workflows",
      "Figures computed in code, never by the model",
      "Typed tools and cited hybrid retrieval designed for Rigsafe",
    ],
  },
  {
    area: "Agents & orchestration",
    proof: [
      "27 n8n workflows with success and error paths",
      "Teams-based AI chat intelligence",
      "Human handoff built in, not bolted on",
    ],
  },
  {
    area: "Ops & evaluation",
    proof: [
      "40 test suites gating deploys",
      "Independent read-back from outside the workflow engine",
      "Release, rollback and phase-gate runbooks",
    ],
  },
  {
    area: "Safety & governance",
    proof: [
      "Risk gates, approve or block, and audit states",
      "Unconfirmed data held in a review queue",
      "Strict CSP, passwordless sign-in and role-based access",
    ],
  },
  {
    area: "Foundations",
    proof: [
      "BS Computer Engineering",
      "15 years of failure-mode thinking in networks and support",
      "Python and ML fundamentals in active development",
    ],
  },
];

// Consolidated from the CVs plus shipped client work. No percentages, no unsubstantiated tools.
export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "SQL", "HTML & CSS", "Python (growing)"] },
  { group: "AI & automation", items: ["Claude", "Claude Code", "n8n", "Power Automate", "Prompt engineering", "Human-in-the-loop approvals", "Confidence & risk gating", "RAG & eval design", "Teams chat bots"] },
  { group: "Frameworks & libraries", items: ["Next.js App Router", "React", "Server Components", "Tailwind CSS", "three.js", "Framer Motion"] },
  { group: "Data & content", items: ["Postgres", "MySQL", "MongoDB", "Firebase", "Sanity", "REST", "GraphQL", "Spreadsheet-to-app migration"] },
  { group: "Infra & delivery", items: ["Docker", "AWS Lightsail", "AWS Amplify", "Vercel", "Linux", "Caddy", "Git & GitHub", "Automated test gates", "Runbooks", "Agile delivery"] },
  { group: "Security & identity", items: ["Role-based access", "Multitenancy", "Server-enforced security", "CSP & security headers", "Passwordless auth", "Microsoft 365", "Entra ID"] },
  { group: "Infrastructure background", items: ["RADIUS", "Cisco Meraki", "MikroTik", "3CX"] },
];

// One-page CV. Shares the same facts as the site; printed from /resume to public/cv.
export const resume = {
  summary:
    "AI Engineer with 15 years across IT systems and software, building full-stack products in Next.js and TypeScript and now shipping production AI automation. Built Rigsafe CRM and its integration engine, a live client platform with 27 n8n workflows and 40 passing test suites, and designed its AI layer around typed tools, cited retrieval and human approval. I turn messy business processes into deployed, tested and auditable systems.",
  skills: [
    { label: "Languages", items: "TypeScript, JavaScript, SQL, HTML, CSS, Python (growing)" },
    { label: "AI / LLM", items: "Claude, prompt engineering, human-in-the-loop approvals, confidence and risk gating, RAG and evaluation design, workflow orchestration" },
    { label: "Frameworks & automation", items: "Next.js, React, Tailwind CSS, n8n, Power Automate, three.js" },
    { label: "Data", items: "Postgres, MySQL, MongoDB, Firebase, Sanity, REST, GraphQL" },
    { label: "Infra & delivery", items: "Docker, AWS Lightsail, AWS Amplify, Vercel, Linux, Caddy, Git/GitHub, automated test gates, Microsoft 365, Entra ID" },
  ],
  projects: [
    {
      name: "AI Approval-Queue Workflows",
      what: "human-in-the-loop AI pipelines",
      bullets: [
        "Built with n8n, Claude and Power Automate: 6 stages from input to audit, with confidence and risk gates and 3 reviewer actions (edit, approve, block).",
      ],
    },
    {
      name: "The Karate Institute",
      what: "marketing and free-trial booking site for a Sydney dojo",
      link: "karateinstitute.au",
      bullets: ["Built with Next.js, TypeScript and Sanity: a CMS content model, booking form and per-page local SEO, deployed on Vercel."],
    },
    {
      name: "Chito-Ryu International",
      what: "bilingual platform for a worldwide karate federation",
      link: "chitoryukaratedo.vercel.app",
      bullets: ["Built English and Japanese routes, a dojo directory filtered by country and region, and a role-based admin area."],
    },
  ],
};

export const education = [
  { title: "BS Computer Engineering", org: "Bulacan State University", dates: "2001 — 2006" },
  { title: "Full Stack Web Development", org: "KodeGo", dates: "2023" },
];

export const about = [
  "I started in infrastructure: enterprise support, NOC and MSP work, VoIP and cloud servers. That taught me how systems fail, and how to explain a problem to the person who has it.",
  "Then I moved into full-stack delivery with Next.js and TypeScript, and now into AI engineering. My rule for AI is simple: it prepares, a person decides, and every decision is recorded.",
  "Rigsafe is the clearest example: a live platform where the tests decide what ships, and staff stay in control of the numbers.",
];
