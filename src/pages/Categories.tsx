import { categories } from "../data";
import { CategoryCard } from "../components/category/CategoryCard";
import { MobileHeader } from "../components/layout/MobileHeader";

export default function Categories() {
  return (
    <div>
      <MobileHeader title="Categories" />
      <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-4">
        <div className="hidden lg:block mb-5">
          <h1 className="font-display text-2xl font-bold text-ink-primary">Categories</h1>
          <p className="text-sm text-ink-secondary mt-1">Browse courses by category.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}
