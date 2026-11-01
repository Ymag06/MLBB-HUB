import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import RegionBadge from "../components/RegionBadge";
import TeamLogo from "../components/TeamLogo";
import { getMatchById, teamsById } from "../data/lookup";
import { formatDateTime, formatDuration, formatTime } from "../utils/dates";

function BackLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-300 hover:text-white"
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
      Back to matches
    </Link>
  );
}

// A titled box, used for the Games and MVP sections.
function Panel({ title, children }) {
  return (
    <section className="border border-line bg-surface">
      <h2 className="border-b border-line bg-surface-hover px-3 py-1.5 text-sm font-bold text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

function TeamBlock({ team, dimmed }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <TeamLogo team={team} size="lg" />
      <div>
        <p
          className={`text-sm font-bold sm:text-base ${dimmed ? "text-zinc-400" : "text-white"}`}
        >
          {team.name}
        </p>
        <p className="font-mono text-xs text-zinc-400">{team.acronym}</p>
      </div>
    </div>
  );
}

export default function MatchDetails() {
  // useParams reads ":matchId" from the URL /match/:matchId
  const { matchId } = useParams();
  const match = getMatchById(matchId);

  // Start at the top of the page when opening a match (the list may have been scrolled).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [matchId]);

  if (!match) {
    return (
      <div className="mx-auto max-w-3xl space-y-3 px-3 py-3">
        <BackLink />
        <div className="border border-line bg-surface px-6 py-12 text-center">
          <p className="font-semibold text-white">Match not found</p>
          <p className="mt-1 text-sm text-zinc-400">
            This match does not exist or the link is wrong.
          </p>
        </div>
      </div>
    );
  }

  const { teamA, teamB, competition, games } = match;
  const isCompleted = match.status === "completed";
  const aWon = isCompleted && match.scoreA > match.scoreB;
  const bWon = isCompleted && match.scoreB > match.scoreA;

  let emptyGamesText = "No game results recorded for this match.";
  if (match.status === "upcoming")
    emptyGamesText = "Game results will appear once the match starts.";
  if (match.status === "live") emptyGamesText = "No games have finished yet.";

  return (
    <div className="mx-auto max-w-3xl space-y-3 px-3 py-3">
      <BackLink />

      {/* Scoreboard */}
      <div className="border border-line bg-surface">
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface-hover px-3 py-1.5">
          <RegionBadge region={competition.region} />
          <span className="text-sm font-bold text-white">
            {competition.name}
          </span>
          <span className="text-xs text-zinc-400">
            {match.stage} / {competition.season}
          </span>
          <span className="ml-auto font-mono text-xs font-semibold text-zinc-300">
            BO{match.numberOfGames}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-6 sm:px-8">
          <TeamBlock team={teamA} dimmed={bWon} />

          <div className="w-24 shrink-0 text-center sm:w-32">
            {match.status === "upcoming" ? (
              <>
                <p className="font-mono text-2xl font-bold text-white">
                  {formatTime(match.startTime)}
                </p>
                <p className="mt-1 text-xs font-semibold text-zinc-400">
                  UPCOMING
                </p>
              </>
            ) : (
              <>
                <p className="font-mono text-3xl font-bold text-white">
                  {match.scoreA} - {match.scoreB}
                </p>
                {match.status === "live" ? (
                  <span className="mt-1 inline-block bg-red-600 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                    LIVE
                  </span>
                ) : (
                  <p className="mt-1 font-mono text-xs font-semibold text-zinc-400">
                    FINAL
                  </p>
                )}
              </>
            )}
          </div>

          <TeamBlock team={teamB} dimmed={aWon} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-line px-3 py-2 text-xs text-zinc-400">
          <span>
            {formatDateTime(match.startTime)} / {competition.region.name}
          </span>
          {match.streamUrl && (
            <a
              href={match.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line px-2 py-1 font-semibold text-accent hover:bg-surface-hover"
            >
              Watch stream
            </a>
          )}
        </div>
      </div>

      {/* Individual games */}
      <Panel title="Games">
        {games.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-zinc-400">
            {emptyGamesText}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-zinc-400">
                  <th className="px-3 py-2 font-semibold">Game</th>
                  <th className="px-3 py-2 font-semibold">Winner</th>
                  <th className="px-3 py-2 font-semibold">Duration</th>
                  <th className="px-3 py-2 text-right font-semibold">Series</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {games.map((game, index) => {
                  const winner = teamsById[game.winnerTeamId];
                  // Running series score after this game
                  const played = games.slice(0, index + 1);
                  const aWins = played.filter(
                    (x) => x.winnerTeamId === teamA.id,
                  ).length;
                  const bWins = played.filter(
                    (x) => x.winnerTeamId === teamB.id,
                  ).length;

                  return (
                    <tr key={game.number}>
                      <td className="px-3 py-2 font-mono text-zinc-300">
                        {game.number}
                      </td>
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-2">
                          <TeamLogo team={winner} />
                          <span className="font-semibold text-white">
                            {winner.name}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-zinc-300">
                        {formatDuration(game.durationSeconds)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-zinc-300">
                        {aWins} - {bWins}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* MVP (completed matches only) */}
      {isCompleted && (
        <Panel title="MVP">
          {match.mvp ? (
            <div className="flex items-center gap-3 px-3 py-3">
              <TeamLogo team={teamsById[match.mvp.teamId]} />
              <div>
                <p className="text-sm font-bold text-white">{match.mvp.name}</p>
                <p className="text-xs text-zinc-400">
                  {teamsById[match.mvp.teamId].name}
                </p>
              </div>
            </div>
          ) : (
            <p className="px-3 py-6 text-center text-sm text-zinc-400">
              MVP not available for this match.
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}
