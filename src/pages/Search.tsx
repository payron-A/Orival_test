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
    <div className="flex min-h-screen min-h-dvh animate-page-in flex-col bg-ink text-white">
      <div className="mx-auto w-full max-w-[880px] px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="inline-flex items-baseline gap-0.5 font-display text-[1.6rem] font-bold tracking-[-0.03em] after:ms-0.5 after:inline-block after:size-[7px] after:bg-orange-500 after:content-['']" aria-label="Orival">Orival</Link>
          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border border-white/30 bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:border-orange-500" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")} aria-label={t("nav.languageLabel")}>{t("nav.language")}</button>
            <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border border-white/30 bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:border-orange-500" onClick={close}><i className="fa-solid fa-xmark" aria-hidden="true" /> {t("search.close")}</button>
          </div>
        </div>

        <div className="mt-12" role="search">
          <div className="flex items-center gap-3 border-b-2 border-white pb-3 transition-colors focus-within:border-orange-500">
            <i className="fa-solid fa-magnifying-glass text-[22px] text-orange-500" aria-hidden="true" />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent font-display text-[clamp(1.75rem,1rem+4vw,3.25rem)] font-semibold text-white outline-none placeholder:text-white/40"
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
              <button className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-white hover:bg-white/10" aria-label={t("search.clearQuery")} onClick={() => { setQ(""); setActive(-1); inputRef.current?.focus(); }}>
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            )}
          </div>

          {trimmed ? (
            <div id={listId} role="listbox" aria-label={t("search.suggestions")}>
              <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-orange-500 rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("search.suggestions")}</p>
              {noMatches && (
                <div className="space-y-4" style={{ paddingBlock: 8 }} role="status">
                  <p className="font-display text-2xl">{t("search.noMatches", { q: trimmed })}</p>
                  <p className="text-white/65">{t("search.noMatchesHint")}</p>
                </div>
              )}
              <div className="border-t border-white/20">
                <SuggestionRows dark rows={rows} q={q} active={active} listId={listId} onPick={pick} onHover={setActive} />
              </div>
            </div>
          ) : (
            <div>
              <h1 className="sr-only">{t("search.emptyTitle")}</h1>
              <p className="mt-8 font-display text-2xl">{t("search.emptyTitle")}</p>
              <p className="text-white/65" style={{ marginBlockStart: 8 }}>{t("search.emptyHint")}</p>
              {recent.length > 0 && (
                <>
                  <div className="flex items-center justify-between gap-4" style={{ marginBlockStart: 32 }}>
                    <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-orange-500 rtl:text-sm rtl:normal-case rtl:tracking-normal" style={{ margin: 0 }}>{t("search.recent")}</p>
                    <button className="font-semibold text-orange-500 underline underline-offset-[3px]" onClick={() => { saveJSON(RECENT_KEY, []); setRecent([]); }}>{t("search.clearRecent")}</button>
                  </div>
                  <div className="flex flex-wrap gap-2" style={{ marginBlockStart: 12 }}>
                    {recent.map((r) => <button key={r} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/30 bg-transparent px-4 text-sm text-white transition-colors hover:border-orange-500 hover:text-orange-500" onClick={() => go(exploreHref({ q: r }), r)}>{r}</button>)}
                  </div>
                </>
              )}
              {topics.length > 0 && (
                <>
                  <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-orange-500 rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("search.browse")}</p>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((c) => <button key={c.id} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/30 bg-transparent px-4 text-sm text-white transition-colors hover:border-orange-500 hover:text-orange-500" onClick={() => navigate(exploreHref({ category: c.id }))}>{c.name}</button>)}
                  </div>
                </>
              )}
            </div>
          )}
          <p style={{ marginBlock: 40 }}><Link className="font-semibold text-orange-500 underline underline-offset-[3px]" to="/explore">{t("search.browseAll")} <i className="fa-solid fa-arrow-right rtl:-scale-x-100" aria-hidden="true" /></Link></p>
        </div>
      </div>
    </div>
  );
}
