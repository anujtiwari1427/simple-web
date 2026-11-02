"use client";

import React, { useEffect, useState, useRef } from "react";

interface DecodeTextProps {
  text: string;
  durationMs?: number;
  trigger?: "onload" | "hover";
  isHovered?: boolean;
  className?: string;
}

const SCRAMBLE_CHARS = "x7#Qm!k9@@z$%&*?+/<>~01{}[]=";

export function DecodeText({
  text,
  durationMs = 1600,
  trigger = "onload",
  isHovered = false,
  className = "",
}: DecodeTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // Respect prefers-reduced-motion (Section 5 requirement)
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayText(text);
      return;
    }

    if (trigger === "onload" && hasPlayedRef.current) {
      return;
    }

    if (trigger === "hover" && !isHovered) {
      setDisplayText(text);
      return;
    }

    const length = text.length;
    let cancelled = false;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);

      // Number of characters resolved from left to right in groups
      const resolvedCount = Math.floor(progress * length);

      let scrambled = "";
      for (let i = 0; i < length; i++) {
        if (text[i] === " ") {
          scrambled += " ";
        } else if (i < resolvedCount) {
          scrambled += text[i];
        } else {
          const randomIndex = Math.floor(Math.random() * SCRAMBLE_CHARS.length);
          scrambled += SCRAMBLE_CHARS[randomIndex];
        }
      }

      if (!cancelled) {
        setDisplayText(scrambled);
      }

      if (progress < 1 && !cancelled) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        if (trigger === "onload") {
          hasPlayedRef.current = true;
        }
      }
    };

    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [text, durationMs, trigger, isHovered]);

  return (
    <span
      className={className}
      aria-label={text}
      role="text"
    >
      {displayText}
    </span>
  );
}
