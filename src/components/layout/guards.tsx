import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useApi } from "../../context/api-context";
import { useI18n } from "../../i18n/i18n-context";
import { Empty } from "../common/PageHead";

/**
 * Frontend gate for anything that plays video. The destination is carried in `?next=` so it
 * survives a refresh. NOTE: this is a UX gate for a prototype — real enforcement needs a server.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useApi();
  const loc = useLocation();
  if (!user) return <Navigate to={`/signin?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  return <>{children}</>;
}

/** Studio routes: signed-in, approved Creators only. Members get an explanation, not the tools. */
export function RequireCreator({ children }: { children: ReactNode }) {
  const { user, isCreator } = useApi();
  const { t } = useI18n();
  const loc = useLocation();
  if (!user) return <Navigate to={`/signin?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  if (!isCreator) {
    return (
      <div className="container page">
        <Empty
          title={t("studio.denied")}
          body={t("studio.deniedBody")}
          action={<Link className="btn btn--primary" to="/become-creator">{t("dash.memberCta")}</Link>}
        />
      </div>
    );
  }
  return <>{children}</>;
}
