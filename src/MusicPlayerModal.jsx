import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiVolume2, FiVolumeX, FiMusic, FiMinimize2,
  FiLoader, FiHeadphones, FiList, FiAlignLeft,
} from "react-icons/fi";
import { usePlayer } from "./PlayerContext";

const fmt = (sec) => {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ─────────────────────────────────────────────────────────
// MusicPlayerModal
// Full-surface player. Has two visible states inside:
//   intro — first launch, "put your headphones on" screen
//   ready — full player with cover, controls, queue, synced lyrics
// ─────────────────────────────────────────────────────────
export default function MusicPlayerModal() {
  const {
    phase, modalOpen,
    tracks, currentTrack, currentIndex,
    isPlaying, progress, duration, volume, isMuted, hasError,
    togglePlay, playIndex, next, prev, seek,
    setVolume, setIsMuted,
    minimize,
  } = usePlayer();

  const [view, setView] = useState("lyrics"); // "lyrics" | "queue"
  const overlayRef = useRef(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!modalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [modalOpen]);

  // Esc to minimize
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") minimize();
      if (e.key === " " && phase === "ready") { e.preventDefault(); togglePlay(); }
      if (e.key === "ArrowRight" && phase === "ready") next();
      if (e.key === "ArrowLeft" && phase === "ready") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, phase, minimize, togglePlay, next, prev]);

  // Lyrics: active line index based on progress
  const activeLyricIdx = useMemo(() => {
    if (!currentTrack?.lyrics?.length) return -1;
    let idx = -1;
    for (let i = 0; i < currentTrack.lyrics.length; i++) {
      const t = currentTrack.lyrics[i].time;
      if (t == null) continue;
      if (t <= progress + 0.05) idx = i;
      else break;
    }
    return idx;
  }, [progress, currentTrack]);

  if (!modalOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="player-modal-overlay"
      onClick={(e) => { if (e.target === overlayRef.current) minimize(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Music player"
    >
      {/* Background blur — derived from current cover */}
      <div className="player-modal-bg" aria-hidden="true">
        {currentTrack?.cover && (
          <img src={currentTrack.cover} alt="" />
        )}
        <div className="player-modal-bg-tint" />
      </div>

      <div className="player-modal-shell" onClick={(e) => e.stopPropagation()}>
        {phase === "intro" ? (
          <IntroScreen track={currentTrack} />
        ) : (
          <PlayerSurface
            view={view}
            setView={setView}
            tracks={tracks}
            currentTrack={currentTrack}
            currentIndex={currentIndex}
            activeLyricIdx={activeLyricIdx}
            isPlaying={isPlaying}
            progress={progress}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            hasError={hasError}
            togglePlay={togglePlay}
            playIndex={playIndex}
            next={next}
            prev={prev}
            seek={seek}
            setVolume={setVolume}
            setIsMuted={setIsMuted}
          />
        )}

        {/* Top-right controls — always visible */}
        <div className="player-modal-topbar">
          <span className="player-modal-brand">
            <FiMusic /> rahul's tape
          </span>
          <div className="player-modal-actions">
            <button
              className="player-icon-btn"
              onClick={minimize}
              aria-label="Minimize player"
              title="minimize (esc)"
            >
              <FiMinimize2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Intro screen — first launch only
// ─────────────────────────────────────────────────────────
function IntroScreen({ track }) {
  return (
    <div className="player-intro">
      <div className="player-intro-icon">
        <FiHeadphones />
      </div>
      <h2 className="player-intro-title">
        hold on a second
      </h2>
      <p className="player-intro-text">
        please put your headphones on for the best experience.<br />
        we're warming up the tape…
      </p>
      <div className="player-intro-loader">
        <span className="player-intro-dot" />
        <span className="player-intro-dot" />
        <span className="player-intro-dot" />
      </div>
      {track && (
        <p className="player-intro-meta">
          {track.loading ? "fetching the song…" : `up first: ${track.title}`}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PlayerSurface — full player (cover, controls, lyrics/queue)
// ─────────────────────────────────────────────────────────
function PlayerSurface({
  view, setView, tracks, currentTrack, currentIndex, activeLyricIdx,
  isPlaying, progress, duration, volume, isMuted, hasError,
  togglePlay, playIndex, next, prev, seek,
  setVolume, setIsMuted,
}) {
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);
  const trackRef = useRef(null);

  const onScrub = (clientX) => {
    if (!trackRef.current || !duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setScrubValue(ratio * duration);
  };

  const startScrub = (e) => {
    e.preventDefault();
    setScrubbing(true);
    onScrub(e.clientX ?? e.touches?.[0]?.clientX);
  };

  useEffect(() => {
    if (!scrubbing) return;
    const onMove = (e) => onScrub(e.clientX ?? e.touches?.[0]?.clientX);
    const onUp = () => {
      seek(scrubValue);
      setScrubbing(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrubbing, scrubValue]);

  const displayProgress = scrubbing ? scrubValue : progress;
  const pct = duration ? (displayProgress / duration) * 100 : 0;

  const hasLyrics = currentTrack?.lyrics?.length > 0;
  const hasSyncedLyrics = hasLyrics && currentTrack.lyrics.some((l) => l.time != null);

  return (
    <div className="player-surface">
      {/* LEFT — cover + meta + controls */}
      <div className="player-left">
        <div className={`player-cover ${isPlaying ? "is-playing" : ""}`}>
          {currentTrack?.cover ? (
            <img src={currentTrack.cover} alt={currentTrack.title} />
          ) : (
            <div className="player-cover-fallback">
              {currentTrack?.loading ? <FiLoader className="spin" /> : <FiMusic />}
            </div>
          )}
        </div>

        <div className="player-meta">
          <p className="player-meta-rank">#{currentIndex + 1} on repeat</p>
          <h3 className="player-meta-title">{currentTrack?.title || "—"}</h3>
          <p className="player-meta-artist">{currentTrack?.artist || ""}</p>
          {currentTrack?.album && (
            <p className="player-meta-album">{currentTrack.album}</p>
          )}
          {currentTrack?.mood && (
            <span className="player-meta-mood">{currentTrack.mood}</span>
          )}
          {currentTrack?.why && (
            <p className="player-meta-why">"{currentTrack.why}"</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="player-progress-row">
          <span className="player-time">{fmt(displayProgress)}</span>
          <div
            ref={trackRef}
            className="player-track"
            onPointerDown={startScrub}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={displayProgress}
            aria-label="Seek"
          >
            <div className="player-track-fill" style={{ width: `${pct}%` }} />
            <div className="player-track-thumb" style={{ left: `${pct}%` }} />
          </div>
          <span className="player-time">{fmt(duration)}</span>
        </div>

        {/* Controls */}
        <div className="player-controls-row">
          <button onClick={prev} className="player-icon-btn" aria-label="Previous">
            <FiSkipBack />
          </button>
          <button
            onClick={togglePlay}
            className="player-play-btn"
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={currentTrack?.loading}
          >
            {currentTrack?.loading
              ? <FiLoader className="spin" />
              : isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          <button onClick={next} className="player-icon-btn" aria-label="Next">
            <FiSkipForward />
          </button>
        </div>

        {/* Volume + view toggle */}
        <div className="player-bottom-row">
          <div className="player-volume">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="player-icon-btn-sm"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
              className="player-volume-slider"
              aria-label="Volume"
            />
          </div>

          <div className="player-view-toggle">
            <button
              className={view === "lyrics" ? "is-on" : ""}
              onClick={() => setView("lyrics")}
            >
              <FiAlignLeft /> lyrics
            </button>
            <button
              className={view === "queue" ? "is-on" : ""}
              onClick={() => setView("queue")}
            >
              <FiList /> queue
            </button>
          </div>
        </div>

        {hasError && (
          <p className="player-error-msg">
            couldn't play this one. check the file in <code>/public/music/</code>
          </p>
        )}
      </div>

      {/* RIGHT — lyrics or queue */}
      <div className="player-right">
        {view === "lyrics" ? (
          <LyricsPanel
            lines={currentTrack?.lyrics || []}
            activeIdx={activeLyricIdx}
            synced={hasSyncedLyrics}
            onSeek={(t) => seek(t)}
            isLoading={currentTrack?.loading}
          />
        ) : (
          <QueuePanel
            tracks={tracks}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            onPick={playIndex}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LyricsPanel — Apple Music style. Active line bigger, gradient tinted,
// past lines fade, future lines neutral. Auto-scrolls.
// ─────────────────────────────────────────────────────────
function LyricsPanel({ lines, activeIdx, synced, onSeek, isLoading }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (!synced || activeIdx < 0) return;
    const el = activeRef.current;
    const container = containerRef.current;
    if (!el || !container) return;
    const elTop = el.offsetTop;
    const elH = el.offsetHeight;
    const cH = container.clientHeight;
    container.scrollTo({
      top: elTop - cH / 2 + elH / 2,
      behavior: "smooth",
    });
  }, [activeIdx, synced]);

  if (isLoading) {
    return <div className="lyrics-empty"><FiLoader className="spin" /> reading the song…</div>;
  }

  if (!lines.length) {
    return (
      <div className="lyrics-empty">
        <FiMusic />
        <p>no lyrics in this one</p>
        <span>just close your eyes and feel it.</span>
      </div>
    );
  }

  return (
    <div className="lyrics-scroll" ref={containerRef}>
      <div className="lyrics-spacer-top" />
      {lines.map((line, i) => {
        const state =
          i === activeIdx ? "active" :
          i < activeIdx ? "past" : "future";
        return (
          <p
            key={i}
            ref={i === activeIdx ? activeRef : null}
            className={`lyric-line lyric-${state} ${line.time != null ? "is-clickable" : ""}`}
            onClick={() => line.time != null && onSeek(line.time)}
          >
            {line.text}
          </p>
        );
      })}
      <div className="lyrics-spacer-bottom" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// QueuePanel — compact list of all tracks
// ─────────────────────────────────────────────────────────
function QueuePanel({ tracks, currentIndex, isPlaying, onPick }) {
  return (
    <ul className="queue-list">
      {tracks.map((t, i) => {
        const active = i === currentIndex;
        return (
          <li
            key={t.file}
            className={`queue-item ${active ? "is-current" : ""}`}
            onClick={() => onPick(i)}
          >
            <div className="queue-cover">
              {t.cover ? <img src={t.cover} alt="" /> : <FiMusic />}
              {active && isPlaying && (
                <div className="queue-eq" aria-hidden="true">
                  <span /><span /><span />
                </div>
              )}
            </div>
            <div className="queue-meta">
              <p className="queue-title">{t.title}</p>
              <p className="queue-artist">{t.artist}</p>
            </div>
            <span className="queue-rank">#{i + 1}</span>
          </li>
        );
      })}
    </ul>
  );
}
