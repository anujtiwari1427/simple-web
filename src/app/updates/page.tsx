"use client";

import { useState } from "react";
import Link from "next/link";
import { initialUpdates } from "@/data/updatesData";
import { Tag } from "@/components/common/Tag";

const CATEGORIES = ["All", "Resource", "YouTube", "Instagram", "Event"];

export default function UpdatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredUpdates = initialUpdates.filter(item => {
    if (selectedCategory === "All") return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="py-12 sm:py-16 text-left">
      <div className="max-w-[840px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-display font-bold text-[var(--heading)] mb-2">
            Updates
          </h1>
          <p className="text-small text-[var(--muted)] leading-relaxed">
            Reverse-chronological log of cheat sheet releases, YouTube videos, roadmap milestones, and channel announcements.
          </p>
        </div>

        {/* Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-10">
          {CATEGORIES.map(cat => (
            <Tag
              key={cat}
              asButton
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Tag>
          ))}
        </div>

        {/* Reverse-Chronological Timeline per Section 7 */}
        <div className="relative border-l border-[var(--border)] ml-3 sm:ml-4 space-y-10 pl-6 sm:pl-8">
          {filteredUpdates.map(update => (
            <div key={update.id} className="relative group text-left">
              {/* Timeline Node Marker */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-[var(--surface)] border-2 border-[var(--accent)]"
                aria-hidden="true"
              />

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-1">
                <time className="text-xs font-mono text-[var(--muted)] tabular-nums shrink-0">
                  {update.date}
                </time>
                <span className="text-xs font-display font-medium px-2 py-0.5 rounded-[4px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] w-fit">
                  {update.category}
                </span>
              </div>

              <h2 className="text-base font-display font-semibold text-[var(--heading)] mb-1">
                {update.linkUrl ? (
                  update.linkUrl.startsWith("http") ? (
                    <a
                      href={update.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      {update.title}
                    </a>
                  ) : (
                    <Link
                      href={update.linkUrl}
                      className="hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      {update.title}
                    </Link>
                  )
                ) : (
                  <span>{update.title}</span>
                )}
              </h2>

              <p className="text-small text-[var(--muted)] max-w-2xl leading-relaxed mb-2">
                {update.description}
              </p>

              {update.linkText && update.linkUrl && (
                <div className="pt-1">
                  {update.linkUrl.startsWith("http") ? (
                    <a
                      href={update.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-display font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                    >
                      {update.linkText}
                    </a>
                  ) : (
                    <Link
                      href={update.linkUrl}
                      className="text-xs font-display font-medium text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                    >
                      {update.linkText}
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
