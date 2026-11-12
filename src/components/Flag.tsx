/*
 * Small SVG flags. Emoji flags don't render on Windows, so the common
 * countries are drawn inline; anything else falls back to its ISO code.
 */
const tricolours: Record<string, { dir: "v" | "h"; colors: [string, string, string] }> = {
  IT: { dir: "v", colors: ["#009246", "#ffffff", "#ce2b37"] },
  FR: { dir: "v", colors: ["#0055a4", "#ffffff", "#ef4135"] },
  IE: { dir: "v", colors: ["#169b62", "#ffffff", "#ff883e"] },
  BE: { dir: "v", colors: ["#000000", "#fdda24", "#ef3340"] },
  DE: { dir: "h", colors: ["#000000", "#dd0000", "#ffce00"] },
  NL: { dir: "h", colors: ["#ae1c28", "#ffffff", "#21468b"] },
  AT: { dir: "h", colors: ["#ed2939", "#ffffff", "#ed2939"] },
};

export default function Flag({ code, label, size = 22 }: { code: string; label: string; size?: number }) {
  const h = Math.round((size * 2) / 3);
  const common = { width: size, height: h, role: "img" as const, "aria-label": label, style: { borderRadius: 3, boxShadow: "0 0 0 1px rgba(0,0,0,.12)", flexShrink: 0 } };

  if (code === "CH") {
    return (
      <svg viewBox="0 0 30 20" {...common}>
        <rect width="30" height="20" fill="#da291c" />
        <path d="M13 4h4v4.5h4.5v4H17V17h-4v-4.5H8.5v-4H13z" fill="#fff" />
      </svg>
    );
  }

  const tri = tricolours[code];
  if (tri) {
    return (
      <svg viewBox="0 0 30 20" {...common}>
        {tri.colors.map((c, i) =>
          tri.dir === "v" ? (
            <rect key={i} x={i * 10} width="10" height="20" fill={c} />
          ) : (
            <rect key={i} y={(i * 20) / 3} width="30" height={20 / 3 + 0.1} fill={c} />
          ),
        )}
      </svg>
    );
  }

  return (
    <span aria-label={label} role="img" style={{ fontSize: 11, fontWeight: 700, padding: "1px 4px", borderRadius: 3, border: "1px solid currentColor" }}>
      {code}
    </span>
  );
}
