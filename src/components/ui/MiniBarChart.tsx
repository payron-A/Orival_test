export function MiniBarChart({
  data,
  valueFormatter,
}: {
  data: { label: string; value: number }[];
  valueFormatter?: (v: number) => string;
}) {
  return (
    <div className="flex items-end gap-3 h-40">
      {data.map((d) => {
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2 group">
            <span className="text-[11px] text-ink-muted">{d.label}</span>
            <span className="text-[11px] text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity">
              {valueFormatter ? valueFormatter(d.value) : d.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}