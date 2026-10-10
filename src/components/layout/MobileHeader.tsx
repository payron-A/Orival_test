import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useApp } from "../../context/AppContext";

export function MobileHeader({
  title,
  back,
  right,
  showBell,
}: {
  title?: string;
  back?: boolean;
  right?: ReactNode;
  showBell?: boolean;
}) {
  const navigate = useNavigate();
  const { unreadNotificationCount } = useApp();

  return (
    <div className={`lg:hidden sticky top-0 z-50 flex items-center gap-3 border-b 
            border-base-border bg-base-bg/95 backdrop-blur px-4 ${back?"py-3":"py-1"} `}>
      {back ? (
        <button onClick={() => navigate(-1)} aria-label="Back" className="text-ink-primary">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
      ) : (
        <Link to="/">
          <img src="orival.png" alt="O" className="w-8"/>
        </Link>
      )}
      {title && <h1 className="flex-1 truncate font-display text-base font-semibold text-ink-primary">
                  {title}
                </h1>
      }
      {!title && <div className="flex-1" />}
      {right}
      {showBell && (
        <button onClick={() => navigate("/notifications")} 
                className="relative text-ink-primary">
            <i className="fa-solid fa-bell"></i>
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center 
                      rounded-full bg-orival text-[9px] font-bold text-black">
                {unreadNotificationCount}
              </span>
            )}
        </button>
      )}
    </div>
  );
}
