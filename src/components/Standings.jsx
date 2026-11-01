import { useSearchParams } from "react-router-dom";
import RegionBadge from "./RegionBadge";
import TeamLogo from "./TeamLogo";
import { allMatches, competitionsById } from "../data/lookup";
import { computeStandings, getRules } from "../utils/standings";

const competitionList = Object.values(competitionsById);

const headerCell = "px-3 py-2 font-semibold";
const numberCell = "px-3 py-2 text-right font-mono text-zinc-300";

export default function Standings() {
  // The chosen competition lives in the URL: /standings?competition=ph-demo
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("competition") ?? "";
  const competition = Object.hasOwn(competitionsById, requested)
    ? competitionsById[requested]
    : competitionList[0];

  const rows = computeStandings(competition, allMatches);
  const rules = getRules(competition);

  return (
    <div className="mx-auto max-w-3xl space-y-3 px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-bold text-white">Standings</h1>
        <select
          aria-label="Competition"
          value={competition.id}
          onChange={(e) =>
            setSearchParams({ competition: e.target.value }, { replace: true })
          }
          className="border border-line bg-surface px-2 py-1.5 text-sm text-zinc-100 focus:border-accent focus:outline-none"
        >
          {competitionList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.region.code} / {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-line bg-surface">
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface-hover px-3 py-1.5">
          <RegionBadge region={competition.region} />
          <h2 className="text-sm font-bold text-white">{competition.name}</h2>
          <span className="text-xs text-zinc-400">
            {competition.season} / Regular Season
          </span>
        </div>

        {rows.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-zinc-400">
            No regular season matches for this competition yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-zinc-400">
                  <th className={`${headerCell} w-10 text-left`}>#</th>
                  <th className={`${headerCell} text-left`}>Team</th>
                  <th className={`${headerCell} text-right`}>P</th>
                  <th className={`${headerCell} text-right`}>W</th>
                  <th className={`${headerCell} text-right`}>L</th>
                  <th className={`${headerCell} text-right`}>GD</th>
                  <th className={`${headerCell} text-right`}>Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => {
                  const gameDiff = row.gamesWon - row.gamesLost;
                  return (
                    <tr key={row.team.id} className="hover:bg-surface-hover">
                      <td className="px-3 py-2 font-mono text-zinc-400">
                        {row.position}
                      </td>
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-2">
                          <TeamLogo team={row.team} />
                          <span className="font-semibold text-white">
                            {row.team.name}
                          </span>
                        </span>
                      </td>
                      <td className={numberCell}>{row.played}</td>
                      <td className={numberCell}>{row.wins}</td>
                      <td className={numberCell}>{row.losses}</td>
                      <td className={numberCell}>
                        {gameDiff > 0 ? `+${gameDiff}` : gameDiff}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-white">
                        {row.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-400">
        Points: {rules.pointsPerWin} per win, {rules.pointsPerLoss} per loss.
        Ties are broken by wins, then game difference (GD), then team name. Only
        completed Regular Season matches count.
      </p>
    </div>
  );
}
