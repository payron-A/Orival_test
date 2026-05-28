import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useApp } from "../context/app-context";
import { useI18n } from "../i18n/i18n-context";
import { ContentCard } from "../components/common/ContentCard";
import { Empty } from "../components/common/PageHead";

export default function CreatorPage() {
  const { id } = useParams();
  const { getCreator, items, user } = useApi();
  const { isFollowing, toggleFollow } = useApp();
  const { t, tn } = useI18n();
  const navigate = useNavigate();
  const loc = useLocation();
  const creator = getCreator(id);
  if (!creator) return <div className="container page"><Empty title={t("creator.notFound")} action={<Link className="btn" to="/explore">{t("nav.explore")}</Link>} /></div>;
  const mine = items.filter((i) => i.creatorId === creator.id);
  const following = isFollowing(creator.id);
  return (
    <div className="container page">
      <header className="row" style={{ gap: 24, alignItems: "flex-start", marginBlockEnd: 32 }}>
        <img className="avatar" src={creator.avatarUrl} alt="" width={72} height={72} />
        <div className="stack" style={{ flex: 1, minWidth: 240 }}>
          <span className="eyebrow">{t("common.creator")}</span>
          <h1 style={{ fontSize: "var(--fs-xl)" }}>{creator.name}</h1>
          <p className="measure muted">{creator.about || t("creator.noAbout")}</p>
        </div>
        <button className={`btn ${following ? "" : "btn--primary"}`} aria-pressed={following} onClick={() => (user ? toggleFollow(creator.id) : navigate(`/signin?next=${encodeURIComponent(loc.pathname)}`))}>
          {following ? t("creator.following") : t("creator.follow")}
        </button>
      </header>
      <div className="section-head"><h2>{t("creator.content", { name: creator.name })}</h2><span className="muted">{tn("n.results", mine.length)}</span></div>
      {mine.length === 0 ? <p className="muted">{t("home.empty")}</p> : <div className="grid-cards">{mine.map((i) => <ContentCard key={`${i.kind}${i.id}`} item={i} />)}</div>}
    </div>
  );
}
