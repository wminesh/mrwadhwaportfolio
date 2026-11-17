"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TagPill } from "@/components/ui/TagPill";
import {
  type CaseStudyReadingMode,
  CaseStudySpineClient,
} from "@/components/work/CaseStudySpineClient";
import {
  type CaseStudy,
  getAdjacentCaseStudies,
  getCaseStudyHref,
} from "@/data/projects";

interface CaseStudyPageShellProps {
  study: CaseStudy;
}

const READING_MODE_OPTIONS: readonly {
  id: CaseStudyReadingMode;
  label: string;
}[] = [
  { id: "tldr", label: "TLDR" },
  { id: "full", label: "Read It All" },
];

export function CaseStudyPageShell({ study }: CaseStudyPageShellProps) {
  const [mode, setMode] = useState<CaseStudyReadingMode>("tldr");
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
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            {study.metrics.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
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
            ) : (
              <div />
            )}

            <div
              role="group"
              aria-label="Reading mode"
              className="inline-flex shrink-0 items-center border border-hairline bg-surface"
            >
              {READING_MODE_OPTIONS.map((option, idx) => {
                const isSelected = mode === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setMode(option.id)}
                    className={`cursor-pointer px-2.5 py-1 font-mono text-[11px] tracking-wider uppercase transition-colors ${
                      idx > 0 ? "border-l border-hairline" : ""
                    } ${
                      isSelected
                        ? "bg-signal font-medium text-canvas"
                        : "text-ink-secondary hover:bg-surface-hover hover:text-ink-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {mode === "full" && study.overview ? (
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

        <CaseStudySpineClient beats={study.beats} mode={mode} />

        <nav
          aria-label="Case study pagination"
          className="mt-12 grid grid-cols-1 border-t border-l border-hairline sm:grid-cols-2"
        >
          {prevStudy ? (
            <Link
              href={getCaseStudyHref(prevStudy)}
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
              href={getCaseStudyHref(nextStudy)}
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
