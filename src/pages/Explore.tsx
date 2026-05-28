import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { ContentCard } from "../components/common/ContentCard";
import { Empty, PageHead } from "../components/common/PageHead";
import { filterItems, type ExploreFilters, type FormatFilter, type SortKey } from "../lib/search";

const FORMATS: FormatFilter[] = ["all", "course", "video"];
const SORTS: SortKey[] = ["relevance", "newest", "title"];

function ExploreSearch({ initial, onSubmit }: { initial: string; onSubmit: (q: string) => void }) {
  const { t } = useI18n();
  const [q, setQ] = useState(initial);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(q);
  };
  return (
    <form className="explore-search" role="search" onSubmit={submit}>
      <div className="search__field" style={{ flex: 1 }}>
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        <input
          type="search"
          aria-label={t("explore.searchPlaceholder")}
          placeholder={t("explore.searchPlaceholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q && (
          <button type="button" className="search__clear" aria-label={t("search.clearQuery")} onClick={() => { setQ(""); onSubmit(""); }}>
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        )}
      </div>
      <button className="btn btn--primary" type="submit">{t("explore.searchBtn")}</button>
    </form>
  );
}

export default function Explore() {
  const { items, categories, providers } = useApi();
  const { t, tn } = useI18n();
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const filters: ExploreFilters = {
    q: params.get("q") ?? "",
    format: (FORMATS as string[]).includes(params.get("format") ?? "") ? (params.get("format") as FormatFilter) : "all",
    category: params.get("category") ?? "",
    creator: params.get("creator") ?? "",
    sort: (SORTS as string[]).includes(params.get("sort") ?? "") ? (params.get("sort") as SortKey) : "relevance",
  };

  const set = (patch: Partial<ExploreFilters>) => {
    const next = new URLSearchParams(params);
    (Object.entries(patch) as [keyof ExploreFilters, string][]).forEach(([k, v]) => {
      if (!v || v === "all" || (k === "sort" && v === "relevance")) next.delete(k);
      else next.set(k, v);
    });
    setParams(next, { replace: true });
  };

  const lookups = useMemo(() => ({ categories, creators: providers }), [categories, providers]);
  const results = useMemo(() => filterItems(items, filters, lookups), [items, filters.q, filters.format, filters.category, filters.creator, filters.sort, lookups]); // eslint-disable-line react-hooks/exhaustive-deps

  const topicOptions = categories.filter((c) => items.some((i) => i.categoryId === c.id));
  const creatorOptions = providers.filter((p) => items.some((i) => i.creatorId === p.id));
  const catName = categories.find((c) => c.id === filters.category)?.name ?? filters.category;
  const creatorName = providers.find((p) => p.id === filters.creator)?.name ?? filters.creator;

  const active: { key: keyof ExploreFilters; label: string }[] = [];
  if (filters.q.trim()) active.push({ key: "q", label: `“${filters.q.trim()}”` });
  if (filters.format !== "all") active.push({ key: "format", label: filters.format === "course" ? t("common.courses") : t("common.videos") });
  if (filters.category) active.push({ key: "category", label: catName });
  if (filters.creator) active.push({ key: "creator", label: creatorName });

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <div className="container page">
      <PageHead eyebrow={t("explore.eyebrow")} title={t("explore.title")} lede={t("explore.lede")} />

      <div className="explore-bar">
        <ExploreSearch key={filters.q} initial={filters.q} onSubmit={(q) => set({ q: q.trim() })} />
        <button className="btn btn--sm filters-toggle" aria-expanded={showFilters} onClick={() => setShowFilters((s) => !s)}>
          <i className="fa-solid fa-sliders" aria-hidden="true" /> {showFilters ? t("explore.hideFilters") : t("explore.filters")}
        </button>
        <div className="filters" data-open={showFilters}>
          <div className="filter-group">
            <span className="field__label" id="fmt-l">{t("explore.format")}</span>
            <div className="segmented" role="group" aria-labelledby="fmt-l">
              {FORMATS.map((f) => (
                <button key={f} type="button" aria-pressed={filters.format === f} onClick={() => set({ format: f })}>
                  {f === "all" ? t("common.all") : f === "course" ? t("common.courses") : t("common.videos")}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label className="field__label" htmlFor="f-topic">{t("explore.topic")}</label>
            <select id="f-topic" className="select" value={filters.category} onChange={(e) => set({ category: e.target.value })}>
              <option value="">{t("explore.anyTopic")}</option>
              {topicOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label className="field__label" htmlFor="f-creator">{t("explore.creator")}</label>
            <select id="f-creator" className="select" value={filters.creator} onChange={(e) => set({ creator: e.target.value })}>
              <option value="">{t("explore.anyCreator")}</option>
              {creatorOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label className="field__label" htmlFor="f-sort">{t("explore.sort")}</label>
            <select id="f-sort" className="select" value={filters.sort} onChange={(e) => set({ sort: e.target.value as SortKey })}>
              {SORTS.map((s) => <option key={s} value={s}>{t(`explore.sort.${s}`)}</option>)}
            </select>
          </div>
        </div>
        {active.length > 0 && (
          <div className="active-filters">
            <span className="muted">{t("explore.showing")}:</span>
            {active.map((a) => (
              <button key={a.key} className="chip" onClick={() => set({ [a.key]: "" })} aria-label={t("explore.removeFilter", { name: a.label })}>
                {a.label} <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            ))}
            <button className="link" onClick={clearAll}>{t("explore.clearFilters")}</button>
          </div>
        )}
      </div>

      <p className="muted" role="status" aria-live="polite" style={{ marginBlockEnd: 24 }}>
        {tn("n.results", results.length)} {filters.q.trim() ? t("explore.matchingFor", { q: filters.q.trim() }) : ""}
      </p>

      {results.length === 0 ? (
        <Empty
          title={t("explore.noResultsTitle")}
          body={t("explore.noResultsBody")}
          action={
            <div className="row">
              {filters.q && <button className="btn" onClick={() => set({ q: "" })}>{t("search.clearQuery")}</button>}
              <button className="btn btn--primary" onClick={clearAll}>{t("explore.clearFilters")}</button>
            </div>
          }
        />
      ) : (
        <div className="grid-cards">{results.map((i) => <ContentCard key={`${i.kind}:${i.id}`} item={i} />)}</div>
      )}
    </div>
  );
}
