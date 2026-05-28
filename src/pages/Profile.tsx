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
    <div className="container page" style={{ maxWidth: 720 }}>
      <header className="row" style={{ gap: 24, marginBlockEnd: 32 }}>
        <img className="avatar" src={user.avatarUrl} alt="" width={72} height={72} />
        <div className="stack">
          <span className="eyebrow">{t("profile.title")}</span>
          <h1 style={{ fontSize: "var(--fs-xl)" }}>{user.name}</h1>
          <p className="muted">{user.handle}{user.joinedAt ? ` · ${t("profile.joined", { date: date(user.joinedAt) })}` : ""}</p>
        </div>
      </header>
      <dl className="facts" style={{ marginBlockEnd: 32 }}>
        <dl>
          <div><dt>{t("profile.account")}</dt><dd>{isCreator ? t("profile.role.creator") : t("profile.role.member")}</dd></div>
          <div><dt>{t("settings.email")}</dt><dd dir="ltr" style={{ textAlign: "start" }}>{user.email}</dd></div>
          {user.location && <div><dt>{t("settings.location")}</dt><dd>{user.location}</dd></div>}
        </dl>
      </dl>
      <ul>
        {links.map((l) => (
          <li key={l.to}>
            <Link className="list-row" style={{ gridTemplateColumns: "24px 1fr auto" }} to={l.to}>
              <i className={`fa-regular ${l.icon}`} aria-hidden="true" /><span>{l.label}</span><i className="fa-solid fa-chevron-right i-dir" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      <button className="btn btn--danger" style={{ marginBlockStart: 32 }} onClick={signOut}>{t("nav.signOut")}</button>
    </div>
  );
}
