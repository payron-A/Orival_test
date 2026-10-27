import { Link, useLocation, useNavigate } from "react-router-dom";
import type { CatalogItem } from "../../types/content";
import { useApi } from "../../context/api-context";
import { useI18n } from "../../i18n/i18n-context";
import { Thumb } from "./Thumb";

export function ContentCard({ item }: { item: CatalogItem }) {
  const { getCreator, isSaved, toggleSaved, user } = useApi();
  const { t, tn } = useI18n();
  const navigate = useNavigate();
  const loc = useLocation();
  const creator = getCreator(item.creatorId);
  const saved = isSaved(item.kind, item.id);
  const kindLabel = item.kind === "course" ? t("common.course") : t("common.video");

  const onSave = () => {
    if (!user) return navigate(`/signin?next=${encodeURIComponent(loc.pathname + loc.search)}`);
    toggleSaved(item.kind, item.id);
  };

  return (
    <article className="group relative flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded bg-mist">
        <Thumb src={item.thumbnailUrl} title={item.title} kind={item.kind} />
        <span className="absolute bottom-2 start-2 z-[2] rounded-sm bg-ink px-2 py-0.5 text-xs font-semibold text-white">{item.kind === "course" ? tn("n.lessons", item.lessonCount ?? 0) : item.durationLabel}</span>
        <button
          type="button"
          className="absolute end-2 top-2 z-[2] grid size-9 place-items-center rounded bg-white/90 text-ink transition-colors hover:bg-white aria-pressed:bg-orange-500"
          aria-pressed={saved}
          aria-label={saved ? t("common.unsaveItem") : t("common.saveItem")}
          onClick={onSave}
        >
          <i className={`${saved ? "fa-solid" : "fa-regular"} fa-bookmark`} aria-hidden="true" />
        </button>
      </div>
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-700 rtl:text-sm rtl:normal-case rtl:tracking-normal">{kindLabel}</span>
      <h3 className="line-clamp-2 min-h-[2.5em] font-display text-[1.15rem] leading-tight transition-[background-size] duration-300 [background-image:linear-gradient(currentColor,currentColor)] [background-position:0_100%] [background-repeat:no-repeat] [background-size:0_1px] group-hover:[background-size:100%_1px] rtl:min-h-[3em] rtl:leading-normal rtl:[background-position:100%_100%]">
        <Link className="after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-orange-500" to={item.href}>
          {item.title}
        </Link>
      </h3>
      <p className="flex flex-wrap gap-2 text-sm text-muted">
        {creator && <span>{creator.name}</span>}
        {item.kind === "course" && item.durationLabel && <span>· {item.durationLabel}</span>}
      </p>
    </article>
  );
}
