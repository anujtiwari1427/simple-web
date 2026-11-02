"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import { CommandPalette } from "./CommandPalette";
import { YoutubeIcon, InstagramIcon } from "./BrandIcons";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Resources", href: "/resources" },
    { name: "Roadmaps", href: "/roadmaps" },
    { name: "Blog", href: "/blog" },
    { name: "Updates", href: "/updates" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full h-16 transition-colors duration-200 ${
          scrolled
            ? "bg-[var(--bg)]/85 backdrop-blur-md border-b border-[var(--border)]"
            : "bg-[var(--bg)] border-b border-[var(--border)]"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo on Left */}
          <BrandLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-[6px] text-sm font-display font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                    isActive
                      ? "text-[var(--accent)] font-semibold"
                      : "text-[var(--muted)] hover:text-[var(--heading)]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right end: Search, Social Links, Theme toggle, Mobile Menu button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search (Q / Command Palette trigger) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--heading)] hover:border-[var(--accent)] transition-colors text-xs font-display focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer"
              aria-label="Search resources"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] rounded-[4px] bg-[var(--bg-deep)] border border-[var(--border)] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Instagram link in secondary area per Section 6 */}
            <a
              href="https://www.instagram.com/coded.ecoded"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 h-10 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--heading)] hover:border-[var(--accent)] transition-colors text-xs font-display focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              aria-label="Code Decoded on Instagram"
            >
              <InstagramIcon className="w-4 h-4 text-[var(--accent)]" />
              <span>@coded.ecoded</span>
            </a>

            {/* YouTube link in secondary area per Section 6 */}
            <a
              href="https://www.youtube.com/@codedecoded01"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 h-10 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--heading)] hover:border-[var(--accent)] transition-colors text-xs font-display focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              aria-label="Code Decoded on YouTube"
            >
              <YoutubeIcon className="w-4 h-4 text-[var(--accent)]" />
              <span>@codedecoded01</span>
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--heading)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border)] bg-[var(--bg)] px-4 py-4 space-y-2">
            {navLinks.map(link => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-[6px] text-sm font-display font-medium ${
                    isActive
                      ? "text-[var(--accent)] font-semibold bg-[var(--surface)]"
                      : "text-[var(--muted)] hover:text-[var(--heading)]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-[var(--border)] flex flex-col gap-2">
              <a
                href="https://www.instagram.com/coded.ecoded"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--heading)] font-display px-3 py-1.5"
              >
                <InstagramIcon className="w-4 h-4 text-[var(--accent)]" />
                <span>Instagram: @coded.ecoded</span>
              </a>
              <a
                href="https://www.youtube.com/@codedecoded01"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--heading)] font-display px-3 py-1.5"
              >
                <YoutubeIcon className="w-4 h-4 text-[var(--accent)]" />
                <span>YouTube: @codedecoded01</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Command Palette */}
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
