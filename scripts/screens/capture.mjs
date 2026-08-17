// Captures Typeward app screenshots and videos for the docs by driving the
// app's real frontend (vite dev server, port 1420) in headless Chromium with
// the IPC mock from ./mock.js injected. No changes to the app repo.
//
// Prereqs: app dev server running (npm run dev in ../app), playwright
// available (see README.md). Run: node scripts/screens/capture.mjs
// Output: scripts/screens/out/*.png, *.webm, boxes.json -- review, then copy
// the keepers into src/assets/screens/ and public/videos/.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync, renameSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { installMock } from './mock.js';
import { installOverlay } from './overlay.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
mkdirSync(OUT, { recursive: true });

const APP = 'http://localhost:1420';
// 1440x900 at 2x for stills and clips alike, so the app never changes scale
// between them. Narrower boxes crop the PDF pane: at 1280 the preview clips the
// page's left margin and the zoom control falls off the right edge.
const VIEWPORT = { width: 1440, height: 900 };
// Locale and time zone are pinned: without them the app formats every history
// timestamp and date placeholder in the capture machine's locale, and the docs
// end up shipping Czech dates to an English page.
const SHELL = {
  viewport: VIEWPORT,
  colorScheme: 'dark',
  locale: 'en-US',
  timezoneId: 'Europe/London',
};
const ROOT = 'C:\\Users\\you\\Documents\\Typeward\\my-first-article';
const THESIS = 'C:\\Users\\you\\Documents\\Typeward\\phd-thesis';
const SLIDES = 'C:\\Users\\you\\Documents\\Typeward\\group-meeting-slides';
const now = Date.now();
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

const MAIN_TEX = `\\documentclass[11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{amsmath, amssymb, amsfonts}
\\usepackage{graphicx}
\\usepackage[hidelinks]{hyperref}

\\title{My first article}
\\author{you}
\\date{\\today}

\\begin{document}
\\maketitle

\\begin{abstract}
A short note written in Typeward. The whole loop, editing, compiling, and
preview, happens on this machine; this page is the compiled output of
\\texttt{main.tex}.
\\end{abstract}

\\section{Introduction}

Typesetting is a solved problem; waiting for it is not. A local compiler
admits no queue, so the round trip from keystroke to page collapses to the
time your own hardware needs. Consider the identity
\\begin{equation}
  a^2 + b^2 = c^2
\\end{equation}
set from a single line of source, hyphenated and justified in the same pass.

\\section{Method}

Write in the source pane on the left; save with \\texttt{Ctrl+S} and the
compiled page on the right catches up.

\\section{Results}

The compile finished in under a second, and the preview swapped the new
pages in without a flash.

\\section{Discussion}

Plain files in a plain folder: this project compiles the same way from the
command line.

\\end{document}
`;

export const data = {
  theme: 'lamplight',
  pdfBase64: readFileSync(join(HERE, 'sample.pdf')).toString('base64'),
  settings: {
    theme: 'lamplight',
    accent: 'violet-cyan',
    editor: {
      autoCompile: false, vimMode: false, lineWrap: true, fontSize: 13,
      stopOnFirstError: true, lineNumbers: true, highlightActiveLine: true,
      autocomplete: true, bracketMatching: true, autoCloseBrackets: true,
      tabSize: 2, lineHeight: 'normal', autosaveEnabled: true, autosaveDelayMs: 500,
      pdfDefaultZoom: 110, pdfInvertDark: false, visualModeLatex: false,
    },
    projectsRoot: 'C:\\Users\\you\\Documents\\Typeward',
    compileEngine: 'system-tex',
    onboarded: true,
    ui: {
      density: 'cozy', uiScale: 100, animations: true, ambientLights: true,
      accentGradient: true, glowEffects: true, customThemesEnabled: false, activeCustomTheme: null,
    },
    workspace: {
      enableSpaces: true, enableTags: true, notificationsPanelDefault: false,
      defaultView: 'cards', defaultSort: 'last-opened', widgets: {},
      dashboardEnabled: false, dashboardOrder: [], projectCardWords: false,
      statsCards: [], spaces: [{ id: 'research', name: 'Research', tint: 'accent' }],
      editorLayout: 'split', consolePosition: 'pdf-tab', sidebarPx: null, centerSplit: 0.55,
    },
    integrations: {
      references: { betterBibTex: { enabled: false }, zoteroWeb: {}, mendeley: {} },
      cloud: { accounts: [] },
      vcs: { git: {}, github: {} },
      ai: { enabled: true, perProviderModel: {} },
      grammar: { enabled: false },
      templates: { recentTemplateIds: [] },
      account: {},
    },
    privacy: { shareCrashReports: false },
    updates: { checkAutomatically: false },
    sync: { syncSettings: true },
    history: { maxVersionsPerFile: 50 },
    feedback: { promptsEnabled: true },
  },
  projects: [
    {
      rootPath: ROOT, rootFile: 'main.tex', format: 'latex', name: 'My first article',
      lastOpenedAt: now - 2 * HOUR, createdAt: now - 3 * HOUR, modifiedAt: now - 2 * HOUR,
    },
    {
      rootPath: THESIS, rootFile: 'main.tex', format: 'latex', name: 'PhD thesis',
      tags: ['research', 'draft'], space: 'research', deadline: '2026-09-15',
      lastOpenedAt: now - 2 * DAY, createdAt: now - 60 * DAY, modifiedAt: now - 2 * DAY,
    },
    {
      rootPath: SLIDES, rootFile: 'main.tex', format: 'latex', name: 'Group meeting slides',
      tags: ['slides'], lastOpenedAt: now - 5 * DAY, createdAt: now - 20 * DAY, modifiedAt: now - 5 * DAY,
    },
  ],
  files: {
    [ROOT + '::main.tex']: MAIN_TEX,
  },
  dirs: {
    [ROOT]: [
      { name: 'figures', isDirectory: true, isFile: false, isSymlink: false },
      { name: 'main.tex', isDirectory: false, isFile: true, isSymlink: false },
      { name: 'refs.bib', isDirectory: false, isFile: true, isSymlink: false },
    ],
    [ROOT + '\\figures']: [],
  },
  templates: [
    {
      id: 'builtin:article', name: 'Basic article',
      description: 'Single-file LaTeX article with title, author, abstract, and a starter body.',
      format: 'latex', tags: ['basic', 'article'], thumbnail: null, rootFile: 'main.tex',
      variables: [
        { key: 'title', label: 'Title', default: 'Untitled' },
        { key: 'author', label: 'Author', default: '' },
        { key: 'abstract', label: 'Abstract', default: '', multiline: true },
      ],
      files: [{ path: 'main.tex', template: true }], entitlement: null, source: 'builtin',
    },
    {
      id: 'builtin:beamer', name: 'Beamer slides',
      description: 'Beamer presentation with title slide and a few example frames.',
      format: 'latex', tags: ['presentation', 'slides', 'beamer'], thumbnail: null, rootFile: 'main.tex',
      variables: [
        { key: 'title', label: 'Title', default: 'Untitled' },
        { key: 'author', label: 'Author', default: '' },
        { key: 'institute', label: 'Institute', default: '' },
      ],
      files: [{ path: 'main.tex', template: true }], entitlement: null, source: 'builtin',
    },
    {
      id: 'builtin:ieee-conference', name: 'IEEE conference paper',
      description: 'IEEE conference template (IEEEtran class, two-column). Requires the IEEEtran class in your TeX distribution.',
      format: 'latex', tags: ['academic', 'ieee', 'conference'], thumbnail: null, rootFile: 'main.tex',
      variables: [
        { key: 'title', label: 'Paper title', default: 'Untitled' },
        { key: 'authors', label: 'Authors (comma-separated)', default: '' },
        { key: 'abstract', label: 'Abstract', default: '', multiline: true },
        { key: 'keywords', label: 'Index terms', default: '' },
      ],
      files: [{ path: 'main.tex', template: true }, { path: 'references.bib', template: false }],
      entitlement: null, source: 'builtin',
    },
    {
      id: 'builtin:typst-article', name: 'Typst article',
      description: 'Modern Typst article with title, author, and a starter body. Compiles with the bundled Typst CLI.',
      format: 'typst', tags: ['typst', 'article'], thumbnail: null, rootFile: 'main.typ',
      variables: [
        { key: 'title', label: 'Title', default: 'Untitled' },
        { key: 'author', label: 'Author', default: '' },
      ],
      files: [{ path: 'main.typ', template: true }], entitlement: null, source: 'builtin',
    },
  ],
  history: [
    { hash: 'f3a91c07d2e84b6a5c1d9e0f7a8b2c4d6e8f0a1b3c5d7e9f1a3b5c7d9e0f2a4b', ts: now - 2 * HOUR, size: 1462, relPath: 'main.tex' },
    { hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90', ts: now - 3 * HOUR, size: 1391, relPath: 'main.tex' },
    { hash: '0f1e2d3c4b5a69788796a5b4c3d2e1f00f1e2d3c4b5a69788796a5b4c3d2e1f0', ts: now - 26 * HOUR, size: 1214, relPath: 'main.tex' },
    { hash: '9e8d7c6b5a49382716059e8d7c6b5a49382716059e8d7c6b5a4938271605aabb', ts: now - 27 * HOUR, size: 987, relPath: 'main.tex' },
  ],
  // The older version has to differ near the TOP of the file: the restore
  // dialog shows a diff from the first line, and a change buried at the end
  // leaves the whole visible page identical, which is a screenshot of nothing.
  historyOldVersion: MAIN_TEX.replace('\\title{My first article}', '\\title{Untitled}').replace(
    'A short note written in Typeward. The whole loop, editing, compiling, and\npreview, happens on this machine; this page is the compiled output of\n\\texttt{main.tex}.',
    'A short note written in Typeward.',
  ),
  // Flag order matters: this line is what the logs shot presents as "the exact
  // command Typeward ran". It is built in src-tauri/src/compile.rs
  // (system_tex_flags): engine selector, synctex, interaction, halt-on-error.
  compileLog: [
    '$ latexmk -pdf -synctex=1 -interaction=nonstopmode -halt-on-error main.tex',
    'Rc files read: latexmkrc',
    'Latexmk: applying rule pdflatex...',
    'This is pdfTeX, Version 3.141592653-2.6-1.40.26 (TeX Live 2025)',
    'entering extended mode: main.tex',
    'LaTeX2e <2024-11-01>',
    'Output written on main.pdf (2 pages, 40233 bytes).',
    'SyncTeX written on main.synctex.gz.',
    'Latexmk: All targets (main.pdf) are up-to-date.',
  ].join('\n'),
  engineProbe: {
    engines: [
      { name: 'pdflatex', path: 'C:\\texlive\\2025\\bin\\windows\\pdflatex.exe', version: 'pdfTeX 3.141592653', installed: true },
      { name: 'xelatex', path: 'C:\\texlive\\2025\\bin\\windows\\xelatex.exe', version: 'XeTeX 3.141592653', installed: true },
      { name: 'lualatex', path: 'C:\\texlive\\2025\\bin\\windows\\lualatex.exe', version: 'LuaHBTeX 1.18.0', installed: true },
      { name: 'latexmk', path: 'C:\\texlive\\2025\\bin\\windows\\latexmk.exe', version: '4.86a', installed: true },
      { name: 'synctex', path: 'C:\\texlive\\2025\\bin\\windows\\synctex.exe', version: '1.23', installed: true },
    ],
    anyLatexAvailable: true,
  },
  systemInfo: {
    appVersion: '0.0.1', os: 'windows', osVersion: '10.0.26200', arch: 'x86_64',
    compileEngine: 'system-tex', tools: [{ name: 'latexmk', found: true }, { name: 'synctex', found: true }],
  },
};

// Chromium reserves some Ctrl chords (Ctrl+N for sure) even under Playwright,
// so app-level shortcuts are dispatched as synthetic keydown events instead --
// the app's command router listens on the page and takes them fine.
function chord(page, key, { ctrl = true, shift = false } = {}) {
  return page.evaluate(
    ([key, ctrl, shift]) => {
      const target = document.activeElement ?? document.body;
      target.dispatchEvent(
        new KeyboardEvent('keydown', { key, ctrlKey: ctrl, shiftKey: shift, bubbles: true, cancelable: true })
      );
    },
    [key, ctrl, shift]
  );
}

const errors = [];
function watch(page, label) {
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${label}] ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => errors.push(`[${label}] ${String(e).slice(0, 200)}`));
}

async function openEditorViaLibrary(page) {
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForSelector('h1:has-text("Library")');
  await page.locator('div[role="button"].card-glow', { hasText: 'My first article' }).first().click();
  await page.waitForSelector('.cm-content');
  await page.waitForTimeout(600);
}

// The first-run screen only exists before onboarding, so it needs its own
// context with its own seed: a fresh install with no projects yet.
async function welcomeShot() {
  const fresh = { ...data, settings: { ...data.settings, onboarded: false }, projects: [] };
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...SHELL, deviceScaleFactor: 2 });
  await ctx.addInitScript(installMock, fresh);
  const page = await ctx.newPage();
  watch(page, 'welcome');
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Welcome to Typeward', { timeout: 15000 });
  await page.mouse.move(700, 760);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(OUT, 'welcome.png') });
  await ctx.close();
  await browser.close();
}

async function screenshots() {
  await welcomeShot();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...SHELL, deviceScaleFactor: 2 });
  await ctx.addInitScript(installMock, data);
  const page = await ctx.newPage();
  watch(page, 'shots');

  // 1. Library
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForSelector('h1:has-text("Library")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(OUT, 'library.png') });

  // Element rects used by annotate.mjs. Collected as each state is reached,
  // because a dialog's box cannot be measured after the dialog is gone.
  const boxes = {};

  // 2. New project dialog + template gallery
  await page.locator('.card-glow', { hasText: 'New project' }).first().click();
  await page.waitForSelector('text=Pick a format');
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, 'new-project.png') });
  await page.locator('[role="dialog"]').locator('button', { hasText: 'Template' }).first().click();
  await page.waitForSelector('text=Pick a template');
  await page.waitForSelector('text=IEEE conference paper');
  await page.waitForTimeout(400);
  boxes.templateDialog = await page.locator('[role="dialog"]').last().boundingBox();
  // The gallery surface is translucent and opens on top of the New project
  // dialog, so that dialog's Cancel and Create show through the gallery's own
  // footer and the shot reads as three overlapping buttons. Hide the parent for
  // the frame; the gallery is the subject either way.
  await page.evaluate(() => {
    const dialogs = document.querySelectorAll('[role="dialog"]');
    if (dialogs.length > 1) dialogs[0].style.visibility = 'hidden';
  });
  await page.waitForTimeout(250);
  // Full frame; annotate.mjs crops the gallery out of it.
  await page.screenshot({ path: join(OUT, 'templates-full.png') });
  // Reload rather than unwinding two stacked dialogs -- deterministic.
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForSelector('h1:has-text("Library")');

  // 3. Editor, compiled, cursor placed
  await page.locator('div[role="button"].card-glow', { hasText: 'My first article' }).first().click();
  await page.waitForSelector('.cm-content');
  await page.locator('.cm-content').click({ position: { x: 200, y: 260 } });
  await chord(page, 'Enter');
  await page.waitForSelector('[data-page="1"] canvas', { timeout: 15000 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(OUT, 'editor.png') });

  // Bounding boxes for annotation crops (CSS px at 1440x900; PNG is 2x).
  // Note pdfPage is the page element, which at zoom levels above fit-width is
  // WIDER than the pane and starts left of it, so it cannot bound a crop of the
  // preview; the Recompile button is the reliable left edge of that pane.
  for (const [key, sel] of Object.entries({
    fileHistory: 'button[aria-label="Project history"]',
    layout: 'button[aria-label="Layout"]',
    buildPill: 'button:has-text("pdflatex")',
    pdfPage: '[data-page="1"]',
    recompile: 'button:has-text("Recompile")',
    tabStrip: '[role="tab"]',
  })) {
    const el = page.locator(sel).first();
    boxes[key] = await el.boundingBox().catch(() => null);
  }
  writeFileSync(join(OUT, 'boxes.json'), JSON.stringify(boxes, null, 2));

  // 4. Logs view (post-compile: All logs holds the latexmk output)
  await page.locator('button[aria-label="Logs"]').first().click();
  await page.locator('[role="tab"]:has-text("All logs"), button:has-text("All logs")').first().click().catch(() => {});
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, 'logs.png') });
  await page.locator('button[aria-label="Logs"]').first().click().catch(() => {});
  await page.waitForTimeout(300);

  // 5. Command palette
  await chord(page, 'k');
  await page.waitForSelector('div[role="dialog"][aria-label="Command palette"]');
  await page.keyboard.type('insert');
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, 'palette.png') });
  await page.keyboard.press('Escape');

  // 6. Visual editing
  const editingMode = page.locator('[aria-label="Editing mode"]');
  await editingMode.locator('button:has-text("Visual")').click();
  await page.waitForSelector('.cm-vis-card, .cm-vis-chip, .cm-vis-math', { timeout: 8000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, 'visual.png') });
  await editingMode.locator('button:has-text("Source")').click();
  await page.waitForTimeout(300);

  // 7. Focus mode
  await chord(page, 'F', { shift: true });
  await page.waitForSelector('button:has-text("Exit focus")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, 'focus.png') });
  await chord(page, 'F', { shift: true });
  await page.waitForTimeout(300);

  // 8. Project history popover. Reloaded first: leaving focus mode does not
  // restore the sidebar width or the editor/preview split, so without this the
  // history shot shows a wider sidebar than every other shot on the site, with
  // the Review and TODO tabs collapsed to bare icons.
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForSelector('h1:has-text("Library")');
  await page.locator('div[role="button"].card-glow', { hasText: 'My first article' }).first().click();
  await page.waitForSelector('.cm-content');
  await page.waitForTimeout(700);
  await page.locator('button[aria-label="Project history"]').click();
  await page.waitForSelector('[role="group"][aria-label="Project history"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, 'history.png') });
  await page.keyboard.press('Escape');

  // 9. Settings: Appearance, then Editor. Park the mouse so no tooltip shows.
  await page.locator('button[title="Settings"]').click();
  await page.waitForSelector('text=Density & motion');
  await page.mouse.move(700, 700);
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, 'settings-appearance.png') });
  // Two "Editor" buttons exist: the back-breadcrumb (first) and the settings
  // nav entry (later in DOM) -- the nav one is wanted.
  await page.getByRole('button', { name: 'Editor', exact: true }).last().click();
  await page.waitForSelector('text=Compilation');
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, 'settings-editor.png') });

  await ctx.close();
  await browser.close();
}

// ---- clips ---------------------------------------------------------------
//
// Every clip is driven through the overlay (./overlay.js): the pointer travels
// to a control before the real click fires, shortcuts show their keycaps, and
// each step names itself in a caption, so a viewer can follow what happened
// without reading the surrounding page.
//
// The driver also drops marks. Recording starts when the page is created, so
// the app's load and the walk to the starting state are unavoidably in the
// file; mark('start') and mark('end') tell postprocess.mjs where the clip
// really begins and ends, and everything outside is trimmed away. That is what
// keeps the loop tight instead of parking on a dead frame.

const clipSay = (page, text, settle) => page.evaluate(([t, s]) => window.__demo.say(t, s), [text, settle]);
const clipKeys = (page, list, hold) => page.evaluate(([l, h]) => window.__demo.keys(l, h), [list, hold]);
const cursorAt = (page, x, y) => page.evaluate(([x, y]) => window.__demo.at(x, y), [x, y]);
const cursorFade = (page) => page.evaluate(() => window.__demo.fade());

function asLocator(page, target) {
  return typeof target === 'string' ? page.locator(target).first() : target;
}

// Glide the pointer onto a control, ripple, then let Playwright do the real
// click underneath.
async function clipClick(page, target, opts = {}) {
  const loc = asLocator(page, target);
  // Scroll first, then measure: a box read before the scroll would park the
  // pointer at pre-scroll coordinates, which is how it ends up off-frame while
  // Playwright clicks something the viewer never sees it reach.
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(220);
  const box = await loc.boundingBox();
  if (!box) throw new Error(`clipClick: target not visible (${String(target)})`);
  const x = box.x + (opts.fx ?? 0.5) * box.width;
  const y = box.y + (opts.fy ?? 0.5) * box.height;
  await page.evaluate(([x, y]) => window.__demo.to(x, y), [x, y]);
  await page.evaluate(() => window.__demo.tap());
  await loc.click();
  await page.waitForTimeout(opts.after ?? 320);
}

// Keycaps and the shortcut itself, fired on the beat the caps light up.
async function clipChord(page, caps, key, mods = {}) {
  const shown = clipKeys(page, caps);
  await page.waitForTimeout(430);
  await chord(page, key, mods);
  await shown;
}

// `node capture.mjs videos focus-mode` re-records one clip instead of all four.
const ONLY_CLIP = process.argv[3];

// Clips run on the app's slowest autosave preset. On the 500ms default the
// buffer saves itself while the pointer is still travelling, so the top bar has
// already flipped to "Saved" before the Ctrl+S keycaps land and the clip
// appears to claim credit for a save that already happened.
const clipData = {
  ...data,
  settings: { ...data.settings, editor: { ...data.settings.editor, autosaveDelayMs: 2000 } },
};

async function video(name, drive) {
  if (ONLY_CLIP && name !== ONLY_CLIP) return;
  // The screencast samples the compositor, not the page, so a context-level
  // deviceScaleFactor buys nothing: the frames arrive at 1x and Playwright just
  // letterboxes them into the requested size. Forcing the scale factor on the
  // browser itself is what actually produces a 2x tape.
  const browser = await chromium.launch({ args: ['--force-device-scale-factor=2'] });
  const ctx = await browser.newContext({
    ...SHELL,
    recordVideo: { dir: OUT, size: { width: VIEWPORT.width * 2, height: VIEWPORT.height * 2 } },
  });
  await ctx.addInitScript(installMock, clipData);
  await ctx.addInitScript(installOverlay, { accent: '#e8a34d' });
  const page = await ctx.newPage();
  const t0 = Date.now();
  const marks = {};
  const mark = (label) => {
    marks[label] = Number(((Date.now() - t0) / 1000).toFixed(2));
  };
  watch(page, name);
  await drive(page, mark);
  mark('end');
  await ctx.close();
  await browser.close();
  // Playwright names videos with a random hash; rename the newest.
  const vids = readdirSync(OUT).filter((f) => f.endsWith('.webm') && !f.startsWith('doc-'));
  if (vids.length) renameSync(join(OUT, vids[0]), join(OUT, `doc-${name}.webm`));
  writeFileSync(join(OUT, `doc-${name}.marks.json`), JSON.stringify(marks, null, 2));
  console.log(`clip ${name}:`, marks);
}

// One throwaway load so vite has transformed every module before the recorded
// context starts; a cold first paint would otherwise eat seconds of tape.
async function warm() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...SHELL });
  await ctx.addInitScript(installMock, data);
  const page = await ctx.newPage();
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForSelector('h1:has-text("Library")');
  await ctx.close();
  await browser.close();
}

async function videos() {
  await warm();

  // Compiling: edit, save, watch the preview catch up. The click into the
  // source is not decoration -- core.save is editor-scoped, so the shortcut
  // only fires once CodeMirror actually holds focus.
  await video('compile-flow', async (page, mark) => {
    await openEditorViaLibrary(page);
    await cursorAt(page, 520, 300);
    mark('start');
    await clipSay(page, 'Write in the source pane', 400);
    // The edit lands in the Discussion paragraph, which the sample PDF sets on
    // page two: the preview shows page one, so what is on screen keeps matching
    // the source even though the mock always serves the same PDF.
    await clipClick(page, page.locator('.cm-line', { hasText: 'command line.' }).first(), { fx: 0.5 });
    await page.keyboard.press('End');
    await page.keyboard.type(' No queue, no upload.', { delay: 55 });
    await page.waitForTimeout(500);
    await clipSay(page, 'Ctrl+S saves the file and compiles it', 350);
    await clipChord(page, ['Ctrl', 'S'], 's');
    await page.waitForSelector('[data-page="1"] canvas', { timeout: 15000 });
    await clipSay(page, 'The preview swaps in the new PDF', 600);
    await page.waitForTimeout(1600);
    await cursorFade(page);
    await page.waitForTimeout(500);
  });

  // Visual editing: the toggle, what it renders, and the trip back.
  await video('visual-editing', async (page, mark) => {
    await openEditorViaLibrary(page);
    const editingMode = page.locator('[aria-label="Editing mode"]');
    await cursorAt(page, 520, 420);
    mark('start');
    await clipSay(page, 'Source mode shows the LaTeX you typed', 900);
    await page.waitForTimeout(500);
    await clipSay(page, 'Switch the editor to Visual', 350);
    await clipClick(page, editingMode.locator('button:has-text("Visual")'));
    await page.waitForSelector('.cm-vis-card, .cm-vis-chip, .cm-vis-math', { timeout: 8000 });
    await clipSay(page, 'Headings, styles, and lists render in place', 600);
    mark('poster');
    await page.waitForTimeout(2000);
    await clipSay(page, 'Back to Source: the file never changed', 350);
    await clipClick(page, editingMode.locator('button:has-text("Source")'));
    await page.waitForTimeout(1400);
    await cursorFade(page);
    await page.waitForTimeout(400);
  });

  // Focus mode: one shortcut in, the same shortcut out.
  await video('focus-mode', async (page, mark) => {
    await openEditorViaLibrary(page);
    await cursorAt(page, 560, 430);
    mark('start');
    await clipSay(page, 'Focus mode hides the chrome around your writing', 400);
    await clipChord(page, ['Ctrl', 'Shift', 'F'], 'F', { shift: true });
    await page.waitForSelector('button:has-text("Exit focus")');
    await page.waitForTimeout(900);
    mark('poster');
    await page.waitForTimeout(1000);
    await clipSay(page, 'The same shortcut brings the chrome back', 350);
    await clipChord(page, ['Ctrl', 'Shift', 'F'], 'F', { shift: true });
    await page.waitForTimeout(1300);
    await cursorFade(page);
    await page.waitForTimeout(400);
  });

  // Version history: the button, the list, and the diff before restoring.
  await video('version-history', async (page, mark) => {
    await openEditorViaLibrary(page);
    await cursorAt(page, 640, 320);
    mark('start');
    await clipSay(page, 'Every save records a version', 400);
    await clipClick(page, 'button[aria-label="Project history"]', { after: 500 });
    await page.waitForSelector('[role="group"][aria-label="Project history"]');
    await clipSay(page, 'Project history lists them newest first', 700);
    mark('poster');
    await page.waitForTimeout(900);
    await clipSay(page, 'Pick one to see what changed', 350);
    await clipClick(page, '[role="group"][aria-label="Project history"] button:has-text("main.tex")', { after: 700 });
    await clipSay(page, 'A read-only diff, before anything is restored', 600);
    await page.waitForTimeout(2000);
    await cursorFade(page);
    await page.waitForTimeout(400);
  });
}

// Importable (the sample data and the mock wiring are reused by debug
// harnesses); only the direct `node capture.mjs ...` run captures anything.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const what = process.argv[2] ?? 'all';
  if (what === 'all' || what === 'shots') await screenshots();
  if (what === 'all' || what === 'videos') await videos();
  console.log('console errors:', errors.length ? errors : 'none');
  console.log('done -> ', OUT);
}
