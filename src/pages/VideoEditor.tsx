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

  if (id && !owned) return <div className="container page"><Empty title={t("ed.notFound")} action={<Link className="btn" to="/studio">{t("nav.studio")}</Link>} /></div>;

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
  const err = (k: string) => errs[k] && <span className="field__error" role="alert">{t(errs[k])}</span>;
  const preview = videoToItem(build("draft"));

  return (
    <div className="container page">
      <PageHead eyebrow={t("nav.studio")} title={owned ? t("ed.video.edit") : t("ed.video.new")} />
      {Object.keys(errs).length > 0 && <p className="alert alert--error" role="alert" style={{ marginBlockEnd: 24 }}>{t("ed.fixErrors")}</p>}
      <div className="detail" style={{ gridTemplateColumns: "minmax(0,1fr) 300px" }}>
        <form className="editor" onSubmit={save("draft")} noValidate>
          <fieldset>
            <legend>{t("ed.basics")}</legend>
            <div className="field"><label htmlFor="v-title">{t("ed.title")}</label><input id="v-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={Boolean(errs.title)} />{err("title")}</div>
            <div className="field"><label htmlFor="v-desc">{t("ed.description")}</label><textarea id="v-desc" className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={Boolean(errs.description)} />{err("description")}</div>
            <div className="two-col">
              <div className="field"><label htmlFor="v-cat">{t("ed.topic")}</label><select id="v-cat" className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="" />{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{err("categoryId")}</div>
              <div className="field"><label htmlFor="v-dur">{t("ed.duration")}</label><input id="v-dur" dir="ltr" className="input" placeholder={t("ed.durationHint")} value={duration} onChange={(e) => setDuration(e.target.value)} aria-invalid={Boolean(errs.duration)} />{err("duration")}</div>
            </div>
            <div className="field"><label htmlFor="v-tags">{t("ed.tags")}</label><input id="v-tags" className="input" value={tags} onChange={(e) => setTags(e.target.value)} /><span className="field__hint">{t("ed.tagsHint")}</span></div>
            <div className="field"><label htmlFor="v-url">{t("ed.videoUrl")} ({t("common.optional")})</label><input id="v-url" dir="ltr" className="input" value={url} onChange={(e) => setUrl(e.target.value)} aria-invalid={Boolean(errs.url)} /><span className="field__hint">{t("ed.videoUrlHint")}</span>{err("url")}</div>
            <div className="field"><label htmlFor="v-th">{t("ed.thumbnail")} ({t("common.optional")})</label><input id="v-th" dir="ltr" className="input" value={thumb} onChange={(e) => setThumb(e.target.value)} aria-invalid={Boolean(errs.thumb)} /><span className="field__hint">{t("ed.thumbnailHint")}</span>{err("thumb")}</div>
          </fieldset>
          <div className="sticky-actions">
            <button className="btn" type="submit">{t("studio.saveDraft")}</button>
            <button className="btn btn--accent" type="button" onClick={() => save("published")()}>{t("studio.savePublish")}</button>
            <Link className="btn btn--ghost" to="/studio">{t("common.cancel")}</Link>
          </div>
        </form>
        <aside className="panel panel--soft" style={{ position: "sticky", top: 88 }}>
          <h3>{t("ed.previewTitle")}</h3>
          <div inert><ContentCard item={{ ...preview, title: preview.title || t("ed.video.new"), href: "#" }} /></div>
        </aside>
      </div>
    </div>
  );
}
