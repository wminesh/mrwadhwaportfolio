export interface ProofMetric {
  id: string;
  value: string;
  label: string;
  scope: "ACTUAL" | "PROD" | "ANNUAL" | "VERIFIED";
  href: string;
  counter: {
    prefix?: string;
    target: number;
    decimals?: number;
    suffix?: string;
  };
}

export interface CaseStudyBeat {
  beat: string;
  title: string;
  status: "verified" | "placeholder";
  content: string;
}

const createPlaceholderBeats = (headlineSummary: string): CaseStudyBeat[] => [
  {
    beat: "01 // HEADLINE & PROOF",
    title: "Verified headline outcome",
    status: "verified",
    content: headlineSummary,
  },
  {
    beat: "02 // BEFORE-STATE & STAKES",
    title: "Ugly before-state and stakes",
    status: "placeholder",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    beat: "03 // WHY IT WAS HARD",
    title: "Hidden operational and technical constraints",
    status: "placeholder",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    beat: "04 // REJECTED FIX & TRADE-OFF",
    title: "Why the obvious fix was rejected",
    status: "placeholder",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    beat: "05 // PRODUCT DECISION",
    title: "Core product intervention",
    status: "placeholder",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
  },
  {
    beat: "06 // EXECUTION & CONSTRAINTS",
    title: "Rollout sequencing and scoping cuts",
    status: "placeholder",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.",
  },
  {
    beat: "07 // MEASURED OUTCOME",
    title: "Attribution, baseline, and business impact",
    status: "placeholder",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.",
  },
  {
    beat: "08 // REFLECTION",
    title: "What to repeat or change next time",
    status: "placeholder",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  },
];

export type CaseStudyCategory =
  | "Enterprise Ops"
  | "EdTech & Growth"
  | "Marketing"
  | "Product";

export interface CaseStudyJob {
  company: string;
  role: string;
  period: string;
}

export interface CaseStudy {
  index: string;
  slug: string;
  category: CaseStudyCategory;
  eyebrow: string;
  title: string;
  hook: string;
  heroMetric: string;
  heroMetricLabel: string;
  job: CaseStudyJob;
  metrics: { label: string; scope?: string }[];
  beats: CaseStudyBeat[];
  evidenceGaps: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: {
    metric: string;
    unit?: string;
    detail: string;
  }[];
}

export interface ConsultingEngagement {
  client: string;
  metric: string;
  detail: string;
}

export interface EducationItem {
  institution: string;
  credential: string;
  period: string;
}

export const SITE_META = {
  name: "Minesh Wadhwa",
  role: "Senior Product Manager",
  location: "Bangalore, India",
  email: "w.minesh@gmail.com",
  phone: "+91 9035 199 024",
  heroEyebrow: "SENIOR PRODUCT MANAGER · BANGALORE",
  heroHeadline:
    "Human equivalent of a feedback form for fixing friction (ffs).",
  heroHook:
    "Design eye with a builder's bias. Friend first.",
};

export const PROOF_METRICS: ProofMetric[] = [
  {
    id: "ai-procurement",
    value: "20% faster",
    label: "Store-setup procurement at Lowe's",
    scope: "PROD",
    href: "/work/ai-procurement-catalog",
    counter: { target: 20, suffix: "% faster" },
  },
  {
    id: "xcel-masterclasses",
    value: "2.5L+ SQLs",
    label: "Byju's Xcel (+35% lead CVR)",
    scope: "ACTUAL",
    href: "/work/xcel-masterclasses",
    counter: { target: 2.5, decimals: 1, suffix: "L+ SQLs" },
  },
  {
    id: "healthq-rehab",
    value: "+35% traffic",
    label: "HealthQ organic & +50% social lift",
    scope: "ACTUAL",
    href: "/work/healthq-rehab-marketing-setup",
    counter: { prefix: "+", target: 35, suffix: "% traffic" },
  },
  {
    id: "platform-reliability",
    value: "~$10M / yr",
    label: "Saved at 99.99% reliability",
    scope: "ANNUAL",
    href: "/work/platform-reliability",
    counter: { prefix: "~$", target: 10, suffix: "M / yr" },
  },
];

export const FLAGSHIP_CASE_STUDIES: CaseStudy[] = [
  {
    index: "01",
    slug: "ai-procurement-catalog",
    category: "Enterprise Ops",
    eyebrow: "Lowe's India · Senior PM · 2024–Present",
    title: "20% faster store-setup procurement cycles",
    hook: "Replaced manual catalog lookups with AI-driven procurement for enterprise store setup teams.",
    heroMetric: "-20%",
    heroMetricLabel: "Procurement cycle time",
    job: {
      company: "Lowe's India",
      role: "Senior Product Manager",
      period: "Sep 2024 – Present · Bangalore",
    },
    metrics: [
      { label: "-20% Cycle Time", scope: "PROD" },
      { label: "AI Procurement Catalog" },
      { label: "Store Setup Teams" },
    ],
    beats: createPlaceholderBeats(
      "Shipped an AI-driven enterprise procurement and catalog system for Lowe's store setup teams, cutting operational cycle times by 20%."
    ),
    evidenceGaps: [
      "Exact baseline cycle time in days before launch",
      "Quarterly request volume / number of store setup teams",
      "Rejected alternative and engineering trade-off",
      "Personal vs. engineering team attribution split",
    ],
  },
  {
    index: "02",
    slug: "xcel-masterclasses",
    category: "EdTech & Growth",
    eyebrow: "Byju's · Senior PM · 2020–2023",
    title: "2.5L+ sales-qualified leads at 35% higher conversion",
    hook: "Rebuilt masterclass engagement journeys to turn top-of-funnel webinar interest into qualified sales leads.",
    heroMetric: "2.5L+",
    heroMetricLabel: "Sales-qualified leads",
    job: {
      company: "Byju's",
      role: "Senior Product Manager",
      period: "Jul 2020 – Apr 2023 · Bangalore",
    },
    metrics: [
      { label: "2.5L+ SQLs", scope: "ACTUAL" },
      { label: "+35% Lead CVR" },
      { label: "Xcel Masterclasses" },
    ],
    beats: createPlaceholderBeats(
      "Led Byju's Xcel Masterclasses from webinar engagement through sales handoff, generating over 2.5L sales-qualified leads and lifting lead conversion rates by 35%."
    ),
    evidenceGaps: [
      "Baseline lead-to-SQL conversion percentage",
      "Measurement period for the 2.5L+ SQL count",
      "Specific journey change that drove the +35% CVR",
      "Rejected stakeholder request and reflection",
    ],
  },
  {
    index: "03",
    slug: "healthq-rehab-marketing-setup",
    category: "Marketing",
    eyebrow: "HealthQ Rehab · Head of Marketing · 2023",
    title: "35% organic traffic and 50% social lift",
    hook: "Rebuilt SEO content plus WhatsApp and Telegram retention channels for a rehab clinic.",
    heroMetric: "+35%",
    heroMetricLabel: "Organic traffic",
    job: {
      company: "HealthQ Rehab",
      role: "Head of Marketing",
      period: "May – Dec 2023 · Bangalore",
    },
    metrics: [
      { label: "+35% Organic Traffic", scope: "ACTUAL" },
      { label: "+50% Social Lift" },
      { label: "+20% Brand Engagement" },
    ],
    beats: createPlaceholderBeats(
      "Built HealthQ Rehab's organic and messaging retention engine from May to Dec 2023, growing organic traffic 35%, social engagement 50%, and overall brand engagement 20%."
    ),
    evidenceGaps: [
      "Baseline monthly organic sessions before May 2023",
      "Patient booking / inquiry conversion downstream",
      "Rejected paid-media or agency alternatives",
      "Channel-level attribution breakdown",
    ],
  },
  {
    index: "04",
    slug: "platform-reliability",
    category: "Enterprise Ops",
    eyebrow: "Lowe's India · Senior PM · 2024–Present",
    title: "~$10M/yr saved at 99.99% platform reliability",
    hook: "Automated incident recovery cut order cancellations and held enterprise platforms at 99.99% reliability.",
    heroMetric: "~$10M",
    heroMetricLabel: "Saved per year · 99.99%",
    job: {
      company: "Lowe's India",
      role: "Senior Product Manager",
      period: "Sep 2024 – Present · Bangalore",
    },
    metrics: [
      { label: "~$10M/yr Saved", scope: "ANNUAL" },
      { label: "99.99% Reliability" },
      { label: "Automated Recovery" },
    ],
    beats: createPlaceholderBeats(
      "Led order-recovery and reliability initiatives for Lowe's enterprise platforms, saving ~$10M annually in reduced cancellations while maintaining 99.99% reliability."
    ),
    evidenceGaps: [
      "Baseline order cancellation rate and volume",
      "Exact automated recovery trigger and fallback rules",
      "Rejected retry/manual triage option",
      "Split between revenue protection vs. ops cost savings in ~$10M",
    ],
  },
  {
    index: "05",
    slug: "tynker-app-redesign",
    category: "Product",
    eyebrow: "Byju's · Tynker · Senior PM · 2020–2023",
    title: "5% higher course completion on Tynker",
    hook: "Redesigned the Tynker app with structured assessments and DIY projects to keep learners finishing courses.",
    heroMetric: "+5%",
    heroMetricLabel: "Course completion",
    job: {
      company: "Byju's · Tynker",
      role: "Senior Product Manager",
      period: "Jul 2020 – Apr 2023 · Bangalore",
    },
    metrics: [
      { label: "+5% Completion", scope: "ACTUAL" },
      { label: "App Redesign" },
      { label: "Assessments & DIY" },
    ],
    beats: createPlaceholderBeats(
      "Lifted Tynker course completion by 5% via an app redesign adding assessments and DIY projects."
    ),
    evidenceGaps: [
      "Baseline course completion rate before the redesign",
      "Active learner cohort size and measurement window",
      "Rejected design approach and scoping trade-offs",
      "Personal vs. cross-product team attribution split",
    ],
  },
];

export const EXPERIENCE_LEDGER: ExperienceItem[] = [
  {
    id: "lowes",
    company: "Lowe's India",
    role: "Senior Product Manager",
    period: "Sep 2024 – Present",
    location: "Bangalore",
    highlights: [
      {
        metric: "~$10M",
        unit: "annual",
        detail:
          "Cut order cancellations via automated recovery and incident handling (Reliability Engineering).",
      },
      {
        metric: "99.99%",
        unit: "reliability",
        detail:
          "Built KPI frameworks and live dashboards tracking platform health, adoption, and delivery.",
      },
      {
        metric: "$2M",
        unit: "annual",
        detail:
          "Delivered cost savings on the enterprise asset lifecycle platform across finance and infrastructure.",
      },
      {
        metric: "-20%",
        unit: "cycle time",
        detail:
          "Shipped an AI-driven procurement and catalog system for enterprise store setup teams.",
      },
    ],
  },
  {
    id: "hype",
    company: "Hype Marketing & Product Services",
    role: "Founder",
    period: "Oct 2023 – Nov 2024",
    location: "Bangalore",
    highlights: [
      {
        metric: "+50% / +30%",
        unit: "Upraised",
        detail:
          "Social engagement (+50%) and website traffic (+30%) from new-offering content strategy.",
      },
      {
        metric: "4.5+ / 5",
        unit: "Programming Hub",
        detail:
          "Built and marketed digital coding courses with 4.5+ user ratings.",
      },
      {
        metric: "30% / 20%",
        unit: "Gradiant",
        detail:
          "Email open rates (30%) and click-through rates (20%) from lifecycle campaigns.",
      },
      {
        metric: "80%+",
        unit: "Acadecraft",
        detail: "Completion rates across structured digital learning programs.",
      },
    ],
  },
  {
    id: "healthq",
    company: "HealthQ Rehab",
    role: "Head of Marketing",
    period: "May 2023 – Dec 2023",
    location: "Bangalore",
    highlights: [
      {
        metric: "+35%",
        unit: "organic",
        detail: "Organic traffic growth from revamped SEO and content strategy.",
      },
      {
        metric: "+50%",
        unit: "social",
        detail: "Social media engagement lift from targeted acquisition campaigns.",
      },
      {
        metric: "+20%",
        unit: "brand",
        detail:
          "Overall brand engagement growth across WhatsApp, Telegram, and newsletter loops.",
      },
    ],
  },
  {
    id: "byjus-spm",
    company: "Byju's · Product Development",
    role: "Senior Product Manager",
    period: "Jul 2020 – Apr 2023",
    location: "Bangalore",
    highlights: [
      {
        metric: "2.5L+",
        unit: "SQLs",
        detail:
          "Sales-qualified leads generated on Byju's Xcel Masterclasses with +35% lead conversion.",
      },
      {
        metric: "12",
        unit: "prototypes",
        detail:
          "Cross-product experience prototypes shipped across Aakash-Byjus, Tynker, and Whitehat Jr.",
      },
      {
        metric: "-15%",
        unit: "training",
        detail:
          "Cut instructor training time in live coding classes via Whitehat Jr. Interactive Learning Experiences.",
      },
      {
        metric: "+5%",
        unit: "completion",
        detail:
          "Lifted Tynker course completion via app redesign with assessments and DIY projects.",
      },
    ],
  },
  {
    id: "byjus-early",
    company: "Byju's · Content & Product",
    role: "Multiple Roles",
    period: "Jun 2015 – Jun 2020",
    location: "Bangalore",
    highlights: [
      {
        metric: "0 → 1",
        unit: "modules",
        detail:
          "Prototyped interactive science and maths learning experiences plus the Social Studies product line across Exam Prep and BTLA.",
      },
    ],
  },
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    institution: "Indian Institute of Management, Bangalore",
    credential: "Executive General Management Program",
    period: "2025 – 2026 (ongoing)",
  },
  {
    institution: "Manipal Institute of Technology",
    credential: "B.Tech in Computer Science Engineering",
    period: "2011 – 2015",
  },
  {
    institution: "University of California, Irvine",
    credential: "Project Planning, Budgeting & Risk Management",
    period: "Oct 2020 – Dec 2020",
  },
];

export const SOCIAL_ENTREPRENEURSHIP = [
  {
    org: "The Open Door Foundation",
    detail: "Taught students at RTC Girls Home, Bangalore.",
  },
  {
    org: "Education for All (Byju's)",
    detail: "Volunteered for initiative aiming to train 10M kids by 2025.",
  },
];

export const DESIGN_TOKENS = [
  { name: "Canvas", token: "--bg-canvas", hex: "#090A0C", role: "Primary background" },
  { name: "Surface", token: "--bg-surface", hex: "#111318", role: "Elevated cards & strips" },
  { name: "Surface Hover", token: "--bg-surface-hover", hex: "#171A21", role: "Interactive states" },
  { name: "Hairline", token: "--border-hairline", hex: "#232730", role: "1px structural grid" },
  { name: "Ink Primary", token: "--ink-primary", hex: "#F4F3EE", role: "Headlines & figures" },
  { name: "Ink Secondary", token: "--ink-secondary", hex: "#9CA3AF", role: "Body copy" },
  { name: "Ink Muted", token: "--ink-muted", hex: "#5E6673", role: "Indices & scope tags" },
  { name: "Signal Copper", token: "--accent-signal", hex: "#FF5C28", role: "Primary CTA & metrics" },
];
