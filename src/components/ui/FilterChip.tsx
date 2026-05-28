export function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
        onClick={onClick}
        style={{
          minWidth:"110px",
          maxWidth:"120px"
        }}
        className={`flex-1 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
          active
            ? "bg-orival border-orival text-black"
            : "bg-base-panel border-base-border text-ink-secondary hover:text-ink-primary hover:border-base-border2"
        }`}>
      {label}
    </button>
  );
}
