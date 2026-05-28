import { useState } from "react";
import { notifications } from "../data";
import { MobileHeader } from "../components/layout/MobileHeader";
import { useApp } from "../context/AppContext";
import type { NotificationCategory } from "../types";

const catColor: Record<NotificationCategory, string> = {
  update: "#3E8FFF",
  offer: "#FF7A26",
  system: "#9B7BFF",
  reminder: "#33C46A",
};

const tabs: { key: "all" | NotificationCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "update", label: "Updates" },
  { key: "offer", label: "Offers" },
  { key: "system", label: "System" },
];

export default function Notifications() {
  const { notificationsRead, markNotificationRead, markAllNotificationsRead } = useApp();
  const [tab, setTab] = useState<"all" | NotificationCategory>("all");

  const filtered = notifications.filter((n) => tab === "all" || n.category === tab);
  const today = filtered.filter((n) => n.timeAgo.includes("h ago"));
  const earlier = filtered.filter((n) => !n.timeAgo.includes("h ago"));

  return (
    <div>
      <MobileHeader title="Notifications" />
      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="hidden lg:block font-display text-2xl font-bold">Notifications</h1>
          <button onClick={markAllNotificationsRead} className="ml-auto text-xs font-medium text-orival hover:text-orival-bright">
            Mark all as read
          </button>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                tab === t.key ? "bg-orival border-orival text-black" : "bg-base-panel border-base-border text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {today.length > 0 && <Group title="Today" items={today} />}
        {earlier.length > 0 && <Group title="Earlier" items={earlier} />}
        {filtered.length === 0 && <p className="text-sm text-ink-muted py-10 text-center">Nothing here.</p>}
      </div>
    </div>
  );

  function Group({ title, items }: { title: string; items: typeof notifications }) {
    return (
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-ink-muted mb-2.5">{title}</h2>
        <div className="flex flex-col gap-2">
          {items.map((n) => {
            const read = notificationsRead[n.id];
            return (
              <button
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`flex items-start gap-3 rounded-xl2 border p-3.5 text-left transition-colors ${
                  read ? "border-base-border bg-base-panel" : "border-orival/30 bg-orival/[0.04]"
                }`}
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${catColor[n.category]}1F`, color: catColor[n.category] }}>
                  <i className="fa-solid fa-home"></i>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-primary">{n.title}</p>
                  <p className="mt-0.5 text-xs text-ink-secondary leading-relaxed">{n.body}</p>
                  <p className="mt-1 text-[11px] text-ink-muted">{n.timeAgo}</p>
                </div>
                {!read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orival" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
