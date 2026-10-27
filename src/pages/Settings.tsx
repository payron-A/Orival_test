import { useState, type FormEvent } from "react";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { PageHead } from "../components/common/PageHead";

type Tab = "account" | "language" | "about";

export default function Settings() {
  const { user, updateProfile } = useApi();
  const { t, lang, setLang } = useI18n();
  const [tab, setTab] = useState<Tab>(user ? "account" : "language");
  const [name, setName] = useState(user?.name ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [saved, setSaved] = useState(false);
  const tabs: Tab[] = user ? ["account", "language", "about"] : ["language", "about"];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({ name: name.trim(), location: location.trim() });
    setSaved(true);
  };

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <PageHead eyebrow={t("nav.settings")} title={t("settings.title")} />
      <div className="grid gap-5 min-[821px]:grid-cols-[220px_1fr] min-[821px]:gap-12">
        <div className="grid content-start gap-0.5 max-[820px]:flex max-[820px]:overflow-x-auto" role="tablist" aria-orientation="vertical">
          {tabs.map((k) => (
            <button key={k} role="tab" className="border-0 border-s-2 border-line bg-transparent px-4 py-3 text-start text-sm font-medium text-soft aria-[current=true]:border-orange-500 aria-[current=true]:font-bold aria-[current=true]:text-ink max-[820px]:whitespace-nowrap max-[820px]:border-s-0 max-[820px]:border-b-2 max-[820px]:aria-[current=true]:border-b-orange-500" aria-selected={tab === k} aria-current={tab === k ? "true" : undefined} onClick={() => { setTab(k); setSaved(false); }}>{t(`settings.${k}`)}</button>
          ))}
        </div>
        <section className="space-y-4" style={{ maxWidth: 520 }} role="tabpanel">
          {tab === "account" && user && (
            <form className="space-y-4" onSubmit={submit}>
              <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="s-name">{t("settings.name")}</label><input id="s-name" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} aria-invalid={!name.trim()} /></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="s-loc">{t("settings.location")}</label><input id="s-loc" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={location} onChange={(e) => { setLocation(e.target.value); setSaved(false); }} /></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="s-mail">{t("settings.email")}</label><input id="s-mail" dir="ltr" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={user.email} readOnly /><span className="text-sm text-muted">{t("settings.emailNote")}</span></div>
              <div className="flex flex-wrap items-center gap-3"><button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]" type="submit" disabled={!name.trim()}>{t("common.save")}</button>{saved && <span role="status" className="inline-flex items-center gap-2 text-sm font-bold before:size-[9px] before:rounded-full before:content-[''] before:bg-ok">{t("settings.saved")}</span>}</div>
            </form>
          )}
          {tab === "language" && (
            <div className="space-y-4">
              <p className="text-muted">{t("settings.languageHelp")}</p>
              <div className="inline-flex overflow-hidden rounded border border-ink" role="group" aria-label={t("settings.language")} style={{ width: "fit-content" }}>
                <button type="button" className="min-h-9 border-0 border-e border-ink bg-white px-4 text-sm last:border-e-0 aria-pressed:bg-ink aria-pressed:text-white" lang="en" aria-pressed={lang === "en"} onClick={() => setLang("en")}>English</button>
                <button type="button" className="min-h-9 border-0 border-e border-ink bg-white px-4 text-sm last:border-e-0 aria-pressed:bg-ink aria-pressed:text-white" lang="ar" aria-pressed={lang === "ar"} onClick={() => setLang("ar")}>العربية</button>
              </div>
            </div>
          )}
          {tab === "about" && <p className="max-w-measure">{t("settings.aboutBody")}</p>}
        </section>
      </div>
    </div>
  );
}
