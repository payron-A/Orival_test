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
      <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {categories.filter((c) => counts.has(c.id)).map((c) => (
          <Link to={exploreHref({ category: c.id })}
                          className="flex gap-3 rounded-sm border p-4 hover:b-shadow">
                      <span  className="inline-flex h-10 items-center"
                             style={{ color: c.color }}>
                          <i className={c.icon}style={{fontSize:"23px",textShadow:`2px 2px 4px ${c.color}`}}></i>
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-ink-primary">{c.name}</div>
                        <div className="text-xs text-ink-muted">{c.courseCount} courses</div>
                      </div>
                    </Link>
        ))}
      </div>
    </div>
  );
}
