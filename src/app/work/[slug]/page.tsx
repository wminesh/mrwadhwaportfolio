import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TagPill } from "@/components/ui/TagPill";
import { CaseStudySpineClient } from "@/components/work/CaseStudySpineClient";
import { FLAGSHIP_CASE_STUDIES } from "@/data/portfolio";

export function generateStaticParams() {
  return FLAGSHIP_CASE_STUDIES.map((study) => ({
    slug: study.slug,
  }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentIndex = FLAGSHIP_CASE_STUDIES.findIndex(
    (item) => item.slug === slug
  );

  if (currentIndex === -1) {
    notFound();
  }

  const study = FLAGSHIP_CASE_STUDIES[currentIndex];
  const prevStudy =
    currentIndex > 0 ? FLAGSHIP_CASE_STUDIES[currentIndex - 1] : null;
  const nextStudy =
    currentIndex < FLAGSHIP_CASE_STUDIES.length - 1
      ? FLAGSHIP_CASE_STUDIES[currentIndex + 1]
      : null;

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
        </header>

        {study.causalStrip?.length ? (
          <section
            aria-label="Causal summary"
            className="grid grid-cols-1 border-b border-l border-hairline sm:grid-cols-2 lg:grid-cols-4"
          >
            {study.causalStrip.map((item, idx) => (
              <div
                key={item.step}
                className="border-r border-hairline bg-surface p-5"
              >
                <p className="font-mono text-[11px] tracking-widest text-signal uppercase">
                  {String(idx + 1).padStart(2, "0")} {"//"} {item.step}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-primary">
                  {item.value}
                </p>
              </div>
            ))}
          </section>
        ) : null}

        <CaseStudySpineClient beats={study.beats} />

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
