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
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
        <Empty
          title={t("studio.denied")}
          body={t("studio.deniedBody")}
          action={<Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]" to="/become-creator">{t("dash.memberCta")}</Link>}
        />
      </div>
    );
  }
  return <>{children}</>;
}
