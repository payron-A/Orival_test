import { Link, NavLink, Outlet } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useApi } from "../../context/api-context";
import { useApp } from "../../context/app-context";
import { useI18n } from "../../i18n/i18n-context";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { HeaderSearch } from "../search/HeaderSearch";

function UserMenu() {
  const { user, isCreator, signOut } = useApi();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  if (!user) return null;
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="icon-btn" aria-haspopup="menu" aria-expanded={open} aria-label={t("nav.account")} onClick={() => setOpen((o) => !o)}>
        <img src={user.avatarUrl} alt="" className="avatar avatar--sm" width={32} height={32} style={{ width: 32, height: 32 }} />
      </button>
      {open && (
        <div className="menu" role="menu" onClick={() => setOpen(false)}>
          <div className="menu__head">
            <strong>{user.name}</strong>
            <span className="muted">{isCreator ? t("common.creator") : t("common.member")}</span>
          </div>
          <hr />
          <Link role="menuitem" to="/profile">{t("nav.profile")}</Link>
          <Link role="menuitem" to="/dashboard">{t("nav.dashboard")}</Link>
          <Link role="menuitem" to="/library">{t("nav.library")}</Link>
          <Link role="menuitem" to="/settings">{t("nav.settings")}</Link>
          <hr />
          <button role="menuitem" onClick={signOut}>{t("nav.signOut")}</button>
        </div>
      )}
    </div>
  );
}

function SiteHeader() {
  const { user, isCreator } = useApi();
  const { unreadCount } = useApp();
  const { t, lang, setLang } = useI18n();
  const wide = useMediaQuery("(min-width: 960px)");
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="logo" aria-label="Orival">Orival</Link>
        {wide && (
          <nav className="main-nav" aria-label={t("nav.primary")}>
            <NavLink className="nav-link" to="/explore">{t("nav.explore")}</NavLink>
            <NavLink className="nav-link" to="/categories">{t("nav.categories")}</NavLink>
            {user && <NavLink className="nav-link" to="/library">{t("nav.library")}</NavLink>}
            {user && isCreator && <NavLink className="nav-link" to="/studio">{t("nav.studio")}</NavLink>}
            {user && !isCreator && <NavLink className="nav-link" to="/become-creator">{t("nav.becomeCreator")}</NavLink>}
          </nav>
        )}
        {wide ? <HeaderSearch /> : null}
        <div className="header-tools">
          {!wide && (
            <Link to="/search" className="icon-btn" aria-label={t("search.open")}>
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            </Link>
          )}
          <button className="lang-btn" lang={lang === "en" ? "ar" : "en"} aria-label={t("nav.languageLabel")} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
            {t("nav.language")}
          </button>
          {user && (
            <Link to="/notifications" className="icon-btn" aria-label={t("nav.notifications")}>
              <i className="fa-regular fa-bell" aria-hidden="true" />
              {unreadCount > 0 && <span className="dot" />}
            </Link>
          )}
          {user ? (
            <UserMenu />
          ) : (
            <>
              {wide && <Link className="btn btn--ghost btn--sm" to="/signin">{t("nav.signIn")}</Link>}
              <Link className={wide ? "btn btn--primary btn--sm" : "btn btn--primary btn--sm"} to={wide ? "/signup" : "/signin"}>
                {wide ? t("nav.createAccount") : t("nav.signIn")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const { user, isCreator } = useApi();
  const { t } = useI18n();
  return (
    <nav className="bottom-nav" aria-label={t("nav.mobile")}>
      <NavLink to="/" end><i className="fa-solid fa-house" aria-hidden="true" />{t("nav.home")}</NavLink>
      <NavLink to="/explore"><i className="fa-regular fa-compass" aria-hidden="true" />{t("nav.explore")}</NavLink>
      <NavLink to="/library"><i className="fa-regular fa-bookmark" aria-hidden="true" />{t("nav.library")}</NavLink>
      {user && isCreator && <NavLink to="/studio"><i className="fa-solid fa-clapperboard" aria-hidden="true" />{t("nav.studio")}</NavLink>}
      <NavLink to={user ? "/profile" : "/signin"}><i className="fa-regular fa-user" aria-hidden="true" />{user ? t("nav.account") : t("nav.signIn")}</NavLink>
    </nav>
  );
}

export function AppShell() {
  const { t } = useI18n();
  const { usingSeedData, loading } = useApi();
  const wide = useMediaQuery("(min-width: 960px)");
  return (
    <>
      <a className="skip-link" href="#main">{t("skip")}</a>
      <SiteHeader />
      {!loading && usingSeedData && (
        <div className="notice-strip" role="note">
          <div className="container"><b>{t("seed.notice")}</b> <span>{t("seed.noticeBody")}</span></div>
        </div>
      )}
      <main id="main"><Outlet /></main>
      <footer className="footer">
        <div className="container spread">
          <p>{t("footer.text")}</p>
          <p className="row"><Link to="/categories">{t("nav.categories")}</Link><Link to="/map">{t("nav.map")}</Link></p>
        </div>
      </footer>
      {!wide && <BottomNav />}
    </>
  );
}
