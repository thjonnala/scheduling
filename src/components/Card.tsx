import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  /** Renders hover/focus affordances and makes the card clickable */
  onClick?: () => void;
  /** Accessible label when the card is clickable */
  ariaLabel?: string;
  className?: string;
}

/**
 * Reusable card. When `onClick` is provided it renders as a
 * keyboard-focusable button element for accessibility.
 */
export default function Card({ children, onClick, ariaLabel, className = "" }: CardProps) {
  const base =
    "rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-sm transition";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`${base} text-left w-full cursor-pointer hover:border-gray-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${className}`}
      >
        {children}
      </button>
    );
  }

  return <div className={`${base} ${className}`}>{children}</div>;
}
