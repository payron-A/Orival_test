import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { ContentCard } from "../components/common/ContentCard";
import { Reveal } from "../components/common/Reveal";
import { Arrow } from "../components/common/PageHead";
import { exploreHref } from "../lib/search";

export default function Home() {
  const { items, user, categories, providers } = useApi();
  const { t } = useI18n();
  const newest = useMemo(() => [...items].sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1)), [items]);
  const courses = newest.filter((i) => i.kind === "course").slice(0, 4);
  const videos = newest.filter((i) => i.kind === "video").slice(0, 4);
  const feature = newest[0];
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((i) => m.set(i.categoryId, (m.get(i.categoryId) ?? 0) + 1));
    return m;
  }, [items]);
  const topics = categories.filter((c) => counts.has(c.id)).slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6">
      <section className="grid gap-8 border-b-2 border-ink pb-8 pt-12">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-700 rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("home.eyebrow")}</span>
        <div className="grid items-end gap-8 min-[821px]:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <h1 className="max-w-[16ch] text-display rtl:max-w-[20ch] rtl:leading-snug">{t("home.title")}</h1>
            <p className="max-w-[48ch] text-lg text-soft">{t("home.lede")}</p>
            <div className="flex flex-wrap items-center gap-3" style={{ paddingBlockStart: 8 }}>
              <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]" to="/explore">{t("home.cta.explore")} <Arrow /></Link>
              {!user && <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-orange-500 bg-orange-500 text-ink hover:bg-[#fb8a3c]" to="/signup">{t("home.cta.create")}</Link>}
            </div>
          </div>
          {feature && <ContentCard item={feature} />}
        </div>
      </section>

      {newest.length === 0 && <p className="text-muted" style={{ paddingBlock: 48 }}>{t("home.empty")}</p>}

      {courses.length > 0 && (
        <Reveal>
          <section className="mt-12">
            <div className="mb-5 flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
              <h2>{t("home.courses")}</h2>
              <Link className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" to={exploreHref({ format: "course" })}>{t("common.viewAll")}</Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8">{courses.map((i) => <ContentCard key={`${i.kind}${i.id}`} item={i} />)}</div>
          </section>
        </Reveal>
      )}

      {videos.length > 0 && (
        <Reveal>
          <section className="mt-12">
            <div className="mb-5 flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
              <h2>{t("home.videos")}</h2>
              <Link className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" to={exploreHref({ format: "video" })}>{t("common.viewAll")}</Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8">{videos.map((i) => <ContentCard key={`${i.kind}${i.id}`} item={i} />)}</div>
          </section>
        </Reveal>
      )}

      {topics.length > 0 && (
        <Reveal>
          <section className="mt-12">
            <div className="mb-5 flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3"><h2>{t("home.topics")}</h2><Link className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" to="/categories">{t("common.viewAll")}</Link></div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] border-s border-t border-line">
              {topics.map((c) => (
                <Link key={c.id} className="group/tile flex items-center justify-between border-b border-e border-line p-6 font-display text-[1.15rem] transition-colors hover:bg-ink hover:text-white" to={exploreHref({ category: c.id })}>
                  <span>{c.name}</span><small className="font-sans text-xs text-muted group-hover/tile:text-orange-200">{counts.get(c.id)}</small>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {providers.length > 0 && (
        <Reveal>
          <section className="mt-12">
            <div className="mb-5 flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3"><h2>{t("home.creators")}</h2></div>
            <ul className="flex flex-wrap items-center gap-3" style={{ gap: "8px 24px" }}>
              {providers.slice(0, 8).map((p) => (
                <li key={p.id}><Link className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" to={`/creator/${p.id}`}>{p.name}</Link></li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}
    </div>
  );
}
