"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, FileText } from "lucide-react";
import type { CaseStudyBlock } from "@/data/portfolio";

interface CaseStudyBlockRendererProps {
  blocks: CaseStudyBlock[];
}

function withBasePath(src: string): string {
  if (!src.startsWith("/")) return src;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${src}`;
}

function BlockHeading({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p className="mb-3 font-mono text-[11px] tracking-widest text-ink-muted uppercase">
      {children}
    </p>
  );
}

function AbSwitcherBlock({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "ab-switcher" }>;
}) {
  const [selectedId, setSelectedId] = useState(block.variants[0]?.id ?? "");
  const active =
    block.variants.find((variant) => variant.id === selectedId) ??
    block.variants[0];

  if (!active) return null;

  return (
    <div className="border border-hairline bg-canvas p-5">
      <BlockHeading>{block.heading}</BlockHeading>
      {block.intro ? (
        <p className="mb-4 max-w-prose text-sm leading-relaxed text-ink-secondary">
          {block.intro}
        </p>
      ) : null}

      <div
        role="tablist"
        aria-label={block.heading ?? "CTA variants"}
        className="flex flex-wrap gap-2"
      >
        {block.variants.map((variant) => {
          const isSelected = variant.id === active.id;
          return (
            <button
              key={variant.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedId(variant.id)}
              className={`cursor-pointer border px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors ${
                isSelected
                  ? "border-signal bg-signal text-canvas font-medium"
                  : "border-hairline bg-surface text-ink-secondary hover:bg-surface-hover hover:text-ink-primary"
              }`}
            >
              {variant.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 border-t border-hairline pt-4 md:grid-cols-12 md:items-center">
        <div className="overflow-hidden border border-hairline bg-surface md:col-span-7">
          <Image
            src={withBasePath(active.image)}
            alt={`${active.label} creative variant`}
            width={active.width}
            height={active.height}
            className="h-auto w-full object-cover"
          />
        </div>
        <div className="space-y-3 md:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-signal/40 bg-signal/10 px-2.5 py-1 font-mono text-[11px] tracking-wider text-signal uppercase">
              {active.metric}
            </span>
            <span className="border border-hairline bg-surface px-2.5 py-1 font-mono text-[11px] tracking-wider text-ink-muted uppercase">
              {active.audience}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-ink-secondary">
            {active.note}
          </p>
        </div>
      </div>
    </div>
  );
}

function ChannelTabsBlock({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "channel-tabs" }>;
}) {
  const [selectedId, setSelectedId] = useState(block.channels[0]?.id ?? "");
  const active =
    block.channels.find((channel) => channel.id === selectedId) ??
    block.channels[0];

  if (!active) return null;

  return (
    <div className="border border-hairline bg-canvas p-5">
      <BlockHeading>{block.heading}</BlockHeading>

      <div
        role="tablist"
        aria-label={block.heading ?? "Distribution channels"}
        className="flex flex-wrap gap-2"
      >
        {block.channels.map((channel) => {
          const isSelected = channel.id === active.id;
          return (
            <button
              key={channel.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedId(channel.id)}
              className={`cursor-pointer border px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors ${
                isSelected
                  ? "border-signal bg-signal text-canvas font-medium"
                  : "border-hairline bg-surface text-ink-secondary hover:bg-surface-hover hover:text-ink-primary"
              }`}
            >
              {channel.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-hairline pt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-2xl tracking-wide text-ink-primary">
            {active.metric}
          </p>
          <span className="font-mono text-[11px] tracking-widest text-signal uppercase">
            {active.cadence}
          </span>
        </div>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-secondary">
          {active.summary}
        </p>
        <ul className="mt-3 space-y-1.5">
          {active.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-secondary"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Composable renderer for structured case-study blocks (math, comparisons,
 * funnels, timelines, interactive tabs, and curated media artifacts).
 */
export function CaseStudyBlockRenderer({
  blocks,
}: CaseStudyBlockRendererProps) {
  return (
    <div className="mt-4 space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "prose":
            return (
              <div key={index} className="space-y-3">
                {block.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-prose text-base leading-relaxed text-ink-secondary"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            );

          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <div key={index}>
                <BlockHeading>{block.heading}</BlockHeading>
                <ListTag className="space-y-2.5">
                  {block.items.map((item, itemIdx) => (
                    <li
                      key={`${item.label ?? ""}-${itemIdx}`}
                      className="flex items-start gap-3 text-sm leading-relaxed text-ink-secondary sm:text-base"
                    >
                      <span className="mt-1 shrink-0 font-mono text-xs text-signal">
                        {block.ordered
                          ? String(itemIdx + 1).padStart(2, "0")
                          : "—"}
                      </span>
                      <span>
                        {item.label ? (
                          <strong className="font-medium text-ink-primary">
                            {item.label}:{" "}
                          </strong>
                        ) : null}
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ListTag>
              </div>
            );
          }

          case "math":
            return (
              <div
                key={index}
                className="border border-hairline bg-canvas p-5 font-mono"
              >
                <BlockHeading>{block.heading}</BlockHeading>
                <div className="divide-y divide-hairline">
                  {block.lines.map((line) => (
                    <div
                      key={line.key}
                      className="flex flex-col justify-between gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                      <div>
                        <span
                          className={`text-xs ${
                            line.highlight
                              ? "text-ink-primary"
                              : "text-ink-secondary"
                          }`}
                        >
                          {line.key}
                        </span>
                        {line.note ? (
                          <p className="mt-0.5 text-[11px] text-ink-muted">
                            {line.note}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={`shrink-0 text-sm font-medium sm:text-base ${
                          line.highlight ? "text-signal" : "text-ink-primary"
                        }`}
                      >
                        {line.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );

          case "comparison":
            return (
              <div
                key={index}
                className="grid grid-cols-1 border-t border-l border-hairline md:grid-cols-2"
              >
                {[
                  { side: block.left, accent: false },
                  { side: block.right, accent: true },
                ].map(({ side, accent }) => (
                  <div
                    key={side.title}
                    className="border-r border-b border-hairline bg-canvas p-5"
                  >
                    <span
                      className={`font-mono text-[11px] tracking-widest uppercase ${
                        accent ? "text-signal" : "text-ink-muted"
                      }`}
                    >
                      {side.badge}
                    </span>
                    <h3 className="mt-2 font-display text-2xl tracking-wide text-ink-primary">
                      {side.title}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {side.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-secondary"
                        >
                          <span
                            aria-hidden="true"
                            className={`mt-2 h-1.5 w-1.5 shrink-0 ${
                              accent ? "bg-signal" : "bg-ink-muted"
                            }`}
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );

          case "table":
            return (
              <div
                key={index}
                className="overflow-x-auto border border-hairline bg-canvas"
              >
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-hairline bg-surface-hover">
                      {block.columns.map((col) => (
                        <th
                          key={col}
                          className="px-4 py-3 font-mono text-[11px] font-medium tracking-wider text-ink-muted uppercase"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {block.rows.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-4 py-3 align-top leading-relaxed ${
                              cellIdx === 0
                                ? "font-mono text-xs text-signal"
                                : cellIdx === row.length - 1
                                  ? "text-ink-primary"
                                  : "text-ink-secondary"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "funnel":
            return (
              <div
                key={index}
                className="border border-hairline bg-canvas p-5"
              >
                <BlockHeading>{block.heading}</BlockHeading>
                <div className="space-y-4">
                  {block.stages.map((stage) => (
                    <div key={stage.stage} className="space-y-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-mono text-xs text-ink-muted uppercase">
                          {stage.stage}
                        </span>
                        <div className="flex items-baseline gap-2.5">
                          <span className="font-mono text-[11px] text-signal">
                            {stage.share}
                          </span>
                          <span className="font-display text-xl tracking-wide text-ink-primary">
                            {stage.metric}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-surface-hover">
                        <div
                          className="h-full bg-signal transition-all duration-500"
                          style={{ width: `${stage.widthPct}%` }}
                        />
                      </div>
                      <p className="text-xs leading-relaxed text-ink-secondary">
                        {stage.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );

          case "timeline":
            return (
              <div
                key={index}
                className="border border-hairline bg-canvas p-5"
              >
                <BlockHeading>{block.heading}</BlockHeading>
                <ol className="space-y-3 border-l border-hairline pl-4">
                  {block.steps.map((step) => (
                    <li key={step.window} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[21px] top-1.5 h-2 w-2 bg-signal"
                      />
                      <div className="flex flex-wrap items-baseline gap-2.5">
                        <span className="border border-signal/35 bg-signal/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-signal uppercase">
                          {step.window}
                        </span>
                        <span className="font-medium text-ink-primary">
                          {step.title}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                        {step.detail}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            );

          case "ab-switcher":
            return <AbSwitcherBlock key={index} block={block} />;

          case "channel-tabs":
            return <ChannelTabsBlock key={index} block={block} />;

          case "media-grid": {
            const colsClass =
              block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
            return (
              <div key={index}>
                <BlockHeading>{block.heading}</BlockHeading>
                <div className={`grid grid-cols-1 gap-4 ${colsClass}`}>
                  {block.items.map((item) =>
                    item.kind === "pdf" ? (
                      <a
                        key={item.src}
                        href={withBasePath(item.src)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col justify-between border border-hairline bg-canvas p-5 transition-colors hover:border-signal/60 hover:bg-surface-hover"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="border border-signal/35 bg-signal/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-signal uppercase">
                              {item.badge ?? "PDF"}
                            </span>
                            <ArrowUpRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal" />
                          </div>
                          <div className="mt-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-hairline bg-surface text-signal">
                              <FileText className="h-5 w-5" />
                            </div>
                            <p className="font-display text-2xl leading-tight tracking-wide text-ink-primary group-hover:text-signal">
                              {item.title ?? item.alt}
                            </p>
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-ink-secondary">
                            {item.caption}
                          </p>
                        </div>
                        <span className="mt-5 font-mono text-[11px] tracking-wider text-signal uppercase">
                          Open Snapshot PDF →
                        </span>
                      </a>
                    ) : (
                      <figure
                        key={item.src}
                        className="flex flex-col justify-between border border-hairline bg-canvas"
                      >
                        <div className="relative overflow-hidden border-b border-hairline bg-surface">
                          {item.badge ? (
                            <span className="absolute top-2.5 left-2.5 z-10 border border-hairline bg-canvas/90 px-2 py-0.5 font-mono text-[10px] tracking-wider text-signal uppercase backdrop-blur-sm">
                              {item.badge}
                            </span>
                          ) : null}
                          <Image
                            src={withBasePath(item.src)}
                            alt={item.alt}
                            width={item.width ?? 1200}
                            height={item.height ?? 800}
                            className="h-auto w-full object-cover"
                          />
                        </div>
                        <figcaption className="p-3.5 text-xs leading-relaxed text-ink-secondary">
                          {item.caption}
                        </figcaption>
                      </figure>
                    )
                  )}
                </div>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
