"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Code2, BookOpen, Layers, Lock, ShoppingCart, Check } from "lucide-react";
import { Resource } from "@/types";
import { Tag } from "./Tag";
import { DecodeText } from "./DecodeText";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";

interface ResourceCardProps {
  resource: Resource;
  enableHoverDecode?: boolean;
}

export function ResourceCard({
  resource,
  enableHoverDecode = false,
}: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
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

  // Type icon selector
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
      case "notes":
        return <FileText className="w-5 h-5 text-[var(--accent)]" />;
      case "cheat sheet":
        return <Layers className="w-5 h-5 text-[var(--accent)]" />;
      case "repo":
      case "project":
        return <Code2 className="w-5 h-5 text-[var(--accent)]" />;
      default:
        return <BookOpen className="w-5 h-5 text-[var(--accent)]" />;
    }
  };

  // Difficulty dot scale: Beginner (1/3), Intermediate (2/3), Advanced (3/3)
  const getDifficultyDots = (difficulty: string) => {
    const level = difficulty.toLowerCase();
    const count = level === "advanced" ? 3 : level === "intermediate" ? 2 : 1;

    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] font-display">
        <span className="inline-flex items-center gap-0.5" aria-hidden="true">
          <span className={`w-1.5 h-1.5 rounded-full ${count >= 1 ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
          <span className={`w-1.5 h-1.5 rounded-full ${count >= 2 ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
          <span className={`w-1.5 h-1.5 rounded-full ${count >= 3 ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
        </span>
        <span>{difficulty}</span>
      </div>
    );
  };

  const isNewItem = Boolean(resource.isNew);
  const isPaidResource = Boolean(resource.isPaid && (resource.price || 0) > 0);

  return (
    <>
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-6 flex flex-col justify-between transition-colors duration-150 relative text-left"
      >
        <div>
          {/* Top bar: Type icon & Badges */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 text-xs font-display text-[var(--muted)]">
              {getTypeIcon(resource.type)}
              <span>{resource.type}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isPaidResource && !hasPurchased && (
                <span className="px-2 py-0.5 rounded-[6px] bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3" /> ₹{resource.price}
                </span>
              )}
              {hasPurchased && (
                <span className="px-2 py-0.5 rounded-[6px] bg-emerald-500/20 text-emerald-400 text-xs font-bold font-display flex items-center gap-1">
                  <Check className="w-3 h-3" /> Owned
                </span>
              )}
              {isNewItem && (
                <span className="px-2 py-0.5 rounded-[6px] bg-[var(--accent)] text-[var(--ink-950)] text-xs font-semibold font-display">
                  New
                </span>
              )}
              {getDifficultyDots(resource.difficulty)}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-h3 font-display font-semibold text-[var(--heading)] mb-2 line-clamp-2">
            <Link
              href={`/resources/${resource.slug}`}
              className="hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-[4px]"
            >
              {resource.title}
            </Link>
          </h3>

          {/* Two-line description */}
          <div className="text-small text-[var(--muted)] mb-5 line-clamp-2 font-display leading-relaxed">
            {enableHoverDecode ? (
              <DecodeText
                text={resource.description}
                trigger="hover"
                isHovered={isHovered}
                durationMs={800}
              />
            ) : (
              resource.description
            )}
          </div>
        </div>

        <div>
          {/* Topic Tag(s) and Pricing */}
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="flex flex-wrap gap-1.5 items-center">
              <Tag>{resource.topic}</Tag>
              {resource.fileSize && (
                <span className="text-xs text-[var(--muted)] ml-1 tabular-nums">
                  {resource.fileSize}
                </span>
              )}
            </div>

            {isPaidResource && !hasPurchased && (
              <div className="flex items-center gap-1.5 font-mono text-xs">
                {resource.originalPrice && (
                  <span className="line-through text-[var(--muted)]">
                    ₹{resource.originalPrice}
                  </span>
                )}
                <span className="font-bold text-[var(--heading)] text-sm">
                  ₹{resource.price}
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between gap-2">
            {isPaidResource && !hasPurchased ? (
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="inline-flex items-center justify-center gap-2 font-display font-semibold text-sm rounded-[6px] min-h-[44px] px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 transition-all w-full cursor-pointer shadow-sm active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Buy for ₹{resource.price}</span>
              </button>
            ) : (
              <Link
                href={`/resources/${resource.slug}`}
                className="inline-flex items-center justify-center font-display font-semibold text-sm rounded-[6px] min-h-[44px] px-4 py-2 bg-[var(--accent)] text-[var(--ink-950)] hover:bg-[var(--accent-hover)] transition-colors w-full focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                {hasPurchased ? "Download PDF (Owned)" : "Download Free PDF"}
              </Link>
            )}
          </div>
        </div>
      </article>

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
