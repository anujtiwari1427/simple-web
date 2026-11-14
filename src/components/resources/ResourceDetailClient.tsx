"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Share2, Check, FileText, Lock, ShoppingCart, Sparkles, CheckCircle2 } from "lucide-react";
import { Resource } from "@/types";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import confetti from "canvas-confetti";

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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const purchases = localStorage.getItem("codedecoded_purchases");
      if (purchases) {
        try {
          const list: any[] = JSON.parse(purchases);
          if (list.some(p => p.resourceId === resource.id)) {
            setHasPurchased(true);
          }
        } catch {
          // ignore
        }
      }
    }
  }, [resource.id]);

  const handleDownload = () => {
    if (resource.isPaid && !hasPurchased) {
      setIsCheckoutOpen(true);
      return;
    }

    setDownloading(true);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);

      const content = `CODE DECODED - OFFICIAL RESOURCE
Title: ${resource.title}
Topic: ${resource.topic}
Type: ${resource.type}
Difficulty: ${resource.difficulty}
Author: ${resource.author}
Status: ${resource.isPaid ? "Licensed Paid Edition" : "Free Educational Resource"}

SUMMARY & DESCRIPTION:
${resource.description}

CORE KEY TAKEAWAYS & FORMULAS:
${resource.keyTakeaways?.map((item, idx) => `[${idx + 1}] ${item}`).join("\n\n") || "Comprehensive review guide."}

Follow Code Decoded:
- Instagram: https://instagram.com/code.decoded
- YouTube: https://youtube.com/@codedecoded
- Website: https://codedecoded.com
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
    }, 500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const isPaidResource = Boolean(resource.isPaid && (resource.price || 0) > 0);

  return (
    <>
      <div className="py-12 sm:py-16 text-left">
        <div className="max-w-[840px] mx-auto px-4 sm:px-6">
          {/* Back Link */}
          <div className="mb-6">
            <Link
              href="/resources"
              className="text-xs font-semibold text-slate-500 hover:text-cyan-500 transition-colors"
            >
              ← Back to all resources
            </Link>
          </div>

          {/* Main Resource Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 mb-12 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  {resource.topic}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {resource.type}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {resource.difficulty} Level
                </span>
                {isPaidResource && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Premium Resource
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 transition cursor-pointer"
                  title="Share link"
                >
                  {copied ? (
                    <span className="text-emerald-500 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Link Copied
                    </span>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              {resource.title}
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {resource.description}
            </p>

            {/* Pricing Section (if paid) */}
            {isPaidResource && (
              <div className="mb-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Access License:
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                      ₹{resource.price}
                    </span>
                    {resource.originalPrice && (
                      <span className="text-base text-slate-400 line-through font-mono">
                        ₹{resource.originalPrice}
                      </span>
                    )}
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Special Student Discount
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 sm:text-right">
                  <p>✓ Instant PDF Download</p>
                  <p>✓ Lifetime Access & Updates</p>
                </div>
              </div>
            )}

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              {isPaidResource && !hasPurchased ? (
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Now for ₹{resource.price}</span>
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {downloading
                      ? "Preparing file..."
                      : downloaded || hasPurchased
                      ? "Download PDF Guide"
                      : "Download Free PDF"}
                  </span>
                </button>
              )}

              {resource.previewUrl && (
                <a
                  href={resource.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  Preview Document
                </a>
              )}
            </div>

            {downloaded && (
              <p className="mt-4 text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Download started! Saved to your device.
              </p>
            )}

            {/* Key Takeaways */}
            {resource.keyTakeaways && resource.keyTakeaways.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <span>What This Decoded Guide Covers</span>
                </h2>

                <ul className="space-y-3">
                  {resource.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span className="leading-relaxed">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Related Resources */}
          {relatedResources.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                More {resource.topic} Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedResources.map(rel => (
                  <Link
                    key={rel.id}
                    href={`/resources/${rel.slug}`}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {rel.type}
                      </span>
                      <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-1">
                        {rel.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {rel.description}
                      </p>
                    </div>
                    <span className="mt-3 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                      View details →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        resource={resource}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => {
          setHasPurchased(true);
        }}
      />
    </>
  );
}
