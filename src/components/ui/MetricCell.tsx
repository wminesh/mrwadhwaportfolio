import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface MetricCellProps {
  value: string;
  label: string;
  scope?: string;
  href?: string;
  counter?: {
    prefix?: string;
    target: number;
    decimals?: number;
    suffix?: string;
  };
  className?: string;
}

/**
 * Hairline-bordered telemetry cell displaying a tabular monospace metric, optional counter animation,
 * and optional link to its matching case study.
 */
export function MetricCell({
  value,
  label,
  scope,
  href,
  counter,
  className = "",
}: MetricCellProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-2xl font-medium tracking-tight tabular-nums text-signal sm:text-3xl">
          {counter ? (
            <AnimatedCounter
              prefix={counter.prefix}
              target={counter.target}
              decimals={counter.decimals}
              suffix={counter.suffix}
              fallbackText={value}
            />
          ) : (
            value
          )}
        </p>
        {scope ? (
          <span className="border border-hairline px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-ink-muted uppercase">
            {scope}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-xs leading-snug text-ink-secondary sm:text-sm">
        {label}
      </p>
    </>
  );

  const baseClasses = `flex flex-col justify-between border-r border-b border-hairline bg-surface/80 backdrop-blur-sm p-6 transition-colors hover:bg-surface-hover ${className}`;

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} group`}>
        {body}
      </Link>
    );
  }

  return <div className={baseClasses}>{body}</div>;
}
