import { useMemo, useState } from "react";
import { projectPoints } from "./mapProjection";

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  label: string;
  emphasized?: boolean;
}

export function MapView({
  markers,
  selectedId,
  onSelect,
  className = "",
  userMarker = true,
}: {
  markers: MapMarkerData[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  userMarker?: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const projected = useMemo(() => projectPoints(markers), [markers]);
  const center = projected.length? 
    { x: projected.reduce((s, p) => s + p.x, 0) / projected.length, y: projected.reduce((s, p) => s + p.y, 0) / projected.length }
    : { x: 50, y: 50 };

  return (
    // MAP:
    <div  className={`relative overflow-hidden rounded-xl2 border border-base-border select-none ${className}`}
          style={{background:"radial-gradient(circle at 30% 20%, #191c22 0%, #101216 55%, #0c0d10 100%)",}}>
      {/* ROAD GRID */}
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#242731" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <path d="M 0 65 Q 200 40 420 90 T 900 60" stroke="#2E3239" strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M 80 0 Q 140 220 60 420" stroke="#2E3239" strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M 0 220 Q 320 260 640 200 T 1000 240" stroke="#252831" strokeWidth="2" fill="none" opacity="0.5" />
      </svg>
      {/* POSITION */}
      <div  className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${zoom})`, transformOrigin: `${center.x}% ${center.y}%` }}>   
        {/* USER POSITION */}
        {userMarker && (
          <div  className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${center.x}%`, top: `${center.y}%` }}>
            <span className="relative flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mode-online opacity-60" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-mode-online ring-4 ring-mode-online/20" />
            </span>
          </div>
        )}
        {/* COURSES POSITION */}
        {projected.map((m) => {
          const active = selectedId === m.id;
          return (
            <button
                key={m.id}
                onClick={() => onSelect?.(m.id)}
                aria-label={m.label}
                className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:-translate-y-[105%]"
                style={{ left: `${m.x}%`, top: `${m.y}%`, zIndex: active ? 20 : 10 }}>
              <span
                  className={`flex flex-col items-center drop-shadow-lg ${active ? "scale-110" : ""} transition-transform`}>
                <i  
                  className={`fa-solid fa-location-pin ${selectedId == m.id?"animate-jump":""}`}
                  style={{color:"#FF7A26",textShadow:"0 0 3px #FF7A26,1px 1px 4px #000000"}}></i>
              </span>
            </button>
          );
        })}
      </div>
      {/* ACTIONS */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {/* zoom + */}
          <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-base-border bg-base-panel/90 text-ink-secondary backdrop-blur hover:text-ink-primary">
            <i className="fa-solid fa-plus"></i>
          </button>
          {/* zoom - */}
          <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.2))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-base-border bg-base-panel/90 text-ink-secondary backdrop-blur hover:text-ink-primary">
            <i className="fa-solid fa-minus"></i>
          </button>
          {/* default */}
          <button
              onClick={() => setZoom(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-base-border bg-base-panel/90 text-ink-secondary backdrop-blur hover:text-ink-primary">
            <i className="fa-solid fa-home"></i>
          </button>
      </div>
    </div>
  );
}
