import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { Thumb } from "../components/common/Thumb";
import { Empty } from "../components/common/PageHead";
import { watchHref } from "../lib/catalog";

export default function CourseDetails() {
  const { id } = useParams();
  const { getCourse, getCreator, getCategory, user, isSaved, toggleSaved } = useApi();
  const { t, tn } = useI18n();
  const navigate = useNavigate();
  const loc = useLocation();
  const course = getCourse(id);

  if (!course) {
    return <div className="container page"><Empty title={t("course.notFound")} action={<Link className="btn" to="/explore">{t("nav.explore")}</Link>} /></div>;
  }
  const creator = getCreator(course.providerId);
  const category = getCategory(course.categoryId);
  const flat = course.sections.flatMap((s) => s.lessons);
  const saved = isSaved("course", course.id);
  const first = flat[0];

  const onSave = () => (user ? toggleSaved("course", course.id) : navigate(`/signin?next=${encodeURIComponent(loc.pathname)}`));
  const starts = course.sections.map((_, i) => course.sections.slice(0, i).reduce((a, x) => a + x.lessons.length, 0));

  return (
    <div className="container page">
      <p style={{ marginBlockEnd: 24 }}><button className="link" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left i-dir" aria-hidden="true" /> {t("common.back")}</button></p>
      <div className="detail">
        <div className="stack">
          <div className="detail__poster"><Thumb src={course.thumbnailUrl} title={course.title} kind="course" /></div>
          <div>
            <span className="eyebrow">{t("common.course")}{category ? ` · ${category.name}` : ""}</span>
            <h1>{course.title}</h1>
            {creator && <p className="muted">{t("common.by", { name: "" })}<Link className="link" to={`/creator/${creator.id}`}>{creator.name}</Link></p>}
          </div>

          <section className="stack">
            <h2 style={{ fontSize: "1.25rem" }}>{t("course.about")}</h2>
            <p className="measure">{course.description}</p>
          </section>

          {course.outcomes.length > 0 && (
            <section className="stack">
              <h2 style={{ fontSize: "1.25rem" }}>{t("course.outcomes")}</h2>
              <ul className="checklist">{course.outcomes.map((o) => <li key={o}><i className="fa-solid fa-check" aria-hidden="true" /><span>{o}</span></li>)}</ul>
            </section>
          )}

          <section className="stack">
            <h2 style={{ fontSize: "1.25rem" }}>{t("course.curriculum")}</h2>
            {flat.length === 0 ? <p className="muted">{t("course.noLessons")}</p> : (
              <div className="outline">
                {course.sections.map((s, si) => (
                  <div key={s.id} className="outline__section">
                    <h3>{s.title}</h3>
                    <ol>
                      {s.lessons.map((l, li) => {
                        const n = starts[si] + li + 1;
                        return (
                          <li key={l.id} className="outline__lesson">
                            <span className="num">{n}</span>
                            <Link className="t" to={watchHref("course", course.id, l.id)} aria-label={`${t("course.openLesson", { n })}: ${l.title}`}>{l.title}</Link>
                            <time>{l.duration}</time>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="stack">
            <h2 style={{ fontSize: "1.25rem" }}>{t("course.reviews")}</h2>
            {course.reviews.length === 0 ? <p className="muted">{t("course.noReviews")}</p> : course.reviews.map((r) => (
              <article key={r.id} className="review">
                <p><strong>{r.authorName}</strong> <span className="muted">· {"★".repeat(Math.round(r.rating))} · {r.date}</span></p>
                <p className="measure">{r.comment}</p>
              </article>
            ))}
          </section>
        </div>

        <aside className="stack" style={{ position: "sticky", top: 88 }}>
          <div className="facts">
            <dl>
              <div><dt>{t("course.format")}</dt><dd>{t("common.course")}</dd></div>
              <div><dt>{t("course.level")}</dt><dd>{t(`level.${course.level}`)}</dd></div>
              <div><dt>{t("course.lessons")}</dt><dd>{tn("n.lessons", flat.length)}</dd></div>
              {course.durationLabel && <div><dt>{t("course.duration")}</dt><dd>{course.durationLabel}</dd></div>}
            </dl>
            {first ? (
              <Link className="btn btn--accent" to={watchHref("course", course.id, first.id)}>{user ? t("course.start") : t("course.signInToWatch")}</Link>
            ) : <button className="btn" disabled>{t("course.noLessons")}</button>}
            <button className="btn" aria-pressed={saved} onClick={onSave}>
              <i className={`${saved ? "fa-solid" : "fa-regular"} fa-bookmark`} aria-hidden="true" /> {saved ? t("common.unsaveItem") : t("common.saveItem")}
            </button>
            <p className="field__hint">{user ? t("course.openAnyNote") : t("course.lockedNote")}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
