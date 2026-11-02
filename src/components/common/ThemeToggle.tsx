"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--heading)] hover:border-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 cursor-pointer"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[var(--warning)]" />
      ) : (
        <Moon className="w-4 h-4 text-[var(--heading)]" />
      )}
    </button>
  );
}
