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
    <article className="card">
      <div className="card__media">
        <Thumb src={item.thumbnailUrl} title={item.title} kind={item.kind} />
        <span className="card__format">{item.kind === "course" ? tn("n.lessons", item.lessonCount ?? 0) : item.durationLabel}</span>
        <button
          type="button"
          className="card__save"
          aria-pressed={saved}
          aria-label={saved ? t("common.unsaveItem") : t("common.saveItem")}
          onClick={onSave}
        >
          <i className={`${saved ? "fa-solid" : "fa-regular"} fa-bookmark`} aria-hidden="true" />
        </button>
      </div>
      <span className="card__kind">{kindLabel}</span>
      <h3 className="card__title">
        <Link className="card__link" to={item.href}>
          {item.title}
        </Link>
      </h3>
      <p className="card__meta">
        {creator && <span>{creator.name}</span>}
        {item.kind === "course" && item.durationLabel && <span>· {item.durationLabel}</span>}
      </p>
    </article>
  );
}
