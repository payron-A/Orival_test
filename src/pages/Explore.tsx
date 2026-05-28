import { useNavigate } from "react-router-dom";
import { CourseCard } from "../components/course/CourseCard";
import { CategoryCard } from "../components/category/CategoryCard";
import { MobileHeader } from "../components/layout/MobileHeader";
import { useApi } from "../context/ApiContext";
import type { Course } from "../types/courses";


function Row({ title, list, onViewAll }: { title: string; list: Course[]; onViewAll?: () => void }) {
  if (list.length === 0) return null;
  return (
    <section className="mt-7">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold text-ink-secondary">{title}</h2>
        {onViewAll && (
          <button onClick={onViewAll} className="flex items-center gap-1 text-xs font-medium text-orival hover:text-orival-bright">
            View all
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        )}
      </div>
      <div className="flex gap-3.5 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4">
        {list.map((c) => (
          <div key={c.id} className="w-[220px] lg:w-auto shrink-0">
            <CourseCard course={c} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Explore() {
  const { courses,providers,categories } = useApi();
  const navigate = useNavigate();
  const popular = [...courses].sort((a, b) => b.studentCount - a.studentCount).slice(0, 8);
  const highlyRated = [...courses].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const recent = [...courses].sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1)).slice(0, 8);
  const online = courses.filter((c) => c.mode === "online").slice(0, 8);
  const nearYou = courses.filter((c) => c.mode !== "online").slice(0, 8);

  return (
    <div>
      <MobileHeader
        title="Explore"
        right={
          <button onClick={() => navigate("/search")} className="text-ink-primary">
            <i className="fa-solid fa-search"></i>
          </button>
        }
      />
      <div className="px-4 lg:px-8 pt-5 lg:pt-7">
        <div className="hidden lg:block mb-1">
          <h1 className="font-display text-2xl font-bold text-ink-primary">Explore</h1>
          <p className="text-sm text-ink-secondary mt-1">Discover popular skills and courses.</p>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-semibold text-ink-secondary">Popular categories</h2>
            <button onClick={() => navigate("/categories")} className=" flex items-center gap-1 text-xs font-medium text-orival hover:text-orival-bright">
              View all
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.slice(0, 5).map((cat) => (
              <CategoryCard key={cat.id} category={cat} size="sm" />
            ))}
          </div>
        </div>

        <Row title="Popular courses" list={popular} onViewAll={() => navigate("/search?q=")} />
        <Row title="Popular near you" list={nearYou} />
        <Row title="Highly rated" list={highlyRated} />
        <Row title="Recently added" list={recent} />
        <Row title="Online courses" list={online} />

        <section className="mt-7 mb-4">
          <h2 className="font-display text-lg font-semibold mb-3 text-ink-secondary">Top providers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/provider/${p.id}`)}
                className="flex items-center gap-2.5 rounded-xl2 border border-base-border bg-base-panel p-3 text-left hover:border-base-border2 transition-colors"
              >
                <img src={p.avatarUrl} className="h-10 w-10 rounded-full object-cover" alt="" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-primary line-clamp-1">{p.name}</p>
                  <p className="text-xs text-ink-muted">★ {p.rating} · {p.followerCount.toLocaleString()} followers</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
