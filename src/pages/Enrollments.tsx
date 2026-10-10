import { Link } from "react-router-dom";
import { getCourseById, getProviderById } from "../data";
import { ModeBadge } from "../components/ui/ModeBadge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { MobileHeader } from "../components/layout/MobileHeader";
import { useApi } from "../context/ApiContext";

const statusStyle: Record<string, string> = {
  "in-progress": "text-orival bg-orival/10",
  "not-started": "text-ink-secondary bg-base-panel2",
  completed: "text-green-400 bg-green-400/10",
};
const statusLabel: Record<string, string> = {
  "in-progress": "In Progress",
  "not-started": "Not Started",
  completed: "Completed",
};

export default function Enrollments() {
  const { enrollments } = useApi();
  const list = Object.values(enrollments).sort((a, b) => (a.enrolledAt < b.enrolledAt ? 1 : -1));

  return (
    <div>
      <MobileHeader title="My Enrollments" />
      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-6">
        <h1 className="hidden lg:block font-display text-2xl font-bold mb-5 text-ink-primary">My Enrollments</h1>

        {list.length === 0 ? (
          <p className="text-sm text-ink-muted py-10 text-center">You haven't enrolled in any courses yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((e) => {
              const course = getCourseById(e.courseId);
              const provider = course ? getProviderById(course.providerId) : undefined;
              if (!course) return null;
              return (
                <Link
                  key={e.courseId}
                  to={`/course/${course.id}`}
                  className="flex items-center gap-3.5 rounded-xl2 border border-base-border bg-base-panel p-3 hover:border-base-border2 transition-colors"
                >
                  <img src={course.thumbnailUrl} className="h-16 w-20 shrink-0 rounded-lg object-cover" alt="" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-ink-primary line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-ink-secondary line-clamp-1">{provider?.name}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <ModeBadge mode={course.mode} />
                      <span className="text-[11px] text-ink-muted">Enrolled {e.enrolledAt}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 max-w-[220px]">
                      <ProgressBar value={e.progress} />
                      <span className="text-xs text-ink-muted shrink-0">{e.progress}%</span>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle[e.status]}`}>
                    {statusLabel[e.status]}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
