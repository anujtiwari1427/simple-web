"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  filename?: string;
  className?: string;
}

// Lightweight syntax highlighter based on Section 6 palette tokens
function highlightCode(code: string): React.ReactNode[] {
  const lines = code.split("\n");

  return lines.map((line, lineIndex) => {
    // Regex matching tokens for python/js/ts
    const tokenRegex =
      /(\/\/[^\n]*|#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:def|return|const|let|var|function|if|else|for|while|import|from|export|as|class|async|await|try|except|in|is|not|and|or|true|false|null|undefined|None|True|False)\b)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\())|([{}()[\].,;:+\-*/%=<>!&|^~]+)|(\s+)|([A-Za-z_][A-Za-z0-9_]*)/g;

    const tokens: React.ReactNode[] = [];
    let match;
    let lastIndex = 0;

    while ((match = tokenRegex.exec(line)) !== null) {
      const [
        full,
        comment,
        stringVal,
        keyword,
        numberVal,
        functionCall,
        symbol,
        whitespace,
        identifier,
      ] = match;

      const key = `${lineIndex}-${match.index}`;

      if (comment) {
        tokens.push(
          <span key={key} className="text-[#8FA0B8] italic">
            {comment}
          </span>
        );
      } else if (stringVal) {
        tokens.push(
          <span key={key} className="text-[#3DD68C]">
            {stringVal}
          </span>
        );
      } else if (keyword) {
        tokens.push(
          <span key={key} className="text-[#6BB6F5] font-medium">
            {keyword}
          </span>
        );
      } else if (numberVal) {
        tokens.push(
          <span key={key} className="text-[#F5B84B]">
            {numberVal}
          </span>
        );
      } else if (functionCall) {
        tokens.push(
          <span key={key} className="text-[#F7F8FA]">
            {functionCall}
          </span>
        );
      } else if (symbol) {
        tokens.push(
          <span key={key} className="text-[#8FA0B8]">
            {symbol}
          </span>
        );
      } else if (whitespace) {
        tokens.push(
          <span key={key}>{whitespace}</span>
        );
      } else if (identifier) {
        tokens.push(
          <span key={key} className="text-[#C9D3E3]">
            {identifier}
          </span>
        );
      } else {
        tokens.push(<span key={key}>{full}</span>);
      }
    }

    if (tokens.length === 0) {
      tokens.push(<span key={`${lineIndex}-empty`}>&nbsp;</span>);
    }

    return (
      <div key={lineIndex} className="table-row">
        {lines.length >= 8 ? (
          <span className="table-cell pr-4 text-right select-none text-[var(--muted)] opacity-60 text-xs font-mono">
            {lineIndex + 1}
          </span>
        ) : null}
        <span className="table-cell">{tokens}</span>
      </div>
    );
  });
}

export function CodeBlock({
  code,
  language = "python",
  showLineNumbers,
  filename,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // 1.5s per Section 8
    } catch {
      // fallback
    }
  };

  const lineCount = code.trim().split("\n").length;
  const shouldShowNumbers =
    showLineNumbers !== undefined ? showLineNumbers : lineCount >= 8;

  return (
    <div
      className={`rounded-[12px] bg-[var(--surface)] border border-[var(--border)] overflow-hidden text-left ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-deep)]/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-display text-[var(--muted)]">
            {filename || language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-display rounded-[4px] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--heading)] hover:border-[var(--muted)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--success)]" />
              <span className="text-[var(--success)] font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents */}
      <div className="p-4 overflow-x-auto text-[0.9rem] font-code leading-[1.65]">
        <pre className="table w-full">
          <code>
            {code.split("\n").map((line, idx) => (
              <div key={idx} className="table-row">
                {shouldShowNumbers && (
                  <span className="table-cell pr-4 text-right select-none text-[var(--muted)] opacity-60 text-xs font-mono w-8">
                    {idx + 1}
                  </span>
                )}
                <span className="table-cell whitespace-pre">{highlightCode(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
