export interface TimelineMinorEvent {
  id: string;
  /** Short left-column tag shown once the scroll comet reaches this point (e.g. "LAUNCH · AI Catalog") */
  badge: string;
  /** Primary 1-line achievement shown once reached */
  title: string;
  /** Optional expanded context revealed on hover/focus */
  detail?: string;
  /** Optional right-aligned unit/team tag */
  meta?: string;
  /** Optional case study route link */
  href?: string;
}

export interface TimelineMajorEvent {
  id: string;
  /** Top badge on the sticky left anchor (e.g. "MAJOR · JOB" or "MAJOR · EDUCATION") */
  badge?: string;
  period: string;
  company: string;
  role: string;
  location?: string;
  /** Highlighted copper metric line at the top of the 1-column card */
  headlineMetrics: string;
  /** Summary paragraph inside the 1-column card */
  summary: string;
  /**
   * Minor events (launches, starts, stops, certifications, etc.) interleaved below this major event.
   * Add, remove, or reorder items freely — scroll thresholds are measured dynamically from the DOM.
   */
  minorEvents?: TimelineMinorEvent[];
}

/**
 * Single source of truth for the Experience & Credentials scroll timeline.
 * Add or reorder Major Events (jobs/education) and Minor Events (launches/starts/stops) here;
 * CareerTimeline automatically computes all scroll trigger coordinates from the rendered DOM.
 */
export const CAREER_TIMELINE_EVENTS: TimelineMajorEvent[] = [
  {
    id: "lowes",
    badge: "MAJOR · JOB",
    period: "Sep 2024 – Present",
    company: "Lowe's India",
    role: "Senior Product Manager",
    location: "Bangalore",
    headlineMetrics: "~$10M/yr saved · 99.99% reliability · -20% cycle time",
    summary:
      "Cut order cancellations via automated recovery and standardized incident handling while holding enterprise platforms at 99.99% reliability.",
    minorEvents: [
      {
        id: "iimb-egmp",
        badge: "EDUCATION · 2025–2026",
        title:
          "Started Executive General Management Program at IIM Bangalore (ongoing)",
        detail:
          "Executive general management curriculum alongside Senior PM role at Lowe's India.",
        meta: "IIM Bangalore",
      },
      {
        id: "lowes-ai-catalog",
        badge: "LAUNCH · AI Catalog",
        title:
          "Launched AI-driven Store Procurement Catalog (-20% cycle time)",
        detail:
          "Replaced manual catalog lookups across enterprise store setup teams with AI-assisted procurement.",
        meta: "Infra & Ops BU",
        href: "/work/ai-procurement-catalog",
      },
      {
        id: "lowes-atom",
        badge: "DELIVERED · ATOM",
        title:
          "Delivered ATOM — Enterprise Asset Lifecycle platform ($2M/yr saved)",
        detail:
          "Connected operations, finance, and infrastructure workflows to deliver $2M in annual cost savings.",
        meta: "Infra & Ops BU",
      },
      {
        id: "lowes-reliability-start",
        badge: "START · Sep 2024",
        title: "Started with Lowe's Reliability Engineering Team",
        detail:
          "Built KPI frameworks, live operational health dashboards, and automated order-recovery triggers.",
        meta: "Reliability Engg",
        href: "/work/platform-reliability",
      },
    ],
  },
  {
    id: "hype",
    badge: "MAJOR · JOB",
    period: "Oct 2023 – Nov 2024",
    company: "Hype Marketing & Product Services",
    role: "Founder",
    location: "Bangalore",
    headlineMetrics: "+50% social · 4.5+ rating · 80%+ completion",
    summary:
      "Built growth, lifecycle, and digital learning programs across Upraised, Programming Hub, Gradiant, and Acadecraft.",
    minorEvents: [
      {
        id: "hype-upraised-gradiant",
        badge: "DELIVERED · Growth",
        title:
          "Upraised (+50% social, +30% traffic) & Gradiant (30% open rate, 20% CTR)",
        detail:
          "Shipped new-offering content strategy for Upraised and lifecycle email campaigns for Gradiant.",
        meta: "Client Mandates",
      },
      {
        id: "hype-courses",
        badge: "LAUNCH · Learning",
        title:
          "Programming Hub (4.5+ / 5 rating) & Acadecraft (80%+ completion)",
        detail:
          "Built and marketed digital coding courses and structured learning programs.",
        meta: "EdTech Clients",
      },
    ],
  },
  {
    id: "healthq",
    badge: "MAJOR · JOB",
    period: "May 2023 – Dec 2023",
    company: "HealthQ Rehab",
    role: "Head of Marketing",
    location: "Bangalore",
    headlineMetrics: "+35% organic traffic · +50% social lift · +20% brand",
    summary:
      "Revamped SEO and content strategy while building targeted acquisition and messaging retention loops.",
    minorEvents: [
      {
        id: "healthq-retention",
        badge: "LAUNCH · Retention",
        title:
          "Launched WhatsApp, Telegram & newsletter retention loops (+20% brand)",
        detail:
          "Paired organic search content with direct community messaging channels for patient retention.",
        meta: "HealthQ Rehab",
        href: "/work/healthq-rehab-marketing-setup",
      },
    ],
  },
  {
    id: "byjus-spm",
    badge: "MAJOR · JOB",
    period: "Jul 2020 – Apr 2023",
    company: "Byju's · Product Development",
    role: "Senior Product Manager",
    location: "Bangalore",
    headlineMetrics: "250,000+ SQLs · +35% lead CVR · 12 prototypes",
    summary:
      "Led top-of-funnel masterclass qualification and cross-product learning experiences across Byju's Xcel, Tynker, Whitehat Jr., and Aakash-Byjus.",
    minorEvents: [
      {
        id: "byjus-tynker-whj",
        badge: "LAUNCH · Tynker & WHJ",
        title:
          "Redesigned Tynker app (+5% completion) & Whitehat Jr. live classes (-15% training time)",
        detail:
          "Added assessments and DIY projects on Tynker; shipped Interactive Learning Experiences inside live coding classes.",
        meta: "Tynker & Whitehat Jr.",
        href: "/work/tynker-app-redesign",
      },
      {
        id: "byjus-prototypes",
        badge: "SHIPPED · 12 Prototypes",
        title:
          "Shipped 12 cross-product prototypes across Aakash-Byjus, Tynker & Whitehat Jr.",
        detail:
          "Tested unified learning workflows and engagement mechanics across acquired product lines.",
        meta: "Cross-Product",
      },
      {
        id: "byjus-xcel-start",
        badge: "START · Byju's Xcel",
        title:
          "Started Byju's Xcel Masterclasses (250,000+ unique SQLs across 24 episodes)",
        detail:
          "Scaled fortnightly gated live shows to 400K registrations per episode with >7% ad button conversion and 15%+ push CTR.",
        meta: "Xcel Funnel",
        href: "/work/xcel-masterclasses",
      },
      {
        id: "uci-cert",
        badge: "CERTIFICATION · 2020",
        title:
          "UC Irvine — Project Planning, Budgeting & Risk Management (Oct – Dec 2020)",
        detail:
          "Completed specialization in project scope, charters, scheduling, and risk management.",
        meta: "UC Irvine",
      },
      {
        id: "social-impact",
        badge: "IMPACT · Community",
        title:
          "The Open Door Foundation (RTC Girls Home) & Education for All (Byju's)",
        detail:
          "Taught students at RTC Girls Home in Bangalore and volunteered for Byju's initiative aiming to train 10M kids by 2025.",
        meta: "Social Impact",
      },
    ],
  },
  {
    id: "byjus-early",
    badge: "MAJOR · JOB",
    period: "Jun 2015 – Jun 2020",
    company: "Byju's · Content & Product",
    role: "Multiple Roles",
    location: "Bangalore",
    headlineMetrics: "0 → 1 product lines · Exam Prep & BTLA",
    summary:
      "Prototyped interactive science and maths learning experiences plus the Social Studies product line across Byju's Exam Prep and BTLA.",
    minorEvents: [
      {
        id: "byjus-social-studies",
        badge: "LAUNCH · 0 → 1 Modules",
        title:
          "Launched Social Studies product line & BTLA Science / Commerce modules",
        detail:
          "Prototyped and shipped interactive learning modules from scratch across core K-12 and exam prep lines.",
        meta: "BTLA & Exam Prep",
      },
    ],
  },
  {
    id: "mit-manipal",
    badge: "MAJOR · EDUCATION",
    period: "2011 – 2015",
    company: "Manipal Institute of Technology",
    role: "B.Tech in Computer Science Engineering",
    location: "Manipal",
    headlineMetrics: "B.Tech · Computer Science Engineering",
    summary:
      "Undergraduate engineering degree in computer science prior to joining Byju's in 2015.",
  },
];
