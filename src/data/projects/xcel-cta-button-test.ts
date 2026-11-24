import type { CaseStudy } from "./types";

export const xcelCtaButtonTestStudy: CaseStudy = {
  index: "02A",
  slug: "xcel-cta-button-test",
  category: "EdTech & Growth",
  tags: ["EdTech & Growth", "A/B Experiment", "Ad Conversion"],
  eyebrow: "Byju's Xcel · Bounded Experiment · Growth",
  title: "Over 7% ad button conversion by matching copy to intent",
  hook: "Isolated button copy across 10,000+ ad impressions to replace one generic prompt with segment-matched registration labels.",
  heroMetric: ">7%",
  heroMetricLabel: "Button conversion",
  job: {
    company: "Byju's",
    role: "Senior Product Manager",
    period: "Jul 2020 – Apr 2023 · Bangalore",
  },
  metrics: [
    { label: "Over 7% Conversion", scope: "Register Now" },
    { label: "10,000+ Impressions", scope: "~3,333 / variant" },
    { label: "3 Variants Tested", scope: "Identical creative" },
  ],
  beats: [
    {
      beat: "01 // BEFORE-STATE & STAKES",
      title: "One static button blurred parent and student intent",
      status: "verified",
      content:
        "Before this test, every Xcel promotion used a single generic button across paid ads and in-app alerts, masking why older parents hesitated while students clicked late.",
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Byju's Xcel promoted fortnightly live sessions across paid social ads and in-app alerts. Using one static button label across every placement treated parents evaluating a new show the same as students clicking a live-start alert.",
            "Testable assumptions: (1) Changing only the button label on identical artwork would shift click-to-registration conversion without touching media targeting. (2) Parents aged 35–45 needed low-commitment discovery copy before sharing a phone number, whereas general ad traffic responded to explicit registration.",
            "Success threshold: Identify a clear winning label above the prior campaign button rate across at least 10,000 total impressions.",
          ],
        },
      ],
    },
    {
      beat: "02 // REJECTED FIX & TRADE-OFF",
      title: "Why we isolated button copy on identical artwork",
      status: "verified",
      content:
        "Testing new headlines, guest photos, and button labels together would have hidden which lever actually moved conversion.",
      blocks: [
        {
          type: "table",
          columns: ["Option", "Why Rejected", "Shipped Call"],
          rows: [
            [
              "Keep one static CTA across channels",
              "Missed urgency differences between ad discovery and live app alerts",
              "Ran a controlled three-way split across 10,000+ impressions (~3,333 per variant).",
            ],
            [
              "Redesign full ad creative per segment",
              "Confounded copy impact with visual layout changes inside a 14-day sprint",
              "Froze artwork and placement; changed only the button text.",
            ],
          ],
        },
      ],
    },
    {
      beat: "03 // EXPERIMENT ARTIFACT",
      title: "Three variants on identical creative",
      status: "verified",
      content:
        "Switch tabs below to inspect the three tested button labels, target segments, and standalone ad screenshots.",
      blocks: [
        {
          type: "ab-switcher",
          heading: "Button Copy Test (10,000+ Ad Impressions, ~3,333 Per Variant)",
          intro:
            "Identical artwork, identical placement. Only the button copy changed.",
          variants: [
            {
              id: "register-now",
              label: "Register Now",
              metric: "Over 7% Conversion (Winner)",
              audience: "All Demographics",
              image: "/work/xcel/cta-register-now.png",
              width: 1000,
              height: 500,
              note: "Clear overall winner across segments. Became the default ad button alongside \"Register for Free\" in later cycles.",
            },
            {
              id: "join-now",
              label: "Join Now",
              metric: "App Alert Winner",
              audience: "Students & Live Urgency",
              image: "/work/xcel/cta-join-now.png",
              width: 1000,
              height: 500,
              note: "Strongest pull with younger audiences right before broadcast; wired directly into in-app notifications.",
            },
            {
              id: "know-more",
              label: "Know More",
              metric: "Parent Segment",
              audience: "Parents (Ages 35–45)",
              image: "/work/xcel/cta-know-more.png",
              width: 1000,
              height: 500,
              note: "Performed best with older audiences who wanted guest and topic details before sharing a phone number.",
            },
          ],
        },
      ],
    },
    {
      beat: "04 // MEASURED OUTCOME",
      title: "Over 7% conversion and channel-specific defaults",
      status: "verified",
      content:
        "Register Now won overall across demographics at over 7% conversion, while Join Now and Know More earned dedicated placements.",
      blocks: [
        {
          type: "comparison",
          left: {
            badge: "Before Test",
            title: "One Generic Prompt",
            points: [
              "Single static button used across paid ads and app alerts.",
              "No separation between live-session urgency and parent discovery.",
            ],
          },
          right: {
            badge: "After Test",
            title: "Intent-Matched Buttons",
            points: [
              "\"Register Now\" cleared 7% conversion overall and became the paid ad default.",
              "\"Join Now\" powered live-start in-app alerts; \"Know More\" targeted parent discovery.",
            ],
          },
        },
      ],
    },
    {
      beat: "05 // REFLECTION & NEXT STEPS",
      title: "Shortcomings and follow-up roadmap",
      status: "verified",
      content:
        "Isolating copy gave fast directional signal, but left statistical intervals and downstream registration completion unlogged.",
      blocks: [
        {
          type: "list",
          heading: "Two Real Shortcomings",
          items: [
            {
              label: "Missing pre-test baseline and per-variant rates",
              text: "At ~3,333 impressions per arm, only the >7% winner threshold was retained in project records. Without the exact pre-test CTR and conversion rates for \"Join Now\" and \"Know More\", relative lift cannot be audited.",
            },
            {
              label: "14-day creative maintenance overhead",
              text: "Splitting winning labels by channel required maintaining separate ad and alert exports every two weeks, trading production simplicity for channel fit.",
            },
          ],
        },
        {
          type: "list",
          ordered: true,
          heading: "Prioritized Follow-Up Roadmap",
          items: [
            {
              label: "P1 — Track click-to-verified-registration by variant",
              text: "Measure whether \"Know More\" clicks converted into verified phone numbers at the same rate as \"Register Now\" instead of optimizing for clicks alone.",
            },
            {
              label: "P2 — Test \"Register for Free\" against \"Register Now\"",
              text: "Validate whether explicit free framing lowers parent hesitation on cold Meta placements.",
            },
          ],
        },
      ],
    },
  ],
  evidenceGaps: [
    "Pre-test baseline button conversion rate before the 3-variant split",
    "Exact impression counts, click counts, and conversion rates for \"Join Now\" and \"Know More\"",
    "Exact campaign dates and platform split for the 10,000+ impression test",
  ],
};
