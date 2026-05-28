export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 w-full rounded-full bg-base-border2 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-orival to-orival-bright transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
