---
title: Markdown preview
description: "Preview a .md file in Typeward: what renders, how KaTeX math works, what the preview blocks, and how links behave."
---

This guide shows you how to preview a Markdown file, and what the preview does with your math, images, and links.

For the compiled PDF of a LaTeX or Typst project, see [PDF preview](/preview/pdf-preview/).

Markdown is a supporting format, not a project type. A project is LaTeX or Typst, and `.md` files live inside it as ordinary project files: a `README.md`, notes, or a to-do list. See [What is Typeward](/getting-started/what-is-typeward/).

## Known limitations

The preview treats a Markdown file as untrusted content, which matters when the file came from someone else.

- Raw HTML never renders. A tag such as `<b>` or `<video>` appears as literal text, and Typeward sanitizes the rendered output on top of that.
- Remote images are blocked. An `http` or `https` image shows `[image not shown: <alt text>]` in its place, so a downloaded file cannot report to a server that you opened it.
- A `.md` file never produces a PDF. SyncTeX jumping does not apply, and **Reveal in PDF** never appears in the [editor context menu](/editor/context-menu/).
- No language server attaches to Markdown, so [language-server completion and diagnostics](/editor/autocomplete-and-snippets/) cover LaTeX and Typst sources only.
- [Visual editing](/editor/visual-editing/) covers `.tex` files only. A Markdown file always edits as source, with the rendered result in the preview pane.

Nothing in the preview reaches the network. See [Privacy and network behavior](/reference/privacy-and-network/).

## Open the preview

The preview pane follows the active tab, so you never turn it on.

- Select a `.md` file in the **Files** tab, and the preview pane shows the file rendered.
- Switch back to a `.tex` or `.typ` tab, and the compiled PDF returns.

The Markdown preview appears wherever the PDF preview would, so the **Layout** menu applies unchanged. **Editor only** hides the preview pane, and **Split view** brings it back.

No compile runs, because the preview is display-only. `Ctrl+Enter` (`Cmd+Enter` on macOS) still compiles the project's main file, never the Markdown file.

## Check that it worked

The preview pane shows your headings, lists, and tables rendered. It refreshes about 80 ms after you pause typing, with no save needed.

## Know what renders

- Standard Markdown renders: headings, emphasis, strikethrough, lists, block quotes, tables, code blocks, and links.
- Bare URLs become links without any markup.
- Headings get anchor ids, so a link such as `[details](#details)` jumps within the file.
- Math renders with KaTeX, `$...$` inline and `$$...$$` display. A formula with a typo renders as a best effort rather than breaking the page.
- Images stored in the project render, and Typeward resolves a relative path against the `.md` file's folder. An absolute path, or one that climbs out of that folder with `..`, does not resolve.
- Quotes, dashes, and ellipses render exactly as you typed them, because the preview performs no typographic substitution.
- The preview follows your editor theme, light or dark.

In the source, an escaped dollar sign (`\$`) stays a literal dollar sign, and a `$` followed by a space never opens math.

## Follow a link from the preview

The pane has no address bar and no back button, so it never navigates itself. What a click does depends on the target:

| Link | What a click does |
| --- | --- |
| `#anchor` | Jumps to that heading in the rendered file. This is the only link that resolves in place. |
| `http` and `https` | Opens the URL in your system browser. |
| Relative targets such as `notes.md`, plus `mailto:` and `tel:` | Nothing happens. The target still looks like a link, but the click is intercepted. |

If your browser does not open, a notification titled **Link not opened** shows the URL. A `javascript:` URL never becomes a link at all, and renders as plain text.

## Edit a Markdown file

A `.md` file gets Markdown syntax highlighting, and **Outline** lists the headings written with `#` markers, skipping anything inside a fenced code block. The format toolbar stays available and writes Markdown syntax rather than LaTeX or Typst.

| Tool | In a `.md` file |
| --- | --- |
| **Bold** (`Ctrl+B`), **Italic** (`Ctrl+I`) | `**bold**`, `*italic*` |
| **Underline** (`Ctrl+U`) | Hidden from the toolbar and the command palette, because Markdown has no underline construct. The shortcut does nothing. |
| **Bulleted list**, **Numbered list** | `- ` and `1. ` items. A multi-line selection converts line by line. |
| **Insert Inline math**, **Insert Equation** | `$...$` and `$$...$$`, rendered live by the preview. |
| **Insert Figure**, **Insert Table**, **Insert Link** | `![]()`, a table skeleton, `[text]()`. |
| **Insert Citation** | Pandoc-style `[@key]`. The preview shows it literally, as any plain-Markdown tool would. |
| **Toggle comment** (context menu) | Wraps the selection in `<!-- ... -->`. Because HTML never renders, the commented text still shows in the preview as literal text. |

The **Refs** tab inserts the project's citation syntax, not the file's. In a LaTeX project it writes `\cite{key}` even into a `.md` file, and in a Typst project it writes `@key`. See [How references work](/references/how-references-work/).

Grammar checking is off until you turn it on. Once on, it covers Markdown and parses the file as Markdown rather than as plain text. See [Grammar and spell checking](/editor/grammar-checking/).

## See also

- [PDF preview](/preview/pdf-preview/)
- [Privacy and network behavior](/reference/privacy-and-network/)
- [Autocomplete, snippets, and formatting](/editor/autocomplete-and-snippets/)
