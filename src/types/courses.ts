//_____COURSES_____
export type LearningMode = "in-person" | "online" | "hybrid";
export type CourseLevel = "beginner" | "intermediate" | "advanced" | "all levels";
export type PublishStatus = "draft" | "published";

export interface Lesson {
  id: string;
  title: string;
  duration: string; // "12:30"
  /** Direct media URL (mp4/webm/…). Absent = no playable source attached. */
  videoUrl?: string;
  /** Optional WebVTT URL. Only rendered when provided. */
  captionsUrl?: string;
}
export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}
export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
}
export interface Review {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  rating: number;
  date: string;
  comment: string;
}
export interface Course {
  id: string;
  title: string;
  thumbnailUrl: string;
  providerId: string; // shown in the UI as the "Creator"
  categoryId: string;
  mode: LearningMode;
  rating: number;
  reviewCount: number;
  level: CourseLevel;
  lessonCount: number;
  durationLabel: string; // "6h 30m"
  distanceKm?: number;
  location?: GeoLocation;
  description: string;
  outcomes: string[];
  sections: CourseSection[];
  reviews: Review[];
  tags: string[];
  addedAt: string; // ISO date
  status?: PublishStatus; // undefined = published (backend / seed content)
  /** Legacy marketplace fields still sent by the API; never displayed. */
  studentCount?: number;
  priceDzd?: number;
}
