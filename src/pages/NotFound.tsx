import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n-context";
import { Empty } from "../components/common/PageHead";

export default function NotFound() {
  const { t } = useI18n();
  return <div className="container page"><Empty title={t("notFound.title")} body={t("notFound.body")} action={<Link className="btn btn--primary" to="/">{t("notFound.home")}</Link>} /></div>;
}
