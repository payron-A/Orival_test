//_____COURSES_____
//___Courses Modes:
export type LearningMode = "in-person" | "online" | "hybrid";
export type CourseLevel = "beginner" | "intermediate" | "advanced" | "all levels";
//___Courses Section:
export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}
//___Courses Lesson:
export interface Lesson {
  id: string;
  title: string;
  duration: string; // "12:30"
  completed?: boolean;
  locked?: boolean;
}
//___Courses Location:
export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
}
//___Courses Review:
export interface Review {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  rating: number;
  date: string;
  comment: string;
}
//___Courses:
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