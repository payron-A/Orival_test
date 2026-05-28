import { Link } from "react-router-dom";
import type { Provider } from "../../types";
import { Rating } from "../ui/Rating";

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Link
      to={`/provider/${provider.id}`}
      className="flex flex-col items-center gap-2 rounded-xl2 border border-base-border bg-base-panel p-4 text-center hover:border-base-border2 transition-colors"
    >
      <img src={provider.avatarUrl} alt={provider.name} className="h-14 w-14 rounded-full object-cover" />
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold text-ink-primary line-clamp-1">{provider.name}</span>
        {provider.verified && <i className="fa-solid fa-home"></i>}
      </div>
      <Rating value={provider.rating} />
    </Link>
  );
}

export function ProviderListRow({ provider, meta }: { provider: Provider; meta?: string }) {
  return (
    <Link
      to={`/provider/${provider.id}`}
      className="flex items-center gap-3 rounded-xl2 border border-base-border bg-base-panel p-2.5 hover:border-base-border2 transition-colors"
    >
      <img src={provider.avatarUrl} alt={provider.name} className="h-11 w-11 rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-ink-primary line-clamp-1">{provider.name}</span>
          
        </div>
        <span className="text-xs text-ink-muted">{meta ?? `${provider.followerCount.toLocaleString()} followers`}</span>
      </div>
      <i className="fa-solid fa-arrow-right text-ink-primary"/>
    </Link>
  );
}
