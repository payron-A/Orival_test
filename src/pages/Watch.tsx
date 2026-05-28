import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { Player } from "../components/player/Player";
import { Empty } from "../components/common/PageHead";
import { loadJSON, saveJSON } from "../lib/storage";
import { videoToItem } from "../lib/catalog";
import { ContentCard } from "../components/common/ContentCard";

const NOTES_KEY = "orival.notes.v1";
type Notes = Record<string, string>;
const isNotes = (v: unknown): v is Notes => typeof v === "object" && v !== null && !Array.isArray(v);

/** Watch surface for both course lessons (/course/:id/learn) and standalone videos (/video/:id/watch). */
export default function Watch({ kind }: { kind: "course" | "video" }) {
  const { id } = useParams();
  const { user, getCourse, getVideo, getCreator, recordView, videos } = useApi();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState<"lessons" | "notes">("lessons");
  const [notes, setNotes] = useState<Notes>(() => loadJSON<Notes>(NOTES_KEY, {}, isNotes));

  const course = kind === "course" ? getCourse(id) : undefined;
  const video = kind === "video" ? getVideo(id) : undefined;
  const flat = useMemo(
    () => course?.sections.flatMap((s) => s.lessons.map((l) => ({ ...l, sectionTitle: s.title }))) ?? [],
    [course]
  );
  const lessonParam = params.get("lesson");
  const idx = Math.max(0, flat.findIndex((l) => l.id === lessonParam));
  const lesson = flat[idx];
  const noteKey = kind === "course" ? `c:${id}:${lesson?.id}` : `v:${id}`;

  const itemId = course?.id ?? video?.id;
  const lessonId = lesson?.id;
  useEffect(() => {
    if (user && itemId) recordView(kind, itemId, lessonId);
  }, [user, itemId, kind, lessonId, recordView]);

  // Defence in depth: the route is already guarded, but the player itself never mounts for a visitor.
  if (!user) {
    return <Navigate to={`/signin?next=${encodeURIComponent(`${window.location.pathname}${window.location.search}`)}`} replace />;
  }

  const missing = (kind === "course" && !course) || (kind === "video" && !video);
  if (missing) {
    return (
      <div className="container page">
        <Empty title={kind === "course" ? t("course.notFound") : t("video.notFound")} action={<Link className="btn" to="/explore">{t("nav.explore")}</Link>} />
      </div>
    );
  }

  const title = course ? course.title : video!.title;
  const backTo = course ? `/course/${course.id}` : `/video/${video!.id}`;
  const goLesson = (i: number) => flat[i] && setParams({ lesson: flat[i].id }, { replace: true });
  const setNote = (v: string) => {
    const next = { ...notes, [noteKey]: v };
    setNotes(next);
    saveJSON(NOTES_KEY, next);
  };

  const src = course ? lesson?.videoUrl : video?.videoUrl;
  const captions = course ? lesson?.captionsUrl : video?.captionsUrl;
  const creator = getCreator(course?.providerId ?? video?.providerId);
  const moreVideos = videos.filter((x) => x.id !== video?.id).slice(0, 6);

  return (
    <div className="watch">
      <header className="watch__bar">
        <button className="icon-btn" onClick={() => navigate(backTo)} aria-label={course ? t("watch.backToCourse") : t("watch.backToVideo")}>
          <i className="fa-solid fa-arrow-left i-dir" aria-hidden="true" />
        </button>
        <h1>{title}</h1>
        <Link to="/" className="logo" aria-label="Orival" style={{ fontSize: "1.2rem" }}>Orival</Link>
      </header>

      <div className={`watch__body${course ? "" : " watch__body--solo"}`}>
        <div className="watch__main">
          {course && !lesson ? (
            <Empty title={t("watch.noLessons")} />
          ) : (
            <Player
              key={`${course ? lesson?.id : video?.id}:${src ?? "none"}`}
              src={src}
              captionsUrl={captions}
              title={course ? lesson!.title : video!.title}
              onPrev={course && idx > 0 ? () => goLesson(idx - 1) : undefined}
              onNext={course && idx < flat.length - 1 ? () => goLesson(idx + 1) : undefined}
            />
          )}

          <div className="watch__info stack">
            {course && lesson && <p className="eyebrow">{lesson.sectionTitle} · {t("watch.lessonOf", { n: idx + 1, total: flat.length })}</p>}
            <h2>{course ? lesson?.title : video!.title}</h2>
            {creator && <p className="muted"><Link className="link" to={`/creator/${creator.id}`}>{creator.name}</Link></p>}
            {video && <p className="measure muted">{video.description}</p>}
            {course && (
              <div className="lesson-nav">
                <button className="btn btn--sm" disabled={idx <= 0} onClick={() => goLesson(idx - 1)}><i className="fa-solid fa-arrow-left i-dir" aria-hidden="true" /> {t("watch.prev")}</button>
                <button className="btn btn--sm" disabled={idx >= flat.length - 1} onClick={() => goLesson(idx + 1)}>{t("watch.next")} <i className="fa-solid fa-arrow-right i-dir" aria-hidden="true" /></button>
              </div>
            )}
          </div>

          {video && (
            <section className="stack" style={{ paddingInline: 0 }}>
              <h3>{t("video.more")}</h3>
              <div className="grid-cards">{moreVideos.map((m) => <ContentCard key={m.id} item={videoToItem(m)} />)}</div>
            </section>
          )}
        </div>

        {course && (
          <aside className="watch__side" aria-label={t("watch.lessons")}>
            <div className="watch__side-head">
              <div className="tabs" role="tablist">
                <button role="tab" aria-selected={tab === "lessons"} onClick={() => setTab("lessons")}>{t("watch.tabLessons")}</button>
                <button role="tab" aria-selected={tab === "notes"} onClick={() => setTab("notes")}>{t("watch.notes")}</button>
              </div>
              {tab === "lessons" && <p className="field__hint" style={{ marginBlockStart: 8 }}>{t("watch.openAny")}</p>}
            </div>
            {tab === "lessons" ? (
              <div className="lesson-list">
                {course.sections.map((s) => (
                  <div key={s.id}>
                    <h3>{s.title}</h3>
                    {s.lessons.map((l) => {
                      const n = flat.findIndex((f) => f.id === l.id);
                      return (
                        <button key={l.id} className="lesson-item" aria-current={l.id === lesson?.id ? "true" : undefined} onClick={() => goLesson(n)}>
                          <span className="n">{n + 1}</span>
                          <span className="t">{l.title}</span>
                          <time>{l.duration}</time>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="stack" style={{ padding: 20 }}>
                <label className="field__label" htmlFor="notes">{t("watch.notes")}</label>
                <textarea id="notes" className="textarea" style={{ minHeight: 200 }} placeholder={t("watch.notesPlaceholder")} value={notes[noteKey] ?? ""} onChange={(e) => setNote(e.target.value)} />
                <p className="field__hint">{t("watch.notesHint")}</p>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
