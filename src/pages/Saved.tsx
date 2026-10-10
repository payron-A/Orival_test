import { useMemo, useState } from "react";
import { CourseCard } from "../components/course/CourseCard";
import { MobileHeader } from "../components/layout/MobileHeader";
import { useApi } from "../context/ApiContext";

export default function Saved() {

  const { courses, savedCourseIds} = useApi();
  const [tab, setTab] = useState<"courses" | "providers">("courses");

  const savedCourses = useMemo(() => courses.filter((c) => savedCourseIds.includes(c.id)), [savedCourseIds]);

  return (
    <div>
      <MobileHeader title="Saved" />
      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-6">
        <h1 className="hidden lg:block font-display text-2xl font-bold mb-5 text-ink-primary">Saved</h1>

        <div className="flex gap-1 border-b border-base-border mb-5">
          <button
            onClick={() => setTab("courses")}
            className={`border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
              tab === "courses" ? "border-orival text-orival" : "border-transparent text-ink-secondary hover:text-ink-primary"
            }`}
          >
            Courses ({savedCourses.length})
          </button>
        </div>

        {savedCourses.length === 0 ? 
          (
            <p className="text-sm text-ink-muted py-10 text-center">No saved courses yet. Tap the bookmark icon on any course to save it here.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {savedCourses.map((c) => (<CourseCard key={c.id} course={c} />))}
            </div>
          )
        }
      </div>
    </div>
  );
}
