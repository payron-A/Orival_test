import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCourseById, getProviderById } from "../data";
import { ProgressBar } from "../components/ui/ProgressBar";
import { MobileHeader } from "../components/layout/MobileHeader";
import { useApp } from "../context/AppContext";
import type { EnrollmentStatus } from "../types/user";

const tabs: { key: EnrollmentStatus; label: string }[] = [
  { key: "in-progress", label: "In Progress" },
  { key: "not-started", label: "Not Started" },
  { key: "completed", label: "Completed" },
];

export default function MyLearning() {
  const { enrollments } = useApp();
  const [tab, setTab] = useState<EnrollmentStatus>("in-progress");

  const list = useMemo(
    () => Object.values(enrollments).filter((e) => e.status === tab),
    [enrollments, tab]
  );

  return (
    <div>
      <MobileHeader title="My Learning" />
      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-6">
        <h1 className="hidden lg:block font-display text-2xl font-bold mb-5 text-ink-primary">My Learning</h1>

        <div className="flex gap-1 border-b border-base-border overflow-x-auto no-scrollbar mb-5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                tab === t.key ? "border-orival text-orival" : "border-transparent text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-ink-muted py-10 text-center">Nothing here yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {list.map((e) => {
              const course = getCourseById(e.courseId);
              const provider = course ? getProviderById(course.providerId) : undefined;
              if (!course) return null;
              return (
                <div key={e.courseId} className="flex gap-3 rounded-xl2 border border-base-border bg-base-panel p-3">
                  <img src={course.thumbnailUrl} className="h-16 w-20 shrink-0 rounded-lg object-cover" alt="" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-ink-primary line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-ink-secondary line-clamp-1">{provider?.name}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <ProgressBar value={e.progress} />
                      <span className="text-xs text-ink-muted shrink-0">{e.progress}%</span>
                    </div>
                    <Link
                      to={`/course/${course.id}/learn`}
                      className="mt-2 inline-block text-xs font-semibold text-orival hover:text-orival-bright"
                    >
                      {e.status === "not-started" ? "Start" : e.status === "completed" ? "Review" : "Continue"} →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
