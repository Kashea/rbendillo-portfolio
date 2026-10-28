// Single source of truth for every word on the site.
// Rule: facts only. Nothing here may claim more than the CVs or the live sites show.

export const site = {
  name: "Rossrival M. Bendillo",
  short: "Ross Bendillo",
  role: "Full-Stack Developer & AI Engineer",
  location: "Bataan, Philippines",
  availability: "Open to remote roles and client projects",
  email: "camrynchelsea01@gmail.com",
  cv: "/cv/Rossrival-Bendillo-CV.pdf",
  // Set NEXT_PUBLIC_SITE_URL once a custom domain is live; Vercel's production URL covers it until then.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  headline: ["I build the web products,", "and the AI workflows", "behind them."],
  lede: "Full-stack developer and AI engineer shipping Next.js products, operational CRMs and human-in-the-loop automation, with a systems-engineering background in identity, networks and production support.",
  proof: [
    "Live CRM in production",
    "Next.js · TypeScript · AI",
    "Role-based & multitenant systems",
    "AI with approval gates",
  ],
};

export type CoverKind = "rigsafe" | "ai" | "karate" | "chito";

export type Section = { heading: string; body?: string; bullets?: string[] };

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
  sections?: Section[];
};

export const projects: Project[] = [
  {
    slug: "rigsafe-crm",
    title: "Rigsafe CRM",
    kicker: "Staff Hub & CRM · Lifting solutions",
    url: null, // private, sign-in only
    visibility: "featured",
    role: "Full-stack & AI engineer",
    year: "2026",
    status: "Live with client",
    summary:
      "A full operational CRM for a cranes, transport and projects business: tenders, pricing, pipeline, forecasting and a staff hub, with AI built into the intake and review flows.",
    stack: ["Next.js", "TypeScript", "React Server Components", "AI document intake", "Caddy", "Strict CSP"],
    cover: "rigsafe",
    highlights: [
      "Tender register from intake to negotiation",
      "AI drafts tenders from their documents",
      "Win-weighted revenue forecasting",
      "Spreadsheet migration with a human review queue",
    ],
    sections: [
      {
        heading: "The problem",
        body: "A lifting-solutions business running cranes, transport and project divisions tracked tenders, pricing and forecasts across spreadsheets. Nobody had one view of what was waiting, what was overdue, or what the pipeline was really worth.",
      },
      {
        heading: "What I built",
        bullets: [
          "Staff Hub: one home for seven business areas (Commercial Growth, Operations, Safety & Compliance, Assets & Maintenance, People & Culture, Business Support, Executive).",
          "Tender register with a staged pipeline (Intake, Pricing, Review, Submitted, Negotiation), win chance, due dates, estimator assignment and sell/GP values.",
          "Commercial tools: pipeline register, triage and board, follow-ups, jobs to price, a rate library, BD leads and a company directory.",
          "Operations: live jobs and a resource forecast.",
          "Dashboard with financial-year and division filters: open and weighted pipeline, win rate by value and by count, average won job and tenders issued.",
        ],
      },
      {
        heading: "Where the AI sits",
        bullets: [
          "New tender from its documents: upload the tender pack and the system drafts the tender record for a person to check.",
          "Data review queue: the legacy workbook was imported, and every result, formula or reference the importer could not confirm is queued for a human instead of being trusted silently.",
          "An in-app assistant available from every screen.",
        ],
        body: "The same rule as my approval-gate work: AI prepares, a person confirms, and nothing unverified lands in the numbers.",
      },
      {
        heading: "Forecasting",
        body: "Monthly revenue forecasts can be shown at full value or weighted by win likelihood. Work is discounted by its stage and only won work counts in full, so the executive view reflects risk instead of optimism.",
      },
      {
        heading: "Security and delivery",
        bullets: [
          "Passwordless sign-in by emailed link for staff.",
          "Next.js App Router served behind Caddy over HTTPS.",
          "Strict Content-Security-Policy, HSTS, frame-ancestors none, nosniff and a locked-down permissions policy.",
          "Light, dark and system themes, global search, and dashboard export by download or email.",
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
    role: "Full-Stack Developer",
    org: "Noonan Real Estate",
    dates: "2025 — Present",
    bullets: [
      "Built and shipped karateinstitute.au with Next.js and Sanity, from frontend through production release.",
      "Designed AI reasoning workflows with confidence and risk gates, edit-before-send, approve or block, and audit states.",
      "Built n8n pipelines with AI tooling and human approval steps, including Teams-based chat intelligence.",
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
  {
    role: "L2 MSP Support Engineer",
    org: "Far Out Solutions",
    dates: "2021 — 2022",
    bullets: [
      "Owned escalated issues through ConnectWise and Autotask PSA with clear client communication.",
      "Delivered network-printer deployments and onsite support across endpoints and networks.",
    ],
  },
];

export const earlier: Role[] = [
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

// Consolidated from all three CVs plus the Rigsafe build. No percentages, no unsubstantiated tools.
export const skills: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["React", "Next.js App Router", "TypeScript", "JavaScript", "Tailwind CSS", "HTML & CSS", "Component systems", "three.js", "Framer Motion"] },
  { group: "Backend & APIs", items: ["Server Components", "Server Actions & Route Handlers", "REST", "GraphQL", "Firebase", "Python (growing)"] },
  { group: "AI & automation", items: ["Claude", "n8n", "Power Automate", "Human-in-the-loop approvals", "Confidence & risk gating", "AI document intake", "Teams chat bots"] },
  { group: "Data & content", items: ["MySQL", "MongoDB", "Firebase", "Sanity", "Headless CMS", "Spreadsheet-to-app migration"] },
  { group: "Architecture & security", items: ["Multitenancy", "Role-based access", "Centralised authorisation", "Server-enforced security", "CSP & security headers", "Passwordless auth"] },
  { group: "Cloud & delivery", items: ["Vercel", "AWS Lightsail", "AWS Amplify", "Linux", "Caddy", "Git & GitHub", "Postman", "Agile delivery"] },
  { group: "Identity & infrastructure", items: ["Microsoft 365", "Entra ID", "RADIUS", "Cisco Meraki", "MikroTik", "3CX"] },
];

export const education = [
  { title: "BS Computer Engineering", org: "Bulacan State University", dates: "2001 — 2006" },
  { title: "Full Stack Web Development", org: "KodeGo", dates: "2023" },
];

export const about = [
  "I started in infrastructure: enterprise support, NOC and MSP work, VoIP and cloud servers. That taught me reliability, security and how to explain a problem to the person who has it.",
  "Then I moved into full-stack delivery with Next.js and TypeScript, and now into AI engineering. My rule for AI is simple: it prepares, a person decides, and every decision is recorded.",
  "Rigsafe is the clearest example: a live CRM where AI drafts and checks, and staff stay in control of the numbers.",
];
