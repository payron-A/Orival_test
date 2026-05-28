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

export function SuggestionRows({
  rows, q, active, listId, onPick, onHover,
}: {
  rows: Row[]; q: string; active: number; listId: string; onPick: (r: Row) => void; onHover: (i: number) => void;
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
          className={`suggest__item${r.kind === "all" ? " suggest__all" : ""}`}
          onMouseEnter={() => onHover(i)}
          onMouseDown={(e) => e.preventDefault() /* keep input focus */}
          onClick={() => onPick(r)}
        >
          <i className={`fa-solid ${ICON[r.kind]}`} aria-hidden="true" />
          <span className="suggest__label">
            {r.kind === "all"
              ? r.label
              : highlightParts(r.label, q).map((p, k) => (p.hit ? <mark key={k}>{p.text}</mark> : <span key={k}>{p.text}</span>))}
          </span>
          {r.kind !== "all" && <span className="suggest__kind">{t(`search.kind.${r.kind}`)}</span>}
        </button>
      ))}
    </>
  );
}
