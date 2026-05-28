import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { Thumb } from "../components/common/Thumb";
import { Empty } from "../components/common/PageHead";
import { ContentCard } from "../components/common/ContentCard";
import { videoToItem, watchHref } from "../lib/catalog";

export default function VideoDetails() {
  const { id } = useParams();
  const { getVideo, getCreator, getCategory, user, isSaved, toggleSaved, videos } = useApi();
  const { t } = useI18n();
  const navigate = useNavigate();
  const loc = useLocation();
  const video = getVideo(id);
  if (!video) {
    return <div className="container page"><Empty title={t("video.notFound")} action={<Link className="btn" to="/explore">{t("nav.explore")}</Link>} /></div>;
  }
  const creator = getCreator(video.providerId);
  const category = getCategory(video.categoryId);
  const saved = isSaved("video", video.id);
  const related = videos.filter((v) => v.id !== video.id && (v.providerId === video.providerId || v.categoryId === video.categoryId)).slice(0, 4);
  const onSave = () => (user ? toggleSaved("video", video.id) : navigate(`/signin?next=${encodeURIComponent(loc.pathname)}`));

  return (
    <div className="container page">
      <p style={{ marginBlockEnd: 24 }}><button className="link" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left i-dir" aria-hidden="true" /> {t("common.back")}</button></p>
      <div className="detail">
        <div className="stack">
          {/* A still image, deliberately not styled as a player. */}
          <div className="detail__poster"><Thumb src={video.thumbnailUrl} title={video.title} kind="video" /></div>
          <div>
            <span className="eyebrow">{t("common.video")}{category ? ` · ${category.name}` : ""}</span>
            <h1>{video.title}</h1>
            {creator && <p className="muted">{t("common.by", { name: "" })}<Link className="link" to={`/creator/${creator.id}`}>{creator.name}</Link></p>}
          </div>
          <section className="stack">
            <h2 style={{ fontSize: "1.25rem" }}>{t("video.about")}</h2>
            <p className="measure">{video.description}</p>
            {!video.videoUrl && <p className="alert alert--note">{video.isDemo ? t("video.demoNote") : t("watch.noMediaTitle")}</p>}
          </section>
        </div>
        <aside className="stack" style={{ position: "sticky", top: 88 }}>
          <div className="facts">
            <dl>
              <div><dt>{t("course.format")}</dt><dd>{t("common.video")}</dd></div>
              <div><dt>{t("course.duration")}</dt><dd>{video.durationLabel}</dd></div>
            </dl>
            <Link className="btn btn--accent" to={watchHref("video", video.id)}>{user ? t("video.watch") : t("course.signInToWatch")}</Link>
            <button className="btn" aria-pressed={saved} onClick={onSave}>
              <i className={`${saved ? "fa-solid" : "fa-regular"} fa-bookmark`} aria-hidden="true" /> {saved ? t("common.unsaveItem") : t("common.saveItem")}
            </button>
            {!user && <p className="field__hint">{t("course.lockedNote")}</p>}
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>{t("video.more")}</h2></div>
          <div className="grid-cards">{related.map((v) => <ContentCard key={v.id} item={videoToItem(v)} />)}</div>
        </section>
      )}
    </div>
  );
}
