import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-display font-medium text-[var(--heading)]"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={`h-12 w-full px-3.5 rounded-[6px] bg-[var(--surface)] text-[var(--heading)] placeholder:text-[var(--muted)] border transition-colors ${
          error
            ? "border-[var(--danger)] focus-visible:outline-[var(--danger)]"
            : "border-[var(--border)] focus-visible:border-[var(--accent)]"
        } focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${className}`}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-xs text-[var(--danger)] font-display">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-[var(--muted)] font-display">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
