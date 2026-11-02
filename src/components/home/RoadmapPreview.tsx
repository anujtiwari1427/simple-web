import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { roadmapsData } from "@/data/roadmapsData";

export function RoadmapPreview() {
  return (
    <section className="py-16 sm:py-24 border-b border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-h2 font-display font-bold text-[var(--heading)]">
              Start with a roadmap
            </h2>
            <p className="mt-2 text-small text-[var(--muted)] max-w-xl">
              Step-by-step learning sequences with free resources and progress tracking.
            </p>
          </div>

          <Link
            href="/roadmaps"
            className="text-sm font-display font-semibold text-[var(--accent)] hover:underline self-start sm:self-auto"
          >
            View all roadmaps
          </Link>
        </div>

        {/* 3 Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmapsData.slice(0, 3).map(roadmap => {
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
                      <span>{roadmap.estimatedTime}</span>
                    </span>
                    <span className="text-xs text-[var(--muted)] font-display flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span className="tabular-nums">{totalSteps} steps</span>
                    </span>
                  </div>

                  <h3 className="text-h3 font-display font-semibold text-[var(--heading)] mb-2 line-clamp-1">
                    <Link
                      href={`/roadmaps/${roadmap.slug}`}
                      className="hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-[4px]"
                    >
                      {roadmap.title}
                    </Link>
                  </h3>

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
    </section>
  );
}
