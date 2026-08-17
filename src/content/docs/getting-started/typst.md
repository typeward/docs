---
title: Typst projects
description: What a Typst project needs, how it compiles, and every place Typst differs from LaTeX in Typeward.
---

This page explains what a Typst project needs in Typeward and where it differs from a LaTeX project. A Typst project compiles to a PDF in the same source pane and preview pane, and it uses the same projects library, sidebar, version history, and review tools. For LaTeX projects and their engines, see [Choosing a compile engine](/getting-started/compile-engines/).

## What a Typst project needs

A Typst project compiles through the `typst` command-line tool, which Typeward never bundles. What you get is keyed to what is already on your machine:

- With `typst` on your `PATH`, Typst projects compile, preview, and export like LaTeX ones.
- Without `typst`, every Typst compile fails with one message naming the download page, and LaTeX work is unaffected.
- With `tinymist` on your `PATH` as well, the source pane adds completion, diagnostics, and **Outline** symbols.
- Without `tinymist`, the source pane and the **Outline** work on Typeward's own parsing.

That one binary is the only setup a Typst project requires. The tinymist language server is optional.

## Known limitations

These features belong to the LaTeX side of the app, and a Typst project does not get them.

- A Typst project has no engine choice, because Typeward always runs the `typst` command-line tool. **System TeX**, **Tectonic**, the build menu, the **Engine** pills in the sidebar and the status bar, and the **Build** section of **Project settings…** are all LaTeX-only.
- Typst produces no SyncTeX data. The forward-search command that LaTeX projects bind to `Ctrl+J` (`Cmd+J` on macOS) is never registered, and double-clicking the PDF quietly does nothing.
- The **PDF + annotations** export places comments through SyncTeX, so in a Typst project that row stays disabled with the hint "Needs SyncTeX (LaTeX only)".
- The PDF carries no highlight bands for review threads, because Typeward paints those bands through SyncTeX.
- Chapter drafts stay LaTeX-only, because **Draft this chapter** is built on LaTeX's `\includeonly`. See [Chapter drafts](/compiling/chapter-drafts/).
- The visual editor renders `.tex` files only. See [Visual editing for LaTeX](/editor/visual-editing/).
- The LaTeX label index skips `.typ` files. `\ref` and `\cite` completion with no result cap, `Ctrl+click` (`Cmd+click` on macOS) go-to-definition, **Rename label**, and **Find references** belong to [LaTeX navigation](/editor/latex-navigation/).

Review comments and TODOs themselves work in a Typst project. Threads anchor in the source, so the editor gutter markers and the **Review** and **TODO** sidebar tabs behave as usual. Only the bands painted onto the PDF are missing.

## The typst command-line tool

The `typst` command-line tool is the program that turns a `.typ` file into a PDF. Typeward resolves it against your `PATH`, never from the project folder, so a `typst` executable sitting inside a project you opened is never the one that runs. When it is missing, the compile fails with this message:

```
typst is not on PATH; install it from https://typst.app/download or `cargo install typst-cli`
```

Install it from the [Typst download page](https://typst.app/download) or with `cargo install typst-cli`, then compile again.

First-run onboarding checks for the tool as well. Under "Checking your typesetting setup" a **Typst** row, subtitled "Only for Typst projects", carries a "Get it from typst.app" link. The row shows a green **Ready** badge once the tool is found, and **Re-scan** probes again after you install it.

Nothing about Typst blocks the rest of onboarding. A machine with no Typst installed can still create LaTeX projects.

## New Typst projects

A Typst project starts the same way as a LaTeX one, from `Ctrl+N` (`Cmd+N` on macOS) or **New project** in the projects library. The dialog asks for a format, and it describes the **Typst** card as "Modern alternative to LaTeX". Typeward creates a folder under your projects root holding a starter `main.typ`. That file is a level-one `=` heading with the project name and one line of body text.

A template start is the other route, through **Template** in the dialog's "Or start from:" strip. One built-in Typst template ships, **Typst article**, with **Title** and **Author** variables that substitute into `main.typ` at create time. Any Typst project can become a reusable template of your own through **Save project as template**. See [Project templates](/projects/templates/).

Existing folders import as Typst projects too. **Import folder** and repository clones look for a root file at the top level in this order: `main.tex`, then the first `.tex`, then the first `.typ`. A folder with no `.tex` and at least one `.typ` therefore opens as a Typst project.

You can change the main file later in **Project settings…**, where the picker lists the project's `.typ` files and refuses one whose extension does not match the format. See [Files and folders](/projects/files-and-folders/).

## The compile loop

`Ctrl+Enter` (`Cmd+Enter` on macOS) runs **Compile Typst**, the command the palette lists with the subtitle "typst CLI: native PDF, no LaTeX engine needed". The compile button in the preview toolbar does the same thing. `Ctrl+S` (`Cmd+S` on macOS) runs **Save and compile**, which saves every dirty buffer and then compiles once. Every compile saves first, so `typst` always sees what is on screen.

Typst projects follow the global **Auto-compile on save** setting in **Settings → Editor → Compilation**, which is off by default. Typst has no per-project build settings, so the global value is the only one in play. With it on, an autosave triggers a recompile as well. See [Per-project build configuration](/compiling/build-configuration/) for what a LaTeX project can override.

Typeward runs `typst compile <main file>` from the project root and passes no other flags. The build log opens with the command line it ran, for example:

```
$ typst compile main.typ
```

Output streams into the **All logs** tab while the build runs, and the primary toolbar button turns into a red **Stop** that kills the process tree. A runaway build is cut off after ten minutes with the log line `error: typst timed out after 10 minutes; build aborted`.

The PDF lands beside the entry file as `<main file stem>.pdf`, so `main.typ` produces `main.pdf`. Typst always rewrites that file, so Typeward never takes the unchanged-output shortcut and every compile reloads the [PDF preview](/preview/pdf-preview/). The viewer restores your scroll offset across the reload, but not the source-line anchoring LaTeX gets from SyncTeX.

:::caution[The Compile options popover is the LaTeX one]
The **Compile options** popover next to the compile button belongs to the LaTeX build. Its **Compile on save** switch does apply. **Stop on first error** and the read-only **Engine:** line describe LaTeX compiles and change nothing about a Typst build.
:::

## Typst diagnostics

A Typst diagnostic is one `error:`, `warning:`, or `hint:` line, usually followed by a location line. Typeward turns them into cards in the **Errors**, **Warnings**, and **Info** tabs of the logs panel, with hints landing under **Info**.

The location line under the message decides where selecting the card jumps.

| Location in the diagnostic | Where the card jumps |
| --- | --- |
| A path inside the project | That file and line |
| An absolute path, which a package or an out-of-project include produces | The main file |
| No location at all | The main file, line 1 |

Typeward parses the human-readable output rather than a structured format, so the message text on a card is the wording `typst` printed. The raw stream is always in **All logs**.

## Editor support

The source pane treats `.typ` files as Typst throughout: highlighting, the **Outline**, the format toolbar, comments, grammar checking, and word counts all use the Typst dialect. The highlighter is a compact one rather than a full Typst parser. It colors comments, strings, math runs, headings, function and variable hashes, emphasis, and brackets.

### tinymist

Typeward starts tinymist, the Typst language server, when a Typst project opens and the `tinymist` binary is on your `PATH`. What that adds:

- Completion as you type
- Diagnostics as squiggles in the source pane
- Document symbols for the **Outline**

Completion in a Typst project comes from tinymist or not at all. If the binary is missing, the source pane continues without it. There is no error, no notification, and no setting to switch it on: presence on `PATH` is the only control.

Typeward sends the server no configuration of its own, so it runs on its defaults. Like `typst`, tinymist is resolved from `PATH` only, never from the project folder.

The **Outline** still fills without tinymist. The built-in parser reads `=` heading lines and nests them by the number of `=` marks. See [Search, replace, and navigation](/editor/search-and-navigation/).

### Markup the format toolbar writes

The format toolbar and the matching command palette entries insert Typst markup in `.typ` files. Three of those actions carry a shortcut: `Ctrl+B` (`Cmd+B` on macOS) for bold, `Ctrl+I` (`Cmd+I` on macOS) for italic, and `Ctrl+U` (`Cmd+U` on macOS) for underline. The rest are toolbar buttons and palette commands with no shortcut.

Each action inserts a fixed piece of Typst markup.

| Action | Markup inserted |
| --- | --- |
| Bold | `*text*` |
| Italic | `_text_` |
| Underline | `#underline[text]` |
| Inline code | `` `text` `` |
| Heading | `= ` |
| Bulleted list | `- ` |
| Numbered list | `+ ` |
| Block quote | `#quote(block: true)[...]` |
| Inline math | `$...$` |
| Equation | `$ ... $` on its own line |
| Figure | `#figure(image("..."), caption: [])` |
| Table | `#table(columns: 2, ...)` |
| Link | `#link("...")[text]` |
| Citation | `@`, with the cursor after it for the key |

See [Autocomplete, snippets, and formatting](/editor/autocomplete-and-snippets/) for how these inserts behave around a selection.

### Comments, references, and grammar

The line comment token is `//`, and block comments use `/* ... */`. **Toggle comment** in the [editor context menu](/editor/context-menu/) writes the line form. The sidebar word count strips `//` comments and `#` command tokens before counting a `.typ` file.

Citations use Typst's `@key` syntax. Picking an entry in the **Refs** tab writes `@key` at the cursor, and every reference source works the same in a Typst project as in a LaTeX one.

The aggregated bibliography lands in the project's `.typeward` folder, at `.typeward/citations/library.bib`. Typeward never edits your document to load it, so the `#bibliography` call that points at that file is yours to write. See [How references work](/references/how-references-work/).

[Grammar and spell checking](/editor/grammar-checking/) parses `.typ` files with a Typst-aware parser, so code and markup are skipped and only prose is checked.

## Exports

**Export PDF** and **Source bundle (.zip)** behave the same as in any project. **Word (.docx)** and **HTML** convert Typst input through pandoc, which must be on your `PATH`. Typst input needs pandoc 3.1.12 or newer, and an older build fails with a message ending "is too old for Typst input; 3.1.12+ required". See [Exporting your work](/projects/exports/).

## What stays the same

Typst projects are ordinary Typeward projects. [Version history](/projects/version-history/) versions `.typ` files exactly as it versions `.tex` files, and autosave and crash recovery cover every text file. The projects library, templates, git, and cloud sync do not care which format a project uses. Where a page in these docs does not name a format, it applies to both.

## See also

- [Choosing a compile engine](/getting-started/compile-engines/)
- [Per-project build configuration](/compiling/build-configuration/)
- [Autocomplete, snippets, and formatting](/editor/autocomplete-and-snippets/)
- [Project templates](/projects/templates/)
- [Exporting your work](/projects/exports/)
