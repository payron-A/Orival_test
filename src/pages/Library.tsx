import { useMemo } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { ContentCard } from "../components/common/ContentCard";
import { Empty, PageHead } from "../components/common/PageHead";

/** Replaces the old Saved / History / My Learning / My Enrollments pages. No progress, only lists. */
export default function Library() {
  const { user, items, savedKeys, history, clearHistory } = useApi();
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "recent" ? "recent" : "saved";

  const saved = useMemo(() => savedKeys.map((k) => items.find((i) => `${i.kind}:${i.id}` === k)).filter((x) => x !== undefined), [savedKeys, items]);
  const recent = useMemo(() => history.map((h) => items.find((i) => i.kind === h.type && i.id === h.refId)).filter((x) => x !== undefined), [history, items]);

  if (!user) return <Navigate to={`/signin?next=${encodeURIComponent("/library")}`} replace />;
  const list = tab === "saved" ? saved : recent;

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <PageHead eyebrow={t("nav.library")} title={t("library.title")} lede={t("library.lede")} />
      <div className="flex items-center justify-between gap-4" style={{ marginBlockEnd: 32 }}>
        <div className="flex gap-6 overflow-x-auto border-b border-line" role="tablist">
          <button role="tab" className="relative whitespace-nowrap border-0 bg-transparent py-3 text-sm font-semibold text-muted aria-selected:text-ink aria-selected:after:absolute aria-selected:after:inset-x-0 aria-selected:after:-bottom-px aria-selected:after:h-0.5 aria-selected:after:bg-orange-500 aria-selected:after:content-['']" aria-selected={tab === "saved"} onClick={() => setParams({}, { replace: true })}>{t("library.tabSaved")}</button>
          <button role="tab" className="relative whitespace-nowrap border-0 bg-transparent py-3 text-sm font-semibold text-muted aria-selected:text-ink aria-selected:after:absolute aria-selected:after:inset-x-0 aria-selected:after:-bottom-px aria-selected:after:h-0.5 aria-selected:after:bg-orange-500 aria-selected:after:content-['']" aria-selected={tab === "recent"} onClick={() => setParams({ tab: "recent" }, { replace: true })}>{t("library.tabRecent")}</button>
        </div>
        {tab === "recent" && recent.length > 0 && <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" onClick={clearHistory}>{t("library.clearHistory")}</button>}
      </div>
      {list.length === 0 ? (
        <Empty
          title={tab === "saved" ? t("library.emptySavedTitle") : t("library.emptyRecentTitle")}
          body={tab === "saved" ? t("library.emptySavedBody") : t("library.emptyRecentBody")}
          action={<Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]" to="/explore">{t("nav.explore")}</Link>}
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8">{list.map((i) => <ContentCard key={`${i.kind}:${i.id}`} item={i} />)}</div>
      )}
    </div>
  );
}
