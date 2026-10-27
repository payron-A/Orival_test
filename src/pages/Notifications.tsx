import { useState } from "react";
import { notifications } from "../data";
import { useApp } from "../context/app-context";
import { useI18n } from "../i18n/i18n-context";
import { PageHead, Empty } from "../components/common/PageHead";

type Tab = "all" | "update" | "system";

export default function Notifications() {
  const { notificationsRead, markRead, markAllRead } = useApp();
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("all");
  const list = notifications.filter((n) => tab === "all" || n.category === tab);
  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12" style={{ maxWidth: 760 }}>
      <PageHead eyebrow={t("nav.notifications")} title={t("notif.title")} lede={t("notif.sampleNote")}
        actions={<button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" onClick={markAllRead}>{t("notif.markAll")}</button>} />
      <div className="flex gap-6 overflow-x-auto border-b border-line" role="tablist" style={{ marginBlockEnd: 16 }}>
        {(["all", "update", "system"] as Tab[]).map((k) => <button key={k} role="tab" className="relative whitespace-nowrap border-0 bg-transparent py-3 text-sm font-semibold text-muted aria-selected:text-ink aria-selected:after:absolute aria-selected:after:inset-x-0 aria-selected:after:-bottom-px aria-selected:after:h-0.5 aria-selected:after:bg-orange-500 aria-selected:after:content-['']" aria-selected={tab === k} onClick={() => setTab(k)}>{t(`notif.tab.${k}`)}</button>)}
      </div>
      {list.length === 0 ? <Empty title={t("notif.empty")} /> : (
        <ul>
          {list.map((n) => (
            <li key={n.id} className="grid grid-cols-[96px_1fr_auto] items-center gap-4 border-b border-line py-4 max-[620px]:grid-cols-[72px_1fr] max-[620px]:[&>:last-child]:col-span-full" style={{ gridTemplateColumns: "12px 1fr auto" }}>
              <span aria-hidden="true" className={notificationsRead[n.id] ? "size-2 rounded-full bg-transparent" : "size-2 rounded-full bg-orange-500"} />
              <div><h3 style={{ fontSize: "1rem" }}>{n.title}</h3><p className="text-muted" lang="en" dir="ltr" style={{ textAlign: "start" }}>{n.body}</p></div>
              {!notificationsRead[n.id] && <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-transparent bg-transparent text-ink hover:bg-mist" onClick={() => markRead(n.id)}>✓</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
