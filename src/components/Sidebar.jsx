import RegionBadge from "./RegionBadge";

// The active item gets a solid 2px accent bar on the left.
function itemClass(active) {
  return `flex w-full items-center gap-2 border-l-2 px-2 py-1.5 text-left text-sm ${
    active
      ? "border-accent bg-surface-hover font-semibold text-white"
      : "border-transparent text-zinc-300 hover:bg-surface-hover hover:text-white"
  }`;
}

const headingClass = "mb-1 px-2 text-[11px] font-bold uppercase tracking-wider";

export default function Sidebar({
  regions,
  competitions,
  selectedRegionId,
  selectedCompetitionId,
  onSelectRegion,
  onSelectCompetition,
}) {
  const featured = competitions.filter((c) => c.featured);

  return (
    <nav aria-label="Regions and competitions" className="space-y-4">
      <section>
        <h3 className={`${headingClass} text-accent`}>Featured competitions</h3>
        <ul>
          {featured.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={itemClass(selectedCompetitionId === c.id)}
                onClick={() => onSelectCompetition(c)}
              >
                <span className="truncate">{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className={`${headingClass} text-zinc-400`}>Regions</h3>
        <ul>
          <li>
            <button
              type="button"
              className={itemClass(selectedRegionId === "all")}
              onClick={() => onSelectRegion("all")}
            >
              All regions
            </button>
          </li>
          {regions.map((region) => {
            const isSelected = selectedRegionId === region.id;
            const regionCompetitions = competitions.filter(
              (c) => c.regionId === region.id,
            );

            return (
              <li key={region.id}>
                <button
                  type="button"
                  className={itemClass(
                    isSelected && selectedCompetitionId === "all",
                  )}
                  onClick={() => onSelectRegion(region.id)}
                >
                  <RegionBadge region={region} />
                  <span className="truncate">{region.name}</span>
                </button>

                {/* Leagues appear under the selected region only */}
                {isSelected && regionCompetitions.length > 0 && (
                  <ul className="ml-3 border-l border-line">
                    {regionCompetitions.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          className={itemClass(selectedCompetitionId === c.id)}
                          onClick={() => onSelectCompetition(c)}
                        >
                          <span className="truncate">{c.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </nav>
  );
}
