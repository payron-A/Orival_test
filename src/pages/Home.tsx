import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courses, providers } from "../data";
import { CourseCard } from "../components/course/CourseCard";
import { FilterChip } from "../components/ui/FilterChip";
import { SearchBar } from "../components/ui/SearchBar";
import { MapView } from "../components/map/MapView";
import { MapPreviewCard } from "../components/map/MapPreviewCard";
import { MobileHeader } from "../components/layout/MobileHeader";
import { currentUser } from "../data";

// _____ STATE _____
// _____ Const Types of Filters _____
const filters = ["All", "Near Me", "In-Person", "Online", "Hybrid"] as const;

export default function Home() {

  const navigate = useNavigate();
  
  // _____ STATE _____
  // _____ Active filter Type _____
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [selectedId, setSelectedId] = useState<string | null>("");


  const nearby = useMemo(() => courses.filter((c) => c.mode !== "online" && c.location), []);

  const filteredNearby = useMemo(() => {
    if (activeFilter === "All" || activeFilter === "Near Me") return nearby;
    if (activeFilter === "In-Person") return nearby.filter((c) => c.mode === "in-person");
    if (activeFilter === "Online") return [];
    if (activeFilter === "Hybrid") return nearby.filter((c) => c.mode === "hybrid");
    return nearby;
  }, [activeFilter, nearby]);

  const nearbyCourses = useMemo(() => courses.filter((c) => c.mode !== "online").slice(0, 4), []);
  const recommended = useMemo(() => courses.slice(4, 10), []);
  const selectedCourse = filteredNearby.find((c) => c.id === selectedId) ?? filteredNearby[0];

  const markers = filteredNearby
    .filter((c) => c.location)
    .map((c) => ({ id: c.id, lat: c.location!.lat, lng: c.location!.lng, label: c.title }));
  return (
    <div>
        <MobileHeader showBell />

        {/* HERO SECTION */}
        <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-4">
            <h1 className="font-display text-2xl lg:text-3xl font-bold leading-tight text-ink-primary">
              What do you want to learn{" "}
              <span className="hidden lg:inline text-orival"> today?</span>
            </h1>
            <p className="mt-1.5 text-sm text-ink-secondary max-w-lg">
              Learn from the best instructors, near {currentUser.location.split(",")[0]} or online.
            </p>
            <div className="mt-4">
              <SearchBar
                  placeholder="What do you want to learn?"
                  withFilterButton
                  onFilterClick={() => navigate("/search")}
                  onSubmit={(v) => v && navigate(`/search?q=${encodeURIComponent(v)}`)}
                  size="lg"/>
            </div>
            <div className="mt-3.5 flex gap-2 overflow-x-auto no-scrollbar">
                {filters.map((f) => (
                  <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
                ))}
            </div>
        </div>

        {/* MAP SECTION */}
        <div className="px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
              <div className="flex flex-col gap-3">
                <MapView  markers={markers} 
                          selectedId={selectedCourse?.id} 
                          onSelect={setSelectedId} 
                          className="h-64 lg:h-[380px]" />
                {selectedCourse && (
                  <div className="lg:hidden">
                    <MapPreviewCard course={selectedCourse} />
                  </div>
                )}
              </div>
              <div className="hidden lg:flex flex-col gap-3">
                <h2 className="font-display text-lg font-semibold text-ink-muted">
                  On the map
                </h2>
                {selectedCourse ? (
                  <MapPreviewCard course={selectedCourse} />
                ) : (
                  <p className="text-sm text-ink-muted">Select a marker to preview a course.</p>
                )}
                <div className="flex flex-col gap-2.5 overflow-y-auto scroll-thin max-h-64 pr-1">
                  {filteredNearby.slice(0, 5).map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={`flex items-center gap-2.5 rounded-lg border p-2 text-left transition-colors 
                          ${c.id === selectedCourse?.id ? "border-orival/50 bg-orival/5" : "border-base-border hover:border-base-border2"
                        }`}>
                        <img src={c.thumbnailUrl} className="h-10 w-12 rounded-md object-cover" alt="" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-ink-primary line-clamp-1">{c.title}</p>
                          <p className="text-[11px] text-ink-muted">{c.distanceKm} km away</p>
                        </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </div>

        {/* SURGGEST COURSES */}
        <section className="px-4 lg:px-8 mt-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold text-ink-muted">
                Courses near you
              </h2>
              <button  onClick={() => navigate("/search?q=")} 
                      className="flex items-center gap-2 text-xs font-medium text-orival hover:text-orival-bright">
                View all
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div className="flex gap-3.5 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4">
              {nearbyCourses.map((c) => (
                <div key={c.id} className="w-[220px] lg:w-auto shrink-0">
                  <CourseCard course={c} />
                </div>
              ))}
            </div>
        </section>

        {/* RECOMMEND COURSES */}
        <section className="px-4 lg:px-8 mt-7 ">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold text-ink-muted">Recommended for you</h2>
              <button onClick={() => navigate("/search?q=")} 
                      className="flex items-center gap-2 text-xs font-medium text-orival hover:text-orival-bright">
                View all
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div className="flex gap-3.5 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4">
              {recommended.map((c) => (
                <div key={c.id} className="w-[220px] lg:w-auto shrink-0">
                  <CourseCard course={c} />
                </div>
              ))}
            </div>
        </section>

        {/* TOP PROVIDER */}
        <section className="px-4 lg:px-8 mt-7 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold text-ink-muted">Top providers</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {providers.slice(0, 6).map((p) => (
                <button
                    key={p.id}
                    onClick={() => navigate(`/provider/${p.id}`)}
                    className="flex flex-col items-center gap-1.5 rounded-xl2 border border-base-border bg-base-panel p-3 hover:border-base-border2 transition-colors">
                  <img src={p.avatarUrl} className="h-10 w-10 rounded-full object-cover bg-black" alt="" />
                  <span className="text-[11px] font-medium text-ink-primary line-clamp-1">{p.name}</span>
                  <span className="text-[10px] text-ink-muted">★ {p.rating}</span>
                </button>
              ))}
            </div>
        </section>
    </div>
  );
}
