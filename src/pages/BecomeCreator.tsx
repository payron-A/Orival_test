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
      <div className="container page" style={{ maxWidth: 720 }}>
        <PageHead eyebrow={t("common.creator")} title={t("apply.title")} lede={t("apply.alreadyCreator")} />
        <Link className="btn btn--accent" to="/studio">{t("dash.openStudio")}</Link>
      </div>
    );
  }
  if (app?.status === "pending") {
    return (
      <div className="container page" style={{ maxWidth: 720 }}>
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
    <div className="container page" style={{ maxWidth: 720 }}>
      <PageHead eyebrow={t("common.creator")} title={t("apply.title")} lede={t("apply.lede")} />
      {app?.status === "rejected" && <div className="alert" style={{ marginBlockEnd: 24 }}><ApplicationStatus app={app} /></div>}
      <form className="stack" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="a-exp">{t("apply.experience")}</label>
          <textarea id="a-exp" className="textarea" value={experience} onChange={(e) => setExperience(e.target.value)} aria-invalid={Boolean(errors.experience)} />
          {errors.experience && <span className="field__error">{t(errors.experience)}</span>}
        </div>
        <div className="field">
          <label htmlFor="a-ex">{t("apply.expertise")}</label>
          <input id="a-ex" className="input" value={expertise} onChange={(e) => setExpertise(e.target.value)} aria-invalid={Boolean(errors.expertise)} />
          {errors.expertise && <span className="field__error">{t(errors.expertise)}</span>}
        </div>
        <div className="field">
          <label htmlFor="a-q">{t("apply.qualifications")} <span className="muted">({t("common.optional")})</span></label>
          <textarea id="a-q" className="textarea" value={qualifications} onChange={(e) => setQualifications(e.target.value)} />
          <span className="field__hint">{t("apply.qualificationsHint")}</span>
        </div>
        <p className="alert alert--note">{t("apply.free")}</p>
        <div><button className="btn btn--accent" type="submit">{t("apply.submit")}</button></div>
      </form>
    </div>
  );
}
