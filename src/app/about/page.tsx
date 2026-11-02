import { BrandLogo } from "@/components/common/BrandLogo";
import { YoutubeIcon, InstagramIcon } from "@/components/common/BrandIcons";

export const metadata = {
  title: "About Us | Code Decoded",
  description: "Why Code Decoded exists: clear, free programming education for students and developers.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 text-left">
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-h1 font-display font-bold text-[var(--heading)] mb-4">
            Why Code Decoded exists
          </h1>
          <p className="text-small text-[var(--muted)] leading-relaxed">
            A home base for learners who want clear explanations instead of academic jargon or expensive courses.
          </p>
        </div>

        {/* Logo Lockup Showcase */}
        <div className="p-8 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-center gap-6">
          <BrandLogo size="lg" showWordmark={false} />
          <div>
            <h2 className="text-h3 font-display font-semibold text-[var(--heading)] mb-1">
              The idea behind the name
            </h2>
            <p className="text-small text-[var(--muted)] leading-relaxed">
              Decoding is turning something confusing into something clear. Every note, cheat sheet, and video starts from this premise.
            </p>
          </div>
        </div>

        {/* The Story in Source Serif 4 */}
        <div className="font-reading text-[1.1875rem] text-[var(--text)] leading-[1.75] space-y-6">
          <p>
            Most programming courses online are designed to sell a certification, not to make a student genuinely confident. They bury fundamental insights under 40 hours of repetitive boilerplate or assume you already know what an abstraction means.
          </p>

          <p>
            Code Decoded started on Instagram and YouTube with a single goal: treat the learner like a smart junior who just needs a clear mental model. We explain the why before the syntax, use clean visual diagrams, and keep roadmaps realistic.
          </p>

          <p>
            Whether you are preparing for campus placement interviews, learning web development from scratch, or decoding data science with Python, everything here is free and built to save you time.
          </p>
        </div>

        {/* Links to Both Channels per Section 7 */}
        <div className="pt-8 border-t border-[var(--border)] font-display">
          <h3 className="text-sm font-semibold text-[var(--heading)] uppercase tracking-wider mb-4">
            Our channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://www.youtube.com/@codedecoded01"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors flex items-center gap-3.5 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <YoutubeIcon className="w-6 h-6 text-[var(--accent)] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[var(--heading)]">
                  YouTube
                </p>
                <p className="text-xs text-[var(--muted)]">
                  @codedecoded01 • Long-form tutorials
                </p>
              </div>
            </a>

            <a
              href="https://www.instagram.com/coded.ecoded"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors flex items-center gap-3.5 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <InstagramIcon className="w-6 h-6 text-[var(--accent)] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[var(--heading)]">
                  Instagram
                </p>
                <p className="text-xs text-[var(--muted)]">
                  @coded.ecoded • Visual diagrams & reels
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
