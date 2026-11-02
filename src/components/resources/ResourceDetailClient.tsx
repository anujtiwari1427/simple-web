"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Share2, Check, FileText } from "lucide-react";
import { Resource } from "@/types";
import { Tag } from "@/components/common/Tag";
import { Button } from "@/components/common/Button";
import { ResourceCard } from "@/components/common/ResourceCard";

interface ResourceDetailClientProps {
  resource: Resource;
  relatedResources: Resource[];
}

export function ResourceDetailClient({
  resource,
  relatedResources,
}: ResourceDetailClientProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);

      const content = `CODE DECODED
${resource.title}
Topic: ${resource.topic} | Type: ${resource.type} | Difficulty: ${resource.difficulty}

Description:
${resource.description}

Key takeaways:
${resource.keyTakeaways?.map((item, idx) => `${idx + 1}. ${item}`).join("\n\n") || "Comprehensive review guide."}

Channels:
YouTube: https://www.youtube.com/@codedecoded01
Instagram: https://www.instagram.com/coded.ecoded
Website: https://codedecoded.com
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
    }, 400);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="py-12 sm:py-16 text-left">
      <div className="max-w-[840px] mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/resources"
            className="text-xs font-display text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            ← All resources
          </Link>
        </div>

        {/* Main Resource Card */}
        <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-10 mb-12">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Tag>{resource.topic}</Tag>
              <span className="text-xs text-[var(--muted)] font-display">
                {resource.type}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="text-xs text-[var(--muted)] hover:text-[var(--heading)] flex items-center gap-1.5 py-1 px-2.5 rounded-[6px] border border-[var(--border)] bg-[var(--bg-deep)] transition-colors cursor-pointer"
                title="Share link"
              >
                {copied ? (
                  <span className="text-[var(--success)] font-medium">Copied link</span>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <h1 className="text-h1 font-display font-bold text-[var(--heading)] mb-4">
            {resource.title}
          </h1>

          <p className="text-body-ui text-[var(--text)] mb-8 leading-relaxed">
            {resource.description}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[var(--border)]">
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? "Preparing file..." : downloaded ? "Download again" : "Download PDF"}
            </Button>

            {resource.previewUrl && (
              <Button
                variant="secondary"
                href={resource.previewUrl}
                external
              >
                Preview online
              </Button>
            )}
          </div>

          {downloaded && (
            <p className="mt-4 text-xs text-[var(--success)] font-display font-medium">
              Download started. Saved to your device.
            </p>
          )}

          {/* Key Takeaways */}
          {resource.keyTakeaways && resource.keyTakeaways.length > 0 && (
            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <h2 className="text-h3 font-display font-semibold text-[var(--heading)] mb-4">
                What this resource covers
              </h2>

              <ul className="space-y-3">
                {resource.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--text)] font-display">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Related Resources */}
        {relatedResources.length > 0 && (
          <div>
            <h2 className="text-h3 font-display font-semibold text-[var(--heading)] mb-6">
              More {resource.topic} resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedResources.map(rel => (
                <ResourceCard key={rel.id} resource={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
