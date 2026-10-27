import { Link, Navigate } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { PageHead } from "../components/common/PageHead";
import { creatorIdFor } from "../lib/catalog";
import { ApplicationStatus } from "../components/creator/ApplicationStatus";

/** One dashboard, three states: Member, pending/rejected applicant, approved Creator. No learning metrics anywhere. */
export default function Dashboard() {
  const { user, isCreator, studioCourses, studioVideos, savedKeys } = useApi();
  const { t } = useI18n();
  if (!user) return <Navigate to="/signin?next=%2Fdashboard" replace />;
  const app = user.creatorApplication;
  const cid = creatorIdFor(user);
  const mineC = studioCourses.filter((c) => c.providerId === cid);
  const mineV = studioVideos.filter((v) => v.providerId === cid);
  const lede = isCreator ? t("dash.creatorLede") : app?.status === "pending" ? t("dash.pendingLede") : app?.status === "rejected" ? t("dash.rejectedLede") : t("dash.memberLede");

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <PageHead eyebrow={isCreator ? t("common.creator") : t("common.member")} title={t("dash.title")} lede={lede} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        <section className="grid content-start gap-3 rounded border p-5 border-ink">
          <h2>{t("dash.yourStatus")}</h2>
          <p><span className={isCreator ? "inline-block rounded-sm border px-2 py-0.5 text-xs font-semibold tracking-wide border-orange-700 bg-orange-200 text-orange-900" : "inline-block rounded-sm border px-2 py-0.5 text-xs font-semibold tracking-wide border-ink"}>{isCreator ? t("profile.role.creator") : t("profile.role.member")}</span></p>
          {app && !isCreator && <ApplicationStatus app={app} />}
          {!isCreator && (!app || app.status === "rejected") && <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]" to="/become-creator">{app ? t("apply.again") : t("dash.memberCta")}</Link>}
        </section>

        {isCreator ? (
          <section className="grid content-start gap-3 rounded border p-5 border-ink">
            <h2>{t("nav.studio")}</h2>
            <p className="text-muted">{t("dash.counts", { courses: mineC.length, videos: mineV.length })}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-orange-500 bg-orange-500 text-ink hover:bg-[#fb8a3c]" to="/studio">{t("dash.openStudio")}</Link>
              <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" to={`/creator/${cid}`}>{t("dash.publicPage")}</Link>
            </div>
            <p className="text-sm text-muted">{t("studio.freeNote")}</p>
          </section>
        ) : (
          <section className="grid content-start gap-3 rounded border p-5 border-ink">
            <h2>{t("nav.library")}</h2>
            <p className="text-muted">{t("library.lede")}</p>
            <div className="flex flex-wrap items-center gap-3"><Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" to="/library">{t("dash.memberLibrary")}</Link><span className="text-muted">{savedKeys.length}</span></div>
          </section>
        )}
      </div>
    </div>
  );
}
