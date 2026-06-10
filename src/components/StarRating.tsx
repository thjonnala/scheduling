interface StarRatingProps {
  /** Current rating value (may be fractional in read-only mode) */
  value: number;
  /** When provided, stars become clickable buttons */
  onChange?: (value: number) => void;
  /** Visual size of each star in pixels */
  size?: number;
}

/**
 * Star rating display / input. Read-only when `onChange` is omitted;
 * otherwise renders five keyboard-accessible buttons.
 */
export default function StarRating({ value, onChange, size = 22 }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  const star = (filled: boolean) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.58l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  );

  if (!onChange) {
    return (
      <div
        className="flex items-center gap-0.5 text-amber-500"
        role="img"
        aria-label={`Rated ${value} out of 5 stars`}
      >
        {stars.map((s) => (
          <span key={s} className={s <= Math.round(value) ? "" : "opacity-30"}>
            {star(s <= Math.round(value))}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={value === s}
          aria-label={`${s} star${s > 1 ? "s" : ""}`}
          onClick={() => onChange(s)}
          className={`rounded p-0.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${
            s <= value ? "text-amber-500" : "text-gray-300 hover:text-amber-400"
          }`}
        >
          {star(s <= value)}
        </button>
      ))}
    </div>
  );
}
