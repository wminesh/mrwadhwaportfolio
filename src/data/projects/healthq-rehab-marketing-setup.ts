import { type CaseStudy, createPlaceholderBeats } from "./types";

export const healthqRehabMarketingSetupStudy: CaseStudy = {
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
};
