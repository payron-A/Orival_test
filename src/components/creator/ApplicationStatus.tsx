import { useApi } from "../../context/api-context";
import { useI18n } from "../../i18n/i18n-context";
import type { CreatorApplication } from "../../types/user";

/** Shows the (prototype) review state. The simulate buttons exist only because there is no reviewer in a frontend-only build. */
export function ApplicationStatus({ app }: { app: CreatorApplication }) {
  const { simulateReview, withdrawApplication } = useApi();
  const { t, date } = useI18n();
  return (
    <div className="space-y-4">
      <p><span className={app.status === "pending" ? "inline-flex items-center gap-2 text-sm font-bold before:size-[9px] before:rounded-full before:content-[''] before:bg-orange-500" : app.status === "approved" ? "inline-flex items-center gap-2 text-sm font-bold before:size-[9px] before:rounded-full before:content-[''] before:bg-ok" : "inline-flex items-center gap-2 text-sm font-bold before:size-[9px] before:rounded-full before:content-[''] before:bg-danger"}>{t(`status.${app.status}`)}</span></p>
      <p className="text-muted">{app.status === "pending" ? t("status.pendingBody") : app.status === "approved" ? t("status.approvedBody") : t("status.rejectedBody")}</p>
      <p className="text-sm text-muted">{t("status.submittedOn", { date: date(app.submittedAt) })}</p>
      {app.status === "pending" && (
        <div className="border-s-[3px] px-4 py-3 text-sm border-ink bg-mist space-y-4">
          <strong>{t("apply.protoTitle")}</strong>
          <p>{t("apply.protoBody")}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" onClick={() => simulateReview("approved")}>{t("apply.simApprove")}</button>
            <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" onClick={() => simulateReview("rejected")}>{t("apply.simReject")}</button>
            <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-transparent bg-transparent text-ink hover:bg-mist" onClick={withdrawApplication}>{t("apply.withdraw")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
