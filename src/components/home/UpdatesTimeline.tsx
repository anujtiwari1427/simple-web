import Link from "next/link";
import { initialUpdates } from "@/data/updatesData";

export function UpdatesTimeline() {
  const latestFive = initialUpdates.slice(0, 5);

  return (
    <section className="py-16 sm:py-24 border-b border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-h2 font-display font-bold text-[var(--heading)]">
              Updates timeline
            </h2>
            <p className="mt-2 text-small text-[var(--muted)] max-w-xl">
              Recent releases, new video lectures, notes, and community announcements.
            </p>
          </div>

          <Link
            href="/updates"
            className="text-sm font-display font-semibold text-[var(--accent)] hover:underline self-start sm:self-auto"
          >
            View all updates
          </Link>
        </div>

        {/* Reverse-chronological timeline per Section 7 */}
        <div className="relative border-l border-[var(--border)] ml-3 sm:ml-4 space-y-8 pl-6 sm:pl-8">
          {latestFive.map(update => (
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

              <h3 className="text-base font-display font-semibold text-[var(--heading)] mb-1">
                {update.linkUrl.startsWith("http") ? (
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
                )}
              </h3>

              <p className="text-small text-[var(--muted)] max-w-2xl leading-relaxed mb-2">
                {update.description}
              </p>

              {update.linkText && (
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
    </section>
  );
}
