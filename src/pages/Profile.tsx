import { Link, Navigate } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";

export default function Profile() {
  const { user, isCreator, signOut } = useApi();
  const { t, date } = useI18n();
  if (!user) return <Navigate to="/signin?next=%2Fprofile" replace />;
  const links = [
    { to: "/dashboard", label: t("profile.menu.dashboard"), icon: "fa-table-columns" },
    { to: "/library", label: t("profile.menu.library"), icon: "fa-bookmark" },
    { to: "/notifications", label: t("profile.menu.notifications"), icon: "fa-bell" },
    { to: "/settings", label: t("profile.menu.settings"), icon: "fa-gear" },
  ];
  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12" style={{ maxWidth: 720 }}>
      <header className="flex flex-wrap items-center gap-3" style={{ gap: 24, marginBlockEnd: 32 }}>
        <img className="size-[72px]" src={user.avatarUrl} alt="" width={72} height={72} />
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-700 rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("profile.title")}</span>
          <h1 className="text-headline">{user.name}</h1>
          <p className="text-muted">{user.handle}{user.joinedAt ? ` · ${t("profile.joined", { date: date(user.joinedAt) })}` : ""}</p>
        </div>
      </header>
      <div className="grid gap-3 rounded border border-ink p-5 mb-8">
        <dl className="m-0 grid gap-3">
          <div><dt className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("profile.account")}</dt><dd className="m-0 font-semibold">{isCreator ? t("profile.role.creator") : t("profile.role.member")}</dd></div>
          <div><dt className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("settings.email")}</dt><dd className="m-0 font-semibold" dir="ltr" style={{ textAlign: "start" }}>{user.email}</dd></div>
          {user.location && <div><dt className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("settings.location")}</dt><dd className="m-0 font-semibold">{user.location}</dd></div>}
        </dl>
      </div>
      <ul>
        {links.map((l) => (
          <li key={l.to}>
            <Link className="grid grid-cols-[96px_1fr_auto] items-center gap-4 border-b border-line py-4 max-[620px]:grid-cols-[72px_1fr] max-[620px]:[&>:last-child]:col-span-full" style={{ gridTemplateColumns: "24px 1fr auto" }} to={l.to}>
              <i className={`fa-regular ${l.icon}`} aria-hidden="true" /><span>{l.label}</span><i className="fa-solid fa-chevron-right rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-danger bg-white text-danger hover:bg-mist" style={{ marginBlockStart: 32 }} onClick={signOut}>{t("nav.signOut")}</button>
    </div>
  );
}
