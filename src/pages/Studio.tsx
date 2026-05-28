import { Link, useLocation } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { PageHead } from "../components/common/PageHead";
import { Thumb } from "../components/common/Thumb";
import { creatorIdFor } from "../lib/catalog";
import type { Course } from "../types/courses";
import type { Video } from "../types/content";

type Row = { kind: "course" | "video"; id: string; title: string; thumb: string; status?: "draft" | "published"; meta: string; raw: Course | Video };

export default function Studio() {
  const { user, studioCourses, studioVideos, saveStudioCourse, saveStudioVideo, deleteStudioCourse, deleteStudioVideo } = useApi();
  const { t, tn } = useI18n();
  const loc = useLocation();
  if (!user) return null; // RequireCreator guarantees a user
  const cid = creatorIdFor(user);
  const toRow = (c: Course): Row => ({ kind: "course", id: c.id, title: c.title, thumb: c.thumbnailUrl, status: c.status, meta: tn("n.lessons", c.lessonCount), raw: c });
  const courses = studioCourses.filter((c) => c.providerId === cid).map(toRow);
  const videos = studioVideos.filter((v) => v.providerId === cid).map<Row>((v) => ({ kind: "video", id: v.id, title: v.title, thumb: v.thumbnailUrl, status: v.status, meta: v.durationLabel, raw: v }));

  const toggle = (r: Row) => {
    const next = r.status === "draft" ? "published" : "draft";
    if (r.kind === "course") saveStudioCourse({ ...(r.raw as Course), status: next });
    else saveStudioVideo({ ...(r.raw as Video), status: next });
  };
  const remove = (r: Row) => {
    if (!window.confirm(t("studio.confirmDelete", { title: r.title }))) return;
    if (r.kind === "course") deleteStudioCourse(r.id);
    else deleteStudioVideo(r.id);
  };

  const renderList = (rows: Row[], empty: string) =>
    rows.length === 0 ? <p className="muted">{empty}</p> : (
      <ul>
        {rows.map((r) => (
          <li key={r.id} className="list-row">
            <div className="list-row__thumb"><Thumb src={r.thumb} title={r.title} kind={r.kind} /></div>
            <div className="stack">
              <h3>{r.title}</h3>
              <p className="row"><span className={`status status--${r.status === "draft" ? "draft" : "published"}`}>{r.status === "draft" ? t("common.draft") : t("common.published")}</span><span className="muted">{r.meta}</span></p>
            </div>
            <div className="row">
              <Link className="btn btn--sm" to={`/studio/${r.kind === "course" ? "courses" : "videos"}/${r.id}`}>{t("common.edit")}</Link>
              <button className="btn btn--sm" onClick={() => toggle(r)}>{r.status === "draft" ? t("studio.publish") : t("studio.unpublish")}</button>
              {r.status !== "draft" && <Link className="btn btn--sm btn--ghost" to={r.kind === "course" ? `/course/${r.id}` : `/video/${r.id}`}>{t("studio.viewPublic")}</Link>}
              <button className="btn btn--sm btn--danger" onClick={() => remove(r)}>{t("common.delete")}</button>
            </div>
          </li>
        ))}
      </ul>
    );

  return (
    <div className="container page">
      <PageHead eyebrow={t("common.creator")} title={t("studio.title")} lede={t("studio.lede")}
        actions={<div className="row"><Link className="btn btn--accent" to="/studio/courses/new">{t("studio.newCourse")}</Link><Link className="btn btn--primary" to="/studio/videos/new">{t("studio.newVideo")}</Link></div>} />
      {(loc.state as { saved?: boolean } | null)?.saved && <p className="alert" role="status" style={{ marginBlockEnd: 24 }}>{t("studio.saved")}</p>}
      <p className="field__hint" style={{ marginBlockEnd: 16 }}>{t("studio.storageNote")} {t("studio.freeNote")}</p>
      <section className="section" style={{ marginBlockStart: 16 }}><div className="section-head"><h2>{t("studio.yourCourses")}</h2></div>{renderList(courses, t("studio.emptyCourses"))}</section>
      <section className="section"><div className="section-head"><h2>{t("studio.yourVideos")}</h2></div>{renderList(videos, t("studio.emptyVideos"))}</section>
    </div>
  );
}
