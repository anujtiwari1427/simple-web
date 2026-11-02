"use client";

import { Button } from "@/components/common/Button";
import { DecodeText } from "@/components/common/DecodeText";
import { CodeBlock } from "@/components/common/CodeBlock";

const HERO_CODE = `# Confusing concept: Recursion
# Decoded: A function that calls itself with a smaller input
# until reaching a base condition.

def countdown(n: int) -> None:
    if n <= 0:
        print("Done!")
        return
    print(n)
    countdown(n - 1)`;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-glow border-b border-[var(--border)] pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Columns 1-8: Left-aligned Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Main Headline (sentence case, no colored single words) */}
            <h1 className="text-h1 font-display font-bold text-[var(--heading)] mb-5">
              Decode any topic, one clear step at a time.
            </h1>

            {/* Subtext from Section 10 */}
            <p className="text-body-ui text-[var(--text)] mb-6 max-w-xl leading-relaxed">
              Free notes, cheat sheets, and roadmaps for Python, web development, DSA, and data science.
            </p>

            {/* Signature Element: The Decode Moment (Section 5) */}
            <div className="w-full mb-8 p-3.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--accent)] shrink-0 select-none">
                decode:
              </span>
              <p className="text-sm font-mono text-[var(--heading)] leading-normal truncate">
                <DecodeText
                  text="A loop repeats a task until a condition stops it."
                  durationMs={1600}
                />
              </p>
            </div>

            {/* Buttons per Section 6: No arrow glyphs, exact labels */}
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/resources" variant="primary">
                Browse resources
              </Button>
              <Button
                href="https://www.youtube.com/@codedecoded01"
                external
                variant="secondary"
              >
                Watch on YouTube
              </Button>
            </div>
          </div>

          {/* Columns 9-12: Quiet code snippet panel */}
          <div className="lg:col-span-5 w-full">
            <CodeBlock
              code={HERO_CODE}
              language="python"
              filename="recursion_decoded.py"
              showLineNumbers={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
