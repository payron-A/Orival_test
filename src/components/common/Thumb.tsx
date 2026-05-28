import { useState } from "react";
import type { ContentKind } from "../../types/content";

/** Image with a stable 16:9 box. Falls back to a typographic panel — never a fake picture. */
export function Thumb({ src, title, kind }: { src?: string; title: string; kind: ContentKind }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const ok = Boolean(src) && failedSrc !== src;
  if (ok) {
    return <img src={src} alt="" loading="lazy" width={640} height={360} onError={() => setFailedSrc(src ?? "")} />;
  }
  const initial = Array.from(title.trim())[0] ?? "O";
  return (
    <div className={`thumb-ph thumb-ph--${kind}`} aria-hidden="true">
      <span>{initial}</span>
    </div>
  );
}
