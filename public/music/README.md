# music files go here

Drop your top-5 `.m4a` files in this folder. Filenames must match the `file` paths in `src/data.js`.

## Default expected filenames

```
song1.m4a
song2.m4a
song3.m4a
song4.m4a
song5.m4a
```

## Real filenames

You can rename them to anything you like — just update `src/data.js` to match. For example:

```js
{
  file: "/music/05. Phoolon Jaisi.m4a",
  why: "this one hits at 2am on a long drive...",
  mood: "late night drives",
}
```

## Where the metadata comes from

You don't need to set title, artist, album cover, or lyrics in `data.js` — all of that is read directly from the `.m4a` file's embedded metadata at runtime, including:

- **title** (`©nam` atom)
- **artist** (`©ART` atom)
- **album** (`©alb` atom)
- **cover art** (`covr` atom — embedded image)
- **synced lyrics** (`©lyr` atom — LRC format with `[mm:ss.xx]` timestamps)

If a tag is missing, the player falls back gracefully (filename → title, "unknown artist", placeholder cover, "no lyrics" note).

## Tips

- Keep file sizes reasonable (most m4a tracks are 5–10 MB)
- Cover art embedded in the file should ideally be ≥ 600×600 px for a sharp display
- LRC-format lyrics with timestamps will scroll-highlight in sync with playback
