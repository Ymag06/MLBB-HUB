// All names are fictional, so nothing is mistaken for a real tournament.
// `rules` is optional. Missing values default to 3 points per win and 0 per loss.
export const competitions = [
  {
    id: "ph-demo",
    regionId: "ph",
    name: "Demo Islands League",
    season: "Season 1 2026",
    featured: true,
  },
  {
    id: "id-demo",
    regionId: "id",
    name: "Demo Nusantara Cup",
    season: "Season 1 2026",
    featured: true,
  },
  {
    id: "my-demo",
    regionId: "my",
    name: "Demo Peninsula Series",
    season: "Season 1 2026",
    featured: false,
  },
  {
    id: "sg-demo",
    regionId: "sg",
    name: "Demo Lion City Open",
    season: "Season 1 2026",
    featured: false,
    rules: { pointsPerWin: 2, pointsPerLoss: 1 },
  },
  {
    id: "br-demo",
    regionId: "br",
    name: "Demo Brasil Challenge",
    season: "Season 1 2026",
    featured: false,
  },
  {
    id: "tr-demo",
    regionId: "tr",
    name: "Demo Anatolia League",
    season: "Season 1 2026",
    featured: false,
  },
  {
    id: "mena-demo",
    regionId: "mena",
    name: "Demo Desert Clash",
    season: "Season 1 2026",
    featured: false,
  },
  {
    id: "world-demo",
    regionId: "other",
    name: "Demo World Invitational",
    season: "Season 1 2026",
    featured: true,
  },
];
