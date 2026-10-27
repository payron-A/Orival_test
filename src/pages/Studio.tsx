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
    rows.length === 0 ? <p className="text-muted">{empty}</p> : (
      <ul>
        {rows.map((r) => (
          <li key={r.id} className="grid grid-cols-[96px_1fr_auto] items-center gap-4 border-b border-line py-4 max-[620px]:grid-cols-[72px_1fr] max-[620px]:[&>:last-child]:col-span-full">
            <div className="relative aspect-video overflow-hidden rounded-sm bg-mist"><Thumb src={r.thumb} title={r.title} kind={r.kind} /></div>
            <div className="space-y-4">
              <h3>{r.title}</h3>
              <p className="flex flex-wrap items-center gap-3"><span className={r.status === "draft" ? "inline-flex items-center gap-2 text-sm font-bold before:size-[9px] before:rounded-full before:content-[''] before:bg-muted" : "inline-flex items-center gap-2 text-sm font-bold before:size-[9px] before:rounded-full before:content-[''] before:bg-ok"}>{r.status === "draft" ? t("common.draft") : t("common.published")}</span><span className="text-muted">{r.meta}</span></p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" to={`/studio/${r.kind === "course" ? "courses" : "videos"}/${r.id}`}>{t("common.edit")}</Link>
              <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" onClick={() => toggle(r)}>{r.status === "draft" ? t("studio.publish") : t("studio.unpublish")}</button>
              {r.status !== "draft" && <Link className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-transparent bg-transparent text-ink hover:bg-mist" to={r.kind === "course" ? `/course/${r.id}` : `/video/${r.id}`}>{t("studio.viewPublic")}</Link>}
              <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-danger bg-white text-danger hover:bg-mist" onClick={() => remove(r)}>{t("common.delete")}</button>
            </div>
          </li>
        ))}
      </ul>
    );

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <PageHead eyebrow={t("common.creator")} title={t("studio.title")} lede={t("studio.lede")}
        actions={<div className="flex flex-wrap items-center gap-3"><Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-orange-500 bg-orange-500 text-ink hover:bg-[#fb8a3c]" to="/studio/courses/new">{t("studio.newCourse")}</Link><Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]" to="/studio/videos/new">{t("studio.newVideo")}</Link></div>} />
      {(loc.state as { saved?: boolean } | null)?.saved && <p className="border-s-[3px] px-4 py-3 text-sm border-orange-500 bg-mist" role="status" style={{ marginBlockEnd: 24 }}>{t("studio.saved")}</p>}
      <p className="text-sm text-muted" style={{ marginBlockEnd: 16 }}>{t("studio.storageNote")} {t("studio.freeNote")}</p>
      <section className="mt-12" style={{ marginBlockStart: 16 }}><div className="mb-5 flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3"><h2>{t("studio.yourCourses")}</h2></div>{renderList(courses, t("studio.emptyCourses"))}</section>
      <section className="mt-12"><div className="mb-5 flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3"><h2>{t("studio.yourVideos")}</h2></div>{renderList(videos, t("studio.emptyVideos"))}</section>
    </div>
  );
}
