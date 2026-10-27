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
    <form className="flex gap-2" role="search" onSubmit={submit}>
      <div className="flex h-10 items-center gap-2 rounded border border-line bg-white px-3 transition focus-within:border-ink focus-within:ring-[3px] focus-within:ring-orange-200" style={{ flex: 1 }}>
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        <input
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          type="search"
          aria-label={t("explore.searchPlaceholder")}
          placeholder={t("explore.searchPlaceholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q && (
          <button type="button" className="rounded-sm p-1 text-muted hover:text-ink" aria-label={t("search.clearQuery")} onClick={() => { setQ(""); onSubmit(""); }}>
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        )}
      </div>
      <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]" type="submit">{t("explore.searchBtn")}</button>
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
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <PageHead eyebrow={t("explore.eyebrow")} title={t("explore.title")} lede={t("explore.lede")} />

      <div className="mb-5 grid gap-4 border-y border-line py-4">
        <ExploreSearch key={filters.q} initial={filters.q} onSubmit={(q) => set({ q: q.trim() })} />
        <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist hidden max-[720px]:inline-flex" aria-expanded={showFilters} onClick={() => setShowFilters((s) => !s)}>
          <i className="fa-solid fa-sliders" aria-hidden="true" /> {showFilters ? t("explore.hideFilters") : t("explore.filters")}
        </button>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4 max-[720px]:flex-col max-[720px]:items-stretch max-[720px]:data-[open=false]:hidden" data-open={showFilters}>
          <div className="grid gap-2">
            <span className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal" id="fmt-l">{t("explore.format")}</span>
            <div className="inline-flex overflow-hidden rounded border border-ink" role="group" aria-labelledby="fmt-l">
              {FORMATS.map((f) => (
                <button key={f} type="button" className="min-h-9 border-0 border-e border-ink bg-white px-4 text-sm last:border-e-0 aria-pressed:bg-ink aria-pressed:text-white" aria-pressed={filters.format === f} onClick={() => set({ format: f })}>
                  {f === "all" ? t("common.all") : f === "course" ? t("common.courses") : t("common.videos")}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal" htmlFor="f-topic">{t("explore.topic")}</label>
            <select id="f-topic" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200" value={filters.category} onChange={(e) => set({ category: e.target.value })}>
              <option value="">{t("explore.anyTopic")}</option>
              {topicOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal" htmlFor="f-creator">{t("explore.creator")}</label>
            <select id="f-creator" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200" value={filters.creator} onChange={(e) => set({ creator: e.target.value })}>
              <option value="">{t("explore.anyCreator")}</option>
              {creatorOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal" htmlFor="f-sort">{t("explore.sort")}</label>
            <select id="f-sort" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200" value={filters.sort} onChange={(e) => set({ sort: e.target.value as SortKey })}>
              {SORTS.map((s) => <option key={s} value={s}>{t(`explore.sort.${s}`)}</option>)}
            </select>
          </div>
        </div>
        {active.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted">{t("explore.showing")}:</span>
            {active.map((a) => (
              <button key={a.key} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white" onClick={() => set({ [a.key]: "" })} aria-label={t("explore.removeFilter", { name: a.label })}>
                {a.label} <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            ))}
            <button className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" onClick={clearAll}>{t("explore.clearFilters")}</button>
          </div>
        )}
      </div>

      <p className="text-muted" role="status" aria-live="polite" style={{ marginBlockEnd: 24 }}>
        {tn("n.results", results.length)} {filters.q.trim() ? t("explore.matchingFor", { q: filters.q.trim() }) : ""}
      </p>

      {results.length === 0 ? (
        <Empty
          title={t("explore.noResultsTitle")}
          body={t("explore.noResultsBody")}
          action={
            <div className="flex flex-wrap items-center gap-3">
              {filters.q && <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" onClick={() => set({ q: "" })}>{t("search.clearQuery")}</button>}
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]" onClick={clearAll}>{t("explore.clearFilters")}</button>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8">{results.map((i) => <ContentCard key={`${i.kind}:${i.id}`} item={i} />)}</div>
      )}
    </div>
  );
}
