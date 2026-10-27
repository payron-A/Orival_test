import { createContext, useContext } from "react";
import type { Key } from "./en";

export type Lang = "en" | "ar";
export interface I18n {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
  /** Plural-aware: looks up `${base}.${zero|one|two|few|many|other}` for the active language. */
  tn: (base: "n.lessons" | "n.results", n: number) => string;
  date: (iso: string) => string;
}
export const I18nContext = createContext<I18n | null>(null);
export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
