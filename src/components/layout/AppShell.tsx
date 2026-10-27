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
      <button className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-ink transition-colors hover:bg-mist disabled:opacity-40" aria-haspopup="menu" aria-expanded={open} aria-label={t("nav.account")} onClick={() => setOpen((o) => !o)}>
        <img src={user.avatarUrl} alt="" className="size-10" width={32} height={32} style={{ width: 32, height: 32 }} />
      </button>
      {open && (
        <div className="absolute end-0 top-[calc(100%+6px)] z-[90] min-w-[220px] animate-pop border border-ink bg-white shadow-float" role="menu" onClick={() => setOpen(false)}>
          <div className="px-4 py-3 text-sm [&>strong]:block">
            <strong>{user.name}</strong>
            <span className="text-muted">{isCreator ? t("common.creator") : t("common.member")}</span>
          </div>
          <hr className="border-line" />
          <Link role="menuitem" className="flex w-full items-center gap-3 bg-transparent px-4 py-3 text-start text-sm hover:bg-mist" to="/profile">{t("nav.profile")}</Link>
          <Link role="menuitem" className="flex w-full items-center gap-3 bg-transparent px-4 py-3 text-start text-sm hover:bg-mist" to="/dashboard">{t("nav.dashboard")}</Link>
          <Link role="menuitem" className="flex w-full items-center gap-3 bg-transparent px-4 py-3 text-start text-sm hover:bg-mist" to="/library">{t("nav.library")}</Link>
          <Link role="menuitem" className="flex w-full items-center gap-3 bg-transparent px-4 py-3 text-start text-sm hover:bg-mist" to="/settings">{t("nav.settings")}</Link>
          <hr className="border-line" />
          <button role="menuitem" className="flex w-full items-center gap-3 bg-transparent px-4 py-3 text-start text-sm hover:bg-mist" onClick={signOut}>{t("nav.signOut")}</button>
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
    <header className="sticky top-0 z-[60] border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 flex h-16 items-center gap-6">
        <Link to="/" className="inline-flex items-baseline gap-0.5 font-display text-[1.6rem] font-bold tracking-[-0.03em] after:ms-0.5 after:inline-block after:size-[7px] after:bg-orange-500 after:content-['']" aria-label="Orival">Orival</Link>
        {wide && (
          <nav className="flex gap-6" aria-label={t("nav.primary")}>
            <NavLink className="relative py-2 text-sm font-medium text-soft transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-orange-500 aria-[current=page]:after:content-['']" to="/explore">{t("nav.explore")}</NavLink>
            <NavLink className="relative py-2 text-sm font-medium text-soft transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-orange-500 aria-[current=page]:after:content-['']" to="/categories">{t("nav.categories")}</NavLink>
            {user && <NavLink className="relative py-2 text-sm font-medium text-soft transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-orange-500 aria-[current=page]:after:content-['']" to="/library">{t("nav.library")}</NavLink>}
            {user && isCreator && <NavLink className="relative py-2 text-sm font-medium text-soft transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-orange-500 aria-[current=page]:after:content-['']" to="/studio">{t("nav.studio")}</NavLink>}
            {user && !isCreator && <NavLink className="relative py-2 text-sm font-medium text-soft transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-orange-500 aria-[current=page]:after:content-['']" to="/become-creator">{t("nav.becomeCreator")}</NavLink>}
          </nav>
        )}
        {wide ? <HeaderSearch /> : null}
        <div className="ms-auto flex items-center gap-2">
          {!wide && (
            <Link to="/search" className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-ink transition-colors hover:bg-mist disabled:opacity-40" aria-label={t("search.open")}>
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            </Link>
          )}
          <button className="h-10 rounded border border-line bg-transparent px-3 text-sm font-semibold hover:border-ink" lang={lang === "en" ? "ar" : "en"} aria-label={t("nav.languageLabel")} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
            {t("nav.language")}
          </button>
          {user && (
            <Link to="/notifications" className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-ink transition-colors hover:bg-mist disabled:opacity-40" aria-label={t("nav.notifications")}>
              <i className="fa-regular fa-bell" aria-hidden="true" />
              {unreadCount > 0 && <span className="absolute end-2 top-2 size-2 rounded-full bg-orange-500" />}
            </Link>
          )}
          {user ? (
            <UserMenu />
          ) : (
            <>
              {wide && <Link className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-transparent bg-transparent text-ink hover:bg-mist" to="/signin">{t("nav.signIn")}</Link>}
              <Link className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]" to={wide ? "/signup" : "/signin"}>
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
    <nav className="fixed inset-x-0 bottom-0 z-[70] grid auto-cols-fr grid-flow-col border-t border-ink bg-white pb-[env(safe-area-inset-bottom)]" aria-label={t("nav.mobile")}>
      <NavLink className="relative grid justify-items-center gap-0.5 py-2 text-[11px] font-semibold text-muted aria-[current=page]:text-ink aria-[current=page]:before:absolute aria-[current=page]:before:inset-x-[30%] aria-[current=page]:before:-top-px aria-[current=page]:before:h-[3px] aria-[current=page]:before:bg-orange-500 aria-[current=page]:before:content-['']" to="/" end><i className="fa-solid fa-house" aria-hidden="true" />{t("nav.home")}</NavLink>
      <NavLink className="relative grid justify-items-center gap-0.5 py-2 text-[11px] font-semibold text-muted aria-[current=page]:text-ink aria-[current=page]:before:absolute aria-[current=page]:before:inset-x-[30%] aria-[current=page]:before:-top-px aria-[current=page]:before:h-[3px] aria-[current=page]:before:bg-orange-500 aria-[current=page]:before:content-['']" to="/explore"><i className="fa-regular fa-compass" aria-hidden="true" />{t("nav.explore")}</NavLink>
      <NavLink className="relative grid justify-items-center gap-0.5 py-2 text-[11px] font-semibold text-muted aria-[current=page]:text-ink aria-[current=page]:before:absolute aria-[current=page]:before:inset-x-[30%] aria-[current=page]:before:-top-px aria-[current=page]:before:h-[3px] aria-[current=page]:before:bg-orange-500 aria-[current=page]:before:content-['']" to="/library"><i className="fa-regular fa-bookmark" aria-hidden="true" />{t("nav.library")}</NavLink>
      {user && isCreator && <NavLink className="relative grid justify-items-center gap-0.5 py-2 text-[11px] font-semibold text-muted aria-[current=page]:text-ink aria-[current=page]:before:absolute aria-[current=page]:before:inset-x-[30%] aria-[current=page]:before:-top-px aria-[current=page]:before:h-[3px] aria-[current=page]:before:bg-orange-500 aria-[current=page]:before:content-['']" to="/studio"><i className="fa-solid fa-clapperboard" aria-hidden="true" />{t("nav.studio")}</NavLink>}
      <NavLink className="relative grid justify-items-center gap-0.5 py-2 text-[11px] font-semibold text-muted aria-[current=page]:text-ink aria-[current=page]:before:absolute aria-[current=page]:before:inset-x-[30%] aria-[current=page]:before:-top-px aria-[current=page]:before:h-[3px] aria-[current=page]:before:bg-orange-500 aria-[current=page]:before:content-['']" to={user ? "/profile" : "/signin"}><i className="fa-regular fa-user" aria-hidden="true" />{user ? t("nav.account") : t("nav.signIn")}</NavLink>
    </nav>
  );
}

export function AppShell() {
  const { t } = useI18n();
  const { usingSeedData, loading } = useApi();
  const wide = useMediaQuery("(min-width: 960px)");
  return (
    <>
      <a className="absolute -top-14 start-4 z-[200] bg-ink px-4 py-2 text-white focus:top-2" href="#main">{t("skip")}</a>
      <SiteHeader />
      {!loading && usingSeedData && (
        <div className="bg-ink text-sm text-white" role="note">
          <div className="mx-auto w-full max-w-page px-4 sm:px-6 flex items-center gap-3 py-2"><b className="text-orange-500">{t("seed.notice")}</b> <span>{t("seed.noticeBody")}</span></div>
        </div>
      )}
      <main id="main"><Outlet /></main>
      <footer className="border-t-2 border-ink py-6 text-sm text-muted">
        <div className="mx-auto w-full max-w-page px-4 sm:px-6 flex items-center justify-between gap-4">
          <p>{t("footer.text")}</p>
          <p className="flex flex-wrap items-center gap-3"><Link to="/categories">{t("nav.categories")}</Link><Link to="/map">{t("nav.map")}</Link></p>
        </div>
      </footer>
      {!wide && <BottomNav />}
    </>
  );
}
