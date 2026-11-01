import { Link } from "react-router-dom";
import TeamLogo from "./TeamLogo";
import { formatTime } from "../utils/dates";

// Left column: LIVE tag, FINAL, or the kick-off time.
function StatusCell({ match }) {
  if (match.status === "live") {
    return (
      <span className="bg-red-600 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
        LIVE
      </span>
    );
  }
  if (match.status === "completed") {
    return (
      <span className="font-mono text-xs font-semibold text-zinc-400">
        FINAL
      </span>
    );
  }
  return (
    <span className="font-mono text-sm font-semibold text-zinc-100">
      {formatTime(match.startTime)}
    </span>
  );
}

// One team line: logo, name, series score. `dimmed` greys out the loser.
function TeamRow({ team, score, dimmed }) {
  return (
    <div className="flex items-center gap-2">
      <TeamLogo team={team} />
      <span
        className={`min-w-0 flex-1 truncate text-sm ${dimmed ? "text-zinc-400" : "font-semibold text-white"}`}
      >
        {team.name}
      </span>
      {score !== null && (
        <span
          className={`w-5 text-right font-mono text-sm font-bold ${dimmed ? "text-zinc-400" : "text-white"}`}
        >
          {score}
        </span>
      )}
    </div>
  );
}

export default function MatchCard({ match }) {
  const isCompleted = match.status === "completed";
  const aWon = isCompleted && match.scoreA > match.scoreB;
  const bWon = isCompleted && match.scoreB > match.scoreA;

  return (
    <Link
      to={`/match/${match.id}`}
      className="flex items-center gap-3 px-3 py-2 hover:bg-surface-hover"
    >
      <div className="flex w-14 shrink-0 justify-center">
        <StatusCell match={match} />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <TeamRow team={match.teamA} score={match.scoreA} dimmed={bWon} />
        <TeamRow team={match.teamB} score={match.scoreB} dimmed={aWon} />
      </div>
      <span className="shrink-0 border border-line px-1.5 py-0.5 font-mono text-[11px] font-semibold text-zinc-300">
        BO{match.numberOfGames}
      </span>
    </Link>
  );
}
