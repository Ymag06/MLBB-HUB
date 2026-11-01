export default function RegionBadge({ region }) {
  return (
    <span className="inline-flex min-w-9 shrink-0 justify-center border border-line bg-canvas px-1 py-0.5 font-mono text-[10px] font-bold text-zinc-300">
      {region.code}
    </span>
  );
}
