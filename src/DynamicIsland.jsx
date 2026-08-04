import { useState, useEffect, useRef } from "react";
import {
  FiInstagram, FiTwitter, FiGithub, FiLinkedin, FiMail,
  FiMusic, FiSun, FiMoon, FiCoffee, FiHeadphones,
} from "react-icons/fi";
import { profile } from "./data";
import { usePlayer } from "./PlayerContext";

// ─────────────────────────────────────────────────────────
// Time / greeting helpers
// ─────────────────────────────────────────────────────────
function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function greeting(hour) {
  if (hour < 5) return "still up?";
  if (hour < 12) return "good morning";
  if (hour < 17) return "good afternoon";
  if (hour < 21) return "good evening";
  return "good night";
}

function greetingIcon(hour) {
  if (hour < 5) return <FiMoon />;
  if (hour < 12) return <FiCoffee />;
  if (hour < 21) return <FiSun />;
  return <FiMoon />;
}

function fmtTime(d) {
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function fmtDate(d) {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

// ─────────────────────────────────────────────────────────
// DynamicIsland — mobile only.
// Tap = expand (simple). Tap outside or X = collapse.
// On first appearance, a brief floating hint nudges the user.
// ─────────────────────────────────────────────────────────
export default function DynamicIsland() {
  const now = useNow();
  const player = usePlayer();
  const [expanded, setExpanded] = useState(false);
  const [showFirstHint, setShowFirstHint] = useState(false);
  const islandRef = useRef(null);
  const seenKey = "rh_island_seen";

  // Show "tap me" hint once per session, briefly
  useEffect(() => {
    const seen = typeof window !== "undefined" && sessionStorage.getItem(seenKey);
    if (seen) return;
    const t = setTimeout(() => setShowFirstHint(true), 1200);
    const t2 = setTimeout(() => {
      setShowFirstHint(false);
      try { sessionStorage.setItem(seenKey, "1"); } catch {}
    }, 5200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  // Click outside → collapse
  useEffect(() => {
    if (!expanded) return;
    const onDown = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    // Pointerdown so it fires before any tap on inner links
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [expanded]);

  const toggle = () => {
    setShowFirstHint(false);
    try { sessionStorage.setItem(seenKey, "1"); } catch {}
    setExpanded((v) => !v);
    if (navigator.vibrate) navigator.vibrate(6);
  };

  const hour = now.getHours();
  const np = player.currentTrack;
  const isPlayingNow = player.isPlaying && np && !np.loading;
  const hasLaunched = player.hasIntroPlayed;

  return (
    <div ref={islandRef} className={`island island-${expanded ? "open" : "closed"}`}>
      {!expanded && (
        <button
          type="button"
          className="island-pill"
          onClick={toggle}
          aria-label="Open quick info"
          aria-expanded="false"
        >
          <span className="island-name">{profile.name.toLowerCase()}</span>
          <span className="island-dot" />
          <span className="island-time">{fmtTime(now)}</span>
          {showFirstHint && (
            <span className="island-floating-hint" aria-hidden="true">
              tap me
              <span className="island-floating-hint-arrow" />
            </span>
          )}
        </button>
      )}

      {expanded && (
        <div className="island-card" role="dialog" aria-label="Profile card">
          <div className="island-card-header">
            <div>
              <p className="island-greeting">
                <span className="island-greeting-icon">{greetingIcon(hour)}</span>
                {greeting(hour)}
              </p>
              <p className="island-date">{fmtDate(now)}</p>
            </div>
            <span className="island-card-time">{fmtTime(now)}</span>
          </div>

          <div className="island-divider" />

          <div className="island-section">
            <p className="island-section-label">
              {isPlayingNow ? "now playing" : hasLaunched ? "paused" : "not playing"}
            </p>
            <div className="island-track">
              <div className="island-track-cover">
                {np?.cover ? (
                  <img src={np.cover} alt="" />
                ) : (
                  <FiMusic />
                )}
                {isPlayingNow && (
                  <div className="island-eq" aria-hidden="true">
                    <span /><span /><span />
                  </div>
                )}
              </div>
              <div className="island-track-meta">
                <p className="island-track-title">
                  {np?.title || "no song picked yet"}
                </p>
                <p className="island-track-artist">
                  {np?.artist || "tap below to launch the player"}
                </p>
              </div>
              <button
                type="button"
                className="island-track-launch"
                onClick={() => {
                  setExpanded(false);
                  player.requestPlay(player.currentIndex || 0);
                }}
                aria-label="Open music player"
              >
                <FiHeadphones />
              </button>
            </div>
          </div>

          <div className="island-divider" />

          <div className="island-socials">
            <a href={profile.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
            <a href={profile.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter /></a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FiGithub /></a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email"><FiMail /></a>
          </div>

          <button
            type="button"
            className="island-handle"
            onClick={() => setExpanded(false)}
            aria-label="Close"
          />
        </div>
      )}
    </div>
  );
}
