const options = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
];

// A segmented control: one connected row of buttons, one active at a time.
export default function StatusFilter({ value, onChange }) {
  return (
    <div className="flex w-full overflow-x-auto border border-line sm:w-fit">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`flex-1 border-l border-line px-3 py-1.5 text-sm font-semibold first:border-l-0 sm:flex-none sm:px-4 ${
            value === option.id
              ? "bg-accent text-black"
              : "bg-surface text-zinc-300 hover:bg-surface-hover hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
