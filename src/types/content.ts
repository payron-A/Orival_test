import type { PublishStatus } from "./courses";

/** A standalone video that can be watched independently of any course. */
export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  providerId: string; // Creator
  categoryId: string;
  description: string;
  durationLabel: string;
  tags: string[];
  addedAt: string;
  videoUrl?: string;
  captionsUrl?: string;
  status?: PublishStatus;
  /** True for built-in prototype entries that have no media attached. */
  isDemo?: boolean;
}

/** Normalised shape used by cards, search and Explore. */
export type ContentKind = "course" | "video";
export interface CatalogItem {
  kind: ContentKind;
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  categoryId: string;
  creatorId: string;
  tags: string[];
  addedAt: string;
  durationLabel: string;
  lessonCount?: number;
  href: string;
}
