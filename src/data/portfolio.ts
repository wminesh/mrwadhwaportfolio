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

export type CaseStudyBlock =
  | {
      type: "prose";
      paragraphs: string[];
    }
  | {
      type: "list";
      heading?: string;
      ordered?: boolean;
      items: { label?: string; text: string }[];
    }
  | {
      type: "math";
      heading?: string;
      lines: {
        key: string;
        value: string;
        note?: string;
        highlight?: boolean;
      }[];
    }
  | {
      type: "comparison";
      left: { badge: string; title: string; points: string[] };
      right: { badge: string; title: string; points: string[] };
    }
  | {
      type: "table";
      columns: string[];
      rows: string[][];
    }
  | {
      type: "funnel";
      heading?: string;
      stages: {
        stage: string;
        metric: string;
        share: string;
        widthPct: number;
        detail: string;
      }[];
    }
  | {
      type: "timeline";
      heading?: string;
      steps: { window: string; title: string; detail: string }[];
    }
  | {
      type: "ab-switcher";
      heading?: string;
      intro?: string;
      variants: {
        id: string;
        label: string;
        metric: string;
        audience: string;
        image: string;
        width: number;
        height: number;
        note: string;
      }[];
    }
  | {
      type: "channel-tabs";
      heading?: string;
      channels: {
        id: string;
        label: string;
        metric: string;
        cadence: string;
        summary: string;
        bullets: string[];
      }[];
    }
  | {
      type: "media-grid";
      heading?: string;
      columns?: 2 | 3;
      items: {
        src: string;
        alt: string;
        title?: string;
        caption: string;
        badge?: string;
        width?: number;
        height?: number;
        kind?: "image" | "pdf";
      }[];
    };

export interface CaseStudyBeat {
  beat: string;
  title: string;
  status: "verified" | "placeholder";
  content: string;
  blocks?: CaseStudyBlock[];
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
  causalStrip?: { step: string; value: string }[];
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
    title: "2.5L+ deduplicated SQLs from live masterclasses",
    hook: "Built a standalone live STEAM show and 7-channel funnel pulling 4L registrations and 15K SQLs per episode.",
    heroMetric: "2.5L+",
    heroMetricLabel: "Deduplicated SQLs",
    job: {
      company: "Byju's",
      role: "Senior Product Manager",
      period: "Jul 2020 – Apr 2023 · Bangalore",
    },
    metrics: [
      { label: "2.5L+ Deduplicated SQLs", scope: "24 EPS" },
      { label: ">7% CTA CVR" },
      { label: "15%+ App Push CTR" },
    ],
    causalStrip: [
      { step: "Before", value: "Home-demo visits & freemium app gates only" },
      { step: "Mechanism", value: "Fortnightly STEAM show + Zoom phone/email gate" },
      { step: "Behavior", value: "4L reg · 40K live · 15%+ app push CTR" },
      { step: "Outcome", value: "2.5L+ deduplicated SQLs across 24 episodes" },
    ],
    beats: [
      {
        beat: "01 // HEADLINE & PROOF",
        title: "2.5L+ unique SQLs over 24 live episodes",
        status: "verified",
        content:
          "Over 24 fortnightly episodes in 10 months (May–Feb), Xcel averaged 4L registrations, 40K live viewers, and 15K gross SQLs per show. Deduplicating repeat attendees across episodes yielded 2.5L+ unique sales-qualified leads.",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Over 24 fortnightly episodes in 10 months (May–Feb), Xcel averaged 4L registrations, 40K live viewers, and 15K gross SQLs per show. Deduplicating repeat attendees across episodes yielded 2.5L+ unique sales-qualified leads.",
            ],
          },
          {
            type: "math",
            heading: "Per-Episode Funnel Math (24 Sessions, May–Feb)",
            lines: [
              {
                key: "Avg Registrations / Episode",
                value: "4,00,000",
                note: "100% · Validated phone + email gate",
              },
              {
                key: "Avg Live Viewership",
                value: "40,000",
                note: "10% attendance · 25K unpaid BTLA + 15K paid",
              },
              {
                key: "Gross SQLs / Episode (MoFu + BoFu)",
                value: "15,000",
                note: "60% of unpaid viewers / 37.5% of live",
              },
              {
                key: "Deduplicated SQLs (24 Episodes)",
                value: "2.5L+",
                note: "ACTUAL · Unique leads across all shows",
                highlight: true,
              },
            ],
          },
        ],
      },
      {
        beat: "02 // BEFORE-STATE & STAKES",
        title: "Acquisition depended on demo pitches",
        status: "verified",
        content:
          "Before Xcel, leads came from home-demo visitors or freemium app usage, leaving no standalone brand format to pull Class 4–10 audiences on its own.",
        blocks: [
          {
            type: "comparison",
            left: {
              badge: "Before Xcel",
              title: "Demo-First Lead Capture",
              points: [
                "Users entered the funnel via quick home-demo visits or freemium app trials.",
                "Every top-of-funnel pitch asked parents for a sales demo upfront.",
                "No standalone property carried the Byju's name on its own merit.",
              ],
            },
            right: {
              badge: "With Xcel",
              title: "Self-Marketable STEAM Show",
              points: [
                "Fortnightly celebrity-led masterclasses gave Class 4–10 students a free hook.",
                "Microsite signup captured validated phone numbers and emails before any sales call.",
                "Live attendance, app overlap, and contests scored intent automatically.",
              ],
            },
          },
        ],
      },
      {
        beat: "03 // WHY IT WAS HARD",
        title: "14-day live cycles with black-box ad metrics",
        status: "verified",
        content:
          "Running a celebrity show every two weeks meant balancing media spend, channel fatigue, and strict usage rights under tight deadlines.",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Running a celebrity show every 14 days meant aligning content, studio production, paid media, and CRM drips before each broadcast.",
            ],
          },
          {
            type: "list",
            heading: "Operational & Channel Constraints",
            items: [
              {
                label: "Opaque PMax reporting",
                text: "Google Performance Max hid CTR, CVR, and ROAS at the asset-group level, forcing rapid 1-week spend-velocity tests instead of slow split runs.",
              },
              {
                label: "Phone spam ceiling",
                text: "SMS and WhatsApp had to be capped around 7L texts per episode (versus 12L emails) to avoid opt-out spikes.",
              },
              {
                label: "6-month guest rights",
                text: "Celebrity collaboration reels, live stories, and behind-the-scenes clips expired under a strict 6-month usage window.",
              },
            ],
          },
        ],
      },
      {
        beat: "04 // REJECTED FIX & TRADE-OFF",
        title: "Why we split the broadcast and CTAs",
        status: "verified",
        content:
          "Streaming everyone on public YouTube with one generic ad CTA would have leaked identity data and underperformed across parents and students.",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Running one broadcast link and one generic CTA across every ad would have dropped identity capture for free users and blurred parent vs. student intent.",
            ],
          },
          {
            type: "table",
            columns: ["Decision", "Naive Option", "Why Rejected", "Shipped Call"],
            rows: [
              [
                "Broadcast Surface",
                "Stream everyone on public YouTube",
                "Zero registration gate or phone/email capture for free prospects",
                "Split surfaces: gated Zoom for free users; unlisted YouTube (made private after) for paid users.",
              ],
              [
                "Ad & Push CTAs",
                "Use one static CTA across creatives",
                "Parents and students responded to different urgency triggers",
                "A/B tested 3 CTAs across 10K+ impressions and routed winners by channel.",
              ],
              [
                "Text Volume",
                "Mirror 12L email volume on SMS/WhatsApp",
                "High spam fatigue and opt-out risk on personal phones",
                "Restricted texts to 7L per show for signup confirmation and session reminders only.",
              ],
            ],
          },
        ],
      },
      {
        beat: "05 // PRODUCT DECISION",
        title: "Three-tier funnel meets 3-Unpack show design",
        status: "verified",
        content:
          "Free users registered once on the microsite, then flowed through ToF, MoF, and BoF scoring while the live show followed an Unpack 1-2-3 arc.",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Free users registered on the microsite with validated phone numbers and email IDs, letting us stitch participation across live Zoom attendance, BTLA app overlap, and blog contests.",
            ],
          },
          {
            type: "funnel",
            heading: "Lead Qualification Funnel (Per Episode Average)",
            stages: [
              {
                stage: "01 // Top of Funnel (ToF)",
                metric: "4L Registrations",
                share: "100%",
                widthPct: 100,
                detail: "Microsite signups with validated phone number and email ID.",
              },
              {
                stage: "02 // Middle of Funnel (MoF)",
                metric: "25K Unpaid Live Viewers",
                share: "6.25% of Reg",
                widthPct: 58,
                detail: "Session viewers cross-referenced against non-premium BTLA app users (plus 15K paid viewers on YouTube).",
              },
              {
                stage: "03 // Bottom of Funnel (BoF)",
                metric: "15K SQLs (MoFu + BoFu)",
                share: "3.75% of Reg",
                widthPct: 34,
                detail: "High-intent leads active across blog contests, post-session quizzes, and follow-up emails.",
              },
            ],
          },
          {
            type: "ab-switcher",
            heading: "CTA A/B Test (PMax · 10,000+ Impressions · ~3,333 / Variant)",
            intro:
              "Identical creative, identical placement. Only the button copy changed—switch tabs to inspect each variant and segment result.",
            variants: [
              {
                id: "register-now",
                label: "Register Now",
                metric: ">7% CVR · Winner",
                audience: "All Demographics",
                image: "/work/xcel/cta-register-now.png",
                width: 1000,
                height: 500,
                note: "Clear overall winner across segments; became the baseline ad CTA alongside \"Register for Free\" in later cycles.",
              },
              {
                id: "join-now",
                label: "Join Now",
                metric: "Push Winner",
                audience: "Students & Live Urgency",
                image: "/work/xcel/cta-join-now.png",
                width: 1000,
                height: 500,
                note: "Strongest pull with younger audiences and live-session urgency; deployed directly into in-app Push Notifications.",
              },
              {
                id: "know-more",
                label: "Know More",
                metric: "Parent Segment",
                audience: "Parents (Ages 35–45)",
                image: "/work/xcel/cta-know-more.png",
                width: 1000,
                height: 500,
                note: "Performed best with older audiences who wanted guest and curriculum context before committing a phone number.",
              },
            ],
          },
          {
            type: "media-grid",
            heading: "Live Show Structure: 3-Unpack Storyboards",
            columns: 2,
            items: [
              {
                src: "/work/xcel/brief-creative-1.png",
                alt: "Flight and aerodynamics 3-Unpack episode storyboard",
                badge: "Aerodynamics",
                caption:
                  "Unpack 1–3 flow mixing live demos, Bernoulli experiments, 3D cockpit visuals, and a DIY paper-plane challenge.",
                width: 679,
                height: 367,
              },
              {
                src: "/work/xcel/brief-creative-2.png",
                alt: "Physics of sound 3-Unpack episode storyboard",
                badge: "Physics of Sound",
                caption:
                  "Structured transitions from water-cup vibrations to wine-glass resonance and DIY rubber-band guitars.",
                width: 1313,
                height: 710,
              },
            ],
          },
        ],
      },
      {
        beat: "06 // EXECUTION & CONSTRAINTS",
        title: "The 14-day sprint and Rockets episode trail",
        status: "verified",
        content:
          "Every fortnightly episode ran on a locked 14-day promotion cadence across Paid Ads, SEO contests, App Push, Social, Email, and post-show Snapshot PDFs.",
        blocks: [
          {
            type: "timeline",
            heading: "Fortnightly Promotion Cadence (Anchored to Session Day T-0)",
            steps: [
              {
                window: "T-20D",
                title: "Brief & Concept Lock",
                detail: "Align content, guest theme, and Unpack 1–2–3 flow across teams.",
              },
              {
                window: "T-15D → T-1D",
                title: "Paid Ads & SEO Contests",
                detail: "Launch PMax + Meta (3 videos, 5 statics) alongside backlinked AMP topic blogs and pre-show contests.",
              },
              {
                window: "T-13D → T-0",
                title: "App Push, Social & Drips",
                detail: "5-step push cadence on 8M BTLA base, Instagram reels, 12L emails, and 7L SMS/WhatsApp reminders.",
              },
              {
                window: "T-0",
                title: "Split Live Broadcast",
                detail: "Paid users on unlisted YouTube; free users on gated Zoom; contest winners announced on air.",
              },
              {
                window: "T+1D → T+5D",
                title: "Highlights & Snapshot PDF",
                detail: "Ship session highlights, DIY experiment shorts, quiz certificates, and The Snapshot guide.",
              },
            ],
          },
          {
            type: "channel-tabs",
            heading: "7-Channel Engine (Click to Inspect Volume & Role)",
            channels: [
              {
                id: "push",
                label: "App Push",
                metric: "15%+ CTR",
                cadence: "8M Grade 4–10 Base",
                summary:
                  "Five timed notifications across Byju's The Learning App drove our highest-efficiency registration and live-join lift.",
                bullets: [
                  "Sequence: Registration → T-2d → T-1d → Starts Soon → Highlights Preview.",
                  "Paired \"Join Now\" urgency copy with live-session entry links.",
                ],
              },
              {
                id: "email",
                label: "Email",
                metric: "12L / Episode",
                cadence: "4-Stage Drip",
                summary:
                  "Rich-text email campaigns carried the storytelling load before and after every show.",
                bullets: [
                  "Promotional announcements, behind-the-scenes sneak peeks, and timed reminders.",
                  "Post-show follow-ups delivered celebrity autographs and The Snapshot PDF.",
                ],
              },
              {
                id: "sms",
                label: "SMS & WhatsApp",
                metric: "7L / Episode",
                cadence: "2-Touch Cap",
                summary:
                  "Kept strictly plain-text and intentionally half the email volume to protect phone opt-outs.",
                bullets: [
                  "Sent only for Registration Complete confirmations and T-0 Session Reminders.",
                ],
              },
              {
                id: "seo",
                label: "SEO & Contests",
                metric: "100s of Entries",
                cadence: "T-15d → T-0",
                summary:
                  "Topic blogs and live-announced contests turned passive readers into higher-scored SQLs.",
                bullets: [
                  "Published AMP-ready topic posts backlinked across blog.byjus.com.",
                  "Free users who submitted contest entries received higher lead scores.",
                ],
              },
              {
                id: "video-social",
                label: "Video & Social",
                metric: "10K+ Views / Vid",
                cadence: "70% IG Audience",
                summary:
                  "Short-form reels, promos, and DIY science breakdowns kept momentum between live dates.",
                bullets: [
                  "Surveys showed 70% of target users active on Instagram, driving collab reels and BTS stories.",
                  "2+ videos per episode: pre-show promo, highlights, plus standalone DIY experiments.",
                ],
              },
            ],
          },
          {
            type: "media-grid",
            heading: "One Episode End-to-End: \"It's Rocket Science!\" (Aug 14 · AgniKul Cosmos)",
            columns: 3,
            items: [
              {
                src: "/work/xcel/email-sample-2.jpg",
                alt: "Byju's Xcel Rocket Science promotional email with Srinath Ravichandran",
                badge: "Promo Email",
                caption: "Email teaser introducing AgniKul Cosmos co-founder Srinath Ravichandran and registration CTA.",
                width: 600,
                height: 1360,
              },
              {
                src: "/work/xcel/social-ig-1.png",
                alt: "Byju's Xcel All About Rockets Instagram Reel cover",
                badge: "Instagram Reel",
                caption: "Social reel built for the 70% student/parent overlap active on Instagram.",
                width: 1963,
                height: 1963,
              },
              {
                src: "/work/xcel/rocket-snapshot.pdf",
                alt: "It's Rocket Science 4-page illustrated Snapshot PDF",
                badge: "Post-Show PDF",
                title: "The Snapshot: Rocket Science (4-Page DIY Guide)",
                caption: "Most requested post-session asset: matchbox rocket experiment plus core physics takeaways.",
                kind: "pdf",
              },
            ],
          },
        ],
      },
      {
        beat: "07 // MEASURED OUTCOME",
        title: "Verified funnel and channel outcomes",
        status: "verified",
        content:
          "Across 24 sessions in 10 months, Xcel generated 2.5L+ deduplicated SQLs, >7% CTA conversion in A/B testing, and 15%+ app push CTR.",
        blocks: [
          {
            type: "list",
            heading: "Production Results Across 24 Sessions (May–Feb)",
            items: [
              {
                label: "2.5L+ Deduplicated SQLs",
                text: "Unique MoFu/BoFu leads passed to sales after deduplicating repeat attendees across 24 shows (15K gross SQLs per episode).",
              },
              {
                label: "4L Registrations → 40K Live Viewers",
                text: "Averaged 10% registration-to-attendance per show (25K unpaid BTLA users + 15K paid users).",
              },
              {
                label: ">7% CTA Conversion",
                text: "\"Register Now\" led the 10,000+ impression PMax CTA experiment (~3,333 impressions per variant).",
              },
              {
                label: "15%+ App Push CTR",
                text: "Five-step notification cadence across 8M grade 4–10 users inside Byju's The Learning App.",
              },
            ],
          },
        ],
      },
      {
        beat: "08 // REFLECTION",
        title: "Keep the rapid tests; wire sales in earlier",
        status: "verified",
        content:
          "Consistent format shifting and A/B testing kept performance sharp across 24 episodes; next time I would embed sales follow-up hooks directly into show planning.",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Two calls stood out. Consistent format shifting and constant A/B testing across CTAs, push timing, and content formats kept engagement from going stale over 24 episodes.",
              "If I ran Xcel again, I'd build tighter ties with the sales team from day one. Embedding their follow-up hooks directly into show planning would realize revenue faster instead of treating handoff as a post-show step.",
            ],
          },
        ],
      },
    ],
    evidenceGaps: [],
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
