"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type CaseStudy, getCaseStudyHref } from "@/data/projects";
import { useSvgFollowScroll } from "@/components/ui/SvgFollowScroll";
import { gsap, useGSAP } from "@/lib/gsap";

interface WorkShowcaseProps {
  studies: CaseStudy[];
}

const pad = (n: number) => String(n).padStart(2, "0");

const wrapIndex = (index: number, total: number) =>
  total > 0 ? ((index % total) + total) % total : 0;

const EDGE_FEATHER_MASK =
  "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.18) 5%, black 18%, black 82%, rgba(0, 0, 0, 0.18) 95%, transparent 100%)";

const TRAIL_LOBES = 8;
const LATTICE_COLS = 10;
const LATTICE_ROWS = 9;

interface ArcCardItemProps {
  study: CaseStudy;
  index: number;
  isCenter: boolean;
  strokeCoupled: boolean;
  registerCardRef: (index: number, el: HTMLDivElement | null) => void;
  onCardClick: (index: number, study: CaseStudy, pointerType: string) => void;
  onStepBy: (delta: number) => void;
  onHoverChange: (active: boolean) => void;
}

/**
 * Individual Arc Card with resting Headline-only state and a desktop-only
 * velocity-reactive Orange Telemetry Blob X-Ray overlay (20% lattice opacity)
 * revealing all tags + job details.
 */
function ArcCardItem({
  study,
  index,
  isCenter,
  strokeCoupled,
  registerCardRef,
  onCardClick,
  onStepBy,
  onHoverChange,
}: ArcCardItemProps) {
  const cardElRef = useRef<HTMLDivElement | null>(null);
  const xrayLayerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointerTypeRef = useRef<string>("mouse");

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      cardElRef.current = el;
      registerCardRef(index, el);
    },
    [index, registerCardRef]
  );

  useEffect(() => {
    const card = cardElRef.current;
    const layer = xrayLayerRef.current;
    const canvas = canvasRef.current;
    if (!card || !layer || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = card.offsetWidth || 264;
    let height = card.offsetHeight || 350;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const syncSize = () => {
      width = Math.max(1, card.offsetWidth || 264);
      height = Math.max(1, card.offsetHeight || 350);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    syncSize();

    const trail = Array.from({ length: TRAIL_LOBES }, () => ({
      x: width * 0.5,
      y: height * 0.5,
    }));
    let targetX = width * 0.5;
    let targetY = height * 0.5;
    let lastX = targetX;
    let lastY = targetY;
    let speed = 0;
    let hovered = false;
    let focused = false;
    let blobAlpha = 0;
    let rafId = 0;
    const startTime = performance.now();

    const drawLattice = (elapsedSec: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 20% opacity telemetry grid & nodes for crisp #090A0C text legibility
      ctx.strokeStyle = "rgba(9, 10, 12, 0.20)";
      ctx.lineWidth = 1;

      const cellW = width / (LATTICE_COLS - 1);
      const cellH = height / (LATTICE_ROWS - 1);
      const head = trail[0];

      const gridPts: { x: number; y: number }[][] = [];
      for (let r = 0; r < LATTICE_ROWS; r++) {
        const row: { x: number; y: number }[] = [];
        for (let c = 0; c < LATTICE_COLS; c++) {
          const bx = c * cellW;
          const by = r * cellH;
          const dist = Math.hypot(bx - head.x, by - head.y);
          const lift = Math.max(0, 1 - dist / 125) * 8;
          const wave =
            Math.sin(c * 0.65 + elapsedSec * 1.6) * 2.8 +
            Math.cos(r * 0.7 + elapsedSec * 1.2) * 2.8;
          row.push({ x: bx, y: by - wave - lift });
        }
        gridPts.push(row);
      }

      ctx.beginPath();
      for (let r = 0; r < LATTICE_ROWS; r++) {
        for (let c = 0; c < LATTICE_COLS; c++) {
          const p = gridPts[r][c];
          if (c < LATTICE_COLS - 1) {
            const right = gridPts[r][c + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(right.x, right.y);
          }
          if (r < LATTICE_ROWS - 1) {
            const down = gridPts[r + 1][c];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(down.x, down.y);
          }
        }
      }
      ctx.stroke();

      ctx.fillStyle = "rgba(9, 10, 12, 0.20)";
      for (let r = 0; r < LATTICE_ROWS; r++) {
        for (let c = 0; c < LATTICE_COLS; c++) {
          const p = gridPts[r][c];
          ctx.beginPath();
          ctx.arc(p.x, p.y, (r + c) % 3 === 0 ? 2 : 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const renderStep = (now: number) => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const isActive = hovered || focused;
      const targetAlpha = isActive ? 1 : 0;
      blobAlpha +=
        (targetAlpha - blobAlpha) * (prefersReducedMotion ? 1 : 0.2);

      if (!isActive && blobAlpha <= 0.01) {
        blobAlpha = 0;
        layer.style.opacity = "0";
        rafId = 0;
        return;
      }

      layer.style.opacity = blobAlpha.toFixed(3);

      const k0 = prefersReducedMotion ? 1 : 0.26;
      const kk = prefersReducedMotion ? 1 : 0.36;

      trail[0].x += (targetX - trail[0].x) * k0;
      trail[0].y += (targetY - trail[0].y) * k0;
      for (let i = 1; i < TRAIL_LOBES; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * kk;
        trail[i].y += (trail[i - 1].y - trail[i].y) * kk;
      }

      const stepDist = prefersReducedMotion
        ? 0
        : Math.min(
            Math.hypot(trail[0].x - lastX, trail[0].y - lastY),
            36
          );
      speed += (stepDist - speed) * 0.18;
      lastX = trail[0].x;
      lastY = trail[0].y;

      if (focused && !hovered) {
        layer.style.maskImage = "none";
        layer.style.webkitMaskImage = "none";
      } else {
        const baseRadius = 136 + speed * 1.15;
        const gradients = trail
          .map((pt, idx) => {
            const taper = 0.46 + 0.54 * (1 - idx / TRAIL_LOBES);
            const r = (baseRadius * taper * (0.35 + 0.65 * blobAlpha)).toFixed(
              1
            );
            return `radial-gradient(${r}px circle at ${pt.x.toFixed(1)}px ${pt.y.toFixed(1)}px, rgba(0,0,0,1) 76%, rgba(0,0,0,0.55) 90%, transparent 100%)`;
          })
          .join(", ");
        layer.style.maskImage = gradients;
        layer.style.webkitMaskImage = gradients;
      }

      drawLattice(prefersReducedMotion ? 0 : (now - startTime) * 0.001);

      if (
        !prefersReducedMotion &&
        (isActive || blobAlpha > 0.01)
      ) {
        rafId = window.requestAnimationFrame(renderStep);
      } else {
        rafId = 0;
      }
    };

    const ensureRunning = () => {
      if (rafId === 0) {
        rafId = window.requestAnimationFrame(renderStep);
      }
    };

    const resolveLocalCoords = (e: PointerEvent) => {
      if (e.target === card) {
        return { x: e.offsetX, y: e.offsetY };
      }
      const rect = card.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / Math.max(rect.width, 1)) * width,
        y: ((e.clientY - rect.top) / Math.max(rect.height, 1)) * height,
      };
    };

    const onWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key.startsWith("Arrow")) {
        lastPointerTypeRef.current = "keyboard";
      }
    };

    const onWindowPointerDown = (e: PointerEvent) => {
      lastPointerTypeRef.current = e.pointerType || "mouse";
    };

    const onPointerEnter = (e: PointerEvent) => {
      lastPointerTypeRef.current = e.pointerType || "mouse";
      if (e.pointerType === "touch") return;
      focused = false;
      const pt = resolveLocalCoords(e);
      targetX = pt.x;
      targetY = pt.y;
      if (!hovered && blobAlpha <= 0.02) {
        for (let i = 0; i < TRAIL_LOBES; i++) {
          trail[i].x = pt.x;
          trail[i].y = pt.y;
        }
        lastX = pt.x;
        lastY = pt.y;
      }
      hovered = true;
      onHoverChange(true);
      ensureRunning();
    };

    const onPointerMove = (e: PointerEvent) => {
      lastPointerTypeRef.current = e.pointerType || "mouse";
      if (e.pointerType === "touch") return;
      focused = false;
      const pt = resolveLocalCoords(e);
      targetX = pt.x;
      targetY = pt.y;
      if (!hovered) {
        hovered = true;
        onHoverChange(true);
      }
      ensureRunning();
    };

    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      hovered = false;
      focused = false;
      onHoverChange(false);
      ensureRunning();
    };

    const onFocus = () => {
      const isFocusVisible =
        typeof card.matches === "function"
          ? card.matches(":focus-visible")
          : true;
      if (
        lastPointerTypeRef.current !== "keyboard" ||
        !isFocusVisible ||
        window.matchMedia("(hover: none)").matches
      ) {
        return;
      }
      focused = true;
      targetX = width * 0.5;
      targetY = height * 0.5;
      onHoverChange(true);
      ensureRunning();
    };

    const onBlur = () => {
      focused = false;
      onHoverChange(false);
      ensureRunning();
    };

    card.addEventListener("pointerenter", onPointerEnter, { passive: true });
    card.addEventListener("pointermove", onPointerMove, { passive: true });
    card.addEventListener("pointerleave", onPointerLeave, { passive: true });
    card.addEventListener("focus", onFocus);
    card.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onWindowKeyDown, { passive: true });
    window.addEventListener("pointerdown", onWindowPointerDown, {
      passive: true,
    });
    window.addEventListener("resize", syncSize);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      card.removeEventListener("pointerenter", onPointerEnter);
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerleave", onPointerLeave);
      card.removeEventListener("focus", onFocus);
      card.removeEventListener("blur", onBlur);
      window.removeEventListener("keydown", onWindowKeyDown);
      window.removeEventListener("pointerdown", onWindowPointerDown);
      window.removeEventListener("resize", syncSize);
    };
  }, [onHoverChange]);

  return (
    <div
      ref={setRefs}
      role="listitem"
      tabIndex={0}
      aria-label={`${study.title} — ${study.job.company}, ${study.job.role}`}
      aria-current={isCenter ? "true" : undefined}
      onPointerDown={(e) => {
        lastPointerTypeRef.current = e.pointerType || "mouse";
      }}
      onClick={() => onCardClick(index, study, lastPointerTypeRef.current)}
      onKeyDown={(e) => {
        lastPointerTypeRef.current = "keyboard";
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick(index, study, "mouse");
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          onStepBy(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          onStepBy(-1);
        }
      }}
      style={{
        boxShadow: isCenter
          ? strokeCoupled
            ? "0 0 32px 14px var(--bg-canvas), 0 0 28px rgba(255, 92, 40, 0.14)"
            : "0 0 28px 14px var(--bg-canvas)"
          : "0 0 24px 12px var(--bg-canvas)",
      }}
      className={`group absolute top-1/2 left-1/2 -mt-[165px] -ml-[118px] flex h-[330px] w-[236px] cursor-crosshair flex-col justify-center overflow-hidden border p-2.5 backdrop-blur-sm transition-colors duration-200 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal sm:-mt-[175px] sm:-ml-[132px] sm:h-[350px] sm:w-[264px] sm:p-3 ${
        isCenter
          ? strokeCoupled
            ? "border-signal bg-surface-hover/95"
            : "border-signal/65 bg-surface-hover/90"
          : "border-hairline bg-surface/90 hover:border-signal/60 hover:bg-surface-hover/90"
      }`}
    >
      {/* Resting state: ONLY the Headline is visible */}
      <div className="pointer-events-none relative z-10 my-auto">
        <h3 className="font-display text-[40px] leading-[0.92] tracking-wide text-ink-primary sm:text-[46px]">
          {study.title}
        </h3>
      </div>

      {/* X-Ray Telemetry Blob Layer: covers the headline and reveals All Tags + Job Details in the same slot */}
      <div
        ref={xrayLayerRef}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center bg-signal p-2.5 opacity-0 sm:p-3"
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        <div className="relative z-10 my-auto space-y-4 text-canvas">
          {/* Unified Tag Structure: all 2-3 tags appear together inside the X-ray slot */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-medium tracking-wider text-canvas uppercase sm:text-[13px]">
            {study.tags.map((tag) => (
              <span
                key={`${study.slug}-tag-${tag}`}
                className="inline-flex items-center gap-2"
              >
                <span className="h-2 w-2 shrink-0 bg-canvas" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Job Details occupying the exact same slot */}
          <div className="border-t border-canvas/35 pt-3.5">
            <p className="font-display text-3xl leading-[0.92] tracking-wide text-canvas sm:text-[36px]">
              {study.job.company}
            </p>
            <p className="mt-1.5 text-sm font-semibold leading-snug text-canvas/90 sm:text-base">
              {study.job.role}
            </p>
            <p className="mt-1.5 font-mono text-xs font-medium tracking-wider text-canvas/80 uppercase">
              {study.job.period}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Infinite curved arc side-scroller for Selected Work (scales dynamically with studies.length).
 * Wraps the first card seamlessly after the last card, feathers extreme horizontal ends,
 * and couples card hover, drag, and cycling directly with SvgFollowScroll's live stroke.
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

  const registerCardRef = useCallback(
    (index: number, el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    []
  );

  const drawArc = useCallback(() => {
    if (count === 0) return;
    const cards = cardRefs.current;
    const firstCard = cards[0];
    if (!firstCard) return;

    const cw = firstCard.offsetWidth || 240;
    const gap = cw * 1.12;
    const pos = posRef.current;
    const half = count / 2;

    cards.forEach((card, i) => {
      if (!card) return;
      let off = (i - pos) % count;
      if (off > half) off -= count;
      if (off < -half) off += count;

      const absOff = Math.abs(off);
      const x = off * gap;
      const y = off * off * 16;
      const rot = off * 6;
      const scale = 1 - Math.min(absOff, 3) * 0.06;
      const opacity =
        absOff >= 2.35 ? 0 : Math.pow(Math.max(0, 1 - absOff / 2.35), 1.35);
      const zIndex = 100 - Math.round(absOff * 10);

      card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = String(zIndex);
      card.style.pointerEvents = absOff > 2.15 ? "none" : "auto";
    });
  }, [count]);

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

  const goToContinuous = useCallback(
    (nextRaw: number) => {
      if (count === 0) return;
      const snapped = Math.round(nextRaw);
      targetRef.current = snapped;

      const nextMod = wrapIndex(snapped, count);
      if (nextMod !== activeIndexRef.current) {
        activeIndexRef.current = nextMod;
        setActiveIndex(nextMod);
        pulseStroke();
      }

      startAnimation();
    },
    [count, pulseStroke, startAnimation]
  );

  const stepToIndex = useCallback(
    (targetIdx: number) => {
      if (count === 0) return;
      const currentSnapped = Math.round(targetRef.current);
      const currentMod = wrapIndex(currentSnapped, count);
      let diff = (targetIdx - currentMod) % count;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      goToContinuous(currentSnapped + diff);
    },
    [count, goToContinuous]
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
      goToContinuous(Math.round(targetRef.current) + Math.sign(e.deltaX));
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
  }, [drawArc, goToContinuous]);

  // Global pointer move / up for smooth infinite arc dragging
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
      targetRef.current = drag.startTarget - dx / gap;

      const nextMod = wrapIndex(Math.round(targetRef.current), count);
      if (nextMod !== activeIndexRef.current) {
        activeIndexRef.current = nextMod;
        setActiveIndex(nextMod);
      }

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
        goToContinuous(Math.round(targetRef.current));
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
  }, [count, goToContinuous, setStrokeHighlight, startAnimation]);

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

  const openStudy = useCallback(
    (study: CaseStudy) => {
      pulseStroke();
      router.push(getCaseStudyHref(study));
    },
    [pulseStroke, router]
  );

  const handleCardClick = useCallback(
    (index: number, study: CaseStudy, pointerType: string) => {
      if (suppressClickRef.current) return;

      const isTouchDevice =
        pointerType === "touch" ||
        (typeof window !== "undefined" &&
          window.matchMedia("(hover: none)").matches);

      if (isTouchDevice || index === activeIndexRef.current) {
        openStudy(study);
      } else {
        stepToIndex(index);
      }
    },
    [openStudy, stepToIndex]
  );

  const handleStepBy = useCallback(
    (delta: number) => {
      const nextPos = Math.round(targetRef.current) + delta;
      goToContinuous(nextPos);
      cardRefs.current[wrapIndex(nextPos, count)]?.focus();
    },
    [count, goToContinuous]
  );

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
              ? "Signal active · Hover card to X-ray · Click center to open"
              : "Drag arc, hover card to X-ray, or click center to open"}
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

      {/* Infinite Curved Arc Stage with Feathered Extreme Horizontal Ends */}
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
        style={{
          maskImage: EDGE_FEATHER_MASK,
          WebkitMaskImage: EDGE_FEATHER_MASK,
        }}
        className={`relative mt-2 h-[410px] w-full touch-pan-y select-none overflow-x-clip py-6 sm:h-[440px] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {studies.map((study, index) => (
          <ArcCardItem
            key={study.slug}
            study={study}
            index={index}
            isCenter={index === activeIndex}
            strokeCoupled={strokeCoupled}
            registerCardRef={registerCardRef}
            onCardClick={handleCardClick}
            onStepBy={handleStepBy}
            onHoverChange={setStrokeHighlight}
          />
        ))}
      </div>

      {/* Scalable Project Indicator Dots (No Arrow Buttons) */}
      <div
        className="mt-2 flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Jump to project"
      >
        {studies.map((study, index) => {
          const isCurrent = index === activeIndex;
          return (
            <button
              key={study.slug}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-label={`Select ${study.title}`}
              onClick={() => stepToIndex(index)}
              className={`h-1.5 cursor-pointer transition-all duration-200 ${
                isCurrent
                  ? "w-7 bg-signal"
                  : "w-3 bg-hairline hover:bg-ink-muted"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
