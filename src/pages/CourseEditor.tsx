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

  if (id && !owned) return <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12"><Empty title={t("ed.notFound")} action={<Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" to="/studio">{t("nav.studio")}</Link>} /></div>;

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

  const err = (k: string) => errs[k] && <span className="text-sm text-danger" role="alert">{t(errs[k])}</span>;
  const preview = courseToItem(build("draft"));

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <PageHead eyebrow={t("nav.studio")} title={owned ? t("ed.course.edit") : t("ed.course.new")} />
      {Object.keys(errs).length > 0 && <p className="border-s-[3px] px-4 py-3 text-sm border-danger bg-danger-bg text-danger" role="alert" style={{ marginBlockEnd: 24 }}>{t("ed.fixErrors")}</p>}
      <div className="grid items-start gap-8 min-[961px]:grid-cols-[minmax(0,1fr)_300px] min-[961px]:gap-12">
        <form className="grid max-w-[860px] gap-8" onSubmit={save("draft")} noValidate>
          <fieldset className="m-0 grid gap-4 border-0 p-0">
            <legend className="mb-4 w-full border-b-2 border-ink pb-3 font-display text-xl font-semibold">{t("ed.basics")}</legend>
            <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="c-title">{t("ed.title")}</label><input id="c-title" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={Boolean(errs.title)} />{err("title")}</div>
            <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="c-desc">{t("ed.description")}</label><textarea id="c-desc" className="min-h-28 w-full resize-y rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={Boolean(errs.description)} />{err("description")}</div>
            <div className="grid gap-4 min-[621px]:grid-cols-2">
              <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="c-cat">{t("ed.topic")}</label>
                <select id="c-cat" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="" />{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{err("categoryId")}</div>
              <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="c-lvl">{t("ed.level")}</label>
                <select id="c-lvl" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200" value={level} onChange={(e) => setLevel(e.target.value as CourseLevel)}>{LEVELS.map((l) => <option key={l} value={l}>{t(`level.${l}`)}</option>)}</select></div>
            </div>
            <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="c-tags">{t("ed.tags")}</label><input id="c-tags" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={tags} onChange={(e) => setTags(e.target.value)} /><span className="text-sm text-muted">{t("ed.tagsHint")}</span></div>
            <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="c-th">{t("ed.thumbnail")} ({t("common.optional")})</label><input id="c-th" dir="ltr" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={thumb} onChange={(e) => setThumb(e.target.value)} aria-invalid={Boolean(errs.thumb)} /><span className="text-sm text-muted">{t("ed.thumbnailHint")}</span>{err("thumb")}</div>
            <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="c-out">{t("ed.outcomes")}</label><textarea id="c-out" className="min-h-28 w-full resize-y rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={outcomes} onChange={(e) => setOutcomes(e.target.value)} /><span className="text-sm text-muted">{t("ed.outcomesHint")}</span></div>
          </fieldset>

          <fieldset className="m-0 grid gap-4 border-0 p-0">
            <legend className="mb-4 w-full border-b-2 border-ink pb-3 font-display text-xl font-semibold">{t("ed.curriculum")}</legend>
            {err("sections")}
            {sections.map((s, si) => (
              <div key={s.id} className="grid gap-3 rounded border border-line p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <input className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" style={{ flex: 1 }} aria-label={t("ed.sectionTitle")} placeholder={t("ed.sectionTitle")} value={s.title} onChange={(e) => patchSection(si, (x) => ({ ...x, title: e.target.value }))} />
                  <button type="button" className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-ink transition-colors hover:bg-mist disabled:opacity-40" aria-label={t("ed.moveUp")} disabled={si === 0} onClick={() => setSections((p) => move(p, si, -1))}><i className="fa-solid fa-arrow-up" aria-hidden="true" /></button>
                  <button type="button" className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-ink transition-colors hover:bg-mist disabled:opacity-40" aria-label={t("ed.moveDown")} disabled={si === sections.length - 1} onClick={() => setSections((p) => move(p, si, 1))}><i className="fa-solid fa-arrow-down" aria-hidden="true" /></button>
                  <button type="button" className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-ink transition-colors hover:bg-mist disabled:opacity-40" aria-label={t("ed.removeSection")} onClick={() => setSections((p) => p.filter((_, i) => i !== si))}><i className="fa-solid fa-trash" aria-hidden="true" /></button>
                </div>
                {s.lessons.map((l, li) => (
                  <div key={l.id} className="grid grid-cols-[1fr_96px_auto] items-start gap-2 py-2 max-[620px]:grid-cols-[1fr_auto]">
                    <div className="flex flex-col gap-1"><input className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" aria-label={t("ed.lessonTitle")} placeholder={t("ed.lessonTitle")} value={l.title} aria-invalid={Boolean(errs[`t${l.id}`])} onChange={(e) => patchSection(si, (x) => ({ ...x, lessons: x.lessons.map((y, i) => (i === li ? { ...y, title: e.target.value } : y)) }))} />{err(`t${l.id}`)}</div>
                    <div className="flex flex-col gap-1"><input dir="ltr" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" aria-label={t("ed.duration")} placeholder={t("ed.durationHint")} value={l.duration} aria-invalid={Boolean(errs[`d${l.id}`])} onChange={(e) => patchSection(si, (x) => ({ ...x, lessons: x.lessons.map((y, i) => (i === li ? { ...y, duration: e.target.value } : y)) }))} />{err(`d${l.id}`)}</div>
                    <div className="flex flex-wrap items-center gap-3" style={{ flexWrap: "nowrap" }}>
                      <button type="button" className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-ink transition-colors hover:bg-mist disabled:opacity-40" aria-label={t("ed.moveUp")} disabled={li === 0} onClick={() => patchSection(si, (x) => ({ ...x, lessons: move(x.lessons, li, -1) }))}><i className="fa-solid fa-arrow-up" aria-hidden="true" /></button>
                      <button type="button" className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-ink transition-colors hover:bg-mist disabled:opacity-40" aria-label={t("ed.removeLesson")} onClick={() => patchSection(si, (x) => ({ ...x, lessons: x.lessons.filter((_, i) => i !== li) }))}><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
                    </div>
                    <div className="flex flex-col gap-1 col-span-full"><input dir="ltr" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" aria-label={t("ed.videoUrl")} placeholder={`${t("ed.videoUrl")} (${t("common.optional")})`} value={l.videoUrl ?? ""} aria-invalid={Boolean(errs[`u${l.id}`])} onChange={(e) => patchSection(si, (x) => ({ ...x, lessons: x.lessons.map((y, i) => (i === li ? { ...y, videoUrl: e.target.value } : y)) }))} />{err(`u${l.id}`)}</div>
                  </div>
                ))}
                <div><button type="button" className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" onClick={() => patchSection(si, (x) => ({ ...x, lessons: [...x.lessons, { id: slugId("l"), title: "", duration: "" }] }))}>{t("ed.addLesson")}</button></div>
              </div>
            ))}
            <p className="text-sm text-muted">{t("ed.videoUrlHint")}</p>
            <div><button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" onClick={() => setSections((p) => [...p, { id: slugId("s"), title: "", lessons: [{ id: slugId("l"), title: "", duration: "" }] }])}>{t("ed.addSection")}</button></div>
          </fieldset>

          <div className="sticky bottom-0 z-[5] flex flex-wrap gap-3 border-t border-line bg-white py-4 max-[959px]:bottom-16">
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" type="submit">{t("studio.saveDraft")}</button>
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-orange-500 bg-orange-500 text-ink hover:bg-[#fb8a3c]" type="button" onClick={() => save("published")()}>{t("studio.savePublish")}</button>
            <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-transparent bg-transparent text-ink hover:bg-mist" to="/studio">{t("common.cancel")}</Link>
          </div>
        </form>
        <aside className="grid content-start gap-3 rounded border p-5 border-line bg-mist" style={{ position: "sticky", top: 88 }}>
          <h3>{t("ed.previewTitle")}</h3>
          <div inert><ContentCard item={{ ...preview, title: preview.title || t("ed.course.new"), href: "#" }} /></div>
        </aside>
      </div>
    </div>
  );
}
