import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center text-ink-primary">
      <h1 className="font-display text-3xl font-bold">Page not found</h1>
      <p className="text-sm text-ink-secondary">This page doesn't exist, or the course may have been removed.</p>
      <Link to="/" className="mt-2 rounded-lg bg-orival px-4 py-2 text-sm font-semibold text-black hover:bg-orival-bright">
        Back to Home
      </Link>
    </div>
  );
}
