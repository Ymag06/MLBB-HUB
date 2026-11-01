const sizes = {
  md: "h-6 w-6 text-[10px]",
  lg: "h-14 w-14 text-base",
};

// Placeholder logo: a square tile with the team's initials in the team color.
// When teams have real logo images, render an <img> here instead.
export default function TeamLogo({ team, size = "md" }) {
  const initials = team.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3);

  return (
    <span
      className={`flex shrink-0 items-center justify-center border bg-canvas font-bold ${sizes[size]}`}
      style={{ borderColor: team.color, color: team.color }}
    >
      {initials}
    </span>
  );
}
