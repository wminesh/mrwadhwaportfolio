"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/data/portfolio";
import { TagPill } from "@/components/ui/TagPill";

interface CaseStudyCardProps {
  study: CaseStudy;
  href?: string;
}

/**
 * Flagship case study card with cursor-tracking copper spotlight glow.
 */
export function CaseStudyCard({
  study,
  href = `/work/${study.slug}`,
}: CaseStudyCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <Link
      ref={cardRef}
      href={href}
      onPointerMove={handlePointerMove}
      className="group relative flex w-full flex-col justify-between overflow-hidden border-r border-b border-hairline bg-surface/80 p-7 backdrop-blur-sm transition-all duration-300 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-signal"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 92, 40, 0.12), transparent 65%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs tracking-widest text-ink-muted uppercase">
            [{study.index}] · {study.eyebrow}
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal" />
        </div>

        <h3 className="mt-5 font-display text-3xl leading-[1.02] tracking-wide text-ink-primary transition-colors group-hover:text-signal sm:text-4xl">
          {study.title}
        </h3>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-secondary">
          {study.hook}
        </p>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 pt-4">
        <div className="flex flex-wrap gap-2">
          {study.metrics.slice(0, 2).map((metric, idx) => (
            <TagPill
              key={metric.label}
              variant={idx === 0 ? "signal" : "default"}
              scope={metric.scope}
            >
              {metric.label}
            </TagPill>
          ))}
        </div>
        <span className="font-mono text-[11px] tracking-widest text-ink-muted uppercase transition-colors group-hover:text-signal">
          Open →
        </span>
      </div>
    </Link>
  );
}
