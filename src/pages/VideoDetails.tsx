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
    return <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12"><Empty title={t("video.notFound")} action={<Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" to="/explore">{t("nav.explore")}</Link>} /></div>;
  }
  const creator = getCreator(video.providerId);
  const category = getCategory(video.categoryId);
  const saved = isSaved("video", video.id);
  const related = videos.filter((v) => v.id !== video.id && (v.providerId === video.providerId || v.categoryId === video.categoryId)).slice(0, 4);
  const onSave = () => (user ? toggleSaved("video", video.id) : navigate(`/signin?next=${encodeURIComponent(loc.pathname)}`));

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <p style={{ marginBlockEnd: 24 }}><button className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left rtl:-scale-x-100" aria-hidden="true" /> {t("common.back")}</button></p>
      <div className="grid items-start gap-8 min-[961px]:grid-cols-[minmax(0,1fr)_340px] min-[961px]:gap-12">
        <div className="space-y-4">
          {/* A still image, deliberately not styled as a player. */}
          <div className="relative aspect-video overflow-hidden rounded bg-ink"><Thumb src={video.thumbnailUrl} title={video.title} kind="video" /></div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-700 rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("common.video")}{category ? ` · ${category.name}` : ""}</span>
            <h1 className="mb-3 mt-2">{video.title}</h1>
            {creator && <p className="text-muted">{t("common.by", { name: "" })}<Link className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" to={`/creator/${creator.id}`}>{creator.name}</Link></p>}
          </div>
          <section className="space-y-4">
            <h2 style={{ fontSize: "1.25rem" }}>{t("video.about")}</h2>
            <p className="max-w-measure">{video.description}</p>
            {!video.videoUrl && <p className="border-s-[3px] px-4 py-3 text-sm border-ink bg-mist">{video.isDemo ? t("video.demoNote") : t("watch.noMediaTitle")}</p>}
          </section>
        </div>
        <aside className="space-y-4" style={{ position: "sticky", top: 88 }}>
          <div className="grid gap-3 rounded border border-ink p-5">
            <dl className="m-0 grid gap-3">
              <div><dt className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("course.format")}</dt><dd className="m-0 font-semibold">{t("common.video")}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("course.duration")}</dt><dd className="m-0 font-semibold">{video.durationLabel}</dd></div>
            </dl>
            <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-orange-500 bg-orange-500 text-ink hover:bg-[#fb8a3c]" to={watchHref("video", video.id)}>{user ? t("video.watch") : t("course.signInToWatch")}</Link>
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" aria-pressed={saved} onClick={onSave}>
              <i className={`${saved ? "fa-solid" : "fa-regular"} fa-bookmark`} aria-hidden="true" /> {saved ? t("common.unsaveItem") : t("common.saveItem")}
            </button>
            {!user && <p className="text-sm text-muted">{t("course.lockedNote")}</p>}
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="mt-12">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3"><h2>{t("video.more")}</h2></div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8">{related.map((v) => <ContentCard key={v.id} item={videoToItem(v)} />)}</div>
        </section>
      )}
    </div>
  );
}
