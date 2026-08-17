---
title: Review comments and TODOs
description: Anchor comment and TODO threads to your text from the source pane or the PDF, reply to them, resolve them, and re-anchor them after edits.
---

This guide shows you how to anchor a comment or a TODO to a stretch of text, reply to it, resolve it, and re-anchor it after the text moves. Typeward lists comment threads in the sidebar's **Review** tab and TODO threads in the **TODO** tab, and the two kinds behave the same way otherwise. Every thread anchors to text, so select the passage you want it attached to before you add it.

## Known limitations

- Threads appear on the PDF as highlight bands in LaTeX projects only. The bands are mapped forward through SyncTeX.
- The TODO scan reads files from disk, never the unsaved text in the source pane. A marker you have typed appears after the next save.
- The TODO scan stops at 500 files, skips files larger than 1 MB, and lists at most 1000 markers.
- Every comment and reply is authored as the literal **You**. Typeward has no accounts, so threads carry no author identity.

## Add a thread from the source pane

1. In the source pane, select the text the thread should anchor to.
2. Press `Ctrl+Shift+M` (`Cmd+Shift+M` on macOS) for a comment, or `Ctrl+Shift+T` (`Cmd+Shift+T` on macOS) for a TODO.
3. In the popover headed **New comment** or **New TODO**, type your note in the field reading **Add a note…**.
4. Select **Add comment** or **Add TODO**, or press `Ctrl+Enter` (`Cmd+Enter` on macOS), and the thread appears in its sidebar tab.

Two other routes open the same popover. The [editor context menu](/editor/context-menu/) carries **Add comment** and **Add TODO** in its Review section. The command palette, opened with `Ctrl+K` (`Cmd+K` on macOS), carries **Add Review Comment** and **Add TODO**. Both routes need a selection, the same as the shortcuts.

**Cancel** or `Escape` discards the draft. Typeward creates the thread only when you submit, so an abandoned popover leaves nothing behind.

## Add a thread from the PDF

The [PDF preview](/preview/pdf-preview/) takes threads too, and anchors them back to the source for you.

1. In the preview pane, select the text the thread should anchor to.
2. In the chip that floats over the selection, select **Comment** or **TODO**.
3. Type your note in the compose view, headed **New comment** or **New TODO**.
4. Select **Add comment** or **Add TODO**, or press `Ctrl+Enter`.

`Escape` cancels the compose view. Typeward maps the selection back to the source with SyncTeX inverse search, and anchors the thread to the matching words. When the words cannot be matched exactly, it anchors to the whole source line. Both the preview pane and the window that **Detached preview** opens take a selection this way.

Open threads also paint on the PDF as soft one-line highlight bands, accent-tinted for comments and warning-tinted for TODOs, recomputed after each compile. Select a band to open its thread.

## Reply to and resolve a thread

Open the **Review** tab in the sidebar, or run **Open Review Panel** from the command palette. The tab badge counts open comment threads. TODO threads are listed in the **TODO** tab instead.

Two controls narrow the list: a **This file** and **All files** scope toggle, and a **Resolved** checkbox, off by default, that adds resolved threads to the view. With nothing to show, the tab reads **No review threads**.

A collapsed card shows the quoted anchor text and the file it points at, with a line number when one can be resolved. It also carries the author, how long ago the note was written, the note itself, and a reply count. Select the anchor text to move the cursor to it in the source pane.

To reply to a thread:

1. In the **Review** tab, select a card anywhere except its anchor text to expand it.
2. Type your reply in the reply box.
3. Press `Ctrl+Enter`, or select **Reply**.

An expanded card reveals the replies and three more actions.

| Action | What it does |
| --- | --- |
| **Resolve** and **Reopen** | Resolving hides the thread from the default view and drops it from the badge count. The **Resolved** checkbox brings it back. |
| **Re-anchor** | Points an orphaned thread at your current selection. It appears on orphaned threads only. |
| **Delete** | Removes the thread. It is the trash icon at the end of the card's action row. |

## Re-anchor a thread after the text changes

A thread records a character range and the quoted text. While you edit, anchors move with your changes, so a paragraph inserted earlier in the file keeps every thread attached.

When a file changes outside the live editing session, in an external editor for example, Typeward re-finds each anchor as the file loads, in this order:

- The exact character offsets recorded with the thread.
- A search for the quoted anchor text, when it occurs exactly once in the file.
- For anchors longer than 40 characters, a search for their first 40 characters.

A thread whose text cannot be found becomes orphaned. It stays in the tab marked **(anchor lost)**, with an **orphaned** chip and a **Re-anchor** button. To point it at the right text again:

1. In the source pane, select the text the thread should anchor to now.
2. In the **Review** tab, select **Re-anchor** on the orphaned card.

Renaming a file or moving it to another folder inside Typeward keeps its threads attached.

## Find TODO markers in your files

The **TODO** tab lists TODO threads first, using the same cards as the **Review** tab, then the markers Typeward scans out of the source files on disk. A **Resolved** checkbox appears at the head of the list once at least one TODO thread has been resolved. With nothing to list, the tab reads **No TODOs found**. A hint follows: **Markers like % TODO, // FIXME, and NOTE in your sources, plus TODOs you add from the editor or PDF, show up here.**

Typeward recognizes three keywords, each with its own chip in front of the marker text.

| Marker | Chip |
| --- | --- |
| `TODO` | Warning tint |
| `FIXME` | Error tint |
| `NOTE` | Muted |

Where a keyword counts as a marker depends on the file type.

| Files | Where a marker counts |
| --- | --- |
| `.tex`, `.bib` | After the first unescaped `%`, plus `\todo{...}` anywhere on the line |
| `.typ` | After `//` |
| `.md` | Inside an HTML comment, for example `<!-- NOTE: check later -->` |

The keywords are case-sensitive and matched as whole words, so `TODO_LIST` never counts. A keyword in ordinary text is ignored, so `\section{TODO list}` produces nothing. The text after the keyword becomes the entry, with a leading colon (`:`) or exclamation mark (`!`) dropped and a 200-character cap.

The scan reruns when you switch projects, and shortly after the file watcher reports a change. Select a scanned marker to jump to its file and line. The tab badge counts scanned markers plus open TODO threads.

## Check that it worked

You should now see the new thread in its sidebar tab, and a marker beside its anchor in the source pane. Anchored text carries a tinted wash, and each thread gets a gutter marker: an open circle (○) for a comment, a filled diamond (◆) for a TODO. Their tooltips read **Review comment** and **TODO**. Selecting a marker opens that thread in the matching tab. A resolved thread keeps a fainter wash and its gutter marker.

## If it does not work

1. Confirm that some text is selected. **Add Review Comment** and **Add TODO** need a selection and do nothing without one.
2. When a toast reads `Couldn't anchor the comment`, compile the project and select the text again. Its detail names the cause: `SyncTeX couldn't map that selection to source. Recompile with SyncTeX enabled.` SyncTeX is on by default. See [Compiling LaTeX and reading errors](/compiling/compiling-latex/).
3. When a marker you typed is missing from the **TODO** tab, save the file and give the scan a moment to rerun.
4. When a card reads **(anchor lost)**, select the text the thread belongs to now, then use its **Re-anchor** button.

## Where threads are stored

Typeward writes every thread of a project to one file inside the project's `.typeward` folder:

```
<project>/.typeward/reviews/comments.json
```

The file is a plain JSON array, written about a second and a half after the last change. When Typeward cannot read it as a project opens, it keeps the threads read-only for that session rather than risk overwriting data it could not load. A project with no such file yet is a normal empty state, not an error.

:::caution[Threads stay on the machine that made them]
Typeward keeps `.typeward/` out of [git commits](/projects/git/), [cloud sync](/projects/cloud-sync/), and [project exports](/projects/exports/), so review threads never travel with a committed, synced, or exported copy of the project. See [Where Typeward stores your data](/reference/data-locations/).
:::

## See also

- [Editor overview](/editor/overview/)
- [PDF preview](/preview/pdf-preview/)
- [Editor context menu](/editor/context-menu/)
- [Where Typeward stores your data](/reference/data-locations/)
