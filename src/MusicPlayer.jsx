import { useState, useRef, useEffect } from "react";
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiMusic } from "react-icons/fi";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const formatTime = (sec) => {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ─────────────────────────────────────────────────────────
// MusicPlayer — full top-5 list with single shared <audio>
// ─────────────────────────────────────────────────────────
export default function MusicPlayer({ tracks }) {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const currentTrack = tracks[currentIndex];

  // Sync audio element with state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => playNext();
    const onError = () => {
      setHasError(true);
      setIsPlaying(false);
    };
    const onCanPlay = () => setHasError(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);
    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [currentIndex]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Play/pause sync when index changes
  useEffect(() => {
    setProgress(0);
    setHasError(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {
        setHasError(true);
        setIsPlaying(false);
      });
    }
  }, [currentIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        setHasError(true);
        setIsPlaying(false);
      });
    }
  };

  const selectTrack = (idx) => {
    if (idx === currentIndex) {
      togglePlay();
    } else {
      setCurrentIndex(idx);
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    setCurrentIndex((i) => (i + 1) % tracks.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
    setProgress(audio.currentTime);
  };

  return (
    <div className="music-section">
      <audio ref={audioRef} src={currentTrack.src} preload="metadata" />

      {/* Track cards grid */}
      <div className="track-grid">
        {tracks.map((track, idx) => {
          const isCurrent = idx === currentIndex;
          const isThisPlaying = isCurrent && isPlaying;
          return (
            <div
              key={track.id}
              className={`track-card ${isCurrent ? "track-card-active" : ""}`}
              onClick={() => selectTrack(idx)}
            >
              <div className="track-cover-wrap">
                {track.cover ? (
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="track-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : null}
                <div className="track-cover-fallback"><FiMusic /></div>
                <div className={`track-play-overlay ${isThisPlaying ? "is-playing" : ""}`}>
                  {isThisPlaying ? <FiPause /> : <FiPlay />}
                </div>
                {isThisPlaying && (
                  <div className="track-equalizer" aria-hidden="true">
                    <span /><span /><span /><span />
                  </div>
                )}
              </div>
              <div className="track-meta">
                <div className="track-rank">#{idx + 1} on repeat</div>
                <div className="track-title">{track.title}</div>
                <div className="track-artist">{track.artist}</div>
                {track.mood && <div className="track-mood">{track.mood}</div>}
                <p className="track-why">"{track.why}"</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky bottom player bar */}
      <div className={`player-bar ${isPlaying ? "player-bar-active" : ""}`}>
        <div className="player-bar-inner">
          <div className="player-now">
            <div className="player-now-cover">
              {currentTrack.cover ? (
                <img src={currentTrack.cover} alt="" onError={(e) => { e.target.style.display = "none"; }} />
              ) : null}
              <div className="player-now-fallback"><FiMusic size={14} /></div>
            </div>
            <div className="player-now-meta">
              <div className="player-now-title">{currentTrack.title}</div>
              <div className="player-now-artist">{currentTrack.artist}</div>
            </div>
          </div>

          <div className="player-controls-wrap">
            <div className="player-controls">
              <button onClick={playPrev} aria-label="Previous track" className="player-btn">
                <FiSkipBack />
              </button>
              <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="player-btn player-btn-main">
                {isPlaying ? <FiPause /> : <FiPlay />}
              </button>
              <button onClick={playNext} aria-label="Next track" className="player-btn">
                <FiSkipForward />
              </button>
            </div>
            <div className="player-progress">
              <span className="player-time">{formatTime(progress)}</span>
              <div className="player-bar-track" onClick={seek}>
                <div
                  className="player-bar-fill"
                  style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
                />
              </div>
              <span className="player-time">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="player-volume">
            <button onClick={() => setIsMuted((m) => !m)} aria-label="Mute" className="player-btn">
              {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
              className="player-volume-slider"
              aria-label="Volume"
            />
          </div>
        </div>
        {hasError && (
          <div className="player-error">
            audio file missing — drop your .m4a in <code>/public/music/</code> to play this one
          </div>
        )}
      </div>
    </div>
  );
}
