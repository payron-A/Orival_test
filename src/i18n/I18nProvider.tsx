import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nContext, type I18n, type Lang } from "./i18n-context";
import { en, type Key } from "./en";
import { ar } from "./ar";
import { loadJSON, saveJSON } from "../lib/storage";

const KEY = "orival.lang";
const dicts: Record<Lang, Record<Key, string>> = { en, ar };
const isLang = (v: unknown): v is Lang => v === "en" || v === "ar";

function initialLang(): Lang {
  const stored = loadJSON<unknown>(KEY, null);
  if (isLang(stored)) return stored;
  return typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ar") ? "ar" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    saveJSON(KEY, l);
  }, []);

  const value = useMemo<I18n>(() => {
    const fill = (s: string, vars?: Record<string, string | number>) =>
      vars ? s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)) : s;
    const t: I18n["t"] = (key, vars) => fill(dicts[lang][key] ?? en[key] ?? key, vars);
    const rules = new Intl.PluralRules(lang);
    const tn: I18n["tn"] = (base, n) => {
      const cat = rules.select(n);
      const key = `${base}.${cat}` as Key;
      return fill(dicts[lang][key] ?? dicts[lang][`${base}.other` as Key], { n: n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US") });
    };
    const date = (iso: string) => {
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(lang === "ar" ? "ar" : "en-GB", { year: "numeric", month: "long", day: "numeric" });
    };
    return { lang, dir, setLang, t, tn, date };
  }, [lang, dir, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
