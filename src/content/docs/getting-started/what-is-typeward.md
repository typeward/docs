---
title: What is Typeward
description: "Typeward is an open-source desktop editor for LaTeX and Typst: plain-folder projects, local compiling, no account, and no paid tier."
---

This page explains what Typeward is, what every build contains, and where to go next in these docs. Typeward is an open-source desktop app for writing, compiling, and previewing LaTeX and Typst projects. It runs on Windows, macOS, and Linux, and everything it does happens on your own machine.

## Where to start

Start from the row that matches what you already have.

| What you have | Where to go |
| --- | --- |
| No app yet | [Install on Windows](/getting-started/install-windows/), [Install on macOS](/getting-started/install-macos/), or [Install on Linux](/getting-started/install-linux/) |
| The app, and no PDF yet | [Your first project](/getting-started/first-project/) |
| A project on Overleaf | [Importing from Overleaf](/getting-started/import-from-overleaf/) |
| No LaTeX experience | [LaTeX basics in Typeward](/getting-started/latex-basics/) |
| A Typst project | [Typst projects](/getting-started/typst/) |

## Plain-folder projects

A Typeward project is a plain folder on your disk, and your `.tex`, `.typ`, `.bib`, and figure files sit in it as ordinary files. You can open them in another tool, back them up however you like, or hand the project to a co-author as a zip. New projects go under the projects root, which is `Documents/Typeward` by default. You can point it at any folder.

Typeward keeps its own bookkeeping in the project's `.typeward` folder: project metadata, autosave snapshots, the aggregated bibliography, and similar files. See [Data locations, credentials, and uninstall](/reference/data-locations/).

## Local compiles

Every compile runs on your machine. LaTeX projects use your TeX distribution or the bundled Tectonic engine, and Typst projects use the `typst` command-line tool. Compiled output lands in the project folder, the same place a command-line compile puts it. See [Compiling LaTeX and reading errors](/compiling/compiling-latex/) and [Typst projects](/getting-started/typst/).

## No account and no telemetry

Typeward runs without an account, and it collects nothing about how you use it.

- There is no account of any kind. No sign-in screen exists, Typeward runs no server, and there is nothing to subscribe to.
- There is no telemetry and no crash reporting. Typeward makes no network connection you did not ask for.

Optional integrations use your own credentials. Zotero, Mendeley, a WebDAV server, and AI providers keep theirs in your operating system's keyring, and git uses the same credential helper your command line uses. Typeward stores none of them in a plain file, and sends them nowhere except to the service you pointed them at. See [Privacy and network behavior](/reference/privacy-and-network/).

## Open source

Typeward is free software, licensed GPL-3.0-or-later. The source lives in the [Typeward app repository](https://github.com/typeward/app), and Typeward publishes installers for Windows, macOS, and Linux on [GitHub releases](https://github.com/typeward/releases/releases). You can also build the app yourself. See [Build from source](/getting-started/build-from-source/).

For the license, the third-party notices, and how to contribute, see [Open source and licensing](/reference/open-source/).

## Features in every build

Typeward has no editions and no paid tier. Every build contains every feature, for every user, and no feature sits behind a plan.

### Editor

- [Editor overview](/editor/overview/): syntax highlighting, one tab per open file, the **Files** tab and the **Outline** in the sidebar, and the command palette on `Ctrl+K` (`Cmd+K` on macOS).
- [Autocomplete, snippets, and formatting](/editor/autocomplete-and-snippets/): built-in completion for `\ref` and `\cite` that needs no extra tooling, plus the texlab and tinymist language servers when they are on your PATH.
- [Visual editing for LaTeX](/editor/visual-editing/): work through a rendered view of your source, per file, with the file on disk staying the verbatim source you wrote.
- [Themes and appearance](/editor/themes/): six built-in themes, plus custom JSON themes.
- [Focus mode and keybindings](/editor/focus-and-vim/): focus mode, plus Vim or Emacs keybindings for the source pane.

### Citations and cross-references

- [How references work](/references/how-references-work/): Zotero (local and web), Mendeley, and DOI or arXiv lookup, aggregated into one bibliography per project.
- [Labels, references, and navigation](/editor/latex-navigation/): jump from a `\ref` or `\cite` to where it is defined, preview the target on hover, list every use of a label, and rename one across the project.

### Compilation and preview

- [Choosing a compile engine](/getting-started/compile-engines/): your TeX distribution, or the bundled Tectonic engine, which needs no TeX distribution on the machine.
- [Chapter drafts](/compiling/chapter-drafts/): after a full compile, recompile only the chapter you are editing, with cross-references and page numbers intact.
- [PDF preview](/preview/pdf-preview/): a live preview with SyncTeX jumping in both directions, from source to PDF and back. SyncTeX data comes from a TeX distribution, so a Tectonic-only setup compiles normally and never syncs.
- [Markdown preview](/preview/markdown-preview/): a live rendered view of `.md` files inside a project, math included.

### Projects and history

- [Project templates](/projects/templates/): built-in LaTeX and Typst templates, plus saving any project back out as a template of your own.
- [Importing from Overleaf](/getting-started/import-from-overleaf/): bring an existing project over from a zip export, or clone the git bridge.
- [Version history](/projects/version-history/): local per-file history with diff and restore.
- [Autosave and crash recovery](/projects/autosave-recovery/): autosave snapshots kept in the project's `.typeward` folder.
- [Review comments and TODOs](/editor/review-comments/): comments anchored to lines in your source, kept in the project's `.typeward` folder rather than in the text.

### Version control, sync, and export

- [Git in Typeward](/projects/git/): stage, commit, clone, fetch, pull, and push over HTTPS, using your own git identity and credential helper. Typeward ships its own git library, so you need no git installation.
- [Cloud sync with WebDAV](/projects/cloud-sync/): optional sync against a WebDAV server you control, such as Nextcloud, ownCloud, or a NAS. No Typeward server is involved.
- [Exporting your work](/projects/exports/): PDF, a source bundle, a PDF with your annotations, and Word or HTML through pandoc.

### Optional assistance

- [AI assistant](/ai/overview/): off until you turn it on in **Settings**. With it off, no AI code path runs and Typeward makes no AI request.
- [Grammar and spell checking](/editor/grammar-checking/): on-device checking with Harper, off until you turn it on in **Settings**. It runs inside the app, and no text leaves your machine.

## Known limitations

Every feature these docs describe ships in the build you downloaded. These are the limits of that build.

- Typeward is desktop only. Tablet layouts and a WebAssembly TeX engine for iPadOS and Android exist in the source tree, and only desktop builds ship.
- Typeward pulls fast-forward only and has no merge-conflict UI. Resolve a diverged history with an outside git client. See [Git in Typeward](/projects/git/).
- Typeward is a single-user editor with no real-time collaboration. Git and cloud sync cover asynchronous co-authoring.
- The built-in auto-updater is inactive in every shipped build. You update by downloading a new installer. See [How updates work](/reference/updates/).
- The AI assistant offers one provider in **Settings**, a local Ollama. **Settings** lists no cloud provider row, so it takes no cloud API key.
- Builds carry no code signature and no notarization, so Windows SmartScreen and macOS Gatekeeper warn you the first time you launch. Your install guide walks through the prompt.

## See also

- [Editor overview](/editor/overview/)
- [Privacy and network behavior](/reference/privacy-and-network/)
- [Data locations, credentials, and uninstall](/reference/data-locations/)
- [Open source and licensing](/reference/open-source/)
- [Troubleshooting](/troubleshooting/troubleshooting/)
- [FAQ](/troubleshooting/faq/)
