// Produces the cropped/annotated variants of the raw captures:
//  - history-button.png : top-bar strip with the Project history button ringed
//  - build-pill.png     : bottom-left corner with the sidebar Engine pill ringed
//  - pdf-pane.png       : the PDF preview pane cropped out of the editor shot
//
// Regions are derived from boxes.json (real element rects in CSS px, written by
// capture.mjs) rather than hard-coded, so a layout change moves the crop with
// the control instead of quietly cutting it in half. The PNGs are 2x.
//
// Run after capture.mjs: node scripts/screens/annotate.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const boxes = JSON.parse(readFileSync(join(OUT, 'boxes.json'), 'utf8'));

// Ring color: the app's own amber reads as chrome on Lamplight (the Recompile
// button is amber), so highlights use the docs' cooler signal color instead.
const RING = '#7fd7c8';
const SCALE = 2;

const meta = await sharp(join(OUT, 'editor.png')).metadata();
const W = meta.width / SCALE;
const H = meta.height / SCALE;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// region and highlight are CSS-px rects in page coordinates.
async function crop(src, dest, region, highlight) {
  const x = clamp(region.x, 0, W);
  const y = clamp(region.y, 0, H);
  const r = {
    left: Math.round(x * SCALE),
    top: Math.round(y * SCALE),
    width: Math.round(clamp(region.w, 1, W - x) * SCALE),
    height: Math.round(clamp(region.h, 1, H - y) * SCALE),
  };
  let img = sharp(join(OUT, src)).extract(r);
  if (highlight) {
    const pad = 9;
    const h = {
      x: (highlight.x - x - pad) * SCALE,
      y: (highlight.y - y - pad) * SCALE,
      w: (highlight.width + pad * 2) * SCALE,
      h: (highlight.height + pad * 2) * SCALE,
    };
    // Two strokes: a wide translucent halo under a crisp ring, so the mark
    // stays legible over both the dark chrome and the lit accent surfaces.
    const svg = `<svg width="${r.width}" height="${r.height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${h.x}" y="${h.y}" width="${h.w}" height="${h.h}" rx="16"
        fill="none" stroke="${RING}" stroke-width="16" stroke-opacity="0.22"/>
      <rect x="${h.x}" y="${h.y}" width="${h.w}" height="${h.h}" rx="16"
        fill="none" stroke="${RING}" stroke-width="5"/>
    </svg>`;
    img = img.composite([{ input: Buffer.from(svg), top: 0, left: 0 }]);
  }
  await img.png().toFile(join(OUT, dest));
  console.log('wrote', dest);
}

const fh = boxes.fileHistory;
await crop(
  'editor.png',
  'history-button.png',
  { x: fh.x - 400, y: 0, w: 400 + fh.width + 110, h: 52 },
  fh,
);

const bp = boxes.buildPill;
await crop(
  'editor.png',
  'build-pill.png',
  { x: 0, y: bp.y - 78, w: 780, h: 78 + bp.height + 26 },
  bp,
);

// The preview pane's own left edge, taken from the Recompile button rather than
// from the page element: above fit-width zoom the page is wider than the pane
// and its box starts to the left of it, which drags a slice of the source pane
// into the crop.
const rc = boxes.recompile;
await crop('editor.png', 'pdf-pane.png', { x: rc.x - 14, y: 52, w: W - (rc.x - 14), h: H - 52 });

// The template gallery opens on top of the New project dialog, so a full-frame
// shot stacks two dialog footers and reads as three overlapping buttons. Crop to
// the gallery itself, with enough margin to keep it floating.
const td = boxes.templateDialog;
if (td) {
  await crop('templates-full.png', 'templates.png', {
    x: td.x - 26,
    y: td.y - 26,
    w: td.width + 52,
    h: td.height + 52,
  });
}
