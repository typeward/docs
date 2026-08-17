// Browser-side Tauri IPC mock for capturing Typeward app screenshots.
//
// Injected with page.addInitScript(installMock, data) BEFORE the app loads.
// It fakes window.__TAURI_INTERNALS__ (and __TAURI_EVENT_PLUGIN_INTERNALS__,
// which every unlisten() touches synchronously), so the real frontend runs
// against canned data with zero changes to the app repo. The command surface
// and shapes follow the recon of app/src/ipc/index.ts; unknown commands log
// loudly and resolve null so new app code degrades visibly, not silently.
//
// The function must stay self-contained: Playwright serializes it, so no
// closures over module scope.

export function installMock(data) {
  const files = new Map(Object.entries(data.files));
  const callbacks = new Map();
  let nextCallbackId = 1;
  let nextEventId = 1;

  // Deterministic capture: force the theme before boot-theme.js reads it,
  // and pre-satisfy the feedback-prompt pacing so no card can ever appear.
  localStorage.setItem('typeward.theme', JSON.stringify({ theme: data.theme, accent: 'violet-cyan' }));
  localStorage.setItem('typeward.densityAutoApplied', '1');
  localStorage.setItem(
    'typeward.feedback-prompt',
    JSON.stringify({ firstRunAt: Date.now(), sessionCount: 0, lastShownAt: null, dismissCount: 0, submitted: true })
  );

  const b64ToBuf = (b64) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  };

  const handlers = {
    // --- boot ---
    load_settings: () => data.settings,
    save_settings: () => null,
    custom_themes_list: () => ({ themes: [], warnings: [] }),
    list_projects: () => data.projects,
    supabase_session_read: () => null,
    record_event: () => null,
    collect_system_info: () => data.systemInfo,
    list_recent_events: () => [],
    detect_tex: () => data.engineProbe,

    // --- projects / editor ---
    open_project: (a) => data.projects.find((p) => p.rootPath === a.path) ?? data.projects[0],
    touch_project_opened: () => null,
    list_orphan_snapshots: () => [],
    // The project index backs \ref and \cite completion, hover, go-to-definition
    // and the reference lint. Returning null here crashes the lint source, which
    // reads .labels off the result unguarded, so answer with an empty index: the
    // sample document defines no labels and cites nothing.
    index_project: () => ({ labels: [], citations: [], truncated: false }),
    unindex_project: () => null,
    take_pending_open: () => null,
    probe_last_build_output: () => null,
    scan_project_todos: () => [],
    watch_project: () => null,
    unwatch_project: () => null,
    read_project_text_file: (a) => {
      const key = a.projectRoot + '::' + a.relPath;
      if (files.has(key)) return files.get(key);
      return Promise.reject('failed to read file: no such file (os error 2)');
    },
    write_project_text_file: (a) => {
      files.set(a.projectRoot + '::' + a.relPath, a.content);
      return null;
    },
    write_snapshot: () => null,
    clear_snapshot: () => null,
    history_record: () => false,
    history_list_project: () => data.history,
    history_list: (a) => data.history.filter((h) => h.relPath === a.relPath).map(({ relPath, ...rest }) => rest),
    history_read_version: () => data.historyOldVersion,
    shell_escape_trust_get: () => null,
    synctex_forward: () => null,
    synctex_inverse: () => null,

    // --- templates ---
    templates_list: () => data.templates,

    // --- compile: succeed, then serve the sample PDF from plugin:fs|read_file ---
    compile_latex: (a) => ({
      ok: true,
      outputPath: (a.project?.rootPath ?? data.projects[0].rootPath) + '\\.typeward\\build\\main.pdf',
      diagnostics: [],
      log: data.compileLog,
      durationMs: 842,
    }),

    // --- LSP: reject so the editor runs LSP-less (recon: swallowed w/ warn) ---
    start_lsp: () => Promise.reject('texlab executable not found on PATH'),

    // --- plugins ---
    'plugin:event|listen': () => nextEventId++,
    'plugin:event|unlisten': () => null,
    'plugin:event|emit': () => null,
    'plugin:event|emit_to': () => null,
    'plugin:fs|read_dir': (a) => data.dirs[a.path] ?? [],
    'plugin:fs|exists': () => false,
    'plugin:fs|read_file': (a) => {
      if (String(a.path).endsWith('main.pdf')) return b64ToBuf(data.pdfBase64);
      return Promise.reject('no such file (os error 2)');
    },
    'plugin:window|set_title': () => null,
    'plugin:window|get_all_windows': () => ['main'],
  };

  window.__TAURI_INTERNALS__ = {
    invoke(cmd, args, _options) {
      const h = handlers[cmd];
      if (!h) {
        console.warn('[mock] unhandled command:', cmd, args);
        return Promise.resolve(null);
      }
      try {
        return Promise.resolve(h(args ?? {}));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    transformCallback(cb, _once) {
      const id = nextCallbackId++;
      callbacks.set(id, cb);
      return id;
    },
    unregisterCallback(id) {
      callbacks.delete(id);
    },
    convertFileSrc(path, protocol = 'asset') {
      return 'http://asset.localhost/' + encodeURIComponent(path);
    },
    metadata: {
      platform: 'windows',
      currentWindow: { label: 'main' },
      currentWebview: { windowLabel: 'main', label: 'main' },
    },
  };

  window.__TAURI_EVENT_PLUGIN_INTERNALS__ = {
    unregisterListener() {},
  };
}
