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
    <div className="grid min-h-screen min-h-dvh animate-page-in grid-cols-1 min-[861px]:grid-cols-2">
      <aside className="flex flex-col justify-between gap-8 bg-ink p-5 text-white min-[861px]:p-12">
        <Link to="/" className="inline-flex items-baseline gap-0.5 font-display text-[1.6rem] font-bold tracking-[-0.03em] after:ms-0.5 after:inline-block after:size-[7px] after:bg-orange-500 after:content-['']" aria-label="Orival">Orival</Link>
        <div className="space-y-4">
          <h2>{t("auth.panelTitle")}</h2>
          <p>{t("auth.panelBody")}</p>
        </div>
        <Link className="font-semibold text-orange-500 underline underline-offset-[3px]" to="/">{t("auth.backHome")}</Link>
      </aside>
      <main className="grid content-center justify-items-center px-4 py-8 min-[861px]:px-8 min-[861px]:py-12" id="main">
        <div className="grid w-full max-w-[400px] gap-6">
          <div className="flex items-center justify-between gap-4">
            <nav className="flex gap-6 border-b border-line" aria-label={title}>
              <Link className="relative py-3 font-semibold text-muted aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-orange-500 aria-[current=page]:after:content-['']" to={`/signin${q}`} aria-current={mode === "signin" ? "page" : undefined}>{t("auth.signIn.title")}</Link>
              <Link className="relative py-3 font-semibold text-muted aria-[current=page]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-px aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-orange-500 aria-[current=page]:after:content-['']" to={`/signup${q}`} aria-current={mode === "signup" ? "page" : undefined}>{t("auth.signUp.title")}</Link>
            </nav>
            <button className="h-10 rounded border border-line bg-transparent px-3 text-sm font-semibold hover:border-ink" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")} aria-label={t("nav.languageLabel")}>{t("nav.language")}</button>
          </div>

          <div className="space-y-4">
            <h1>{title}</h1>
            <p className="text-muted">{mode === "signin" ? t("auth.signIn.lede") : t("auth.signUp.lede")}</p>
          </div>

          {gated && <p className="border-s-[3px] px-4 py-3 text-sm border-orange-500 bg-mist" role="note">{targetTitle ? t("auth.gate", { title: targetTitle }) : t("auth.gateGeneric")}</p>}
          {errors.form && <p className="border-s-[3px] px-4 py-3 text-sm border-danger bg-danger-bg text-danger" role="alert">{t(errors.form)}</p>}

          <form className="space-y-4" onSubmit={submit} noValidate>
            {mode === "signup" && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold" htmlFor="name">{t("auth.name")}</label>
                <input id="name" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-e" : undefined} />
                {errors.name && <span id="name-e" className="text-sm text-danger">{t(errors.name)}</span>}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold" htmlFor="email">{t("auth.email")}</label>
              <input id="email" type="email" dir="ltr" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-e" : undefined} />
              {errors.email && <span id="email-e" className="text-sm text-danger">{t(errors.email)}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold" htmlFor="password">{t("auth.password")}</label>
              <div style={{ position: "relative" }}>
                <input id="password" type={show ? "text" : "password"} dir="ltr" className="min-h-11 w-full rounded border border-muted bg-white px-3 py-2 text-ink transition focus:border-ink focus:outline-none focus:ring-[3px] focus:ring-orange-200 aria-[invalid=true]:border-danger" style={{ paddingInlineEnd: 48 }} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "pw-e" : undefined} />
                <button type="button" className="relative inline-grid size-10 place-items-center rounded border border-transparent bg-transparent text-ink transition-colors hover:bg-mist disabled:opacity-40" style={{ position: "absolute", insetInlineEnd: 2, top: 2 }} aria-label={show ? t("auth.hide") : t("auth.show")} aria-pressed={show} onClick={() => setShow((s) => !s)}>
                  <i className={`fa-regular ${show ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
                </button>
              </div>
              {errors.password && <span id="pw-e" className="text-sm text-danger">{t(errors.password)}</span>}
            </div>
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 text-sm font-semibold transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-45 border-orange-500 bg-orange-500 text-ink hover:bg-[#fb8a3c]" type="submit" disabled={busy}>{busy ? t("auth.submitting") : title}</button>
          </form>

          <p className="text-muted">
            {mode === "signin" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
            <Link className="font-semibold text-orange-700 underline underline-offset-[3px] hover:text-orange-900" to={mode === "signin" ? `/signup${q}` : `/signin${q}`}>{mode === "signin" ? t("auth.signUp.title") : t("auth.signIn.title")}</Link>
          </p>
          <p className="text-sm text-muted">{t("auth.proto")}</p>
        </div>
      </main>
    </div>
  );
}
