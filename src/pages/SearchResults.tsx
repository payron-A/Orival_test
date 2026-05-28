import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { courses, providers, categories } from "../data";
import type { Course } from "../types/courses";
import { CourseListItem } from "../components/course/CourseListItem";
import { ProviderListRow } from "../components/provider/ProviderCard";
import { CategoryCard } from "../components/category/CategoryCard";
import { SearchBar } from "../components/ui/SearchBar";
import { MobileHeader } from "../components/layout/MobileHeader";
import { FilterChip } from "../components/ui/FilterChip";

type Tab = "all" | "courses" | "providers" | "categories";

export default function SearchResults() {

//_____Use Search Params to get input value with {q key}:
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";

// _____ Tabs _____
  const [tab, setTab] = useState<Tab>("all");
  const [category,setCategory] = useState<string>("");
  const [learningMode,setLearningMode] = useState<string>("");
  const [level,setLevel] = useState<string>("");
  const [price,setPrice] = useState<string>("");
  const [rating,setRating] = useState<string>("");


// _____ FILTERS _____
// _____ Filter Button _____
  const filterListRef = useRef<HTMLElement | null>(null)

// _____ By Tabs _____
  const matchedCourses = useMemo(() => 
      courses.filter((c:Course) =>{ 
        const matchSearch = q.trim()?
            (c.title.toLowerCase().includes(q.toLowerCase())|| c.tags.some((t) => t.includes(q.toLowerCase())))
            :courses;
        const matchFilter = Filter(c);
        return matchSearch && matchFilter;
    })
    ,[q,category,level,learningMode,price,rating]
  );
  const matchedProviders = useMemo(
    () => (q.trim() ? providers.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())) : providers),
    [q]
  );
  const matchedCategories = useMemo(
    () => (q.trim() ? categories.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())) : categories),
    [q]
  );
  const total =matchedProviders.length + matchedCourses.length + matchedCategories.length ;
  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: total },
    { key: "courses", label: "Courses", count: matchedCourses.length },
    { key: "providers", label: "Providers", count: matchedProviders.length },
    { key: "categories", label: "Categories", count: matchedCategories.length },
  ];
// _____ By Options _____
  function Filter(course:Course){
    const matchCategory = category?course.categoryId === category.toLocaleLowerCase():true;
    const matchLearningMode = learningMode?course.mode === learningMode.toLocaleLowerCase():true;
    const matchLevel = level?course.level === level.toLocaleLowerCase():true;
    const matchPrice = price?filterPrice(course,price):true;
    const matchRating = rating?filterRating(course,rating):true;
    return matchCategory && matchLearningMode && matchLevel && matchPrice && matchRating;
    
    function filterPrice(course:Course,price:string):boolean{
      switch(price){
        case "Under 8,000 DZD":
          return course.priceDzd <= 8000;
        case "8,000–15,000 DZD":
          return course.priceDzd >= 8000 && course.priceDzd <= 15000;
        case "15,000+ DZD":
          return course.priceDzd >= 15000;
        default :
          return true;
      }
    }
    function filterRating(course:Course,rating:string):boolean{
      switch(rating){
        case "4.5 & up":
          return course.rating >= 4.5;
        case "4.0 & up":
          return course.rating >= 4;
        case "3.5 & up":
          return course.rating >= 3.5;
        default :
          return true;
      }
    }
  }

  const [showFilters, setShowFilters] = useState(false);
  const FilterChipOption: {
    label: string;
    options: {
        key: string;
        value: string;
    }[];
    value: string;
    onSelectChange:(value: string) => void;
  }[] = [
    {
      label:"Category",
      options:categories.slice(0,6).map((c) =>({key: c.id,value : c.name})),
      value:category,
      onSelectChange:setCategory
    },
    {
      label:"learning Mode",
      // "In-Person", "Online", "Hybrid"
      options:[
        {key:"in-person",value:"In-Person"},
        {key:"online",value:"Online"},
        {key:"hybrid",value:"Hybrid"}
      ],
      value:learningMode,
      onSelectChange:setLearningMode
    },
    {
      label:"Level",
      // ["All levels","advanced", "Intermediate","Beginner"]
      options:[
        {key:"all-levels",value:"All levels"},
        {key:"advanced",value:"advanced"},
        {key:"intermediate",value:"Intermediate"},
        {key:"beginner",value:"Beginner"},
      ],
      value:level,
      onSelectChange:setLevel
    },
    {
      label:"Price",
      // ["Under 8,000 DZD", "8,000–15,000 DZD", "15,000+ DZD"]
      options:[
        {key:"u-8000",value:"Under 8,000 DZD"},
        {key:"8000-15000",value:"8,000–15,000 DZD"},
        {key:"m-15000",value:"15,000+ DZD"},
      ],
      value:price,
      onSelectChange:setPrice
    },
    {
      label:"Rating",
      // ["4.5 & up", "4.0 & up", "3.5 & up"]
      options:[
        {key:"4.5-up",value:"4.5 & up"},
        {key:"4.0-up",value:"4.0 & up"},
        {key:"3.5-up",value:"4.0 & up"},
      ],
      value:rating,
      onSelectChange:setRating
    }
  ]
  return (
    <div>
      <MobileHeader back title="Search" />
      <div className="px-4 lg:px-8 pt-4 lg:pt-7">
        <SearchBar
          value={q}
          withFilterButton
          onFilterClick={()=>setShowFilters(f => !f)}
          onChange={(v) => setParams(v ? { q: v } : {})}
          placeholder="Search courses, providers, categories..."/>

        {q.trim() && (
          <p className="mt-3 text-sm text-ink-secondary">
            {total} results for "<span className="text-ink-primary font-medium">{q}</span>"
          </p>
        )}

        {/* TOP FILTERS */}
        {showFilters && (
          <div className="lg:hidden flex flex-wrap gap-2 rounded-xl2 border border-base-border 
                    bg-base-panel p-3 text-xs text-ink-secondary mt-2">
            <button onClick={() => setShowFilters(false)} 
                    className="ml-auto flex items-center gap-1 text-ink-muted">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <div className="relative w-full flex overflow-x-auto gap-2">
            {FilterChipOption.map(o =>(
              <FilterChip key={o.label}
                  label={o.label}
                  options={o.options}
                  value={o.value}
                  onSelectChange={o.onSelectChange}/>
            ))}
            </div>
          </div>
        )}
        <div className="mt-3 flex gap-1 border-b border-base-border overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                tab === t.key ? "border-orival text-orival" : "border-transparent text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {t.label} {t.count > 0 && <span className="text-ink-muted">({t.count})</span>}
            </button>
          ))}
        </div>
        <div className={`${(tab === "all" || tab === "courses")?"grid grid-cols-1":""} 
                        lg:grid-cols-[220px_1fr] gap-6 mt-5 pb-8`}>

          {/* SIDE FILTERS */}
          {(tab === "all" || tab === "courses")&&
            <aside className="hidden lg:flex flex-col gap-5" ref={filterListRef}>
              <FilterGroup title="Category" options={categories.slice(0, 6).map((c) => c.name)} 
                           onChange={setCategory} value={category}/>
              <FilterGroup title="Learning mode" options={["In-Person", "Online", "Hybrid"]} 
                           onChange={setLearningMode} value={learningMode}/>
              <FilterGroup title="Level" options={["All levels","advanced", "Intermediate","Beginner"]} 
                           onChange={setLevel} value={level}/>
              <FilterGroup title="Price" options={["Under 8,000 DZD", "8,000–15,000 DZD", "15,000+ DZD"]} 
                           onChange={setPrice} value={price}/>
              <FilterGroup title="Rating" options={["4.5 & up", "4.0 & up", "3.5 & up"]} 
                           onChange={setRating} value={rating}/>
            </aside>
          }

          {/* RESULT AREA */}
          <div className="flex flex-col gap-6">
            {(tab === "all" || tab === "courses") && matchedCourses.length > 0 && (
              <section>
                <h2 className="font-display text-base font-semibold mb-2.5 text-ink-primary">Courses</h2>
                <div className="flex flex-col gap-2.5">
                  {matchedCourses.slice(0, tab === "courses" ? undefined : 5).map((c) => (
                    <CourseListItem key={c.id} course={c} />
                  ))}
                </div>
              </section>
            )}
            {(tab === "all" || tab === "providers") && matchedProviders.length > 0 && (
              <section>
                <h2 className="font-display text-base font-semibold mb-2.5 text-ink-primary">Providers</h2>
                <div className="flex flex-col gap-2.5">
                  {matchedProviders.slice(0, tab === "providers" ? undefined : 5).map((p) => (
                    <ProviderListRow key={p.id} provider={p} meta={p.location ? `${p.location.city}, ${p.location.country}` : "Online"} />
                  ))}
                </div>
              </section>
            )}
            {(tab === "all" || tab === "categories") && matchedCategories.length > 0 && (
              <section>
                <h2 className="font-display text-base font-semibold mb-2.5 text-ink-primary">Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {matchedCategories.map((c) => (
                    <CategoryCard key={c.id} category={c} size="sm" />
                  ))}
                </div>
              </section>
            )}
            {total === 0 && (
              <p className="text-sm text-ink-muted py-10 text-center">
                No results found  {q?`for "${q}"`:""}.
                </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, options,onChange ,value}
  :{ title: string; options: string[];onChange:React.Dispatch<React.SetStateAction<string>>,value?:string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-ink-muted mb-2">{title}</h3>
      <div className="flex flex-col gap-1.5">
        {options.map((o) => {
          return (
          <label  key={o} 
                  className="flex items-center gap-2 text-sm text-ink-secondary 
                            hover:text-ink-primary 
                            cursor-pointer label-filter select-none"
                  onClick={()=>{
                    onChange(o);
                  }}>
                  

            <input name={`check-${title}`} type="radio"
                    checked={value === o?true:false}
                    onChange={()=> 0}
                   className="h-3.5 w-3.5 rounded border-base-border2 accent-orival"/>
            {o}
          </label>)
        })}
      </div>
    </div>
  );
}
