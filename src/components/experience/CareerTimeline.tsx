"use client";

import { useRef, useState } from "react";
import type { EducationItem, ExperienceItem } from "@/data/portfolio";
import { gsap, useGSAP } from "@/lib/gsap";

interface CareerTimelineProps {
  roles: ExperienceItem[];
  education: EducationItem[];
  social: { org: string; detail: string }[];
}

type TabKey = string;

/**
 * Interactive career selector keeping the page scannable and light on prose,
 * with ScrollTrigger entry and GSAP transitions when switching chapters.
 */
export function CareerTimeline({
  roles,
  education,
  social,
}: CareerTimelineProps) {
  const [activeKey, setActiveKey] = useState<TabKey>(roles[0]?.id ?? "edu");
  const [showAll, setShowAll] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasInteractedRef = useRef(false);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      if (!hasInteractedRef.current) {
        gsap.from(panelRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: panelRef.current,
            start: "top 84%",
            once: true,
          },
        });
        return;
      }

      gsap.from("[data-timeline-panel]", {
        y: 12,
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "transform,opacity",
      });
    },
    { scope: panelRef, dependencies: [activeKey, showAll] }
  );

  const selectChapter = (key: TabKey) => {
    hasInteractedRef.current = true;
    setActiveKey(key);
  };

  const toggleShowAll = () => {
    hasInteractedRef.current = true;
    setShowAll((prev) => !prev);
  };

  const activeRole = roles.find((r) => r.id === activeKey);

  return (
    <div ref={panelRef}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] tracking-widest text-ink-muted uppercase">
          Select a chapter to inspect metrics
        </p>
        <button
          type="button"
          onClick={toggleShowAll}
          className="cursor-pointer border border-hairline bg-surface/85 px-3 py-1.5 font-mono text-[11px] tracking-wider text-ink-secondary uppercase backdrop-blur-sm transition-colors hover:bg-surface-hover hover:text-signal"
        >
          {showAll ? "Focused View" : "Expand All"}
        </button>
      </div>

      {showAll ? (
        <div
          data-timeline-panel
          className="border-t border-l border-hairline"
        >
          {roles.map((role) => (
            <div
              key={role.id}
              className="grid grid-cols-1 border-r border-b border-hairline bg-surface/85 p-6 backdrop-blur-sm lg:grid-cols-12 lg:gap-6"
            >
              <div className="lg:col-span-4">
                <p className="font-mono text-xs tracking-widest text-signal uppercase">
                  {role.period}
                </p>
                <h3 className="mt-1.5 font-display text-3xl tracking-wide text-ink-primary">
                  {role.company}
                </h3>
                <p className="text-xs text-ink-secondary">
                  {role.role} · {role.location}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8 lg:mt-0">
                {role.highlights.map((item) => (
                  <div
                    key={`${role.id}-${item.detail}`}
                    className="border border-hairline bg-canvas/60 p-4"
                  >
                    <p className="font-mono text-lg font-medium tabular-nums text-signal">
                      {item.metric}
                      {item.unit ? (
                        <span className="ml-2 text-[10px] text-ink-muted uppercase">
                          {item.unit}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 border-t border-l border-hairline lg:grid-cols-12">
          <div
            role="tablist"
            aria-label="Career chapters"
            className="grid grid-cols-2 bg-surface/80 backdrop-blur-sm lg:col-span-4 lg:flex lg:flex-col lg:border-r lg:border-b lg:border-hairline"
          >
            {roles.map((role, idx) => {
              const isSelected = activeKey === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => selectChapter(role.id)}
                  className={`flex cursor-pointer flex-col items-start border-r border-b border-hairline px-4 py-3.5 text-left transition-colors lg:border-r-0 lg:px-5 lg:py-4 ${
                    isSelected
                      ? "border-l-2 border-l-signal bg-surface-hover text-ink-primary"
                      : "text-ink-secondary hover:bg-surface-hover/50 hover:text-ink-primary"
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-widest text-signal uppercase">
                    [{String(idx + 1).padStart(2, "0")}] · {role.period}
                  </span>
                  <span className="mt-1 font-display text-xl leading-tight tracking-wide sm:text-2xl">
                    {role.company}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              role="tab"
              aria-selected={activeKey === "edu"}
              onClick={() => selectChapter("edu")}
              className={`flex cursor-pointer flex-col items-start border-r border-b border-hairline px-4 py-3.5 text-left transition-colors lg:border-r-0 lg:border-b-0 lg:px-5 lg:py-4 ${
                activeKey === "edu"
                  ? "border-l-2 border-l-signal bg-surface-hover text-ink-primary"
                  : "text-ink-secondary hover:bg-surface-hover/50 hover:text-ink-primary"
              }`}
            >
              <span className="font-mono text-[10px] tracking-widest text-signal uppercase">
                [06] · CREDENTIALS & SOCIAL
              </span>
              <span className="mt-1 font-display text-xl leading-tight tracking-wide sm:text-2xl">
                Education & Impact
              </span>
            </button>
          </div>

          <div
            data-timeline-panel
            className="border-r border-b border-hairline bg-surface/85 p-7 backdrop-blur-sm lg:col-span-8"
          >
            {activeKey === "edu" ? (
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-xs tracking-widest text-signal uppercase">
                    Education & Certifications
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {education.map((edu) => (
                      <div
                        key={edu.institution}
                        className="border border-hairline bg-canvas/60 p-4"
                      >
                        <p className="font-mono text-[11px] text-signal uppercase">
                          {edu.period}
                        </p>
                        <h3 className="mt-1 font-display text-2xl tracking-wide text-ink-primary">
                          {edu.institution}
                        </h3>
                        <p className="mt-1 text-xs text-ink-secondary">
                          {edu.credential}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs tracking-widest text-ink-muted uppercase">
                    Social Entrepreneurship
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {social.map((item) => (
                      <div
                        key={item.org}
                        className="border border-hairline bg-canvas/60 p-4"
                      >
                        <h4 className="font-display text-xl tracking-wide text-ink-primary">
                          {item.org}
                        </h4>
                        <p className="mt-1 text-xs text-ink-secondary">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeRole ? (
              <div>
                <div className="border-b border-hairline pb-5">
                  <p className="font-mono text-xs tracking-widest text-signal uppercase">
                    {activeRole.period} · {activeRole.location}
                  </p>
                  <h3 className="mt-1.5 font-display text-4xl tracking-wide text-ink-primary">
                    {activeRole.company}
                  </h3>
                  <p className="text-sm text-ink-secondary">{activeRole.role}</p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {activeRole.highlights.map((item) => (
                    <div
                      key={`${activeRole.id}-${item.detail}`}
                      className="border border-hairline bg-canvas/60 p-5 transition-colors hover:border-signal/40"
                    >
                      <p className="font-mono text-2xl font-medium tabular-nums text-signal">
                        {item.metric}
                        {item.unit ? (
                          <span className="ml-2 text-[11px] text-ink-muted uppercase">
                            {item.unit}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-ink-secondary sm:text-sm">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
