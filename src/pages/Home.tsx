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
    <div className="container">
      <section className="hero">
        <span className="eyebrow">{t("home.eyebrow")}</span>
        <div className="hero__feature">
          <div className="stack">
            <h1>{t("home.title")}</h1>
            <p className="lede">{t("home.lede")}</p>
            <div className="row" style={{ paddingBlockStart: 8 }}>
              <Link className="btn btn--primary" to="/explore">{t("home.cta.explore")} <Arrow /></Link>
              {!user && <Link className="btn btn--accent" to="/signup">{t("home.cta.create")}</Link>}
            </div>
          </div>
          {feature && <ContentCard item={feature} />}
        </div>
      </section>

      {newest.length === 0 && <p className="muted" style={{ paddingBlock: 48 }}>{t("home.empty")}</p>}

      {courses.length > 0 && (
        <Reveal>
          <section className="section">
            <div className="section-head">
              <h2>{t("home.courses")}</h2>
              <Link className="link" to={exploreHref({ format: "course" })}>{t("common.viewAll")}</Link>
            </div>
            <div className="grid-cards">{courses.map((i) => <ContentCard key={`${i.kind}${i.id}`} item={i} />)}</div>
          </section>
        </Reveal>
      )}

      {videos.length > 0 && (
        <Reveal>
          <section className="section">
            <div className="section-head">
              <h2>{t("home.videos")}</h2>
              <Link className="link" to={exploreHref({ format: "video" })}>{t("common.viewAll")}</Link>
            </div>
            <div className="grid-cards">{videos.map((i) => <ContentCard key={`${i.kind}${i.id}`} item={i} />)}</div>
          </section>
        </Reveal>
      )}

      {topics.length > 0 && (
        <Reveal>
          <section className="section">
            <div className="section-head"><h2>{t("home.topics")}</h2><Link className="link" to="/categories">{t("common.viewAll")}</Link></div>
            <div className="cat-grid">
              {topics.map((c) => (
                <Link key={c.id} className="cat-tile" to={exploreHref({ category: c.id })}>
                  <span>{c.name}</span><small>{counts.get(c.id)}</small>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {providers.length > 0 && (
        <Reveal>
          <section className="section">
            <div className="section-head"><h2>{t("home.creators")}</h2></div>
            <ul className="row" style={{ gap: "8px 24px" }}>
              {providers.slice(0, 8).map((p) => (
                <li key={p.id}><Link className="link" to={`/creator/${p.id}`}>{p.name}</Link></li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}
    </div>
  );
}
