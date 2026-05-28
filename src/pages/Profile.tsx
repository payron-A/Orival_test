import { Link, useNavigate } from "react-router-dom";
import { currentUser } from "../data";
import { useApp } from "../context/AppContext";
import { MobileHeader } from "../components/layout/MobileHeader";

const menu = [
  { to: "/dashboard", label: "Dashboard", icon: "fa-solid fa-dashboard"},
  { to: "/enrollments", label: "My Enrollments", icon:"fa-solid fa-circle-dot"},
  { to: "/saved", label: "Saved", icon:"fa-solid fa-bookmark" },
  { to: "/history", label: "History", icon:"fa-solid fa-history"},
  { to: "/notifications", label: "Notifications" ,icon:"fa-solid fa-bell"},
  { to: "/settings", label: "Settings",icon:"fa-solid fa-gear"},
];

export default function Profile() {
  const navigate = useNavigate();
  const { enrollments } = useApp();
  const list = Object.values(enrollments);
  const completed = list.filter((e) => e.status === "completed").length;

  return (
    <div>
      <MobileHeader title="Profile" />
      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-8">
        <div className="flex flex-col items-center text-center gap-2 lg:flex-row lg:text-left lg:items-center lg:gap-4">
          <img src={currentUser.avatarUrl} className="h-20 w-20 rounded-full object-cover" alt="" />
          <div>
            <h1 className="font-display text-xl font-bold text-ink-primary">{currentUser.name}</h1>
            <p className="text-sm text-ink-muted">{currentUser.handle}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
          <Stat label="Enrollments" value={list.length} />
          <Stat label="Completed" value={completed} />
          <Stat label="Certificates" value={completed} />
        </div>

        <div className="mt-6 max-w-md mx-auto lg:mx-0 rounded-xl2 border border-base-border bg-base-panel p-4">
          <h2 className="text-sm font-semibold text-ink-primary mb-1.5">About me</h2>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Passionate about learning new skills and sharing knowledge.
          </p>
          <div className="mt-3 flex justify-between text-xs text-ink-muted">
            <span>Location: {currentUser.location}</span>
            <span>Joined {currentUser.joined}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1 max-w-md mx-auto lg:mx-0">
          {menu.map(({ to, label,icon}) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ink-secondary hover:bg-base-panel2 hover:text-ink-primary transition-colors"
            >
              <i className={icon}></i>
              <span className="flex-1">{label}</span>
              <i className="fa-solid fa-chevron-right"></i>
            </Link>
          ))}
          <button
            onClick={() => navigate("/")}
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl2 border border-base-border bg-base-panel py-3">
      <span className="font-display text-lg font-bold text-ink-primary">{value}</span>
      <span className="text-[11px] text-ink-muted">{label}</span>
    </div>
  );
}
