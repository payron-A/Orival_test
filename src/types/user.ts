//_____USER_____
export interface User {
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  location: string;
  joined: string;
}

//_____ENROLLMENTS_____
export type EnrollmentStatus = "not-started" | "in-progress" | "completed";
export interface Enrollment {
  courseId: string;
  status: EnrollmentStatus;
  progress: number; // 0-100
  enrolledAt: string;
  lastLessonId?: string;
}

//_____HISTORY_____
export interface HistoryEntry {
  id: string;
  type: "course" | "provider";
  refId: string;
  viewedAt: string;
}





















