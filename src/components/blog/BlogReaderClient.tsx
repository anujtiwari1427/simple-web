"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Calendar, Share2, Check } from "lucide-react";
import { BlogPost } from "@/types";
import { CodeBlock } from "@/components/common/CodeBlock";

interface BlogReaderProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogReaderClient({ post, relatedPosts }: BlogReaderProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1500);
    }
  };

  // Parse markdown into Source Serif 4 prose and custom CodeBlock syntax highlights
  const renderArticleBody = (content: string) => {
    const lines = content.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace("```", "").trim() || "python";
          codeLines = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={`code-${i}`} className="my-6">
              <CodeBlock
                code={codeLines.join("\n")}
                language={codeLanguage}
                showLineNumbers={codeLines.length >= 8}
              />
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // H2
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={`h2-${i}`}
            id={`heading-${i}`}
            className="text-h2 font-display font-bold text-[var(--heading)] mt-10 mb-4"
          >
            {line.replace("## ", "")}
          </h2>
        );
        continue;
      }

      // H3
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-h3 font-display font-semibold text-[var(--heading)] mt-8 mb-3"
          >
            {line.replace("### ", "")}
          </h3>
        );
        continue;
      }

      // Bullet points
      if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={`li-${i}`} className="ml-5 list-disc pl-1 mb-2">
            {line.substring(2)}
          </li>
        );
        continue;
      }

      // Empty line
      if (!line.trim()) {
        continue;
      }

      // Paragraph in Source Serif 4
      elements.push(
        <p key={`p-${i}`} className="mb-5 leading-[1.75]">
          {line}
        </p>
      );
    }

    return elements;
  };

  // Extract H2 headings for table of contents
  const headings = post.content
    .split("\n")
    .filter(l => l.startsWith("## "))
    .map(l => l.replace("## ", ""));

  return (
    <div className="py-12 sm:py-16 text-left">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-xs font-display text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            ← All tutorials
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main 680px Reading Column per Section 4 & 7 */}
          <article className="lg:col-span-8 max-w-[680px]">
            {/* Title (H1) */}
            <h1 className="text-h1 font-display font-bold text-[var(--heading)] mb-4">
              {post.title}
            </h1>

            {/* Reading time and last-updated date under title per Section 7 */}
            <div className="flex items-center gap-4 text-xs font-display text-[var(--muted)] pb-6 mb-8 border-b border-[var(--border)]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{post.readingTimeMinutes} min read</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Updated {post.publishedAt}</span>
              </span>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1 hover:text-[var(--heading)] cursor-pointer"
                title="Share link"
              >
                {copiedLink ? (
                  <span className="text-[var(--success)] font-medium">Copied link</span>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            {/* Article Body in Source Serif 4 per Section 3 & 7 */}
            <div className="font-reading text-[1.1875rem] text-[var(--text)] leading-[1.75]">
              {renderArticleBody(post.content)}
            </div>

            {/* Next Steps / Related Tutorials */}
            <div className="mt-14 pt-8 border-t border-[var(--border)]">
              <h3 className="text-sm font-display font-semibold text-[var(--heading)] uppercase tracking-wider mb-4">
                Next tutorials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-display">
                {relatedPosts.map(rel => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="p-4 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors block"
                  >
                    <p className="text-sm font-semibold text-[var(--heading)] mb-1 line-clamp-1">
                      {rel.title}
                    </p>
                    <p className="text-xs text-[var(--muted)] line-clamp-2">
                      {rel.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sticky Table of Contents on Desktop per Section 7 */}
          {headings.length > 0 && (
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 pl-6 border-l border-[var(--border)] text-left font-display">
              <p className="text-xs font-semibold text-[var(--heading)] uppercase tracking-wider mb-3">
                On this page
              </p>
              <nav className="space-y-2">
                {headings.map((h, idx) => (
                  <a
                    key={idx}
                    href={`#heading-${idx}`}
                    className="block text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors leading-relaxed"
                  >
                    {h}
                  </a>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
