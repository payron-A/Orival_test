import { createContext, useContext } from "react";

export interface AppState {
  followedIds: Set<string>;
  isFollowing: (id: string) => boolean;
  toggleFollow: (id: string) => void;
  unreadCount: number;
  notificationsRead: Record<string, boolean>;
  markRead: (id: string) => void;
  markAllRead: () => void;
}
export const AppContext = createContext<AppState | null>(null);
export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
