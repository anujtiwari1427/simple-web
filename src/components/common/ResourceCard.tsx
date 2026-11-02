"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Code2, BookOpen, Layers } from "lucide-react";
import { Resource } from "@/types";
import { Tag } from "./Tag";
import { DecodeText } from "./DecodeText";

interface ResourceCardProps {
  resource: Resource;
  enableHoverDecode?: boolean;
}

export function ResourceCard({
  resource,
  enableHoverDecode = false,
}: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Type icon selector
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
      case "notes":
        return <FileText className="w-5 h-5 text-[var(--accent)]" />;
      case "cheat sheet":
        return <Layers className="w-5 h-5 text-[var(--accent)]" />;
      case "repo":
      case "project":
        return <Code2 className="w-5 h-5 text-[var(--accent)]" />;
      default:
        return <BookOpen className="w-5 h-5 text-[var(--accent)]" />;
    }
  };

  // Difficulty dot scale: Beginner (1/3), Intermediate (2/3), Advanced (3/3)
  const getDifficultyDots = (difficulty: string) => {
    const level = difficulty.toLowerCase();
    const count = level === "advanced" ? 3 : level === "intermediate" ? 2 : 1;

    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] font-display">
        <span className="inline-flex items-center gap-0.5" aria-hidden="true">
          <span className={`w-1.5 h-1.5 rounded-full ${count >= 1 ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
          <span className={`w-1.5 h-1.5 rounded-full ${count >= 2 ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
          <span className={`w-1.5 h-1.5 rounded-full ${count >= 3 ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
        </span>
        <span>{difficulty}</span>
      </div>
    );
  };

  // Check if item is under 14 days old for "New" badge (Section 6 requirement)
  const isNewItem = (() => {
    if (resource.isNew) return true;
    if (resource.publishedAt) {
      const pubDate = new Date(resource.publishedAt);
      const diffDays = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 14;
    }
    return false;
  })();

  const actionLabel = (() => {
    if (resource.type.toLowerCase() === "pdf") return "Download PDF";
    if (resource.type.toLowerCase().includes("cheat")) return "Download PDF";
    if (resource.type.toLowerCase().includes("notes")) return "Read notes";
    return "Browse resource";
  })();

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-6 flex flex-col justify-between transition-colors duration-150 relative text-left"
    >
      <div>
        {/* Top bar: Type icon & Badges */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-display text-[var(--muted)]">
            {getTypeIcon(resource.type)}
            <span>{resource.type}</span>
          </div>

          <div className="flex items-center gap-2">
            {isNewItem && (
              <span className="px-2 py-0.5 rounded-[6px] bg-[var(--accent)] text-[var(--ink-950)] text-xs font-semibold font-display">
                New
              </span>
            )}
            {getDifficultyDots(resource.difficulty)}
          </div>
        </div>

        {/* Title (H3 per Section 6) */}
        <h3 className="text-h3 font-display font-semibold text-[var(--heading)] mb-2 line-clamp-2">
          <Link
            href={`/resources/${resource.slug}`}
            className="hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-[4px]"
          >
            {resource.title}
          </Link>
        </h3>

        {/* Two-line description (supports hover decode in resources hub) */}
        <div className="text-small text-[var(--muted)] mb-5 line-clamp-2 font-display leading-relaxed">
          {enableHoverDecode ? (
            <DecodeText
              text={resource.description}
              trigger="hover"
              isHovered={isHovered}
              durationMs={800}
            />
          ) : (
            resource.description
          )}
        </div>
      </div>

      <div>
        {/* Topic Tag(s) */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          <Tag>{resource.topic}</Tag>
          {resource.fileSize && (
            <span className="text-xs text-[var(--muted)] self-center ml-1 tabular-nums">
              {resource.fileSize}
            </span>
          )}
        </div>

        {/* Action Button (Section 6 spec) */}
        <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between">
          <Link
            href={`/resources/${resource.slug}`}
            className="inline-flex items-center justify-center font-display font-semibold text-sm rounded-[6px] min-h-[44px] px-4 py-2 bg-[var(--accent)] text-[var(--ink-950)] hover:bg-[var(--accent-hover)] transition-colors w-full focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
