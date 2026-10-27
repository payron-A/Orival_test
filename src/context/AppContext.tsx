import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AppContext, type AppState } from "./app-context";
import { notifications as seed } from "../data";
import { api } from "../lib/api";
import { loadJSON, saveJSON } from "../lib/storage";

const FOLLOW_KEY = "orival.following.v1";
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");

export function AppProvider({ children }: { children: ReactNode }) {
  const [followed, setFollowed] = useState<string[]>(() => loadJSON<string[]>(FOLLOW_KEY, [], isStringArray));
  const toggleFollow = useCallback(
    (id: string) => {
      const was = followed.includes(id);
      const next = was ? followed.filter((x) => x !== id) : [...followed, id];
      setFollowed(next);
      saveJSON(FOLLOW_KEY, next);
      if (localStorage.getItem("token")) api(`/providers/${id}/follow`, { method: was ? "DELETE" : "POST" }).catch(() => undefined);
    },
    [followed]
  );

  const [read, setRead] = useState<Record<string, boolean>>(() => Object.fromEntries(seed.map((n) => [n.id, n.read])));
  const unreadCount = useMemo(() => seed.filter((n) => !read[n.id]).length, [read]);

  const value: AppState = {
    followedIds: new Set(followed),
    isFollowing: (id) => followed.includes(id),
    toggleFollow,
    unreadCount,
    notificationsRead: read,
    markRead: (id) => setRead((p) => ({ ...p, [id]: true })),
    markAllRead: () => setRead(Object.fromEntries(seed.map((n) => [n.id, true]))),
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
