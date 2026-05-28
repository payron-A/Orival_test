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
    <div className="container page">
      <PageHead eyebrow={t("nav.map")} title={t("map.title")} lede={t("map.lede")} />
      <div className="field" style={{ maxWidth: 360, marginBlockEnd: 16 }}>
        <label htmlFor="m-q">{t("map.search")}</label>
        <input id="m-q" className="input" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {located.length === 0 ? <Empty title={t("map.none")} /> : (
        <>
          <div className="map-box" dir="ltr">
            <MapView markers={located.map((c) => ({ id: c.id, lat: c.location!.lat, lng: c.location!.lng, label: c.title }))} selectedId={selected} onSelect={setSelected} />
          </div>
          <ul style={{ marginBlockStart: 24 }}>
            {located.map((c) => (
              <li key={c.id} className="list-row" style={{ gridTemplateColumns: "1fr auto", background: selected === c.id ? "var(--surface)" : undefined }}>
                <div><h3><Link to={`/course/${c.id}`}>{c.title}</Link></h3><p className="muted">{c.location!.city}, {c.location!.country}</p></div>
                <button className="btn btn--sm" onClick={() => setSelected(c.id)}>{t("nav.map")}</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
