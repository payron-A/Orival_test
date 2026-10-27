import type { ReactNode } from "react";

export function PageHead({ eyebrow, title, lede, actions }: { eyebrow?: string; title: string; lede?: string; actions?: ReactNode }) {
  return (
    <header className="mb-8 grid gap-3">
      {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-700 rtl:text-sm rtl:normal-case rtl:tracking-normal">{eyebrow}</span>}
      <div className="flex items-center justify-between gap-4" style={{ alignItems: "flex-end" }}>
        <h1>{title}</h1>
        {actions}
      </div>
      {lede && <p className="max-w-measure text-soft">{lede}</p>}
    </header>
  );
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="grid animate-page-in justify-items-center gap-3 rounded border border-dashed border-muted px-5 py-12 text-center" role="status">
      <h2>{title}</h2>
      {body && <p className="max-w-[46ch] text-soft">{body}</p>}
      {action}
    </div>
  );
}

export function Arrow() {
  return <i className="fa-solid fa-arrow-right rtl:-scale-x-100" aria-hidden="true" />;
}
