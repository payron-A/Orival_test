import type { LearningMode } from "../../types/courses";

const CONFIG: Record<LearningMode, { label: string; color: string; bg: string; }> = {
  "in-person": { label: "In-person", color: "#FF7A26", bg: "rgba(255,122,38,0.12)" },
  online: { label: "Online", color: "#3E8FFF", bg: "rgba(110, 168, 255, 0.26)"},
  hybrid: { label: "Hybrid", color: "#9B7BFF", bg: "rgba(155,123,255,0.12)"},
};

export function ModeBadge({ mode, size = "sm" }: { mode: LearningMode; size?: "sm" | "md" }) {
  const c = CONFIG[mode];
  const pad = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]";
  return (
    <span
      className={`backdrop-blur inline-flex items-center gap-1 rounded-full font-medium ${pad}`}
      style={{ color: c.color, backgroundColor: c.bg  }}
    >
      <i className="fa-solid fa-location-pin"></i>
      {c.label}
    </span>
  );
}
