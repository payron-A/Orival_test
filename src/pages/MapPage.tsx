import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { MapView } from "../components/map/MapView";
import { PageHead, Empty } from "../components/common/PageHead";
import { norm } from "../lib/text";

/** Preserved from the previous version: courses that have a physical location. Secondary to the video experience. */
export default function MapPage() {
  const { courses } = useApi();
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const located = useMemo(() => courses.filter((c) => c.location && norm(c.title).includes(norm(q))), [courses, q]);
  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12">
      <PageHead eyebrow={t("nav.map")} title={t("map.title")} lede={t("map.lede")} />
      <div className="flex flex-col gap-1" style={{ maxWidth: 360, marginBlockEnd: 16 }}>
        <label className="text-sm font-semibold" htmlFor="m-q">{t("map.search")}</label>
        <input id="m-q" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink 
          focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" 
          value={q}onChange={(e) => setQ(e.target.value)} />
      </div>
      {located.length === 0 ? <Empty title={t("map.none")} /> : (
        <>
          <div className="h-[460px] overflow-hidden rounded border border-ink" dir="ltr">
            <MapView markers={located.map((c) => ({ id: c.id, lat: c.location!.lat, lng: c.location!.lng, label: c.title }))} selectedId={selected} onSelect={setSelected} />
          </div>
          <ul style={{ marginBlockStart: 24 }}>
            {located.map((c) => (
              <li key={c.id} className={selected === c.id ? "grid grid-cols-[96px_1fr_auto] items-center gap-4 border-b border-line py-4 max-[620px]:grid-cols-[72px_1fr] max-[620px]:[&>:last-child]:col-span-full bg-mist" : "grid grid-cols-[96px_1fr_auto] items-center gap-4 border-b border-line py-4 max-[620px]:grid-cols-[72px_1fr] max-[620px]:[&>:last-child]:col-span-full"} style={{ gridTemplateColumns: "1fr auto" }}>
                <div>
                  <h3>
                    <Link to={`/course/${c.id}`}>{c.title}</Link>
                  </h3>
                  <p className="text-muted">{c.location!.city}, {c.location!.country}</p>
                </div>
                <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded border px-4 text-sm font-semibold 
                        transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-white text-ink hover:bg-mist" onClick={() => setSelected(c.id)}>
                  {t("nav.map")}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
