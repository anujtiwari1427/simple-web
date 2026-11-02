"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { InstagramIcon, YoutubeIcon, TelegramIcon, GithubIcon } from "./BrandIcons";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-deep)] text-[var(--muted)] font-display transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="default" />
            <p className="text-small text-[var(--muted)] max-w-sm leading-relaxed">
              The home base for Code Decoded. Free resources, roadmaps, tutorials, and notes for students and developers learning in India.
            </p>

            {/* Social channels with handles as text per Section 6 */}
            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href="https://www.youtube.com/@codedecoded01"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <YoutubeIcon className="w-5 h-5 text-[var(--accent)]" />
                <span>YouTube: @codedecoded01</span>
              </a>

              <a
                href="https://www.instagram.com/coded.ecoded"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <InstagramIcon className="w-5 h-5 text-[var(--accent)]" />
                <span>Instagram: @coded.ecoded</span>
              </a>

              <a
                href="https://t.me/codedecoded_official"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <TelegramIcon className="w-5 h-5 text-[var(--accent)]" />
                <span>Telegram: @codedecoded_official</span>
              </a>
            </div>
          </div>

          {/* Column: Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--heading)]">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources?topic=DSA" className="hover:text-[var(--accent)] transition-colors">
                  DSA cheat sheets
                </Link>
              </li>
              <li>
                <Link href="/resources?topic=Python" className="hover:text-[var(--accent)] transition-colors">
                  Python notes
                </Link>
              </li>
              <li>
                <Link href="/resources?topic=Web+dev" className="hover:text-[var(--accent)] transition-colors">
                  Web development notes
                </Link>
              </li>
              <li>
                <Link href="/resources?topic=DBMS" className="hover:text-[var(--accent)] transition-colors">
                  DBMS & SQL notes
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-[var(--accent)] hover:underline">
                  Browse all resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Roadmaps */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--heading)]">
              Roadmaps
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/roadmaps/full-stack-web-dev" className="hover:text-[var(--accent)] transition-colors">
                  Full-stack web development
                </Link>
              </li>
              <li>
                <Link href="/roadmaps/dsa-placement-roadmap" className="hover:text-[var(--accent)] transition-colors">
                  DSA for placements
                </Link>
              </li>
              <li>
                <Link href="/roadmaps/python-data-science" className="hover:text-[var(--accent)] transition-colors">
                  Python & data science
                </Link>
              </li>
              <li>
                <Link href="/roadmaps" className="text-[var(--accent)] hover:underline">
                  View all roadmaps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--heading)]">
              About & Updates
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[var(--accent)] transition-colors">
                  Why Code Decoded exists
                </Link>
              </li>
              <li>
                <Link href="/updates" className="hover:text-[var(--accent)] transition-colors">
                  Updates timeline
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[var(--accent)] transition-colors">
                  Tutorials & articles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">
                  Contact & collaboration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 mt-12 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Code Decoded. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Free education for all students</span>
            <a
              href="https://github.com/codedecoded"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[var(--heading)]"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
