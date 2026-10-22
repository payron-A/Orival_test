import { NavLink } from 'react-router-dom';
import { useApi } from '../../context/ApiContext';
const items = [
  { to: "/", label: "Home", end: true, icon:"fa-solid fa-home"},
  { to: "/explore", label: "Explore", icon:"fa-solid fa-search" },
  { to: "/map", label: "Map", icon:"fa-solid fa-map"},
  { to: "/saved", label: "Saved", icon:"fa-solid fa-bookmark"},
];

export function MobileBottomNav() {
  const {user} = useApi();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-base-border bg-base-bg/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-between px-1">
        {items.map(({ to, end ,icon}) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? "text-orival animate-viber" : "text-ink-muted"
              }`
            }
          >
            <i className={`${icon} text-lg`}></i>
          </NavLink>
        ))}
        <NavLink
            key={"/profile"}
            to={user?"profile":"/login"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? "text-orival animate-viber" : "text-ink-muted"
              }`
            }
          >
            <i className="fa-solid fa-user text-lg"></i>
          </NavLink>
      </div>
    </nav>
  );
}
