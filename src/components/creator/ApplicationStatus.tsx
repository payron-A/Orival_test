import { useApi } from "../../context/api-context";
import { useI18n } from "../../i18n/i18n-context";
import type { CreatorApplication } from "../../types/user";

/** Shows the (prototype) review state. The simulate buttons exist only because there is no reviewer in a frontend-only build. */
export function ApplicationStatus({ app }: { app: CreatorApplication }) {
  const { simulateReview, withdrawApplication } = useApi();
  const { t, date } = useI18n();
  return (
    <div className="stack">
      <p><span className={`status status--${app.status}`}>{t(`status.${app.status}`)}</span></p>
      <p className="muted">{app.status === "pending" ? t("status.pendingBody") : app.status === "approved" ? t("status.approvedBody") : t("status.rejectedBody")}</p>
      <p className="field__hint">{t("status.submittedOn", { date: date(app.submittedAt) })}</p>
      {app.status === "pending" && (
        <div className="alert alert--note stack">
          <strong>{t("apply.protoTitle")}</strong>
          <p>{t("apply.protoBody")}</p>
          <div className="row">
            <button className="btn btn--sm" onClick={() => simulateReview("approved")}>{t("apply.simApprove")}</button>
            <button className="btn btn--sm" onClick={() => simulateReview("rejected")}>{t("apply.simReject")}</button>
            <button className="btn btn--sm btn--ghost" onClick={withdrawApplication}>{t("apply.withdraw")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
