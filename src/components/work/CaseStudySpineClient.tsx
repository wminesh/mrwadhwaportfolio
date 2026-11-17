"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseStudyBeat } from "@/data/portfolio";
import { TagPill } from "@/components/ui/TagPill";
import { CaseStudyBlockRenderer } from "@/components/work/CaseStudyBlockRenderer";

export type CaseStudyReadingMode = "tldr" | "full";

interface CaseStudySpineClientProps {
  beats: CaseStudyBeat[];
  mode?: CaseStudyReadingMode;
}

const TLDR_PLACEHOLDER_COPY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

const DEFAULT_HEADER_HEIGHT_PX = 61;
const CURSOR_PILL_GAP_PX = 24;
const VIEWPORT_EDGE_MARGIN_PX = 8;
const FLIPPED_PILL_OFFSET_PX = 12;

const slugifyBeat = (beat: string) =>
  beat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Interactive 8-beat case study reader with a horizontal sticky sub-header stepper,
 * continuous hover hitbox, top-left precision focus pointer + heading pill,
 * and full-width 12-column hybrid beat cards.
 */
export function CaseStudySpineClient({
  beats,
  mode = "tldr",
}: CaseStudySpineClientProps) {
  const steps = beats.map((beat, idx) => ({
    ...beat,
    id: slugifyBeat(beat.beat),
    num: String(idx + 1).padStart(2, "0"),
  }));

  const [activeId, setActiveId] = useState<string>(() => steps[0]?.id ?? "");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [headerOffset, setHeaderOffset] = useState<number>(
    DEFAULT_HEADER_HEIGHT_PX
  );

  const cursorRootRef = useRef<HTMLDivElement | null>(null);
  const cursorPillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const siteHeader = document.querySelector("header");
    if (!siteHeader) return;

    const updateHeaderOffset = () => {
      setHeaderOffset(siteHeader.getBoundingClientRect().height);
    };

    updateHeaderOffset();
    const ro = new ResizeObserver(updateHeaderOffset);
    ro.observe(siteHeader);
    return () => ro.disconnect();
  }, []);

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
      { rootMargin: "-22% 0px -68% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [beats]);

  const syncCursorPosition = (clientX: number, clientY: number) => {
    const rootEl = cursorRootRef.current;
    const pillEl = cursorPillRef.current;
    if (!rootEl || !pillEl) return;

    const pillWidth = pillEl.offsetWidth;
    const shouldFlipLeft =
      clientX + pillWidth + CURSOR_PILL_GAP_PX >
      window.innerWidth - VIEWPORT_EDGE_MARGIN_PX;

    pillEl.style.transform = shouldFlipLeft
      ? `translateX(-${pillWidth + FLIPPED_PILL_OFFSET_PX}px)`
      : "translateX(0px)";
    rootEl.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
  };

  const handleStepClick = (id: string) => {
    setActiveId(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === activeId)
  );
  const hoveredStep = hoveredIdx !== null ? steps[hoveredIdx] : null;

  return (
    <div className="mt-8">
      <nav
        aria-label="Case study sections"
        style={{ top: `${headerOffset}px` }}
        onPointerMove={(e) => {
          if (e.pointerType === "touch") return;
          syncCursorPosition(e.clientX, e.clientY);
        }}
        onPointerLeave={() => setHoveredIdx(null)}
        className="sticky z-20 hidden cursor-none border-b border-hairline bg-canvas/90 backdrop-blur-md sm:block [&_*]:cursor-none"
      >
        <ol className="flex w-full items-center">
          {steps.map((step, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;
            const isFirst = idx === 0;
            const isLast = idx === steps.length - 1;

            return (
              <li
                key={step.id}
                className={`flex items-center ${
                  isFirst || isLast ? "flex-1" : "flex-[2]"
                }`}
              >
                <button
                  type="button"
                  aria-label={`Jump to section ${step.num}: ${step.title}`}
                  aria-current={isActive ? "step" : undefined}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "touch") return;
                    setHoveredIdx(idx);
                    requestAnimationFrame(() =>
                      syncCursorPosition(e.clientX, e.clientY)
                    );
                  }}
                  onClick={() => handleStepClick(step.id)}
                  className="group flex w-full items-center py-3.5 text-left focus-visible:outline-none"
                >
                  {!isFirst ? (
                    <span
                      aria-hidden="true"
                      className={`mr-1.5 h-[2px] flex-1 transition-colors ${
                        idx <= activeIndex
                          ? "bg-signal"
                          : "bg-hairline group-hover:bg-ink-muted/70"
                      }`}
                    />
                  ) : null}
                  <span
                    className={`border px-2 py-0.5 font-mono text-xs transition-colors ${
                      isActive
                        ? "border-signal bg-signal font-semibold text-canvas"
                        : isPast
                          ? "border-signal/60 bg-surface text-signal group-hover:border-signal"
                          : "border-hairline bg-surface text-ink-secondary group-hover:border-ink-primary group-hover:text-ink-primary group-focus-visible:border-signal group-focus-visible:text-signal"
                    }`}
                  >
                    {step.num}
                  </span>
                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className={`ml-1.5 h-[2px] flex-1 transition-colors ${
                        isPast
                          ? "bg-signal"
                          : "bg-hairline group-hover:bg-ink-muted/70"
                      }`}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Top-Left Precision Copper Arrow + Single-Line Heading Pill */}
      <div
        ref={cursorRootRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-75 ${
          hoveredStep ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          className="-mb-1.5 block"
        >
          <path
            d="M1 1 L12 5.5 L6.8 7.2 L5.2 12.5 Z"
            fill="var(--color-signal)"
            stroke="var(--color-canvas)"
            strokeWidth="1.2"
          />
        </svg>
        <div
          ref={cursorPillRef}
          className="mt-0.5 ml-2.5 flex items-center gap-2 border border-signal bg-canvas/95 px-2.5 py-1 shadow-xl backdrop-blur-md"
        >
          <span className="font-mono text-xs font-bold text-signal">
            [{hoveredStep?.num ?? ""}]
          </span>
          <span className="text-xs font-medium whitespace-nowrap text-ink-primary">
            {hoveredStep?.title ?? ""}
          </span>
          <span className="font-mono text-xs text-signal">↵</span>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {steps.map((step) => (
          <article
            key={step.beat}
            id={step.id}
            className="scroll-mt-36 border border-hairline bg-surface p-7"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-widest text-signal uppercase">
                {step.beat}
              </span>
              {step.status !== "verified" || (mode === "tldr" && !step.tldr) ? (
                <TagPill variant="muted">Lorem Ipsum Placeholder</TagPill>
              ) : null}
            </div>
            <h2 className="font-display text-3xl tracking-wide text-ink-primary">
              {step.title}
            </h2>
            {mode !== "tldr" && step.blocks?.length ? (
              <CaseStudyBlockRenderer blocks={step.blocks} />
            ) : (
              <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-secondary">
                {mode === "tldr"
                  ? (step.tldr ?? TLDR_PLACEHOLDER_COPY)
                  : step.content}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
