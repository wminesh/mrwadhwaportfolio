import type { CaseStudy } from "./types";

export const xcelMasterclassesStudy: CaseStudy = {
  index: "02",
  slug: "xcel-masterclasses",
  category: "EdTech & Growth",
  tags: ["EdTech & Growth", "Live Funnel", "Lead Qualification"],
  eyebrow: "Byju's · Senior Product Manager · 2020–2023",
  title: "250,000+ qualified leads from gated live masterclasses",
  hook: "Replaced cold home-demo requests with a gated fortnightly live show, passing 15,000 sales-qualified leads per episode to sales.",
  heroMetric: "250,000+",
  heroMetricLabel: "Unique sales-qualified leads",
  job: {
    company: "Byju's",
    role: "Senior Product Manager",
    period: "Jul 2020 – Apr 2023 · Bangalore",
  },
  metrics: [
    { label: "250,000+ Unique SQLs", scope: "24 sessions · 10 mos" },
    { label: "15,000 SQLs / Episode", scope: "Deduplicated" },
    { label: "10% Live Attendance", scope: "400K → 40K / show" },
  ],
  beats: [
    {
      beat: "01 // BEFORE-STATE & STAKES",
      title: "Cold home-demo ads asked for trust too early",
      status: "verified",
      content:
        "Before Xcel, parents of classes 4–10 students hit cold home-demo requests or unguided free app trials before Byju's had earned their attention.",
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Parents of students in classes 4–10 saw top-of-funnel ads asking for an in-home sales demo upfront, or entered free app trials with no mid-funnel intent signal. Cold demo requests drove high drop-off and wasted field-sales capacity, while free app sign-ups left sales guessing who was ready to buy.",
            "Market context: India's EdTech sector hovered around US$7.5 billion in 2022–2023, with K–12 holding roughly 43% share (India Brand Equity Foundation). As EdTech venture funding fell from US$2.1 billion in 2022 to US$207 million in 2023, K–12 teams had to replace high-cost cold demo acquisition with lower-cost, higher-intent lead funnels.",
            "Target success metric: Generate at least 10,000 deduplicated sales-qualified leads (parents meeting sales-readiness criteria) per episode at a lower cost per lead than cold home-demo campaigns.",
          ],
        },
        {
          type: "list",
          heading: "Testable Assumptions Made Upfront",
          items: [
            {
              label: "Value-before-sales gate",
              text: "Parents would share a verified phone number and email for a free, celebrity-led live session before taking a sales call.",
            },
            {
              label: "Behavioral intent scoring",
              text: "Combining live attendance, free-app overlap, and contest activity would signal stronger buying intent than cold demo-form fills.",
            },
            {
              label: "Fortnightly habit cadence",
              text: "A two-week broadcast rhythm could sustain 400,000 registrations per show without exhausting production capacity or phone-channel tolerance.",
            },
          ],
        },
      ],
    },
    {
      beat: "02 // WHY IT WAS HARD",
      title: "14-day live cycles with black-box ad data",
      status: "verified",
      content:
        "Producing a live show every two weeks meant balancing media spend, parent phone fatigue, and strict guest usage rights under fixed broadcast dates.",
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Every two weeks, studio production, guest prep, paid media, and reminder campaigns had to land on the same broadcast date. Three operational constraints shaped the funnel.",
          ],
        },
        {
          type: "list",
          heading: "Production & Channel Constraints",
          items: [
            {
              label: "Hidden ad-group reporting",
              text: "Google's automated multi-channel ad campaigns (Performance Max) hid click-through rate, conversion rate, and return on ad spend at the creative level, forcing weekly spend-velocity checks instead of slow split runs.",
            },
            {
              label: "Phone fatigue ceiling",
              text: "Text messages and WhatsApp sends were capped at 700,000 per episode, half the 1.2 million email volume, so parents would not opt out.",
            },
            {
              label: "Six-month guest rights",
              text: "Celebrity collaboration reels, live stories, and behind-the-scenes clips expired after a strict six-month contract window.",
            },
          ],
        },
      ],
    },
    {
      beat: "03 // REJECTED FIX & TRADE-OFF",
      title: "Why we gated Zoom and capped phone reminders",
      status: "verified",
      content:
        "Streaming everyone on public YouTube or blasting 1.2 million phone texts would have lost parent contact data and burned channel trust.",
      blocks: [
        {
          type: "table",
          columns: ["Decision", "Naive Option", "Why Rejected", "Shipped Call"],
          rows: [
            [
              "Broadcast Surface",
              "Stream everyone on public YouTube",
              "No registration gate or verified phone capture for unpaid prospects",
              "Split surfaces: gated Zoom for free prospects; unlisted YouTube (made private after) for paid users.",
            ],
            [
              "Messaging Volume",
              "Match the 1.2 million email send on phone texts",
              "High spam fatigue and opt-out risk on parents' personal phones",
              "Restricted SMS and WhatsApp to 700,000 sends per show for confirmations and same-day reminders.",
            ],
            [
              "Qualification Gate",
              "Book a home demo directly on ad click",
              "Asked for a sales visit before parents saw value in the product",
              "Required microsite sign-up first, then scored live attendance and contest engagement for sales handoff.",
            ],
          ],
        },
      ],
    },
    {
      beat: "04 // PRODUCT DECISION",
      title: "Three-stage parent identity and qualification funnel",
      status: "verified",
      content:
        "Unpaid prospects registered once on the microsite with a verified phone number, then moved through live attendance and engagement scoring before sales handoff.",
      blocks: [
        {
          type: "prose",
          paragraphs: [
            "Parents registered on the Xcel microsite with a verified phone number and email address. That single identity linked Zoom live attendance, Byju's The Learning App usage overlap, and post-show contest or quiz activity into one qualification score.",
          ],
        },
        {
          type: "funnel",
          heading: "Lead Qualification Funnel (Per-Episode Average Across 24 Sessions)",
          stages: [
            {
              stage: "Top of Funnel",
              metric: "400,000 Registrations",
              share: "100%",
              widthPct: 100,
              detail: "Microsite sign-ups with a verified phone number and email address.",
            },
            {
              stage: "Middle of Funnel",
              metric: "25,000 Free Live Viewers",
              share: "6.25% of registrations",
              widthPct: 58,
              detail: "Free viewers on gated Zoom matched against unpaid app users (alongside 15,000 paid users on unlisted YouTube).",
            },
            {
              stage: "Bottom of Funnel",
              metric: "15,000 Qualified Leads",
              share: "3.75% of registrations",
              widthPct: 34,
              detail: "High-intent parents and households active across blog contests, post-show quizzes, and follow-up emails.",
            },
          ],
        },
      ],
    },
    {
      beat: "05 // CHAPTER: BROADCAST GATE",
      title: "Chapter: Split Zoom vs. unlisted YouTube broadcast gate",
      status: "verified",
      content:
        "Sending unpaid prospects to gated Zoom and paid users to unlisted YouTube preserved phone capture for free leads without adding login friction for subscribers.",
      blocks: [
        {
          type: "comparison",
          left: {
            badge: "Free Prospects (Zoom)",
            title: "Gated Identity & Attendance",
            points: [
              "Required microsite registration with a verified phone number and email before receiving the Zoom link.",
              "Matched 25,000 live Zoom attendees per episode against unpaid app accounts to score buying intent.",
            ],
          },
          right: {
            badge: "Paid Users (YouTube)",
            title: "Low-Friction Subscriber Stream",
            points: [
              "Distributed an unlisted YouTube link inside subscriber channels so existing customers joined in one click.",
              "Switched the stream to private after broadcast to protect guest rights and keep 15,000 paid viewers engaged live.",
            ],
          },
        },
      ],
    },
    {
      beat: "06 // EXECUTION: 14-DAY SPRINT",
      title: "The 14-day sprint and supporting channels",
      status: "verified",
      content:
        "Each episode ran on a locked two-week calendar across paid media, email, blogs, and social video, with SMS and WhatsApp capped at 700,000 sends.",
      blocks: [
        {
          type: "timeline",
          heading: "Fortnightly Promotion Calendar (Anchored to Show Day)",
          steps: [
            {
              window: "20 days before",
              title: "Brief & Concept Lock",
              detail: "Lock guest theme and episode outline across content and growth teams.",
            },
            {
              window: "15 to 1 day before",
              title: "Paid Ads & Search Blogs",
              detail: "Launch Google and Meta campaigns (three videos, five static ads) alongside topic articles and pre-show contests.",
            },
            {
              window: "13 days before to live",
              title: "Social & Reminders",
              detail: "Instagram reels, 1.2 million emails, and 700,000 text reminders.",
            },
            {
              window: "Show day",
              title: "Split Live Broadcast",
              detail: "Paid users on unlisted YouTube; free prospects on gated Zoom; contest winners named live on air.",
            },
            {
              window: "1 to 5 days after",
              title: "Highlights & Quiz Follow-Up",
              detail: "Ship session highlights, at-home experiment shorts, and quiz certificates.",
            },
          ],
        },
        {
          type: "channel-tabs",
          heading: "Supporting Promotion Channels (Phone Texts Capped at 700K/Episode)",
          channels: [
            {
              id: "email",
              label: "Email",
              metric: "1.2 Million / Episode",
              cadence: "Four-Stage Sequence",
              summary:
                "Rich email campaigns carried the storytelling load before and after every broadcast, while SMS and WhatsApp were folded to a strict 700,000-send cap for confirmations and same-day reminders only.",
              bullets: [
                "Show announcements and behind-the-scenes previews built anticipation ahead of broadcast.",
                "Post-show emails delivered guest autographs and session follow-ups.",
              ],
            },
            {
              id: "seo",
              label: "Blogs & Contests",
              metric: "Hundreds of Entries",
              cadence: "15 Days Before to Live",
              summary:
                "Topic articles on the Byju's blog and live-announced contests turned casual readers into higher-intent leads.",
              bullets: [
                "Published fast mobile topic articles linked across the main blog before each show.",
                "Free prospects who submitted contest entries earned higher lead scores ahead of sales follow-up.",
              ],
            },
            {
              id: "video-social",
              label: "Video & Social",
              metric: "10,000+ Views / Video",
              cadence: "70% Instagram Audience",
              summary:
                "Short clips, show trailers, and at-home science experiments kept momentum warm between live dates.",
              bullets: [
                "Internal user surveys reported 70% of target users active on Instagram, guiding guest collaboration reels and studio stories.",
                "Two or more videos per episode: pre-show promo, highlights, plus hands-on science experiments.",
              ],
            },
          ],
        },
        {
          type: "media-grid",
          heading: "One Episode in Full: \"It's Rocket Science!\" with AgniKul Cosmos",
          columns: 2,
          items: [
            {
              src: "/work/xcel/email-sample-2.jpg",
              alt: "Byju's Xcel Rocket Science promotional email with Srinath Ravichandran",
              badge: "Promo Email",
              caption: "Email teaser introducing AgniKul Cosmos co-founder Srinath Ravichandran with a direct sign-up button.",
              width: 600,
              height: 1360,
            },
            {
              src: "/work/xcel/social-ig-1.png",
              alt: "Byju's Xcel All About Rockets Instagram Reel cover",
              badge: "Instagram Reel",
              caption: "Social reel built for Instagram-active families ahead of broadcast.",
              width: 1963,
              height: 1963,
            },
          ],
        },
      ],
    },
    {
      beat: "07 // MEASURED OUTCOME",
      title: "250,000+ unique qualified leads across 24 sessions",
      status: "verified",
      content:
        "Over a 10-month run (May–February), Xcel shifted Byju's from cold demo-first capture to a 250,000+ deduplicated SQL funnel.",
      blocks: [
        {
          type: "comparison",
          left: {
            badge: "Before Xcel",
            title: "Cold Demo-First Capture",
            points: [
              "Top-of-funnel ads pushed home-demo visits before earning parent interest.",
              "Free app sign-ups lacked a structured mid-funnel intent signal.",
              "Sales teams called cold prospects without live-attendance or contest intent signals.",
            ],
          },
          right: {
            badge: "After Xcel (24 Shows)",
            title: "Gated Live Show Funnel",
            points: [
              "250,000+ unique sales-qualified leads passed to sales after deduplicating repeat attendees.",
              "10% registration-to-live attendance (40,000 viewers per show: 25,000 free on Zoom, 15,000 paid on YouTube).",
              "15,000 deduplicated SQLs generated per episode against a 10,000+ target.",
            ],
          },
        },
        {
          type: "math",
          heading: "Deduplication & Target Check (24 Sessions, May–February)",
          lines: [
            {
              key: "Upfront target per episode",
              value: "10,000+ SQLs",
            },
            {
              key: "Actual qualified leads per episode",
              value: "15,000 SQLs",
            },
            {
              key: "Gross SQLs across 24 episodes (15,000 × 24)",
              value: "360,000",
            },
            {
              key: "Unique sales-qualified leads after repeat-attendee deduplication",
              value: "250,000+",
              highlight: true,
            },
          ],
        },
      ],
    },
    {
      beat: "08 // REFLECTION & ROADMAP",
      title: "Two costly gaps and what comes next",
      status: "verified",
      content:
        "High registration volume masked a 93.75% drop-off before live broadcast, and post-show sales handoff left downstream revenue conversion unmeasured.",
      blocks: [
        {
          type: "list",
          heading: "Two Real Shortcomings",
          items: [
            {
              label: "93.75% registration-to-free-attendance drop-off",
              text: "Out of 400,000 registrations per episode, only 25,000 free prospects showed up live on Zoom. Frictionless one-tap registration inflated top-of-funnel volume without calendar commitment, forcing the 700,000-message SMS/WhatsApp cap to carry attendance recovery.",
            },
            {
              label: "Delayed post-show sales handoff and missing revenue attribution",
              text: "Treating sales handoff as a post-broadcast export instead of embedding demo-booking hooks inside the show and post-show quiz slowed speed-to-lead and left SQL-to-revenue conversion unmeasured in product analytics.",
            },
          ],
        },
        {
          type: "list",
          ordered: true,
          heading: "Prioritized Follow-Up Roadmap",
          items: [
            {
              label: "P1 — Calendar-sync and 1-click reminder opt-in at registration",
              text: "Attacks the 93.75% registration-to-attendance drop-off first because lifting show-up rate on existing registrations requires zero extra media spend and respects the 700K SMS cap.",
            },
            {
              label: "P2 — In-show and post-show warm-handoff triggers",
              text: "Places instant callback or demo-slot selection inside live and post-show quiz flows while parent intent peaks, unlocking closed-loop SQL-to-revenue attribution.",
            },
            {
              label: "P3 — Evergreen replay funnel for expired 6-month guest assets",
              text: "Re-cuts non-celebrity experiment clips into on-demand lead magnets after guest rights expire, unlocking year-round acquisition beyond live broadcast dates.",
            },
          ],
        },
      ],
    },
  ],
  evidenceGaps: [
    "Exact calendar years for the 10-month May–February run (e.g., May 2022 – Feb 2023)",
    "Pre-Xcel home-demo booking rate, cost per lead (CPL), and baseline monthly SQL volume",
    "Sample size, date, and question wording for the internal 70% Instagram user survey",
    "Downstream SQL-to-demo-booked and SQL-to-paid-enrollment conversion rates after sales handoff",
  ],
};
