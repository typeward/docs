// Generates the sample "compiled" PDF the capture mock serves to the app's
// pdf.js viewer: a two-page Times-set article matching the seeded main.tex
// (title, author, abstract, numbered sections). Hand-assembled PDF with a
// computed xref so it needs no dependencies. Writes sample.pdf next to this
// script; capture.mjs reads and base64-inlines it.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 612, H = 792; // US letter, points

// Rough Times centering: average glyph width ~0.48em.
const cx = (text, size) => (W / 2 - text.length * size * 0.24).toFixed(1);

const line = (font, size, x, y, text) =>
  `BT /${font} ${size} Tf ${x} ${y} Td (${text.replace(/([()\\])/g, '\\$1')}) Tj ET`;

const body = (x, y, lines, size = 11, leading = 15) =>
  lines.map((t, i) => line('F1', size, x, y - i * leading, t)).join('\n');

const page1 = [
  line('F1', 20, cx('My first article', 20), 700, 'My first article'),
  line('F1', 12, cx('you', 12), 668, 'you'),
  line('F1', 11, cx('July 31, 2026', 11), 650, 'July 31, 2026'),
  line('F2', 11, cx('Abstract', 11), 606, 'Abstract'),
  body(126, 588, [
    'A short note written in Typeward. The whole loop, editing, compiling, and preview,',
    'happens on this machine; this page is the compiled output of main.tex.',
  ], 10, 13),
  line('F2', 14, 72, 540, '1   Introduction'),
  body(72, 516, [
    'Typesetting is a solved problem; waiting for it is not. A local compiler admits no',
    'queue, so the round trip from keystroke to page collapses to the time your own',
    'hardware needs. Consider the identity',
  ]),
  line('F1', 12, cx('a\xb2 + b\xb2 = c\xb2', 12), 448, 'a\xb2 + b\xb2 = c\xb2'),
  line('F1', 11, 500, 448, '(1)'),
  // Every line below is a line of MAIN_TEX in capture.mjs, set. Keep them in
  // step: this PDF sits next to that source in the shots, and a sentence here
  // that is not there reads as the preview showing a different document.
  body(72, 420, ['set from a single line of source, hyphenated and justified in the same pass.']),
  line('F2', 14, 72, 360, '2   Method'),
  body(72, 336, [
    'Write in the source pane on the left; save with Ctrl+S and the compiled page on',
    'the right catches up.',
  ]),
  line('F1', 10, cx('1', 10), 40, '1'),
].join('\n');

const page2 = [
  line('F2', 14, 72, 700, '3   Results'),
  body(72, 676, [
    'The compile finished in under a second, and the preview swapped the new pages in',
    'without a flash.',
  ]),
  line('F2', 14, 72, 616, '4   Discussion'),
  body(72, 592, [
    'Plain files in a plain folder: this project compiles the same way from the command',
    'line.',
  ]),
  line('F1', 10, cx('2', 10), 40, '2'),
].join('\n');

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>',
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 7 0 R /F2 8 0 R >> >> /Contents 4 0 R >>`,
  null, // stream 1 placeholder
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 7 0 R /F2 8 0 R >> >> /Contents 6 0 R >>`,
  null, // stream 2 placeholder
  '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>',
];

const streams = { 4: page1, 6: page2 };

let out = '%PDF-1.4\n';
const offsets = [];
for (let i = 0; i < objects.length; i++) {
  const num = i + 1;
  offsets[num] = out.length;
  if (streams[num]) {
    const s = streams[num];
    out += `${num} 0 obj\n<< /Length ${s.length} >>\nstream\n${s}\nendstream\nendobj\n`;
  } else {
    out += `${num} 0 obj\n${objects[i]}\nendobj\n`;
  }
}
const xrefAt = out.length;
out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let n = 1; n <= objects.length; n++) out += `${String(offsets[n]).padStart(10, '0')} 00000 n \n`;
out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;

const dest = join(dirname(fileURLToPath(import.meta.url)), 'sample.pdf');
writeFileSync(dest, Buffer.from(out, 'latin1'));
console.log('wrote', dest, out.length, 'bytes');
