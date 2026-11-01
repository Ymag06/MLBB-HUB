import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { regions } from "../data/regions";
import { competitions } from "../data/competitions";
import { allMatches, regionsById, competitionsById } from "../data/lookup";
import { fromInputValue, isSameDay, toInputValue } from "../utils/dates";
import Sidebar from "../components/Sidebar";
import DateSelector from "../components/DateSelector";
import StatusFilter from "../components/StatusFilter";
import MatchList from "../components/MatchList";

// The fake loading delay only runs the first time Home appears, so coming back
// from a match page doesn't replay it. Remove this when real fetching is added.
let hasLoadedOnce = false;

const validStatuses = ["live", "upcoming", "completed"];

// Returns the value if it is a known id in the table, otherwise "all".
function pickKnown(value, table) {
  return value && Object.hasOwn(table, value) ? value : "all";
}

export default function Home({ search }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(!hasLoadedOnce);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fake loading delay so you can see the skeleton. Replace with a real fetch later.
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      hasLoadedOnce = true;
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [loading]);

  // The filters live in the URL, e.g. /?date=2026-11-02&status=live&region=ph
  // A missing or invalid value falls back to the default.
  const dateParam = searchParams.get("date");
  const selectedDate = /^\d{4}-\d{2}-\d{2}$/.test(dateParam ?? "")
    ? fromInputValue(dateParam)
    : new Date();

  const statusParam = searchParams.get("status");
  const status = validStatuses.includes(statusParam) ? statusParam : "all";

  const regionId = pickKnown(searchParams.get("region"), regionsById);
  const competitionId = pickKnown(
    searchParams.get("competition"),
    competitionsById,
  );

  // Change some URL parameters. A value of null removes that parameter.
  function updateParams(changes) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  }

  function handleDateChange(date) {
    updateParams({
      date: isSameDay(date, new Date()) ? null : toInputValue(date),
    });
  }

  function handleStatusChange(value) {
    updateParams({ status: value === "all" ? null : value });
  }

  function handleSelectRegion(id) {
    updateParams({ region: id === "all" ? null : id, competition: null });
    setSidebarOpen(false);
  }

  function handleSelectCompetition(competition) {
    updateParams({ region: competition.regionId, competition: competition.id });
    setSidebarOpen(false);
  }

  const query = search.trim().toLowerCase();

  const visibleMatches = allMatches.filter((match) => {
    if (!isSameDay(new Date(match.startTime), selectedDate)) return false;
    if (status !== "all" && match.status !== status) return false;
    if (regionId !== "all" && match.competition.regionId !== regionId)
      return false;
    if (competitionId !== "all" && match.competitionId !== competitionId)
      return false;
    if (query) {
      const searchable = [
        match.teamA.name,
        match.teamB.name,
        match.competition.name,
      ];
      if (!searchable.some((text) => text.toLowerCase().includes(query)))
        return false;
    }
    return true;
  });

  // Text for the mobile button, so users can see which filter is active.
  let selectionLabel = "All regions";
  if (competitionId !== "all")
    selectionLabel = competitionsById[competitionId].name;
  else if (regionId !== "all") selectionLabel = regionsById[regionId].name;

  // The same sidebar is used on desktop (fixed column) and mobile (drawer).
  const sidebar = (
    <Sidebar
      regions={regions}
      competitions={competitions}
      selectedRegionId={regionId}
      selectedCompetitionId={competitionId}
      onSelectRegion={handleSelectRegion}
      onSelectCompetition={handleSelectCompetition}
    />
  );

  return (
    <div className="mx-auto flex max-w-6xl gap-3 px-3 py-3">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-[4.25rem] max-h-[calc(100vh-5.25rem)] overflow-y-auto border border-line bg-surface p-2">
          {sidebar}
        </div>
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/70"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto border-r border-line bg-surface p-2">
            {sidebar}
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1 space-y-3">
        <p className="border border-line bg-surface px-3 py-2 text-xs text-zinc-300">
          <span className="font-bold text-white">Sample data.</span> Every team,
          league and match on this page is fictional.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex max-w-full items-center gap-2 border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-zinc-100 hover:bg-surface-hover lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0"
            >
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <span className="truncate">{selectionLabel}</span>
          </button>
          <DateSelector date={selectedDate} onChange={handleDateChange} />
        </div>

        <StatusFilter value={status} onChange={handleStatusChange} />
        <MatchList matches={visibleMatches} loading={loading} />
      </main>
    </div>
  );
}
