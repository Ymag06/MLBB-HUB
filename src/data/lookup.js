import { regions } from "./regions";
import { competitions } from "./competitions";
import { teams } from "./teams";
import { matches } from "./matches";

// "id -> object" lookup tables, built once. Later Supabase will do this join for us.
export const regionsById = Object.fromEntries(regions.map((r) => [r.id, r]));
export const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]));
export const competitionsById = Object.fromEntries(
  competitions.map((c) => [c.id, { ...c, region: regionsById[c.regionId] }]),
);

// Replace the IDs in each match with the full team and competition objects.
export const allMatches = matches
  .map((m) => ({
    ...m,
    teamA: teamsById[m.teamAId],
    teamB: teamsById[m.teamBId],
    competition: competitionsById[m.competitionId],
  }))
  .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

export function getMatchById(id) {
  return allMatches.find((m) => m.id === id);
}
