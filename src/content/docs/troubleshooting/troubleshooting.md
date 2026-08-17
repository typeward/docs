---
title: Troubleshooting
description: Compile failures, missing engines and language servers, SyncTeX, credential problems, and how to read Typeward's logs when something breaks.
---

This page covers the failures you can hit while compiling, editing, exporting, and connecting an integration, and it names the exact message Typeward shows for each one. Typeward reports every failure inside the running app: compile problems in the logs panel, and everything else as a toast at the moment it happens. For questions that are not failures, see [FAQ](/troubleshooting/faq/).

## Start here

Find your symptom, then open the section that fixes it.

| Symptom | Where to look |
| --- | --- |
| No LaTeX project compiles at all | [`No LaTeX engine on PATH`](/troubleshooting/troubleshooting/#no-latex-engine-on-path) |
| A Typst project does not compile | [`typst is not on PATH`](/troubleshooting/troubleshooting/#typst-is-not-on-path) |
| A tool you installed stays invisible to Typeward | [Typeward cannot see a tool you installed](/troubleshooting/troubleshooting/#typeward-cannot-see-a-tool-you-installed) |
| The log names a missing `.sty` file | [A package is missing](/troubleshooting/troubleshooting/#a-package-is-missing) |
| The build runs forever, or stops after ten minutes | [`latexmk timed out after 10 minutes`](/troubleshooting/troubleshooting/#latexmk-timed-out-after-10-minutes) |
| The build fails after a change to the bibliography setup | [`Stale auxiliary files are blocking this build`](/troubleshooting/troubleshooting/#stale-auxiliary-files-are-blocking-this-build) |
| Citations come out as question marks | [`bibtex exit: not found on PATH`](/troubleshooting/troubleshooting/#bibtex-exit-not-found-on-path) |
| Citations in a chapter draft stay unresolved | [Citations stay unresolved in a chapter draft](/troubleshooting/troubleshooting/#citations-stay-unresolved-in-a-chapter-draft) |
| A document needs shell-escape | [`shell-escape requested but this project is not trusted`](/troubleshooting/troubleshooting/#shell-escape-requested-but-this-project-is-not-trusted) |
| Completion, hover, and jump to definition do nothing | [Completions never appear](/troubleshooting/troubleshooting/#completions-never-appear) |
| The PDF does not jump to the matching source line | [Double-clicking the PDF does not jump to the source](/troubleshooting/troubleshooting/#double-clicking-the-pdf-does-not-jump-to-the-source) |
| The preview shows an older PDF than your source | [`Preview is stale`](/troubleshooting/troubleshooting/#preview-is-stale) |
| The preview shows a PDF from a previous session | [`From last build`](/troubleshooting/troubleshooting/#from-last-build) |
| An export to Word or HTML fails | [`pandoc was not found on PATH`](/troubleshooting/troubleshooting/#pandoc-was-not-found-on-path) |
| An integration asks for its credentials again | [Integration credentials do not stick](/troubleshooting/troubleshooting/#integration-credentials-do-not-stick) |
| Every setting is back to its default | [Settings went back to their defaults](/troubleshooting/troubleshooting/#settings-went-back-to-their-defaults) |
| Typeward closed unexpectedly | [The app crashed](/troubleshooting/troubleshooting/#the-app-crashed) |

## Where failures appear

Typeward keeps no error log on disk and sends nothing anywhere on its own, so everything you need is in the running app. See [Privacy and network behavior](/reference/privacy-and-network/) for what that means in detail.

The logs panel is a tab next to the preview pane by default, and the **Layout** menu can move it to a **Bottom drawer** under the source pane. Its five tabs are **All logs**, **Errors**, **Warnings**, **Info**, and **Grammar**.

**All logs** holds the raw compiler output, streamed live while the build runs. Every engine except Tectonic echoes each command before its output (`$ latexmk ...`). The **Errors**, **Warnings**, and **Info** tabs hold the diagnostics parsed out of that log, and each card jumps to the file and line it was attributed to. Diagnostics that came from a distribution or package file stay collapsed behind a **Show N from packages and classes** toggle. See [Compiling LaTeX and reading errors](/compiling/compiling-latex/).

The status bar shows the compile indicator: a duration with a check when the build succeeded, a red mark when it failed. Selecting it recompiles after a success and opens the **Errors** tab after a failure. When no logs panel is on screen (focus mode, an editor-only layout, or a detached preview), a failed compile raises a **Compile failed** toast with a **View errors** action.

Everything else surfaces as a toast at the moment it happens. Typeward writes no diagnostics log, no crash report, and no usage data, and **Settings** has no Diagnostics panel.

## Engines and external tools

### `No LaTeX engine on PATH`

The full line reads `No LaTeX engine on PATH (pdflatex not found). Install MiKTeX/TeX Live or pick the Tectonic engine in the build menu.`

Typeward could not find `pdflatex` on your `PATH`, or `xelatex` or `lualatex` when one of those engines is selected. Either no TeX distribution is installed, or the one you installed is invisible to Typeward.

Two fixes work, cheapest first:

- In the build menu, pick the bundled **Tectonic** engine, which needs no TeX distribution at all.
- Install MiKTeX or TeX Live, then restart Typeward.

Both options are covered in [Choosing a compile engine](/getting-started/compile-engines/).

To confirm what Typeward itself can see, open **Settings → Editor → Compilation**. The status line under the engine picker reports what was found:

- `No TeX installation detected; the Tectonic engine runs without one`
- `pdflatex only: latexmk is missing, so compiling calls pdflatex directly`
- A line naming the engine versions it resolved

The **Re-check** button probes again without restarting the app.

### `typst is not on PATH`

The full line reads `` typst is not on PATH; install it from https://typst.app/download or `cargo install typst-cli` ``.

This is the same problem in a Typst project. Typeward never bundles the `typst` command-line tool, so a Typst project compiles only when `typst` is on your `PATH`.

To fix it:

1. Install the `typst` command-line tool.
2. Restart Typeward.

See [Typst projects](/getting-started/typst/).

### `Tectonic is not included in this build`

The full line reads `` Tectonic is not included in this build and was not found on PATH. Install tectonic, or pick a different engine in Settings. (Developers: run `npm run fetch:tectonic`.) ``

This appears on the ARM64 Windows and Linux builds, which ship without a bundled Tectonic binary, and in a build you compiled yourself without running `npm run fetch:tectonic`.

To fix it:

1. Install the `tectonic` command-line tool so it is on your `PATH`, or install MiKTeX or TeX Live and pick **pdfLaTeX**, **XeLaTeX**, or **LuaLaTeX** in the build menu.
2. If you built the app yourself, run `npm run fetch:tectonic` and build again.

See [Choosing a compile engine](/getting-started/compile-engines/) and [Build from source](/getting-started/build-from-source/).

### Typeward cannot see a tool you installed

Typeward resolves every external tool (the TeX engines, `synctex`, `pandoc`, `texlab`, `tinymist`) against the `PATH` of the process it was launched from, and never against the project folder. Excluding the project folder is deliberate: a binary planted inside a project can never run.

On macOS, Typeward merges your login shell's `PATH` at startup with `/usr/local/bin`, `/opt/homebrew/bin`, `/opt/local/bin`, `/Library/TeX/texbin`, and `~/.cargo/bin`. A Finder or Dock launch therefore finds MacTeX, Homebrew, and cargo installs the same way a terminal launch does. Quitting and reopening Typeward is normally enough after installing something new.

On Windows and Linux, Typeward inherits the environment of whatever launched it, with no fix-up:

1. Restart Typeward.
2. If the tool is still invisible, sign out and back in, because Explorer or your desktop session still holds the old `PATH`.
3. Start Typeward again.

## Compile failures

### A package is missing

A log line like `File 'xyz.sty' not found` means the document wants a package your setup does not have. What to do next depends on the engine.

| Engine | What to do |
| --- | --- |
| **Tectonic** | Check your network connection and compile again, because packages download on demand during the first compile that needs them. |
| **MiKTeX** | Enable on-the-fly package installation. |
| **TeX Live** | Run `tlmgr install <package>`. |

If a Tectonic compile fails offline every time, check whether `compile.strictOffline` is set in `settings.json`. That key has no settings screen, defaults to off, and when on it compiles strictly from Tectonic's cache and downloads nothing.

### `latexmk timed out after 10 minutes`

The log ends with `! latexmk timed out after 10 minutes; build aborted.`, and a Typst build writes the equivalent `error:` line. Ten minutes is Typeward's hard ceiling on a single compiler run, and on the deadline Typeward kills the whole process tree.

A document that hits the ceiling is almost always looping. The log capture keeps both the head and the tail of the output, so the last TeX lines before the stall survive even in an enormous log.

You do not have to wait for the ceiling. While a build runs, the preview toolbar's primary button turns into a red **Stop**, which kills the process tree and returns to idle with a **Compile stopped** message.

### `Stale auxiliary files are blocking this build`

The full warning reads `Stale auxiliary files are blocking this build (often after changing the bibliography setup). Use Engine → Clean auxiliary files, then compile again.` The log parser raised it because it found the signature of a wedged `.aux` set.

To clear it:

1. In the status bar, select the **Engine** pill to open the build menu.
2. At the bottom of the build menu, select **Clean auxiliary files**.
3. Compile again.

**Clean auxiliary files** deletes the `.aux`, `.bbl`, `.log`, and `.synctex` family and leaves the PDF alone. See [Per-project build configuration](/compiling/build-configuration/).

### `bibtex exit: not found on PATH`

The build log contains `[bibtex exit: not found on PATH; citations left unresolved]`, or the same line for `biber`, and your citations come out as question marks. The recipe asked for a bibliography pass, and that tool is not installed.

Two fixes work, cheapest first:

- In the build menu, switch the recipe to **Latexmk (auto)**.
- Install `bibtex` or `biber` with your TeX distribution.

Tectonic runs its own bibliography passes and ignores the recipe entirely.

### Citations stay unresolved in a chapter draft

A chapter draft never runs a bibliography pass. Citations added since the last full build therefore stay unresolved until you compile the whole document again. See [Chapter drafts](/compiling/chapter-drafts/).

### `shell-escape requested but this project is not trusted`

The full line reads `shell-escape requested but this project is not trusted on this machine; approve it in the build menu`. Shell-escape lets a document run arbitrary programs while it compiles, so Typeward makes it a per-project, per-machine decision.

To approve it:

1. In the build menu, turn on shell-escape for the project.
2. Approve the native prompt that follows.

The approval is recorded outside the project, so copying or cloning a project never carries its approval along. If you declined once, the toggle's hint reads **Blocked on this machine. Re-approve…**, and selecting that clears the block and prompts again.

## Source pane and preview pane

### Completions never appear

Typeward starts a language server when a project opens: `texlab` for LaTeX, `tinymist` for Typst. Both are resolved from your `PATH`, and both fail silently. No toast appears and no setting turns them on, because presence on the `PATH` Typeward sees is the only switch.

So the symptom is an absence. If completion beyond `\ref` and `\cite` never appears, the server is missing from the `PATH` Typeward sees.

To restore full completion:

1. Install `texlab` for a LaTeX project, or `tinymist` for a Typst project.
2. Confirm that the server runs in a terminal.
3. Restart Typeward.

If the server stays invisible after a restart, see [Typeward cannot see a tool you installed](/troubleshooting/troubleshooting/#typeward-cannot-see-a-tool-you-installed).

In a LaTeX project, a great deal keeps working without any server, because it comes from Typeward's own project index rather than from the language server:

- Uncapped `\ref` and `\cite` completion, with section and bibliography titles
- Jump to definition and hover previews
- The `Reference to undefined label "<key>"` and `Label "<key>" is defined more than once` warnings

See [Labels, references, and navigation](/editor/latex-navigation/). A Typst project has no such index, so `tinymist` is the only source of completion there. Compiling, preview, and [visual editing for LaTeX](/editor/visual-editing/) never need a language server.

### Double-clicking the PDF does not jump to the source

SyncTeX needs the `synctex` command-line tool, which ships with TeX Live, MacTeX, and MiKTeX. When it is missing, every lookup returns nothing at all, and nothing in the app reports the absence.

Three things go quiet together: forward search with `Ctrl+J` (`Cmd+J` on macOS), double-click inverse search, and the scroll anchor that keeps your place across recompiles. Everything else keeps working.

Two cases have no SyncTeX by design. An install that compiles only with the bundled **Tectonic** engine and has no TeX distribution produces none. A Typst project produces none either, because Typst writes no SyncTeX data. See [Choosing a compile engine](/getting-started/compile-engines/) and [PDF preview](/preview/pdf-preview/).

### `Preview is stale`

The ribbon reads `Preview is stale. Showing the last successful compile`. The most recent compile failed, so the previous PDF is still on screen.

To get back to a current PDF:

1. Select **View errors** in the ribbon to open the diagnostics.
2. Fix the first error the cards report.
3. Compile again.

### `From last build`

The ribbon reads `From last build. Nothing compiled yet this session`. Typeward found a PDF from a previous session on disk and seeded the preview with it.

This is a notice, not an error. One compile replaces the seeded PDF with a live result.

## Export failures

### `pandoc was not found on PATH`

The full line reads `pandoc was not found on PATH; install it from pandoc.org to export Word/HTML`. Word and HTML export shell out to pandoc, which Typeward does not bundle.

To fix it:

1. Install pandoc.
2. Restart Typeward.

### `pandoc is too old for Typst input`

The full line reads `pandoc <version> is too old for Typst input; 3.1.12+ required`. Exporting a Typst project through pandoc needs pandoc 3.1.12 or newer.

To fix it:

1. Upgrade pandoc.
2. Export again.

### `SyncTeX is unavailable`

The full line reads `SyncTeX is unavailable; annotation placement needs a LaTeX build with SyncTeX`. The **PDF + annotations** export places sticky notes using SyncTeX, so it needs a LaTeX build that produced SyncTeX data.

For what makes SyncTeX unavailable, see [Double-clicking the PDF does not jump to the source](/troubleshooting/troubleshooting/#double-clicking-the-pdf-does-not-jump-to-the-source). For the export itself, see [Exporting your work](/projects/exports/).

## Integrations and credentials

Typeward has no account and no sign-in of its own. The only secrets it stores are the ones an optional integration needs: a Zotero Web API key, a Mendeley token, a WebDAV app password, an AI provider key. Those go into the OS keyring under service names beginning with `typeward.`, never into a file. Typeward can only write, probe, and delete them, never read them back.

Nothing in the editor depends on the keyring. Editing, compiling, preview, templates, exports, and version history work with no keyring at all. [Git in Typeward](/projects/git/) authenticates through your own git credential helper rather than through Typeward's keyring entries.

### Integration credentials do not stick

A credential you saved is gone the next time the integration needs it, or saving it fails outright. On Windows, the Credential Manager caps a single credential at 2560 bytes, and Typeward does not split secrets across entries, so an unusually long token can fail to store. On macOS, a locked Keychain prompts you, and that prompt comes from the OS, not from Typeward.

To start clean:

1. Under **Settings → Integrations**, open **References**, **Cloud storage**, or **AI providers**.
2. Disconnect the integration, which deletes its keyring entry.
3. Connect it again.

You can also delete `typeward.*` entries by hand in Credential Manager, Keychain Access, Seahorse, or KWallet. Which entry belongs to what is listed in [Data locations](/reference/data-locations/), and the per-provider setup steps are in [Connecting reference managers](/references/connecting-reference-managers/), [Cloud sync](/projects/cloud-sync/), and [AI assistant](/ai/overview/).

### Saving an integration credential fails with `keyring error`

The message begins `keyring error:` and continues with whatever your operating system's credential store reported. On Linux and BSD, a Secret Service provider must be running, such as `gnome-keyring` or KWallet. Minimal window manager setups often have none, which is why the Debian package declares `libdbus-1-3`.

To fix it:

1. Install and start a Secret Service provider.
2. Connect the integration again.

See [Install on Linux](/getting-started/install-linux/).

## Settings and crashes

### Settings went back to their defaults

Typeward could not parse `settings.json` after a torn write or a bad hand edit, so it started from defaults. Your old values are still readable, because Typeward renames the unreadable file to `settings.json.corrupt` in the same folder before resetting. If that rename cannot be done at all, Typeward refuses to reset and leaves the original file alone.

Both files live in the app data folder listed in [Data locations](/reference/data-locations/). The settings themselves are documented in the [Settings reference](/reference/settings/).

### The app crashed

Reopen the project. If Typeward buffered edits that never reached disk, a **Recover unsaved changes?** dialog offers them back. See [Autosave and crash recovery](/projects/autosave-recovery/). If you saved and then lost the content, look in [Version history](/projects/version-history/) instead.

Nothing about the crash is recorded or transmitted. Typeward has no crash reporter, so no local crash log exists to read and nothing was sent anywhere.

## Still stuck

Open an issue at [github.com/typeward/app/issues](https://github.com/typeward/app/issues). Typeward sends nothing on its own, so this is something you write in your browser, and you decide exactly what goes in it.

Collect these first:

- The version from **Settings → About**
- Your operating system and its version
- The compile engine you use
- The part of the **All logs** tab that covers the failure

A short file that reproduces the problem helps more than a long description of one. The source you are filing against is described in [Open source and licensing](/reference/open-source/).
