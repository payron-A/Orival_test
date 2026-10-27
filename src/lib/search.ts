import type { CatalogItem, ContentKind } from "../types/content";
import type { Category } from "../types/category";
import type { Provider } from "../types/provider";
import { norm } from "./text";

export type FormatFilter = "all" | ContentKind;
export type SortKey = "relevance" | "newest" | "title";

export interface ExploreFilters {
  q: string;
  format: FormatFilter;
  category: string;
  creator: string;
  sort: SortKey;
}

export interface Suggestion {
  key: string;
  kind: "course" | "video" | "category" | "creator";
  label: string;
  sub?: string;
  href: string;
}

export function exploreHref(f: Partial<ExploreFilters>): string {
  const p = new URLSearchParams();
  if (f.q?.trim()) p.set("q", f.q.trim());
  if (f.format && f.format !== "all") p.set("format", f.format);
  if (f.category) p.set("category", f.category);
  if (f.creator) p.set("creator", f.creator);
  if (f.sort && f.sort !== "relevance") p.set("sort", f.sort);
  const qs = p.toString();
  return qs ? `/explore?${qs}` : "/explore";
}

interface Lookups {
  categories: Category[];
  creators: Provider[];
}

function haystack(item: CatalogItem, { categories, creators }: Lookups): string {
  const cat = categories.find((c) => c.id === item.categoryId)?.name ?? "";
  const creator = creators.find((c) => c.id === item.creatorId)?.name ?? "";
  return norm([item.title, item.description, item.tags.join(" "), cat, creator].join(" "));
}

function titleScore(title: string, tokens: string[]): number {
  const t = norm(title);
  let score = 0;
  for (const tok of tokens) {
    if (t.startsWith(tok)) score += 4;
    else if (t.split(/[\s\-_:]+/).some((w) => w.startsWith(tok))) score += 3;
    else if (t.includes(tok)) score += 2;
  }
  return score;
}

export function filterItems(items: CatalogItem[], f: ExploreFilters, lookups: Lookups): CatalogItem[] {
  const tokens = norm(f.q).split(/\s+/).filter(Boolean);
  let out = items.filter((it) => {
    if (f.format !== "all" && it.kind !== f.format) return false;
    if (f.category && it.categoryId !== f.category) return false;
    if (f.creator && it.creatorId !== f.creator) return false;
    if (tokens.length) {
      const h = haystack(it, lookups);
      if (!tokens.every((t) => h.includes(t))) return false;
    }
    return true;
  });
  // A multi-word query that matches a title as a phrase (e.g. a chosen suggestion) wins over loose word matching.
  if (tokens.length > 1) {
    const phrase = tokens.join(" ");
    const exact = out.filter((it) => norm(it.title).includes(phrase));
    if (exact.length) out = exact;
  }
  if (f.sort === "title") out = [...out].sort((a, b) => a.title.localeCompare(b.title));
  else if (f.sort === "newest" || !tokens.length) out = [...out].sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));
  else out = [...out].sort((a, b) => titleScore(b.title, tokens) - titleScore(a.title, tokens));
  return out;
}

/** Autocomplete entries generated only from real catalog data. */
export function suggest(items: CatalogItem[], q: string, lookups: Lookups, limit = 6): Suggestion[] {
  const tokens = norm(q).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const titles = items
    .map((it) => ({ it, s: titleScore(it.title, tokens), all: tokens.every((t) => haystack(it, lookups).includes(t)) }))
    .filter((x) => x.all)
    .sort((a, b) => b.s - a.s || (a.it.addedAt < b.it.addedAt ? 1 : -1))
    .slice(0, limit)
    .map<Suggestion>(({ it }) => ({
      key: `${it.kind}:${it.id}`,
      kind: it.kind,
      label: it.title,
      sub: it.kind,
      href: exploreHref({ q: it.title }),
    }));
  const cats = lookups.categories
    .filter((c) => tokens.every((t) => norm(c.name).includes(t)))
    .slice(0, 2)
    .map<Suggestion>((c) => ({ key: `cat:${c.id}`, kind: "category", label: c.name, href: exploreHref({ category: c.id }) }));
  const creators = lookups.creators
    .filter((c) => tokens.every((t) => norm(c.name).includes(t)))
    .slice(0, 2)
    .map<Suggestion>((c) => ({ key: `cr:${c.id}`, kind: "creator", label: c.name, href: exploreHref({ creator: c.id }) }));
  return [...titles, ...cats, ...creators];
}

/** Splits a label into highlighted / plain runs for the current query (accent-insensitive). */
export function highlightParts(label: string, q: string): { text: string; hit: boolean }[] {
  const tokens = norm(q).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [{ text: label, hit: false }];
  const flags = new Array<boolean>(label.length).fill(false);
  const lower = norm(label);
  if (lower.length === label.length) {
    for (const tok of tokens) {
      let i = lower.indexOf(tok);
      while (i !== -1) {
        for (let k = i; k < i + tok.length; k++) flags[k] = true;
        i = lower.indexOf(tok, i + 1);
      }
    }
  }
  const parts: { text: string; hit: boolean }[] = [];
  for (let i = 0; i < label.length; i++) {
    const last = parts[parts.length - 1];
    if (last && last.hit === flags[i]) last.text += label[i];
    else parts.push({ text: label[i], hit: flags[i] });
  }
  return parts;
}
