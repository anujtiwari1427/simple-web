"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Clock, MapPin } from "lucide-react";
import { roadmapsData } from "@/data/roadmapsData";

export default function RoadmapsPage() {
  const [stats, setStats] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      let completed = 0;
      let total = 0;

      roadmapsData.forEach(r => {
        const key = `codedecoded_roadmap_${r.id}`;
        const saved = localStorage.getItem(key);
        const stepIds = r.phases.flatMap(p => p.steps.map(s => s.id));
        total += stepIds.length;

        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const count = stepIds.filter(id => parsed[id]).length;
            completed += count;
          } catch {
            // ignore
          }
        }
      });

      setStats({ completed, total });
    }
  }, []);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Page Title */}
        <div className="mb-10 text-left">
          <h1 className="text-h1 font-display font-bold text-[var(--heading)] mb-2">
            Learning roadmaps
          </h1>
          <p className="text-small text-[var(--muted)] max-w-2xl leading-relaxed">
            Step-by-step career and topic milestones. Check off concepts as you learn with progress saved to your browser.
          </p>

          {stats.completed > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-xs font-display text-[var(--accent)]">
              <span>Overall progress: {stats.completed} of {stats.total} steps completed</span>
            </div>
          )}
        </div>

        {/* Roadmap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmapsData.map(roadmap => {
            const totalSteps = roadmap.phases.reduce((acc, p) => acc + p.steps.length, 0);

            return (
              <article
                key={roadmap.id}
                className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-6 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs text-[var(--muted)] font-display flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>{roadmap.duration}</span>
                    </span>
                    <span className="text-xs text-[var(--muted)] font-display flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span className="tabular-nums">{totalSteps} steps</span>
                    </span>
                  </div>

                  <h2 className="text-h3 font-display font-semibold text-[var(--heading)] mb-2 line-clamp-1">
                    <Link
                      href={`/roadmaps/${roadmap.slug}`}
                      className="hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-[4px]"
                    >
                      {roadmap.title}
                    </Link>
                  </h2>

                  <p className="text-small text-[var(--muted)] mb-6 line-clamp-2 leading-relaxed">
                    {roadmap.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border)]/60">
                  <Link
                    href={`/roadmaps/${roadmap.slug}`}
                    className="inline-flex items-center justify-center font-display font-semibold text-sm rounded-[6px] min-h-[44px] px-4 py-2 w-full bg-[var(--accent)] text-[var(--ink-950)] hover:bg-[var(--accent-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    View roadmap
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
