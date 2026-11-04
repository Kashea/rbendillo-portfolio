// Sanitised view of the Rigsafe data flow. System names are generic on purpose.

const top = [
  { label: "Source systems", sub: "field · forms · mail · files", x: 10 },
  { label: "Connectors", sub: "scheduled pulls", x: 188 },
  { label: "Normalise", sub: "one shared shape", x: 366 },
  { label: "Verify", sub: "checks before use", x: 544 },
];
const bottom = [
  { label: "Exception queue", sub: "a person clears it", x: 544, accent: true },
  { label: "Data layer & reports", sub: "only verified data", x: 366, accent: false },
  { label: "Outcome assertion", sub: "the whole chain passed", x: 188, accent: false },
  { label: "Error handler", sub: "fails loudly", x: 10, accent: false },
];
const W = 146;
const H = 72;
const ROW2 = 168;

export function RigsafePipeline() {
  return (
    <figure className="mt-5 rounded-[14px] border border-border bg-surface p-4 sm:p-6">
      <svg viewBox="0 0 700 250" className="h-auto w-full" role="img" aria-labelledby="rigsafe-flow-title">
        <title id="rigsafe-flow-title">
          Source systems feed connectors, data is normalised and verified, verified data reaches the data layer and reports,
          uncertain data goes to an exception queue, and failures go to an error handler.
        </title>
        <defs>
          <marker id="flow-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--accent)" />
          </marker>
        </defs>
        {["M156 46 H188", "M334 46 H366", "M512 46 H544", "M617 82 V168", "M572 82 Q 540 130 470 168", "M366 204 H334"].map(
          (d) => (
            <path key={d} d={d} fill="none" stroke="var(--accent)" strokeWidth={1.5} markerEnd="url(#flow-arrow)" />
          ),
        )}
        <path
          d="M261 82 V128 H83 V168"
          fill="none"
          stroke="var(--muted)"
          strokeWidth={1}
          strokeDasharray="3 5"
          markerEnd="url(#flow-arrow)"
        />
        {[...top.map((n) => ({ ...n, y: 10, accent: false })), ...bottom.map((n) => ({ ...n, y: ROW2 }))].map((n) => (
          <g key={n.label}>
            <rect
              x={n.x}
              y={n.y}
              width={W}
              height={H}
              rx={12}
              fill="var(--bg)"
              stroke={n.accent ? "var(--accent)" : "var(--border)"}
              strokeWidth={n.accent ? 1.5 : 1}
            />
            <text x={n.x + 12} y={n.y + 32} fill="var(--text)" fontSize="13" fontWeight="500">
              {n.label}
            </text>
            <text x={n.x + 12} y={n.y + 50} fill="var(--muted)" fontSize="10.5">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="label mt-3">Dashed: any step that errors routes to the shared handler</figcaption>
    </figure>
  );
}
