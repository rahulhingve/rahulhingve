import { useState, useEffect, useRef } from "react";
import {
  FiInstagram, FiTwitter, FiGithub, FiLinkedin, FiMail,
  FiMusic, FiExternalLink, FiSun, FiMoon, FiCoffee,
} from "react-icons/fi";
import { profile } from "./data";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30); // every 30s is fine
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
  if (hour < 17) return <FiSun />;
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
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

// ─────────────────────────────────────────────────────────
// DynamicIsland
// States: 'collapsed' (default pill) → 'hint' (tap once shows "hold to expand")
//         → 'expanded' (held / long pressed)
// Auto-collapses after 8s of no interaction in expanded state.
// ─────────────────────────────────────────────────────────
const HOLD_MS = 320;
const HINT_MS = 1600;
const AUTO_COLLAPSE_MS = 8000;

export default function DynamicIsland({ nowPlaying }) {
  const now = useNow();
  const [state, setState] = useState("collapsed"); // collapsed | hint | expanded
  const holdTimer = useRef(null);
  const hintTimer = useRef(null);
  const collapseTimer = useRef(null);
  const islandRef = useRef(null);

  const hour = now.getHours();
  const greet = greeting(hour);

  // Reset auto-collapse timer on any interaction while expanded
  const armCollapse = () => {
    clearTimeout(collapseTimer.current);
    collapseTimer.current = setTimeout(() => {
      setState("collapsed");
    }, AUTO_COLLAPSE_MS);
  };

  useEffect(() => {
    if (state === "expanded") armCollapse();
    return () => clearTimeout(collapseTimer.current);
  }, [state]);

  // Click outside to collapse
  useEffect(() => {
    if (state === "collapsed") return;
    const onDocDown = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        setState("collapsed");
      }
    };
    document.addEventListener("pointerdown", onDocDown);
    return () => document.removeEventListener("pointerdown", onDocDown);
  }, [state]);

  // Press-and-hold logic
  const onPointerDown = (e) => {
    e.stopPropagation();
    if (state === "expanded") {
      // Already expanded — keep it open, reset timer
      armCollapse();
      return;
    }
    // Start hold timer — if user holds long enough, expand
    holdTimer.current = setTimeout(() => {
      setState("expanded");
      // Haptic feedback if supported
      if (navigator.vibrate) navigator.vibrate(8);
    }, HOLD_MS);
  };

  const onPointerUp = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
      // Quick tap (released before hold fires) → show hint
      if (state === "collapsed") {
        setState("hint");
        clearTimeout(hintTimer.current);
        hintTimer.current = setTimeout(() => {
          setState((s) => (s === "hint" ? "collapsed" : s));
        }, HINT_MS);
      }
    }
  };

  const onPointerCancel = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  return (
    <div
      ref={islandRef}
      className={`island island-${state}`}
      role="button"
      tabIndex={0}
      aria-label={state === "expanded" ? "Profile card" : "Tap and hold to expand"}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerCancel}
      onPointerCancel={onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* COLLAPSED — pill with name + time */}
      {(state === "collapsed" || state === "hint") && (
        <div className="island-pill">
          <span className="island-name">{profile.name.toLowerCase()}</span>
          <span className="island-dot" />
          <span className="island-time">{fmtTime(now)}</span>
          {state === "hint" && (
            <span className="island-hint">hold to expand</span>
          )}
        </div>
      )}

      {/* EXPANDED — card */}
      {state === "expanded" && (
        <div className="island-card" onPointerDown={(e) => e.stopPropagation()}>
          <div className="island-card-header">
            <div>
              <p className="island-greeting">
                <span className="island-greeting-icon">{greetingIcon(hour)}</span>
                {greet}
              </p>
              <p className="island-date">{fmtDate(now)}</p>
            </div>
            <span className="island-card-time">{fmtTime(now)}</span>
          </div>

          <div className="island-divider" />

          {/* Now / Last playing */}
          <div className="island-section">
            <p className="island-section-label">
              {nowPlaying?.isPlaying ? "now playing" : "last played"}
            </p>
            <div className="island-track">
              <div className="island-track-cover">
                {nowPlaying?.cover ? (
                  <img src={nowPlaying.cover} alt="" />
                ) : (
                  <FiMusic />
                )}
                {nowPlaying?.isPlaying && (
                  <div className="island-eq" aria-hidden="true">
                    <span /><span /><span />
                  </div>
                )}
              </div>
              <div className="island-track-meta">
                <p className="island-track-title">
                  {nowPlaying?.title || "press play on a song"}
                </p>
                <p className="island-track-artist">
                  {nowPlaying?.artist || "scroll down to start listening"}
                </p>
              </div>
              <a
                href="#music"
                className="island-track-link"
                onClick={() => onPointerCancel()}
                aria-label="Go to music section"
              >
                <FiExternalLink />
              </a>
            </div>
          </div>

          <div className="island-divider" />

          {/* Socials */}
          <div className="island-socials">
            <a href={profile.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href={profile.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FiGithub />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email">
              <FiMail />
            </a>
          </div>

          {/* Drag handle */}
          <div className="island-handle" />
        </div>
      )}
    </div>
  );
}
