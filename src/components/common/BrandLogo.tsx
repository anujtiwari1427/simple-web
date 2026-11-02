import Link from "next/link";

interface BrandLogoProps {
  showWordmark?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function BrandLogo({ showWordmark = true, size = "default", className = "" }: BrandLogoProps) {
  const boxSizes = {
    sm: "w-8 h-8 rounded-[4px] text-[9px]",
    default: "w-10 h-10 rounded-[6px] text-[11px]",
    lg: "w-14 h-14 rounded-[8px] text-[15px]",
  };

  const textSizes = {
    sm: "text-base",
    default: "text-lg",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[var(--accent)] outline-offset-2 rounded-[6px] ${className}`}
      aria-label="Code Decoded Home"
    >
      {/* Exact Logo Lockup from Design Spec & Image */}
      <div
        className={`${boxSizes[size]} bg-[#0F1828] border border-[#22304A] flex flex-col items-center justify-center font-display font-extrabold select-none shrink-0 transition-colors`}
        style={{ letterSpacing: "-0.01em" }}
      >
        <span className="text-[#3B9DF0] leading-none font-extrabold tracking-wide">
          CODE
        </span>
        <span className="text-[#F7F8FA] leading-tight font-extrabold tracking-tight mt-[1px]">
          DECODED
        </span>
      </div>

      {showWordmark && (
        <span className={`font-display font-bold ${textSizes[size]} text-[var(--heading)] tracking-tight`}>
          Code Decoded
        </span>
      )}
    </Link>
  );
}
