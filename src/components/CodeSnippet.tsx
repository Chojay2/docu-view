"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeSnippetProps {
  code: string;
  language: "curl" | "javascript" | "python";
  title?: string;
}

export function CodeSnippet({ code, language, title }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languageLabels = {
    curl: "cURL",
    javascript: "JavaScript",
    python: "Python",
  };

  return (
    <div className="bg-[var(--color-bg-surface-soft)] rounded-lg border border-[var(--color-border-subtle)] overflow-hidden">
      {title && (
        <div className="px-4 py-2 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <span className="text-[14px] font-medium text-[var(--color-text-primary)]">
            {title || languageLabels[language]}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-[14px] text-[var(--color-text-primary)] font-mono">
          {code}
        </code>
      </pre>
    </div>
  );
}
