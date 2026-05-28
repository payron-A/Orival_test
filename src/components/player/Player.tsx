import { useEffect, useRef, useState, type KeyboardEvent, type SyntheticEvent } from "react";
import { useI18n } from "../../i18n/i18n-context";

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${r}` : `${m}:${r}`;
}

interface Props {
  src?: string;
  captionsUrl?: string;
  title: string;
  onPrev?: () => void;
  onNext?: () => void;
}

/**
 * Prototype player built on the native <video> element. Every control drives the real media
 * element. With no `src` it shows an explicit "no media" state — it never fakes playback from a thumbnail.
 * The seek bar is a media control (time position), not a learning-progress indicator.
 * Parent should pass `key={src}` so state resets per source.
 */
export function Player({ src, captionsUrl, title, onPrev, onNext }: Props) {
  const { t } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const idleTimer = useRef<number | undefined>(undefined);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [menu, setMenu] = useState(false);
  const [full, setFull] = useState(false);
  const [caps, setCaps] = useState(false);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === box.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      window.clearTimeout(idleTimer.current);
    };
  }, []);

  if (!src) {
    return (
      <div className="player" role="region" aria-label={title}>
        <span className="player__badge">{t("watch.prototype")}</span>
        <div className="player__overlay" role="status">
          <i className="fa-regular fa-circle-play" style={{ fontSize: 40, color: "var(--orange-500)" }} aria-hidden="true" />
          <h3>{t("watch.noMediaTitle")}</h3>
          <p>{t("watch.noMediaBody")}</p>
        </div>
      </div>
    );
  }

  const v = () => video.current;
  const toggle = () => {
    const el = v();
    if (!el) return;
    if (el.paused) el.play().catch(() => undefined);
    else el.pause();
  };
  const seekTo = (s: number) => {
    const el = v();
    if (el) el.currentTime = Math.min(Math.max(s, 0), dur || s);
  };
  const wake = () => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2600);
  };
  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    else box.current?.requestFullscreen?.().catch(() => undefined);
  };
  const applyRate = (r: number) => {
    setRate(r);
    if (v()) v()!.playbackRate = r;
    setMenu(false);
  };
  const setCaptions = (on: boolean) => {
    setCaps(on);
    const track = v()?.textTracks[0];
    if (track) track.mode = on ? "showing" : "hidden";
  };
  const onMeta = (e: SyntheticEvent<HTMLVideoElement>) => {
    setDur(e.currentTarget.duration);
    setStatus("ready");
    const track = e.currentTarget.textTracks[0];
    if (track) track.mode = "hidden";
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return; // let focused buttons/sliders behave natively
    if (e.key === " " || e.key.toLowerCase() === "k") { e.preventDefault(); toggle(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); seekTo(cur + 5); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); seekTo(cur - 5); }
    else if (e.key.toLowerCase() === "m") { const el = v(); if (el) el.muted = !el.muted; }
    else if (e.key.toLowerCase() === "f") { e.preventDefault(); toggleFull(); }
  };

  const fill = dur ? `${(cur / dur) * 100}%` : "0%";

  return (
    <div
      ref={box}
      className="player"
      tabIndex={0}
      role="region"
      aria-label={title}
      data-idle={playing && idle}
      onMouseMove={wake}
      onKeyDown={onKey}
    >
      <video
        key={attempt}
        ref={video}
        src={src}
        preload="metadata"
        playsInline
        onClick={toggle}
        onLoadedMetadata={onMeta}
        onWaiting={() => setStatus("loading")}
        onCanPlay={() => setStatus("ready")}
        onError={() => setStatus("error")}
        onPlay={() => { setPlaying(true); wake(); }}
        onPause={() => { setPlaying(false); setIdle(false); }}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDur(e.currentTarget.duration)}
        onVolumeChange={(e) => { setVol(e.currentTarget.volume); setMuted(e.currentTarget.muted); }}
      >
        {captionsUrl && <track kind="subtitles" src={captionsUrl} label={t("watch.captions")} />}
      </video>

      {status === "loading" && (
        <div className="player__overlay" style={{ background: "rgb(0 0 0 / 0.55)", pointerEvents: "none" }} role="status">
          <span className="player__spinner" aria-hidden="true" />
          <p>{t("watch.loading")}</p>
        </div>
      )}
      {status === "error" && (
        <div className="player__overlay" role="alert">
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 32, color: "var(--orange-500)" }} aria-hidden="true" />
          <h3>{t("watch.errorTitle")}</h3>
          <p>{t("watch.errorBody")}</p>
          <button className="btn btn--accent btn--sm" onClick={() => { setStatus("loading"); setAttempt((a) => a + 1); }}>{t("watch.retry")}</button>
        </div>
      )}
      {status === "ready" && !playing && (
        <button className="player__bigplay" aria-label={t("watch.play")} onClick={toggle}>
          <span><i className="fa-solid fa-play" aria-hidden="true" /></span>
        </button>
      )}

      {status !== "error" && (
        <div className="player__controls">
          <input
            className="player__seek"
            type="range"
            min={0}
            max={dur || 0}
            step={0.1}
            value={Math.min(cur, dur || 0)}
            style={{ ["--fill" as string]: fill }}
            aria-label={t("watch.seek")}
            aria-valuetext={`${fmt(cur)} / ${fmt(dur)}`}
            disabled={!dur}
            onChange={(e) => seekTo(Number(e.target.value))}
          />
          <div className="player__bar">
            <button className="player__btn" disabled={!onPrev} onClick={onPrev} aria-label={t("watch.prev")}><i className="fa-solid fa-backward-step i-dir" aria-hidden="true" /></button>
            <button className="player__btn" onClick={toggle} aria-label={playing ? t("watch.pause") : t("watch.play")}>
              <i className={`fa-solid ${playing ? "fa-pause" : "fa-play"}`} aria-hidden="true" />
            </button>
            <button className="player__btn" disabled={!onNext} onClick={onNext} aria-label={t("watch.next")}><i className="fa-solid fa-forward-step i-dir" aria-hidden="true" /></button>
            <button className="player__btn" aria-pressed={muted || vol === 0} onClick={() => { const el = v(); if (el) el.muted = !el.muted; }} aria-label={muted ? t("watch.unmute") : t("watch.mute")}>
              <i className={`fa-solid ${muted || vol === 0 ? "fa-volume-xmark" : "fa-volume-high"}`} aria-hidden="true" />
            </button>
            <input
              className="player__vol"
              type="range" min={0} max={1} step={0.05}
              value={muted ? 0 : vol}
              style={{ ["--fill" as string]: `${(muted ? 0 : vol) * 100}%` }}
              aria-label={t("watch.volume")}
              onChange={(e) => { const el = v(); if (el) { el.volume = Number(e.target.value); el.muted = Number(e.target.value) === 0; } }}
            />
            <span className="player__time">{fmt(cur)} / {fmt(dur)}</span>
            <span className="player__spacer" />
            {captionsUrl && (
              <button className="player__btn" aria-pressed={caps} onClick={() => setCaptions(!caps)} aria-label={caps ? t("watch.captionsOn") : t("watch.captionsOff")}>
                <i className="fa-regular fa-closed-captioning" aria-hidden="true" />
              </button>
            )}
            <button className="player__btn" aria-haspopup="menu" aria-expanded={menu} aria-label={t("watch.speed")} onClick={() => setMenu((m) => !m)}>{rate}×</button>
            <button className="player__btn" onClick={toggleFull} aria-label={full ? t("watch.exitFullscreen") : t("watch.fullscreen")}>
              <i className={`fa-solid ${full ? "fa-compress" : "fa-expand"}`} aria-hidden="true" />
            </button>
          </div>
          {menu && (
            <div className="player__menu" role="menu" aria-label={t("watch.speed")}>
              {RATES.map((r) => <button key={r} role="menuitemradio" aria-checked={r === rate} onClick={() => applyRate(r)}>{r}×</button>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
