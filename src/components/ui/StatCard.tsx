export function StatCard({
  label,
  value,
  icon,
  trend,
  accent = "#FF7A26",
}: {
  label: string;
  value: string;
  icon: string;
  trend?: { value: string; positive?: boolean };
  accent?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl2 border border-base-border bg-base-panel p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1F`, color: accent }}
        >
          <i className={icon}></i>
        </span>
        {trend && (
          <span className={`text-xs font-medium ${trend.positive === false ? "text-red-400" : "text-green-400"}`}>
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-ink-primary">{value}</p>
        <p className="text-xs text-ink-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}