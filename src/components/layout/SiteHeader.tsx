"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SITE_META } from "@/data/portfolio";

const NAV_ITEMS = [
  { index: "01", label: "Work", href: "/#work", match: "/work" },
  { index: "02", label: "Experience", href: "/#experience", match: "/#experience" },
  { index: "03", label: "Design System", href: "/design-system", match: "/design-system" },
];

/**
 * Sticky hairline-bordered navigation bar with mobile drawer support.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="font-mono text-xs tracking-widest text-ink-primary uppercase transition-colors hover:text-signal"
        >
          {SITE_META.name}
        </Link>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.match !== "/#experience" && pathname.startsWith(item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`hidden font-mono text-xs tracking-wider uppercase transition-colors hover:text-signal sm:inline-flex ${
                  isActive ? "text-signal" : "text-ink-secondary"
                }`}
              >
                <span className="mr-1.5 text-ink-muted">[{item.index}]</span>
                {item.label}
              </Link>
            );
          })}

          <a
            href={`mailto:${SITE_META.email}`}
            className="hidden border border-hairline bg-surface px-3 py-1.5 font-mono text-xs tracking-wider text-signal uppercase transition-colors hover:bg-surface-hover sm:inline-flex"
          >
            Contact
          </a>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center border border-hairline bg-surface p-2 text-ink-primary transition-colors hover:bg-surface-hover sm:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </div>

      {menuOpen ? (
        <div className="border-t border-hairline bg-canvas px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-hairline pb-3 font-mono text-xs tracking-wider text-ink-secondary uppercase transition-colors hover:text-signal"
              >
                <span className="mr-2 text-ink-muted">[{item.index}]</span>
                {item.label}
              </Link>
            ))}
            <a
              href={`mailto:${SITE_META.email}`}
              onClick={() => setMenuOpen(false)}
              className="mt-1 inline-flex w-full justify-center border border-signal/40 bg-signal/10 px-4 py-2.5 font-mono text-xs tracking-wider text-signal uppercase"
            >
              {SITE_META.email}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
