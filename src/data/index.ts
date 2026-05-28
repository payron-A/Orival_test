export { categories } from "./categories";
export { providers } from "./providers";
export { courses } from "./courses";
export { notifications, historyEntries, currentUser } from "./notifications";

import { categories } from "./categories";
import { providers } from "./providers";
import { courses } from "./courses";
import type { Course, Provider, Category } from "../types";

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}
export function getProviderById(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
export function getCoursesByProvider(providerId: string): Course[] {
  return courses.filter((c) => c.providerId === providerId);
}
export function getCoursesByCategory(categoryId: string): Course[] {
  return courses.filter((c) => c.categoryId === categoryId);
}
