"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bookmark, Download, ExternalLink, FileText, Check, Sparkles, Eye } from "lucide-react";
import { Resource } from "@/types";
import confetti from "canvas-confetti";

interface ResourceCardProps {
  resource: Resource;
  onBookmarkChange?: () => void;
}

export function ResourceCard({ resource, onBookmarkChange }: ResourceCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloadCount, setDownloadCount] = useState(resource.downloadsCount);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("codedecoded_bookmarks");
      if (saved) {
        try {
          const list: string[] = JSON.parse(saved);
          setIsBookmarked(list.includes(resource.id));
        } catch {
          // ignore
        }
      }
    }
  }, [resource.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === "undefined") return;

    let list: string[] = [];
    const saved = localStorage.getItem("codedecoded_bookmarks");
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch {
        list = [];
      }
    }

    if (list.includes(resource.id)) {
      list = list.filter(id => id !== resource.id);
      setIsBookmarked(false);
    } else {
      list.push(resource.id);
      setIsBookmarked(true);
    }

    localStorage.setItem("codedecoded_bookmarks", JSON.stringify(list));
    if (onBookmarkChange) onBookmarkChange();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDownloading(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setDownloadCount(prev => prev + 1);

      // Generate a clean dummy printable/pdf document download
      const content = `CODE DECODED - FREE STUDY RESOURCE
Title: ${resource.title}
Topic: ${resource.topic}
Type: ${resource.type}
Difficulty: ${resource.difficulty}

KEY TAKEAWAYS:
${resource.keyTakeaways.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

For more cheatsheets and roadmaps, visit https://codedecoded.com
Instagram: @coded.ecoded | YouTube: @codedecoded01
`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resource.slug}-decoded.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 600);
  };

  const getDifficultyBadge = () => {
    switch (resource.difficulty) {
      case "Beginner":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Intermediate":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Advanced":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div className="relative group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 hover:border-cyan-500/60 hover:shadow-xl dark:hover:shadow-cyan-950/20 transition-all duration-300">
      {/* Top Meta: Badges & Bookmark */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {resource.type}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getDifficultyBadge()}`}>
              {resource.difficulty}
            </span>
            {resource.isNew && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 uppercase tracking-wider animate-pulse">
                NEW
              </span>
            )}
          </div>

          <button
            onClick={toggleBookmark}
            className={`p-1.5 rounded-lg border transition ${
              isBookmarked
                ? "border-amber-400/50 bg-amber-400/10 text-amber-500"
                : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-slate-400"
            }`}
            aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
            title={isBookmarked ? "Bookmarked" : "Save to Bookmarks"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-400" : ""}`} />
          </button>
        </div>

        {/* Title */}
        <Link href={`/resources/${resource.slug}`} className="block group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
          <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-2">
            {resource.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-mono"
            >
              #{tag}
            </span>
          ))}
          {resource.fileSize && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono">
              {resource.fileSize}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Download className="w-3.5 h-3.5 text-cyan-500" />
          <span className="font-mono font-medium">{downloadCount.toLocaleString()}</span> downloads
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/resources/${resource.slug}`}
            className="p-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Read summary & key takeaways"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
              downloaded
                ? "bg-emerald-500 text-white"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            }`}
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Downloaded</span>
              </>
            ) : downloading ? (
              <span>Preparing...</span>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
