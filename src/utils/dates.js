export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

// Date -> "2026-10-29", the format <input type="date"> uses.
export function toInputValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// "2026-10-29" -> Date. We build it from parts to avoid time-zone off-by-one bugs.
export function fromInputValue(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDayLabel(date) {
  const today = new Date();
  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, addDays(today, -1))) return "Yesterday";
  if (isSameDay(date, addDays(today, 1))) return "Tomorrow";
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Shown in the visitor's own time zone.
export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
// 1249 seconds -> "20:49"
export function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

// "Sun, 1 Nov 2026, 14:00" in the visitor's time zone.
export function formatDateTime(iso) {
  const day = new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${day}, ${formatTime(iso)}`;
}
