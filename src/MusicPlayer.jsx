import { useState, useRef, useEffect, useMemo } from "react";
import {
  FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiVolume2, FiVolumeX, FiMusic, FiFileText, FiX, FiLoader,
} from "react-icons/fi";
import { useTrackMetadata } from "./useTrackMetadata";

const formatTime = (sec) => {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ─────────────────────────────────────────────────────────
// MusicPlayer — fetches m4a metadata at runtime, plays via shared audio,
// shows synced lyrics in a slide-up panel.
// ─────────────────────────────────────────────────────────
export default function MusicPlayer({ seeds, onStateChange }) {
  const tracks = useTrackMetadata(seeds);
  const audioRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const currentTrack = tracks[currentIndex];

  // Bubble state up to parent (for DynamicIsland)
  useEffect(() => {
    if (onStateChange && currentTrack) {
      onStateChange({
        title: currentTrack.title,
        artist: currentTrack.artist,
        cover: currentTrack.cover,
        isPlaying,
      });
    }
  }, [currentTrack, isPlaying, onStateChange]);

  // Audio listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => {
      setCurrentIndex((i) => (i + 1) % tracks.length);
      setIsPlaying(true);
    };
    const onError = () => { setHasError(true); setIsPlaying(false); };
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
  }, [currentIndex, tracks.length]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // When track changes, reset progress; if was playing, keep playing
  useEffect(() => {
    setProgress(0);
    setHasError(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => { setHasError(true); setIsPlaying(false); });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else audio.play().then(() => setIsPlaying(true)).catch(() => { setHasError(true); setIsPlaying(false); });
  };

  const selectTrack = (idx) => {
    if (idx === currentIndex) togglePlay();
    else { setCurrentIndex(idx); setIsPlaying(true); }
  };

  const playNext = () => { setCurrentIndex((i) => (i + 1) % tracks.length); setIsPlaying(true); };
  const playPrev = () => { setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length); setIsPlaying(true); };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
    setProgress(audio.currentTime);
  };

  // ── Lyrics: find current line index based on progress
  const activeLyricIdx = useMemo(() => {
    if (!currentTrack?.lyrics?.length) return -1;
    let idx = -1;
    for (let i = 0; i < currentTrack.lyrics.length; i++) {
      const t = currentTrack.lyrics[i].time;
      if (t === null || t === undefined) continue;
      if (t <= progress) idx = i;
      else break;
    }
    return idx;
  }, [progress, currentTrack]);

  const hasLyrics = currentTrack?.lyrics?.length > 0;
  const hasSyncedLyrics = hasLyrics && currentTrack.lyrics.some((l) => l.time !== null);

  return (
    <div className="music-section">
      <audio ref={audioRef} src={currentTrack.file} preload="metadata" />

      {/* Track grid */}
      <div className="track-grid">
        {tracks.map((track, idx) => {
          const isCurrent = idx === currentIndex;
          const isThisPlaying = isCurrent && isPlaying;
          return (
            <div
              key={track.file}
              className={`track-card ${isCurrent ? "track-card-active" : ""}`}
              onClick={() => selectTrack(idx)}
            >
              <div className="track-cover-wrap">
                {track.cover && (
                  <img src={track.cover} alt={track.title} className="track-cover" />
                )}
                <div className="track-cover-fallback">
                  {track.loading ? <FiLoader className="spin" /> : <FiMusic />}
                </div>
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
                {track.album && <div className="track-album">{track.album}</div>}
                {track.mood && <div className="track-mood">{track.mood}</div>}
                {track.why && <p className="track-why">"{track.why}"</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Lyrics slide-up panel ── */}
      {showLyrics && (
        <div className="lyrics-overlay" onClick={() => setShowLyrics(false)}>
          <div className="lyrics-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lyrics-header">
              <div className="lyrics-track-info">
                {currentTrack.cover && (
                  <img src={currentTrack.cover} alt="" className="lyrics-cover" />
                )}
                <div>
                  <div className="lyrics-title">{currentTrack.title}</div>
                  <div className="lyrics-artist">{currentTrack.artist}</div>
                </div>
              </div>
              <button
                className="lyrics-close"
                onClick={() => setShowLyrics(false)}
                aria-label="Close lyrics"
              >
                <FiX />
              </button>
            </div>
            <div className="lyrics-body">
              {hasLyrics ? (
                <LyricsView
                  lines={currentTrack.lyrics}
                  activeIdx={activeLyricIdx}
                  synced={hasSyncedLyrics}
                  onSeek={(time) => {
                    if (audioRef.current && time != null) {
                      audioRef.current.currentTime = time;
                      setProgress(time);
                      if (!isPlaying) {
                        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                      }
                    }
                  }}
                />
              ) : (
                <div className="lyrics-empty">
                  no lyrics embedded in this file
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky bottom player bar ── */}
      <div className={`player-bar ${isPlaying ? "player-bar-active" : ""}`}>
        <div className="player-bar-inner">
          <div className="player-now">
            <div className="player-now-cover">
              {currentTrack.cover && <img src={currentTrack.cover} alt="" />}
              <div className="player-now-fallback">
                {currentTrack.loading ? <FiLoader className="spin" size={14} /> : <FiMusic size={14} />}
              </div>
            </div>
            <div className="player-now-meta">
              <div className="player-now-title">{currentTrack.title}</div>
              <div className="player-now-artist">{currentTrack.artist}</div>
            </div>
          </div>

          <div className="player-controls-wrap">
            <div className="player-controls">
              <button onClick={playPrev} aria-label="Previous" className="player-btn"><FiSkipBack /></button>
              <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="player-btn player-btn-main">
                {isPlaying ? <FiPause /> : <FiPlay />}
              </button>
              <button onClick={playNext} aria-label="Next" className="player-btn"><FiSkipForward /></button>
            </div>
            <div className="player-progress">
              <span className="player-time">{formatTime(progress)}</span>
              <div className="player-bar-track" onClick={seek}>
                <div className="player-bar-fill" style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }} />
              </div>
              <span className="player-time">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="player-extras">
            <button
              onClick={() => setShowLyrics((s) => !s)}
              aria-label="Toggle lyrics"
              className={`player-btn ${hasLyrics ? "" : "player-btn-disabled"} ${showLyrics ? "player-btn-active" : ""}`}
              disabled={!hasLyrics}
              title={hasLyrics ? "lyrics" : "no lyrics in this file"}
            >
              <FiFileText />
            </button>
            <button onClick={() => setIsMuted((m) => !m)} aria-label="Mute" className="player-btn">
              {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
            </button>
            <input
              type="range" min="0" max="1" step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
              className="player-volume-slider"
              aria-label="Volume"
            />
          </div>
        </div>
        {hasError && (
          <div className="player-error">
            audio file missing — drop your <code>.m4a</code> in <code>/public/music/</code> and update <code>src/data.js</code>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Lyrics view — auto-scrolls to active line, click any
// timed line to jump to that point in the song.
// ─────────────────────────────────────────────────────────
function LyricsView({ lines, activeIdx, synced, onSeek }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (!synced || !activeRef.current || !containerRef.current) return;
    const el = activeRef.current;
    const container = containerRef.current;
    const elTop = el.offsetTop;
    const elHeight = el.offsetHeight;
    const containerHeight = container.clientHeight;
    container.scrollTo({
      top: elTop - containerHeight / 2 + elHeight / 2,
      behavior: "smooth",
    });
  }, [activeIdx, synced]);

  return (
    <div className="lyrics-scroll" ref={containerRef}>
      <div className="lyrics-spacer" />
      {lines.map((line, i) => (
        <p
          key={i}
          ref={i === activeIdx ? activeRef : null}
          className={`lyrics-line ${i === activeIdx ? "lyrics-line-active" : ""} ${i < activeIdx ? "lyrics-line-past" : ""} ${line.time != null ? "lyrics-line-clickable" : ""}`}
          onClick={() => line.time != null && onSeek(line.time)}
        >
          {line.text}
        </p>
      ))}
      <div className="lyrics-spacer" />
    </div>
  );
}
