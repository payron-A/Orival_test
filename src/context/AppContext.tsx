import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Enrollment, EnrollmentStatus } from "../types";
import { courses } from "../data";
import { notifications as seedNotifications } from "../data";

interface AppState {
  savedCourseIds: Set<string>;
  savedProviderIds: Set<string>;
  followedProviderIds: Set<string>;
  enrollments: Record<string, Enrollment>;
  unreadNotificationCount: number;
  notificationsRead: Record<string, boolean>;
  toggleSaveCourse: (courseId: string) => void;
  toggleSaveProvider: (providerId: string) => void;
  toggleFollowProvider: (providerId: string) => void;
  enroll: (courseId: string) => void;
  setLessonComplete: (courseId: string, lessonId: string, totalLessons: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  isSavedCourse: (id: string) => boolean;
  isSavedProvider: (id: string) => boolean;
  isFollowing: (id: string) => boolean;
  isEnrolled: (id: string) => boolean;
}

const AppContext = createContext<AppState | null>(null);

// Seed a couple of enrollments so My Learning / Enrollments pages have content
const initialEnrollments: Record<string, Enrollment> = {
  "advanced-photography": { courseId: "advanced-photography", status: "in-progress", progress: 48, enrolledAt: "2026-05-10", lastLessonId: "l3" },
  "python-for-beginners": { courseId: "python-for-beginners", status: "in-progress", progress: 40, enrolledAt: "2026-04-28" },
  "uiux-design-basics": { courseId: "uiux-design-basics", status: "in-progress", progress: 20, enrolledAt: "2026-04-15" },
  "graphic-design-masterclass": { courseId: "graphic-design-masterclass", status: "not-started", progress: 0, enrolledAt: "2026-08-02" },
  "english-conversation-skills": { courseId: "english-conversation-skills", status: "completed", progress: 100, enrolledAt: "2026-01-05" },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedCourseIds, setSavedCourseIds] = useState<Set<string>>(new Set(["advanced-photography", "python-for-beginners", "digital-marketing-2024", "photo-editing-lightroom"]));
  const [savedProviderIds, setSavedProviderIds] = useState<Set<string>>(new Set());
  const [followedProviderIds, setFollowedProviderIds] = useState<Set<string>>(new Set(["photography-academy", "codepro-institute", "english-center"]));
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>(initialEnrollments);
  const [notificationsRead, setNotificationsRead] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(seedNotifications.map((n) => [n.id, n.read]))
  );

  const toggleSaveCourse = (courseId: string) =>
    setSavedCourseIds((prev) => {
      const next = new Set(prev);
      next.has(courseId) ? next.delete(courseId) : next.add(courseId);
      return next;
    });

  const toggleSaveProvider = (providerId: string) =>
    setSavedProviderIds((prev) => {
      const next = new Set(prev);
      next.has(providerId) ? next.delete(providerId) : next.add(providerId);
      return next;
    });

  const toggleFollowProvider = (providerId: string) =>
    setFollowedProviderIds((prev) => {
      const next = new Set(prev);
      next.has(providerId) ? next.delete(providerId) : next.add(providerId);
      return next;
    });

  const enroll = (courseId: string) =>
    setEnrollments((prev) => ({
      ...prev,
      [courseId]: prev[courseId] ?? {
        courseId,
        status: "not-started" as EnrollmentStatus,
        progress: 0,
        enrolledAt: new Date().toISOString().slice(0, 10),
      },
    }));

  const setLessonComplete = (courseId: string, lessonId: string, totalLessons: number) =>
    setEnrollments((prev) => {
      const existing = prev[courseId] ?? { courseId, status: "not-started" as EnrollmentStatus, progress: 0, enrolledAt: new Date().toISOString().slice(0, 10) };
      const progress = Math.min(100, Math.round(existing.progress + 100 / totalLessons));
      return {
        ...prev,
        [courseId]: {
          ...existing,
          lastLessonId: lessonId,
          progress,
          status: progress >= 100 ? "completed" : "in-progress",
        },
      };
    });

  const markNotificationRead = (id: string) => setNotificationsRead((prev) => ({ ...prev, [id]: true }));
  const markAllNotificationsRead = () =>
    setNotificationsRead(Object.fromEntries(seedNotifications.map((n) => [n.id, true])));

  const unreadNotificationCount = useMemo(
    () => seedNotifications.filter((n) => !notificationsRead[n.id]).length,
    [notificationsRead]
  );

  const value: AppState = {
    savedCourseIds,
    savedProviderIds,
    followedProviderIds,
    enrollments,
    unreadNotificationCount,
    notificationsRead,
    toggleSaveCourse,
    toggleSaveProvider,
    toggleFollowProvider,
    enroll,
    setLessonComplete,
    markNotificationRead,
    markAllNotificationsRead,
    isSavedCourse: (id) => savedCourseIds.has(id),
    isSavedProvider: (id) => savedProviderIds.has(id),
    isFollowing: (id) => followedProviderIds.has(id),
    isEnrolled: (id) => Boolean(enrollments[id]),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function allCourseIds() {
  return courses.map((c) => c.id);
}
