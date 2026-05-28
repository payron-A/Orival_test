import { useState } from "react";

export function SearchBar({
  placeholder = "Search skills, courses, instructors...",
  value,
  onChange,
  onSubmit,
  withFilterButton,
  onFilterClick,
  size = "md",
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
  withFilterButton?: boolean;
  onFilterClick?: () => void;
  size?: "md" | "lg";
}) {
  const [internal, setInternal] = useState(value ?? "");
  const current = value ?? internal;
  const pad = size === "lg" ? "py-3.5 text-[15px]" : "py-2.5 text-sm";

  return (
    <form className="flex items-center gap-2 w-full"
          onSubmit={(e) => {
              e.preventDefault();
              onSubmit?.(current);
          }}>
            
      {/* INPUT */}
      <div className={`flex items-center flex-1 gap-2.5 rounded-xl2 border border-base-border 
              bg-base-panel px-4 ${pad} focus-within:border-orival/50 transition-colors`}>
          <i className="fa-solid fa-search text-ink-muted"></i>
          <input
              className="w-full bg-transparent outline-none placeholder:text-ink-muted text-ink-primary"
              value={current}
              onChange={(e) => {
                setInternal(e.target.value);
                onChange?.(e.target.value);
              }}
              placeholder={placeholder}/>
      </div>

      {/* FILTER BUTTON */}
      {withFilterButton && (
        <button
            type="button"
            onClick={onFilterClick}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl2 border border-base-border bg-base-panel px-3.5 py-2.5 text-sm text-ink-secondary hover:text-ink-primary hover:border-base-border2">
              <i className="fa-solid fa-sliders text-ink-muted"></i>
          <span className="hidden sm:inline">Filters</span>
        </button>
      )}
    </form>
  );
}
