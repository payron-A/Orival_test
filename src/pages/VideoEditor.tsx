import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { PageHead, Empty } from "../components/common/PageHead";
import { ContentCard } from "../components/common/ContentCard";
import { creatorIdFor, videoToItem } from "../lib/catalog";
import { slugId } from "../lib/text";
import type { Video } from "../types/content";
import type { PublishStatus } from "../types/courses";
import type { Key } from "../i18n/en";

const DURATION = /^\d{1,2}(:\d{2}){1,2}$/;
const isUrl = (s: string) => /^https?:\/\/\S+$/i.test(s);

export default function VideoEditor() {
  const { id } = useParams();
  const { user, studioVideos, saveStudioVideo, categories } = useApi();
  const { t } = useI18n();
  const navigate = useNavigate();
  const cid = user ? creatorIdFor(user) : "";
  const found = id ? studioVideos.find((v) => v.id === id) : undefined;
  const owned = found && found.providerId === cid ? found : undefined;
  const [title, setTitle] = useState(owned?.title ?? "");
  const [description, setDescription] = useState(owned?.description ?? "");
  const [categoryId, setCategoryId] = useState(owned?.categoryId ?? "");
  const [tags, setTags] = useState(owned?.tags.join(", ") ?? "");
  const [duration, setDuration] = useState(owned?.durationLabel ?? "");
  const [thumb, setThumb] = useState(owned?.thumbnailUrl ?? "");
  const [url, setUrl] = useState(owned?.videoUrl ?? "");
  const [errs, setErrs] = useState<Record<string, Key>>({});

  if (id && !owned) return <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12"><Empty title={t("ed.notFound")} action={<Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" to="/studio">{t("nav.studio")}</Link>} /></div>;

  const build = (status: PublishStatus): Video => ({
    id: owned?.id ?? slugId("video"), title: title.trim(), thumbnailUrl: thumb.trim(), providerId: cid, categoryId,
    description: description.trim(), durationLabel: duration.trim(), tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    addedAt: owned?.addedAt ?? new Date().toISOString().slice(0, 10), videoUrl: url.trim() || undefined, status,
  });

  const save = (status: PublishStatus) => (e?: FormEvent) => {
    e?.preventDefault();
    const er: Record<string, Key> = {};
    if (!title.trim()) er.title = "ed.err.title";
    if (duration && !DURATION.test(duration.trim())) er.duration = "ed.err.duration";
    if (url.trim() && !isUrl(url.trim())) er.url = "ed.err.url";
    if (thumb.trim() && !isUrl(thumb.trim())) er.thumb = "ed.err.url";
    if (status === "published") {
      if (description.trim().length < 20) er.description = "ed.err.description";
      if (!categoryId) er.categoryId = "ed.err.topic";
    }
    setErrs(er);
    if (Object.keys(er).length) return;
    saveStudioVideo(build(status));
    navigate("/studio", { state: { saved: true } });
  };
  const err = (k: string) => errs[k] && <span className="text-sm text-danger" role="alert">{t(errs[k])}</span>;
  const preview = videoToItem(build("draft"));

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <PageHead eyebrow={t("nav.studio")} title={owned ? t("ed.video.edit") : t("ed.video.new")} />
      {Object.keys(errs).length > 0 && <p className="border-s-[3px] px-4 py-3 text-sm border-danger bg-danger-bg text-danger" role="alert" style={{ marginBlockEnd: 24 }}>{t("ed.fixErrors")}</p>}
      <div className="grid items-start gap-8 min-[961px]:grid-cols-[minmax(0,1fr)_300px] min-[961px]:gap-12">
        <form className="grid max-w-[860px] gap-8" onSubmit={save("draft")} noValidate>
          <fieldset className="m-0 grid gap-4 border-0 p-0">
            <legend className="mb-4 w-full border-b-2 border-ink pb-3 font-display text-xl font-semibold">{t("ed.basics")}</legend>
            <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="v-title">{t("ed.title")}</label><input id="v-title" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={Boolean(errs.title)} />{err("title")}</div>
            <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="v-desc">{t("ed.description")}</label><textarea id="v-desc" className="min-h-28 w-full resize-y rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={Boolean(errs.description)} />{err("description")}</div>
            <div className="grid gap-4 min-[621px]:grid-cols-2">
              <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="v-cat">{t("ed.topic")}</label><select id="v-cat" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="" />{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{err("categoryId")}</div>
              <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="v-dur">{t("ed.duration")}</label><input id="v-dur" dir="ltr" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" placeholder={t("ed.durationHint")} value={duration} onChange={(e) => setDuration(e.target.value)} aria-invalid={Boolean(errs.duration)} />{err("duration")}</div>
            </div>
            <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="v-tags">{t("ed.tags")}</label><input id="v-tags" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={tags} onChange={(e) => setTags(e.target.value)} /><span className="text-sm text-muted">{t("ed.tagsHint")}</span></div>
            <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="v-url">{t("ed.videoUrl")} ({t("common.optional")})</label><input id="v-url" dir="ltr" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={url} onChange={(e) => setUrl(e.target.value)} aria-invalid={Boolean(errs.url)} /><span className="text-sm text-muted">{t("ed.videoUrlHint")}</span>{err("url")}</div>
            <div className="flex flex-col gap-1"><label className="text-sm font-semibold" htmlFor="v-th">{t("ed.thumbnail")} ({t("common.optional")})</label><input id="v-th" dir="ltr" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={thumb} onChange={(e) => setThumb(e.target.value)} aria-invalid={Boolean(errs.thumb)} /><span className="text-sm text-muted">{t("ed.thumbnailHint")}</span>{err("thumb")}</div>
          </fieldset>
          <div className="sticky bottom-0 z-[5] flex flex-wrap gap-3 border-t border-line bg-white py-4 max-[959px]:bottom-16">
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" type="submit">{t("studio.saveDraft")}</button>
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-orange-500 bg-orange-500 text-ink hover:bg-[#fb8a3c]" type="button" onClick={() => save("published")()}>{t("studio.savePublish")}</button>
            <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-transparent bg-transparent text-ink hover:bg-mist" to="/studio">{t("common.cancel")}</Link>
          </div>
        </form>
        <aside className="grid content-start gap-3 rounded border p-5 border-line bg-mist" style={{ position: "sticky", top: 88 }}>
          <h3>{t("ed.previewTitle")}</h3>
          <div inert><ContentCard item={{ ...preview, title: preview.title || t("ed.video.new"), href: "#" }} /></div>
        </aside>
      </div>
    </div>
  );
}
