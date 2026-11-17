import { type CaseStudy, createPlaceholderBeats } from "./types";

export const tynkerAppRedesignStudy: CaseStudy = {
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
};
