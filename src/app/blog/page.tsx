"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Calendar, Search } from "lucide-react";
import { initialBlogPosts } from "@/data/blogData";
import { Tag } from "@/components/common/Tag";

export default function BlogHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const allTags = ["All", "Python", "DSA", "Web Dev", "Architecture", "Interview"];

  const filteredPosts = initialBlogPosts.filter(post => {
    if (selectedTag !== "All" && !post.tags.includes(selectedTag)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="py-12 sm:py-16 text-left">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <h1 className="text-h1 font-display font-bold text-[var(--heading)] mb-2">
            Tutorials
          </h1>
          <p className="text-small text-[var(--muted)] leading-relaxed">
            Technical breakdowns without academic jargon. Clear visual mental models, code snippets, and practical explanations.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tutorials..."
              className="h-11 w-full pl-10 pr-4 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] text-[var(--heading)] placeholder:text-[var(--muted)] text-sm font-display focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {allTags.map(tag => (
              <Tag
                key={tag}
                asButton
                active={selectedTag === tag}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-6 flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex items-center gap-3 text-xs text-[var(--muted)] font-display mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>{post.readTimeMinutes} min read</span>
                  </span>
                  <span>•</span>
                  <span>{post.publishedAt}</span>
                </div>

                <h2 className="text-h3 font-display font-semibold text-[var(--heading)] mb-2 line-clamp-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-[4px]"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="text-small text-[var(--muted)] mb-5 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)]/60 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="text-xs text-[var(--muted)] font-display"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-display font-semibold text-[var(--accent)] hover:underline"
                >
                  Read tutorial
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
