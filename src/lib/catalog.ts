import type { CatalogItem, Video } from "../types/content";
import type { Course, CourseSection } from "../types/courses";

/** Strips legacy progress/sequence flags and fills defaults for anything coming from the API or storage. */
export function normalizeCourse(raw: Course): Course {
  const sections: CourseSection[] = (raw.sections ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    lessons: (s.lessons ?? []).map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      videoUrl: l.videoUrl,
      captionsUrl: l.captionsUrl,
    })),
  }));
  return {
    ...raw,
    thumbnailUrl: raw.thumbnailUrl ?? "",
    tags: raw.tags ?? [],
    outcomes: raw.outcomes ?? [],
    reviews: raw.reviews ?? [],
    sections,
    lessonCount: sections.reduce((n, s) => n + s.lessons.length, 0) || raw.lessonCount || 0,
  };
}

export function courseToItem(c: Course): CatalogItem {
  return {
    kind: "course",
    id: c.id,
    title: c.title,
    description: c.description,
    thumbnailUrl: c.thumbnailUrl,
    categoryId: c.categoryId,
    creatorId: c.providerId,
    tags: c.tags,
    addedAt: c.addedAt,
    durationLabel: c.durationLabel,
    lessonCount: c.lessonCount,
    href: `/course/${c.id}`,
  };
}

export function videoToItem(v: Video): CatalogItem {
  return {
    kind: "video",
    id: v.id,
    title: v.title,
    description: v.description,
    thumbnailUrl: v.thumbnailUrl,
    categoryId: v.categoryId,
    creatorId: v.providerId,
    tags: v.tags,
    addedAt: v.addedAt,
    durationLabel: v.durationLabel,
    href: `/video/${v.id}`,
  };
}

export function watchHref(kind: "course" | "video", id: string, lessonId?: string): string {
  if (kind === "video") return `/video/${id}/watch`;
  return `/course/${id}/learn${lessonId ? `?lesson=${encodeURIComponent(lessonId)}` : ""}`;
}

/** Parses "12:30" or "1:02:03" to seconds; returns 0 when not parseable. */
export function durationToSeconds(label: string): number {
  const parts = label.split(":").map((n) => Number(n));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

import type { User } from "../types/user";
/** Stable creator id for the signed-in user (legacy provider accounts keep their provider id). */
export function creatorIdFor(u: User): string {
  return u.providerId ?? `u-${u.handle.replace("@", "")}`;
}

/** Sum of "mm:ss"/"h:mm:ss" labels → "2h 05m" / "45m". */
export function totalDurationLabel(labels: string[]): string {
  const total = labels.reduce((n, l) => n + durationToSeconds(l), 0);
  if (!total) return "";
  const h = Math.floor(total / 3600);
  const m = Math.round((total % 3600) / 60);
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${Math.max(m, 1)}m`;
}
