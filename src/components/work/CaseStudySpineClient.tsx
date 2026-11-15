"use client";

import { useEffect, useState } from "react";
import type { CaseStudyBeat } from "@/data/portfolio";
import { TagPill } from "@/components/ui/TagPill";

interface CaseStudySpineClientProps {
  beats: CaseStudyBeat[];
}

const slugifyBeat = (beat: string) =>
  beat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Interactive 8-beat case study reader with a sticky desktop progress rail.
 */
export function CaseStudySpineClient({ beats }: CaseStudySpineClientProps) {
  const [activeId, setActiveId] = useState<string>(() =>
    beats[0] ? slugifyBeat(beats[0].beat) : ""
  );

  useEffect(() => {
    const ids = beats.map((b) => slugifyBeat(b.beat));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [beats]);

  return (
    <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
      <aside className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-24 border border-hairline bg-surface p-5">
          <p className="border-b border-hairline pb-3 font-mono text-[11px] tracking-widest text-ink-muted uppercase">
            Case Study Spine
          </p>
          <ol className="mt-4 space-y-2">
            {beats.map((beat) => {
              const id = slugifyBeat(beat.beat);
              const isActive = activeId === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={`block border-l-2 py-1 pl-3 font-mono text-xs transition-colors ${
                      isActive
                        ? "border-signal text-signal"
                        : "border-transparent text-ink-secondary hover:border-hairline hover:text-ink-primary"
                    }`}
                  >
                    {beat.beat}
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>

      <div className="space-y-6 lg:col-span-8">
        {beats.map((beat) => {
          const id = slugifyBeat(beat.beat);
          return (
            <article
              key={beat.beat}
              id={id}
              className="scroll-mt-24 border border-hairline bg-surface p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs tracking-widest text-signal uppercase">
                  {beat.beat}
                </span>
                <TagPill
                  variant={beat.status === "verified" ? "default" : "muted"}
                >
                  {beat.status === "verified"
                    ? "Verified from CV"
                    : "Lorem Ipsum Placeholder"}
                </TagPill>
              </div>
              <h2 className="mt-3 font-display text-3xl tracking-wide text-ink-primary">
                {beat.title}
              </h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-secondary">
                {beat.content}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
