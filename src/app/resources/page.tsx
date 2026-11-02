"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { initialResources } from "@/data/resourcesData";
import { ResourceCard } from "@/components/common/ResourceCard";
import { Resource } from "@/types";

const TOPICS = ["All", "Python", "Web dev", "DSA", "DBMS", "Data science"];
const TYPES = ["All", "Cheat Sheet", "PDF", "Notes", "Repo"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [resources, setResources] = useState<Resource[]>(initialResources);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const custom = localStorage.getItem("codedecoded_custom_resources");
      if (custom) {
        try {
          const parsed = JSON.parse(custom);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResources([...parsed, ...initialResources]);
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const filteredResources = useMemo(() => {
    return resources
      .filter(res => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = res.title.toLowerCase().includes(q);
          const matchesDesc = res.description.toLowerCase().includes(q);
          const matchesTopic = res.topic.toLowerCase().includes(q);
          const matchesTag = res.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesTopic && !matchesTag) return false;
        }

        if (selectedTopic !== "All") {
          const match =
            res.topic.toLowerCase() === selectedTopic.toLowerCase() ||
            res.tags?.some(t => t.toLowerCase() === selectedTopic.toLowerCase());
          if (!match) return false;
        }

        if (selectedType !== "All") {
          if (res.type.toLowerCase() !== selectedType.toLowerCase()) return false;
        }

        if (selectedDifficulty !== "All") {
          if (res.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return (
            new Date(b.publishedAt || "").getTime() -
            new Date(a.publishedAt || "").getTime()
          );
        }
        return (b.downloadsCount || 0) - (a.downloadsCount || 0);
      });
  }, [resources, searchQuery, selectedTopic, selectedType, selectedDifficulty, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedTopic("All");
    setSelectedType("All");
    setSelectedDifficulty("All");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedTopic !== "All" ||
    selectedType !== "All" ||
    selectedDifficulty !== "All";

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-h1 font-display font-bold text-[var(--heading)] mb-2">
            Resources
          </h1>
          <p className="text-small text-[var(--muted)] max-w-2xl">
            Free visual cheat sheets, handwritten-style notes, and code repositories.
          </p>
        </div>

        {/* Pinned Top Bar: Search + Sort + Mobile Filter Trigger */}
        <div className="sticky top-16 z-20 py-4 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)] mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or language..."
              className="h-11 w-full pl-10 pr-4 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--heading)] placeholder:text-[var(--muted)] text-sm font-display focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--heading)] p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-2 h-11 px-3.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--heading)] text-sm font-display cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[var(--accent)]" />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-display text-[var(--muted)] hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as "newest" | "popular")}
                className="h-11 px-3 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--heading)] text-sm font-display focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Area: Sidebar Filters + Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar: 3 columns */}
          <aside className="hidden md:block md:col-span-3 space-y-6 text-left">
            {/* Topic Filter */}
            <div>
              <h3 className="text-xs font-semibold text-[var(--heading)] uppercase tracking-wider mb-3">
                Topic
              </h3>
              <div className="space-y-1">
                {TOPICS.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-[6px] text-sm font-display text-left transition-colors cursor-pointer ${
                      selectedTopic === topic
                        ? "bg-[var(--surface)] text-[var(--accent)] font-semibold border border-[var(--accent)]"
                        : "text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface)]/50"
                    }`}
                  >
                    <span>{topic}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="pt-4 border-t border-[var(--border)]">
              <h3 className="text-xs font-semibold text-[var(--heading)] uppercase tracking-wider mb-3">
                Type
              </h3>
              <div className="space-y-1">
                {TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-[6px] text-sm font-display text-left transition-colors cursor-pointer ${
                      selectedType === type
                        ? "bg-[var(--surface)] text-[var(--accent)] font-semibold border border-[var(--accent)]"
                        : "text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface)]/50"
                    }`}
                  >
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="pt-4 border-t border-[var(--border)]">
              <h3 className="text-xs font-semibold text-[var(--heading)] uppercase tracking-wider mb-3">
                Difficulty
              </h3>
              <div className="space-y-1">
                {DIFFICULTIES.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-[6px] text-sm font-display text-left transition-colors cursor-pointer ${
                      selectedDifficulty === diff
                        ? "bg-[var(--surface)] text-[var(--accent)] font-semibold border border-[var(--accent)]"
                        : "text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface)]/50"
                    }`}
                  >
                    <span>{diff}</span>
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="pt-4">
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-display text-[var(--accent)] hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </aside>

          {/* Right Resource Grid: 9 columns */}
          <main className="md:col-span-9">
            {/* Live count for accessibility per Section 11 */}
            <div className="mb-4 flex items-center justify-between text-xs text-[var(--muted)] font-display" aria-live="polite">
              <span>Showing {filteredResources.length} resources</span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="md:hidden text-[var(--accent)] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filteredResources.length === 0 ? (
              <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-12 text-center">
                {/* Empty state text strictly per Section 10 */}
                <p className="text-body-ui text-[var(--heading)] font-display font-medium mb-2">
                  No resources match &apos;{searchQuery || selectedTopic}&apos;.
                </p>
                <p className="text-small text-[var(--muted)] mb-6">
                  Try a broader topic or clear the filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center justify-center font-display font-semibold text-sm rounded-[6px] min-h-[44px] px-5 py-2.5 bg-[var(--accent)] text-[var(--ink-950)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    enableHoverDecode={true}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Bottom Sheet per Section 7 */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:hidden animate-in fade-in">
            <div className="w-full bg-[var(--surface)] border-t border-[var(--border)] rounded-t-[20px] p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-5">
                <h3 className="text-base font-display font-semibold text-[var(--heading)]">
                  Filter resources
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Topics */}
              <div className="mb-5">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">
                  Topic
                </span>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-3 py-1.5 rounded-[6px] text-xs font-display ${
                        selectedTopic === topic
                          ? "bg-[var(--accent)] text-[var(--ink-950)] font-semibold"
                          : "bg-[var(--bg-deep)] text-[var(--text)] border border-[var(--border)]"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Types */}
              <div className="mb-5">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">
                  Type
                </span>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1.5 rounded-[6px] text-xs font-display ${
                        selectedType === type
                          ? "bg-[var(--accent)] text-[var(--ink-950)] font-semibold"
                          : "bg-[var(--bg-deep)] text-[var(--text)] border border-[var(--border)]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Difficulty */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-2">
                  Difficulty
                </span>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map(diff => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-3 py-1.5 rounded-[6px] text-xs font-display ${
                        selectedDifficulty === diff
                          ? "bg-[var(--accent)] text-[var(--ink-950)] font-semibold"
                          : "bg-[var(--bg-deep)] text-[var(--text)] border border-[var(--border)]"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 min-h-[44px] rounded-[6px] border border-[var(--border)] text-sm font-display text-[var(--heading)]"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 min-h-[44px] rounded-[6px] bg-[var(--accent)] text-[var(--ink-950)] text-sm font-display font-semibold"
                >
                  Show results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
