export * from "./projects";

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
    label: "Byju's Xcel (15%+ app push CTR)",
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
          "Deduplicated sales-qualified leads generated on Byju's Xcel Masterclasses across 24 episodes (>7% CTA CVR, 15%+ push CTR).",
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
