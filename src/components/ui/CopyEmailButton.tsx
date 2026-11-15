"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyEmailButtonProps {
  email: string;
  className?: string;
}

/**
 * Copies the contact email to clipboard with immediate visual confirmation.
 */
export function CopyEmailButton({
  email,
  className = "",
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: let mailto handle environments without clipboard permissions
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className={`inline-flex cursor-pointer items-center gap-2 border border-hairline bg-surface px-5 py-3 font-mono text-xs tracking-wider text-ink-primary uppercase transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-signal" />
          <span className="text-signal">Copied {email}</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-ink-muted" />
          <span>Copy Email</span>
        </>
      )}
    </button>
  );
}
