import { FiPlay, FiPause, FiMusic, FiLoader } from "react-icons/fi";
import { usePlayer } from "./PlayerContext";

// ─────────────────────────────────────────────────────────
// MiniPlayerPill
// Floating pill bottom-right. Visible when:
//   - intro has played at least once (player has been launched)
//   - modal is closed (minimized)
// Click pill → reopen modal. Click play button → play/pause without opening.
// ─────────────────────────────────────────────────────────
export default function MiniPlayerPill() {
  const {
    hasIntroPlayed, modalOpen,
    currentTrack, isPlaying,
    togglePlay, expand,
  } = usePlayer();

  if (!hasIntroPlayed || modalOpen) return null;
  if (!currentTrack) return null;

  return (
    <button
      className={`mini-pill ${isPlaying ? "is-playing" : ""}`}
      onClick={expand}
      aria-label="Open music player"
    >
      <span className="mini-pill-cover">
        {currentTrack.cover ? (
          <img src={currentTrack.cover} alt="" />
        ) : currentTrack.loading ? (
          <FiLoader className="spin" />
        ) : (
          <FiMusic />
        )}
        {isPlaying && (
          <span className="mini-pill-eq" aria-hidden="true">
            <span /><span /><span />
          </span>
        )}
      </span>
      <span className="mini-pill-meta">
        <span className="mini-pill-title">{currentTrack.title}</span>
        <span className="mini-pill-artist">{currentTrack.artist}</span>
      </span>
      <span
        className="mini-pill-play"
        role="button"
        tabIndex={0}
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            togglePlay();
          }
        }}
      >
        {isPlaying ? <FiPause /> : <FiPlay />}
      </span>
    </button>
  );
}
