# App screenshot and clip capture

Captures the docs' app screenshots and demo clips by driving the real Typeward
frontend (the app repo's vite dev server) in headless Chromium with a browser
side Tauri IPC mock injected -- no changes to the app repo, no display needed.

## One-time setup

```
npm i --no-save --no-package-lock playwright ffmpeg-static   # local tooling only, never checked in
npx playwright install chromium
```

`postprocess.mjs` needs a full ffmpeg build. It picks up `ffmpeg-static` if it
is installed, or the binary named by the `FFMPEG` environment variable. The
ffmpeg that ships inside Playwright will not do: it is compiled without the
filters the loop trim needs.

## Re-capturing

1. Start the app frontend: `npm run dev` in `../app` (serves on port 1420).
2. `node scripts/screens/make-pdf.mjs` -- regenerates the sample compiled PDF.
3. `node scripts/screens/capture.mjs shots` -- screenshots into `out/`.
4. `node scripts/screens/capture.mjs videos` -- raw clip recordings into `out/`.
   Add a clip name (`videos focus-mode`) to re-record just one.
5. `node scripts/screens/annotate.mjs` -- the cropped and ringed variants.
6. `node scripts/screens/postprocess.mjs` -- trims, encodes and posters the
   clips straight into `public/videos/` and `src/assets/screens/clips/`.
7. Review every file in `out/` (never ship unreviewed frames), then copy the
   PNGs to `src/assets/screens/app/` and `welcome.png` to
   `src/assets/screens/onboarding/`.

Media convention: the app's **Lamplight** (dark) theme, a 1440x900 window, 2x
DPI. Clips record at 2x as well and ship downscaled to 1920 wide.

The app draws its own icon inline (`BrandMark`, in the editor's project pill,
the first-run step bar, and the command palette footer), with the kit's geometry
and colors copied in as literals. A brand change therefore means re-syncing
`BrandMark.tsx` from the kit first, then a full capture re-run; editing the kit
alone changes nothing a capture can see.

## How it works

`mock.js` installs `window.__TAURI_INTERNALS__` before the app boots, so
`@tauri-apps/api` calls hit canned handlers instead of Tauri. `capture.mjs`
holds the sample data (settings, three projects, the article source, template
manifests, history entries) and drives each UI state. The command surface the
mock implements was mapped from `app/src/ipc/index.ts`; if the app's IPC
changes, the mock's unknown-command console warnings will say what is missing.

`overlay.js` draws what a screencast cannot: a pointer that travels to each
control before the real click lands, a click ripple, keycaps for every
shortcut, and a caption naming the current step. It is injected for clips only,
so the stills stay clean.

`postprocess.mjs` fixes what the recorder gets wrong. Recording starts when the
page is created, so every tape opens on a blank frame, the app's splash, and
the walk to the starting state, and ends parked on a static one; looping that
reads as buffering. The driver drops `start`, `poster` and `end` marks into
`out/doc-<name>.marks.json`, and the trim follows start and end. On a clip that
ends close to where it began (`visual-editing`, `focus-mode`) the last half
second dissolves back into the first frame so the loop restarts softly.
`compile-flow` and `version-history` end on a different app state, where
superimposing a rendered PDF on an empty pane, or a dialog on an editor,
double-prints the text and reads as a rendering fault, so those two cut instead
(see `LOOP_FADE`). Output is VP9 webm plus an H.264 mp4 for players without
WebM, plus a poster taken from the `poster` mark, the frame that shows the
feature, falling back to the trimmed clip's first frame for a clip that marks
none.

Gotchas encoded in the scripts, each learned the hard way:

- Chromium reserves some Ctrl chords (Ctrl+N), so app shortcuts are dispatched
  as synthetic keydown events on the focused element.
- `core.save` is editor-scoped: Ctrl+S does nothing unless CodeMirror actually
  has focus, so the compile clip clicks into the source first.
- Measure a click target only after scrolling it into view, or the pointer
  parks at pre-scroll coordinates while Playwright clicks somewhere off-frame.
- Stacked dialogs are escaped by reloading rather than unwinding.
- A context-level `deviceScaleFactor` does not reach the screencast; the clips
  get their 2x from `--force-device-scale-factor=2` on the browser itself.
