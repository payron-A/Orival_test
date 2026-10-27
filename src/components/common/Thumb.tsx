import { useState } from "react";
import type { ContentKind } from "../../types/content";

/** Image with a stable 16:9 box. Falls back to a typographic panel — never a fake picture. */
export function Thumb({ src, title, kind }: { src?: string; title: string; kind: ContentKind }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const ok = Boolean(src) && failedSrc !== src;
  if (ok) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        width={640}
        height={360}
        className="size-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.035]"
        onError={() => setFailedSrc(src ?? "")}
      />
    );
  }
  const initial = Array.from(title.trim())[0] ?? "O";
  return (
    <div
      className="absolute inset-0 grid place-items-center overflow-hidden bg-ink text-white before:absolute before:inset-0 before:bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgb(255_255_255/0.05)_14px_15px)] before:content-['']"
      aria-hidden="true"
    >
      <span
        className={
          kind === "video"
            ? "relative font-display text-[clamp(3rem,10vw,5.5rem)] leading-none text-white"
            : "relative font-display text-[clamp(3rem,10vw,5.5rem)] leading-none text-orange-500"
        }
      >
        {initial}
      </span>
    </div>
  );
}
