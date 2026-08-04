import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useTrackMetadata } from "./useTrackMetadata";
import { topMusic } from "./data";

// ─────────────────────────────────────────────────────────
// Player phases:
//   "idle"      — nothing requested yet, no audio, no metadata
//   "intro"     — modal open, showing the headphones launch screen
//   "ready"     — metadata loaded, player UI visible, may or may not be playing
// Modal visibility is independent of phase; once we have metadata,
// the modal can be closed (minimized) and reopened without reloading.
// ─────────────────────────────────────────────────────────

const PlayerCtx = createContext(null);

const INTRO_MIN_MS = 2200; // minimum time the intro screen shows before fading in

export function PlayerProvider({ children }) {
  // Lazy: only true after the first time user clicked launch in this session
  const [hasIntroPlayed, setHasIntroPlayed] = useState(false);

  // Phase
  const [phase, setPhase] = useState("idle"); // idle | intro | ready
  const [modalOpen, setModalOpen] = useState(false);

  // Whether to actually mount the metadata loader (gated on first launch)
  const [shouldLoad, setShouldLoad] = useState(false);

  // Track index requested by the user (so we can switch tracks before
  // metadata is even loaded, and resume into the right one)
  const [pendingIndex, setPendingIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Refs
  const audioRef = useRef(null);
  const introStartedAt = useRef(0);

  // Only load metadata once we've been told to
  const tracks = useTrackMetadata(shouldLoad ? topMusic : []);

  const currentTrack = tracks[currentIndex] || null;

  // ── Launch flow ─────────────────────────────────────────
  // requestPlay(idx?) — opens the modal at the given track.
  // First time in a session: shows intro screen, then loads, then plays.
  // Later launches: just opens the modal (metadata already cached).
  const requestPlay = useCallback((idx = 0) => {
    setPendingIndex(idx);
    setCurrentIndex(idx);

    // CRITICAL: this function is called from a user click. We use this
    // gesture window to "unlock" the audio element by triggering load().
    // Many browsers (Safari, mobile Chrome) require playback to start
    // from a user gesture, but a deferred play() call is still allowed
    // on an audio element that was touched during a gesture.
    if (audioRef.current) {
      try { audioRef.current.load(); } catch {}
    }

    if (!hasIntroPlayed) {
      setPhase("intro");
      setModalOpen(true);
      introStartedAt.current = Date.now();
      setShouldLoad(true);
    } else {
      setPhase("ready");
      setModalOpen(true);
      setIsPlaying(true);
    }
  }, [hasIntroPlayed]);

  // When the metadata loader finishes the requested track, transition
  // intro → ready (respecting a minimum show time so it doesn't feel jumpy)
  useEffect(() => {
    if (phase !== "intro") return;
    const t = tracks[pendingIndex];
    if (!t || t.loading) return;

    const elapsed = Date.now() - introStartedAt.current;
    const wait = Math.max(0, INTRO_MIN_MS - elapsed);
    const id = setTimeout(() => {
      setPhase("ready");
      setHasIntroPlayed(true);
      setIsPlaying(true);
    }, wait);
    return () => clearTimeout(id);
  }, [phase, tracks, pendingIndex]);

  // ── Audio element wiring ────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => {
      setCurrentIndex((i) => (tracks.length ? (i + 1) % tracks.length : i));
      setIsPlaying(true);
    };
    const onError = () => { setHasError(true); setIsPlaying(false); };
    const onCanPlay = () => setHasError(false);
    const onPause = () => setIsPlaying(false);
    const onPlayEv = () => setIsPlaying(true);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlayEv);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlayEv);
    };
  }, [tracks.length]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Track change → reset progress, attempt play if intent
  useEffect(() => {
    setProgress(0);
    setHasError(false);
    if (phase !== "ready") return;
    if (!audioRef.current) return;
    if (!currentTrack || currentTrack.loading) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
        setHasError(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, phase, currentTrack?.loading]);

  // ── Controls ─────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || !currentTrack || currentTrack.loading) return;
    if (a.paused) {
      a.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
        setHasError(true);
      });
    } else {
      a.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const playIndex = useCallback((idx) => {
    if (idx === currentIndex) {
      togglePlay();
    } else {
      setCurrentIndex(idx);
      setIsPlaying(true);
    }
  }, [currentIndex, togglePlay]);

  const next = useCallback(() => {
    if (!tracks.length) return;
    setCurrentIndex((i) => (i + 1) % tracks.length);
    setIsPlaying(true);
  }, [tracks.length]);

  const prev = useCallback(() => {
    if (!tracks.length) return;
    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  }, [tracks.length]);

  const seek = useCallback((time) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    a.currentTime = Math.max(0, Math.min(time, duration));
    setProgress(a.currentTime);
  }, [duration]);

  const minimize = useCallback(() => setModalOpen(false), []);
  const expand = useCallback(() => setModalOpen(true), []);

  // ── Hidden audio element source ──────────────────────────
  // We use the file path directly (since audio streams the m4a as it plays).
  // The metadata blob has been parsed separately for tags only.
  const audioSrc = currentTrack?.file || "";

  const value = {
    // state
    phase,
    modalOpen,
    tracks,
    currentTrack,
    currentIndex,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    hasError,
    hasIntroPlayed,
    // refs
    audioRef,
    audioSrc,
    // actions
    requestPlay,
    playIndex,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    setIsMuted,
    minimize,
    expand,
  };

  return (
    <PlayerCtx.Provider value={value}>
      {children}
      {/* Single shared <audio> element, lives at provider root.
          Always mounted so we can capture the user's first click gesture
          and unlock playback on browsers that require it (Safari etc.). */}
      <audio ref={audioRef} src={audioSrc || undefined} preload="metadata" />
    </PlayerCtx.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}
