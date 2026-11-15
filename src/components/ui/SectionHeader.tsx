interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  aside?: string;
}

/**
 * Editorial section header combining monospace index, Bebas Neue display title,
 * and optional Lora italic aside.
 */
export function SectionHeader({
  index,
  label,
  title,
  aside,
}: SectionHeaderProps) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-4 border-b border-hairline pb-6 md:flex-row md:items-end">
      <div>
        <p className="font-mono text-xs tracking-widest text-signal uppercase">
          [{index} {"//"} {label}]
        </p>
        <h2 className="mt-2 font-display text-4xl leading-none tracking-wide text-ink-primary sm:text-5xl">
          {title}
        </h2>
      </div>
      {aside ? (
        <p className="max-w-md font-serif text-base italic text-ink-secondary">
          {aside}
        </p>
      ) : null}
    </div>
  );
}
