import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../context/api-context";
import { useI18n } from "../i18n/i18n-context";
import { AuthError } from "../lib/auth";
import { safeNext } from "../lib/text";
import type { Key } from "../i18n/en";

type Mode = "signin" | "signup";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** One page, two clearly separate modes: Sign in (existing account) and Create account (new). */
export default function Auth({ mode }: { mode: Mode }) {
  const { user, signIn, signUp, getCourse, getVideo } = useApi();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "password" | "form", Key>>>({});
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={next ?? "/"} replace />;

  // If the visitor was sent here from a video, say which one.
  const course = next?.match(/^\/course\/([^/?]+)\/learn/);
  const video = next?.match(/^\/video\/([^/?]+)\/watch/);
  const targetTitle = course ? getCourse(decodeURIComponent(course[1]))?.title : video ? getVideo(decodeURIComponent(video[1]))?.title : undefined;
  const gated = Boolean(course || video);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (mode === "signup" && !name.trim()) errs.name = "auth.err.name";
    if (!EMAIL.test(email.trim())) errs.email = "auth.err.email";
    if (!password) errs.password = "auth.err.passwordRequired";
    else if (mode === "signup" && password.length < 8) errs.password = "auth.err.passwordShort";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      if (mode === "signup") await signUp(name, email, password);
      else await signIn(email, password);
      navigate(next ?? "/", { replace: true });
    } catch (err) {
      const code = err instanceof AuthError ? err.code : null;
      setErrors({ form: code === "EMAIL_TAKEN" ? "auth.err.taken" : code === "INVALID_CREDENTIALS" ? "auth.err.invalid" : "auth.err.generic" });
    } finally {
      setBusy(false);
    }
  };

  const q = next ? `?next=${encodeURIComponent(next)}` : "";
  const title = mode === "signin" ? t("auth.signIn.title") : t("auth.signUp.title");

  return (
    <div className="auth">
      <aside className="auth__panel">
        <Link to="/" className="logo" aria-label="Orival">Orival</Link>
        <div className="stack">
          <h2>{t("auth.panelTitle")}</h2>
          <p>{t("auth.panelBody")}</p>
        </div>
        <Link className="link" to="/" style={{ color: "var(--orange-500)" }}>{t("auth.backHome")}</Link>
      </aside>
      <main className="auth__form" id="main">
        <div className="auth__form-inner">
          <div className="spread">
            <nav className="auth__mode" aria-label={title}>
              <Link to={`/signin${q}`} aria-current={mode === "signin" ? "page" : undefined}>{t("auth.signIn.title")}</Link>
              <Link to={`/signup${q}`} aria-current={mode === "signup" ? "page" : undefined}>{t("auth.signUp.title")}</Link>
            </nav>
            <button className="lang-btn" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")} aria-label={t("nav.languageLabel")}>{t("nav.language")}</button>
          </div>

          <div className="stack">
            <h1>{title}</h1>
            <p className="muted">{mode === "signin" ? t("auth.signIn.lede") : t("auth.signUp.lede")}</p>
          </div>

          {gated && <p className="alert" role="note">{targetTitle ? t("auth.gate", { title: targetTitle }) : t("auth.gateGeneric")}</p>}
          {errors.form && <p className="alert alert--error" role="alert">{t(errors.form)}</p>}

          <form className="stack" onSubmit={submit} noValidate>
            {mode === "signup" && (
              <div className="field">
                <label htmlFor="name">{t("auth.name")}</label>
                <input id="name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-e" : undefined} />
                {errors.name && <span id="name-e" className="field__error">{t(errors.name)}</span>}
              </div>
            )}
            <div className="field">
              <label htmlFor="email">{t("auth.email")}</label>
              <input id="email" type="email" dir="ltr" className="input" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-e" : undefined} />
              {errors.email && <span id="email-e" className="field__error">{t(errors.email)}</span>}
            </div>
            <div className="field">
              <label htmlFor="password">{t("auth.password")}</label>
              <div style={{ position: "relative" }}>
                <input id="password" type={show ? "text" : "password"} dir="ltr" className="input" style={{ paddingInlineEnd: 48 }} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "pw-e" : undefined} />
                <button type="button" className="icon-btn" style={{ position: "absolute", insetInlineEnd: 2, top: 2 }} aria-label={show ? t("auth.hide") : t("auth.show")} aria-pressed={show} onClick={() => setShow((s) => !s)}>
                  <i className={`fa-regular ${show ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
                </button>
              </div>
              {errors.password && <span id="pw-e" className="field__error">{t(errors.password)}</span>}
            </div>
            <button className="btn btn--accent" type="submit" disabled={busy}>{busy ? t("auth.submitting") : title}</button>
          </form>

          <p className="muted">
            {mode === "signin" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
            <Link className="link" to={mode === "signin" ? `/signup${q}` : `/signin${q}`}>{mode === "signin" ? t("auth.signUp.title") : t("auth.signIn.title")}</Link>
          </p>
          <p className="field__hint">{t("auth.proto")}</p>
        </div>
      </main>
    </div>
  );
}
