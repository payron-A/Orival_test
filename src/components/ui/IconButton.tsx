import type { ReactNode } from "react";

export function IconButton({
  children,
  onClick,
  active,
  label,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        active
          ? "border-orival/60 bg-orival/10 text-orival"
          : "border-base-border bg-base-panel text-ink-secondary hover:text-ink-primary hover:border-base-border2"
      }`}
    >
      {children}
    </button>
  );
}
