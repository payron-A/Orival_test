import type { Review } from "../../types/courses";
import { Rating } from "../ui/Rating";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex gap-3">
      <img src={review.authorAvatarUrl} className="h-9 w-9 rounded-full object-cover shrink-0" alt="" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink-primary">{review.authorName}</span>
          <span className="text-xs text-ink-muted">{review.date}</span>
        </div>
        <Rating value={review.rating} />
        <p className="mt-1 text-sm text-ink-secondary leading-relaxed">{review.comment}</p>
      </div>
    </div>
  );
}