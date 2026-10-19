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
  /** Shown publicly (footer, contact page, email signatures). Forwards to `email`. */
  contactEmail: "hello@chukwuebukaonyemelukwe.com",
  /** Where enquiries actually land and where replies route — kept off the
   *  public forwarder so delivery never depends on it. */
  email: "chukwuebukaspad@gmail.com",
  linkedin:
    "https://www.linkedin.com/in/chukwuebuka-onyemelukwe-43b751177/",
  github: "https://github.com/Chukwuebukadotme",
  /** TODO — replace with the real Cal.com handle. */
  calcom: "https://cal.com/TODO",
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

export const enquiryOptions = [
  "Hiring / Career Opportunity",
  "Digital Product",
  "Website",
  "AI & Automation",
  "Product Design",
  "Other",
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
 * records.
 */
export const experience = [
  {
    role: "AI Product Engineer",
    organisation: "Freelance",
    location: "United Kingdom, remote",
    dates: "Jan 2025 – present",
    summary:
      "Designed and engineered three digital products across fintech, construction technology and healthcare, from discovery and UX through architecture, implementation, testing and launch. Created Make It Responsive.",
    projects: ["siteresolve", "make-it-responsive"],
  },
  {
    role: "AI Product Engineer (contract)",
    organisation: "Technoville Innovation Nigeria",
    location: "Nigeria",
    dates: "Sep 2023 – Sep 2025",
    summary:
      "AI product engineering and product design in a cross-functional team, prototyping AI features. Built an AI product that drafts proposals for clients and sponsors, and trained more than ten colleagues on AI workflows.",
    projects: [],
  },
  {
    role: "Process Control Engineer and Data Analyst Intern",
    organisation: "Nigeria LNG Limited",
    location: "Bonny, Nigeria",
    dates: "Dec 2021 – Jul 2022",
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
  },
  {
    award: "BEng Electronic and Computer Engineering",
    institution: "University of Nigeria, Nsukka",
    location: "Nigeria",
    date: "Aug 2023",
  },
  {
    award: "IBM AI Engineering Professional Certificate",
    institution: "IBM",
    date: "Nov 2021",
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
  eyebrow: "About CO",
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
