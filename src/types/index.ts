export type LearningMode = "in-person" | "online" | "hybrid";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "All levels";

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name
  courseCount: number;
  color: string;
}

export interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  followerCount: number;
  modes: LearningMode[];
  location?: GeoLocation;
  about: string;
  categoryIds: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // "12:30"
  completed?: boolean;
  locked?: boolean;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
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
  providerId: string;
  categoryId: string;
  mode: LearningMode;
  rating: number;
  reviewCount: number;
  studentCount: number;
  priceDzd: number;
  level: CourseLevel;
  lessonCount: number;
  durationLabel: string; // "6h 30m"
  distanceKm?: number; // only when in-person/hybrid and near user
  location?: GeoLocation; // only when in-person/hybrid
  description: string;
  outcomes: string[];
  sections: CourseSection[];
  reviews: Review[];
  tags: string[];
  addedAt: string; // ISO date, for "recently added"
}

export type EnrollmentStatus = "not-started" | "in-progress" | "completed";

export interface Enrollment {
  courseId: string;
  status: EnrollmentStatus;
  progress: number; // 0-100
  enrolledAt: string;
  lastLessonId?: string;
}

export type NotificationCategory = "update" | "offer" | "system" | "reminder";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  timeAgo: string;
  read: boolean;
}

export interface HistoryEntry {
  id: string;
  type: "course" | "provider";
  refId: string;
  viewedAt: string;
}

export interface User {
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  location: string;
  joined: string;
}
