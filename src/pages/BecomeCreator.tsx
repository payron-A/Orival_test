import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { PageHead } from "../components/common/PageHead";
import { ApplicationStatus } from "../components/creator/ApplicationStatus";
import type { Key } from "../i18n/en";

export default function BecomeCreator() {
  const { user, isCreator, applyForCreator } = useApi();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [experience, setExperience] = useState("");
  const [expertise, setExpertise] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [errors, setErrors] = useState<{ experience?: Key; expertise?: Key }>({});

  if (!user) return <Navigate to="/signin?next=%2Fbecome-creator" replace />;
  const app = user.creatorApplication;

  if (isCreator) {
    return (
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12" style={{ maxWidth: 720 }}>
        <PageHead eyebrow={t("common.creator")} title={t("apply.title")} lede={t("apply.alreadyCreator")} />
        <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-orange-500 bg-orange-500 text-ink hover:bg-[#fb8a3c]" to="/studio">{t("dash.openStudio")}</Link>
      </div>
    );
  }
  if (app?.status === "pending") {
    return (
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12" style={{ maxWidth: 720 }}>
        <PageHead eyebrow={t("common.creator")} title={t("apply.title")} />
        <ApplicationStatus app={app} />
      </div>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (experience.trim().length < 20) errs.experience = "apply.err.experience";
    if (!expertise.trim()) errs.expertise = "apply.err.expertise";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    applyForCreator({ experience: experience.trim(), expertise: expertise.trim(), qualifications: qualifications.trim() });
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto w-full max-w-page px-4 sm:px-6 animate-page-in pb-24 pt-8 min-[960px]:pb-18 min-[960px]:pt-12" style={{ maxWidth: 720 }}>
      <PageHead eyebrow={t("common.creator")} title={t("apply.title")} lede={t("apply.lede")} />
      {app?.status === "rejected" && <div className="border-s-[3px] px-4 py-3 text-sm border-orange-500 bg-mist" style={{ marginBlockEnd: 24 }}><ApplicationStatus app={app} /></div>}
      <form className="space-y-4" onSubmit={submit} noValidate>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="a-exp">{t("apply.experience")}</label>
          <textarea id="a-exp" className="min-h-28 w-full resize-y rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={experience} onChange={(e) => setExperience(e.target.value)} aria-invalid={Boolean(errors.experience)} />
          {errors.experience && <span className="text-sm text-danger">{t(errors.experience)}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="a-ex">{t("apply.expertise")}</label>
          <input id="a-ex" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={expertise} onChange={(e) => setExpertise(e.target.value)} aria-invalid={Boolean(errors.expertise)} />
          {errors.expertise && <span className="text-sm text-danger">{t(errors.expertise)}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="a-q">{t("apply.qualifications")} <span className="text-muted">({t("common.optional")})</span></label>
          <textarea id="a-q" className="min-h-28 w-full resize-y rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" value={qualifications} onChange={(e) => setQualifications(e.target.value)} />
          <span className="text-sm text-muted">{t("apply.qualificationsHint")}</span>
        </div>
        <p className="border-s-[3px] px-4 py-3 text-sm border-ink bg-mist">{t("apply.free")}</p>
        <div><button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-orange-500 bg-orange-500 text-ink hover:bg-[#fb8a3c]" type="submit">{t("apply.submit")}</button></div>
      </form>
    </div>
  );
}
