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
    <div className="container page">
      <PageHead eyebrow={t("nav.library")} title={t("library.title")} lede={t("library.lede")} />
      <div className="spread" style={{ marginBlockEnd: 32 }}>
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === "saved"} onClick={() => setParams({}, { replace: true })}>{t("library.tabSaved")}</button>
          <button role="tab" aria-selected={tab === "recent"} onClick={() => setParams({ tab: "recent" }, { replace: true })}>{t("library.tabRecent")}</button>
        </div>
        {tab === "recent" && recent.length > 0 && <button className="btn btn--sm" onClick={clearHistory}>{t("library.clearHistory")}</button>}
      </div>
      {list.length === 0 ? (
        <Empty
          title={tab === "saved" ? t("library.emptySavedTitle") : t("library.emptyRecentTitle")}
          body={tab === "saved" ? t("library.emptySavedBody") : t("library.emptyRecentBody")}
          action={<Link className="btn btn--primary" to="/explore">{t("nav.explore")}</Link>}
        />
      ) : (
        <div className="grid-cards">{list.map((i) => <ContentCard key={`${i.kind}:${i.id}`} item={i} />)}</div>
      )}
    </div>
  );
}
