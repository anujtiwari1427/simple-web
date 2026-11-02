"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { YoutubeIcon } from "@/components/common/BrandIcons";
import { mockYouTubeVideos } from "@/data/testimonialsData";

export function VideoShowcase() {
  const [videos, setVideos] = useState(mockYouTubeVideos.slice(0, 3));

  useEffect(() => {
    fetch("/api/youtube")
      .then(res => res.json())
      .then(data => {
        if (data?.videos?.length) {
          setVideos(data.videos.slice(0, 3));
        }
      })
      .catch(() => {
        // Keep initial mock fallback
      });
  }, []);

  return (
    <section className="py-16 sm:py-24 border-b border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Heading per Section 3 & 7: sentence case, left-aligned */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-h2 font-display font-bold text-[var(--heading)]">
              Latest from YouTube
            </h2>
            <p className="mt-2 text-small text-[var(--muted)] max-w-xl">
              Free video masterclasses and coding sessions explaining complex topics in plain language.
            </p>
          </div>

          <a
            href="https://www.youtube.com/@codedecoded01"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-sm font-display font-semibold text-[var(--ink-950)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors self-start sm:self-auto focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <YoutubeIcon className="w-4 h-4" />
            <span>Subscribe on YouTube</span>
          </a>
        </div>

        {/* 3 Video Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.slice(0, 3).map(video => {
            const videoUrl =
              video.url ||
              video.youtubeUrl ||
              `https://www.youtube.com/watch?v=${video.id}`;
            const thumbnailSrc =
              video.thumbnail ||
              video.thumbnailUrl ||
              `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
            const stats = video.views || video.viewCount || "Watch lesson";

            return (
              <a
                key={video.id}
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] overflow-hidden flex flex-col group focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                {/* 16:9 aspect ratio thumbnail per Section 9 */}
                <div className="relative aspect-video w-full bg-[var(--bg-deep)] overflow-hidden">
                  <Image
                    src={thumbnailSrc}
                    alt={video.title}
                    fill
                    unoptimized={thumbnailSrc.includes("i.ytimg.com")}
                    className="object-cover group-hover:scale-102 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Video Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-display font-semibold text-[var(--heading)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 mb-3">
                    {video.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-[var(--muted)] font-display pt-2 border-t border-[var(--border)]/60">
                    <span className="tabular-nums">{stats}</span>
                    <span className="text-[var(--accent)] font-medium">Watch video</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
