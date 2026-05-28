import { useParams, useNavigate } from "react-router-dom";
import { getCategoryById, getCoursesByCategory } from "../data";
import { CourseCard } from "../components/course/CourseCard";
import { MobileHeader } from "../components/layout/MobileHeader";

export default function CategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const category = getCategoryById(id ?? "");
  const list = getCoursesByCategory(id ?? "");

  if (!category) {
    return (
      <div className="px-4 lg:px-8 py-10 text-center text-ink-muted">
        Category not found.{" "}
        <button className="text-orival" onClick={() => navigate("/categories")}>
          Back to categories
        </button>
      </div>
    );
  }


  return (
    <div>
      <MobileHeader back title={category.name} />
      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-4">
        <div className="hidden lg:flex items-center gap-3 mb-6">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg" style={{ backgroundColor: `${category.color}1F`, color: category.color }}>
            <i className="fa-solid fa-tasks"></i>
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-primary">{category.name}</h1>
            <p className="text-sm text-ink-secondary">{category.courseCount} courses</p>
          </div>
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-ink-muted mt-4">No courses yet in this category.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {list.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
