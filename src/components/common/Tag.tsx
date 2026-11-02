import React from "react";

interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  asButton?: boolean;
}

export function Tag({
  children,
  active = false,
  onClick,
  className = "",
  asButton = false,
}: TagProps) {
  const baseClasses =
    "inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-display rounded-[6px] transition-colors leading-normal";

  const stateClasses = active
    ? "bg-[var(--surface)] text-[var(--accent)] border border-[var(--accent)] font-medium"
    : "bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--muted)]";

  if (asButton || onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${stateClasses} cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={`${baseClasses} ${stateClasses} ${className}`}>
      {children}
    </span>
  );
}
