import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProviderById, getCoursesByProvider } from "../data";
import { Rating } from "../components/ui/Rating";
import { ModeBadge } from "../components/ui/ModeBadge";
import { StatCard } from "../components/ui/StatCard";
import { MiniBarChart } from "../components/ui/MiniBarChart";
import { CourseListItem } from "../components/course/CourseListItem";
import { ReviewCard } from "../components/review/ReviewCard";
import { MobileHeader } from "../components/layout/MobileHeader";
import { useApi } from "../context/ApiContext";

// Demo: dashboard is shown from the point of view of this provider.

const monthlyEnrollments = [
  { label: "Apr", value: 38 },
  { label: "May", value: 52 },
  { label: "Jun", value: 47 },
  { label: "Jul", value: 61 },
  { label: "Aug", value: 74 },
  { label: "Sep", value: 66 },
];

export default function Dashboard() {
  const { user } = useApi();
  const providerAccount = useMemo(()=> getProviderById(user?.providerId),[user]);
  const navigate = useNavigate();
  const courses = useMemo(() => getCoursesByProvider(providerAccount?.id), []);

  if (!user) return null;

  const totalRevenue = courses.reduce((sum, c) => sum + c.studentCount * c.priceDzd, 0);
  const topCourse = [...courses].sort((a, b) => b.studentCount - a.studentCount)[0];
  const recentReviews = courses.flatMap((c) => c.reviews).slice(0, 3);

  return (
    <div>
      <MobileHeader title="Dashboard" showBell />

      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <img src={providerAccount?.avatarUrl} className="h-14 w-14 rounded-full object-cover" alt="" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-display text-xl lg:text-2xl font-bold text-ink-primary">{providerAccount?.name}</h1>
              {providerAccount?.verified && <i className="fa-solid fa-circle-check text-ink-primary"></i>}
            </div>
            <p className="text-sm text-ink-secondary mt-0.5">Provider dashboard · last 6 months</p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/provider/${providerAccount?.id}`}
              className="rounded-lg border border-base-border px-3.5 py-2 text-sm font-medium text-ink-secondary hover:text-ink-primary hover:border-base-border2 transition-colors"
            >
              View public page
            </Link>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-orival px-3.5 py-2 text-sm font-semibold text-black hover:bg-orival-bright transition-colors">
              <i className="fa-solid fa-plus"></i>New course
            </button>
          </div>
        </div>

        {/* KPI cards — reuses StatCard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          <StatCard label="Total students" value={String(providerAccount?.followerCount)} 
                    icon={"fa-solid fa-users"} trend={{ value: "+12%" }} 
                    accent="#3E8FFF" />
          <StatCard label="Active courses" value={String(courses.length)} 
                    icon={"fa-solid fa-graduation-cap"} 
                    accent="#9B7BFF" />
          <StatCard label="Revenue (all time)" value={`${(totalRevenue / 1000).toFixed(0)} DZD`} 
                    icon={"fa-solid fa-wallet"} trend={{ value: "+8%" }} 
                    accent="#33C46A" />
          <StatCard label="Average rating" value={providerAccount?.rating.toFixed(1)} 
                    icon={"fa-solid fa-star"} 
                    accent="#FF7A26" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
          <div className="flex flex-col gap-5 min-w-0">
            {/* Enrollment trend — reuses MiniBarChart */}
            <section className="rounded-xl2 border border-base-border bg-base-panel p-4 lg:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-semibold text-ink-secondary">Enrollments over time</h2>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                  <i className="fa-solid fa-chart-line"></i> Trending up
                </span>
              </div>
              <MiniBarChart data={monthlyEnrollments} />
            </section>

            {/* Course performance — reuses CourseListItem + ModeBadge */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-lg font-semibold text-ink-primary">Your courses</h2>
                <button onClick={() => navigate(`/provider/${providerAccount?.id}`)} className="text-xs font-medium text-orival hover:text-orival-bright">
                  Manage all
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                {courses.map((c) => (
                  <CourseListItem key={c.id} course={c} />
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-5">
            {/* Top course spotlight — reuses Rating + ModeBadge */}
            {topCourse && (
              <section className="rounded-xl2 border border-orival/25 bg-gradient-to-br from-orival/10 to-transparent p-4">
                <p className="text-xs font-semibold text-orival mb-2.5">Top performing course</p>
                <div className="flex gap-3">
                  <img src={topCourse.thumbnailUrl} className="h-16 w-20 shrink-0 rounded-lg object-cover" alt="" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ink-primary line-clamp-1">{topCourse.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Rating value={topCourse.rating} reviewCount={topCourse.reviewCount} />
                      <ModeBadge mode={topCourse.mode} />
                    </div>
                    <p className="mt-1.5 text-xs text-ink-muted">{topCourse.studentCount.toLocaleString()} students enrolled</p>
                  </div>
                </div>
              </section>
            )}

            {/* Recent reviews — reuses ReviewCard */}
            <section className="rounded-xl2 border border-base-border bg-base-panel p-4">
              <h2 className="font-display text-base font-semibold mb-3.5 text-ink-secondary">Recent reviews</h2>
              <div className="flex flex-col gap-4 mt-4">
                {recentReviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}