const defaultRules = { pointsPerWin: 3, pointsPerLoss: 0 };

// The competition's own rules, with defaults for anything it doesn't set.
export function getRules(competition) {
  return { ...defaultRules, ...competition.rules };
}

// Builds the standings table for one competition.
// `matches` is the full list (with teamA / teamB objects), as in data/lookup.js.
export function computeStandings(competition, matches) {
  const { pointsPerWin, pointsPerLoss } = getRules(competition);
  const rows = new Map(); // team id -> row

  function rowFor(team) {
    if (!rows.has(team.id)) {
      rows.set(team.id, {
        team,
        played: 0,
        wins: 0,
        losses: 0,
        gamesWon: 0,
        gamesLost: 0,
        points: 0,
      });
    }
    return rows.get(team.id);
  }

  for (const match of matches) {
    if (
      match.competitionId !== competition.id ||
      match.stage !== "Regular Season"
    )
      continue;

    // Create rows first, so teams show up even before they have played.
    const a = rowFor(match.teamA);
    const b = rowFor(match.teamB);

    if (match.status !== "completed") continue;

    a.played += 1;
    b.played += 1;
    a.gamesWon += match.scoreA;
    a.gamesLost += match.scoreB;
    b.gamesWon += match.scoreB;
    b.gamesLost += match.scoreA;

    if (match.scoreA > match.scoreB) {
      a.wins += 1;
      b.losses += 1;
      a.points += pointsPerWin;
      b.points += pointsPerLoss;
    } else if (match.scoreB > match.scoreA) {
      b.wins += 1;
      a.losses += 1;
      b.points += pointsPerWin;
      a.points += pointsPerLoss;
    }
  }

  // Points, then wins, then game difference, then name.
  return [...rows.values()]
    .sort(
      (x, y) =>
        y.points - x.points ||
        y.wins - x.wins ||
        y.gamesWon - y.gamesLost - (x.gamesWon - x.gamesLost) ||
        x.team.name.localeCompare(y.team.name),
    )
    .map((row, index) => ({ ...row, position: index + 1 }));
}
