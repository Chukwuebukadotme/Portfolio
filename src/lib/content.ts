/**
 * Site content.
 *
 * In the previous build this lived in a `<script type="text/x-dc">` block at the
 * bottom of the design canvas. It is now typed data: the routes read from here,
 * so copy edits never touch a component.
 */

export const site = {
  name: "Chukwuebuka Onyemelukwe",
  initials: "CO",
  role: "Design Engineer × AI Engineer",
  email: "chukwuebukaspad@gmail.com",
  linkedin:
    "https://www.linkedin.com/in/chukwuebuka-onyemelukwe-43b751177/",
  github: "https://github.com/Chukwuebukadotme",
  /** TODO — replace with the real Cal.com handle. */
  calcom: "https://cal.com/TODO",
  resume: "/uploads/Chukwuebuka_CV_.docx.pdf",
  location: "United Kingdom",
} as const;

/** Rotates through the hero headline. */
export const words = [
  "digital products",
  "web experiences",
  "intelligent systems",
  "AI workflows",
] as const;

export const rotateIntervalMs = 2600;

export const enquiryOptions = [
  "Hiring / Career Opportunity",
  "Digital Product",
  "Website",
  "AI & Automation",
  "Product Design",
  "Other",
] as const;

export type EnquiryOption = (typeof enquiryOptions)[number];

export const stats = [
  { value: "5+", label: "Years across design, AI & engineering" },
  { value: "20+", label: "Projects across product, web & AI" },
  { value: "UK", label: "Based in the United Kingdom" },
  { value: "Global", label: "Available for remote collaboration" },
] as const;

export const capabilities = [
  {
    number: "01",
    title: "Digital products",
    body: "Applications, SaaS products, internal tools, dashboards, portals and MVPs.",
    tags: ["SaaS", "Dashboards", "Internal tools", "Portals", "MVPs"],
  },
  {
    number: "02",
    title: "Web experiences",
    body: "High-performance websites, landing pages, CMS experiences, e-commerce and interactive web experiences.",
    tags: ["Landing pages", "CMS", "E-commerce", "Performance", "Interaction"],
  },
  {
    number: "03",
    title: "AI & automation",
    body: "AI agents, intelligent product features, workflow automation, LLM integrations, APIs and AI-enabled systems.",
    tags: [
      "Agents",
      "LLM integration",
      "Workflow automation",
      "APIs",
      "Evaluation",
    ],
  },
  {
    number: "04",
    title: "Product design",
    body: "Product research, information architecture, UX/UI, interaction design, prototyping and design systems.",
    tags: [
      "Research",
      "Information architecture",
      "UX / UI",
      "Prototyping",
      "Design systems",
    ],
  },
] as const;

export const process = [
  {
    step: "01 — Discover",
    items: ["Goals", "Product research", "User research", "Early concepts"],
  },
  {
    step: "02 — Design",
    items: ["Information architecture", "Interfaces", "Flows", "Prototypes"],
  },
  {
    step: "03 — Build",
    items: ["Development", "Integration", "Production code", "Testing"],
  },
  {
    step: "04 — Launch",
    items: ["Deployment", "QA", "Performance", "Production checks"],
  },
  {
    step: "05 — Evolve",
    items: ["Feedback", "Analysis", "Iteration", "Improvement"],
  },
] as const;

export const disciplines = [
  {
    label: "Discipline 01",
    title: "Product design",
    items: [
      "Research",
      "UX/UI",
      "Information architecture",
      "Prototyping",
      "Design systems",
    ],
  },
  {
    label: "Discipline 02",
    title: "Product engineering",
    items: ["Next.js", "TypeScript", "Full stack", "APIs", "Cloud infrastructure"],
  },
  {
    label: "Discipline 03",
    title: "AI & automation",
    items: [
      "Python",
      "AI agents",
      "LLMs",
      "Automation",
      "Intelligent integrations",
    ],
  },
] as const;

export const skills = [
  {
    heading: "Capabilities",
    items: [
      "Product research",
      "Product design",
      "UI/UX",
      "Design engineering",
      "Product engineering",
      "AI engineering",
      "Full-stack development",
      "AI automation",
    ],
  },
  {
    heading: "Technology",
    items: [
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "Supabase",
      "APIs",
      "Cloud infrastructure",
    ],
  },
  {
    heading: "Tools",
    items: [
      "Figma",
      "Webflow",
      "Claude",
      "ChatGPT / Codex",
      "GitHub",
      "Vercel",
      "n8n",
      "Google AI Studio",
      "Microsoft 365",
    ],
  },
] as const;

export const about = {
  eyebrow: "About — CO",
  title: "Designer. Engineer. Product thinker.",
  intro:
    "I work at the intersection of design, engineering and product, taking complicated problems and turning them into digital systems that are useful, understandable and durable.",
  markTitle: ["Making", "systems", "better."],
  questionLead: "Different disciplines. Same question.",
  question: "How can this work better?",
  body: "Curiosity has consistently pushed me across disciplines. Design helps me understand how people experience a system. Engineering helps me understand how it works. Artificial intelligence expands what that system can do. Product thinking keeps the work connected to a real problem.",
  practice: [
    { title: "Design", body: "Understand and shape the experience." },
    { title: "Engineering", body: "Make the experience real and reliable." },
    { title: "Intelligence", body: "Make the system more capable." },
    { title: "Product", body: "Make sure the right problem is being solved." },
  ],
  journey: ["Design", "Product", "Engineering", "Artificial intelligence"],
  education: {
    degree: "MSc Artificial Intelligence",
    school: "Nottingham Trent University",
    country: "United Kingdom",
  },
  availability: {
    body: "Based in the UK and open to permanent roles across Design Engineering, Product Engineering and AI Engineering.",
    note: "Available for selected global remote collaborations.",
  },
} as const;

export type CaseStudy = {
  slug: string;
  number: string;
  name: string;
  industry: string;
  status: string;
  /** Internal note; never rendered. */
  statusNote?: string;
  year: string;
  role: string;
  discipline: string;
  headline: string;
  summary: string;
  tech: readonly string[];
  areas: readonly string[];
  overview: string;
  problem: string;
  flowLabel: string;
  flow: readonly string[];
  approach: string;
  decisions: readonly { t: string; d: string }[];
  engineering: string;
  arch: readonly (readonly [string, string])[];
  outcome: string;
  reflection: string;
};

export const cases: readonly CaseStudy[] = [
  {
    slug: "budgetview",
    number: "01",
    name: "BudgetView",
    industry: "Fintech",
    status: "In development",
    statusNote: "TODO — set to LIVE PRODUCT once deployed",
    year: "2025",
    role: "Design Engineer / Product Engineer",
    discipline: "Product Engineering",
    headline: "See where the month is going before the money does.",
    summary:
      "BudgetView brings transactions, bills, subscriptions and budgets from multiple accounts into one clear monthly financial plan.",
    tech: ["Next.js", "Python", "FastAPI", "Figma", "AI"],
    areas: ["Product Engineering", "UI/UX", "Data Modelling"],
    overview:
      "BudgetView is a personal financial planning product. It reads activity from multiple accounts, separates committed money from discretionary money, and resolves the month into one number a person can actually act on.",
    problem:
      "Most budgeting tools report the past. They categorise transactions after the money has already left, then show a chart of it. But a month is not a list of transactions — it is a set of commitments that have already claimed part of the balance. The number people need is not what they spent last month; it is what is genuinely safe to spend for the rest of this one.",
    flowLabel: "The reduction",
    flow: ["Money in", "Bills", "Subscriptions", "Budget", "Safe to spend"],
    approach:
      "The product is built around a single reduction. Income enters, known commitments are subtracted in a fixed order, and what survives is discretionary. Every screen in the product is a view onto one stage of that reduction, which keeps the mental model constant as the interface gets denser.",
    decisions: [
      {
        t: "One number, always visible",
        d: "Safe-to-spend is the primary figure on every screen. Detail views explain it rather than replace it.",
      },
      {
        t: "Commitments before categories",
        d: "Bills and subscriptions are modelled as scheduled obligations, not spending categories, so future dates are as real as past ones.",
      },
      {
        t: "Explain, don’t just classify",
        d: "Where the system infers something — a recurring charge, a merchant match — the interface says why, and the inference stays editable.",
      },
    ],
    engineering:
      "A Next.js application handles the interface and account state. A Python and FastAPI service owns ingestion, merchant normalisation, recurrence detection and the monthly projection, so the calculation lives in one place and can be tested independently of the UI. AI is applied narrowly: normalising untidy merchant strings and proposing recurring-charge groupings for the person to confirm.",
    arch: [
      ["Client", "Next.js · React"],
      ["API", "FastAPI"],
      ["Engine", "Python · projection & recurrence"],
      ["Assist", "LLM · normalisation, grouping"],
    ],
    outcome:
      "TODO — replace with real outcome once the product has shipped and there is measured evidence. No metrics are claimed here.",
    reflection:
      "The hardest part was restraint. Every additional chart made the month feel more analysed and less decided. Removing views improved the product more than adding them did.",
  },
  {
    slug: "siteresolve",
    number: "02",
    name: "SiteResolve",
    industry: "Construction Tech",
    status: "In development",
    statusNote: "TODO — confirm current status",
    year: "2025",
    role: "Design Engineer / Product Engineer",
    discipline: "Product Engineering",
    headline: "Construction defects should end in resolution, not paperwork.",
    summary:
      "SiteResolve connects defect management, snagging, inspections, documentation and task coordination through one traceable workflow.",
    tech: ["Next.js", "TypeScript", "Python", "FastAPI", "Figma", "AI"],
    areas: ["Product Research", "UI/UX", "Brand Expression", "Content"],
    overview:
      "SiteResolve is a defect and snagging product for construction teams. A defect is raised once on site, then carried through assignment, inspection, documentation and verification as a single record rather than a chain of messages, spreadsheets and photo folders.",
    problem:
      "On site, the defect is obvious. The difficulty is everything after it: who owns it, what evidence exists, whether it was actually fixed, and who signed that off. When that history is spread across email, WhatsApp and a spreadsheet, resolution becomes an administrative exercise and the same defect is re-reported weeks later.",
    flowLabel: "One record, six states",
    flow: ["Report", "Assign", "Inspect", "Document", "Resolve", "Verify"],
    approach:
      "Each defect is one record moving through an explicit state machine. States cannot be skipped, every transition captures who and when, and evidence attaches to the transition rather than to a folder. The interface makes the current state and the next required action legible at a glance, on a phone, outdoors.",
    decisions: [
      {
        t: "Capture first, structure later",
        d: "Reporting is a photo, a location and a sentence. Categorisation happens afterwards so nothing blocks the person standing in front of the defect.",
      },
      {
        t: "Verification is a separate state",
        d: "‘Fixed’ and ‘verified’ are different claims made by different people. Collapsing them is what lets defects reopen.",
      },
      {
        t: "The record is the report",
        d: "Documentation is assembled from the trail the workflow already produced, not re-typed at the end of the week.",
      },
    ],
    engineering:
      "Next.js and TypeScript for the client, with a typed defect schema shared across capture, list, detail and export views. A FastAPI service holds the state machine, permissions and document assembly. AI drafts a defect title and category from the photo and note, which the reporter edits or discards.",
    arch: [
      ["Client", "Next.js · TypeScript"],
      ["API", "FastAPI"],
      ["Core", "State machine · permissions"],
      ["Assist", "LLM · defect drafting"],
    ],
    outcome:
      "TODO — replace with real deployment detail and any measured outcome. No metrics or client names are claimed here.",
    reflection:
      "Traceability sounds like an admin feature until you watch someone try to prove a defect was fixed. Designing the audit trail as the primary object, rather than a log behind the product, changed the whole information architecture.",
  },
  {
    slug: "referralview",
    number: "03",
    name: "ReferralView",
    industry: "Healthtech",
    status: "In development",
    statusNote: "TODO — confirm current status",
    year: "2025",
    role: "Product Designer / Design Engineer",
    discipline: "Product Design",
    headline: "Every referral. Every step. One clear timeline.",
    summary:
      "ReferralView brings referrals, appointments, documents, updates and actions into one comprehensive timeline so teams can understand exactly where each case stands.",
    tech: ["Next.js", "TypeScript", "Figma", "AI"],
    areas: ["UI/UX", "Product Research", "Content Design"],
    overview:
      "ReferralView is a case-tracking interface for referral pathways. Instead of a status field and a document store, each case is presented as a chronological record: what arrived, what was reviewed, what was scheduled, what changed and what is owed next.",
    problem:
      "A referral’s status is rarely the useful question. Teams need to know how a case got where it is and what is currently blocking it. That history usually exists — in letters, notes, attachments and system events — but it is scattered, so answering a simple question takes a phone call.",
    flowLabel: "The case timeline",
    flow: [
      "Referral received",
      "Documents reviewed",
      "Appointment",
      "Update",
      "Decision",
      "Next action",
    ],
    approach:
      "The timeline is the product, not a tab within it. Every event has a type, an actor, a timestamp and an optional attachment, which makes the same component usable for triage, for a clinic list and for a single case. Open actions are pinned above the record so the next step is never buried in history.",
    decisions: [
      {
        t: "Chronology over status",
        d: "Status is derived from the latest events rather than stored and maintained by hand, so it cannot drift from what actually happened.",
      },
      {
        t: "Events, not documents",
        d: "A letter is an event with an attachment. That one decision removes the separate document area and its parallel navigation.",
      },
      {
        t: "Language checked, not softened",
        d: "Content design was treated as interface: labels follow the words teams already use for each step.",
      },
    ],
    engineering:
      "Next.js and TypeScript, with the timeline modelled as a typed event union so new event kinds can be added without touching the rendering logic. AI is used to summarise long attached correspondence into a short event caption, with the source always one click away.",
    arch: [
      ["Client", "Next.js · TypeScript"],
      ["Model", "Typed event union"],
      ["View", "Timeline · triage · case"],
      ["Assist", "LLM · correspondence summary"],
    ],
    outcome:
      "TODO — replace with real pilot detail and any measured outcome. No metrics, clients or testimonials are claimed here.",
    reflection:
      "Designing this made the shape of the whole portfolio clearer: the work is usually not adding capability, it is making an existing sequence of events readable in one place.",
  },
];

/** Homepage order — the index reads 01/02/03 as authored. */
export const homeCaseOrder = ["budgetview", "siteresolve", "referralview"] as const;

export function caseBySlug(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}
