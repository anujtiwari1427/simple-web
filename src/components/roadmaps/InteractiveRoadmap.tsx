"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RotateCcw,
  BookOpen
} from "lucide-react";
import { Roadmap, RoadmapStep } from "@/types";

interface InteractiveRoadmapProps {
  roadmap: Roadmap;
}

export function InteractiveRoadmap({ roadmap }: InteractiveRoadmapProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const storageKey = `codedecoded_roadmap_${roadmap.id}`;

  // Flatten steps into an ordered sequence for the vertical timeline
  const allSteps: { step: RoadmapStep; phaseNumber: number; phaseTitle: string; stepIndex: number }[] = [];
  let counter = 1;
  roadmap.phases.forEach(phase => {
    phase.steps.forEach(step => {
      allSteps.push({
        step,
        phaseNumber: phase.phaseNumber,
        phaseTitle: phase.title,
        stepIndex: counter++,
      });
    });
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setCompletedSteps(JSON.parse(saved));
        } catch {
          setCompletedSteps({});
        }
      }
      // Expand first step by default
      if (allSteps.length > 0) {
        setExpandedStepId(allSteps[0].step.id);
      }
    }
  }, [storageKey]);

  const totalSteps = allSteps.length;
  const completedCount = allSteps.filter(s => completedSteps[s.step.id]).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // Identify current step: first uncompleted step
  const currentStep = allSteps.find(s => !completedSteps[s.step.id]) || allSteps[allSteps.length - 1];

  const toggleStep = (stepId: string) => {
    const updated = { ...completedSteps, [stepId]: !completedSteps[stepId] };
    setCompletedSteps(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  const resetProgress = () => {
    if (confirm("Reset your progress on this roadmap?")) {
      setCompletedSteps({});
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-[840px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-display text-[var(--muted)] mb-6">
          <Link href="/roadmaps" className="hover:text-[var(--accent)] transition-colors">
            Roadmaps
          </Link>
          <span>/</span>
          <span className="text-[var(--heading)]">{roadmap.title}</span>
        </div>

        {/* Roadmap Header Panel */}
        <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 mb-10 text-left">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-display text-[var(--accent)] font-medium">
              {roadmap.category || "Interactive Roadmap"}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] font-display">
              <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{roadmap.estimatedTime || roadmap.duration}</span>
            </div>
          </div>

          <h1 className="text-h2 font-display font-bold text-[var(--heading)] mb-3">
            {roadmap.title}
          </h1>

          <p className="text-small text-[var(--muted)] leading-relaxed mb-6">
            {roadmap.description}
          </p>

          {/* Progress Bar & Counter */}
          <div className="pt-5 border-t border-[var(--border)]">
            <div className="flex items-center justify-between text-xs font-display mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[var(--heading)] font-semibold">Progress:</span>
                <span className="text-[var(--accent)] font-mono tabular-nums">
                  {completedCount} of {totalSteps} steps completed ({progressPercent}%)
                </span>
              </div>

              {completedCount > 0 && (
                <button
                  onClick={resetProgress}
                  className="text-[var(--muted)] hover:text-[var(--danger)] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset progress"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="w-full h-2 rounded-[4px] bg-[var(--bg-deep)] overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Vertical Timeline per Section 6 */}
        <div className="relative pl-8 sm:pl-10 space-y-6 text-left">
          {/* Continuous vertical line in ink-700 */}
          <div
            className="absolute left-3.5 sm:left-4.5 top-5 bottom-5 w-[2px] bg-[var(--border)] -translate-x-1/2"
            aria-hidden="true"
          />

          {allSteps.map(({ step, phaseNumber, phaseTitle, stepIndex }) => {
            const isCompleted = !!completedSteps[step.id];
            const isCurrent = currentStep?.step.id === step.id && !isCompleted;
            const isExpanded = expandedStepId === step.id;

            return (
              <div key={step.id} className="relative group">
                {/* Timeline Node Marker per Section 6 */}
                <div
                  className={`absolute -left-8 sm:-left-10 top-3.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold select-none transition-all ${
                    isCompleted
                      ? "bg-[var(--success)] text-[var(--ink-950)]"
                      : isCurrent
                      ? "bg-[var(--surface)] text-[var(--accent)] ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)]"
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]"
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span className="tabular-nums">{stepIndex}</span>
                  )}
                </div>

                {/* Step Card / Accordion */}
                <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] overflow-hidden transition-colors">
                  <div
                    onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                    className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-[var(--bg-deep)]/40 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-mono text-[var(--muted)]">
                          Phase {phaseNumber}: {phaseTitle}
                        </span>
                        {step.estimatedHours && (
                          <span className="text-xs text-[var(--muted)] flex items-center gap-1 font-display">
                            • <Clock className="w-3 h-3 text-[var(--accent)]" /> {step.estimatedHours} hrs
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-display font-semibold text-[var(--heading)]">
                        {step.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      {/* Checkbox button */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          toggleStep(step.id);
                        }}
                        className={`px-2.5 py-1 rounded-[6px] text-xs font-display font-semibold transition-colors cursor-pointer ${
                          isCompleted
                            ? "bg-[var(--success)] text-[var(--ink-950)]"
                            : "bg-[var(--bg-deep)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--heading)]"
                        }`}
                      >
                        {isCompleted ? "Completed" : "Mark done"}
                      </button>

                      <div className="p-1 text-[var(--muted)]">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-[var(--border)]/60 space-y-4">
                      {step.description && (
                        <p className="text-small text-[var(--text)] leading-relaxed">
                          {step.description}
                        </p>
                      )}

                      {/* Topics covered checklist */}
                      {step.topics && step.topics.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-[var(--heading)] uppercase tracking-wider mb-2 font-display">
                            Key concepts to decode
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-display text-[var(--text)]">
                            {step.topics.map((topic, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Free curated resources */}
                      {step.resources && step.resources.length > 0 && (
                        <div className="pt-2 border-t border-[var(--border)]/40">
                          <h4 className="text-xs font-semibold text-[var(--heading)] uppercase tracking-wider mb-2 font-display">
                            Free resources
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {step.resources.map((res, i) => (
                              <a
                                key={i}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--bg-deep)] border border-[var(--border)] text-xs font-display text-[var(--text)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
                                <span>{res.title}</span>
                                <ExternalLink className="w-3 h-3 text-[var(--muted)]" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
