import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { PageHead } from "../components/common/PageHead";
import { exploreHref } from "../lib/search";

export default function Categories() {
  const { items, categories } = useApi();
  const { t } = useI18n();
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((i) => m.set(i.categoryId, (m.get(i.categoryId) ?? 0) + 1));
    return m;
  }, [items]);
  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <PageHead eyebrow={t("nav.categories")} title={t("categories.title")} lede={t("categories.lede")} />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] border-s border-t border-line">
        {categories.filter((c) => counts.has(c.id)).map((c) => (
          <Link key={c.id} className="group/tile flex items-center justify-between border-b border-e border-line p-6 font-display text-[1.15rem] transition-colors hover:bg-ink hover:text-white" to={exploreHref({ category: c.id })}>
            <span>{c.name}</span><small className="font-sans text-xs text-muted group-hover/tile:text-orange-200">{counts.get(c.id)}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}
