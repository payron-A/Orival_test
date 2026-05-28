import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiContext, type ApiState } from "./api-context";
import { api } from "../lib/api";
import { loadJSON, removeKey, saveJSON } from "../lib/storage";
import { courseToItem, normalizeCourse, videoToItem } from "../lib/catalog";
import * as auth from "../lib/auth";
import { defaultCourses, demoVideos, seedCategories, seedProviders } from "../data";
import type { Course } from "../types/courses";
import type { Video } from "../types/content";
import type { Category } from "../types/category";
import type { Provider } from "../types/provider";
import type { CreatorApplication, HistoryEntry, User } from "../types/user";

const USER_KEY = "user"; // kept from the previous version so existing sessions survive
const SAVED_KEY = "orival.saved.v1";
const HISTORY_KEY = "orival.history.v1";
const STUDIO_KEY = "orival.studio.v1";

interface Studio {
  courses: Course[];
  videos: Video[];
}
const isStudio = (v: unknown): v is Studio =>
  typeof v === "object" && v !== null && Array.isArray((v as Studio).courses) && Array.isArray((v as Studio).videos);
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");
const isHistory = (v: unknown): v is HistoryEntry[] => Array.isArray(v);

/** Old sessions may lack role/handle fields; fill them in rather than discarding the session. */
function loadUser(): User | null {
  const raw = loadJSON<Partial<User> | null>(USER_KEY, null);
  if (!raw || typeof raw !== "object" || !raw.email || !raw.name) return null;
  return {
    name: raw.name,
    email: raw.email,
    handle: raw.handle ?? "@" + raw.email.split("@")[0],
    avatarUrl: raw.avatarUrl ?? "",
    location: raw.location ?? "",
    joinedAt: raw.joinedAt ?? "",
    following: raw.following,
    providerId: raw.providerId,
    role: raw.role ?? (raw.providerId ? "creator" : "member"),
    creatorApplication: raw.creatorApplication,
  };
}

export function ApiProvider({ children }: { children: ReactNode }) {
  //===== Remote (Backend) data with prototype fallback =====
  const [remote, setRemote] = useState<{ courses: Course[]; providers: Provider[]; categories: Category[]; seed: boolean }>({
    courses: [],
    providers: [],
    categories: [],
    seed: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.allSettled([
      api<{ courses: Course[] }>("/courses"),
      api<{ providers: Provider[] }>("/providers"),
      api<{ categories: Category[] }>("/categories"),
    ]).then(([c, p, k]) => {
      if (!alive) return;
      const ok = c.status === "fulfilled" && p.status === "fulfilled" && k.status === "fulfilled";
      setRemote(
        ok
          ? { courses: c.value.courses.map(normalizeCourse), providers: p.value.providers, categories: k.value.categories, seed: false }
          : { courses: defaultCourses.map(normalizeCourse), providers: seedProviders, categories: seedCategories, seed: true }
      );
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  //===== User =====
  const [user, setUserState] = useState<User | null>(loadUser);
  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) {
      saveJSON(USER_KEY, u);
      auth.persistProfile(u);
    } else removeKey(USER_KEY);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => setUser(await auth.signIn({ email, password })), [setUser]);
  const signUp = useCallback(
    async (name: string, email: string, password: string) => setUser(await auth.signUp({ name, email, password })),
    [setUser]
  );
  const signOut = useCallback(() => {
    removeKey("token");
    setUser(null);
  }, [setUser]);
  const updateProfile = useCallback<ApiState["updateProfile"]>(
    (patch) => setUserState((u) => {
      if (!u) return u;
      const next = { ...u, ...patch };
      saveJSON(USER_KEY, next);
      auth.persistProfile(next);
      return next;
    }),
    []
  );
  const patchApplication = useCallback(
    (fn: (u: User) => User) => setUserState((u) => {
      if (!u) return u;
      const next = fn(u);
      saveJSON(USER_KEY, next);
      auth.persistProfile(next);
      return next;
    }),
    []
  );
  const applyForCreator = useCallback(
    (a: Omit<CreatorApplication, "status" | "submittedAt" | "decidedAt">) =>
      patchApplication((u) => ({ ...u, creatorApplication: { ...a, status: "pending", submittedAt: new Date().toISOString() } })),
    [patchApplication]
  );
  const simulateReview = useCallback(
    (decision: "approved" | "rejected") =>
      patchApplication((u) =>
        u.creatorApplication
          ? { ...u, role: decision === "approved" ? "creator" : "member", creatorApplication: { ...u.creatorApplication, status: decision, decidedAt: new Date().toISOString() } }
          : u
      ),
    [patchApplication]
  );
  const withdrawApplication = useCallback(
    () => patchApplication((u) => ({ ...u, role: u.providerId ? "creator" : "member", creatorApplication: undefined })),
    [patchApplication]
  );
  const isCreator = user?.role === "creator" || Boolean(user?.providerId);

  //===== Saved (local first; Backend sync is best-effort for courses) =====
  const [savedKeys, setSavedKeys] = useState<string[]>(() => loadJSON<string[]>(SAVED_KEY, [], isStringArray));
  const isSaved = useCallback((kind: "course" | "video", id: string) => savedKeys.includes(`${kind}:${id}`), [savedKeys]);
  const toggleSaved = useCallback(
    (kind: "course" | "video", id: string) => {
      const key = `${kind}:${id}`;
      const was = savedKeys.includes(key);
      const next = was ? savedKeys.filter((k) => k !== key) : [...savedKeys, key];
      setSavedKeys(next);
      saveJSON(SAVED_KEY, next);
      if (kind === "course" && localStorage.getItem("token")) {
        api(`/saved/${id}`, { method: was ? "DELETE" : "POST" }).catch(() => undefined);
      }
    },
    [savedKeys]
  );

  //===== Recently watched (a plain list; not a progress measure) =====
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadJSON<HistoryEntry[]>(HISTORY_KEY, [], isHistory));
  const recordView = useCallback((kind: "course" | "video", id: string, lessonId?: string) => {
    setHistory((prev) => {
      const next = [
        { id: `${kind}:${id}`, type: kind, refId: id, lessonId, viewedAt: new Date().toISOString() },
        ...prev.filter((h) => h.id !== `${kind}:${id}`),
      ].slice(0, 40);
      saveJSON(HISTORY_KEY, next);
      return next;
    });
  }, []);
  const clearHistory = useCallback(() => {
    setHistory([]);
    saveJSON(HISTORY_KEY, []);
  }, []);

  //===== Creator studio content (browser only) =====
  const [studio, setStudio] = useState<Studio>(() => loadJSON<Studio>(STUDIO_KEY, { courses: [], videos: [] }, isStudio));
  const commitStudio = useCallback((fn: (s: Studio) => Studio) => {
    setStudio((s) => {
      const next = fn(s);
      saveJSON(STUDIO_KEY, next);
      return next;
    });
  }, []);
  const upsert = <T extends { id: string }>(list: T[], item: T) =>
    list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];
  const saveStudioCourse = useCallback((c: Course) => commitStudio((s) => ({ ...s, courses: upsert(s.courses, normalizeCourse(c)) })), [commitStudio]);
  const saveStudioVideo = useCallback((v: Video) => commitStudio((s) => ({ ...s, videos: upsert(s.videos, v) })), [commitStudio]);
  const deleteStudioCourse = useCallback((id: string) => commitStudio((s) => ({ ...s, courses: s.courses.filter((c) => c.id !== id) })), [commitStudio]);
  const deleteStudioVideo = useCallback((id: string) => commitStudio((s) => ({ ...s, videos: s.videos.filter((v) => v.id !== id) })), [commitStudio]);

  //===== Derived catalog =====
  const courses = useMemo(
    () => [...studio.courses.filter((c) => c.status !== "draft"), ...remote.courses],
    [studio.courses, remote.courses]
  );
  const videos = useMemo(() => [...studio.videos.filter((v) => v.status !== "draft"), ...demoVideos], [studio.videos]);
  const items = useMemo(() => [...courses.map(courseToItem), ...videos.map(videoToItem)], [courses, videos]);

  const providers = useMemo(() => {
    const known = new Set(remote.providers.map((p) => p.id));
    const extra: Provider[] = [];
    if (user) {
      const id = user.providerId ?? `u-${user.handle.replace("@", "")}`;
      if (!known.has(id) && (studio.courses.length || studio.videos.length)) {
        extra.push({ id, name: user.name, avatarUrl: user.avatarUrl, verified: false, rating: 0, reviewCount: 0, followerCount: 0, modes: ["online"], about: "", categoryIds: [] });
      }
    }
    return [...remote.providers, ...extra];
  }, [remote.providers, user, studio]);

  const getCourse = useCallback((id?: string) => [...studio.courses, ...remote.courses].find((c) => c.id === id), [studio.courses, remote.courses]);
  const getVideo = useCallback((id?: string) => [...studio.videos, ...demoVideos].find((v) => v.id === id), [studio.videos]);
  const getCreator = useCallback((id?: string) => providers.find((p) => p.id === id), [providers]);
  const getCategory = useCallback((id?: string) => remote.categories.find((c) => c.id === id), [remote.categories]);

  const value: ApiState = {
    loading,
    usingSeedData: remote.seed,
    courses, videos, items, providers,
    categories: remote.categories,
    getCourse, getVideo, getCreator, getCategory,
    user, isCreator, signIn, signUp, signOut, updateProfile,
    applyForCreator, simulateReview, withdrawApplication,
    savedKeys, isSaved, toggleSaved,
    history, recordView, clearHistory,
    studioCourses: studio.courses, studioVideos: studio.videos,
    saveStudioCourse, deleteStudioCourse, saveStudioVideo, deleteStudioVideo,
  };
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
