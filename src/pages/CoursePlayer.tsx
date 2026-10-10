import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById } from "../data";
import { useApi } from "../context/ApiContext";

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(id ?? "");
  const { enrollments, setLessonComplete } = useApi();
  const [tab, setTab] = useState<"lessons" | "notes">("lessons");
  const [notes, setNotes] = useState("");
  const [showLessons, setShowLessons] = useState(false);
  const flatLessons = useMemo(() => course?.sections.flatMap((s) => s.lessons.map((l) => ({ ...l, sectionTitle: s.title }))) ?? [], [course]);
  const enrollment = course ? enrollments[course.id] : undefined;
  const [currentLessonId, setCurrentLessonId] = useState(enrollment?.lastLessonId ?? flatLessons[0]?.id);

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center text-ink-muted">
        Course not found.{" "}
        <button className="ml-2 text-orival" onClick={() => navigate("/")}>
          Back home
        </button>
      </div>
    );
  }

  const currentIndex = flatLessons.findIndex((l) => l.id === currentLessonId);
  const currentLesson = flatLessons[currentIndex] ?? flatLessons[0];

  const goTo = (idx: number) => {
    const target = flatLessons[idx];
    if (target) setCurrentLessonId(target.id);
  };

  const markComplete = () => {
    setLessonComplete(course.id, currentLesson.id, flatLessons.length);
    if (currentIndex < flatLessons.length - 1) goTo(currentIndex + 1);
  };

  return (
    <div className="flex h-screen flex-col bg-base-bg">
      <header className="flex items-center gap-3 border-b border-base-border px-4 py-3">
        <button onClick={() => navigate(`/course/${course.id}`)} 
                aria-label="Back to course" className="text-ink-primary">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="flex-1 truncate font-display text-ink-primary font-semibold ">
          {course.title}
        </h1>
        <button className="lg:hidden text-ink-secondary text-xs font-medium" 
                onClick={() => setShowLessons(true)}>
          Lessons
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        <div className="flex flex-1 flex-col min-w-0">
            <div className="h-72 relative aspect-video bg-black">
              <img src={course.thumbnailUrl} alt="" 
                    className="h-full w-full object-cover opacity-70" />
              <button
                onClick={markComplete}
                className="absolute inset-0 flex items-center justify-center text-white/90 hover:text-white transition-colors"
                aria-label="Play"
              >
                <i className="fa-solid fa-play"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4">
              <p className="text-xs text-ink-muted">{currentLesson?.sectionTitle}</p>
              <h2 className="mt-1 font-display text-ink-primary font-semibold">{currentLesson?.title}</h2>
            </div>

            <div className="flex items-center justify-between border-t border-base-border px-5 py-3.5">
              <button
                onClick={() => goTo(currentIndex - 1)}
                disabled={currentIndex <= 0}
                className="inline-flex items-center gap-1 text-sm font-medium text-ink-secondary disabled:opacity-30 hover:text-ink-primary"
              >
                <i className="fa-solid fa-arrow-left"></i> Previous
              </button>
              <button
                onClick={markComplete}
                className="rounded-lg bg-orival px-5 py-2 text-sm font-semibold text-black hover:bg-orival-bright transition-colors"
              >
                Mark complete & continue
              </button>
              <button
                onClick={() => goTo(currentIndex + 1)}
                disabled={currentIndex >= flatLessons.length - 1}
                className="inline-flex items-center gap-1 text-sm font-medium text-ink-secondary disabled:opacity-30 hover:text-ink-primary"
              >
                Next <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
        </div>

        <aside className="hidden lg:flex w-80 shrink-0 flex-col border-l border-base-border">
          <SidebarContent
            course={course}
            currentLessonId={currentLesson?.id}
            onSelect={(idx) => goTo(idx)}
            tab={tab}
            setTab={setTab}
            notes={notes}
            setNotes={setNotes}
          />
        </aside>
      </div>

      {showLessons && (
        <div className="lg:hidden fixed inset-0 z-50 bg-base-bg flex flex-col">
          <div className="flex items-center justify-between border-b border-base-border px-4 py-3.5">
            <h2 className="font-display text-ink-primary font-semibold">Course content</h2>
            <button onClick={() => setShowLessons(false)} aria-label="Close">
              <i className="fa-solid fa-xmark text-ink-primary"></i>
            </button>
          </div>
          <SidebarContent
            course={course}
            currentLessonId={currentLesson?.id}
            onSelect={(idx) => {
              goTo(idx);
              setShowLessons(false);
            }}
            tab={tab}
            setTab={setTab}
            notes={notes}
            setNotes={setNotes}
          />
        </div>
      )}
    </div>
  );
}

function SidebarContent({
  course,
  currentLessonId,
  onSelect,
  tab,
  setTab,
  notes,
  setNotes,
}: {
  course: NonNullable<ReturnType<typeof getCourseById>>;
  currentLessonId?: string;
  onSelect: (flatIndex: number) => void;
  tab: "lessons" | "notes";
  setTab: (t: "lessons" | "notes") => void;
  notes: string;
  setNotes: (v: string) => void;
}) {
  let flatIdx = -1;
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex border-b border-base-border">
        {(["lessons", "notes"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 border-b-2 py-2.5 text-sm font-medium capitalize transition-colors ${
              tab === t ? "border-orival text-orival" : "border-transparent text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "lessons" ? (
        <div className="flex-1 overflow-y-auto scroll-thin">
          {course.sections.map((s) => (
            <div key={s.id}>
              <p className="px-4 pt-3 pb-1.5 text-xs font-semibold text-ink-muted">{s.title}</p>
              {s.lessons.map((l) => {
                flatIdx += 1;
                const idx = flatIdx;
                const active = l.id === currentLessonId;
                return (
                  <button
                    key={l.id}
                    onClick={() => onSelect(idx)}
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${
                      active ? "bg-orival/10 text-orival" : "text-ink-secondary hover:bg-base-panel2"
                    }`}
                  >
                    {l.locked ? (
                      <i className="fa-solid fa-lock"></i>
                    ) : l.completed ? (
                      <i className="fa-solid fa-history"></i>
                    ) : (
                      <i className="fa-solid fa-circle"></i>
                    )}
                    <span className="flex-1 line-clamp-1">{l.title}</span>
                    <span className="text-xs text-ink-muted shrink-0">{l.duration}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-2 p-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            className="min-h-[140px] flex-1 resize-none rounded-lg border border-base-border bg-base-panel p-3 text-ink-primary text-sm outline-none placeholder:text-ink-muted focus:border-orival/50"
          />
          <p className="text-xs font-semibold text-ink-muted mt-2">Resources</p>
          <Link to="#" className="text-xs text-orival hover:text-orival-bright">Camera settings guide (PDF)</Link>
          <Link to="#" className="text-xs text-orival hover:text-orival-bright">Exposure cheat sheet (PDF)</Link>
        </div>
      )}
    </div>
  );
}
