import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import "../styles/login.css";
import { api } from "../lib/api";
const FLOATING_PINS = [
  { left: "12%", size: 16, delay: "0s", duration: "7s" },
  { left: "28%", size: 22, delay: "1.4s", duration: "8.5s" },
  { left: "48%", size: 14, delay: "2.6s", duration: "6.5s" },
  { left: "68%", size: 20, delay: "0.8s", duration: "9s" },
  { left: "84%", size: 15, delay: "3.4s", duration: "7.5s" },
];

export default function Login() {
  const { setUser } = useApi();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   if (!email.trim() || !password.trim()) {
  //     return setError("Enter your email and password to continue.");
  //   }
  //   loadUsers();
  //   if(!users)return;
  //   const currentUser = users?.find(u => u.email === email && u.password === password);
  //   if(!currentUser) return setError("wrong email or password");
  //   setError(null);
  //   setUser(currentUser);
  //   // Simulated auth — wire this up to a real endpoint when the backend is ready.
  //   setTimeout(() => {
  //     setLoading(false);
  //     navigate("/");
  //   }, 900);
  // }

  // Users
  // async function getUsers(){
  //   try{
  //     setLoading(true);
  //     const rs = await fetch("users.json");
  //     if(!rs.ok) return setError("Field fetching data, Check your Network");
  //     const data = await rs.json();
  //     return data;
  //   }
  //   catch(error:unknown){
  //     if(error instanceof Error){
  //       setError(error.message);
  //     }
  //   }
  //   finally{
  //     setLoading(false);
  //   }
  // }
  // async function loadUsers(){
  //   const data = await getUsers();
  //   return setUsers(data);
  // }

  

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!email.trim() || !password.trim()) {
    return setError("Enter your email and password to continue.");
  }
  setError(null);
  setLoading(true);
  try {
    const { token, user } = await api<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", token);
    setUser({
      name: user.name,
      handle: "@" + user.email.split("@")[0],
      email: user.email,
      avatarUrl: user.avatarUrl ?? "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=FF7A26&color=0B0C0E",
      location: user.location ?? "",
      joinedAt:"",
    });
    navigate("/");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Login failed");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="login-page">
      {/* Left: brand / location-driven hero */}
      <aside className="login-hero">
        <div className="login-grid" aria-hidden="true" />
        <div className="login-orb login-orb-orange" aria-hidden="true" />
        <div className="login-orb login-orb-blue" aria-hidden="true" />
        {FLOATING_PINS.map((p,i) => (
            <i key={i} 
                className="fa-solid fa-location-pin login-hero__pin"
                style={{
                    textShadow:"0 0 5px #ff7a26",
                    left: p.left,
                    fontSize:p.size,
                    animationDelay: p.delay,
                    animationDuration: p.duration,
                }}>
            </i>
        ))}
        <div className="login-hero__top">
          <Link to="/" className="flex items-center px-5 py-5">
          <img src="orival.png" alt="O" className="w-8"/>
          <span className="font-display text-lg text-ink-primary font-bold tracking-tight">RIVAL</span>
          </Link>
        </div>

        <div className="login-hero__body">
          <h1 className="login-hero__headline">
            Discover what to learn.
            <br />
            Discover <span>where</span> to learn it.
          </h1>
          <p className="login-hero__subtext">
            Sign in to pick up your courses, follow instructors near you, and keep exploring
            skills on the map — in-person, online, or hybrid.
          </p>
        </div>

        <div className="login-hero__stats">
          <div>
            <strong>1,200+</strong>
            <span>Courses</span>
          </div>
          <div>
            <strong>300+</strong>
            <span>Providers</span>
          </div>
          <div>
            <strong>12</strong>
            <span>Cities</span>
          </div>
        </div>
      </aside>

      {/* Right: form */}
      <main className="login-form-panel">
        <div className="login-card">
          <h2 className="login-card__title">Welcome back</h2>
          <p className="login-card__subtitle">Log in to continue learning near you or online.</p>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field" style={{ animationDelay: "0.05s" }}>
              <span className="login-field__label">Email</span>
              <span className="login-field__control">
                <i className="fa-solid fa-envelope text-ink-secondary"></i>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                       placeholder="you@example.com" autoComplete="email"/>
              </span>
            </label>
            <label className="login-field" style={{ animationDelay: "0.12s" }}>
              <span className="login-field__label">Password</span>
              <span className="login-field__control">
                <i className="fa-solid fa-lock text-ink-secondary"></i>
                <input type={showPassword ? "text" : "password"} value={password}
                       onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                       autoComplete="current-password"/>
                <button type="button" className="login-field__toggle"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <i className="fa-solid fa-eye text-ink-muted"/> 
                                : <i className="fa-solid fa-eye-slash text-ink-muted" />
                  }
                </button>
              </span>
            </label>
            {error && <p className="login-error" style={{ animationDelay: "0.16s" }}>{error}</p>}
            <div className="login-row" style={{ animationDelay: "0.19s" }}>
              <label className="login-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/" className="login-link">Forgot password?</Link>
            </div>
            <button type="submit" className="login-submit" style={{ animationDelay: "0.24s" }} disabled={loading}>
              {loading ? (
                <span className="login-spinner" aria-hidden="true" />
              ) : (
                <>
                  Log In <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>
          <p className="login-footnote" style={{ animationDelay: "0.3s" }}>
            New to ORIVAL?{" "}
            <Link to="/" className="login-link">Explore courses without an account</Link>
          </p>
        </div>
      </main>
    </div>
  );
}