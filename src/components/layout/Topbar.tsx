import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useApi } from "../../context/ApiContext";
export function Topbar() {
  const navigate = useNavigate();
  const { unreadNotificationCount } = useApp();
  const { user } = useApi();
  const [q, setQ] = useState("");

  return (
    <header className="hidden lg:flex sticky top-0 z-50 items-center gap-4 border-b 
        border-base-border bg-base-bg/90 backdrop-blur px-8 py-3.5">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
        }}
        className="flex max-w-md flex-1 items-center gap-2.5 rounded-xl2 border 
          border-base-border bg-base-panel px-3.5 py-2 focus-within:border-orival/50 transition-colors">
        <label htmlFor="search">
          <i className="fa-solid fa-search text-ink-muted"></i>
        </label>
        <input
          id="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search skills, courses, providers..."
          className="w-full bg-transparent text-ink-primary outline-none placeholder:text-ink-muted"/>
      </form>
      
      <div className="ml-auto flex items-center gap-3">
        <button
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border 
              border-base-border bg-base-panel text-ink-secondary hover:text-ink-primary transition-colors">
          <i className="fa-solid fa-bell"></i>
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full 
                    bg-orival text-[10px] font-bold text-black">
              {unreadNotificationCount}
            </span>
          )}
        </button>
        <button
            onClick={() => user? navigate("/profile") : navigate("/login")}
            className="flex items-center gap-2 rounded-full border border-base-border bg-base-panel py-1 pl-1 pr-2.5 hover:border-base-border2 transition-colors">
          <img src={user?user.avatarUrl : "/orival.png"} alt="" className="h-7 w-7 rounded-full object-cover" />
          <span className="text-sm font-medium text-ink-primary">{user?user.name : "P-1"}</span>
        </button>
      </div>

    </header>
  );
}
