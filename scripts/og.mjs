// Builds public/og.png, the card link previews show.
//
// Run it after a brand change:  node scripts/og.mjs
//
// The artwork is one SVG rasterized by sharp (already a dependency, so this
// needs no extra tooling). The mark is not redrawn here: it is read from
// src/assets/brand/mark-on-dark.svg, the site's copy of the app's icon kit, so
// the card cannot drift from what the rest of the site shows. Re-copy that file
// from the kit before running this after a kit rebuild. It is the
// background-free build, because the card already has a ground of its own. Type
// is set in Segoe UI rather than the site's Inter because librsvg resolves
// fonts through the OS, not through node_modules, and Segoe is the closest
// thing installed.
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const root = new URL('../', import.meta.url);
const markPath = new URL('src/assets/brand/mark-on-dark.svg', root);
const outPath = new URL('public/og.png', root);

// Lamplight, matching src/styles/custom.css.
const BG = '#0d0c0a';
const INK = '#ede6d8';
const DIM = '#aaa59a';
const FAINT = '#8a867d';
const AMBER = '#e8a34d';

const FONT = 'Segoe UI, Arial, sans-serif';

// The mark is cropped tight to the letterform (243 x 263, origin 134.5,124),
// so it is placed by its own box rather than by a padded square, and it is
// centred against the text block beside it. The block as a whole (mark and
// copy, roughly y 190 to 435) is centred on the canvas.
const MARK = { height: 176, x: 104, y: 224 };
const TEXT_X = 312;

// Drop the mark's paths into a group rather than nesting an <svg>, which
// librsvg scales less predictably.
const markSource = await readFile(fileURLToPath(markPath), 'utf8');
const markBody = markSource.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const markScale = MARK.height / 263;
const markWidth = Math.round(243 * markScale);

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG}"/>
  <g transform="translate(${MARK.x},${MARK.y}) scale(${markScale}) translate(-134.5,-124)">${markBody}</g>
  <text x="${TEXT_X}" y="263" font-family="${FONT}" font-size="92" font-weight="600" letter-spacing="-2" fill="${INK}">Typeward</text>
  <rect x="${TEXT_X + 5}" y="299" width="80" height="9" rx="4.5" fill="${AMBER}"/>
  <text x="${TEXT_X}" y="375" font-family="${FONT}" font-size="40" fill="${DIM}">Documentation</text>
  <text x="${TEXT_X}" y="433" font-family="${FONT}" font-size="27" fill="${FAINT}">A local-first LaTeX editor for Windows, macOS, and Linux</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile(fileURLToPath(outPath), png);

// librsvg silently drops text when a font stack resolves to nothing, and an
// empty card would ship unnoticed. Both regions must carry real detail.
const check = async (region, name) => {
	const stats = await sharp(png).extract(region).stats();
	const painted = stats.channels.some((c) => c.stdev > 10);
	console.log(`${name}: ${painted ? 'painted' : 'EMPTY'}`);
	return painted;
};

const wordmark = await check({ left: TEXT_X, top: 187, width: 460, height: 90 }, 'wordmark');
const mark = await check({ left: MARK.x, top: MARK.y, width: markWidth, height: MARK.height }, 'mark');

if (!wordmark || !mark) process.exitCode = 1;
