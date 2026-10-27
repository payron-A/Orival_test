import { createContext, useContext } from "react";
import type { Course } from "../types/courses";
import type { CatalogItem, Video } from "../types/content";
import type { Category } from "../types/category";
import type { Provider } from "../types/provider";
import type { CreatorApplication, HistoryEntry, User } from "../types/user";

export interface ApiState {
  loading: boolean;
  /** True when the Backend was unreachable and built-in prototype data is shown. */
  usingSeedData: boolean;
  courses: Course[];
  videos: Video[];
  items: CatalogItem[];
  providers: Provider[];
  categories: Category[];
  getCourse: (id: string | undefined) => Course | undefined;
  getVideo: (id: string | undefined) => Video | undefined;
  getCreator: (id: string | undefined) => Provider | undefined;
  getCategory: (id: string | undefined) => Category | undefined;

  user: User | null;
  isCreator: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "location">>) => void;
  applyForCreator: (a: Omit<CreatorApplication, "status" | "submittedAt" | "decidedAt">) => void;
  /** Prototype-only: simulates a reviewer decision. Real review needs a trusted Backend. */
  simulateReview: (decision: "approved" | "rejected") => void;
  withdrawApplication: () => void;

  savedKeys: string[];
  isSaved: (kind: "course" | "video", id: string) => boolean;
  toggleSaved: (kind: "course" | "video", id: string) => void;

  history: HistoryEntry[];
  recordView: (kind: "course" | "video", id: string, lessonId?: string) => void;
  clearHistory: () => void;

  studioCourses: Course[];
  studioVideos: Video[];
  saveStudioCourse: (c: Course) => void;
  deleteStudioCourse: (id: string) => void;
  saveStudioVideo: (v: Video) => void;
  deleteStudioVideo: (id: string) => void;
}

export const ApiContext = createContext<ApiState | null>(null);

export function useApi(): ApiState {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx;
}
