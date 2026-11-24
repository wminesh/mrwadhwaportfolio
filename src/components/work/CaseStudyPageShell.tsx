"use client";

import { useEffect, useRef, useState } from "react";
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

export function CaseStudyPageShell({ study }: CaseStudyPageShellProps) {
  const [mode, setMode] = useState<CaseStudyReadingMode>("tldr");
  const isFull = mode === "full";
  const tldrRef = useRef<HTMLSpanElement | null>(null);
  const fullRef = useRef<HTMLSpanElement | null>(null);
  const [thumbStyle, setThumbStyle] = useState<{
    x: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    const updateThumb = () => {
      const activeEl = isFull ? fullRef.current : tldrRef.current;
      if (!activeEl) return;
      setThumbStyle({
        x: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    };

    updateThumb();
    window.addEventListener("resize", updateThumb);
    return () => window.removeEventListener("resize", updateThumb);
  }, [isFull]);

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
                {study.metrics.map((metric) => (
                  <TagPill
                    key={metric.label}
                    variant="default"
                    scope={metric.scope}
                  >
                    {metric.label}
                  </TagPill>
                ))}
              </div>
            ) : (
              <div />
            )}

            <button
              type="button"
              role="switch"
              aria-checked={isFull}
              aria-label="Toggle reading mode between TLDR and Read It All"
              onClick={() =>
                setMode((prev) => (prev === "tldr" ? "full" : "tldr"))
              }
              className={`relative inline-flex shrink-0 cursor-pointer items-center border p-0.5 font-mono text-[11px] tracking-wider uppercase select-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${
                isFull
                  ? "border-signal/60 bg-surface-hover"
                  : "border-hairline bg-surface hover:border-ink-muted/60"
              }`}
            >
              <span
                aria-hidden="true"
                style={
                  thumbStyle
                    ? {
                        width: `${thumbStyle.width}px`,
                        transform: `translate3d(${thumbStyle.x}px, 0, 0)`,
                      }
                    : undefined
                }
                className={`pointer-events-none absolute top-0.5 bottom-0.5 left-0 bg-signal transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  thumbStyle ? "" : "left-0.5 w-[52px]"
                }`}
              />
              <span
                ref={tldrRef}
                className={`relative z-10 px-2.5 py-0.5 transition-all duration-300 ${
                  !isFull
                    ? "scale-100 font-medium text-canvas"
                    : "scale-95 text-ink-muted hover:text-ink-primary"
                }`}
              >
                TLDR
              </span>
              <span
                ref={fullRef}
                className={`relative z-10 px-2.5 py-0.5 transition-all duration-300 ${
                  isFull
                    ? "scale-100 font-medium text-canvas"
                    : "scale-95 text-ink-muted hover:text-ink-primary"
                }`}
              >
                Read It All
              </span>
            </button>
          </div>
        </header>

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
