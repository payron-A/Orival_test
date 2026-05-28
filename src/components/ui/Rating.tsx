
export function Rating({ value, reviewCount, size = "sm" }: { value: number; reviewCount?: number; size?: "sm" | "md" }) {
  const textSize = size === "md" ? "text-sm" : "text-xs";
  return (
    <span className={`inline-flex items-center gap-1 ${textSize} text-ink-secondary`}>
      <i className="fa-solid fa-star"></i>
      <span className="text-ink-primary font-medium">{value.toFixed(1)}</span>
      {reviewCount !== undefined && <span>({reviewCount})</span>}
    </span>
  );
}
