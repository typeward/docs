---
title: Editor context menu
description: "What the source pane's right-click menu offers: clipboard actions, comment toggling, review comments, project history, SyncTeX jumps, and AI actions."
---

The editor context menu offers the actions that apply to the text you clicked: the clipboard, comment toggling, review comments, navigation, and the AI assistant. Right-click inside the source pane to open it at the pointer, or press the dedicated menu key to open it at the text cursor. For the right-click menu on the file tabs, see [Editor overview](/editor/overview/); for the one on the file tree, see [Files and folders](/projects/files-and-folders/).

## Menu items

The menu works the same way in LaTeX, Typst, and Markdown projects, and it offers only what applies where you clicked. Items that need a selection are disabled without one, and items that do not apply to the current file are hidden entirely. These are the items, in the order the menu lists them:

| Item | What it does | Availability |
| --- | --- | --- |
| **Cut** | Removes the selection and puts it on the clipboard. | Disabled without a selection |
| **Copy** | Puts the selection on the clipboard. | Disabled without a selection |
| **Paste** | Inserts the clipboard text at the cursor, replacing any selection. | Always |
| **Select all** | Selects the whole file. | Always |
| **Toggle comment** | Comments or uncomments the current line or selection, with `%` in LaTeX, `//` in Typst, and an `<!-- -->` HTML comment in Markdown. | Hidden in files that declare no comment marker, such as `.txt` and other plain-text files |
| **Add comment** | Anchors a [review comment](/editor/review-comments/) to the selection. | Disabled without a selection |
| **Add TODO** | Anchors a TODO thread to the selection. | Disabled without a selection |
| **Project history** | Opens the [version history](/projects/version-history/) popover, which covers the whole project, newest version first. | Always |
| **Reveal in PDF** | Jumps the [preview pane](/preview/pdf-preview/) to the output produced by the line under the cursor, the same SyncTeX forward search as `Ctrl+J` (`Cmd+J` on macOS). | Hidden outside a LaTeX file in a LaTeX project with a compiled PDF |

Typeward runs **Cut**, **Copy**, and **Paste** through its own clipboard integration, so they behave the same inside the source pane on every platform. Elsewhere in the app, the webview's own menu still appears in text fields and over selected text.

If an action fails, Typeward shows a toast reading `Couldn't run "<label>"` with the item's label filled in.

## AI actions

Once the AI assistant is on, a fifth group of items appears at the end of the menu. The assistant is off until you turn it on in **Settings → Integrations → AI providers**, and while it is off that group does not exist. Nothing else in the menu depends on it.

- **Rewrite**, **Fix grammar & style**, **Make concise**, and **Expand** send the selection to your provider and open a dialog showing the result as a diff against the selection. From there you can replace, insert below, or copy.
- **Continue writing** drafts the next passage from the cursor and offers to insert it. It is the only AI item that appears without a selection.
- **Explain this** and **Ask about selection** open the assistant chat pane. **Explain this** sends its question at once, and **Ask about selection** quotes the selection into the composer and waits for yours.

Every AI item except **Continue writing** is hidden until you select text, and none of them has a keyboard shortcut. The command palette lists the same seven under **AI**, with longer titles such as **Rewrite selection**. For what each action sends and what the dialog does, see [AI assistant](/ai/overview/).

## Keyboard control

The dedicated menu key opens the menu at the text cursor, and so does `Shift+F10` where the operating system delivers it as a context-menu request. Inside an open menu, the keyboard does the rest:

- The arrow keys move between the available items, wrapping at the ends and skipping anything disabled.
- `Home` and `End` jump to the first and last item.
- `Enter` runs the focused item, and `Escape` closes the menu.

## See also

- [Editor overview](/editor/overview/)
- [Files and folders](/projects/files-and-folders/)
- [Keyboard shortcuts](/reference/keyboard-shortcuts/)
