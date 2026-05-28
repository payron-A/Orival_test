import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { SuggestionRows } from "../components/search/SuggestionRows";
import { RECENT_KEY, rememberSearch, useSuggest, type Row } from "../components/search/useSuggest";
import { exploreHref } from "../lib/search";
import { loadJSON, saveJSON } from "../lib/storage";

/** Dedicated full-screen search. Reached from the icon shown when the viewport is too narrow for the nav input. */
export default function Search() {
  const { t, lang, setLang } = useI18n();
  const { categories, items } = useApi();
  const navigate = useNavigate();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState<string[]>(() => loadJSON<string[]>(RECENT_KEY, [], (x): x is string[] => Array.isArray(x)));
  const rows = useSuggest(q);
  const trimmed = q.trim();
  const noMatches = trimmed.length > 0 && rows.length <= 1;
  const topics = useMemo(() => categories.filter((c) => items.some((i) => i.categoryId === c.id)), [categories, items]);

  const go = (href: string, query: string) => {
    rememberSearch(query);
    navigate(href);
  };
  const pick = (r: Row) => go(r.href, r.query ?? (r.kind === "category" || r.kind === "creator" ? "" : r.label));
  const close = () => (window.history.length > 1 ? navigate(-1) : navigate("/"));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (rows.length ? (a + 1) % rows.length : -1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (rows.length ? (a <= 0 ? rows.length - 1 : a - 1) : -1)); }
    else if (e.key === "Escape") { if (q) { setQ(""); setActive(-1); } else close(); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (!trimmed) return;
      const r = rows[active];
      if (r) pick(r); else go(exploreHref({ q: trimmed }), trimmed);
    }
  };

  return (
    <div className="dark-page">
      <div className="container">
        <div className="dark-top">
          <Link to="/" className="logo" aria-label="Orival">Orival</Link>
          <div className="row">
            <button className="btn btn--sm" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")} aria-label={t("nav.languageLabel")}>{t("nav.language")}</button>
            <button className="btn btn--sm" onClick={close}><i className="fa-solid fa-xmark" aria-hidden="true" /> {t("search.close")}</button>
          </div>
        </div>

        <div className="dark-search" role="search">
          <div className="dark-search__field">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" style={{ fontSize: 22, color: "var(--orange-500)" }} />
            <input
              ref={inputRef}
              autoFocus
              type="search"
              role="combobox"
              aria-label={t("search.label")}
              aria-expanded={trimmed.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
              autoComplete="off"
              placeholder={t("search.placeholder")}
              value={q}
              onChange={(e) => { setQ(e.target.value); setActive(-1); }}
              onKeyDown={onKey}
            />
            {q && (
              <button className="icon-btn" aria-label={t("search.clearQuery")} onClick={() => { setQ(""); setActive(-1); inputRef.current?.focus(); }}>
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            )}
          </div>

          {trimmed ? (
            <div id={listId} role="listbox" aria-label={t("search.suggestions")}>
              <p className="dark-label">{t("search.suggestions")}</p>
              {noMatches && (
                <div className="stack" style={{ paddingBlock: 8 }} role="status">
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>{t("search.noMatches", { q: trimmed })}</p>
                  <p className="dark-muted">{t("search.noMatchesHint")}</p>
                </div>
              )}
              <div className="dark-list">
                <SuggestionRows rows={rows} q={q} active={active} listId={listId} onPick={pick} onHover={setActive} />
              </div>
            </div>
          ) : (
            <div>
              <h1 className="sr-only">{t("search.emptyTitle")}</h1>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBlockStart: 32 }}>{t("search.emptyTitle")}</p>
              <p className="dark-muted" style={{ marginBlockStart: 8 }}>{t("search.emptyHint")}</p>
              {recent.length > 0 && (
                <>
                  <div className="spread" style={{ marginBlockStart: 32 }}>
                    <p className="dark-label" style={{ margin: 0 }}>{t("search.recent")}</p>
                    <button className="link" onClick={() => { saveJSON(RECENT_KEY, []); setRecent([]); }}>{t("search.clearRecent")}</button>
                  </div>
                  <div className="dark-chips" style={{ marginBlockStart: 12 }}>
                    {recent.map((r) => <button key={r} className="chip" onClick={() => go(exploreHref({ q: r }), r)}>{r}</button>)}
                  </div>
                </>
              )}
              {topics.length > 0 && (
                <>
                  <p className="dark-label">{t("search.browse")}</p>
                  <div className="dark-chips">
                    {topics.map((c) => <button key={c.id} className="chip" onClick={() => navigate(exploreHref({ category: c.id }))}>{c.name}</button>)}
                  </div>
                </>
              )}
            </div>
          )}
          <p style={{ marginBlock: 40 }}><Link className="link" to="/explore">{t("search.browseAll")} <i className="fa-solid fa-arrow-right i-dir" aria-hidden="true" /></Link></p>
        </div>
      </div>
    </div>
  );
}
