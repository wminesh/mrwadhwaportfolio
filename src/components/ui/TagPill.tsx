interface TagPillProps {
  children: React.ReactNode;
  variant?: "default" | "signal" | "muted";
  scope?: string;
}

const VARIANT_CLASSES: Record<NonNullable<TagPillProps["variant"]>, string> = {
  default: "border-hairline bg-surface-hover text-ink-primary",
  signal: "border-signal/35 bg-signal/10 text-signal",
  muted: "border-hairline bg-canvas text-ink-muted",
};

/**
 * Compact monospace pill for verified metric badges and category tags.
 */
export function TagPill({
  children,
  variant = "default",
  scope,
}: TagPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] tracking-wider uppercase ${VARIANT_CLASSES[variant]}`}
    >
      <span>{children}</span>
      {scope ? (
        <span className="border-l border-current/25 pl-1.5 text-[10px] opacity-75">
          {scope}
        </span>
      ) : null}
    </span>
  );
}
