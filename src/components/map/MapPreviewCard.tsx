import { Link } from "react-router-dom";
import type { Course } from "../../types/courses";
import { Rating } from "../ui/Rating";
import { ModeBadge } from "../ui/ModeBadge";
import { getProviderById } from "../../data";

export function MapPreviewCard({ course, onClose }: { course: Course; onClose?: () => void }) {
  const provider = getProviderById(course.providerId);
  return (
    <div className="flex items-stretch gap-3 rounded-xl2 border border-base-border bg-base-panel p-3 shadow-card ">
      <img src={course.thumbnailUrl} alt={course.title} className=" w-24  shrink-0 rounded-lg object-cover aspect-video" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-ink-primary line-clamp-1">{provider?.name}</h4>
            <p className="text-xs text-ink-secondary line-clamp-1">{course.title}</p>
          </div>
          {onClose && (
            <button onClick={onClose} aria-label="Close" className="shrink-0 text-ink-muted hover:text-ink-primary">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Rating value={course.rating} />
          <ModeBadge mode={course.mode} />
          {course.distanceKm !== undefined && course.mode !== "online" && (
            <span className="text-xs text-ink-muted">{course.distanceKm} km away</span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-orival">{course.priceDzd.toLocaleString()} DZD</span>
          <Link
            to={`/course/${course.id}`}
            className="rounded-lg bg-orival px-3 py-1.5 text-xs font-semibold text-black hover:bg-orival-bright transition-colors"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}
