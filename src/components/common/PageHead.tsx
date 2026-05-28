import type { ReactNode } from "react";

export function PageHead({ eyebrow, title, lede, actions }: { eyebrow?: string; title: string; lede?: string; actions?: ReactNode }) {
  return (
    <header className="page-head">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <div className="spread" style={{ alignItems: "flex-end" }}>
        <h1>{title}</h1>
        {actions}
      </div>
      {lede && <p className="lede">{lede}</p>}
    </header>
  );
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="empty" role="status">
      <h2>{title}</h2>
      {body && <p>{body}</p>}
      {action}
    </div>
  );
}

export function Arrow() {
  return <i className="fa-solid fa-arrow-right i-dir" aria-hidden="true" />;
}
