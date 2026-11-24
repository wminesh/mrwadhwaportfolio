import { type CaseStudy, createPlaceholderBeats } from "./types";

export const aiProcurementCatalogStudy: CaseStudy = {
  index: "01",
  slug: "ai-procurement-catalog",
  category: "Enterprise Ops",
  tags: ["Enterprise Ops", "AI Catalog", "Store Setup"],
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
};
