import { Link } from "react-router-dom";
import type { Course } from "../../types";
import { Rating } from "../ui/Rating";
import { ModeBadge } from "../ui/ModeBadge";
import { getProviderById } from "../../data";
import { useApp } from "../../context/AppContext";

export function CourseCard({ course, compact }: { course: Course; compact?: boolean }) {
  const provider = getProviderById(course.providerId);
  const { isSavedCourse, toggleSaveCourse } = useApp();
  const saved = isSavedCourse(course.id);

  return (
    <Link
      to={`/course/${course.id}`}
      className="group flex flex-col rounded-xl2 border border-base-border bg-base-panel overflow-hidden shadow-card hover:border-base-border2 transition-colors shrink-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSaveCourse(course.id);
          }}
          aria-label={saved ? "Remove from saved" : "Save course"}
          className={`absolute top-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
            saved ? "bg-orival text-black" : "bg-black/45 text-white hover:bg-black/60"
          }`}
        >
          <i style={{fontSize:15}} className={`fa-solid fa-bookmark ${saved ? "fill-black" : ""}`} />
        </button>
        <div className="absolute bottom-2.5 left-2.5">
          <ModeBadge mode={course.mode} />
        </div>
      </div>

      <div className={`flex flex-col gap-1.5 p-3.5 ${compact ? "" : ""}`}>
        <h3 className="font-display font-semibold text-[15px] leading-snug text-ink-primary line-clamp-1">
          {course.title}
        </h3>
        <p className="text-xs text-ink-secondary line-clamp-1">{provider?.name}</p>
        <div className="flex items-center justify-between pt-0.5">
          <Rating value={course.rating} reviewCount={course.reviewCount} />
          {course.distanceKm !== undefined && course.mode !== "online" && (
            <span className="inline-flex items-center gap-0.5 text-xs text-ink-muted">
              <i className="fa-solid fa-pin-location" style={{fontSize:11}} /> {course.distanceKm} km
            </span>
          )}
        </div>
        <div className="pt-1 text-sm font-semibold text-orival">
          {course.priceDzd.toLocaleString()} DZD
        </div>
      </div>
    </Link>
  );
}