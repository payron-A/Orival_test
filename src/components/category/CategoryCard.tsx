import { Link } from "react-router-dom";
import type { Category } from "../../types";

export function CategoryCard({ category, size = "md" }: { category: Category; size?: "sm" | "md" }) {
  return (
    <Link
      to={`/categories/${category.id}`}
      className="flex flex-col gap-3 rounded-xl2 border border-base-border bg-base-panel p-4 hover:border-base-border2 transition-colors"
    >
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${category.color}1F`, color: category.color }}
      >
        <i className="fa-solid fa-car"
            style={{fontSize: size === "sm"?"18px":"20px"}}></i>
      </span>
      <div>
        <div className="text-sm font-semibold text-ink-primary">{category.name}</div>
        <div className="text-xs text-ink-muted">{category.courseCount} courses</div>
      </div>
    </Link>
  );
}