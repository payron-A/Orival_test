import { useState } from "react";
import { Link } from "react-router-dom";
import { historyEntries, getCourseById, getProviderById } from "../data";
import { MobileHeader } from "../components/layout/MobileHeader";

export default function HistoryPage() {
  const [entries, setEntries] = useState(historyEntries);

  return (
    <div>
      <MobileHeader title="History" />
      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="hidden lg:block font-display text-2xl font-bold text-ink-primary">History</h1>
          {entries.length > 0 && (
            <button
              onClick={() => setEntries([])}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary hover:text-ink-primary"
            >
              <i className="fa-solid fa-trash"></i> Clear history
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-ink-muted py-10 text-center">Your recently viewed courses and providers will show up here.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {entries.map((h) => {
              if (h.type === "course") {
                const course = getCourseById(h.refId);
                if (!course) return null;
                return (
                  <Link key={h.id} to={`/course/${course.id}`} className="flex items-center gap-3 rounded-xl2 border border-base-border bg-base-panel p-2.5 hover:border-base-border2">
                    <img src={course.thumbnailUrl} className="h-12 w-14 rounded-lg object-cover" alt="" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink-primary line-clamp-1">{course.title}</p>
                      <p className="text-xs text-ink-muted">Course · {h.viewedAt}</p>
                    </div>
                  </Link>
                );
              }
              const provider = getProviderById(h.refId);
              if (!provider) return null;
              return (
                <Link key={h.id} to={`/provider/${provider.id}`} className="flex items-center gap-3 rounded-xl2 border border-base-border bg-base-panel p-2.5 hover:border-base-border2">
                  <img src={provider.avatarUrl} className="h-12 w-12 rounded-full object-cover" alt="" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-primary line-clamp-1">{provider.name}</p>
                    <p className="text-xs text-ink-muted">Provider · {h.viewedAt}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
