import { useEffect, useRef, useState, type ReactNode } from "react";

/** Scroll-reveal: fades content in once. CSS disables it under prefers-reduced-motion. */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={shown ? "translate-y-0 opacity-100 transition duration-500 ease-out" : "translate-y-3.5 opacity-0 transition duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100"}>
      {children}
    </div>
  );
}
