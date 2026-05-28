import { useState } from "react";
import { MobileHeader } from "../components/layout/MobileHeader";
import { currentUser } from "../data";

const sections = [
  { key: "account", label: "Account", icon:"fa-solid fa-user"},
  { key: "notifications", label: "Notifications", icon:"fa-solid fa-bell"},
  { key: "privacy", label: "Privacy", icon:"fa-solid fa-lock"},
  { key: "payment", label: "Payment Methods", icon:"fa-solid fa-wallet"},
  { key: "appearance", label: "Appearance", icon:"fa-solid fa-appearance"},
  { key: "language", label: "Language", icon:"fa-solid fa-language"},
  { key: "help", label: "Help & Support", icon:"fa-solid fa-help"},
  { key: "about", label: "About ORIVAL", icon:"fa-solid fa-info"},
] as const;

export default function Settings() {
  const [active, setActive] = useState<(typeof sections)[number]["key"]>("account");
  const [name, setName] = useState(currentUser.name);

  return (
    <div>
      <MobileHeader back title="Settings" />
      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-8">
        <h1 className="hidden lg:block font-display text-2xl font-bold mb-5 text-ink-primary">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <nav className="hidden lg:flex flex-col gap-0.5 rounded-xl2 border border-base-border bg-base-panel p-2">
            {sections.map(({ key, label, icon}) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                  active === key ? "bg-orival/10 text-orival" : "text-ink-secondary hover:bg-base-panel2 hover:text-ink-primary"
                }`}
              >
                <i className={icon}></i>
                {label}
              </button>
            ))}
          </nav>

          <div className="lg:hidden flex flex-col gap-1">
            {sections.map(({ key, label,icon}) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ink-secondary hover:bg-base-panel2 hover:text-ink-primary transition-colors text-left"
              >
                <i className={icon}></i>
                <span className="flex-1">{label}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            ))}
          </div>

          <div className="hidden lg:block rounded-xl2 border border-base-border bg-base-panel p-6">
            {active === "account" && (
              <div className="max-w-md flex flex-col gap-4">
                <h2 className="font-display text-lg font-semibold text-ink-primary">Account Settings</h2>
                <Field label="Full Name" value={name} onChange={setName} action="Save" />
                <Field label="Email" value={currentUser.email} readOnly />
                <Field label="Password" value="••••••••••••" type="password" readOnly />
              </div>
            )}
            {active !== "account" && (
              <div className="max-w-md">
                <h2 className="font-display text-lg font-semibold capitalize mb-2 text-ink-primary">
                  {sections.find((s) => s.key === active)?.label}
                </h2>
                <p className="text-sm text-ink-secondary">
                  {placeholderCopy(active)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function placeholderCopy(key: string) {
  switch (key) {
    case "notifications":
      return "Choose which updates, offers and reminders you receive from ORIVAL and your followed providers.";
    case "privacy":
      return "Control who can see your profile, learning activity, and reviews.";
    case "payment":
      return "Manage the cards and payment methods used for enrollments.";
    case "appearance":
      return "ORIVAL uses a dark interface by default, tuned for long study sessions.";
    case "language":
      return "Choose your preferred language and currency for prices across the app.";
    case "help":
      return "Browse help articles or contact the ORIVAL support team.";
    case "about":
      return "ORIVAL helps you discover what to learn, where to learn it, and who teaches it.";
    default:
      return "";
  }
}

function Field({
  label,
  value,
  onChange,
  action,
  readOnly,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  action?: string;
  readOnly?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 rounded-lg border border-base-border bg-base-panel2 px-3 py-2 text-sm outline-none focus:border-orival/50 text-ink-muted"
        />
        {action && (
          <button className="rounded-lg border border-base-border px-3 py-2 text-xs font-medium text-ink-secondary hover:text-ink-primary hover:border-base-border2">
            {action}
          </button>
        )}
      </div>
    </label>
  );
}
