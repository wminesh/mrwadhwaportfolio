import Link from "next/link";

interface ActionLinkProps {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
}

const STYLES: Record<NonNullable<ActionLinkProps["variant"]>, string> = {
  primary:
    "bg-signal text-canvas font-medium hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
  secondary:
    "border border-hairline bg-surface text-ink-primary hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
};

/**
 * Industrial flat-edge CTA link supporting both internal Next.js routes and external/mailto links.
 */
export function ActionLink({
  href,
  variant = "primary",
  children,
  className = "",
}: ActionLinkProps) {
  const isInternal = href.startsWith("/");
  const classes = `inline-flex items-center gap-2 px-5 py-3 font-mono text-xs tracking-wider uppercase transition-all ${STYLES[variant]} ${className}`;

  if (isInternal) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
