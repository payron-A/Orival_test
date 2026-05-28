import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../../i18n/i18n-context";
import { exploreHref } from "../../lib/search";
import { rememberSearch, useSuggest, type Row } from "./useSuggest";
import { SuggestionRows } from "./SuggestionRows";

/** Desktop search input with a floating autocomplete panel (overlays the page; never pushes layout). */
export function HeaderSearch() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const loc = useLocation();
  const [params] = useSearchParams();
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // On Explore the field mirrors ?q=, so the query stays visible and editable after navigating.
  const onExplore = loc.pathname === "/explore";
  const value = draft ?? (onExplore ? params.get("q") ?? "" : "");
  const rows = useSuggest(value);
  const showPanel = open && value.trim().length > 0;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (href: string, q: string) => {
    rememberSearch(q);
    setOpen(false);
    setActive(-1);
    setDraft(null);
    navigate(href);
  };
  const pick = (r: Row) => go(r.href, r.query ?? (r.kind === "category" || r.kind === "creator" ? "" : r.label));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (rows.length ? (a + 1) % rows.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (rows.length ? (a <= 0 ? rows.length - 1 : a - 1) : -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = rows[active];
      if (r) pick(r);
      else go(exploreHref({ q: value }), value);
    }
  };

  return (
    <div className="search" ref={boxRef} role="search">
      <div className="search__field">
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        <input
          type="search"
          role="combobox"
          aria-label={t("search.label")}
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          placeholder={t("search.placeholder")}
          value={value}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setDraft(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={onKey}
        />
        {value && (
          <button type="button" className="search__clear" aria-label={t("search.clearQuery")} onClick={() => { setDraft(""); setActive(-1); }}>
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        )}
      </div>
      {showPanel && (
        <div className="suggest" id={listId} role="listbox" aria-label={t("search.suggestions")}>
          {rows.length > 1 ? (
            <SuggestionRows rows={rows} q={value} active={active} listId={listId} onPick={pick} onHover={setActive} />
          ) : (
            <>
              <p className="suggest__empty">{t("search.noMatches", { q: value.trim() })}</p>
              <SuggestionRows rows={rows} q={value} active={active} listId={listId} onPick={pick} onHover={setActive} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
