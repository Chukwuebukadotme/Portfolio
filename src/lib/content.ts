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
    step: "01 Discover",
    items: ["Goals", "Product research", "User research", "Early concepts"],
  },
  {
    step: "02 Design",
    items: ["Information architecture", "Interfaces", "Flows", "Prototypes"],
  },
  {
    step: "03 Build",
    items: ["Development", "Integration", "Production code", "Testing"],
  },
  {
    step: "04 Launch",
    items: ["Deployment", "QA", "Performance", "Production checks"],
  },
  {
    step: "05 Evolve",
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
