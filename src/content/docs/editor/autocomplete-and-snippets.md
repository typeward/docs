---
title: Autocomplete, snippets, and formatting
description: What Typeward completes on its own, what texlab or tinymist adds, and the insert templates and formatting shortcuts for LaTeX, Typst, and Markdown.
---

This page explains what Typeward completes as you type, what an optional language server adds on top, and what the format toolbar inserts. For go to definition, hover previews, **Rename label**, and **Find references**, which are built in and LaTeX only, see [Labels, references, and navigation](/editor/latex-navigation/).

## The two sources of completion

Completion comes from a built-in project index that ships with the app, and from a language server you install yourself. What you get depends on the project and on whether a server is installed:

- LaTeX project, no server installed: `\ref` and `\cite` keys complete from the built-in index, which also warns about undefined and duplicate labels.
- LaTeX project with texlab: the same key completion, plus command and environment names, diagnostics, and **Outline** symbols.
- Typst project, no server installed: no completion, because Typeward clears the index in Typst projects.
- Typst project with tinymist: Typst syntax completion, diagnostics, and **Outline** symbols.
- Any Markdown file: no language server attaches, so the insert templates and the formatting shortcuts are what you get.

No language server is required, and Typeward downloads none for you. Compiling, the [PDF preview](/preview/pdf-preview/), [visual editing](/editor/visual-editing/), **Outline**, [references](/references/how-references-work/), and every formatting command on this page work without one. Nothing on this page requires an account.

## Reference and citation completion

Typeward keeps an in-memory index of every `\label` definition and every BibTeX key in the project, and completes keys from it as you type. When you open a LaTeX project, Typeward scans TeX-family files (`.tex`, `.ltx`, `.cls`, `.sty`, `.def`, `.clo`) for `\label{...}` definitions and `.bib` files for citation keys.

The index refreshes when the file watcher sees changes on disk. Typeward overlays the labels in the file you are editing on top of it, so a label you typed a second ago already completes.

Start typing a key inside a reference or citation argument and the list appears. Two command families trigger it:

- The reference family: `\ref`, `\eqref`, `\cref`, `\Cref`, `\pageref`, `\autoref`, `\nameref`, `\vref`, `\Vref`, `\labelcref`, their range forms such as `\crefrange`, and starred variants.
- The citation family: `\cite` plus the usual prefixes and suffixes, so `\citep`, `\citet`, `\textcite`, `\footcite`, and `\parencite` all trigger it, including forms with `[...]` arguments.

Both families take comma-separated key lists, and the source fires on the key segment under the cursor, so the second key in `\cite{einstein1905,` completes as readily as the first.

Each suggestion carries a detail line. For a label, the detail is the title of the nearest preceding sectioning command. A key such as `fig:setup` therefore reads as the figure's section rather than as a bare key. For a citation, the detail is the `title` field of the BibTeX entry.

The list is never capped. Every label in the project is reachable, however many there are, and lookup is a synchronous in-memory read, so results appear without a round trip.

Completion works the same with or without texlab. When texlab is running, it hands these contexts to the built-in source rather than answering them itself. When texlab is absent, the source mounts on its own.

## Reference warnings

Without a language server attached, Typeward checks the references in a LaTeX file against the index. Two warnings can appear in the gutter and under the text, about half a second after you stop typing:

- `Reference to undefined label "sec:method"` when a reference key matches no `\label` anywhere in the project.
- `Label "sec:method" is defined more than once` when a label repeats within the file or is also defined in another file.

The scope is deliberate. Typeward checks references only and never flags a `\cite` key, because a citation key can legitimately come from a `.bib` file the index never saw. Typeward also skips comments, and never warns on a half-typed `\ref{eq:mass` that has no closing brace.

Both checks stay silent until the first scan finishes, and in a project that defines no labels at all. With texlab attached, Typeward drops both warnings, because texlab ships its own undefined-reference diagnostics.

These are editor warnings rather than compile errors. Compile errors land in the logs panel after you compile. See [Compiling LaTeX and reading errors](/compiling/compiling-latex/).

## Language servers

A language server is a separate program that supplies completion, diagnostics, and document symbols for one language. Typeward starts one when a matching binary is on your `PATH` as you open a project:

- texlab serves LaTeX, and `.bib` files attach to the same session.
- tinymist serves Typst.
- Markdown and plain-text files never get a language server.

Typeward resolves the binary against `PATH` only, never the project folder, so a binary planted inside a project can never run. The server runs with the project root as its working directory.

An attached server adds exactly three things:

- Completion for everything outside the reference and citation contexts: command and environment names in LaTeX, Typst syntax in `.typ` files. Suggestions appear as you type, and `Ctrl+Space` asks for them explicitly, a literal `Ctrl` on every platform. On macOS, ``Alt+` `` and `Alt+I` do the same.
- Diagnostics as you type, underlined in the source as errors, warnings, or info notes according to the severity the server reports.
- Document symbols, which feed **Outline** in the sidebar. Without a server, **Outline** falls back to a built-in parser. See [Search, replace, and navigation](/editor/search-and-navigation/).

Typeward never takes hover, go to definition, find references, or rename from the language server. It implements them itself from the project index, for LaTeX, whether or not a server is running.

There is no settings page for language servers, no enable switch, and no configuration Typeward pushes to them. Presence on `PATH` is the whole switch, and the servers run on their own defaults.

One session runs per language per project. Sessions stop when the project closes, and a server that crashes is replaced the next time you open a matching file. When a session finishes starting after a file is already open, the editor reattaches without losing your undo history, cursor, or scroll position.

A missing server is never an error, and Typeward continues without it and says nothing. If completion beyond `\ref` and `\cite` never appears, the server is missing from your `PATH`. Install it, confirm that it runs in a terminal, then restart Typeward. See [Troubleshooting](/troubleshooting/troubleshooting/).

:::note[The Autocomplete setting never disables reference completion]
The **Autocomplete** toggle under **Settings → Editor** is described in the app as "Built-in word/snippet completion. Language-server completion is unaffected." It governs the editor's base completion only. Turning it off leaves both the index-backed `\ref` and `\cite` source and any language server untouched. Typeward also suppresses the base completion while a language server owns the editor, so the two never stack.
:::

## Snippets and insert templates

Typeward has no user-defined snippet system and no expansion triggers, so nothing expands when you type a keyword and press `Tab`. What it has instead are fixed, dialect-aware insert templates behind the format toolbar and the command palette's **Format** group. The dialect follows the active file, not the project, so a `README.md` inside a LaTeX project gets Markdown syntax.

Each command inserts the construct its dialect uses:

| Command | LaTeX | Typst | Markdown |
| --- | --- | --- | --- |
| Inline code | `\texttt{...}` | `` `...` `` | `` `...` `` |
| Heading | `\section{...}` | `= ...` | `# ...` |
| Bulleted list | `itemize` environment | `- ` lines | `- ` lines |
| Numbered list | `enumerate` environment | `+ ` lines | `1. ` lines |
| Block quote | `quote` environment | `#quote(block: true)[...]` | `> ...` |
| Inline math | `$...$` | `$...$` | `$...$` |
| Equation | `equation` environment | `$ ... $` block | `$$ ... $$` |
| Figure | `figure` environment with `\includegraphics`, `\caption{}`, `\label{fig:}` | `#figure` block with `image("")` and `caption: []` | `![]()` |
| Table | `table` environment with a `tabular` skeleton | `#table` block with `columns: 2` | pipe-table skeleton |
| Link | `\href{...}{text}` | `#link("...")[text]` | `[text](...)` |
| Citation | `\cite{...}` | `@...` | `[@...]` |

Insert a citation in a LaTeX file and the cursor lands inside the braces, where the built-in index completes the key. That works with no language server installed.

## Bold, italic, and underline

The three text styles are the only formatting commands with keyboard shortcuts, and they follow the active file's dialect as well:

| Style and shortcut | LaTeX | Typst | Markdown |
| --- | --- | --- | --- |
| Bold, `Ctrl+B` (`Cmd+B` on macOS) | `\textbf{...}` | `*...*` | `**...**` |
| Italic, `Ctrl+I` (`Cmd+I` on macOS) | `\textit{...}` | `_..._` | `*...*` |
| Underline, `Ctrl+U` (`Cmd+U` on macOS) | `\underline{...}` | `#underline[...]` | none |

Markdown has no underline construct, so `Ctrl+U` does nothing in `.md` files and the toolbar hides the button. The behavior matches a word processor:

- With a selection, the style wraps it and keeps it selected, so styles compound: bold, then italic.
- With a bare caret, Typeward inserts the empty construct and leaves the cursor inside.
- With several lines selected, the two list commands convert each line into an item.

## Format toolbar

The toolbar sits under the file tabs whenever the active file takes prose formatting: `.tex`, `.sty`, `.cls`, `.typ`, `.md`, `.markdown`. For `.bib` files and images the whole bar and the formatting shortcuts disappear, since a bold wrap inside a BibTeX entry would corrupt it. Its buttons come in three groups:

- Text style: **Bold**, **Italic**, **Underline**, **Inline code**.
- Structure: **Heading**, **Bulleted list**, **Numbered list**, **Block quote**.
- Insert: **Insert Inline math**, **Insert Equation**, **Insert Figure**, **Insert Table**, **Insert Link**, **Insert Citation**.

Typeward hides the buttons a dialect lacks rather than graying them out. For `.tex` files the toolbar also carries the **Source** and **Visual** switch. See [Visual editing for LaTeX](/editor/visual-editing/).

Every toolbar action is also a command in the command palette, under the **Format** group. The palette titles them **Inline Code**, **Heading**, **Bulleted List**, **Numbered List**, **Block Quote**, **Insert Inline Math**, **Insert Equation**, **Insert Figure**, **Insert Table**, **Insert Link**, and **Insert Citation**. None of them carry a keyboard shortcut, because bold, italic, and underline are the only formatting commands that have one. Open the palette with `Ctrl+K` (`Cmd+K` on macOS).

Focus mode hides the toolbar with the rest of the editor chrome, and `Ctrl+B`, `Ctrl+I`, and `Ctrl+U` keep working. See [Focus mode and keybindings](/editor/focus-and-vim/).

## Known limitations

- Reference and citation completion is LaTeX only. Typeward clears the index in Typst projects, where tinymist is the sole completion source.
- Only `.tex` and `.bib` files open with the LaTeX editor language. A `.sty` or `.cls` file contributes its labels to the index but gets no suggestions of its own.

## See also

- [Labels, references, and navigation](/editor/latex-navigation/)
- [Search, replace, and navigation](/editor/search-and-navigation/)
- [Visual editing for LaTeX](/editor/visual-editing/)
- [Editor overview](/editor/overview/)
