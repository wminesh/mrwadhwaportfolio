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
      type: "lifecycle";
      heading?: string;
      intro?: string;
      stages: {
        id: string;
        step: string;
        title: string;
        goal: string;
        capabilities: string[];
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
    }
  | {
      type: "link-card";
      badge?: string;
      title: string;
      summary: string;
      href: string;
      ctaLabel?: string;
    };

export interface CaseStudyBeat {
  beat: string;
  title: string;
  status: "verified" | "placeholder";
  content: string;
  tldr?: string;
  blocks?: CaseStudyBlock[];
}

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
  href?: string;
  category: CaseStudyCategory;
  tags: string[];
  eyebrow: string;
  title: string;
  hook: string;
  heroMetric: string;
  heroMetricLabel: string;
  job: CaseStudyJob;
  metrics: { label: string; scope?: string }[];
  overview?: { label?: string; text: string };
  beats: CaseStudyBeat[];
  evidenceGaps: string[];
}

export const createPlaceholderBeats = (
  headlineSummary: string
): CaseStudyBeat[] => [
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
