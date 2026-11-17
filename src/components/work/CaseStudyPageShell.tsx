import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TagPill } from "@/components/ui/TagPill";
import { CaseStudySpineClient } from "@/components/work/CaseStudySpineClient";
import { type CaseStudy, getAdjacentCaseStudies } from "@/data/projects";

interface CaseStudyPageShellProps {
  study: CaseStudy;
  children?: ReactNode;
}

export function CaseStudyPageShell({
  study,
  children,
}: CaseStudyPageShellProps) {
  const { prevStudy, nextStudy } = getAdjacentCaseStudies(study.slug);

  return (
    <div className="min-h-screen bg-canvas text-ink-primary">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-ink-secondary uppercase transition-colors hover:text-signal"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Selected Work
        </Link>

        <header className="mt-8 border-b border-hairline pb-10">
          <p className="font-mono text-xs tracking-widest text-signal uppercase">
            [{study.index}] · {study.category} · {study.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.96] tracking-wide sm:text-7xl">
            {study.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-secondary">
            {study.hook}
          </p>
          {study.showHeaderMetrics !== false && study.metrics.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {study.metrics.map((metric, idx) => (
                <TagPill
                  key={metric.label}
                  variant={idx === 0 ? "signal" : "default"}
                  scope={metric.scope}
                >
                  {metric.label}
                </TagPill>
              ))}
            </div>
          ) : null}
        </header>

        {study.overview ? (
          <section
            aria-label="Project overview"
            className="border-b border-hairline bg-surface/70 px-6 py-6"
          >
            {study.overview.label ? (
              <p className="font-mono text-[11px] tracking-widest text-signal uppercase">
                {study.overview.label}
              </p>
            ) : null}
            <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-primary">
              {study.overview.text}
            </p>
          </section>
        ) : null}

        {children ?? <CaseStudySpineClient beats={study.beats} />}

        {study.evidenceGaps.length > 0 ? (
          <aside className="mt-12 border border-signal/35 bg-signal/5 p-7">
            <p className="font-mono text-xs tracking-widest text-signal uppercase">
              [EVIDENCE GAPS TO FILL BEFORE PUBLISH]
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-secondary">
              {study.evidenceGaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </aside>
        ) : null}

        <nav
          aria-label="Case study pagination"
          className="mt-12 grid grid-cols-1 border-t border-l border-hairline sm:grid-cols-2"
        >
          {prevStudy ? (
            <Link
              href={`/work/${prevStudy.slug}`}
              className="group border-r border-b border-hairline bg-surface p-6 transition-colors hover:bg-surface-hover"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted uppercase">
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                Previous [{prevStudy.index}]
              </span>
              <p className="mt-2 font-display text-2xl tracking-wide text-ink-primary group-hover:text-signal">
                {prevStudy.title}
              </p>
            </Link>
          ) : (
            <div className="hidden border-r border-b border-hairline bg-surface/40 p-6 sm:block" />
          )}

          {nextStudy ? (
            <Link
              href={`/work/${nextStudy.slug}`}
              className="group border-r border-b border-hairline bg-surface p-6 text-left transition-colors hover:bg-surface-hover sm:text-right"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted uppercase">
                Next [{nextStudy.index}]
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <p className="mt-2 font-display text-2xl tracking-wide text-ink-primary group-hover:text-signal">
                {nextStudy.title}
              </p>
            </Link>
          ) : (
            <div className="hidden border-r border-b border-hairline bg-surface/40 p-6 sm:block" />
          )}
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
}
