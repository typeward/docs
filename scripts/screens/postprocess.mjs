// Turns the raw Playwright recordings into the clips the docs ship.
//
// Three things are wrong with a recording straight out of capture.mjs:
//
//  1. Recording starts when the page is created, so the tape opens with a
//     blank frame, the app's splash, and the walk to wherever the clip really
//     begins. Looping that reads as "the video is buffering" every lap.
//  2. It ends on a static frame that outstays its welcome for the same reason.
//  3. VP8 straight from the screencast is fat, and there is no poster, so the
//     player shows an empty box until the first frame decodes.
//
// So: trim to the marks the driver dropped, dissolve back into frame one where
// that helps the loop (see LOOP_FADE), then encode VP9 (with an H.264 twin for
// players without WebM) and pull a poster from the frame worth showing.
//
// Needs a full ffmpeg -- the one Playwright bundles is built without the
// filters this uses. Set FFMPEG to point at a binary, or install ffmpeg-static.
// Run after capture.mjs: node scripts/screens/postprocess.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, mkdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const DOCS = join(HERE, '..', '..');
const VIDEOS = join(DOCS, 'public', 'videos');
const POSTERS = join(DOCS, 'src', 'assets', 'screens', 'clips');

// Width of the shipped clip. The tape is 2880 wide (2x); 1920 still oversamples
// the ~960px the docs render it at, at a third of the bitrate.
const WIDTH = 1920;

// Seconds of dissolve back into frame one. It only helps where the clip ends
// close to where it began, which is the two toggle clips: superimposing two
// genuinely different app states (a rendered PDF over an empty pane, a modal
// over an editor) double-prints the text and reads as a rendering fault, so
// those clips cut instead.
const LOOP_FADE = {
  'compile-flow': 0,
  'visual-editing': 0.45,
  'focus-mode': 0.45,
  'version-history': 0,
};
const DEFAULT_FADE = 0.45;

function ffmpegPath() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try {
    const require = createRequire(import.meta.url);
    return require('ffmpeg-static');
  } catch {
    /* fall through */
  }
  throw new Error('no ffmpeg: set FFMPEG=/path/to/ffmpeg or npm i ffmpeg-static');
}

const FF = ffmpegPath();
const run = (args) => execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
const kb = (p) => Math.round(statSync(p).size / 1024) + ' KB';

// trim -> scale -> dissolve the tail back onto the head, so the last frame of
// the loop is the first frame of the next lap.
function chain(start, len, fade) {
  const trim = `[0:v]trim=${start.toFixed(3)}:${(start + len).toFixed(3)},setpts=PTS-STARTPTS,scale=${WIDTH}:-2:flags=lanczos,fps=25,format=yuv420p`;
  if (fade <= 0) return `${trim}[out]`;
  const body = Math.max(0.1, len - fade);
  return [
    `[0:v]trim=${start.toFixed(3)}:${(start + len).toFixed(3)},setpts=PTS-STARTPTS,scale=${WIDTH}:-2:flags=lanczos,fps=25,format=yuv420p[v]`,
    '[v]split=3[b][t][h]',
    `[b]trim=0:${body.toFixed(3)},setpts=PTS-STARTPTS[body]`,
    `[t]trim=${body.toFixed(3)}:${len.toFixed(3)},setpts=PTS-STARTPTS[tail]`,
    `[h]trim=0:${fade.toFixed(3)},setpts=PTS-STARTPTS[head]`,
    `[tail][head]xfade=transition=fade:duration=${fade.toFixed(3)}:offset=0[mix]`,
    '[body][mix]concat=n=2:v=1:a=0[out]',
  ].join(';');
}

const clips = process.argv.slice(2);
const names = clips.length ? clips : ['compile-flow', 'visual-editing', 'focus-mode', 'version-history'];

mkdirSync(VIDEOS, { recursive: true });
mkdirSync(POSTERS, { recursive: true });

for (const name of names) {
  const src = join(OUT, `doc-${name}.webm`);
  const marksFile = join(OUT, `doc-${name}.marks.json`);
  if (!existsSync(src)) {
    console.warn(`skip ${name}: no recording`);
    continue;
  }
  const marks = existsSync(marksFile) ? JSON.parse(readFileSync(marksFile, 'utf8')) : {};
  const start = marks.start ?? 0;
  const end = marks.end ?? 0;
  if (!(end > start)) throw new Error(`${name}: unusable marks ${JSON.stringify(marks)}`);
  // A beat of lead-in before the first step, and the fade lives inside the clip.
  const from = Math.max(0, start - 0.2);
  const len = end - from;
  const fade = Math.min(LOOP_FADE[name] ?? DEFAULT_FADE, len / 4);
  const filter = chain(from, len, fade);

  const webm = join(VIDEOS, `${name}.webm`);
  const mp4 = join(VIDEOS, `${name}.mp4`);
  const poster = join(POSTERS, `${name}.png`);

  run(['-i', src, '-filter_complex', filter, '-map', '[out]', '-an',
    // auto-alt-ref plus a lag window is what makes VP9 worth choosing here: on
    // near-static UI footage it roughly halves the file against the default.
    '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-row-mt', '1', '-cpu-used', '2',
    '-auto-alt-ref', '1', '-lag-in-frames', '25', '-deadline', 'good', webm]);
  run(['-i', src, '-filter_complex', filter, '-map', '[out]', '-an',
    '-c:v', 'libx264', '-crf', '25', '-preset', 'slow', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', mp4]);
  // Poster: the frame the driver marked as the one that shows the feature, or
  // frame one when it did not mark one. Frame one is right only for a clip whose
  // whole point is the change from that state; for the rest it is a picture of
  // the app doing nothing, and under prefers-reduced-motion (where the clip
  // never plays) it is the only frame the reader ever sees.
  run(['-ss', (marks.poster ?? from).toFixed(3), '-i', src, '-frames:v', '1', '-vf', `scale=${WIDTH}:-2:flags=lanczos`, poster]);

  console.log(`${name}: ${len.toFixed(2)}s  webm ${kb(webm)}  mp4 ${kb(mp4)}  poster ${kb(poster)}`);
}
