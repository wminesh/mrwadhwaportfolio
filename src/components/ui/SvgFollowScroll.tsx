"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const FOLLOW_SCROLL_PATH =
  "M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89";

const SVG_VIEWBOX_WIDTH = 1278;
const SVG_VIEWBOX_HEIGHT = 2319;

interface SvgFollowScrollContextValue {
  setStrokeHighlight: (active: boolean) => void;
  pulseStroke: () => void;
}

const SvgFollowScrollContext = createContext<SvgFollowScrollContextValue>({
  setStrokeHighlight: () => {},
  pulseStroke: () => {},
});

/**
 * Allows downstream interactive sections (such as WorkShowcase cards)
 * to highlight or pulse the live scroll stroke on hover and card transitions.
 */
export function useSvgFollowScroll() {
  return useContext(SvgFollowScrollContext);
}

export interface SvgFollowScrollProps {
  children?: ReactNode;
  className?: string;
  svgClassName?: string;
  strokeColor?: string;
  guideColor?: string;
  strokeWidth?: number;
  initialProgress?: number;
  showGuide?: boolean;
  showBeacon?: boolean;
  glowOpacity?: number;
}

/**
 * Scroll-driven SVG telemetry trail synced to Lenis + GSAP ScrollTrigger.
 * Renders a hairline blueprint route underneath a scrubbed signal stroke and leading cursor beacon.
 * Respects `prefers-reduced-motion: reduce` by rendering the completed path statically.
 */
export function SvgFollowScroll({
  children,
  className = "",
  svgClassName = "",
  strokeColor = "var(--accent-signal)",
  guideColor = "var(--border-hairline)",
  strokeWidth = 2.25,
  initialProgress = 0.5,
  showGuide = true,
  showBeacon = true,
  glowOpacity = 0.14,
}: SvgFollowScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const auraRef = useRef<SVGPathElement>(null);
  const beaconRef = useRef<HTMLSpanElement>(null);

  const setStrokeHighlight = useCallback(
    (active: boolean) => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      if (pathRef.current) {
        gsap.to(pathRef.current, {
          attr: { "stroke-width": active ? strokeWidth + 1.1 : strokeWidth },
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (auraRef.current) {
        gsap.to(auraRef.current, {
          attr: {
            "stroke-opacity": active
              ? Math.min(0.38, glowOpacity * 2.5)
              : glowOpacity,
            "stroke-width": active ? strokeWidth * 6 : strokeWidth * 4.5,
          },
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (beaconRef.current) {
        gsap.to(beaconRef.current, {
          scale: active ? 1.35 : 1,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    },
    [glowOpacity, strokeWidth]
  );

  const pulseStroke = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    if (auraRef.current) {
      gsap.fromTo(
        auraRef.current,
        {
          attr: {
            "stroke-opacity": Math.min(0.5, glowOpacity * 3.2),
            "stroke-width": strokeWidth * 7,
          },
        },
        {
          attr: {
            "stroke-opacity": glowOpacity,
            "stroke-width": strokeWidth * 4.5,
          },
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    }

    if (beaconRef.current) {
      gsap.fromTo(
        beaconRef.current,
        { scale: 1.75 },
        { scale: 1, duration: 0.45, ease: "power2.out", overwrite: "auto" }
      );
    }
  }, [glowOpacity, strokeWidth]);

  const contextValue = useMemo(
    () => ({ setStrokeHighlight, pulseStroke }),
    [setStrokeHighlight, pulseStroke]
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      const path = pathRef.current;
      if (!section || !path) return;

      const totalLength = path.getTotalLength();
      const clampedInitial = Math.min(Math.max(initialProgress, 0), 1);
      const startOffset = totalLength * (1 - clampedInitial);

      const strokeTargets: SVGPathElement[] = auraRef.current
        ? [path, auraRef.current]
        : [path];

      const updateBeacon = (drawnLength: number) => {
        const beacon = beaconRef.current;
        if (!beacon || !showBeacon) return;
        const safeLength = Math.min(Math.max(drawnLength, 0), totalLength);
        const pt = path.getPointAtLength(safeLength);
        beacon.style.left = `${(pt.x / SVG_VIEWBOX_WIDTH) * 100}%`;
        beacon.style.top = `${(pt.y / SVG_VIEWBOX_HEIGHT) * 100}%`;
      };

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.set(strokeTargets, {
        strokeDasharray: totalLength,
        strokeDashoffset: prefersReducedMotion ? 0 : startOffset,
      });

      if (prefersReducedMotion) {
        updateBeacon(totalLength);
        return;
      }

      updateBeacon(totalLength - startOffset);

      gsap.fromTo(
        strokeTargets,
        { strokeDashoffset: startOffset },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const currentOffset = startOffset * (1 - self.progress);
              updateBeacon(totalLength - currentOffset);
              section.style.setProperty(
                "--stroke-progress",
                self.progress.toFixed(4)
              );
            },
          },
        }
      );

      const rafId = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        window.cancelAnimationFrame(rafId);
      };
    },
    {
      scope: sectionRef,
      dependencies: [initialProgress, showBeacon, glowOpacity],
    }
  );

  return (
    <SvgFollowScrollContext.Provider value={contextValue}>
      <div
        ref={sectionRef}
        className={`relative w-full overflow-x-clip bg-canvas text-ink-primary ${className}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <div className="relative mx-auto h-[86.5%] w-full max-w-[1440px]">
            <svg
              viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
              fill="none"
              overflow="visible"
              preserveAspectRatio="none"
              className={`block h-full w-full ${svgClassName}`}
            >
              {showGuide ? (
                <path
                  d={FOLLOW_SCROLL_PATH}
                  stroke={guideColor}
                  strokeWidth={1}
                  strokeOpacity={0.55}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}

              {glowOpacity > 0 ? (
                <path
                  ref={auraRef}
                  d={FOLLOW_SCROLL_PATH}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth * 4.5}
                  strokeOpacity={glowOpacity}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}

              <path
                ref={pathRef}
                d={FOLLOW_SCROLL_PATH}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {showBeacon ? (
              <span
                ref={beaconRef}
                className="pointer-events-none absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: "83.2%", top: "21.7%" }}
              >
                <span
                  className="absolute inset-0 rounded-full opacity-35"
                  style={{ backgroundColor: strokeColor }}
                />
                <span
                  className="relative h-2.5 w-2.5 rounded-full bg-canvas"
                  style={{
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: strokeColor,
                  }}
                />
              </span>
            ) : null}
          </div>
        </div>

        <div className="relative z-10">{children}</div>
      </div>
    </SvgFollowScrollContext.Provider>
  );
}
