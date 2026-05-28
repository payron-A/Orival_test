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
    <div className="container page">
      <PageHead eyebrow={isCreator ? t("common.creator") : t("common.member")} title={t("dash.title")} lede={lede} />
      <div className="dash-grid">
        <section className="panel">
          <h2>{t("dash.yourStatus")}</h2>
          <p><span className={`badge ${isCreator ? "badge--accent" : ""}`}>{isCreator ? t("profile.role.creator") : t("profile.role.member")}</span></p>
          {app && !isCreator && <ApplicationStatus app={app} />}
          {!isCreator && (!app || app.status === "rejected") && <Link className="btn btn--primary" to="/become-creator">{app ? t("apply.again") : t("dash.memberCta")}</Link>}
        </section>

        {isCreator ? (
          <section className="panel">
            <h2>{t("nav.studio")}</h2>
            <p className="muted">{t("dash.counts", { courses: mineC.length, videos: mineV.length })}</p>
            <div className="row">
              <Link className="btn btn--accent" to="/studio">{t("dash.openStudio")}</Link>
              <Link className="btn" to={`/creator/${cid}`}>{t("dash.publicPage")}</Link>
            </div>
            <p className="field__hint">{t("studio.freeNote")}</p>
          </section>
        ) : (
          <section className="panel">
            <h2>{t("nav.library")}</h2>
            <p className="muted">{t("library.lede")}</p>
            <div className="row"><Link className="btn" to="/library">{t("dash.memberLibrary")}</Link><span className="muted">{savedKeys.length}</span></div>
          </section>
        )}
      </div>
    </div>
  );
}
