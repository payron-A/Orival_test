import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n-context";
import { Empty } from "../components/common/PageHead";

export default function NotFound() {
  const { t } = useI18n();
  return <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12"><Empty title={t("notFound.title")} body={t("notFound.body")} action={<Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-ink bg-ink text-white hover:bg-[#2a2a2a]" to="/">{t("notFound.home")}</Link>} /></div>;
}
