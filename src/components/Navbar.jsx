import { Link, NavLink } from "react-router-dom";

// `to: null` means the page doesn't exist yet, so it's shown greyed out.
const links = [
  { label: "Matches", to: "/" },
  { label: "Standings", to: "/standings" },
  { label: "Favorites", to: null },
];

export default function Navbar({ search, onSearchChange }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center bg-accent text-sm font-black text-black">
            M
          </span>
          <span className="hidden font-bold text-white sm:block">
            MLBB <span className="text-accent">MatchHub</span>
          </span>
        </Link>

        {/* Tab-style links: the active one gets an accent underline */}
        <nav className="flex h-full shrink-0">
          {links.map((link) =>
            link.to ? (
              <NavLink
                key={link.label}
                to={link.to}
                end
                className={({ isActive }) =>
                  `flex h-full items-center border-b-2 px-2 text-sm font-semibold sm:px-3 ${
                    isActive
                      ? "border-accent text-white"
                      : "border-transparent text-zinc-300 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ) : (
              <span
                key={link.label}
                title="Coming soon"
                className="hidden h-full cursor-not-allowed items-center px-3 text-sm font-semibold text-zinc-500 sm:flex"
              >
                {link.label}
              </span>
            ),
          )}
        </nav>

        <div className="relative ml-auto min-w-0 max-w-xs flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          >
            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search teams or leagues"
            className="w-full border border-line bg-canvas py-1.5 pl-8 pr-3 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-accent focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}
