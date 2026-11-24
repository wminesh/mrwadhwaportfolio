"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { HeroTextInversionOverlay } from "@/components/canvas/HeroTextInversionOverlay";
import { CareerTimeline } from "@/components/experience/CareerTimeline";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ActionLink } from "@/components/ui/ActionLink";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { MetricCell } from "@/components/ui/MetricCell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SvgFollowScroll } from "@/components/ui/SvgFollowScroll";
import { WorkShowcase } from "@/components/work/WorkShowcase";
import {
  CAREER_TIMELINE_EVENTS,
  FLAGSHIP_CASE_STUDIES,
  PROOF_METRICS,
  SITE_META,
} from "@/data/portfolio";
import { gsap, useGSAP } from "@/lib/gsap";

const HEADLINE_WORDS = SITE_META.heroHeadline.split(" ");

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      gsap.from("[data-hero-reveal]", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });

      gsap.from("[data-proof-strip]", {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        clearProps: "opacity",
        scrollTrigger: {
          trigger: "[data-proof-strip]",
          start: "top 86%",
          once: true,
        },
      });

      gsap.from("[data-proof-cell]", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: "[data-proof-strip]",
          start: "top 86%",
          once: true,
        },
      });

      gsap.utils
        .toArray<HTMLElement>("[data-section-reveal]")
        .forEach((sectionEl) => {
          gsap.from(sectionEl, {
            y: 20,
            opacity: 0,
            duration: 0.55,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top 86%",
              once: true,
            },
          });
        });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="relative min-h-screen bg-canvas">
      <SiteHeader />

      <SvgFollowScroll initialProgress={0.5}>
        <main>
          <section className="relative w-full overflow-hidden">
            <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-center px-6 py-16 sm:py-20">
              <div className="py-8">
                <h1
                  ref={headlineRef}
                  data-hero-reveal
                  aria-label={SITE_META.heroHeadline}
                  className="max-w-5xl font-display text-5xl leading-[0.95] tracking-wide text-ink-primary sm:text-7xl"
                >
                  {HEADLINE_WORDS.map((word, idx) => (
                    <span key={`${word}-${idx}`}>
                      <span data-word aria-hidden="true">
                        {word}
                      </span>
                      {idx < HEADLINE_WORDS.length - 1 ? " " : ""}
                    </span>
                  ))}
                </h1>
              </div>
            </div>

            <HeroTextInversionOverlay headlineRef={headlineRef} />
          </section>

          <div className="mx-auto max-w-6xl px-6">
            <section
              aria-label="Verified impact metrics"
              data-proof-strip
              className="grid grid-cols-1 border-t border-l border-hairline sm:grid-cols-2 lg:grid-cols-4"
            >
              {PROOF_METRICS.map((item) => (
                <div key={item.id} data-proof-cell className="flex">
                  <MetricCell
                    value={item.value}
                    label={item.label}
                    scope={item.scope}
                    href={item.href}
                    counter={item.counter}
                    className="w-full"
                  />
                </div>
              ))}
            </section>

            <section id="work" className="mt-16 scroll-mt-20 sm:mt-24">
              <div data-section-reveal>
                <SectionHeader
                  index="01"
                  label="SELECTED WORK"
                  title={`${FLAGSHIP_CASE_STUDIES.length} Case Studies`}
                  aside="Drag the arc, scroll sideways, or click the center card."
                />
              </div>
              <WorkShowcase studies={FLAGSHIP_CASE_STUDIES} />
            </section>

            <section id="experience" className="mt-16 scroll-mt-20 sm:mt-24">
              <div data-section-reveal>
                <SectionHeader
                  index="02"
                  label="CAREER CONSOLE"
                  title="Experience & Credentials"
                  aside="10+ years across retail systems, EdTech, and growth."
                />
              </div>
              <CareerTimeline events={CAREER_TIMELINE_EVENTS} />
            </section>

            <section id="contact" data-section-reveal className="mt-16 pb-10 sm:mt-24">
              <div className="border border-hairline bg-surface/80 p-8 backdrop-blur-sm sm:p-12">
                <p className="font-mono text-xs tracking-widest text-signal uppercase">
                  [03 {"//"} NEXT STEP]
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-4xl leading-none tracking-wide text-ink-primary sm:text-6xl">
                  Let&apos;s talk shop.
                </h2>
                <p className="mt-3 max-w-md font-serif text-lg italic text-ink-secondary">
                  {SITE_META.location} · {SITE_META.phone}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ActionLink
                    href={`mailto:${SITE_META.email}`}
                    variant="primary"
                  >
                    Email {SITE_META.email}
                    <ArrowUpRight className="h-4 w-4" />
                  </ActionLink>
                  <CopyEmailButton email={SITE_META.email} />
                </div>
              </div>
            </section>
          </div>
        </main>
      </SvgFollowScroll>

      <SiteFooter />
    </div>
  );
}
