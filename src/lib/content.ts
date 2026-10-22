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
  /**
   * The one public address: shown on the site, where enquiries are sent and
   * where replies route. ImprovMX forwards it to the Gmail inbox, which sends
   * as this address through Brevo, so the personal address stays private.
   */
  contactEmail: "hello@chukwuebukaonyemelukwe.com",
  linkedin:
    "https://www.linkedin.com/in/chukwuebuka-onyemelukwe-43b751177/",
  github: "https://github.com/Chukwuebukadotme",
  calcom: "https://cal.com/chukwuebuka-studio",
  resume: "/uploads/Chukwuebuka_CV_.docx.pdf",
  location: "United Kingdom",
  /** Stated once and reused wherever availability appears. */
  availability: "UK based · Open to permanent UK roles",
} as const;

/** The hero's fixed line. The highlighted phrase is the one cobalt accent. */
export const hero = {
  lead: "I design and engineer",
  highlight: "digital products and intelligent systems",
  tail: "that make complex work simpler.",
  body: "I combine product thinking, interface design and engineering to build fast, usable and durable websites, applications and AI systems.",
} as const;

/** C15: hiring and project enquiries stay distinct; everything else is general. */
export const enquiryOptions = [
  "Hiring",
  "Product collaboration",
  "General enquiry",
] as const;

export type EnquiryOption = (typeof enquiryOptions)[number];

/**
 * Home's capabilities, each tied to the projects that show it. Slugs that are
 * not published are skipped where these render.
 */
export const capabilities = [
  {
    title: "Product design",
    body: "Research, information architecture and interface design, carried through to a product people can use on site, in Figma or in a browser.",
    projects: ["siteresolve", "make-it-responsive"],
  },
  {
    title: "Product engineering",
    body: "Next.js, TypeScript and Python services, Figma plugins and cloud data pipelines, built for the conditions they run in.",
    projects: ["make-it-responsive", "siteresolve", "ozon-data-pipeline"],
  },
  {
    title: "AI engineering",
    body: "Model evaluation under one controlled protocol, spiking and reservoir networks, and AI features that keep a person in the loop.",
    projects: ["predictive-maintenance", "liquid-state-machine"],
  },
] as const;

/**
 * Career history, from the CV supplied in October 2026. The single source for
 * Home's milestones and the About timeline; add entries only from confirmed
 * records. `start` and `end` are year-month; a missing `end` means present.
 */
export const experience = [
  {
    role: "AI Product Engineer",
    organisation: "Freelance",
    location: "United Kingdom, remote",
    dates: "Jan 2025 – present",
    start: "2025-01",
    summary:
      "Designed and engineered three digital products across fintech, construction technology and healthcare, from discovery and UX through architecture, implementation, testing and launch. Created Make It Responsive.",
    projects: ["siteresolve", "make-it-responsive"],
  },
  {
    role: "AI Product Engineer (contract)",
    organisation: "Technoville Innovation Nigeria",
    location: "Nigeria",
    dates: "Sep 2023 – Sep 2025",
    start: "2023-09",
    end: "2025-09",
    summary:
      "AI product engineering and product design in a cross-functional team, prototyping AI features. Built an AI product that drafts proposals for clients and sponsors, and trained more than ten colleagues on AI workflows.",
    projects: [],
  },
  {
    role: "Process Control Engineer and Data Analyst Intern",
    organisation: "Nigeria LNG Limited",
    location: "Bonny, Nigeria",
    dates: "Dec 2021 – Jul 2022",
    start: "2021-12",
    end: "2022-07",
    summary:
      "Built more than 50 AVEVA PI Vision dashboards that gave over 1,000 employees browser access to real-time plant KPIs, sensor readings and critical control status, replacing checks that needed a visit to the plant.",
    projects: [],
  },
] as const;

export const education = [
  {
    award: "MSc Artificial Intelligence, Distinction",
    institution: "Nottingham Trent University",
    location: "United Kingdom",
    date: "Sep 2026",
    completed: "2026-09",
  },
  {
    award: "BEng Electronic and Computer Engineering",
    institution: "University of Nigeria, Nsukka",
    location: "Nigeria",
    date: "Aug 2023",
    completed: "2023-08",
  },
  {
    award: "IBM AI Engineering Professional Certificate",
    institution: "IBM",
    date: "Nov 2021",
    completed: "2021-11",
  },
] as const;

export const about = {
  intro:
    "I work at the intersection of design, engineering and product, taking complicated problems and turning them into digital systems that are useful, understandable and durable.",
  body: "Curiosity has consistently pushed me across disciplines. Design helps me understand how people experience a system. Engineering helps me understand how it works. Artificial intelligence expands what that system can do. Product thinking keeps the work connected to a real problem.",
  /** Design and AI meet in specific decisions, so this names them. */
  designAndAi:
    "In SiteResolve, AI drafts a defect’s title and category from the photograph, and the reporter edits or discards it, so a person stays responsible for the record. In my MSc research I compared eight models under one protocol and reported where the most novel of them fell short, because a design decision is only as good as the evidence behind it.",
  practice: [
    { title: "Design", body: "Understand and shape the experience." },
    { title: "Engineering", body: "Make the experience real and reliable." },
    { title: "Intelligence", body: "Make the system more capable." },
    { title: "Product", body: "Make sure the right problem is being solved." },
  ],
  availability:
    "Open to permanent roles across the UK in design engineering, product engineering and AI engineering, and to selected product collaborations.",
} as const;
