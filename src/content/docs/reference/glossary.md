---
title: Glossary
description: Alphabetical definitions of the Typeward, LaTeX, Typst, and git terms used across these docs, each linking to the page that covers it.
---

This page defines the vocabulary these docs assume, in alphabetical order, and points each term at the page that covers it in depth.

**Auxiliary files**: the intermediate files a LaTeX compile writes next to your sources, such as `.aux`, `.bbl`, `.log`, and `.toc`. They carry cross-references and bibliography data from one pass to the next. When stale auxiliary files wedge a compile, **Clean auxiliary files** in the build menu removes them. See [Per-project build configuration](/compiling/build-configuration/).

**Chapter draft**: a partial LaTeX compile that typesets only the chapter you are editing. Run **Draft this chapter** from the command palette, opened with `Ctrl+K` (`Cmd+K` on macOS). Typeward compiles with `\includeonly` and reuses the auxiliary files from the last full compile, so cross-references and page numbers stay intact. See [Chapter drafts](/compiling/chapter-drafts/).

**Class**: the LaTeX document type declared with `\documentclass{...}`, such as `article`, `beamer`, or `IEEEtran`. A class is a `.cls` file that sets the overall structure and layout of the document. See [LaTeX basics in Typeward](/getting-started/latex-basics/).

**Content-addressed store**: the way version history is kept in app data. Typeward compresses each recorded version into a blob named for the SHA-256 hash of its contents, so two saves with identical text share one blob. A small index maps each file to its ordered versions. See [Version history](/projects/version-history/).

**Engine**: the program that turns your source into a PDF. Typeward's LaTeX engines are pdfLaTeX, XeLaTeX, LuaLaTeX, and Tectonic, picked globally in **Settings** and per project in the build menu. Typst projects compile with the `typst` command-line tool instead. See [Choosing a compile engine](/getting-started/compile-engines/).

**Fast-forward**: a git pull that moves your branch forward onto commits that already continue from it, with no merge commit. Typeward pulls fast-forward only. A pull stops with an error once the histories have diverged, so resolve those pulls in another git client. See [Git in Typeward](/projects/git/).

**Harper**: the grammar and spelling checker built into Typeward. It runs on your machine inside the app itself, and it parses LaTeX, Typst, and Markdown so that commands and code are not flagged as prose. Harper is off until you turn it on. See [Grammar and spell checking](/editor/grammar-checking/).

**Language server**: a background program Typeward runs to supply completion, diagnostics, and document symbols as you type. texlab serves LaTeX and tinymist serves Typst. Both run entirely on your machine, and both are optional, because compiling, preview, and LaTeX reference navigation work without one. See [Autocomplete, snippets, and formatting](/editor/autocomplete-and-snippets/).

**`library.bib`**: the single bibliography Typeward assembles at `.typeward/citations/library.bib` from every reference source you connect. Entries from all sources merge into it, and a repeated citation key is kept once. Typeward rewrites the file on every refresh, so change your reference manager rather than the file. See [How references work](/references/how-references-work/).

**Main file**: the file a compile starts from, also called the root file. Other files join it through `\input` or `\include`. Change the main file in the **Project settings** dialog. See [Files and folders](/projects/files-and-folders/).

**Package**: a reusable LaTeX add-on loaded with `\usepackage{...}` and shipped as a `.sty` file. Your TeX distribution installs packages, and Tectonic downloads missing ones on demand. See [LaTeX basics in Typeward](/getting-started/latex-basics/).

**Preamble**: everything in a LaTeX file before `\begin{document}`, meaning the document class, the package loads, and the settings that apply document-wide. See [LaTeX basics in Typeward](/getting-started/latex-basics/).

**Project index**: the map Typeward keeps of every `\label` defined in a LaTeX project's TeX files and every citation key in its `.bib` files. It serves `\ref` and `\cite` completion, jump to definition, hover previews, and the undefined-label warnings, with or without a language server. See [Labels, references, and navigation](/editor/latex-navigation/).

**Projects root**: the folder Typeward creates projects in and lists projects from, `Documents/Typeward` by default. Change it under **Settings → Projects & files**. The projects root must stay inside your Documents folder. See [Data locations, credentials, and uninstall](/reference/data-locations/).

**SCM**: source control management, and the name of the sidebar tab that holds a project's git work. The tab covers changed files, the staging area, the commit box, and fetch, pull, and push. **SCM** appears only when the project folder is a git repository. See [Git in Typeward](/projects/git/).

**Shell-escape**: a compile option that lets a document run external programs during the compile. Shell-escape is off by default, and turning it on takes a per-machine approval the first time. See [Per-project build configuration](/compiling/build-configuration/).

**Snapshot**: a crash-recovery copy of unsaved edits, written to `.typeward/snapshots/` inside the project while autosave is off. Typeward deletes a snapshot as soon as the file is saved for real. See [Autosave and crash recovery](/projects/autosave-recovery/).

**Staging**: git's holding area for the changes that go into the next commit. In the **SCM** tab, **Stage** moves a file from **Changes** to **Staged**, and **Unstage** moves it back. A commit records only what is staged. See [Git in Typeward](/projects/git/).

**SyncTeX**: the position map a LaTeX compile writes alongside the PDF. Typeward reads it to jump from a source line to its place in the output, and from a click in the preview pane back to the source. Reading it needs the `synctex` tool from a TeX distribution, and Typst produces no SyncTeX data at all. See [Compiling LaTeX and reading errors](/compiling/compiling-latex/).

**Tectonic**: the self-contained LaTeX engine bundled with Typeward's macOS builds and with the x64 Windows and Linux builds. The ARM64 Windows and Linux packages ship without it, so install a TeX distribution or your own `tectonic` command there. It compiles without a TeX distribution installed, downloading the packages a document needs on first use and caching them for later compiles. Tectonic is XeLaTeX-based, and Typeward runs it in its untrusted mode unless you approve shell-escape for the project. See [Choosing a compile engine](/getting-started/compile-engines/).

**TeX distribution**: a full install of the TeX toolchain, meaning the engines, the packages, and tools such as `latexmk` and `synctex`. TeX Live, MacTeX, and MiKTeX are the common ones. The **System TeX** engine uses whichever distribution is installed. See [Choosing a compile engine](/getting-started/compile-engines/).

**texlab**: the language server for LaTeX files, picked up automatically from your `PATH` when installed. It adds command and environment completion, its own diagnostics, and the symbols that fill **Outline**. Label and citation navigation come from Typeward's own project index and do not need it. See [Troubleshooting](/troubleshooting/troubleshooting/).

**tinymist**: the language server for Typst files, picked up from your `PATH` the same way texlab is. It is the only source of as-you-type completion and diagnostics for `.typ` files, which the project index does not cover. See [Typst projects](/getting-started/typst/).

**`.typeward` folder**: a hidden folder inside every project where Typeward keeps per-project metadata, crash-recovery snapshots, the aggregated bibliography, and staged export artifacts. Its `project.json` is what marks a folder as a Typeward project. The whole folder stays out of git commits, exports, and templates. See [Data locations, credentials, and uninstall](/reference/data-locations/).

**Typst**: a newer typesetting language, and the second document format Typeward supports alongside LaTeX. Typst projects compile with the `typst` command-line tool, which Typeward does not bundle. They have their own templates, preview, and language server. See [Typst projects](/getting-started/typst/).

**Version history**: Typeward's per-file record of saved states, kept compressed in app data rather than in the project folder. You compare and restore earlier states from the **Project history** panel. See [Version history](/projects/version-history/).

**WebDAV**: the file-transfer protocol Typeward's cloud sync speaks. Point it at a server you already have, such as Nextcloud, ownCloud, or a NAS. Projects sync through that server, with no Typeward service in between. See [Cloud sync with WebDAV](/projects/cloud-sync/).

## See also

- [Settings reference](/reference/settings/)
- [Keyboard shortcuts](/reference/keyboard-shortcuts/)
- [Data locations, credentials, and uninstall](/reference/data-locations/)
