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
    <div className="container page">
      <PageHead eyebrow={t("nav.categories")} title={t("categories.title")} lede={t("categories.lede")} />
      <div className="cat-grid">
        {categories.filter((c) => counts.has(c.id)).map((c) => (
          <Link key={c.id} className="cat-tile" to={exploreHref({ category: c.id })}>
            <span>{c.name}</span><small>{counts.get(c.id)}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}
