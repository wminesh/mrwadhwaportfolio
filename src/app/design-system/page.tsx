import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ActionLink } from "@/components/ui/ActionLink";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { MetricCell } from "@/components/ui/MetricCell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TagPill } from "@/components/ui/TagPill";
import { DESIGN_TOKENS, FLAGSHIP_CASE_STUDIES } from "@/data/portfolio";

export default function DesignSystemPage() {
  const sampleStudy = FLAGSHIP_CASE_STUDIES[0];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-16 border-b border-hairline pb-10">
          <p className="font-mono text-xs tracking-widest text-signal uppercase">
            [STEP 1 // DESIGN SYSTEM SPECIMEN]
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none tracking-wide sm:text-7xl">
            Industrial Editorial & Precision Telemetry
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-lg italic text-ink-secondary">
            Obsidian surfaces, 1px hairline grids, Bebas Neue display headlines,
            Lora editorial asides, and Telemetry Copper metrics.
          </p>
        </div>

        <section className="mb-20">
          <SectionHeader
            index="01"
            label="COLOR SYSTEM"
            title="Obsidian & Telemetry Copper"
            aside="One primary signal color (#FF5C28). Everything else stays neutral."
          />
          <div className="grid grid-cols-1 border-t border-l border-hairline sm:grid-cols-2 lg:grid-cols-4">
            {DESIGN_TOKENS.map((token) => (
              <div
                key={token.token}
                className="border-r border-b border-hairline bg-surface p-5"
              >
                <div
                  className="mb-4 h-16 w-full border border-hairline"
                  style={{ backgroundColor: token.hex }}
                />
                <p className="font-mono text-xs text-ink-primary uppercase">
                  {token.name}
                </p>
                <p className="mt-1 font-mono text-xs text-signal">
                  {token.hex}
                </p>
                <p className="mt-1 font-mono text-[11px] text-ink-muted">
                  {token.token}
                </p>
                <p className="mt-2 text-xs text-ink-secondary">{token.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            index="02"
            label="TYPOGRAPHY"
            title="4-Font Hierarchy"
            aside="Display, editorial serif, UI sans, and tabular monospace."
          />
          <div className="space-y-8 border border-hairline bg-surface p-8">
            <div className="border-b border-hairline pb-6">
              <p className="font-mono text-xs text-ink-muted uppercase">
                Display · Bebas Neue · clamp(3rem, 7vw, 6rem)
              </p>
              <p className="mt-2 font-display text-5xl leading-[0.96] tracking-wide sm:text-6xl">
                Cut ~$10M in annual order cancellations
              </p>
            </div>

            <div className="border-b border-hairline pb-6">
              <p className="font-mono text-xs text-ink-muted uppercase">
                Editorial Serif · Lora Italic · Pull-Quotes & Asides
              </p>
              <p className="mt-2 max-w-2xl font-serif text-xl italic text-ink-primary">
                &ldquo;Right, but wrong. Adding ops headcount wouldn&apos;t fix
                silent checkout failures.&rdquo;
              </p>
            </div>

            <div className="border-b border-hairline pb-6">
              <p className="font-mono text-xs text-ink-muted uppercase">
                Body Sans · Plus Jakarta Sans · 16px / 1.6 measure
              </p>
              <p className="mt-2 max-w-prose text-base leading-relaxed text-ink-secondary">
                Store setup teams fought manual catalog lookups across multiple
                sheets. Replaced them with an AI-driven procurement and catalog
                system that cut cycle times by 20%.
              </p>
            </div>

            <div>
              <p className="font-mono text-xs text-ink-muted uppercase">
                Telemetry · JetBrains Mono · Tabular Figures
              </p>
              <p className="mt-2 font-mono text-2xl tabular-nums text-signal">
                ~$10,000,000 / YR · 99.99% RELIABILITY · -20% CYCLE TIME
              </p>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <SectionHeader
            index="03"
            label="PRIMITIVES"
            title="Actions, Pills & Metric Cells"
          />

          <div className="mb-8 flex flex-wrap items-center gap-4 border border-hairline bg-surface p-6">
            <ActionLink href="#work" variant="primary">
              Primary CTA <ArrowDownRight className="h-4 w-4" />
            </ActionLink>
            <ActionLink href="mailto:w.minesh@gmail.com" variant="secondary">
              Secondary Action <ArrowUpRight className="h-4 w-4" />
            </ActionLink>
            <TagPill variant="signal" scope="PROD">
              -20% Cycle Time
            </TagPill>
            <TagPill variant="default">AI Procurement</TagPill>
            <TagPill variant="muted">Scope Pending</TagPill>
          </div>

          <div className="grid grid-cols-1 border-t border-l border-hairline sm:grid-cols-2">
            <MetricCell
              value="20% faster"
              label="Store-setup procurement cycle at Lowe's"
              scope="PROD"
            />
            <MetricCell
              value="2.5L+ SQLs"
              label="Generated on Byju's Xcel (+35% lead CVR)"
              scope="ACTUAL"
            />
          </div>
        </section>

        <section>
          <SectionHeader
            index="04"
            label="CASE STUDY CARD"
            title="Flagship Card Specimen"
          />
          <div className="grid grid-cols-1 border-t border-l border-hairline md:grid-cols-2">
            <CaseStudyCard study={sampleStudy} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
