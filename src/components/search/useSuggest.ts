import { useMemo } from "react";
import { useApi } from "../../context/api-context";
import { useI18n } from "../../i18n/i18n-context";
import { exploreHref, suggest, type Suggestion } from "../../lib/search";
import { loadJSON, saveJSON } from "../../lib/storage";

export interface Row extends Omit<Suggestion, "kind"> {
  kind: Suggestion["kind"] | "all";
  /** The raw text to remember as a recent search when this row is chosen. */
  query?: string;
}

/** Rows for the autocomplete panel, generated from the real catalog. The last row is "See all results". */
export function useSuggest(q: string): Row[] {
  const { items, categories, providers } = useApi();
  const { t } = useI18n();
  return useMemo(() => {
    const trimmed = q.trim();
    if (!trimmed) return [];
    const list: Row[] = suggest(items, trimmed, { categories, creators: providers });
    list.push({ key: "all", kind: "all", label: t("search.seeAll", { q: trimmed }), href: exploreHref({ q: trimmed }), query: trimmed });
    return list;
  }, [q, items, categories, providers, t]);
}

export const RECENT_KEY = "orival.recentSearches.v1";

export function rememberSearch(q: string) {
  const v = q.trim();
  if (!v) return;
  const list = loadJSON<string[]>(RECENT_KEY, [], (x): x is string[] => Array.isArray(x));
  saveJSON(RECENT_KEY, [v, ...list.filter((x) => x !== v)].slice(0, 6));
}

