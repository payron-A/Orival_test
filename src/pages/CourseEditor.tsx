import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { PageHead, Empty } from "../components/common/PageHead";
import { ContentCard } from "../components/common/ContentCard";
import { courseToItem, creatorIdFor, totalDurationLabel } from "../lib/catalog";
import { slugId } from "../lib/text";
import type { Course, CourseLevel, CourseSection, PublishStatus } from "../types/courses";
import type { Key } from "../i18n/en";

const DURATION = /^\d{1,2}(:\d{2}){1,2}$/;
const isUrl = (s: string) => /^https?:\/\/\S+$/i.test(s);
const LEVELS: CourseLevel[] = ["beginner", "intermediate", "advanced", "all levels"];

export default function CourseEditor() {
  const { id } = useParams();
  const { user, studioCourses, saveStudioCourse, categories } = useApi();
  const { t } = useI18n();
  const navigate = useNavigate();
  const existing = id ? studioCourses.find((c) => c.id === id) : undefined;
  const cid = user ? creatorIdFor(user) : "";
  const owned = existing && existing.providerId === cid ? existing : undefined;

  const [title, setTitle] = useState(owned?.title ?? "");
  const [description, setDescription] = useState(owned?.description ?? "");
  const [categoryId, setCategoryId] = useState(owned?.categoryId ?? "");
  const [level, setLevel] = useState<CourseLevel>(owned?.level ?? "all levels");
  const [tags, setTags] = useState(owned?.tags.join(", ") ?? "");
  const [thumb, setThumb] = useState(owned?.thumbnailUrl ?? "");
  const [outcomes, setOutcomes] = useState(owned?.outcomes.join("\n") ?? "");
  const [sections, setSections] = useState<CourseSection[]>(owned?.sections ?? [{ id: slugId("s"), title: "", lessons: [{ id: slugId("l"), title: "", duration: "" }] }]);
  const [errs, setErrs] = useState<Record<string, Key>>({});

  if (id && !owned) return <div className="container page"><Empty title={t("ed.notFound")} action={<Link className="btn" to="/studio">{t("nav.studio")}</Link>} /></div>;

  const patchSection = (si: number, fn: (s: CourseSection) => CourseSection) => setSections((p) => p.map((s, i) => (i === si ? fn(s) : s)));
  const move = <T,>(arr: T[], i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= arr.length) return arr;
    const c = [...arr];
    [c[i], c[j]] = [c[j], c[i]];
    return c;
  };

  const build = (status: PublishStatus): Course => {
    const secs = sections.map((s) => ({ ...s, title: s.title.trim() || "—", lessons: s.lessons.map((l) => ({ ...l, title: l.title.trim(), videoUrl: l.videoUrl?.trim() || undefined })) }));
    const all = secs.flatMap((s) => s.lessons);
    return {
      id: owned?.id ?? slugId("course"), title: title.trim(), thumbnailUrl: thumb.trim(), providerId: cid, categoryId, mode: "online",
      rating: owned?.rating ?? 0, reviewCount: owned?.reviewCount ?? 0, level, lessonCount: all.length,
      durationLabel: totalDurationLabel(all.map((l) => l.duration)), description: description.trim(),
      outcomes: outcomes.split("\n").map((s) => s.trim()).filter(Boolean), sections: secs, reviews: owned?.reviews ?? [],
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean), addedAt: owned?.addedAt ?? new Date().toISOString().slice(0, 10), status,
    };
  };

  const save = (status: PublishStatus) => (e?: FormEvent) => {
    e?.preventDefault();
    const er: Record<string, Key> = {};
    if (!title.trim()) er.title = "ed.err.title";
    if (thumb.trim() && !isUrl(thumb.trim())) er.thumb = "ed.err.url";
    sections.forEach((s) => s.lessons.forEach((l) => {
      if (l.duration && !DURATION.test(l.duration)) er[`d${l.id}`] = "ed.err.duration";
      if (l.videoUrl?.trim() && !isUrl(l.videoUrl.trim())) er[`u${l.id}`] = "ed.err.url";
      if (status === "published" && !l.title.trim()) er[`t${l.id}`] = "ed.err.lessonTitle";
    }));
    if (status === "published") {
      if (description.trim().length < 20) er.description = "ed.err.description";
      if (!categoryId) er.categoryId = "ed.err.topic";
      if (!sections.some((s) => s.lessons.length)) er.sections = "ed.err.sections";
    }
    setErrs(er);
    if (Object.keys(er).length) return;
    saveStudioCourse(build(status));
    navigate("/studio", { state: { saved: true } });
  };

  const err = (k: string) => errs[k] && <span className="field__error" role="alert">{t(errs[k])}</span>;
  const preview = courseToItem(build("draft"));

  return (
    <div className="container page">
      <PageHead eyebrow={t("nav.studio")} title={owned ? t("ed.course.edit") : t("ed.course.new")} />
      {Object.keys(errs).length > 0 && <p className="alert alert--error" role="alert" style={{ marginBlockEnd: 24 }}>{t("ed.fixErrors")}</p>}
      <div className="detail" style={{ gridTemplateColumns: "minmax(0,1fr) 300px" }}>
        <form className="editor" onSubmit={save("draft")} noValidate>
          <fieldset>
            <legend>{t("ed.basics")}</legend>
            <div className="field"><label htmlFor="c-title">{t("ed.title")}</label><input id="c-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={Boolean(errs.title)} />{err("title")}</div>
            <div className="field"><label htmlFor="c-desc">{t("ed.description")}</label><textarea id="c-desc" className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={Boolean(errs.description)} />{err("description")}</div>
            <div className="two-col">
              <div className="field"><label htmlFor="c-cat">{t("ed.topic")}</label>
                <select id="c-cat" className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="" />{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{err("categoryId")}</div>
              <div className="field"><label htmlFor="c-lvl">{t("ed.level")}</label>
                <select id="c-lvl" className="select" value={level} onChange={(e) => setLevel(e.target.value as CourseLevel)}>{LEVELS.map((l) => <option key={l} value={l}>{t(`level.${l}`)}</option>)}</select></div>
            </div>
            <div className="field"><label htmlFor="c-tags">{t("ed.tags")}</label><input id="c-tags" className="input" value={tags} onChange={(e) => setTags(e.target.value)} /><span className="field__hint">{t("ed.tagsHint")}</span></div>
            <div className="field"><label htmlFor="c-th">{t("ed.thumbnail")} ({t("common.optional")})</label><input id="c-th" dir="ltr" className="input" value={thumb} onChange={(e) => setThumb(e.target.value)} aria-invalid={Boolean(errs.thumb)} /><span className="field__hint">{t("ed.thumbnailHint")}</span>{err("thumb")}</div>
            <div className="field"><label htmlFor="c-out">{t("ed.outcomes")}</label><textarea id="c-out" className="textarea" value={outcomes} onChange={(e) => setOutcomes(e.target.value)} /><span className="field__hint">{t("ed.outcomesHint")}</span></div>
          </fieldset>

          <fieldset>
            <legend>{t("ed.curriculum")}</legend>
            {err("sections")}
            {sections.map((s, si) => (
              <div key={s.id} className="ed-section">
                <div className="row">
                  <input className="input" style={{ flex: 1 }} aria-label={t("ed.sectionTitle")} placeholder={t("ed.sectionTitle")} value={s.title} onChange={(e) => patchSection(si, (x) => ({ ...x, title: e.target.value }))} />
                  <button type="button" className="icon-btn" aria-label={t("ed.moveUp")} disabled={si === 0} onClick={() => setSections((p) => move(p, si, -1))}><i className="fa-solid fa-arrow-up" aria-hidden="true" /></button>
                  <button type="button" className="icon-btn" aria-label={t("ed.moveDown")} disabled={si === sections.length - 1} onClick={() => setSections((p) => move(p, si, 1))}><i className="fa-solid fa-arrow-down" aria-hidden="true" /></button>
                  <button type="button" className="icon-btn" aria-label={t("ed.removeSection")} onClick={() => setSections((p) => p.filter((_, i) => i !== si))}><i className="fa-solid fa-trash" aria-hidden="true" /></button>
                </div>
                {s.lessons.map((l, li) => (
                  <div key={l.id} className="ed-lesson">
                    <div className="field"><input className="input" aria-label={t("ed.lessonTitle")} placeholder={t("ed.lessonTitle")} value={l.title} aria-invalid={Boolean(errs[`t${l.id}`])} onChange={(e) => patchSection(si, (x) => ({ ...x, lessons: x.lessons.map((y, i) => (i === li ? { ...y, title: e.target.value } : y)) }))} />{err(`t${l.id}`)}</div>
                    <div className="field"><input dir="ltr" className="input" aria-label={t("ed.duration")} placeholder={t("ed.durationHint")} value={l.duration} aria-invalid={Boolean(errs[`d${l.id}`])} onChange={(e) => patchSection(si, (x) => ({ ...x, lessons: x.lessons.map((y, i) => (i === li ? { ...y, duration: e.target.value } : y)) }))} />{err(`d${l.id}`)}</div>
                    <div className="row" style={{ flexWrap: "nowrap" }}>
                      <button type="button" className="icon-btn" aria-label={t("ed.moveUp")} disabled={li === 0} onClick={() => patchSection(si, (x) => ({ ...x, lessons: move(x.lessons, li, -1) }))}><i className="fa-solid fa-arrow-up" aria-hidden="true" /></button>
                      <button type="button" className="icon-btn" aria-label={t("ed.removeLesson")} onClick={() => patchSection(si, (x) => ({ ...x, lessons: x.lessons.filter((_, i) => i !== li) }))}><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
                    </div>
                    <div className="field ed-lesson__url"><input dir="ltr" className="input" aria-label={t("ed.videoUrl")} placeholder={`${t("ed.videoUrl")} (${t("common.optional")})`} value={l.videoUrl ?? ""} aria-invalid={Boolean(errs[`u${l.id}`])} onChange={(e) => patchSection(si, (x) => ({ ...x, lessons: x.lessons.map((y, i) => (i === li ? { ...y, videoUrl: e.target.value } : y)) }))} />{err(`u${l.id}`)}</div>
                  </div>
                ))}
                <div><button type="button" className="btn btn--sm" onClick={() => patchSection(si, (x) => ({ ...x, lessons: [...x.lessons, { id: slugId("l"), title: "", duration: "" }] }))}>{t("ed.addLesson")}</button></div>
              </div>
            ))}
            <p className="field__hint">{t("ed.videoUrlHint")}</p>
            <div><button type="button" className="btn" onClick={() => setSections((p) => [...p, { id: slugId("s"), title: "", lessons: [{ id: slugId("l"), title: "", duration: "" }] }])}>{t("ed.addSection")}</button></div>
          </fieldset>

          <div className="sticky-actions">
            <button className="btn" type="submit">{t("studio.saveDraft")}</button>
            <button className="btn btn--accent" type="button" onClick={() => save("published")()}>{t("studio.savePublish")}</button>
            <Link className="btn btn--ghost" to="/studio">{t("common.cancel")}</Link>
          </div>
        </form>
        <aside className="panel panel--soft" style={{ position: "sticky", top: 88 }}>
          <h3>{t("ed.previewTitle")}</h3>
          <div inert><ContentCard item={{ ...preview, title: preview.title || t("ed.course.new"), href: "#" }} /></div>
        </aside>
      </div>
    </div>
  );
}
