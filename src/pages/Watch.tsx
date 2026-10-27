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
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
        <Empty title={kind === "course" ? t("course.notFound") : t("video.notFound")} action={<Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" to="/explore">{t("nav.explore")}</Link>} />
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
    <div className="flex min-h-screen min-h-dvh flex-col bg-white">
      <header className="flex items-center gap-3 border-b border-line px-5 py-3">
        <button className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-ink transition-colors hover:bg-mist disabled:opacity-40" onClick={() => navigate(backTo)} aria-label={course ? t("watch.backToCourse") : t("watch.backToVideo")}>
          <i className="fa-solid fa-arrow-left rtl:-scale-x-100" aria-hidden="true" />
        </button>
        <h1 className="min-w-0 flex-1 truncate font-sans text-base font-semibold">{title}</h1>
        <Link to="/" className="inline-flex items-baseline gap-0.5 font-display text-[1.6rem] font-bold tracking-[-0.03em] after:ms-0.5 after:inline-block after:size-[7px] after:bg-orange-500 after:content-['']" aria-label="Orival" style={{ fontSize: "1.2rem" }}>Orival</Link>
      </header>

      <div className={course ? "grid min-h-0 flex-1 grid-cols-1 min-[1021px]:grid-cols-[minmax(0,1fr)_360px]" : "grid min-h-0 flex-1 grid-cols-1"}>
        <div className="grid content-start gap-5 p-5 max-[640px]:px-0 max-[640px]:pb-5 max-[640px]:pt-0">
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

          <div className="space-y-4 max-[640px]:px-4 space-y-4">
            {course && lesson && <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-700 rtl:text-sm rtl:normal-case rtl:tracking-normal">{lesson.sectionTitle} · {t("watch.lessonOf", { n: idx + 1, total: flat.length })}</p>}
            <h2 className="text-headline">{course ? lesson?.title : video!.title}</h2>
            {creator && <p className="text-muted"><Link className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" to={`/creator/${creator.id}`}>{creator.name}</Link></p>}
            {video && <p className="max-w-measure text-muted">{video.description}</p>}
            {course && (
              <div className="flex justify-between gap-3">
                <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" disabled={idx <= 0} onClick={() => goLesson(idx - 1)}><i className="fa-solid fa-arrow-left rtl:-scale-x-100" aria-hidden="true" /> {t("watch.prev")}</button>
                <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" disabled={idx >= flat.length - 1} onClick={() => goLesson(idx + 1)}>{t("watch.next")} <i className="fa-solid fa-arrow-right rtl:-scale-x-100" aria-hidden="true" /></button>
              </div>
            )}
          </div>

          {video && (
            <section className="space-y-4" style={{ paddingInline: 0 }}>
              <h3>{t("video.more")}</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8">{moreVideos.map((m) => <ContentCard key={m.id} item={videoToItem(m)} />)}</div>
            </section>
          )}
        </div>

        {course && (
          <aside className="flex min-h-0 flex-col border-s border-line bg-white max-[1020px]:border-s-0 max-[1020px]:border-t" aria-label={t("watch.lessons")}>
            <div className="border-b border-line px-5 py-4">
              <div className="flex gap-6 overflow-x-auto border-b border-line" role="tablist">
                <button role="tab" className="relative whitespace-nowrap border-0 bg-transparent py-3 text-sm font-semibold text-muted aria-selected:text-ink aria-selected:after:absolute aria-selected:after:inset-x-0 aria-selected:after:-bottom-px aria-selected:after:h-0.5 aria-selected:after:bg-orange-500 aria-selected:after:content-['']" aria-selected={tab === "lessons"} onClick={() => setTab("lessons")}>{t("watch.tabLessons")}</button>
                <button role="tab" className="relative whitespace-nowrap border-0 bg-transparent py-3 text-sm font-semibold text-muted aria-selected:text-ink aria-selected:after:absolute aria-selected:after:inset-x-0 aria-selected:after:-bottom-px aria-selected:after:h-0.5 aria-selected:after:bg-orange-500 aria-selected:after:content-['']" aria-selected={tab === "notes"} onClick={() => setTab("notes")}>{t("watch.notes")}</button>
              </div>
              {tab === "lessons" && <p className="text-sm text-muted" style={{ marginBlockStart: 8 }}>{t("watch.openAny")}</p>}
            </div>
            {tab === "lessons" ? (
              <div className="min-h-0 flex-1 overflow-y-auto">
                {course.sections.map((s) => (
                  <div key={s.id}>
                    <h3 className="px-5 pb-2 pt-4 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal">{s.title}</h3>
                    {s.lessons.map((l) => {
                      const n = flat.findIndex((f) => f.id === l.id);
                      return (
                        <button key={l.id} className="flex w-full items-center gap-3 border-0 border-s-[3px] border-transparent bg-transparent px-5 py-3 text-start text-sm transition-colors hover:bg-mist aria-[current=true]:border-orange-500 aria-[current=true]:bg-mist aria-[current=true]:font-bold" aria-current={l.id === lesson?.id ? "true" : undefined} onClick={() => goLesson(n)}>
                          <span className="w-[2ch] tabular-nums text-muted">{n + 1}</span>
                          <span className="min-w-0 flex-1">{l.title}</span>
                          <time className="tabular-nums text-muted">{l.duration}</time>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4" style={{ padding: 20 }}>
                <label className="text-sm font-semibold" htmlFor="notes">{t("watch.notes")}</label>
                <textarea id="notes" className="min-h-28 w-full resize-y rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" style={{ minHeight: 200 }} placeholder={t("watch.notesPlaceholder")} value={notes[noteKey] ?? ""} onChange={(e) => setNote(e.target.value)} />
                <p className="text-sm text-muted">{t("watch.notesHint")}</p>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
