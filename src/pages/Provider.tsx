import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProviderById, getCoursesByProvider } from "../data";
import { Rating } from "../components/ui/Rating";
import { ModeBadge } from "../components/ui/ModeBadge";
import { CourseCard } from "../components/course/CourseCard";
import { MapView } from "../components/map/MapView";
import { MobileHeader } from "../components/layout/MobileHeader";
import { useApp } from "../context/AppContext";

const tabs = ["Courses", "About", "Reviews", "Location"] as const;

export default function Provider() {
  const { id } = useParams();
  const navigate = useNavigate();
  const provider = getProviderById(id ?? "");
  const [tab, setTab] = useState<(typeof tabs)[number]>("Courses");
  const { isFollowing, toggleFollowProvider } = useApp();

  if (!provider) {
    return (
      <div className="px-4 lg:px-8 py-10 text-center text-ink-muted">
        Provider not found.{" "}
        <button className="text-orival" onClick={() => navigate("/")}>
          Back home
        </button>
      </div>
    );
  }

  const providerCourses = getCoursesByProvider(provider.id);
  const following = isFollowing(provider.id);

  return (
    <div>
      <MobileHeader back />
      <div className="px-4 lg:px-8 pt-4 lg:pt-7 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img src={provider.avatarUrl} className="h-20 w-20 rounded-full object-cover" alt="" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-display text-xl lg:text-2xl font-bold text-ink-primary">{provider.name}</h1>
              {provider.verified && <i className="fa-solid fa-scroll text-ink-secondary"></i>}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <Rating value={provider.rating} reviewCount={provider.reviewCount} size="md" />
              {provider.location ? (
                <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                  <i className="fa-solid fa-location"></i> {provider.location.city}, {provider.location.country}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                 <i className="fa-solid fa-circle"style={{color:"#6eff26e2"}}></i> Online
                </span>
              )}
              <span className="text-xs text-ink-muted">{provider.followerCount.toLocaleString()} followers</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {provider.modes.map((m) => (
                <ModeBadge key={m} mode={m} />
              ))}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => toggleFollowProvider(provider.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                following ? "border border-base-border text-ink-primary hover:border-base-border2" : "bg-orival text-black hover:bg-orival-bright"
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
            <button className="rounded-lg border border-base-border px-4 py-2 text-sm font-medium text-ink-secondary hover:text-ink-primary hover:border-base-border2">
              Message
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-1 border-b border-base-border overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                tab === t ? "border-orival text-orival" : "border-transparent text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {t} {t === "Courses" && <span className="text-ink-muted">({providerCourses.length})</span>}
              {t === "Reviews" && <span className="text-ink-muted">({provider.reviewCount})</span>}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {tab === "Courses" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {providerCourses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}

          {tab === "About" && (
            <p className="max-w-2xl text-sm leading-relaxed text-ink-secondary">{provider.about}</p>
          )}

          {tab === "Reviews" && (
            <div className="flex flex-col gap-4 max-w-2xl">
              {providerCourses.flatMap((c) => c.reviews).slice(0, 6).map((r) => (
                <div key={r.id} className="flex gap-3">
                  <img src={r.authorAvatarUrl} className="h-9 w-9 rounded-full object-cover shrink-0" alt="" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink-primary">{r.authorName}</span>
                      <span className="text-xs text-ink-muted">{r.date}</span>
                    </div>
                    <Rating value={r.rating} />
                    <p className="mt-1 text-sm text-ink-secondary leading-relaxed">{r.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "Location" && (
            provider.location ? (
              <div className="flex flex-col gap-3 max-w-2xl">
                <MapView
                  markers={[{ id: provider.id, lat: provider.location.lat, lng: provider.location.lng, label: provider.name }]}
                  selectedId={provider.id}
                  className="h-56"
                  userMarker={false}
                />
                <div className="rounded-xl2 border border-base-border bg-base-panel p-3.5">
                  <p className="text-sm font-semibold text-ink-primary">{provider.name}</p>
                  <p className="text-xs text-ink-secondary mt-0.5">{provider.location.address}, {provider.location.city}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-xl2 border border-base-border bg-base-panel p-8 text-center max-w-2xl">
                <i className="fa-solid fa-home"></i>
                <p className="text-sm font-medium text-ink-primary">This provider teaches online only</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
