---
title: Chapter drafts
description: Recompile one chapter of a book or thesis with Draft this chapter, reusing the last full build so cross-references and page numbers stay intact.
---

This guide shows you how to compile one chapter of a long LaTeX project and reuse your last full build for everything else. A book that takes a minute to compile in full redraws in roughly the time that one chapter alone takes. For Typst projects, see [Typst projects](/getting-started/typst/).

## Known limitations

- Chapter drafts act only on chapters pulled in with `\include`. In a project whose parts are all `\input`, a draft compiles the whole document, which is slower than a normal compile.
- **Draft this chapter** runs from the command palette only. No keyboard shortcut, no toolbar button, and no build menu entry starts a draft.
- Typeward drafts one chapter at a time, and no badge in the preview pane marks the result as a draft.
- No bibliography pass runs. A draft reuses the `.bbl` file from your last full build, so a source you have cited since that build stays unresolved. Citation numbers can shift once you compile in full again.
- A draft runs the engine binary twice and nothing else, whatever the project's recipe is set to, because `latexmk` cannot drive the `\includeonly` form. See [Per-project build configuration](/compiling/build-configuration/).
- The draft PDF is written over the full PDF at the same path, and no export is guarded against it. **Export PDF** and **PDF + annotations** send the chapter-only PDF until you compile in full again.

## Before you start

A draft reuses what your last full build left behind, so check two things first.

1. Compile the project in full at least once with `Ctrl+Enter` (`Cmd+Enter` on macOS). Without a full build to reuse, cross-references render as `??` and page numbers restart.
2. In the build menu, set the project's engine to **pdfLaTeX**, **XeLaTeX**, or **LuaLaTeX**, because **Tectonic** cannot draft a chapter.

The engine is a per-project setting. See [Choosing a compile engine](/getting-started/compile-engines/) for the difference between a TeX distribution and the bundled Tectonic engine.

## Draft a chapter

1. Open the chapter file you want to redraw and put the cursor in it.
2. Press `Ctrl+K` (`Cmd+K` on macOS) to open the command palette.
3. Type `draft` and run **Draft this chapter**, listed under **Build** with the subtitle "Typeset only the current chapter (\includeonly), reusing the last full build".

A draft runs like any other compile: the same progress indicator, the same live log, and the same **Stop** button.

## Check that it worked

After a draft, the preview pane swaps to a PDF that holds only the drafted chapter, at its real page numbers. Cross-references into other chapters still resolve.

To confirm that a draft ran rather than a full compile, open the **All logs** tab. The echoed command line carries `-jobname=<main file stem>` and a code argument of the form `\includeonly{chapters/ch03}\input{main}`. The include target is the active file's project-relative path minus its `.tex` extension.

Because the job name stays the main file's, the auxiliary files and the PDF keep their usual names. LaTeX rewrites only the auxiliary file of the chapter it compiled. The labels, counters, and page numbers of the skipped chapters still come from your last full build.

## If it does not work

When a draft produces something other than a chapter-only PDF, one of these situations applies.

| Situation | What happens | What to do |
| --- | --- | --- |
| The project has never compiled in full. | Nothing exists to reuse, so cross-references render as `??` and page numbers restart. | Run a full compile, then draft again. |
| The active file is the main file, or is not a `.tex` file. | A normal full compile runs instead. | Open the chapter file you want to draft, then run the command again. |
| The project's engine is **Tectonic**. | The compile stops with `chapter drafts need a latexmk/pdflatex engine (Tectonic has no \includeonly fast path)`. | Switch the project to **pdfLaTeX**, **XeLaTeX**, or **LuaLaTeX** in the build menu. |
| The chapter's path holds a TeX-special character. | The compile stops with `unsafe \includeonly target: ...`. | Rename the file or the folder holding it. |

Typeward splices the include target into TeX code, so it rejects any path holding a character that TeX would read as markup. Those are the backslash (`\`), the braces, `$`, `%`, `#`, `~`, `^`, `&`, `"`, the colon, `..`, and a leading hyphen (`-`).

## Run a full compile again

Every ordinary compile is a full build. Typeward never edits your files to draft a chapter, so no `\includeonly` line is left behind to delete.

Any of these runs a full compile:

- Press `Ctrl+Enter`.
- Press `Ctrl+S` (`Cmd+S` on macOS) to save and compile.
- Select **Recompile** in the preview toolbar.
- Run **Compile LaTeX** from the command palette.

Add a citation, change a label, or move a section, and the numbers in a draft are only as fresh as your last full build. Run a full compile before you read the document as a whole, before you export, and before any deadline. See [Exporting your work](/projects/exports/).

## See also

- [Compiling LaTeX and reading errors](/compiling/compiling-latex/)
- [Per-project build configuration](/compiling/build-configuration/)
- [Choosing a compile engine](/getting-started/compile-engines/)
- [Exporting your work](/projects/exports/)
