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
    <div className="container page" style={{ maxWidth: 760 }}>
      <PageHead eyebrow={t("nav.notifications")} title={t("notif.title")} lede={t("notif.sampleNote")}
        actions={<button className="btn btn--sm" onClick={markAllRead}>{t("notif.markAll")}</button>} />
      <div className="tabs" role="tablist" style={{ marginBlockEnd: 16 }}>
        {(["all", "update", "system"] as Tab[]).map((k) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{t(`notif.tab.${k}`)}</button>)}
      </div>
      {list.length === 0 ? <Empty title={t("notif.empty")} /> : (
        <ul>
          {list.map((n) => (
            <li key={n.id} className="list-row" style={{ gridTemplateColumns: "12px 1fr auto" }}>
              <span aria-hidden="true" style={{ width: 8, height: 8, background: notificationsRead[n.id] ? "transparent" : "var(--orange-500)", borderRadius: "50%" }} />
              <div><h3 style={{ fontSize: "1rem" }}>{n.title}</h3><p className="muted" lang="en" dir="ltr" style={{ textAlign: "start" }}>{n.body}</p></div>
              {!notificationsRead[n.id] && <button className="btn btn--sm btn--ghost" onClick={() => markRead(n.id)}>✓</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
