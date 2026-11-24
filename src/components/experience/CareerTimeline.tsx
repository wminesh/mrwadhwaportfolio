"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  CAREER_TIMELINE_EVENTS,
  type EducationItem,
  type ExperienceItem,
  type TimelineMajorEvent,
} from "@/data/portfolio";
import { useSvgFollowScroll } from "@/components/ui/SvgFollowScroll";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface CareerTimelineProps {
  events?: TimelineMajorEvent[];
  roles?: ExperienceItem[];
  education?: EducationItem[];
  social?: { org: string; detail: string }[];
}

/**
 * Scroll-reactive career timeline with a left gradient beam, glowing comet circle head,
 * sticky left job anchors, 1-column right summary cards, and interleaved Minor Events
 * (launches, starts, certifications, impact) that stay invisible until the scroll comet reaches them.
 */
export function CareerTimeline({
  events = CAREER_TIMELINE_EVENTS,
}: CareerTimelineProps) {
  const { setStrokeHighlight, pulseStroke } = useSvgFollowScroll();
  const trackRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const beam = beamRef.current;
      const comet = cometRef.current;
      if (!track || !beam || !comet) return;

      const majorBlocks = gsap.utils.toArray<HTMLElement>(
        "[data-major-block]",
        track
      );
      const majorNodes = gsap.utils.toArray<HTMLElement>(
        "[data-major-node]",
        track
      );
      const minorRows = gsap.utils.toArray<HTMLElement>(
        "[data-minor-event]",
        track
      );

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const syncAtProgress = (progress: number) => {
        const clamped = Math.min(1, Math.max(0, progress));
        const pct = `${(clamped * 100).toFixed(2)}%`;
        beam.style.height = pct;
        comet.style.top = pct;

        const trackRect = track.getBoundingClientRect();
        const cometY = trackRect.height * clamped;

        majorNodes.forEach((node, idx) => {
          const r = node.getBoundingClientRect();
          const nodeY = r.top - trackRect.top + r.height * 0.5;
          const reached = cometY >= nodeY - 10 || idx === 0;
          node.dataset.reached = reached ? "true" : "false";
          const block = majorBlocks[idx];
          if (block) {
            block.dataset.reached = reached ? "true" : "false";
          }
        });

        minorRows.forEach((row) => {
          const r = row.getBoundingClientRect();
          const rowY = r.top - trackRect.top + r.height * 0.5;
          const reached = cometY >= rowY - 12;
          const wasReached = row.dataset.reached === "true";
          if (reached !== wasReached) {
            row.dataset.reached = reached ? "true" : "false";
            if (reached) {
              pulseStroke();
            }
          }
        });
      };

      if (prefersReducedMotion) {
        syncAtProgress(1);
        return;
      }

      syncAtProgress(0.02);

      const trigger = ScrollTrigger.create({
        trigger: track,
        start: "top 68%",
        end: "bottom 38%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          syncAtProgress(self.progress);
        },
      });

      const onResize = () => {
        syncAtProgress(trigger.progress);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        trigger.kill();
      };
    },
    { scope: trackRef, dependencies: [events.length] }
  );

  return (
    <div ref={trackRef} className="relative py-2">
      {/* Continuous Left Spine Track + Scrubbed Copper Beam + Comet Circle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 bottom-3 left-[13px] w-[2px] bg-hairline sm:left-[15px]"
      >
        <div
          ref={beamRef}
          className="w-full bg-gradient-to-b from-signal/25 via-signal to-signal shadow-[0_0_12px_var(--accent-signal)]"
          style={{ height: "2%" }}
        />

        <span
          ref={cometRef}
          className="absolute left-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-signal bg-canvas shadow-[0_0_16px_var(--accent-signal)]"
          style={{ top: "2%" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        </span>
      </div>

      <div className="space-y-8">
        {events.map((major, majorIdx) => (
          <div key={major.id} className="space-y-4">
            {/* MAJOR EVENT (Job / Origin Credential) */}
            <div
              data-major-block
              data-reached={majorIdx === 0 ? "true" : "false"}
              className="group/major relative grid grid-cols-1 gap-4 pl-10 transition-opacity duration-300 data-[reached=false]:opacity-45 data-[reached=true]:opacity-100 sm:pl-12 lg:grid-cols-12 lg:gap-8"
            >
              {/* Major Spine Node */}
              <span
                data-major-node
                data-reached={majorIdx === 0 ? "true" : "false"}
                aria-hidden="true"
                className="absolute top-2 left-[7px] h-3.5 w-3.5 rounded-full border-2 border-hairline bg-canvas transition-colors duration-200 data-[reached=true]:border-signal data-[reached=true]:bg-signal sm:left-[9px]"
              />

              {/* Sticky Left Chapter Anchor */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <span className="inline-block border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10px] tracking-widest text-signal uppercase">
                    {major.badge ?? "MAJOR · JOB"}
                  </span>
                  <p className="mt-2 font-mono text-xs tracking-widest text-ink-secondary uppercase">
                    {major.period}
                  </p>
                  <h3 className="mt-1 font-display text-3xl leading-none tracking-wide text-ink-primary sm:text-4xl">
                    {major.company}
                  </h3>
                  <p className="mt-1.5 text-xs text-ink-secondary sm:text-sm">
                    {major.role}
                    {major.location ? ` · ${major.location}` : ""}
                  </p>
                </div>
              </div>

              {/* 1-Column Summary Card on the Right */}
              <div className="lg:col-span-8">
                <div
                  onPointerEnter={() => setStrokeHighlight(true)}
                  onPointerLeave={() => setStrokeHighlight(false)}
                  className="border border-hairline bg-surface/85 p-5 backdrop-blur-sm transition-colors duration-200 group-data-[reached=true]/major:border-hairline hover:border-signal/60 sm:p-6"
                >
                  <p className="font-mono text-lg font-medium tracking-tight tabular-nums text-signal sm:text-xl">
                    {major.headlineMetrics}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    {major.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* INTERLEAVED MINOR EVENTS (Invisible on spine & text until scroll comet reaches them) */}
            {major.minorEvents && major.minorEvents.length > 0 ? (
              <div className="space-y-3">
                {major.minorEvents.map((minor) => {
                  const cardBody = (
                    <div className="border border-dashed border-signal/45 bg-surface/80 px-4 py-3 backdrop-blur-sm transition-all duration-200 group-hover/minor:border-solid group-hover/minor:border-signal group-hover/minor:bg-surface-hover sm:px-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-xs font-medium text-ink-primary transition-colors group-hover/minor:text-signal sm:text-sm">
                          {minor.title}
                        </p>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {minor.meta ? (
                            <span className="hidden font-mono text-[10px] tracking-wider text-ink-muted uppercase sm:inline">
                              {minor.meta}
                            </span>
                          ) : null}
                          {minor.href ? (
                            <ArrowUpRight className="h-3.5 w-3.5 text-signal transition-transform duration-200 group-hover/minor:translate-x-0.5 group-hover/minor:-translate-y-0.5" />
                          ) : null}
                        </div>
                      </div>

                      {minor.detail ? (
                        <p className="max-h-0 overflow-hidden text-xs leading-relaxed text-ink-secondary opacity-0 transition-all duration-250 group-hover/minor:mt-2 group-hover/minor:max-h-24 group-hover/minor:opacity-100 group-focus-within/minor:mt-2 group-focus-within/minor:max-h-24 group-focus-within/minor:opacity-100">
                          {minor.detail}
                        </p>
                      ) : null}
                    </div>
                  );

                  return (
                    <div
                      key={minor.id}
                      data-minor-event
                      data-reached="false"
                      onPointerEnter={() => setStrokeHighlight(true)}
                      onPointerLeave={() => setStrokeHighlight(false)}
                      className="group/minor relative grid grid-cols-1 items-center gap-2 pl-10 transition-all duration-300 ease-out data-[reached=false]:pointer-events-none data-[reached=false]:-translate-x-2 data-[reached=false]:opacity-0 data-[reached=true]:pointer-events-auto data-[reached=true]:translate-x-0 data-[reached=true]:opacity-100 sm:pl-12 lg:grid-cols-12 lg:gap-8"
                    >
                      {/* Minor Spine Tick + Dot (only visible once reached) */}
                      <span
                        aria-hidden="true"
                        className="absolute left-[9px] h-2.5 w-2.5 rounded-full border border-signal bg-signal shadow-[0_0_8px_var(--accent-signal)] transition-transform duration-200 group-hover/minor:scale-125 sm:left-[11px]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute left-[19px] h-px w-4 bg-signal/70 transition-all duration-200 group-hover/minor:w-5 group-hover/minor:bg-signal sm:left-[21px]"
                      />

                      {/* Left Minor Event Badge */}
                      <div className="lg:col-span-4">
                        <span className="font-mono text-[11px] tracking-widest text-signal uppercase">
                          [{minor.badge}]
                        </span>
                      </div>

                      {/* Right 1-Column Minor Event Card */}
                      <div className="lg:col-span-8">
                        {minor.href ? (
                          <Link
                            href={minor.href}
                            className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                          >
                            {cardBody}
                          </Link>
                        ) : (
                          <div tabIndex={0} className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal">
                            {cardBody}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
