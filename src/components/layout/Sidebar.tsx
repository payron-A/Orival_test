import { NavLink } from "react-router-dom";
import { providers } from "../../data";
import { useApp } from "../../context/AppContext";

const discoverLinks = [
  { to: "/", label: "Home", end: true, icon: "fa-solid fa-home" },
  { to: "/explore", label: "Explore", icon:"fa-solid fa-search" },
  { to: "/map", label: "Map", icon:"fa-solid fa-map" },
  { to: "/categories", label: "Categories", icon:"fa-solid fa-tasks" },
];

const libraryLinks = [
  { to: "/saved", label: "Saved", icon: "fa-solid fa-bookmark" },
  { to: "/history", label: "History", icon: "fa-solid fa-history"},
  { to: "/my-learning", label: "My Learning", icon: "fa-solid fa-book" },
  { to: "/enrollments", label: "My Enrollments", icon: "fa-solid fa-circle" },
];

const accountLinks = [
  { to: "/profile", label: "Profile", icon: "fa-solid fa-user"},
  { to: "/settings", label: "Settings", icon: "fa-solid fa-edit" },
];

function NavSection({ title, links }: { title: string; links: typeof discoverLinks }) {
  return (
    <div className="flex flex-col gap-0.5">
        <div className="px-3 pb-1.5 pt-4 text-[11px] font-semibold tracking-wide text-ink-muted">{title}</div>
        {links.map(({ to, label, end,icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors 
                ${isActive? "bg-orival/10 text-orival"
                          : "text-ink-secondary hover:bg-base-panel2 hover:text-ink-primary"}`}>
            <i className={icon}></i>
            {label}
          </NavLink>
        ))}
    </div>
  );
}

export function Sidebar() {
  const { followedProviderIds } = useApp();
  const followed = providers.filter((p) => followedProviderIds.has(p.id));

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-base-border bg-base-bg h-screen 
            sticky top-0">
        <div className="flex items-center px-5 py-5">
          <img src="orival.png" alt="O" className="w-8"/>
          <span className="font-display text-lg text-ink-primary font-bold tracking-tight">RIVAL</span>
        </div>
        <nav className="flex-1 overflow-y-auto scroll-thin px-3 pb-4">
            <NavSection title="DISCOVER" links={discoverLinks}/>
            <NavSection title="LIBRARY" links={libraryLinks} />
            <div className="flex flex-col gap-0.5">
              <div className="px-3 pb-1.5 pt-4 text-[11px] font-semibold tracking-wide text-ink-muted">
                FOLLOWING
              </div>
              {followed.length === 0 && (
                <p className="px-3 text-xs text-ink-muted">Providers you follow appear here.</p>
              )}
              {followed.map((p) => (
                <NavLink
                    key={p.id}
                    to={`/provider/${p.id}`}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-secondary 
                      hover:bg-base-panel2 hover:text-ink-primary transition-colors">
                  <img src={p.avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                  <span className="line-clamp-1 flex-1">{p.name}</span>
                  {p.verified && <i className="fa-solid.fa-home"/>}
                </NavLink>
              ))}
            </div>
            <NavSection title="ACCOUNT" links={accountLinks} />
        </nav>
        <div className="p-3">
            <div className="flex flex-col gap-2 rounded-xl2 border border-orival/25 bg-gradient-to-br 
                  from-orival/15 to-transparent p-3.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orival/15 text-orival">
                  <i className="fa-regular fa-star"></i>
                </span>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Unlock unlimited enrollments and offline lessons.
                </p>
                <button className="rounded-lg bg-orival py-1.5 text-xs font-semibold text-black 
                          hover:bg-orival-bright transition-colors">
                  Upgrade to Pro
                </button>
            </div>
        </div>
    </aside>
  );
}
