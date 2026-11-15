"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/data/portfolio";
import { useSvgFollowScroll } from "@/components/ui/SvgFollowScroll";
import { gsap, useGSAP } from "@/lib/gsap";

interface WorkShowcaseProps {
  studies: CaseStudy[];
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Curved arc side-scroller for Selected Work (supports any number of studies).
 * Couples card hover, drag, and cycling directly with SvgFollowScroll's live stroke.
 */
export function WorkShowcase({ studies }: WorkShowcaseProps) {
  const router = useRouter();
  const { setStrokeHighlight, pulseStroke } = useSvgFollowScroll();

  const stageWrapRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const traceBarRef = useRef<HTMLSpanElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [strokeCoupled, setStrokeCoupled] = useState(false);

  const posRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(0);
  const activeIndexRef = useRef(0);
  const suppressClickRef = useRef(false);
  const dragRef = useRef<{ x: number; startTarget: number; moved: number } | null>(
    null
  );
  const wheelLockRef = useRef(0);

  const count = studies.length;

  const drawArc = useCallback(() => {
    const cards = cardRefs.current;
    const firstCard = cards[0];
    if (!firstCard) return;

    const cw = firstCard.offsetWidth || 240;
    const gap = cw * 1.12;
    const pos = posRef.current;

    cards.forEach((card, i) => {
      if (!card) return;
      const off = i - pos;
      const absOff = Math.abs(off);
      const x = off * gap;
      const y = off * off * 16;
      const rot = off * 6;
      const scale = 1 - Math.min(absOff, 3) * 0.06;
      const opacity = Math.max(0, 1 - Math.min(absOff, 3.4) * 0.24);
      const zIndex = 100 - Math.round(absOff * 10);

      card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = String(zIndex);
    });
  }, []);

  const startAnimation = useCallback(() => {
    if (rafRef.current) return;

    const step = () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const delta = targetRef.current - posRef.current;

      if (prefersReducedMotion || Math.abs(delta) < 0.001) {
        posRef.current = targetRef.current;
      } else {
        posRef.current += delta * 0.14;
      }

      drawArc();

      if (posRef.current !== targetRef.current) {
        rafRef.current = window.requestAnimationFrame(step);
      } else {
        rafRef.current = 0;
      }
    };

    rafRef.current = window.requestAnimationFrame(step);
  }, [drawArc]);

  const goTo = useCallback(
    (nextRaw: number) => {
      if (count === 0) return;
      const clamped = Math.max(0, Math.min(count - 1, Math.round(nextRaw)));
      targetRef.current = clamped;

      if (clamped !== activeIndexRef.current) {
        activeIndexRef.current = clamped;
        setActiveIndex(clamped);
        pulseStroke();
      }

      startAnimation();
    },
    [count, pulseStroke, startAnimation]
  );

  // Initial draw, resize sync, and wheel horizontal scroll handling
  useEffect(() => {
    drawArc();

    const onResize = () => drawArc();
    window.addEventListener("resize", onResize);

    const arcEl = arcRef.current;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 4) {
        return;
      }
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLockRef.current < 180) return;
      wheelLockRef.current = now;
      goTo(Math.round(targetRef.current) + Math.sign(e.deltaX));
    };

    arcEl?.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("resize", onResize);
      arcEl?.removeEventListener("wheel", onWheel);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [drawArc, goTo]);

  // Global pointer move / up for smooth arc dragging
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = e.clientX - drag.x;
      drag.moved = Math.max(drag.moved, Math.abs(dx));
      if (drag.moved > 5) {
        setIsDragging(true);
        setStrokeHighlight(true);
      }

      const cw = cardRefs.current[0]?.offsetWidth || 240;
      const gap = cw * 1.12;
      targetRef.current = Math.max(
        -0.4,
        Math.min(count - 0.6, drag.startTarget - dx / gap)
      );

      startAnimation();
    };

    const onPointerUp = () => {
      const drag = dragRef.current;
      if (!drag) return;

      const moved = drag.moved;
      dragRef.current = null;
      setIsDragging(false);
      setStrokeHighlight(false);

      if (moved > 5) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
        goTo(Math.round(targetRef.current));
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [count, goTo, setStrokeHighlight, startAnimation]);

  // ScrollTrigger coupling between SvgFollowScroll's vertical passage and the Arc stage
  useGSAP(
    () => {
      const wrap = stageWrapRef.current;
      if (!wrap) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        setStrokeCoupled(true);
        if (traceBarRef.current) {
          traceBarRef.current.style.transform = "scaleX(1)";
        }
        return;
      }

      gsap.from(wrap, {
        y: 26,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: wrap,
          start: "top 84%",
          once: true,
        },
      });

      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: wrap,
            start: "top 75%",
            end: "bottom 28%",
            scrub: true,
            onEnter: () => setStrokeCoupled(true),
            onLeave: () => setStrokeCoupled(false),
            onEnterBack: () => setStrokeCoupled(true),
            onLeaveBack: () => setStrokeCoupled(false),
            onUpdate: (self) => {
              if (traceBarRef.current) {
                traceBarRef.current.style.transform = `scaleX(${self.progress.toFixed(3)})`;
              }
            },
          },
        }
      );
    },
    { scope: stageWrapRef }
  );

  const handleCardActivate = (index: number, slug: string) => {
    if (suppressClickRef.current) return;
    if (index === activeIndexRef.current) {
      pulseStroke();
      router.push(`/work/${slug}`);
    } else {
      goTo(index);
    }
  };

  if (count === 0) return null;

  return (
    <div ref={stageWrapRef} className="relative">
      {/* Subtle stroke-coupled telemetry bar showing active scroll pass through Work */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-widest text-ink-muted uppercase">
          <span
            className={`inline-block h-2 w-2 rounded-full transition-colors duration-300 ${
              strokeCoupled ? "bg-signal" : "bg-hairline"
            }`}
          />
          <span>
            {strokeCoupled
              ? "Signal active · Drag arc or click center card"
              : "Drag arc, scroll sideways, or click center card"}
          </span>
        </div>

        <span className="font-mono text-[11px] tracking-widest text-ink-muted tabular-nums uppercase">
          [{pad(activeIndex + 1)} / {pad(count)}]
        </span>
      </div>

      <div className="relative h-[2px] w-full bg-hairline/70">
        <span
          ref={traceBarRef}
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-full origin-left bg-signal"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Curved Arc Carousel Stage */}
      <div
        ref={arcRef}
        role="list"
        aria-label="Selected project cards"
        onPointerDown={(e) => {
          dragRef.current = {
            x: e.clientX,
            startTarget: targetRef.current,
            moved: 0,
          };
        }}
        className={`relative mt-2 h-[410px] w-full touch-pan-y select-none overflow-x-clip py-6 sm:h-[440px] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {studies.map((study, index) => {
          const isCenter = index === activeIndex;
          return (
            <div
              key={study.slug}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              role="listitem"
              tabIndex={0}
              aria-label={`${study.title} — ${study.heroMetric} ${study.heroMetricLabel}`}
              aria-current={isCenter ? "true" : undefined}
              onClick={() => handleCardActivate(index, study.slug)}
              onPointerEnter={() => setStrokeHighlight(true)}
              onPointerLeave={() => setStrokeHighlight(false)}
              onFocus={() => setStrokeHighlight(true)}
              onBlur={() => setStrokeHighlight(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardActivate(index, study.slug);
                } else if (e.key === "ArrowRight") {
                  e.preventDefault();
                  goTo(index + 1);
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  goTo(index - 1);
                }
              }}
              style={{
                boxShadow: isCenter
                  ? strokeCoupled
                    ? "0 0 32px 14px var(--bg-canvas), 0 0 28px rgba(255, 92, 40, 0.14)"
                    : "0 0 28px 14px var(--bg-canvas)"
                  : "0 0 24px 12px var(--bg-canvas)",
              }}
              className={`group absolute top-1/2 left-1/2 -mt-[165px] -ml-[118px] flex h-[330px] w-[236px] cursor-pointer flex-col border p-5 backdrop-blur-sm transition-colors duration-200 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal sm:-mt-[175px] sm:-ml-[132px] sm:h-[350px] sm:w-[264px] sm:p-6 ${
                isCenter
                  ? strokeCoupled
                    ? "border-signal bg-surface-hover/95"
                    : "border-signal/65 bg-surface-hover/90"
                  : "border-hairline bg-surface/90 hover:border-signal/50 hover:bg-surface-hover/90"
              }`}
            >
              {/* Top telemetry index & category */}
              <div className="flex items-center justify-between font-mono text-[11px] tracking-widest uppercase">
                <span className="text-ink-muted tabular-nums">
                  {pad(index + 1)} / {pad(count)}
                </span>
                <span className="text-signal">{study.category}</span>
              </div>

              {/* Hero impact metric */}
              <div className="mt-5">
                <p className="font-display text-5xl leading-[0.88] tracking-wide text-signal sm:text-6xl">
                  {study.heroMetric}
                </p>
                <p className="mt-1.5 font-mono text-[10px] tracking-widest text-ink-muted uppercase">
                  {study.heroMetricLabel}
                </p>
              </div>

              {/* Case study title */}
              <h3 className="mt-4 font-display text-2xl leading-[0.98] tracking-wide text-ink-primary transition-colors group-hover:text-signal sm:text-[28px]">
                {study.title}
              </h3>

              {/* Interactive footer: hint swaps to job context on hover/focus (or center on touch) */}
              <div className="relative mt-auto h-[80px] overflow-hidden">
                <div
                  className={`absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-hairline pt-3 font-mono text-[11px] tracking-wider text-ink-muted uppercase transition-all duration-250 group-hover:-translate-y-1.5 group-hover:opacity-0 group-focus-visible:-translate-y-1.5 group-focus-visible:opacity-0 ${
                    isCenter
                      ? "[@media(hover:none)]:-translate-y-1.5 [@media(hover:none)]:opacity-0"
                      : ""
                  }`}
                >
                  <span>
                    {isCenter ? "Where this happened" : "Select to focus"}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-signal" />
                </div>

                <div
                  className={`absolute inset-x-0 bottom-0 translate-y-2.5 border-t border-signal pt-2.5 opacity-0 transition-all duration-250 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 ${
                    isCenter
                      ? "[@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
                      : ""
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-xl leading-none tracking-wide text-ink-primary">
                      {study.job.company}
                    </p>
                    {isCenter ? (
                      <span className="font-mono text-[10px] tracking-wider text-signal uppercase">
                        Open →
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs leading-snug text-ink-secondary">
                    {study.job.role}
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-wider text-signal uppercase">
                    {study.job.period}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arc Controls & Scalable Project Stepper */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous project"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-hairline bg-surface/85 text-ink-primary transition-colors hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Jump to project">
          {studies.map((study, index) => {
            const isCurrent = index === activeIndex;
            return (
              <button
                key={study.slug}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Select ${study.title}`}
                onClick={() => goTo(index)}
                className={`h-1.5 cursor-pointer transition-all duration-200 ${
                  isCurrent
                    ? "w-7 bg-signal"
                    : "w-3 bg-hairline hover:bg-ink-muted"
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === count - 1}
          aria-label="Next project"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border border-hairline bg-surface/85 text-ink-primary transition-colors hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
