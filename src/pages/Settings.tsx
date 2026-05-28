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
    <div className="container page">
      <PageHead eyebrow={t("nav.settings")} title={t("settings.title")} />
      <div className="settings">
        <div className="side-nav" role="tablist" aria-orientation="vertical">
          {tabs.map((k) => (
            <button key={k} role="tab" aria-selected={tab === k} aria-current={tab === k ? "true" : undefined} onClick={() => { setTab(k); setSaved(false); }}>{t(`settings.${k}`)}</button>
          ))}
        </div>
        <section className="stack" style={{ maxWidth: 520 }} role="tabpanel">
          {tab === "account" && user && (
            <form className="stack" onSubmit={submit}>
              <div className="field"><label htmlFor="s-name">{t("settings.name")}</label><input id="s-name" className="input" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} aria-invalid={!name.trim()} /></div>
              <div className="field"><label htmlFor="s-loc">{t("settings.location")}</label><input id="s-loc" className="input" value={location} onChange={(e) => { setLocation(e.target.value); setSaved(false); }} /></div>
              <div className="field"><label htmlFor="s-mail">{t("settings.email")}</label><input id="s-mail" dir="ltr" className="input" value={user.email} readOnly /><span className="field__hint">{t("settings.emailNote")}</span></div>
              <div className="row"><button className="btn btn--primary" type="submit" disabled={!name.trim()}>{t("common.save")}</button>{saved && <span role="status" className="status status--approved">{t("settings.saved")}</span>}</div>
            </form>
          )}
          {tab === "language" && (
            <div className="stack">
              <p className="muted">{t("settings.languageHelp")}</p>
              <div className="segmented" role="group" aria-label={t("settings.language")} style={{ width: "fit-content" }}>
                <button type="button" lang="en" aria-pressed={lang === "en"} onClick={() => setLang("en")}>English</button>
                <button type="button" lang="ar" aria-pressed={lang === "ar"} onClick={() => setLang("ar")}>العربية</button>
              </div>
            </div>
          )}
          {tab === "about" && <p className="measure">{t("settings.aboutBody")}</p>}
        </section>
      </div>
    </div>
  );
}
