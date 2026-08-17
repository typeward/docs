---
title: Exporting your work
description: The five Export targets, what the source bundle keeps, pandoc for Word and HTML, annotated PDFs from review comments, and where exports land.
---

This guide shows you how to export a project as a PDF, a source bundle, a PDF carrying your review comments, or a Word or HTML file. All five targets run entirely on your machine, and each one ends in a save dialog where you choose the file name and the destination. To hand a project to a co-author through a git remote instead of a file, see [Git in Typeward](/projects/git/).

## Before you start

In the preview pane toolbar, select **Export** to open the **Export as** menu. The menu belongs to the preview pane, so it is unavailable in the **Editor only** layout and in the detached preview window.

Each row states what it produces and what it needs before it will run.

| Menu entry | What you get | What it needs |
| --- | --- | --- |
| **Export PDF** | The PDF from your last compile | A compiled PDF |
| **Source bundle (.zip)** | A zip of the project's files, with auxiliary files stripped | Nothing beyond the project |
| **PDF + annotations** | The compiled PDF with your open review comments as sticky notes | A LaTeX project, a compiled PDF, at least one open comment, and `synctex` on `PATH` |
| **Word (.docx)** | A Word file converted from your source by pandoc | `pandoc` on `PATH` |
| **HTML** | A standalone HTML page converted from your source by pandoc | `pandoc` on `PATH` |

Typeward disables the **Export PDF** and **PDF + annotations** rows when their requirements are unmet, and the hint on the disabled row names what is missing. The **Word (.docx)** and **HTML** rows stay selectable whether or not pandoc is installed: a missing pandoc fails the export instead, and the menu shows the error. One export runs at a time: the row you started shows a spinner, and every row stays disabled until it finishes.

## Known limitations

- Neither **Export PDF** nor **PDF + annotations** compiles for you. Both copy the PDF from your last compile, including a chapter draft, which carries no warning and no badge. See [Chapter drafts](/compiling/chapter-drafts/).
- **PDF + annotations** places annotations through SyncTeX, so it works in LaTeX projects only. It places open threads and skips resolved ones.
- One run of **PDF + annotations** places at most 500 annotations, and it rejects a PDF larger than 512 MiB outright.
- Pandoc reads your source rather than the compiled document, so commands and packages with no Word or HTML equivalent are approximated or dropped.
- The exported HTML is standalone but not self-contained. Images and other assets are referenced by relative path rather than embedded.
- Typeward aborts a pandoc export after ten minutes, the same bound a compile runs under.
- **Source bundle (.zip)** keeps PDFs. A compiled `document.pdf` sitting in the project folder ships inside the bundle.

## Export the compiled PDF

1. Compile the project with `Ctrl+Enter` (`Cmd+Enter` on macOS). Until a compile has produced a PDF, the **Export PDF** row stays disabled with the hint **Compile first**.
2. In the **Export as** menu, select **Export PDF**.
3. In the save dialog, choose a file name and a destination, then save. The dialog suggests the compiled PDF's own file name.

See [Compiling LaTeX and reading errors](/compiling/compiling-latex/).

## Export a source bundle

1. In the **Export as** menu, select **Source bundle (.zip)**. Its hint reads **Sources only; excludes build junk, .git and .typeward**.
2. In the save dialog, choose a file name and a destination, then save. The dialog suggests `<project name>-source.zip`.

The bundle leaves out three kinds of file:

- the project's `.typeward` folder, version-control metadata (`.git`, `.svn`, `.hg`), and `node_modules`
- symlinks
- LaTeX auxiliary files: `.aux`, `.log`, `.out`, `.toc`, `.lof`, `.lot`, `.fls`, `.fdb_latexmk`, `.bbl`, `.blg`, `.bcf`, `.nav`, `.snm`, `.vrb`, and anything with `.synctex` in the name

Everything else goes in: `.tex` and `.bib` files, figures, and any classes or styles you keep in the project folder. A compiled PDF ships too, which is usually what a co-author wants. Delete or move it first when you are uploading to a submission system that objects to a stray PDF.

## Export a PDF with your review comments

**PDF + annotations** flattens your open [review comments](/editor/review-comments/) into the compiled PDF as sticky notes, each placed at the line its thread is anchored to. Typeward titles each note with the thread's first author and fills it with every comment in the thread, each one prefixed with its author. Placement works through SyncTeX, so the target needs a LaTeX project and the `synctex` command-line tool from your TeX distribution.

1. In the **Export as** menu, select **PDF + annotations**. With everything in place, the hint reads **Place N open comments as sticky notes**.
2. In the save dialog, choose a file name and a destination, then save. The dialog suggests `<project name>-annotated.pdf`.

Until all three requirements are met, the row stays disabled and its hint names the one that is missing:

- **Needs SyncTeX (LaTeX only)**: the project is a Typst project.
- **Compile first**: no compile has produced a PDF yet.
- **No open comments to place**: every thread is resolved, or the project has none.

## Export to Word or HTML

Both targets convert your source, not the compiled PDF, using [pandoc](https://pandoc.org). Typeward passes `-f latex` or `-f typst` depending on the project format, so LaTeX and Typst projects both convert. Typst input needs pandoc 3.1.12 or newer, the release that added the Typst reader.

1. Install pandoc, and confirm that `pandoc` is on your `PATH`. Typeward does not bundle it.
2. In the **Export as** menu, select **Word (.docx)** or **HTML**.
3. In the save dialog, choose a file name and a destination, then save.

Treat the result as a draft for collaborators who need `.docx`, not as a replacement for the PDF. Keep an exported HTML page next to the project's assets, or copy them along with it, so that images display. Typeward leaves those assets unembedded on purpose: embedding them would let a document pull arbitrary local and remote files in at export time.

## Check that it worked

The exported file appears exactly where you pointed the save dialog. Typeward keeps no fixed export folder, and canceling the dialog exports nothing.

After **PDF + annotations**, a toast reports how many comments were placed. A comment can fail to place even when the export succeeds, usually because SyncTeX has no mapping for that source line. Failures arrive in a second toast, **N comments couldn't be placed**, which lists at most five of them as `file:line: reason`. Comments past the five-hundredth carry the reason `annotation limit reached (max 500)`, and the first 500 are still placed.

:::note[Exports are staged inside the project first]
Typeward builds the zip, the annotated PDF, and the pandoc exports inside the project's `.typeward/build/` folder (`source-bundle.zip`, `annotated.pdf`, `export.docx`, `export.html`) before copying them to the destination you chose. **Export PDF** copies straight from the compiled PDF, with no staged copy. Those staged files stay on your machine, because the `.typeward` folder is excluded from source bundles and from git commits. See [Data locations, credentials, and uninstall](/reference/data-locations/).
:::

## If it does not work

A failed export names its cause in one of these messages.

| Message | What it means |
| --- | --- |
| `pandoc was not found on PATH; install it from pandoc.org to export Word/HTML` | Typeward does not bundle pandoc. Install it, then confirm that `pandoc` is on your `PATH`. |
| `pandoc <version> is too old for Typst input; 3.1.12+ required` | The pandoc on your `PATH` is older than 3.1.12. |
| `pandoc export timed out after 10 minutes and was aborted` | The conversion ran past the ten-minute bound. |
| `SyncTeX is unavailable; annotation placement needs a LaTeX build with SyncTeX` | The `synctex` command-line tool is missing from your `PATH`. |
| `PDF is too large to annotate` | The PDF is over 512 MiB, and annotation parses the whole file in memory. |

## See also

- [PDF preview](/preview/pdf-preview/)
- [Review comments and TODOs](/editor/review-comments/)
- [Chapter drafts](/compiling/chapter-drafts/)
- [Troubleshooting](/troubleshooting/troubleshooting/)
