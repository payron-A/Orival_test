import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type FilterChipOption = { key: string; value: string };

export function FilterChip({
  label,
  active,
  onClick,
  options,
  value,
  onSelectChange,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  options?: FilterChipOption[];
  value?: string;
  onSelectChange?: (value: string) => void;
}) {

// _____ ELEMENTS _____
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

// _____ STATE _____
//___Option List:
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

// _____ OPTION LIST _____
//___Manage Options:
  const hasOptions = !!options?.length;
  const selectedOption = options?.find((o) => o.value === value);
  const isActive = active || open || !!selectedOption;  
  const displayLabel = selectedOption?.value ?? label; 
  
//___Show Option List: 
  const handleButtonClick = () => {
    if (hasOptions) {
      setOpen((o) => !o);
    } else {
      onClick?.();
    }
  };
//___Set Select Option:  
  const handlePick = (opt: FilterChipOption) => {
    onSelectChange?.(opt.value);
    setOpen(false);
  };

//___Position Of Option List:  
  const updatePosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

//___Keep it Aligned With button (while Scroll):
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

//___Close on Outside click (Checks both the button and the portaled menu)
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

//___Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);


  return (
    <div className="relative flex-1" style={{ minWidth: "110px", maxWidth: "120px" }}>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        aria-haspopup={hasOptions ? "listbox" : undefined}
        aria-expanded={hasOptions ? open : undefined}
        className={`w-full flex items-center justify-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-orival border-orival text-black"
            : "bg-base-panel border-base-border text-ink-secondary hover:text-ink-primary hover:border-base-border2"
        }`}>
        <span className="truncate">{displayLabel}</span>
        {hasOptions && (
          <i className={`fa-solid fa-chevron-down text-[10px] transition-transform 
              ${open ? "rotate-180" : ""}`}/>
        )}
      </button>

      {/* Options List */}
      {hasOptions && open && menuPos && createPortal(
        <div
          ref={menuRef}
          role="listbox"
          className="z-[999] overflow-hidden rounded-xl2 border border-base-border
            bg-base-panel shadow-lg py-1"
          style={{position: "fixed",top: menuPos.top,left: menuPos.left,minWidth: menuPos.width,
            width: "max-content",maxWidth: 200,zIndex: 50
          }}>
          {options!.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.key}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  return handlePick(opt)}}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm 
                  transition-colors ${isSelected? "text-ink-primary font-medium"
                  :"text-ink-secondary hover:text-ink-primary hover:bg-base-border/40"}`}
                style={{zIndex:"50"}}>
                  <span className="truncate">{opt.value}</span>
                  {isSelected && <i className="fa-solid fa-check text-xs text-orival" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}