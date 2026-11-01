import {
  addDays,
  formatDayLabel,
  fromInputValue,
  isSameDay,
  toInputValue,
} from "../utils/dates";

const arrowButton =
  "border border-line bg-surface p-1.5 text-zinc-300 hover:bg-surface-hover hover:text-white";

export default function DateSelector({ date, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous day"
          className={arrowButton}
          onClick={() => onChange(addDays(date, -1))}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <span className="min-w-28 text-center text-sm font-bold text-white">
          {formatDayLabel(date)}
        </span>

        <button
          type="button"
          aria-label="Next day"
          className={arrowButton}
          onClick={() => onChange(addDays(date, 1))}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Native calendar picker: no extra dependency needed */}
      <input
        type="date"
        value={toInputValue(date)}
        onChange={(e) =>
          e.target.value && onChange(fromInputValue(e.target.value))
        }
        className="border border-line bg-surface px-2 py-1 font-mono text-sm text-zinc-100 focus:border-accent focus:outline-none"
      />

      {!isSameDay(date, new Date()) && (
        <button
          type="button"
          onClick={() => onChange(new Date())}
          className="border border-line bg-surface px-2 py-1 text-sm font-semibold text-accent hover:bg-surface-hover"
        >
          Today
        </button>
      )}
    </div>
  );
}
