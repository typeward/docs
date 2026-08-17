---
title: Files and folders
description: Create, import, rename, move, and delete the files in a project, and see what Typeward keeps in the project's .typeward folder.
---

This guide shows you how to create, import, rename, move, and delete the files in a project. A project is an ordinary folder on your disk, and Typeward reopens it exactly as it finds it, after another editor, a git checkout, or a copy to another machine. For creating and organizing whole projects, see [The projects library](/projects/library/).

## Create a file or folder

The **Files** tab in the sidebar shows the project folder, with directories sorted before files and both sorted case-insensitively.

1. In the **Files** tab, select **New file** or **New folder** in the **File tree** header row.
2. Type the name and select **Create**. A nested name such as `chapters/intro.tex` creates the missing parent folders on the way.

## Add existing files to a project

Two routes copy files into the project, and both leave your originals where they are.

- Drag files from your file manager onto the editor window. A "Drop to add to *project name*" overlay appears while they hover, and the files land in the project root. Drag and drop works in the desktop app only.
- Select **Add files…** below the tree, or **Add files here…** on a folder, to open the **Add files to project** picker. Typeward copies the selection into the project root or into that folder.

A name that collides with an existing file is given a numbered suffix rather than overwriting anything, so `figure.png` arriving next to an existing `figure.png` becomes `figure (2).png`. Both routes confirm with a toast, "Added *filename*" for one file or "Added *N* files" for several.

Every import is bounded, and a batch is all or nothing, so a rejected entry leaves no half-copied files behind.

| Bound | Value |
| --- | --- |
| Files in one batch | At most 100 |
| Size of one file | At most 200 MB |
| Folders | Not accepted, and dropping one raises an error saying so |
| Symbolic links | Not accepted |

## Rename, move, or delete a file

Every file operation lives in the file tree context menu, and what the menu offers depends on what you right-click.

| Right-click target | Menu items |
| --- | --- |
| A file | **Open**, **Rename…**, **Duplicate**, **Move to…**, **New file here**, **New folder here**, **Add files here…**, **Copy relative path**, the reveal item for your platform, **Delete…** |
| A folder | The same items, minus **Open** and **Duplicate** |
| The empty space below the tree | **New file**, **New folder**, **Add files…**, **Collapse all** |

To rename a file or folder:

1. In the **Files** tab, right-click the item and select **Rename…**.
2. Type the new name and select **Rename**. Open tabs, review comment and TODO threads, and the project's main-file pointer stay attached to the file.

To move an item into another folder:

1. In the **Files** tab, right-click the item and select **Move to…**.
2. In the `Move "<name>" to…` dialog, select **Project root** or one of the project's folders.

That dialog lists the project's folders minus the item's current folder and, for a folder, its own subtree. Dot-folders and `node_modules` are never offered as destinations.

To delete an item:

1. In the **Files** tab, right-click the item and select **Delete…**.
2. In the **Delete** dialog, select **Move to trash**. The item goes to your system trash, where it stays recoverable, and tabs showing it close.

Renaming and moving never overwrite an existing file, and a folder cannot move into itself. **Copy relative path** puts the path as written from the project root on your clipboard, ready to paste into an include command.

Nothing in these menus writes into `.typeward/` or `.git/`. Typeward refuses a path whose first component is either one before anything touches the disk.

## Set the main file

Every project has one main file: the file the engine compiles.

1. In the sidebar footer, next to **Project**, select the gear button to open **Project settings**.
2. In the **Main file** section, select the file you want Typeward to compile.

The **Main file** section lists the project's source files that match the project format: `.tex` files in a LaTeX project, `.typ` files in a Typst project. The list walks subfolders, skips dot-folders and the usual output directories (`build`, `out`, `dist`, `node_modules`), and stops at 500 entries. When nothing matches, the section reads "No .tex files found in this project." in a LaTeX project, and the `.typ` form of the same line in a Typst project.

Typeward stores the choice in `.typeward/project.json`, and the pointer follows the file: rename or move the main file and it stays the main file.

## Split a document across files

Split a long document across several files and keep one entry point. In LaTeX, pull a file in with `\input{chapters/intro}` or `\include{chapters/intro}`. In Typst, use `#include "chapters/intro.typ"`.

The compile always runs on the main file, and the engine reads the children from disk. Before every compile, Typeward saves every open file with unsaved changes, not only the active tab. `Ctrl+Enter` (`Cmd+Enter` on macOS) and `Ctrl+S` (`Cmd+S` on macOS) therefore compile exactly what you see across all open files.

With many files open, `Ctrl+P` (`Cmd+P` on macOS) jumps between them by name. See [Search, replace, and navigation](/editor/search-and-navigation/).

## Work with changes made outside Typeward

Typeward watches the open project's folder for changes made by another editor, a git checkout, or a sync client. When a file appears, disappears, or changes, the file tree, quick-open index, TODO scan, label and citation index, and main-file picker refresh on their own.

Two classes of change are ignored: anything under `.typeward/` or `.git/`, and LaTeX auxiliary files such as `.aux`, `.log`, `.out`, `.toc`, and `.synctex.gz`. One latexmk pass would otherwise trigger a full tree refetch and TODO rescan.

Typeward never reloads an open file from disk on its own, so what you see in a tab stays put. The collision is settled at save time instead. If the file changed on disk after you opened it, your save keeps the newer disk version beside the original:

```
<name>.conflict-<timestamp>.<ext>
```

For example, `main.conflict-2026-05-22T18-30-00-000Z.tex`. Your version then wins the write, and an **Overwrote newer changes on disk** toast names the copy that holds the other version. The conflict copy is a plain file, visible in the file tree: compare it, merge what you need, then delete it. [Cloud sync](/projects/cloud-sync/) conflicts produce the same kind of copy.

## Find a hidden file

The file tree hides two groups of files, and every one of them still exists on disk.

| Hidden from the tree | Why |
| --- | --- |
| Dotfiles and dot-folders, such as `.git` and `.DS_Store` | Configuration noise |
| `.aux`, `.fdb_latexmk`, `.fls`, `.out`, `.toc`, `.log`, `.synctex.gz` | Auxiliary files from a LaTeX compile |

To reach them, right-click any file in the **Files** tab and select the reveal item for your platform.

| Platform | Menu item |
| --- | --- |
| macOS | **Reveal in Finder** |
| Windows | **Show in Explorer** |
| Linux and everything else | **Show in file manager** |

The `.typeward` folder is the one exception to the hiding rule: the file tree shows it, de-emphasized, rather than hiding it.

## Look inside the project's .typeward folder

Typeward keeps its bookkeeping for the project in a `.typeward` folder inside the project.

| Path | Holds |
| --- | --- |
| `.typeward/project.json` | Project metadata: name, main file, format, tags, deadline, space, archive state, per-project build settings |
| `.typeward/snapshots/` | [Crash-recovery snapshots](/projects/autosave-recovery/) |
| `.typeward/reviews/comments.json` | [Review comments and TODOs](/editor/review-comments/) |
| `.typeward/citations/library.bib` | The aggregated [reference library](/references/how-references-work/), rewritten from your configured reference sources |
| `.typeward/citations/local.bib` | Entries added one at a time by DOI and arXiv lookup |
| `.typeward/ai/conversations/` | [AI assistant](/ai/overview/) chat history for this project |
| `.typeward/integrations/` | [Cloud sync](/projects/cloud-sync/) bookkeeping (sync cursor, `sync-state.json`, `idmap.json`), in cloud-backed projects only |
| `.typeward/build/` | Staged [export artifacts](/projects/exports/); compile output itself lands next to your sources |

`library.bib` opens like any other file, but Typeward generates it, and its header says so. Never edit it by hand: the next library refresh overwrites whatever you typed into it.

The folder stays machine-local. In a git repository, Typeward adds `.typeward/` to `.git/info/exclude`, so it never lands in a commit. Typeward also leaves the folder out of cloud sync, out of [source bundle exports](/projects/exports/), and out of [project templates](/projects/templates/) saved from a project. A copy of the project on another machine has no `.typeward` folder until Typeward rebuilds one there. See [Data locations, credentials, and uninstall](/reference/data-locations/) for the full map, including what Typeward writes outside the project folder.

## Check that it worked

The file tree redraws as soon as an operation finishes, so the proof is on screen.

- A created or imported file appears in the **Files** tab, in the folder you targeted.
- A renamed or moved file keeps its open tab, its review comment and TODO threads, and its role as the main file.
- A deleted file leaves the tree, its tab closes, and the item waits in your system trash.

## If it does not work

Work down these checks in order.

1. Read the inline error under the name you typed. A name already in use is refused with "A file with this name already exists" or "A folder with this name already exists".
2. Check the destination list in the **Move to…** dialog. The line "No other folders in this project." means the project holds no other folder to move the item into.
3. Check whether the file is binary. Images, PDFs, fonts, and zips never open in the source pane, and selecting one raises a **Binary file** notice.
4. Look for a one-time **File watching unavailable** notice ("External changes won't refresh the file tree automatically."). Everything else keeps working, and outside changes reach the file tree again when you reopen the project.

## See also

- [Git in Typeward](/projects/git/)
- [Cloud sync with WebDAV](/projects/cloud-sync/)
- [Autosave and crash recovery](/projects/autosave-recovery/)
