import { Link } from "react-router-dom";
import type { Course } from "../../types/courses";
import { Rating } from "../ui/Rating";
import { ModeBadge } from "../ui/ModeBadge";
import { getProviderById } from "../../data";

export function CourseListItem({ course }: { course: Course }) {
  const provider = getProviderById(course.providerId);
  return (
    <Link
        to={`/course/${course.id}`}
        className="flex items-center gap-3.5 rounded-xl2 border border-base-border bg-base-panel p-2.5 
                   hover:border-base-border2 transition-colors">
      <img
        src={course.thumbnailUrl}
        alt={course.title}
        loading="lazy"
        className="h-16 w-20 shrink-0 rounded-lg object-cover"/>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-ink-primary line-clamp-1">{course.title}</h4>
        <p className="text-xs text-ink-secondary line-clamp-1">{provider?.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Rating value={course.rating} />
          <ModeBadge mode={course.mode} />
          {course.distanceKm !== undefined && course.mode !== "online" && (
            <span className="inline-flex items-center gap-0.5 text-xs text-ink-muted">
              <i className="fa-solid fa-home" style={{fontSize:11}} /> 
              {course.distanceKm} km
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0 text-sm font-semibold text-orival">{course.priceDzd.toLocaleString()} DZD</div>
    </Link>
  );
}