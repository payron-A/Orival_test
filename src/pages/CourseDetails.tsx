import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById, getProviderById } from "../data";
import { Rating } from "../components/ui/Rating";
import { ModeBadge } from "../components/ui/ModeBadge";
import { MapView } from "../components/map/MapView";
import { MobileHeader } from "../components/layout/MobileHeader";
import { useApi } from "../context/ApiContext";

const tabs = ["About", "Curriculum", "Reviews", "Location", "Instructor"] as const;

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(id ?? "");
  const [tab, setTab] = useState<(typeof tabs)[number]>("About");
  const [openSection, setOpenSection] = useState<string | null>(course?.sections[0]?.id ?? null);
  const { isSavedCourse, toggleSaveCourse, isEnrolled, enroll } = useApi();

  if (!course) {
    return (
      <div className="px-4 lg:px-8 py-10 text-center text-ink-muted">
        Course not found.{" "}
        <button className="text-orival" onClick={() => navigate("/")}>
          Back home
        </button>
      </div>
    );
  }

  const provider = getProviderById(course.providerId);
  const saved = isSavedCourse(course.id);
  const enrolled = isEnrolled(course.id);

  return (
    <div>
      <MobileHeader
        back
        right={
          <button onClick={() => toggleSaveCourse(course.id)} className={saved ? "text-orival" : "text-ink-primary"}>
            <i className="fa-solid fa-bookmark"></i>
          </button>
        }
      />

      <div className="lg:hidden">
        <img src={course.thumbnailUrl} className="w-full object-cover aspect-video" alt="" />
      </div>

      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-24 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="n">
            <div className="hidden lg:block mb-5">
              <button onClick={() => navigate(-1)} className="text-xs text-ink-muted hover:text-ink-secondary">
                ← Back to results
              </button>
            </div>

            <div className="hidden lg:block mb-5 overflow-hidden rounded-xl2">
              <img src={course.thumbnailUrl} className=" w-full object-cover aspect-video" alt="" />
            </div>

            <span className="inline-block mb-2 rounded-full bg-base-panel border border-base-border px-2.5 py-1 text-[11px] font-medium text-ink-secondary">
              {course.tags[0] ?? "Course"}
            </span>
            <h1 className="font-display text-2xl lg:text-3xl font-bold leading-tight text-ink-primary">{course.title}</h1>
            <Link to={`/provider/${provider?.id}`} className="mt-1.5 inline-flex items-center gap-1 text-sm text-ink-secondary hover:text-ink-primary">
              {provider?.name}
              {provider?.verified && <i className="fa-solid fa-scroll"/>}
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Rating value={course.rating} reviewCount={course.reviewCount} size="md" />
              <span className="text-xs text-ink-muted">{course.studentCount.toLocaleString()} students</span>
              <ModeBadge mode={course.mode} size="md" />
            </div>

            <div className="mt-4 flex flex-wrap gap-4 rounded-xl2 border border-base-border bg-base-panel p-4">
              <Metric label="Level" value={course.level} />
              <Metric label="Lessons" value={String(course.lessonCount)} />
              <Metric label="Duration" value={course.durationLabel} />
              <Metric label="Students" value={course.studentCount.toLocaleString()} />
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
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-5">
              {tab === "About" && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="font-display text-base font-semibold mb-2 text-ink-primary">About this secode</h2>
                    <p className="text-sm leading-relaxed text-ink-secondary">{course.description}</p>
                  </div>
                  <div>
                    <h2 className="font-display text-base font-semibold mb-2 text-ink-primary">What you'll learn</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {course.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-2 text-sm text-ink-secondary">
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {tab === "Curriculum" && (
                <div className="flex flex-col gap-2.5">
                  {course.sections.map((s) => (
                    <div key={s.id} className="rounded-xl2 border border-base-border bg-base-panel overflow-hidden">
                      <button
                        onClick={() => setOpenSection(openSection === s.id ? null : s.id)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                      >
                        <span className="text-sm font-semibold text-ink-primary">{s.title}</span>
                        <i className="fa-solid fa-chevron-down text-ink-primary"></i>
                      </button>
                      {openSection === s.id && (
                        <div className="border-t border-base-border">
                          {s.lessons.map((l) => (
                            <div key={l.id} className="flex items-center gap-2.5 px-4 py-2.5 text-sm border-b border-base-border last:border-0">
                              {l.locked ? (
                                <i className="fa-solid fa-lock text-ink-secondary"></i>
                              ) : l.completed ? (
                               <i className="fa-solid fa-home text-ink-secondary"></i>
                              ) : (
                                <i className="fa-solid fa-circle text-ink-secondary"></i>
                              )}
                              <span className={`flex-1 ${l.locked ? "text-ink-muted" : "text-ink-secondary"}`}>{l.title}</span>
                              <span className="text-xs text-ink-muted">{l.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === "Reviews" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 rounded-xl2 border border-base-border bg-base-panel p-4">
                    <span className="font-display text-3xl font-bold text-orival">{course.rating.toFixed(1)}</span>
                    <div>
                      <Rating value={course.rating} />
                      <p className="text-xs text-ink-muted mt-0.5">{course.reviewCount} reviews</p>
                    </div>
                  </div>
                  {course.reviews.map((r) => (
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
                <div className="flex flex-col gap-3">
                  {course.mode === "online" ? (
                    <div className="flex flex-col items-center gap-2 rounded-xl2 border border-base-border bg-base-panel p-8 text-center">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mode-online/15 text-mode-online">
                        <i className="fa-solid fa-map"></i>
                      </span>
                      <p className="text-sm font-medium text-ink-primary">Online course</p>
                      <p className="text-xs text-ink-muted">Learn from anywhere — no physical location required.</p>
                    </div>
                  ) : course.location ? (
                    <>
                      {course.mode === "hybrid" && (
                        <div className="rounded-xl2 border border-base-border bg-base-panel p-3 text-xs text-ink-secondary">
                          This course is available both online and in-person.
                        </div>
                      )}
                      <MapView
                        markers={[{ id: course.id, lat: course.location.lat, lng: course.location.lng, label: provider?.name ?? "" }]}
                        selectedId={course.id}
                        className="h-56"
                        userMarker={false}
                      />
                      <div className="rounded-xl2 border border-base-border bg-base-panel p-3.5">
                        <p className="text-sm font-semibold text-ink-primary">{provider?.name}</p>
                        <p className="text-xs text-ink-secondary mt-0.5">{course.location.address}, {course.location.city}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{course.distanceKm} km away</p>
                      </div>
                    </>
                  ) : null}
                </div>
              )}

              {tab === "Instructor" && provider && (
                <Link to={`/provider/${provider.id}`} className="flex items-center gap-3 rounded-xl2 border border-base-border bg-base-panel p-4 hover:border-base-border2">
                  <img src={provider.avatarUrl} className="h-14 w-14 rounded-full object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-ink-primary">{provider.name}</span>
                      {provider.verified && <i className="fa-solid fa-scroll text-ink-secondary"/>}
                    </div>
                    <Rating value={provider.rating} reviewCount={provider.reviewCount} />
                    <p className="text-xs text-ink-muted mt-1 line-clamp-2">{provider.about}</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20 flex flex-col gap-4 rounded-xl2 border border-base-border bg-base-panel p-5">
              <span className="font-display text-2xl font-bold text-orival">{course.priceDzd.toLocaleString()} DZD</span>
              <button
                onClick={() => enroll(course.id)}
                className="w-full rounded-lg bg-orival py-2.5 text-sm font-semibold text-black hover:bg-orival-bright transition-colors"
              >
                {enrolled ? "Continue Learning" : "Enroll Now"}
              </button>
              <button
                onClick={() => toggleSaveCourse(course.id)}
                className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                  saved ? "border-orival/50 text-orival" : "border-base-border text-ink-secondary hover:text-ink-primary"
                }`}
              >
                <i className="fa-solid fa-bookmark"></i>
                {saved ? "Saved" : "Save"}
              </button>
              {provider && (
                <Link to={`/provider/${provider.id}`} className="flex items-center gap-2.5 rounded-lg border border-base-border p-2.5 hover:border-base-border2">
                  <img src={provider.avatarUrl} className="h-9 w-9 rounded-full object-cover" alt="" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink-primary line-clamp-1">{provider.name}</p>
                    <p className="text-[11px] text-orival">View provider profile</p>
                  </div>
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-30 border-t border-base-border 
            bg-base-bg/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <div>
          <p className="text-[11px] text-ink-muted">Price</p>
          <p className="font-display text-lg font-bold text-orival">{course.priceDzd.toLocaleString()} DZD</p>
        </div>
        <button
          onClick={() => enroll(course.id)}
          className="flex-1 rounded-lg bg-orival py-2.5 text-sm font-semibold text-black"
        >
          {enrolled ? "Continue Learning" : "Enroll Now"}
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[70px]">
      <p className="text-[11px] text-ink-muted">{label}</p>
      <p className="text-sm font-semibold text-ink-primary">{value}</p>
    </div>
  );
}
