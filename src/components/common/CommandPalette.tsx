"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Map, FileText, ArrowRight, X } from "lucide-react";
import { initialResources } from "@/data/resourcesData";
import { roadmapsData } from "@/data/roadmapsData";
import { initialBlogPosts } from "@/data/blogData";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchingResources = initialResources
      .filter(
        r =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some(t => t.toLowerCase().includes(q)) ||
          r.topic.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchingRoadmaps = roadmapsData
      .filter(
        r =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tagline.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchingBlog = initialBlogPosts
      .filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q) ||
          b.tags.some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 3);

    return {
      resources: matchingResources,
      roadmaps: matchingRoadmaps,
      blog: matchingBlog
    };
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[var(--surface)] rounded-[20px] border border-[var(--border)] overflow-hidden flex flex-col max-h-[80vh] shadow-xl">
        {/* Search Input Box */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[var(--border)] bg-[var(--bg)]/50">
          <Search className="w-5 h-5 text-[var(--muted)] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search resources, roadmaps, tutorials (e.g. DSA, Python, Next.js)..."
            className="w-full bg-transparent text-[var(--heading)] placeholder:text-[var(--muted)] focus:outline-none text-base font-display"
            autoFocus
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-[var(--muted)] bg-[var(--bg-deep)] border border-[var(--border)] rounded-[4px] font-mono">
              ESC
            </kbd>
          )}
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-4 space-y-4 font-display">
          {!query ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-[var(--muted)] mb-2">
                  Quick navigation
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigateTo("/resources")}
                    className="flex items-center gap-2.5 p-2.5 rounded-[6px] hover:bg-[var(--bg)] text-left text-sm text-[var(--heading)] transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                    <span>Resources</span>
                  </button>
                  <button
                    onClick={() => navigateTo("/roadmaps")}
                    className="flex items-center gap-2.5 p-2.5 rounded-[6px] hover:bg-[var(--bg)] text-left text-sm text-[var(--heading)] transition cursor-pointer"
                  >
                    <Map className="w-4 h-4 text-[var(--accent)]" />
                    <span>Roadmaps</span>
                  </button>
                  <button
                    onClick={() => navigateTo("/blog")}
                    className="flex items-center gap-2.5 p-2.5 rounded-[6px] hover:bg-[var(--bg)] text-left text-sm text-[var(--heading)] transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[var(--accent)]" />
                    <span>Tutorials</span>
                  </button>
                  <button
                    onClick={() => navigateTo("/updates")}
                    className="flex items-center gap-2.5 p-2.5 rounded-[6px] hover:bg-[var(--bg)] text-left text-sm text-[var(--heading)] transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                    <span>Updates</span>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-[var(--muted)] mb-2">
                  Popular topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {["DSA", "Python", "Web dev", "DBMS", "Data science"].map(
                    item => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="px-3 py-1 text-xs rounded-[6px] bg-[var(--bg-deep)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] transition cursor-pointer"
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : searchResults && (
            <div className="space-y-4">
              {searchResults.resources.length === 0 &&
                searchResults.roadmaps.length === 0 &&
                searchResults.blog.length === 0 && (
                  <div className="text-center py-8 text-[var(--muted)]">
                    <p>No resources match &apos;{query}&apos;.</p>
                    <p className="text-xs mt-1">Try a broader topic or clear the search.</p>
                  </div>
                )}

              {/* Roadmaps Match */}
              {searchResults.roadmaps.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[var(--muted)] mb-2">
                    Roadmaps
                  </p>
                  <div className="space-y-1">
                    {searchResults.roadmaps.map(roadmap => (
                      <button
                        key={roadmap.id}
                        onClick={() => navigateTo(`/roadmaps/${roadmap.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-[6px] hover:bg-[var(--bg)] text-left transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Map className="w-4 h-4 text-[var(--accent)] shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-[var(--heading)] group-hover:text-[var(--accent)]">
                              {roadmap.title}
                            </p>
                            <p className="text-xs text-[var(--muted)] line-clamp-1">{roadmap.tagline}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--muted)]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources Match */}
              {searchResults.resources.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[var(--muted)] mb-2">
                    Resources
                  </p>
                  <div className="space-y-1">
                    {searchResults.resources.map(res => (
                      <button
                        key={res.id}
                        onClick={() => navigateTo(`/resources/${res.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-[6px] hover:bg-[var(--bg)] text-left transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-[var(--accent)] shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-[var(--heading)] group-hover:text-[var(--accent)]">
                                {res.title}
                              </p>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[var(--bg-deep)] text-[var(--muted)] font-display">
                                {res.type}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--muted)] line-clamp-1">{res.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--muted)]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Match */}
              {searchResults.blog.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[var(--muted)] mb-2">
                    Tutorials
                  </p>
                  <div className="space-y-1">
                    {searchResults.blog.map(post => (
                      <button
                        key={post.id}
                        onClick={() => navigateTo(`/blog/${post.slug}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-[6px] hover:bg-[var(--bg)] text-left transition group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-[var(--accent)] shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-[var(--heading)] group-hover:text-[var(--accent)]">
                              {post.title}
                            </p>
                            <p className="text-xs text-[var(--muted)] line-clamp-1">{post.summary}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--muted)]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-[var(--bg-deep)] border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
          <span>Press ESC or click outside to close</span>
          <kbd className="font-mono text-[11px] bg-[var(--surface)] px-1.5 py-0.5 rounded-[4px] border border-[var(--border)]">
            Ctrl + K
          </kbd>
        </div>
      </div>
    </div>
  );
}
