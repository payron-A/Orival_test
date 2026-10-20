export { categories } from "./categories";
export { providers } from "./providers";
export { defaultCourses } from "./courses";
export { notifications, historyEntries } from "./notifications";

import { categories } from "./categories";
import { providers } from "./providers";
import { useApi } from "../context/ApiContext";
import type { Course } from "../types/courses";
import type { Category } from "../types/category";
import type { Provider } from "../types/provider";
function Courses(){
  const { courses } = useApi();
  return courses
}
export function getCourseById(id: string): Course | undefined {
  return Courses().find((c) => c.id === id);
}
export function getProviderById(id: string | undefined): Provider | undefined {
  return providers.find((p) => p.id === id);
}
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
export function getCoursesByProvider(providerId: string | undefined): Course[] {
  return Courses().filter((c) => c.providerId === providerId);
}
export function getCoursesByCategory(categoryId: string): Course[] {
  return Courses().filter((c) => c.categoryId === categoryId);
}
