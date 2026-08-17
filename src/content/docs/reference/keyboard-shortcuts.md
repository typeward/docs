---
title: Keyboard shortcuts
description: Every keyboard shortcut in Typeward for Windows, Linux, and macOS, with the command palette, the macOS menu bar, and the Vim and Emacs setting.
---

The tables on this page list Typeward's keyboard shortcuts, Windows and Linux first, macOS second. They cover the application and the source pane; the keys that drive a panel, a popover, or a menu while it is open are described alongside that feature. Where the macOS column shows `Ctrl`, the shortcut uses the physical Control key, not `Cmd`. Commands with no shortcut still run from the command palette, `Ctrl+K` (`Cmd+K` on macOS).

## Application

These shortcuts fire anywhere in the app, including while you are typing in a form field.

| Command | Windows/Linux | macOS | Available when |
| --- | --- | --- | --- |
| Toggle command palette | `Ctrl+K` | `Cmd+K` | Anywhere |
| Go to file | `Ctrl+P` | `Cmd+P` | A project is open in the editor screen |
| New project | `Ctrl+N` | `Cmd+N` | Anywhere |
| Open Settings | `Ctrl+,` | `Cmd+,` | Anywhere |
| Toggle Focus Mode | `Ctrl+Shift+F` | `Cmd+Shift+F` | A project is open |
| Toggle Visual Editing | `Ctrl+Shift+V` | `Cmd+Shift+V` | The active file is `.tex` |
| Zoom In | `Ctrl+=` | `Cmd+=` | Anywhere |
| Zoom Out | `Ctrl+-` | `Cmd+-` | Anywhere |
| Reset Zoom | `Ctrl+0` | `Cmd+0` | Anywhere |
| Close command palette | `Esc` | `Esc` | The palette is open |

Three of these commands behave in ways the columns cannot show:

- **Go to file** needs the editor screen. From the projects library or **Settings**, the key does nothing. The palette still opens with `Ctrl+K` and lists commands and recent projects, but no files.
- `Esc` never leaves focus mode. Press `Ctrl+Shift+F` again, or select the **Exit focus** pill. See [Focus mode and keybindings](/editor/focus-and-vim/).
- **Toggle Visual Editing** is LaTeX only, and it writes the persisted setting shared with the **Source | Visual** control in the format toolbar. See [Visual editing for LaTeX](/editor/visual-editing/).

### Zoom

The three zoom commands step the interface scale by 5 percent, between 90 and 150 percent, and **Reset Zoom** returns it to 100 percent. They move the same value as the **Interface scale** slider in **Settings → Appearance**, so a zoom change survives a restart. Zoom scales text and controls together rather than the document alone.

Typeward applies the scale itself instead of relying on the platform web view, so the three commands behave identically on Windows, macOS, and Linux. Zooming the PDF page is a separate control in the preview toolbar. See [PDF preview](/preview/pdf-preview/).

## Source pane

These shortcuts, and those in the three sections that follow, apply while the source pane has focus.

| Command | Windows/Linux | macOS |
| --- | --- | --- |
| Undo | `Ctrl+Z` | `Cmd+Z` |
| Redo | `Ctrl+Y` | `Cmd+Shift+Z` |
| Redo selection | `Alt+U` | `Cmd+Shift+U` |
| Bold | `Ctrl+B` | `Cmd+B` |
| Italic | `Ctrl+I` | `Cmd+I` |
| Underline | `Ctrl+U` | `Cmd+U` |
| Request completions | `Ctrl+Space` | `Ctrl+Space` |
| Toggle line comment | `Ctrl+/` | `Cmd+/` |
| Toggle block comment | `Shift+Alt+A` | `Shift+Alt+A` |
| Move line up / down | `Alt+Up` / `Alt+Down` | `Alt+Up` / `Alt+Down` |
| Copy line up / down | `Shift+Alt+Up` / `Shift+Alt+Down` | `Shift+Alt+Up` / `Shift+Alt+Down` |
| Delete line | `Ctrl+Shift+K` | `Cmd+Shift+K` |
| Select line | `Alt+L` | `Ctrl+L` |
| Select all | `Ctrl+A` | `Cmd+A` |
| Indent less / more | `Ctrl+[` / `Ctrl+]` | `Cmd+[` / `Cmd+]` |
| Indent selection | `Ctrl+Alt+\` | `Cmd+Alt+\` |
| Toggle tab-focus mode | `Ctrl+M` | `Shift+Alt+M` |

Some rows depend on the file type, the platform, or how the source pane treats a key:

- On Linux, `Ctrl+Shift+Z` is a second shortcut for **Redo**.
- **Bold**, **Italic**, and **Underline** follow the active file, not the project. They work in files that take prose formatting (LaTeX, Typst, and Markdown) and disappear in `.bib` and plain-text files. Markdown has no underline construct, so `Ctrl+U` does nothing in a `.md` file. A `README.md` inside a LaTeX project gets Markdown syntax.
- **Toggle line comment** inserts `%` in LaTeX and `//` in Typst.
- `Tab` never indents. It moves keyboard focus out of the source pane, which keeps the app navigable without a mouse. `Ctrl+[` and `Ctrl+]` indent instead. **Toggle tab-focus mode** forces `Tab` to move focus even where the source pane would otherwise capture it.
- macOS also honors the Emacs-style `Ctrl` shortcuts (`Ctrl+A`, `Ctrl+E`, `Ctrl+K`, and the rest) that come with the platform keymap.
- On macOS, `` Alt+` `` and `Alt+I` also request completions, alongside `Ctrl+Space`.
- The source pane keeps a single selection, so multiple cursors never appear. The usual add-cursor and select-occurrence keys move that one selection instead of adding a cursor.

## Navigation

These shortcuts move between tabs and within a file.

| Command | Windows/Linux | macOS |
| --- | --- | --- |
| Close tab | `Ctrl+W` | `Cmd+W` |
| Next tab | `Ctrl+Tab` | `Ctrl+Tab` |
| Previous tab | `Ctrl+Shift+Tab` | `Ctrl+Shift+Tab` |
| Find / replace | `Ctrl+F` | `Cmd+F` |
| Find next | `F3` or `Ctrl+G` | `F3` or `Cmd+G` |
| Find previous | `Shift+F3` or `Ctrl+Shift+G` | `Shift+F3` or `Cmd+Shift+G` |
| Go to line | `Ctrl+Alt+G` | `Cmd+Alt+G` |
| Go to matching bracket | `Ctrl+Shift+\` | `Cmd+Shift+\` |
| Start / end of document | `Ctrl+Home` / `Ctrl+End` | `Cmd+Home` / `Cmd+End` |
| Go to definition | `F12` | `F12` |
| Close the search panel | `Esc` | `Esc` |

Tabs, search, and jumps each carry a condition:

- The tab keys are registered only while a project is open. Tab switching uses the literal `Ctrl` key on macOS as well, because `Cmd+Tab` belongs to the macOS app switcher.
- Search runs on the open file. **Go to file**, `Ctrl+P` (`Cmd+P` on macOS), moves between files by name. See [Search, replace, and navigation](/editor/search-and-navigation/).
- **Go to definition** works on `\ref`-family and `\cite` keys in LaTeX files. `Ctrl+click` (`Cmd+click` on macOS) on the key does the same thing, and a click that resolves nothing keeps its normal behavior. See [Labels, references, and navigation](/editor/latex-navigation/).
- In visual editing mode, `Ctrl+F` opens a simplified find panel over the rendered text, because the standard panel searches raw source you can no longer see. `Enter` goes to the next match, `Shift+Enter` to the previous one, and `Esc` closes it. A counter shows the position, and visual mode has no replace. Typing `$` in visual mode opens the math popover rather than inserting a dollar sign.

## Compile and preview

These shortcuts write the file, start a compile, and jump into the PDF.

| Command | Windows/Linux | macOS |
| --- | --- | --- |
| Save and compile | `Ctrl+S` | `Cmd+S` |
| Compile | `Ctrl+Enter` | `Cmd+Enter` |
| Jump to PDF (forward search) | `Ctrl+J` | `Cmd+J` |

- **Save and compile** writes every open file with unsaved changes to disk, and it always starts a compile afterward. See [Compiling LaTeX and reading errors](/compiling/compiling-latex/).
- **Jump to PDF** is LaTeX only and needs SyncTeX. The inverse direction is a mouse gesture, not a key: double-click a page in the preview pane, or `Shift+click` it, to jump to the matching source line.
- No shortcut stops a compile. While a compile runs, the **Compile** button in the preview toolbar turns into **Stop**. On macOS, **Compile → Stop Compile** in the menu bar does the same.

## Review

Both of these commands require a non-empty selection in the source pane.

| Command | Windows/Linux | macOS |
| --- | --- | --- |
| Add Review Comment | `Ctrl+Shift+M` | `Cmd+Shift+M` |
| Add TODO | `Ctrl+Shift+T` | `Cmd+Shift+T` |

The thread anchors to the selection. Each command opens a compose popover first, and Typeward creates the thread only when you submit it. `Ctrl+Enter` (`Cmd+Enter` on macOS) adds it, and `Esc` closes the popover without adding. Replies in the review panel send the same way.

The popover prints its hint as the literal string "Mod+Enter to add"; read `Mod` as `Ctrl`, or as `Cmd` on macOS. See [Review comments and TODOs](/editor/review-comments/).

## Command palette

`Ctrl+K` opens the palette on every screen, including the projects library and **Settings**. The palette is the complete list of what the app can do. It hides commands whose conditions are not met, so every row it shows can run.

With an empty query, the palette browses by group. **Recently used** holds up to eight commands you ran from the palette and survives a restart. **Recent projects** holds up to five. Every runnable command follows, under its group label.

The groups are **Navigation**, **Project**, **File**, **References**, **Review**, **View**, **Format**, **Build**, **Refactor**, and **AI**. The **AI** group appears only when the assistant is turned on. See [AI assistant](/ai/overview/).

Start typing and the view flattens into one ranked **Results** list across commands, projects, and files. `Up` and `Down` move through the list and wrap around, `Enter` runs the highlighted row, and `Esc` closes the palette.

`Ctrl+P` opens the same palette pre-seeded with a `file:` prefix, which narrows it to text files in the open project. Removing the prefix returns you to the full search.

Many commands have no shortcut at all and run from the palette only. They include **Save project as template**, **Project history**, **Refresh reference library**, **Open Review Panel**, **Draft this chapter**, **Rename label**, **Find references**, every Format command except **Bold**, **Italic**, and **Underline**, and every AI command. **Insert Inline Math** has no shortcut on purpose, because the obvious key would be `Cmd+M` on macOS, which minimizes the window.

## macOS menu bar

On macOS, Typeward installs a native menu bar. Its items use the same keys as the in-app shortcuts and run the same commands, but the menu handles the keystroke first:

| Menu item | Key |
| --- | --- |
| Typeward → Quit Typeward | `Cmd+Q` |
| File → New Project | `Cmd+N` |
| File → Save | `Cmd+S` |
| File → Close Tab | `Cmd+W` |
| File → Close Window | `Cmd+Shift+W` |
| View → Focus Mode | `Cmd+Shift+F` |
| Compile → Compile | `Cmd+Enter` |
| Compile → Stop Compile | None |
| Compile → Jump to PDF | `Cmd+J` |

**Close Window** is the one shortcut with no Windows or Linux equivalent. The Edit menu carries the standard system **Undo**, **Redo**, **Cut**, **Copy**, **Paste**, and **Select All** entries.

Two behaviors follow from the menu owning these keys:

- Menu items skip the editor-focus check, because selecting a menu is an explicit request no matter where the cursor sits.
- When the detached preview window has focus, `Cmd+W` closes that window rather than a tab in the main window.

## Keybindings

**Settings → Editor** has a **Keybindings** row with three options: **None**, **Vim**, and **Emacs**. The default is **None**. Its hint reads "Vim or Emacs editing bindings for the source pane. None keeps the standard bindings."

The setting affects the source pane only, and every application shortcut on this page keeps working alongside the Vim or Emacs bindings. Visual editing mode suspends the engine while it is on, because modal keys and the widget navigation of visual mode do not combine coherently. The setting itself is untouched, and the engine returns when you leave visual mode. See [Focus mode and keybindings](/editor/focus-and-vim/).

## Shortcut customization

Typeward has no per-command remapping. **Settings → Keyboard** lists the application shortcuts read-only. The card subtitle states the situation: "Bindings come from the command registry; format-specific commands appear while a matching project is open. Remapping isn't supported yet."

Typeward generates that list from the same command registry the palette and the shortcuts read, so the list cannot drift from the tables on this page. Format commands appear in it while a project of the matching format is open.

The panel adds one row that is a mouse gesture rather than a shortcut, **Jump to source**. A double-click anywhere on the preview pane, or a `Shift+click`, jumps the source pane to that line.

## See also

- [Settings reference](/reference/settings/)
- [Focus mode and keybindings](/editor/focus-and-vim/)
- [Search, replace, and navigation](/editor/search-and-navigation/)
- [PDF preview](/preview/pdf-preview/)
