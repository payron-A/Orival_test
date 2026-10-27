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
    return <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12"><Empty title={t("course.notFound")} action={<Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" to="/explore">{t("nav.explore")}</Link>} /></div>;
  }
  const creator = getCreator(course.providerId);
  const category = getCategory(course.categoryId);
  const flat = course.sections.flatMap((s) => s.lessons);
  const saved = isSaved("course", course.id);
  const first = flat[0];

  const onSave = () => (user ? toggleSaved("course", course.id) : navigate(`/signin?next=${encodeURIComponent(loc.pathname)}`));
  const starts = course.sections.map((_, i) => course.sections.slice(0, i).reduce((a, x) => a + x.lessons.length, 0));

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <p style={{ marginBlockEnd: 24 }}><button className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left rtl:-scale-x-100" aria-hidden="true" /> {t("common.back")}</button></p>
      <div className="grid items-start gap-8 min-[961px]:grid-cols-[minmax(0,1fr)_340px] min-[961px]:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded bg-ink"><Thumb src={course.thumbnailUrl} title={course.title} kind="course" /></div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-700 rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("common.course")}{category ? ` · ${category.name}` : ""}</span>
            <h1 className="mb-3 mt-2">{course.title}</h1>
            {creator && <p className="text-muted">{t("common.by", { name: "" })}<Link className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" to={`/creator/${creator.id}`}>{creator.name}</Link></p>}
          </div>

          <section className="space-y-4">
            <h2 style={{ fontSize: "1.25rem" }}>{t("course.about")}</h2>
            <p className="max-w-measure">{course.description}</p>
          </section>

          {course.outcomes.length > 0 && (
            <section className="space-y-4">
              <h2 style={{ fontSize: "1.25rem" }}>{t("course.outcomes")}</h2>
              <ul>{course.outcomes.map((o) => <li key={o} className="flex gap-3 py-2"><i className="fa-solid fa-check mt-1.5 text-orange-700" aria-hidden="true" /><span>{o}</span></li>)}</ul>
            </section>
          )}

          <section className="space-y-4">
            <h2 style={{ fontSize: "1.25rem" }}>{t("course.curriculum")}</h2>
            {flat.length === 0 ? <p className="text-muted">{t("course.noLessons")}</p> : (
              <div className="grid gap-4">
                {course.sections.map((s, si) => (
                  <div key={s.id} className="">
                    <h3 className="border-b border-ink pb-2 text-[1.05rem]">{s.title}</h3>
                    <ol>
                      {s.lessons.map((l, li) => {
                        const n = starts[si] + li + 1;
                        return (
                          <li key={l.id} className="flex items-center gap-3 border-b border-line py-3 text-sm">
                            <span className="w-[2ch] tabular-nums text-muted">{n}</span>
                            <Link className="min-w-0 flex-1" to={watchHref("course", course.id, l.id)} aria-label={`${t("course.openLesson", { n })}: ${l.title}`}>{l.title}</Link>
                            <time className="tabular-nums text-muted">{l.duration}</time>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 style={{ fontSize: "1.25rem" }}>{t("course.reviews")}</h2>
            {course.reviews.length === 0 ? <p className="text-muted">{t("course.noReviews")}</p> : course.reviews.map((r) => (
              <article key={r.id} className="grid gap-1 border-b border-line py-4">
                <p><strong>{r.authorName}</strong> <span className="text-muted">· {"★".repeat(Math.round(r.rating))} · {r.date}</span></p>
                <p className="max-w-measure">{r.comment}</p>
              </article>
            ))}
          </section>
        </div>

        <aside className="space-y-4" style={{ position: "sticky", top: 88 }}>
          <div className="grid gap-3 rounded border border-ink p-5">
            <dl className="m-0 grid gap-3">
              <div><dt className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("course.format")}</dt><dd className="m-0 font-semibold">{t("common.course")}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("course.level")}</dt><dd className="m-0 font-semibold">{t(`level.${course.level}`)}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("course.lessons")}</dt><dd className="m-0 font-semibold">{tn("n.lessons", flat.length)}</dd></div>
              {course.durationLabel && <div><dt className="text-xs uppercase tracking-[0.08em] text-muted rtl:text-sm rtl:normal-case rtl:tracking-normal">{t("course.duration")}</dt><dd className="m-0 font-semibold">{course.durationLabel}</dd></div>}
            </dl>
            {first ? (
              <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-orange-500 bg-orange-500 text-ink hover:bg-[#fb8a3c]" to={watchHref("course", course.id, first.id)}>{user ? t("course.start") : t("course.signInToWatch")}</Link>
            ) : <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" disabled>{t("course.noLessons")}</button>}
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" aria-pressed={saved} onClick={onSave}>
              <i className={`${saved ? "fa-solid" : "fa-regular"} fa-bookmark`} aria-hidden="true" /> {saved ? t("common.unsaveItem") : t("common.saveItem")}
            </button>
            <p className="text-sm text-muted">{user ? t("course.openAnyNote") : t("course.lockedNote")}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
