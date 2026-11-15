"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface AnimatedCounterProps {
  prefix?: string;
  target: number;
  decimals?: number;
  suffix?: string;
  fallbackText: string;
}

/**
 * GSAP ScrollTrigger numeric counter that animates from 0 to target on first viewport entry.
 */
export function AnimatedCounter({
  prefix = "",
  target,
  decimals = 0,
  suffix = "",
  fallbackText,
}: AnimatedCounterProps) {
  const numRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = numRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        el.textContent = fallbackText;
        return;
      }

      const counter = { val: 0 };
      gsap.to(counter, {
        val: target,
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = `${prefix}${counter.val.toFixed(decimals)}${suffix}`;
        },
        onComplete: () => {
          el.textContent = fallbackText;
        },
      });
    },
    { scope: numRef, dependencies: [target, decimals, prefix, suffix, fallbackText] }
  );

  return <span ref={numRef}>{fallbackText}</span>;
}
