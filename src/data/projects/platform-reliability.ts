import type { CaseStudy } from "./types";

export const platformReliabilityStudy: CaseStudy = {
  index: "04",
  slug: "platform-reliability",
  category: "Enterprise Ops",
  eyebrow: "Lowe's India · Senior Product Manager · 2024–Present",
  title: "About $10 million saved a year at 99.99% reliability",
  hook: "Unified six reliability stages into one ecosystem, cutting order cancellations while holding enterprise platforms at 99.99% reliability.",
  heroMetric: "~$10M",
  heroMetricLabel: "Saved per year · 99.99%",
  job: {
    company: "Lowe's India",
    role: "Senior Product Manager",
    period: "Sep 2024 – Present · Bangalore",
  },
  showHeaderMetrics: false,
  metrics: [
    { label: "About $10 Million Saved", scope: "Annual" },
    { label: "99.99% Platform Reliability" },
    { label: "Six-Stage Lifecycle Ecosystem" },
  ],
  overview: {
    label: "In Brief",
    text: "Engineering teams managed reliability through separate tools, leaving repeated incidents unresolved and leadership blind to platform health. We unified onboarding, protection, detection, recovery, learning, and automation into one system, cutting order cancellations by about $10 million annually while holding 99.99% reliability.",
  },
  beats: [
    {
      beat: "01 // HEADLINE & PROOF",
      title: "About $10 million saved annually at 99.99% reliability",
      status: "verified",
      content:
        "By connecting automated recovery, standardized incident triage, and reliability tracking across engineering and operations teams, enterprise platforms maintained 99.99% reliability while reduced order cancellations saved about $10 million annually.",
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Automated order recovery and standardized incident handling cut order cancellations across enterprise systems, saving an estimated $10 million annually across revenue protection and operations while holding platform reliability at 99.99%.",
            "On the product side, the work centered on replacing disconnected team tools with a shared reliability scorecard, operational dashboards, and a capacity-backed prioritization loop.",
          ],
        },
        {
          type: "math",
          heading: "Reported Impact (September 2024 to Present)",
          lines: [
            {
              key: "Enterprise platform reliability maintained",
              value: "99.99%",
            },
            {
              key: "Estimated annual savings from reduced order cancellations",
              value: "About $10 million",
              highlight: true,
            },
          ],
        },
      ],
    },
    {
      beat: "02 // BEFORE-STATE & STAKES",
      title: "Fragmented tools hid recurring failures",
      status: "verified",
      content:
        "Connected enterprise applications followed different operational habits across separate tools, allowing repeated incidents to linger without a shared leadership view.",
      blocks: [
        {
          type: "comparison",
          left: {
            badge: "Before",
            title: "Fragmented Team Practices",
            points: [
              "Individual applications ran different operational routines across disconnected reliability tools.",
              "Repeated outages stalled during investigation because root-cause findings rarely converted into lasting fixes.",
              "Leadership lacked a consolidated view of application health to guide investment and risk priorities.",
            ],
          },
          right: {
            badge: "After",
            title: "One Connected Ecosystem",
            points: [
              "Shared application onboarding and monitoring standards created consistent coverage across systems.",
              "Standardized triage paired with automated recovery resolved order failures before cancellations mounted.",
              "Scorecards, corrective action trackers, and escalation paths closed the loop after every incident.",
            ],
          },
        },
      ],
    },
    {
      beat: "03 // WHY IT WAS HARD",
      title: "Competing priorities without shared health signals",
      status: "verified",
      content:
        "Teams balanced active feature backlogs against reliability debt without a single metric framework tying incident patterns to business risk.",
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Application teams already had tight delivery commitments and distinct tool stacks. Asking everyone to adopt another disconnected dashboard or pause roadmaps without clear prioritization rules would fail on arrival.",
            "We grounded roadmap calls in four shared inputs so reliability work competed fairly against feature work.",
          ],
        },
        {
          type: "list",
          heading: "Four Signals Used to Set Priorities",
          items: [
            {
              label: "Reliability metrics",
              text: "Mean time to resolution, service availability, latency, and error budgets pinpointed where system degradation hurt most.",
            },
            {
              label: "Incident patterns",
              text: "Recurring outages and root-cause analyses separated isolated bugs from systemic architecture gaps.",
            },
            {
              label: "Leadership risk tolerance",
              text: "Executive reliability goals defined which critical customer and order flows warranted immediate hardening.",
            },
            {
              label: "Engineering capacity",
              text: "Team bandwidth, existing commitments, and cross-service dependencies determined realistic quarterly sequencing.",
            },
          ],
        },
      ],
    },
    {
      beat: "04 // REJECTED FIX & TRADE-OFF",
      title: "Connect the lifecycle instead of adding point tools",
      status: "verified",
      content:
        "Building isolated monitoring widgets or stopping at post-incident write-ups left systemic failures intact; every capability had to connect across the lifecycle.",
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Shipping more standalone tools would only give engineers another tab to ignore. Every capability had to earn its place by feeding a concrete handoff from detection through permanent resolution.",
          ],
        },
        {
          type: "table",
          columns: ["Decision", "Narrow Option", "Why Rejected", "Ecosystem Call"],
          rows: [
            [
              "Tooling scope",
              "Ship point solutions for separate gaps",
              "Left teams maintaining fragmented practices with no shared view of health",
              "Organize all capabilities under one six-stage lifecycle from onboarding to automation.",
            ],
            [
              "Prioritization",
              "Treat every reliability ticket equally",
              "Engineering capacity and cross-system dependencies blocked unranked backlogs",
              "Sequence quarters continuously using error budgets, incident recurrence, and team capacity.",
            ],
            [
              "Post-incident follow-up",
              "Stop after root-cause documentation",
              "Same failures recurred when corrective tasks lacked owners or deadlines",
              "Wire triage into a tracked corrective action log, criticality matrix, and escalation workflow.",
            ],
          ],
        },
      ],
    },
    {
      beat: "05 // PRODUCT DECISION",
      title: "Six lifecycle stages from onboarding to self-healing",
      status: "verified",
      content:
        "Structured the reliability product ecosystem across six connected stages: foundation onboarding, resilience protection, early detection, incident recovery, continuous learning, and workflow automation.",
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Instead of treating onboarding, alerting, chaos tests, and incident queues as unrelated utilities, we mapped them to six consecutive stages of an application's reliability lifecycle.",
          ],
        },
        {
          type: "lifecycle",
          heading: "Six-Stage Reliability Ecosystem (Select a Stage to Inspect)",
          stages: [
            {
              id: "foundation",
              step: "01",
              title: "Foundation",
              goal: "Establish consistent application onboarding, monitoring setup, and enterprise-wide visibility before incidents occur.",
              capabilities: [
                "Site Reliability Engineering led application onboarding workflows",
                "Standard monitoring setup and instrumentation practices",
                "Coverage tracking across enterprise applications",
              ],
            },
            {
              id: "protect",
              step: "02",
              title: "Protect",
              goal: "Grade application resilience proactively and catch structural weaknesses before production traffic exposes them.",
              capabilities: [
                "Consolidated application reliability scorecard",
                "Chaos testing tool for controlled failure checks",
                "Risk tracker and recommendation tracker",
              ],
            },
            {
              id: "detect",
              step: "03",
              title: "Detect",
              goal: "Surface anomalies and system degradation early enough to act before customers hit broken flows.",
              capabilities: [
                "Automated anomaly detectors across core signals",
                "Observability assistants to speed up initial diagnosis",
              ],
            },
            {
              id: "recover",
              step: "04",
              title: "Recover",
              goal: "Resolve active outages through structured triage and automated recovery so order flows stay intact.",
              capabilities: [
                "Incident management tool and standardized triage flow",
                "Automated order recovery workflows to cut cancellations",
              ],
            },
            {
              id: "learn",
              step: "05",
              title: "Learn",
              goal: "Turn root-cause analyses into permanent fixes instead of repeating the same post-mortems.",
              capabilities: [
                "Corrective action tracker tied to incident reviews",
                "Escalation workflows for overdue remediation items",
                "Criticality matrices to rank engineering follow-through",
              ],
            },
            {
              id: "automate",
              step: "06",
              title: "Automate",
              goal: "Replace repetitive operational checks and manual recovery steps with dependable automation.",
              capabilities: [
                "Workflow automation for recurring operational tasks",
                "Self-healing recovery routines where practical",
              ],
            },
          ],
        },
      ],
    },
    {
      beat: "06 // EXECUTION & CONSTRAINTS",
      title: "Continuous planning and operational visibility",
      status: "verified",
      content:
        "Paired quarterly roadmap sequencing with shared operational dashboards tracking workflow efficiency, product adoption, and platform performance.",
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Quarterly planning across engineering and operations ran on a five-step feedback loop, backed by shared performance dashboards so leadership and delivery teams worked from the same numbers.",
          ],
        },
        {
          type: "timeline",
          heading: "Five-Step Prioritization Loop",
          steps: [
            {
              window: "Step 01",
              title: "Spot systemic gaps",
              detail: "Review mean time to resolution, latency, error budgets, and recurring incident patterns.",
            },
            {
              window: "Step 02",
              title: "Weigh business risk",
              detail: "Evaluate opportunities against leadership risk tolerance and order-flow impact.",
            },
            {
              window: "Step 03",
              title: "Audit capacity",
              detail: "Map engineering bandwidth, active commitments, and service dependencies.",
            },
            {
              window: "Step 04",
              title: "Sequence delivery",
              detail: "Lock quarterly execution plans and monitor rollout through adoption and workflow dashboards.",
            },
            {
              window: "Step 05",
              title: "Revisit as signals shift",
              detail: "Re-score roadmap priorities whenever new incident patterns or constraints emerge.",
            },
          ],
        },
      ],
    },
    {
      beat: "07 // MEASURED OUTCOME",
      title: "Reliability held at 99.99% while order leaks dropped",
      status: "verified",
      content:
        "Maintained 99.99% enterprise platform reliability and saved an estimated $10 million annually in reduced order cancellations through automated recovery and incident handling.",
      blocks: [
        {
          type: "list",
          heading: "Verified Role Outcomes (September 2024 to Present)",
          items: [
            {
              label: "About $10 million saved annually",
              text: "Lowered order cancellations across revenue protection and operations efficiency through automated recovery and structured incident handling.",
            },
            {
              label: "99.99% platform reliability",
              text: "Maintained high availability across enterprise platforms alongside automated workflows and delivery systems.",
            },
            {
              label: "Shared visibility and prioritization",
              text: "Delivered performance measurement frameworks and operational dashboards tracking workflow efficiency, product adoption, and platform health.",
            },
          ],
        },
        {
          type: "prose",
          paragraphs: [
            "Note on evidence scope: the $10 million annual figure and 99.99% availability reflect overall role-level outcomes. Specific pre- and post-launch cancellation rates, mean time to resolution changes, and the revenue-versus-cost split are flagged below to confirm before final publish.",
          ],
        },
      ],
    },
    {
      beat: "08 // REFLECTION",
      title: "Connect detection to follow-through",
      status: "verified",
      content:
        "Linking reliability signals to structured action tracking mattered more than shipping standalone monitoring views.",
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Reliability programs stall when detection and dashboards outpace ownership. Wiring incident patterns directly into criticality matrices, action trackers, and engineering capacity planning kept teams fixing root causes rather than fighting the same outage twice.",
          ],
        },
      ],
    },
  ],
  evidenceGaps: [
    "Baseline order cancellation rate and order volume before automated recovery",
    "Specific automated recovery trigger, fallback rules, and one concrete outage example",
    "Split between revenue protection and operational cost savings inside the $10 million annual estimate",
    "Before-and-after metrics for mean time to resolution or scorecard adoption",
    "Personal reflection on what you would change if building the ecosystem again",
  ],
};
