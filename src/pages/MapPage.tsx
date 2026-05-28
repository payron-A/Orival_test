import { useMemo, useState } from "react";
import { courses } from "../data";
import { MapView } from "../components/map/MapView";
import { MapPreviewCard } from "../components/map/MapPreviewCard";
import { FilterChip } from "../components/ui/FilterChip";
import { SearchBar } from "../components/ui/SearchBar";
import { MobileHeader } from "../components/layout/MobileHeader";
import type { LearningMode } from "../types/courses";


const modeFilters: { key: "all" | LearningMode; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in-person", label: "In-person" },
  { key: "online", label: "Online" },
  { key: "hybrid", label: "Hybrid" },
];
//______ Options ___________
//____Distance:
const distanceOptions: {key:string,value:string}[] = [
    { key: "5", value: "Under 5 km" },
    { key: "10", value: "Under 10 km" },
    { key: "25", value: "Under 25 km" },
]

export default function MapPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"all" | LearningMode>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState<string>("");
  
  const locatable = useMemo(() => courses.filter((c) => c.location), []);
  const filtered = useMemo(() => {
    let result = locatable.filter((c) => {
      if (mode !== "all" && c.mode !== mode) return false;
      if (query.trim() && !c.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (maxDistanceKm && c.distanceKm > Number(maxDistanceKm.split(" ")[1])) return false;
      return true;
    });
    return result;
  }, [locatable, mode, query, maxDistanceKm]);

  const selected = filtered.find((c) => c.id === selectedId);
  const markers = filtered.map((c) => ({ 
    id: c.id, lat: c.location!.lat, lng: c.location!.lng, label: c.title })
  );


  return (
  <div className="flex flex-col lg:h-[calc(100vh-64px)]">
    <MobileHeader title="Map"/>

    {/* HERO SECTION */}
    <div className="px-4 lg:px-8 pt-4 lg:pt-6 pb-3 flex flex-col gap-3">
      <div className="hidden lg:block">
        <h1 className="font-display text-2xl font-bold text-ink-primary">Map</h1>
        <p className="text-sm text-ink-secondary mt-1">Find courses and providers around you.</p>
      </div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search a skill or course..."
        withFilterButton/>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {modeFilters.map((f) => (
          <FilterChip key={f.key} label={f.label} active={mode === f.key} onClick={() => setMode(f.key)} />
        ))}
        <FilterChip label="Distance"
              options={distanceOptions}
              value={maxDistanceKm}
              onSelectChange={setMaxDistanceKm}
            />
      </div>
    </div>

    {/* MAP Preview */}
    <div className="flex-1 px-4 lg:px-8 pb-4 min-h-0">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 h-full">
        <div className="relative h-[60vh] lg:h-full">
          <div className="absolute inset-0">
            <MapView markers={markers} selectedId={selected?.id} onSelect={setSelectedId} 
                   className=" h-full w-full z-30" />
          </div>
          {selected && (
            <div className="lg:hidden absolute z-40  bottom-3 w-full p-3 max-w-lg">
              <MapPreviewCard course={selected} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
        <div className="hidden lg:flex flex-col gap-3 overflow-y-auto scroll-thin">
          <p className="text-xs text-ink-muted">{filtered.length} results</p>
          {selected && <MapPreviewCard course={selected} onClose={() => setSelectedId(null)} />}
          <div className="flex flex-col gap-2.5">
            {filtered.map((c) => (
              <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`flex items-center gap-2.5 rounded-xl2 border p-2.5 text-left transition-colors ${
                    c.id === selected?.id ? "border-orival/50 bg-orival/5" : "border-base-border bg-base-panel hover:border-base-border2"
                  }`}>
                <img src={c.thumbnailUrl} className="h-14 w-16 rounded-lg object-cover" alt="" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-primary line-clamp-1">{c.title}</p>
                  <p className="text-xs text-ink-muted line-clamp-1">
                    {c.distanceKm} km away · {c.priceDzd.toLocaleString()} DZD
                  </p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-sm text-ink-muted">No results for these filters.</p>}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}