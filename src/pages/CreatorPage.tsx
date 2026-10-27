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
  if (!creator) return <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12"><Empty title={t("creator.notFound")} action={<Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" to="/explore">{t("nav.explore")}</Link>} /></div>;
  const mine = items.filter((i) => i.creatorId === creator.id);
  const following = isFollowing(creator.id);
  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <header className="flex flex-wrap items-center gap-3" style={{ gap: 24, alignItems: "flex-start", marginBlockEnd: 32 }}>
        <img className="size-[72px]" src={creator.avatarUrl} alt="" width={72} height={72} />
        <div className="space-y-4" style={{ flex: 1, minWidth: 240 }}>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-700 rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("common.creator")}</span>
          <h1 className="text-headline">{creator.name}</h1>
          <p className="max-w-measure text-muted">{creator.about || t("creator.noAbout")}</p>
        </div>
        <button className={following ? "inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" : "inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]"} aria-pressed={following} onClick={() => (user ? toggleFollow(creator.id) : navigate(`/signin?next=${encodeURIComponent(loc.pathname)}`))}>
          {following ? t("creator.following") : t("creator.follow")}
        </button>
      </header>
      <div className="mb-5 flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3"><h2>{t("creator.content", { name: creator.name })}</h2><span className="text-muted">{tn("n.results", mine.length)}</span></div>
      {mine.length === 0 ? <p className="text-muted">{t("home.empty")}</p> : <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-8">{mine.map((i) => <ContentCard key={`${i.kind}${i.id}`} item={i} />)}</div>}
    </div>
  );
}
