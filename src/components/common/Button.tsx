import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  href,
  external = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-display font-semibold text-sm rounded-[6px] min-h-[44px] px-5 py-2.5 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2";

  const variantStyles = {
    primary:
      "bg-[var(--accent)] text-[var(--ink-950)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent)] font-semibold shadow-none",
    secondary:
      "bg-transparent border border-[var(--border)] text-[var(--heading)] hover:border-[var(--accent)] active:border-[var(--accent)]",
    ghost:
      "bg-transparent text-[var(--accent)] hover:underline p-0 min-h-0 h-auto font-normal",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedStyles}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
