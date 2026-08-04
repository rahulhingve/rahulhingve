import { useEffect, useState } from "react";
import * as MM from "music-metadata";

// Cross-version compatibility: prefer parseBlob, fall back to parseFromBlob
// or the legacy parseStream-based approaches.
const parseAudioBlob = async (blob) => {
  if (typeof MM.parseBlob === "function") return MM.parseBlob(blob);
  if (typeof MM.parseFromBlob === "function") return MM.parseFromBlob(blob);
  if (typeof MM.parseBuffer === "function") {
    const buf = new Uint8Array(await blob.arrayBuffer());
    return MM.parseBuffer(buf, { mimeType: blob.type });
  }
  throw new Error("music-metadata: no compatible parse function found");
};

// ─────────────────────────────────────────────────────────
// Parse LRC lyrics into [{ time: seconds, text: "..." }]
// Handles "[mm:ss.xx] line" format, plus plain text fallback.
// ─────────────────────────────────────────────────────────
function parseLRC(raw) {
  if (!raw || typeof raw !== "string") return [];
  const lines = raw.split(/\r?\n/);
  const out = [];
  // Match [mm:ss.xx] or [mm:ss]
  const rx = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/g;

  for (const line of lines) {
    const stamps = [...line.matchAll(rx)];
    const text = line.replace(rx, "").trim();
    if (stamps.length === 0) {
      // No timestamp — keep as plain line (no time)
      if (text) out.push({ time: null, text });
      continue;
    }
    for (const m of stamps) {
      const min = parseInt(m[1], 10);
      const sec = parseInt(m[2], 10);
      const frac = m[3] ? parseInt(m[3].padEnd(3, "0"), 10) / 1000 : 0;
      const time = min * 60 + sec + frac;
      if (text) out.push({ time, text });
    }
  }
  // Sort by time when present
  return out.sort((a, b) => {
    if (a.time === null && b.time === null) return 0;
    if (a.time === null) return 1;
    if (b.time === null) return -1;
    return a.time - b.time;
  });
}

// Convert metadata Picture (Uint8Array) → Blob URL
function pictureToUrl(picture) {
  if (!picture) return null;
  const blob = new Blob([picture.data], { type: picture.format || "image/jpeg" });
  return URL.createObjectURL(blob);
}

// ─────────────────────────────────────────────────────────
// useTrackMetadata
// Takes a list of { file, why, mood } and returns enriched
// tracks with title, artist, album, cover URL, lyrics array.
// Pass an empty list to defer loading entirely (lazy mode).
// ─────────────────────────────────────────────────────────
export function useTrackMetadata(seeds) {
  // Re-key the loader on the actual list of files so we can lazy-load
  // by passing [] first and the real list later.
  const filesKey = seeds.map((s) => s.file).join("|");

  const [tracks, setTracks] = useState(() =>
    seeds.map((s, i) => ({
      ...s,
      id: i,
      title: filenameTitle(s.file),
      artist: "loading…",
      album: "",
      cover: null,
      lyrics: [],
      loading: true,
      error: null,
    }))
  );

  useEffect(() => {
    if (!seeds.length) {
      setTracks([]);
      return;
    }

    // Reset to fresh "loading" state for this new list
    setTracks(seeds.map((s, i) => ({
      ...s,
      id: i,
      title: filenameTitle(s.file),
      artist: "loading…",
      album: "",
      cover: null,
      lyrics: [],
      loading: true,
      error: null,
    })));

    let cancelled = false;
    const createdUrls = [];

    // Load metadata for one track by fetching the whole m4a once. We then
    // hand the same blob URL pattern to <audio> so the browser can stream
    // playback without re-downloading. M4A `moov` atom can live at file
    // start or end so a Range request isn't safe — full fetch is the
    // most reliable approach.
    const loadOne = async (seed, idx) => {
      try {
        const res = await fetch(seed.file);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const meta = await parseAudioBlob(blob);
        if (cancelled) return;

        const c = meta.common || {};
        const cover = c.picture && c.picture[0] ? pictureToUrl(c.picture[0]) : null;
        if (cover) createdUrls.push(cover);

        // Lyrics live at common.lyrics — string or array of strings/objects depending on version
        let lyricsRaw = "";
        if (Array.isArray(c.lyrics) && c.lyrics.length) {
          const first = c.lyrics[0];
          lyricsRaw = typeof first === "string" ? first : (first?.text || "");
        } else if (typeof c.lyrics === "string") {
          lyricsRaw = c.lyrics;
        }

        const lyrics = parseLRC(lyricsRaw);

        // Reuse the fetched blob as the playback source — avoids a second
        // network round-trip when the user actually presses play.
        const playUrl = URL.createObjectURL(blob);
        createdUrls.push(playUrl);

        const enriched = {
          ...seed,
          id: idx,
          title: c.title || filenameTitle(seed.file),
          artist: c.artist || "unknown artist",
          album: c.album || "",
          albumArtist: c.albumartist || c.artist || "",
          year: c.year || null,
          genre: (c.genre && c.genre[0]) || "",
          cover,
          lyrics,
          // Override the original file path with a blob URL for instant playback
          file: playUrl,
          fileOriginal: seed.file,
          loading: false,
          error: null,
        };

        setTracks((prev) => {
          const next = [...prev];
          if (next[idx]) next[idx] = enriched;
          return next;
        });
      } catch (err) {
        if (cancelled) return;
        setTracks((prev) => {
          const next = [...prev];
          if (next[idx]) {
            next[idx] = {
              ...next[idx],
              ...seed,
              id: idx,
              title: filenameTitle(seed.file),
              artist: "missing file",
              loading: false,
              error: err.message || "failed to load",
            };
          }
          return next;
        });
      }
    };

    // Sequential loading: track 0 first so playback can start immediately,
    // then the rest in order. Keeps network pressure low on slow connections
    // (one ~10 MB file in flight at a time, not 5 in parallel).
    (async () => {
      for (let i = 0; i < seeds.length; i++) {
        if (cancelled) break;
        await loadOne(seeds[i], i);
      }
    })();

    return () => {
      cancelled = true;
      createdUrls.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesKey]);

  return tracks;
}

// "/music/05. Phoolon Jaisi.m4a" → "Phoolon Jaisi"
function filenameTitle(path) {
  if (!path) return "untitled";
  const name = path.split("/").pop().replace(/\.[^.]+$/, "");
  // Strip leading "01. " or "1 - " prefixes
  return name.replace(/^\s*\d+[\s.\-_]+/, "").trim() || name;
}
