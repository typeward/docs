---
title: Labels, references, and navigation
description: Complete label and citation keys, jump to a definition, preview a target on hover, and rename a label across a LaTeX project.
---

This guide shows you how to move between labels, citations, and their definitions in a LaTeX project, and how to rename a label everywhere it appears. Every feature here is built into Typeward, runs locally, and works whether or not the texlab language server is installed. For Typst projects, see [Autocomplete, snippets, and formatting](/editor/autocomplete-and-snippets/).

Open a LaTeX project before you start. Typeward builds its index and registers these commands only while a LaTeX project is open.

## Known limitations

- Typst projects build no index, so key completion, jumping, hover previews, the two label warnings, **Find references**, and **Rename label** are LaTeX-only. Typst projects get their completion and diagnostics from tinymist.
- Completion, hover previews, jumping, and the two label warnings run only in the files the editor treats as LaTeX: `.tex` and `.bib`. Class and style files (`.cls`, `.sty`, `.def`, and `.clo`) open as plain text, so none of that runs inside them.
- The scan skips the project's `.typeward` folder, so a citation key that exists only in the generated `.typeward/citations/library.bib` never completes, and `Ctrl+click` (`Cmd+click` on macOS) does not jump to it. Insert those keys from the **Refs** tab. They still resolve when the document compiles. See [How references work](/references/how-references-work/).
- The scan stops at 2000 files, 8 MB per file, and 50,000 entries.
- **Find references** returns at most 5000 occurrences.

## Complete a label or citation key

Type inside the brace argument of a reference or citation command, and the index completes the key. Two command families trigger it:

- The `\ref` family: `\ref`, `\eqref`, `\cref`, `\Cref`, `\pageref`, `\autoref`, `\nameref`, `\vref`, `\labelcref`, ranges such as `\crefrange`, starred variants, and friends.
- The `\cite` family: `\cite` and its variants, such as `\citep`, `\citet`, `\textcite`, `\autocite`, `\footcite`, and `\parencite`, optional `[..]` arguments included.

Completion is comma-aware, so each slot in `\cite{einstein1905,bohr1913}` completes on its own. Every suggestion carries a hint: the section the label sits under, or the title of the `.bib` entry. Typeward serves the list from memory and never caps it, so the full set of matches appears at once.

This completion is always on in LaTeX projects, with or without texlab. The **Autocomplete** toggle under **Settings → Editor** does not affect it, because that toggle governs only the editor's base word completion. For where citation keys come from in the first place, see [How references work](/references/how-references-work/).

## Jump from a key to its definition

`Ctrl+click` (`Cmd+click` on macOS) a key, or place the cursor on it and press `F12`. Where you land depends on the key:

- A `\ref`-family key jumps to the defining `\label`, in whatever project file it lives, and Typeward opens that file if it is not already open.
- A `\cite` key jumps to the entry's line in its `.bib` file.

The lookup runs locally in memory, so the jump lands immediately. Typeward intercepts the modified click only when the key resolves, so on prose or an unknown key `Ctrl+click` still places the cursor as usual. A label typed moments ago in the active file resolves right away, and a citation key resolves once Typeward has scanned its `.bib` file.

Go to definition has no command palette entry. The click and `F12` are the whole surface.

## Preview a target on hover

Rest the pointer on a `\ref` or `\cite` key for 300 ms. The tooltip carries the key in bold, plus the target's section title or `.bib` title when the index has one. A location line names the file and line, in the form `label · main.tex:12` or `citation · refs.bib:48`.

A newly typed label resolves from the file you are editing and shows no title line. The tooltip uses the same resolver as the click, so a preview means the jump will work.

## List every use of a label

From the command palette, **Find references** lists every `\label` and `\ref` of the key under the cursor across the project. It has no keyboard shortcut and no context menu entry, and it registers only while a LaTeX project is open.

1. Place the cursor on a `\label` or a `\ref`-family key.
2. Press `Ctrl+K` (`Cmd+K` on macOS) to open the command palette.
3. Under **Refactor**, select **Find references**.
4. In the **References** dialog, select a row to jump to that line.

The dialog opens showing the key followed by `, scanning…`, then settles into a count in the form `eq:mass, 4 occurrences in 2 files`. The dialog groups occurrences by file, one row per hit, carrying the line number and the source line trimmed at 160 characters. The row holding the defining `\label` carries a `def` badge, which the app renders in capitals.

Selecting a row opens the file if needed and closes the dialog, and **Close** dismisses it. When nothing matches, the dialog reads `No references found.` If the command cannot run, a toast names the condition that failed: `Open a LaTeX file to find references.` or `Place the cursor on a \label or \ref to find its references.`

## Rename a label across the project

From the command palette, **Rename label** renames the `\label` under the cursor and every `\ref` to it across the project. Like **Find references**, it has no keyboard shortcut and no context menu entry, and it registers only while a LaTeX project is open.

1. Place the cursor inside the brace argument of a `\label` or a `\ref`-family command.
2. Press `Ctrl+K` to open the command palette.
3. Under **Refactor**, select **Rename label**.
4. In the **Rename label** dialog, type the new key over the seeded value, in the field whose placeholder reads `new label key`.
5. Select **Rename**, or press `Enter`, to rewrite every occurrence.

The dialog seeds its input from the key under the cursor. While it counts, it reads `Renaming eq:mass (Scanning references…)`, and then `Renaming eq:mass (4 occurrences in 2 files)`. **Cancel** closes it without changes.

Typeward refuses an empty input with `Enter a new label key.` A new key may contain no whitespace and none of these characters: `{ } , \ % # ~ ^ $ &`. If the cursor is not on a renameable key, a toast reads `Open a LaTeX file to rename a label.` or `Place the cursor on a \label or \ref to rename it.`

Two rules keep the rewrite narrow:

- Typeward changes the key only where it is a whole comma-list entry inside `\label` or a `\ref`-family command, including ranges such as `\crefrange`, starred forms, and optional arguments.
- Typeward never touches prose, `\cite` keys, other commands, or keys that merely contain the old key as a substring.

Typeward saves every file with unsaved changes, rewrites the matching files on disk atomically, reloads any affected open files, and then reindexes. Your unsaved edits survive, and a stale open file cannot revert the rename. On success a toast confirms in the form `Renamed "sec:old" to "sec:new" across 2 files.` On failure the toast reads `Couldn't rename the label` with the underlying error.

## Catch broken and duplicate labels

When no language server is attached, Typeward checks references against the index as you type, about half a second after you pause. Two warnings can appear:

- Typeward underlines a `\ref`-family key that matches no `\label` anywhere in the project and warns `Reference to undefined label "sec:results"`, quoting your key.
- Typeward flags a `\label` defined more than once, within the file or also in another file, with `Label "eq:mass" is defined more than once`.

Four rules keep the checks quiet:

- Typeward checks references only, never `\cite` keys, because a citation key can legitimately live in a `.bib` file the index has not seen. Typeward leaves citations to the compiler.
- Typeward skips comments, and never flags a half-typed `\ref{eq:mass` with no closing brace.
- Labels in the file you are editing count immediately, including unsaved ones, and a label that is unique to its file never flags itself.
- Both checks stay silent until the index finishes its first scan, and in a project with no labels at all.

With texlab attached, Typeward drops these two warnings, because texlab ships its own undefined-reference diagnostics and the two would double-report. See [Work with texlab attached](#work-with-texlab-attached).

## Work with texlab attached

None of the features on this page come from a language server. Attaching texlab adds to key completion and replaces the two label warnings, and it leaves everything else on this page alone.

| Feature | With texlab attached |
| --- | --- |
| Key completion | The built-in index still serves `\ref` and `\cite` keys, and texlab adds commands and environments. |
| Completion list length | The index list stays uncapped, where texlab caps its own completion lists at 50 items. |
| Undefined and duplicate label warnings | The texlab diagnostics replace both index warnings. |
| Go to definition, hover previews, **Find references**, and **Rename label** | Unchanged, because none of them uses the language server. |

Without texlab, everything on this page still works in full. For what texlab adds beyond keys, see [Autocomplete, snippets, and formatting](/editor/autocomplete-and-snippets/).

## Keep the index current

Typeward scans a LaTeX project once when it opens and caches the result, so reopening a project is cheap. Two kinds of entries go in:

- Labels from `\label{...}` in TeX-family files: `.tex`, `.ltx`, `.cls`, `.sty`, `.def`, and `.clo`.
- Citation keys from the project's `.bib` files, each with the title from its entry. The walk skips `.typeward`, `.git`, and `node_modules`, so the generated `library.bib` contributes nothing.

Typeward skips commented-out labels. Each label carries the title of the nearest sectioning command that precedes it, from `\part` down to `\subparagraph`, starred forms included.

From then on the index maintains itself. Typeward watches the project files and rescans about 400 ms after the last write, so saving ten files in a row costs a single scan. Typeward reads the labels in the file you are editing live at query time, so a label you typed seconds ago completes and resolves before any rescan runs.

**Find references** and **Rename label** walk the same file set as the index. Typeward still finds, jumps to, lists, and renames a label defined in a class file.

## Check that it worked

Rest the pointer on a `\ref` key whose `\label` you know exists. The tooltip's location line names the file and line of that `\label`. That proves the index has loaded, and the jump lands in the same place.

## If it does not work

1. Check the file extension. Completion, hover previews, and jumping run in `.tex` and `.bib` files only.
2. Check the project format. Typst projects build no index, so none of these features appear.
3. Read the toast. Both `Open a LaTeX file to find references.` and `Place the cursor on a \label or \ref to find its references.` name the condition that failed.

## See also

- [Search, replace, and navigation](/editor/search-and-navigation/)
- [Autocomplete, snippets, and formatting](/editor/autocomplete-and-snippets/)
- [How references work](/references/how-references-work/)
