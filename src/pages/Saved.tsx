import { useMemo, useState } from "react";
import { courses, providers } from "../data";
import { CourseCard } from "../components/course/CourseCard";
import { ProviderCard } from "../components/provider/ProviderCard";
import { MobileHeader } from "../components/layout/MobileHeader";
import { useApp } from "../context/AppContext";

export default function Saved() {
  const { savedCourseIds, savedProviderIds } = useApp();
  const [tab, setTab] = useState<"courses" | "providers">("courses");

  const savedCourses = useMemo(() => courses.filter((c) => savedCourseIds.has(c.id)), [savedCourseIds]);
  const savedProviders = useMemo(() => providers.filter((p) => savedProviderIds.has(p.id)), [savedProviderIds]);

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
          <button
            onClick={() => setTab("providers")}
            className={`border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
              tab === "providers" ? "border-orival text-orival" : "border-transparent text-ink-secondary hover:text-ink-primary"
            }`}
          >
            Providers ({savedProviders.length})
          </button>
        </div>

        {tab === "courses" ? (
          savedCourses.length === 0 ? (
            <p className="text-sm text-ink-muted py-10 text-center">No saved courses yet. Tap the bookmark icon on any course to save it here.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {savedCourses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )
        ) : savedProviders.length === 0 ? (
          <p className="text-sm text-ink-muted py-10 text-center">No saved providers yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {savedProviders.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
