import MatchCard from "./MatchCard";
import RegionBadge from "./RegionBadge";

// Turns a flat list of matches into [{ competition, matches }, ...]
function groupByCompetition(matches) {
  const groups = [];
  for (const match of matches) {
    let group = groups.find((g) => g.competition.id === match.competition.id);
    if (!group) {
      group = { competition: match.competition, matches: [] };
      groups.push(group);
    }
    group.matches.push(match);
  }
  return groups;
}

// Static placeholder blocks shown while data loads (no animation).
function MatchListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="border border-line bg-surface">
          <div className="h-8 bg-surface-hover" />
          {[1, 2, 3].map((j) => (
            <div
              key={j}
              className="flex items-center gap-3 border-t border-line px-3 py-3"
            >
              <div className="h-4 w-12 bg-surface-hover" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/2 bg-surface-hover" />
                <div className="h-3 w-2/5 bg-surface-hover" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function MatchList({ matches, loading }) {
  if (loading) return <MatchListSkeleton />;

  if (matches.length === 0) {
    return (
      <div className="border border-line bg-surface px-6 py-12 text-center">
        <p className="font-semibold text-white">No matches found</p>
        <p className="mt-1 text-sm text-zinc-400">
          Try another date, or change the status, region or search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groupByCompetition(matches).map(
        ({ competition, matches: groupMatches }) => (
          <section
            key={competition.id}
            className="border border-line bg-surface"
          >
            <header className="flex items-center gap-2 border-b border-line bg-surface-hover px-3 py-1.5">
              <RegionBadge region={competition.region} />
              <h2 className="truncate text-sm font-bold text-white">
                {competition.name}
              </h2>
              <span className="ml-auto shrink-0 text-xs text-zinc-400">
                {competition.region.name}
              </span>
            </header>
            <div className="divide-y divide-line">
              {groupMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ),
      )}
    </div>
  );
}
