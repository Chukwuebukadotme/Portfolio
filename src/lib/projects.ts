/**
 * Selected work.
 *
 * One record per project drives the homepage, the /work index and every case
 * study. Order here is the order everywhere, including previous/next.
 *
 * Artwork: `media` holds real images; `visual` names a designed diagram drawn
 * from the project's own data (see components/site/project-visuals.tsx). A slot
 * with neither renders the "artwork pending" frame, so final assets drop in by
 * adding an import to `media` and nothing else.
 *
 * `verify` is an internal note listing drafted details to confirm. Never rendered.
 */

import type { StaticImageData } from "next/image";

import ozonStandardMetrics from "@/assets/work/ozon/standard-tier-metrics.jpg";
import snnArchitecture from "@/assets/work/predictive-maintenance/snn-architecture.jpg";
import siteresolveLanding from "@/assets/work/siteresolve/landing.jpg";
import siteresolveOverview from "@/assets/work/siteresolve/overview.jpg";
import siteresolveRecord from "@/assets/work/siteresolve/record.jpg";

export type ProjectCategory = "product" | "design-engineering" | "ai" | "data";

export const projectFilters: readonly {
  id: ProjectCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "product", label: "Product Design" },
  { id: "design-engineering", label: "Design Engineering" },
  { id: "ai", label: "AI & Machine Learning" },
  { id: "data", label: "Data" },
];

export type ProjectImage = { src: StaticImageData; alt: string };
export type ProjectVisual = "breakpoints" | "rmse" | "components" | "lsm" | "tiers";
export type Metric = { value: string; label: string };

export type Project = {
  slug: string;
  number: string;
  name: string;
  /** Discipline line, e.g. "Design System · React · Frontend Engineering". */
  type: string;
  /** The one-sentence description used on cards and in the hero. */
  description: string;
  headline?: string;
  categories: readonly ProjectCategory[];
  capabilities: readonly string[];
  role?: string;
  contribution?: string;
  tools?: readonly string[];
  year?: string;
  status?: string;
  /** The single line of evidence shown on the card. Omitted when there is none. */
  evidence?: string;
  problem: string;
  /** Paragraphs separated by a blank line. */
  built: string;
  processLabel: string;
  process: readonly string[];
  processNote?: string;
  decisions: readonly { t: string; d: string }[];
  engineering?: {
    label: string;
    body?: string;
    grid: readonly (readonly [string, string])[];
  };
  metrics?: readonly Metric[];
  outcome: string;
  reflection?: string;
  url?: string;
  visual?: ProjectVisual;
  media?: {
    card?: ProjectImage;
    primary?: ProjectImage;
    detail?: ProjectImage & { caption?: string };
  };
  verify?: string;
};

/** Official FD001 test RMSE (cycles) for the eight approaches, lower is better. */
export const turbofanRmse: readonly {
  model: string;
  short: string;
  rmse: number;
}[] = [
  { model: "Histogram Gradient Boosting", short: "HGB", rmse: 12.5685 },
  { model: "LSTM", short: "LSTM", rmse: 12.849 },
  { model: "Extra Trees", short: "Extra Trees", rmse: 12.8895 },
  { model: "Ridge Regression", short: "Ridge", rmse: 14.9376 },
  { model: "Echo State Network", short: "ESN", rmse: 15.0294 },
  { model: "Transformer", short: "Transformer", rmse: 15.6505 },
  { model: "1D CNN", short: "CNN", rmse: 18.8966 },
  { model: "NEST spiking network", short: "SNN", rmse: 20.1669 },
];

export const projects: readonly Project[] = [
  {
    slug: "siteresolve",
    number: "01",
    name: "SiteResolve",
    type: "Product Design · Design Engineering · UX/UI",
    description:
      "SiteResolve helps construction and property teams report a defect on site, assign it to the right trade, collect evidence of the repair and sign it off, all in the same record.",
    headline: "From defect report to verified resolution, in one record.",
    categories: ["product", "design-engineering"],
    capabilities: [
      "Product Design",
      "Design Engineering",
      "UX/UI",
      "Product Research",
      "Brand Expression",
      "Content",
    ],
    role: "Design Engineer / Product Engineer",
    contribution: "Product research · UX/UI · Brand · Engineering",
    tools: ["Next.js", "TypeScript", "Python", "FastAPI", "Figma"],
    year: "2025",
    status: "In development",
    evidence: "Public product site, waitlist open",
    problem:
      "Defect management breaks down between steps. A defect may begin as a photograph on one phone, become a task in an email and end up as a status in a spreadsheet. The evidence sits in personal camera rolls and chat threads, nobody is named to fix it or given a date, work is marked done without anyone looking at it, and progress reports are pieced together by hand. By handover, nobody can say with confidence who fixed it or whether anyone checked.",
    built:
      "SiteResolve is defect management software for construction, property management, facilities, maintenance and inspection teams. Each defect has one record holding the original report, who owns it, every update, the repair evidence and the final decision, so everyone involved can see who owns each issue and what has happened to it.",
    processLabel: "Four steps, one record",
    process: ["Report", "Assign", "Resolve", "Verify"],
    processNote:
      "Every defect starts as a structured report and stays in the same record until it is verified and closed. Report records what the person fixing it will need: photographs, the exact location down to the room, category and priority. Assign names an owner, internal or external, with a due date and instructions. Resolve keeps the repair notes and before-and-after evidence beside the original report. Verify puts a reviewer between finished work and a closed issue. Every step is dated and attributed, so the history is the report.",
    decisions: [
      {
        t: "Verification is its own step",
        d: "Finished work is not approved automatically. A reviewer accepts it, rejects it or returns it for correction, and the decision joins the issue history. ‘Done’ and ‘checked’ are different claims made by different people.",
      },
      {
        t: "Evidence lives on the issue",
        d: "Photographs, files, comments and decisions stay attached to the defect they describe, not in a camera roll or a chat thread, so the handover file is assembled from the record rather than re-typed.",
      },
      {
        t: "Built for the site, not the office",
        d: "Reporting works on a phone in a basement or on a remote plot. Reports save on the device with no signal and upload when the connection returns.",
      },
      {
        t: "People see what their role needs",
        d: "Invited contractors see only the issues assigned to them, and can post updates and upload evidence. Managers get cross-site views of open, overdue and awaiting-verification work.",
      },
    ],
    engineering: {
      label: "Engineering",
      body: "Next.js and TypeScript for the client, with a typed defect schema shared across capture, assignment, resolution and review views. Reports are queued on the device when offline and synchronised when the connection returns. A FastAPI service holds the workflow state, role-based permissions and the dated issue history. AI drafts a defect title and category from the photograph and note, which the reporter edits or discards.",
      grid: [
        ["Client", "Next.js · TypeScript · offline capture"],
        ["API", "FastAPI"],
        ["Core", "Workflow state · permissions · history"],
        ["Assist", "LLM · defect drafting"],
      ],
    },
    outcome:
      "SiteResolve is in development, with a public product site and an open waitlist. The workflow and interface are designed and built against demonstration data, including a worked fire-door scenario traced from report to sign-off. No customer metrics or client names are claimed until there are real ones.",
    reflection:
      "Traceability sounds like an admin feature until you watch someone try to prove a defect was fixed. Designing the audit trail as the primary object, rather than a log behind the product, changed the whole information architecture.",
    url: "https://siteresolve-nu.vercel.app/",
    media: {
      card: {
        src: siteresolveOverview,
        alt: "SiteResolve portfolio overview showing open, overdue and awaiting-verification defects, beside a site manager photographing a fire door.",
      },
      primary: {
        src: siteresolveLanding,
        alt: "The SiteResolve product site: From defect report to verified resolution.",
      },
      detail: {
        src: siteresolveRecord,
        alt: "A closed SiteResolve defect record, SR-1842, with its dated history from report to verified resolution.",
        caption: "One defect, one record: SR-1842 from report to sign-off, shown with demonstration data.",
      },
    },
  },
  {
    slug: "make-it-responsive",
    number: "02",
    name: "Make It Responsive",
    type: "Design Automation · Figma Plugin · Product Engineering",
    description:
      "A Figma plugin that automatically converts designs across different screen sizes using responsive layout logic, reducing hours of manual resizing to seconds.",
    categories: ["design-engineering", "product"],
    capabilities: [
      "Product Design",
      "Figma Plugin Development",
      "Responsive Design",
      "Design Automation",
    ],
    role: "Creator · Design Engineer",
    contribution: "Product design · Plugin development · Layout logic",
    tools: ["Figma", "Figma Plugin API"],
    evidence: "10K+ users · conversion in ~2 seconds",
    problem:
      "Designing for more than one screen size usually means rebuilding the same frame by hand for every breakpoint: resizing containers, reflowing columns, adjusting spacing and checking that nothing overlaps. For designers producing desktop, tablet and mobile versions of every screen, that is hours of repetitive work that adds no new design thinking, and it is exactly where inconsistencies between breakpoints creep in. Make It Responsive set out to automate that adaptation inside Figma, where the work already happens.",
    built:
      "Make It Responsive is a Figma plugin that takes an existing frame and produces versions of it for other screen sizes. Rather than scaling everything proportionally, it reads the structure of the design first: which layers are containers and which are content, how elements are grouped, and how each one relates to its parent.\n\nFrom that structure it infers how each part of the layout should behave at a new width, whether a row should wrap into a column, whether an element should stretch, hold its size or reflow, and only then applies the transformations that generate the new frame. The output is an ordinary, editable Figma frame, so a designer refines the result rather than starting again. Conversion completes in around two seconds, and the plugin has grown to more than 10,000 users.",
    processLabel: "From one frame to every screen",
    process: [
      "Design parsing",
      "Layout inference",
      "Breakpoint transformation",
      "Component resizing",
      "Output validation",
    ],
    decisions: [
      {
        t: "Preserve parent–child relationships",
        d: "Layers are adapted inside the hierarchy they already sit in, so groups and nested components keep their structure instead of being flattened into loose shapes.",
      },
      {
        t: "Infer behaviour before transforming",
        d: "The plugin decides how each element should respond, stretch, wrap or hold, before it moves anything. Scaling a frame first and fixing it afterwards is what produces distorted layouts.",
      },
      {
        t: "Automate most of it, leave room to refine",
        d: "The aim was to remove the repetitive bulk of the work, not to replace judgement. Output stays fully editable so the last details are finished by hand.",
      },
    ],
    metrics: [
      { value: "~2 s", label: "Responsive conversion" },
      { value: "80–90%", label: "Conversion accuracy" },
      { value: "10K+", label: "Users" },
    ],
    outcome:
      "The plugin turns a task measured in hours into one measured in seconds, with most layouts converting accurately enough to need only light refinement. It has grown to more than 10,000 users.",
    visual: "breakpoints",
    verify:
      "Role and contribution wording; tools beyond Figma (TypeScript?); year; the parsing/inference description in `built`. TODO: add a real before/after screenshot of the plugin to media.card and media.primary.",
  },
  {
    slug: "predictive-maintenance",
    number: "03",
    name: "Predictive Maintenance for Turbofan Engines",
    type: "Artificial Intelligence · Predictive Maintenance · Research",
    description:
      "A comparative evaluation of eight AI approaches for predicting the remaining useful life of degrading aircraft turbofan engines using NASA C-MAPSS data.",
    categories: ["ai", "data"],
    capabilities: [
      "Machine Learning",
      "Deep Learning",
      "Time-Series Modelling",
      "Predictive Maintenance",
      "Spiking Neural Networks",
      "Model Evaluation",
    ],
    role: "AI Engineer / Researcher",
    contribution: "Data preparation · Modelling · Evaluation · Research",
    tools: ["Python", "scikit-learn", "NEST Simulator", "pandas", "NumPy", "Matplotlib"],
    year: "2026",
    evidence: "Best official-test RMSE of 12.57 cycles across 8 approaches",
    problem:
      "Aircraft turbofan engines degrade gradually. Maintenance scheduled too early wastes serviceable life; maintenance scheduled too late risks failure. Remaining useful life (RUL) prediction estimates how many operating cycles an engine has left from its sensor history. Many approaches have been proposed, from classical regression to deep and neuromorphic networks, but they are often reported under different protocols, which makes them hard to compare fairly. This project evaluated eight of them side by side on the same data, splits and test conditions.",
    built:
      "A single experimental pipeline on NASA’s C-MAPSS FD001 dataset, run identically for eight approaches: Ridge Regression, Extra Trees, Histogram Gradient Boosting, a 1D CNN, an LSTM, a Transformer, an Echo State Network and a spiking neural network built as a Liquid State Machine in the NEST simulator.\n\nSensor readings are prepared once, split by engine and turned into fixed-length windows, so every model sees the same inputs. Each approach is tuned under a controlled evaluation, then scored once on the 100 unseen engines of the official test set, alongside error by degradation stage and computational cost. The spiking model encodes 17 retained sensor features as 34 ON/OFF spike channels, drives a reservoir of 300 leaky integrate-and-fire neurons, and reads out RUL through a ridge regression layer with 301 trainable parameters.",
    processLabel: "One protocol, eight models",
    process: [
      "Data preparation",
      "Engine-level split",
      "Window generation",
      "Model training",
      "Controlled evaluation",
      "Official test",
    ],
    decisions: [
      {
        t: "Split engines, not windows",
        d: "Windows from the same engine are highly correlated. Splitting by engine rather than by random window keeps an engine’s history out of both sides of the split and prevents leakage.",
      },
      {
        t: "One protocol for all eight",
        d: "Every approach receives the same preprocessing, splits and metrics, so differences in the results reflect the models rather than the setup.",
      },
      {
        t: "Keep the official test set sealed",
        d: "The 100 NASA test engines are used once, for final evaluation only, so no tuning decision is informed by the numbers being reported.",
      },
      {
        t: "Read accuracy alongside cost",
        d: "Models are compared on computational cost as well as RMSE. A slightly less accurate model that is far cheaper to train and run can be the better engineering choice.",
      },
    ],
    engineering: {
      label: "Inside the spiking model",
      grid: [
        ["Input", "17 sensor features → 34 ON/OFF spike channels"],
        ["Reservoir", "300 LIF neurons · 240 excitatory, 60 inhibitory"],
        ["Readout", "Ridge regression · 301 trainable parameters"],
        ["Window", "30 cycles · 1 ms simulation step"],
      ],
    },
    metrics: [
      { value: "12.57", label: "Best official-test RMSE (cycles)" },
      { value: "8", label: "AI approaches evaluated" },
      { value: "100", label: "Unseen test engines" },
    ],
    outcome:
      "Histogram Gradient Boosting achieved the lowest official-test RMSE at 12.57 cycles, narrowly ahead of the LSTM (12.85) and Extra Trees (12.89). The spiking Liquid State Machine placed last on accuracy at 20.17, but trains only a 301-parameter readout, which is the trade-off the study was designed to expose: accuracy has to be read alongside computational cost.",
    visual: "rmse",
    media: {
      detail: {
        src: snnArchitecture,
        alt: "Architecture of the NEST spiking neural network: 17 sensor features encoded as 34 ON/OFF spike channels feed a recurrent reservoir of 300 leaky integrate-and-fire neurons, read out by ridge regression to predict remaining useful life.",
        caption: "The spiking model: event-driven reservoir with a ridge regression readout.",
      },
    },
    verify:
      "Year (repo dated Aug 2026); the deep-learning framework used for CNN/LSTM/Transformer (add to tools).",
  },
  {
    slug: "axon-ui",
    number: "04",
    name: "Axon UI",
    type: "Design System · React · Frontend Engineering",
    description:
      "A shared Figma and React component library designed to create a more consistent workflow between product design and frontend development.",
    categories: ["design-engineering"],
    capabilities: [
      "Design Systems",
      "Figma",
      "React",
      "Frontend Engineering",
      "Component Architecture",
    ],
    role: "Design Engineer",
    contribution: "Component design · React implementation",
    tools: ["Figma", "React"],
    evidence: "One component library across Figma and React",
    problem:
      "When a design file and a codebase each keep their own version of a component, they drift. A button gains a variant in Figma that never reaches code; a spacing value changes in code and the design file is never updated. Designers and developers then spend review time reconciling differences instead of building, and every new screen risks another inconsistency. Axon UI was built to give both sides one shared set of components to work from.",
    built:
      "Axon UI is a component library maintained in two matching halves: a Figma library for designing and a React library for building. Each component is defined once, its anatomy, variants and states, and that definition is expressed the same way on both sides, so a variant a designer selects in Figma corresponds to a prop a developer passes in React.\n\nShared foundations such as colour, typography and spacing sit underneath both halves, which keeps components consistent as the library grows. The result is a handoff without translation: the names, options and structure a developer reads in the design are the ones they find in code.",
    processLabel: "One component, two sides",
    process: [
      "Component audit",
      "Shared foundations",
      "Anatomy & variants",
      "Figma library",
      "React components",
      "Parity check",
    ],
    decisions: [
      {
        t: "Variants map to props",
        d: "Every Figma variant property has a matching React prop with the same name and options, so the design file doubles as a reference for the component’s API.",
      },
      {
        t: "Foundations before components",
        d: "Colour, type and spacing are defined first and consumed by every component on both sides, so a change to a foundation propagates instead of being repeated.",
      },
      {
        t: "Compose, don’t redraw",
        d: "Larger patterns are assembled from smaller components rather than drawn from scratch, which keeps the library small and its behaviour predictable.",
      },
    ],
    outcome:
      "Axon UI gives design and development a shared vocabulary. Components are specified once and implemented to match, which is intended to shorten handoff and reduce the drift that builds up when design files and code evolve separately.",
    visual: "components",
    verify:
      "Process steps and decisions are drafted from the description; confirm tooling (TypeScript? Storybook? tokens pipeline?), year, and any adoption figures. TODO: add real Figma library and React screenshots to media.",
  },
  {
    slug: "plantify",
    number: "05",
    name: "Plantify",
    type: "Computer Vision · AI Product · Product Design",
    description:
      "An AI-powered application that identifies plants from images using computer vision and machine learning.",
    categories: ["ai", "product"],
    capabilities: [
      "Machine Learning",
      "Computer Vision",
      "Product Design",
      "AI Product Development",
    ],
    role: "Product Designer / ML Engineer",
    contribution: "Product design · Model training · Evaluation",
    evidence: "Over 90% identification accuracy",
    problem:
      "Most people cannot name the plants around them, and the usual routes to finding out, searching by description or browsing a field guide, are slow and depend on already knowing what to look for. A photograph is the most natural input: quick to take, and it holds the information an expert would use. Plantify set out to turn a single image into a confident identification, in an experience simple enough for someone with no botanical knowledge.",
    built:
      "Plantify pairs a computer-vision model with a product experience designed around it. On the machine-learning side, an image classifier is trained to recognise plant species from photographs and evaluated on held-out images to measure how reliably it identifies them.\n\nOn the product side, the flow is built around the moment of capture: take or upload a photo, receive an identification, and see the result presented clearly enough to act on. Designing both halves together meant the interface could be shaped around what the model can and cannot do, rather than treating the model as a black box attached to a finished design.",
    processLabel: "From photograph to answer",
    process: [
      "Image collection",
      "Preprocessing",
      "Model training",
      "Evaluation",
      "Capture flow",
      "Result design",
    ],
    decisions: [
      {
        t: "Design around the model’s behaviour",
        d: "The interface was shaped by how the classifier actually performs, rather than assuming every prediction is equally certain.",
      },
      {
        t: "One photo, one clear answer",
        d: "Capture is the whole interaction: the experience asks for a single image and returns a single, readable identification.",
      },
      {
        t: "Measure on unseen images",
        d: "Accuracy was measured on images held out from training, so the reported figure reflects identification rather than memorisation.",
      },
    ],
    metrics: [{ value: "90%+", label: "Plant-identification accuracy" }],
    outcome:
      "During project evaluation, Plantify identified plants with over 90% accuracy, delivered through a capture-and-result flow designed for people with no botanical background.",
    verify:
      "Tools and model architecture (e.g. CNN / transfer learning, framework), dataset, year, and whether evaluation used a held-out set. TODO: add app screens to media.card and media.primary.",
  },
  {
    slug: "mankela",
    number: "06",
    name: "Mankela",
    type: "Business Platform · Product Design",
    description:
      "A business platform designed to simplify operations by connecting skilled manpower, structured business processes and technology services.",
    categories: ["product"],
    capabilities: [
      "Product Design",
      "UX/UI",
      "Business Process Design",
      "Digital Product Strategy",
    ],
    role: "Product Designer",
    contribution: "Product strategy · UX/UI · Process design",
    evidence: "Manpower, processes and technology in one platform",
    problem:
      "Growing businesses often manage staffing, operational processes and technology through separate providers and informal arrangements. Finding skilled people, keeping work structured and getting the right technical support become three separate problems, each with its own contacts, paperwork and follow-up. The overhead falls on the business owner, who spends time coordinating rather than operating. Mankela was designed to bring those needs together so a business can resolve them in one place.",
    built:
      "Mankela is a business platform organised around three connected services: access to skilled manpower, structured business processes, and technology services. The product design work focused on making those services feel like one system rather than three catalogues.\n\nThat meant defining how a business describes what it needs, how each request reaches the right service, and how progress is shown back once work begins. The interface prioritises plain language and a small number of well-defined actions, so a business owner can understand what is available and what is happening without first learning the platform.",
    processLabel: "Designing the operating model",
    process: [
      "Service mapping",
      "Business needs",
      "Information architecture",
      "Journey design",
      "Interface design",
      "Validation",
    ],
    decisions: [
      {
        t: "One platform, not three catalogues",
        d: "Manpower, processes and technology share one request and tracking model, so a business does not have to learn three ways of working.",
      },
      {
        t: "Plain language over industry terms",
        d: "Services are described by the problem they solve for a business, not by internal categories.",
      },
      {
        t: "Show progress, not just requests",
        d: "Once a request is made, its status stays visible, removing the follow-up calls that informal arrangements depend on.",
      },
    ],
    outcome:
      "Mankela gives businesses one structured place to access people, process support and technology services, and is designed to turn separate arrangements into a single, trackable workflow.",
    verify:
      "Everything beyond the description is drafted: process, decisions, role, year, tools, and whether the platform launched. TODO: add product screens to media.card and media.primary.",
  },
  {
    slug: "liquid-state-machine",
    number: "07",
    name: "Liquid State Machine for Audio Denoising",
    type: "Spiking Neural Networks · Neuromorphic Computing",
    description:
      "A Liquid State Machine using spiking neural networks to recognise temporal audio patterns and filter unwanted noise from sound signals.",
    categories: ["ai"],
    capabilities: [
      "Spiking Neural Networks",
      "Liquid State Machines",
      "Neuromorphic Computing",
      "Audio Processing",
      "Machine Learning",
    ],
    role: "AI Engineer / Researcher",
    contribution: "Research · Network design · Audio processing",
    problem:
      "Background noise degrades speech and audio everywhere from calls to recordings, and removing it well depends on recognising patterns that unfold over time rather than in a single instant. Conventional approaches handle this with large networks performing dense, continuous computation. Spiking neural networks process information as discrete events in time, which makes them a natural fit for temporal signals and a candidate for efficient neuromorphic hardware. This project explored whether a Liquid State Machine could separate wanted sound from noise.",
    built:
      "A Liquid State Machine for audio denoising. Incoming sound is converted into spike trains that drive a recurrent reservoir of spiking neurons, the ‘liquid’. Because the reservoir’s activity at any moment reflects the recent history of its input, it holds a rich, time-dependent representation of the signal without the reservoir itself being trained.\n\nA readout layer is trained on that activity to distinguish the patterns of the wanted signal from those of noise and to reconstruct a cleaner version of the sound. Only the readout learns, which keeps training lightweight and suits the event-driven, low-power computation that neuromorphic systems are designed for.",
    processLabel: "From sound to spikes and back",
    process: [
      "Audio preprocessing",
      "Spike encoding",
      "Reservoir dynamics",
      "Readout training",
      "Signal reconstruction",
    ],
    decisions: [
      {
        t: "Train the readout, not the reservoir",
        d: "The recurrent spiking network stays fixed and only the readout learns, which keeps training fast and stable.",
      },
      {
        t: "Encode time, not just amplitude",
        d: "Audio is converted into spike timing so the network works with how the signal changes, which is where speech and noise differ.",
      },
      {
        t: "Present it as research",
        d: "The work investigates spiking computation as a route to event-driven audio processing. It is not a production denoiser, and no benchmark figures are claimed.",
      },
    ],
    outcome:
      "A working research prototype showing how a Liquid State Machine can learn temporal audio patterns and filter noise from sound signals. No production deployment or benchmark results are claimed; the value of the work is in the approach and what it shows about spiking networks for temporal signals.",
    visual: "lsm",
    verify:
      "Tools (NEST? Brian2? Python libraries), dataset, spike-encoding method, year. Add any spectrogram or waveform comparison to media.detail.",
  },
  {
    slug: "ozon-data-pipeline",
    number: "08",
    name: "Ozon Priority-Aware Data Pipeline",
    type: "Big Data Engineering · E-commerce",
    description:
      "A priority-aware big-data pipeline designed to process and organise high-volume e-commerce data through a structured data engineering workflow.",
    categories: ["data"],
    capabilities: [
      "Big Data",
      "Data Engineering",
      "Pipeline Architecture",
      "Data Processing",
      "E-commerce Systems",
    ],
    role: "Data Engineer",
    contribution: "Pipeline architecture · Cloud infrastructure · Data processing",
    tools: ["Microsoft Azure", "Azure Event Hubs"],
    year: "2026",
    evidence: "Four isolated priority tiers on Azure Event Hubs",
    problem:
      "An e-commerce platform produces a constant stream of events, and they do not all matter equally. When everything flows through one queue, a surge of routine events can delay the ones that need immediate action. The pipeline had to handle high volume without letting urgent data wait behind routine data, while keeping the flow organised enough to transform, process and analyse downstream.",
    built:
      "A priority-aware streaming pipeline for e-commerce event data, built on Azure Event Hubs. Incoming events are classified by urgency and routed into one of four priority tiers: critical, high, standard and low.\n\nEach tier runs as its own Event Hubs namespace, so capacity, partitions and consumers are set per tier and a flood of standard traffic cannot starve critical events. The critical stream is split across four partitions for parallel consumption, and the namespaces run with zone redundancy for resilience. Downstream, each stream is transformed and processed on its own path before being written out for storage and analysis, with namespace-level metrics used to confirm that requests, messages and throughput reach the intended tier.",
    processLabel: "Priority as architecture",
    process: [
      "Data ingestion",
      "Priority assignment",
      "Transformation",
      "Processing",
      "Storage & output",
      "Monitoring",
    ],
    decisions: [
      {
        t: "Isolate tiers, don’t just label them",
        d: "Each priority runs in its own Event Hubs namespace rather than sharing one queue with a priority field, so contention in one tier cannot delay another.",
      },
      {
        t: "Size each tier to its load",
        d: "Partitions and consumers are configured per tier. The critical stream gets four partitions for parallel processing without over-provisioning the rest.",
      },
      {
        t: "Resilience at the platform level",
        d: "Zone redundancy is enabled on the namespaces, so the pipeline tolerates the loss of a single availability zone.",
      },
      {
        t: "Verify routing with live metrics",
        d: "Namespace-level request, message and throughput metrics confirm that test traffic lands in the intended tier.",
      },
    ],
    engineering: {
      label: "Priority tiers",
      grid: [
        ["Critical", "ozon-eh-critical · 4 partitions"],
        ["High", "ozon-eh-high"],
        ["Standard", "ozon-eh-standard"],
        ["Low", "ozon-eh-low"],
      ],
    },
    metrics: [
      { value: "4", label: "Isolated priority tiers" },
      { value: "2.4k", label: "Standard-tier events in the recorded test run" },
      { value: "0", label: "Server errors across tiers" },
    ],
    outcome:
      "In the recorded test run, events reached their intended tiers, around 2,400 through the standard tier and 12 through the high tier, with no server errors on any namespace. The architecture enforces priority structurally, by isolating streams, rather than relying on ordering inside one shared queue.",
    visual: "tiers",
    media: {
      detail: {
        src: ozonStandardMetrics,
        alt: "Azure portal metrics for the ozon-eh-standard Event Hubs namespace during the test run: 2.4k incoming requests and messages, 870.84 kB incoming, and zero server errors.",
        caption: "Recorded metrics for the standard tier during the test run.",
      },
    },
    verify:
      "Year (screenshots dated Apr 2026); the classification rule for priorities; downstream processing and storage services (Stream Analytics? Databricks? Blob/ADLS?) to add to tools.",
  },
  {
    slug: "salary-benchmark",
    number: "09",
    name: "Salary Benchmark Prediction System",
    type: "Machine Learning · Regression · Data Analysis",
    description:
      "An end-to-end machine learning system for analysing workforce data and predicting salary benchmarks using multiple regression and predictive models.",
    categories: ["ai", "data"],
    capabilities: [
      "Machine Learning",
      "Regression",
      "Data Preparation",
      "Exploratory Data Analysis",
      "Feature Engineering",
      "Model Evaluation",
    ],
    role: "ML Engineer",
    contribution: "Data preparation · Analysis · Modelling · Evaluation",
    problem:
      "Setting pay fairly and competitively depends on knowing what a role is worth, but salary benchmarks are often assembled from inconsistent surveys, job adverts and instinct. The factors that drive pay interact in ways that simple averages hide. Organisations need a benchmark that reflects those factors together and can be applied to a specific role. This project built a data-driven way to estimate that benchmark from workforce data.",
    built:
      "An end-to-end machine learning system that takes raw workforce data through to salary predictions. The data is first cleaned and made consistent, handling missing values, inconsistent categories and outliers that would otherwise distort a salary model.\n\nExploratory analysis then examines how pay relates to each available attribute, which informs the features the models receive. Several regression and predictive models are trained on the same prepared data and compared on held-out records using standard error metrics, so the choice of final model rests on evidence rather than preference. The selected model produces salary benchmark predictions for new profiles, with the preceding analysis documenting why it behaves as it does.",
    processLabel: "The full workflow, not just the prediction",
    process: [
      "Data cleaning",
      "Exploratory analysis",
      "Feature engineering",
      "Model training",
      "Model comparison",
      "Salary prediction",
    ],
    decisions: [
      {
        t: "Clean before modelling",
        d: "Missing values, inconsistent categories and outliers are resolved first, because a salary model trained on untidy data learns the untidiness.",
      },
      {
        t: "Let the analysis choose the features",
        d: "Exploratory analysis decides which attributes and derived variables reach the models, rather than feeding every column in.",
      },
      {
        t: "Compare models on the same split",
        d: "Every model is trained and scored on identical data and metrics, so differences in the results reflect the models, not the data they saw.",
      },
    ],
    outcome:
      "A complete, reproducible workflow from raw workforce data to salary benchmark predictions, with each stage, cleaning, analysis, feature engineering and model comparison, documented so the final prediction can be explained as well as produced.",
    verify:
      "Tools, dataset, which models were compared and their scores (add metrics if available), year. TODO: add EDA or model-comparison charts to media.",
  },
];

/** The homepage shows the first few; /work shows everything. */
export const featuredProjectCount = 4;

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
