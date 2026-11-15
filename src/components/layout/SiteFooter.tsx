import Link from "next/link";
import { SITE_META } from "@/data/portfolio";

/**
 * Minimal hairline-bordered footer with direct contact links.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-hairline bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-xs tracking-widest text-ink-primary uppercase">
            {SITE_META.name} · {SITE_META.role}
          </p>
          <p className="mt-1 font-mono text-xs text-ink-muted">
            {SITE_META.location} · {SITE_META.phone}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase">
          <Link
            href="/design-system"
            className="text-ink-secondary transition-colors hover:text-signal"
          >
            [Design System]
          </Link>
          <a
            href={`mailto:${SITE_META.email}`}
            className="text-signal transition-opacity hover:opacity-80"
          >
            {SITE_META.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
