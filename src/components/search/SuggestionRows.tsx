import { highlightParts } from "../../lib/search";
import { useI18n } from "../../i18n/i18n-context";
import type { Row } from "./useSuggest";

const ICON: Record<Row["kind"], string> = {
  course: "fa-book-open",
  video: "fa-circle-play",
  category: "fa-tag",
  creator: "fa-user",
  all: "fa-arrow-right i-dir",
};

function itemClass(dark: boolean, all: boolean): string {
  if (dark) {
    return all
      ? "flex w-full animate-page-in items-center gap-3 border-0 border-b border-white/20 bg-transparent px-4 py-4 text-start text-base font-semibold text-orange-500 hover:bg-white/10 aria-selected:bg-white/10"
      : "flex w-full animate-page-in items-center gap-3 border-0 border-b border-white/20 bg-transparent px-4 py-4 text-start text-base text-white hover:bg-white/10 aria-selected:bg-white/10";
  }
  return all
    ? "flex w-full items-center gap-3 border-0 bg-transparent px-4 py-3 text-start text-sm font-semibold text-orange-700 hover:bg-mist aria-selected:bg-mist"
    : "flex w-full items-center gap-3 border-0 border-b border-mist bg-transparent px-4 py-3 text-start text-sm text-ink hover:bg-mist aria-selected:bg-mist";
}

export function SuggestionRows({
  rows, q, active, listId, onPick, onHover, dark = false,
}: {
  rows: Row[]; q: string; active: number; listId: string; onPick: (r: Row) => void; onHover: (i: number) => void; dark?: boolean;
}) {
  const { t } = useI18n();
  return (
    <>
      {rows.map((r, i) => (
        <button
          key={r.key}
          id={`${listId}-${i}`}
          type="button"
          role="option"
          aria-selected={i === active}
          className={itemClass(dark, r.kind === "all")}
          onMouseEnter={() => onHover(i)}
          onMouseDown={(e) => e.preventDefault() /* keep input focus */}
          onClick={() => onPick(r)}
        >
          <i className={`fa-solid ${ICON[r.kind]}`} aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">
            {r.kind === "all"
              ? r.label
              : highlightParts(r.label, q).map((p, k) => (p.hit ? <mark key={k} className={dark ? "bg-transparent font-bold text-orange-500" : "bg-transparent font-bold text-orange-700"}>{p.text}</mark> : <span key={k}>{p.text}</span>))}
          </span>
          {r.kind !== "all" && <span className={dark ? "text-xs uppercase tracking-[0.06em] text-white/55 rtl:normal-case rtl:tracking-normal" : "text-xs uppercase tracking-[0.06em] text-muted rtl:normal-case rtl:tracking-normal"}>{t(`search.kind.${r.kind}`)}</span>}
        </button>
      ))}
    </>
  );
}
