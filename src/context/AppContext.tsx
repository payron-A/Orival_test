import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useApi } from "./ApiContext";
import { notifications as seedNotifications } from "../data";

interface AppState {
  followedProviderIds: Set<string>;
  unreadNotificationCount: number;
  notificationsRead: Record<string, boolean>;
  toggleFollowProvider: (providerId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  isFollowing: (id: string) => boolean;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {

//____Followres:
  const { user , setUser} = useApi();
  const [followedProviderIds, setFollowedProviderIds] = useState<Set<string>>(new Set(
    user?.following)
  );
  const toggleFollowProvider = (providerId: string) =>
    setFollowedProviderIds((prev) => {
      const next = new Set(prev);
      next.has(providerId) ? next.delete(providerId) : next.add(providerId);
      return next;
  });
  useEffect(()=>{
    if(user) return setUser({...user,following:[...followedProviderIds]});
  },[followedProviderIds])
//____Notification:
  const [notificationsRead, setNotificationsRead] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(seedNotifications.map((n) => [n.id, n.read]))
  );

  const markNotificationRead = (id: string) => setNotificationsRead((prev) => ({ ...prev, [id]: true }));
  const markAllNotificationsRead = () =>
    setNotificationsRead(Object.fromEntries(seedNotifications.map((n) => [n.id, true])));

  const unreadNotificationCount = useMemo(
    () => seedNotifications.filter((n) => !notificationsRead[n.id]).length,
    [notificationsRead]
  );

  const value: AppState = {
    followedProviderIds,
    unreadNotificationCount,
    notificationsRead,
    toggleFollowProvider,
    markNotificationRead,
    markAllNotificationsRead,
    isFollowing: (id) => followedProviderIds.has(id),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}


// ?????
// Delete AllCourses Id