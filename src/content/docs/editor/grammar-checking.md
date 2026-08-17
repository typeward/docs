---
title: Grammar and spell checking
description: Turn on Harper, the on-device spelling, grammar, and style checker, then read its underlines, apply quick fixes, and keep a personal dictionary.
---

This guide shows you how to turn on spelling and grammar checking, read what Harper reports, and fix what it finds. Typeward checks your writing with Harper, an English checker compiled into the app, so the text it checks never leaves your machine. The checker is off until you turn it on, and compiling, preview, and navigation do not depend on it.

For an AI rewrite of a whole selection instead of one issue at a time, see [AI assistant](/ai/overview/).

## Turn on the checker

Two switches control Harper, and both write the same setting. Turning on either one turns on the other.

- In the **Editing** card of **Settings → Editor**, turn on **Spell & grammar check**. Its hint reads **Powered by Harper. Configure it under Settings → Integrations → Grammar.**
- In **Settings → Integrations → Grammar**, turn on the switch on the **Harper** row. The row's status chip reads **Ready** while the checker is on and **Not configured** while it is off.

While both switches are off, no grammar UI appears anywhere in the app and the engine never runs. Turning it on installs nothing, starts no background service, and starts no language server.

Harper is a vendored copy of `harper-core`, an Apache-2.0 licensed Rust crate. Typeward compiles it into its own binary and runs it in the same process as the rest of the app. There is no grammar service, no cloud API, and no request of any kind, so checking behaves identically with the machine offline.

The **Grammar** card holds the remaining options: the dialect, the personal dictionary, and the ignored suggestions. They appear under the **Harper** row once the switch is on.

## Know what Harper checks

Harper reads your prose, never your markup. A format-aware parser masks LaTeX commands and Typst code, so Harper never flags them as bad English. Typeward picks that parser from the file extension.

| File | Parser |
| --- | --- |
| `.tex`, `.bib` | LaTeX |
| `.typ` | Typst |
| `.md` | Markdown |
| Anything else that opens in the source pane | Plain text |

Harper runs a pass about 400 ms after you stop typing, so results keep up without churning mid-word. It checks only the file open in the source pane. Typeward never scans the whole project, and Harper reports nothing for a file you have never opened.

## Set the English dialect

Harper checks English only. In **Settings → Integrations → Grammar**, set **English dialect** to one of five varieties. The default is **American (en-US)**.

- **American (en-US)**
- **British (en-GB)**
- **Canadian (en-CA)**
- **Australian (en-AU)**
- **Indian (en-IN)**

The hint reads **Spelling and usage rules follow the selected variety.** The dialect applies app-wide, never per project and never per file.

## Read the results

Issues surface in three places:

- **Source pane.** Harper underlines each issue where it occurs, in the color and line style of its family.
- **Status bar.** While the checker is on and issues exist, an indicator shows the count, for example **3 problems**. Its tooltip reads **Show grammar problems**, and selecting it opens the **Grammar** tab of the logs panel.
- **Grammar** tab. The logs panel has five tabs: **All logs**, **Errors**, **Warnings**, **Info**, and **Grammar**. The **Grammar** tab lists every collected issue as a card, and it reads **No grammar issues** when it has nothing to report.

The **Grammar** tab collects results from every file you have opened with the checker on, so it works as a cross-file list. The list clears when you switch the checker off or open a different project.

Every issue belongs to one of four families. The line style repeats the information the color carries, so the families stay distinguishable without relying on hue.

| Family | Color | Underline | Covers |
| --- | --- | --- | --- |
| **Spelling** | Red | Wavy | Misspellings, typos, malapropisms |
| **Grammar** | Amber | Double | Agreement, punctuation, capitalization, word boundaries |
| **Style** | Green | Dashed | Advisory polish: redundancy, repetition, readability |
| **Miscellaneous** | Blue | Dotted | Word choice, usage, regionalisms |

Typeward reports spelling and grammar issues as warnings, and style and miscellaneous ones as advisory info. Anything Harper reports that does not match a known kind falls into **Miscellaneous**.

Harper's underlines are separate from the ones your language server produces. See [Autocomplete, snippets, and formatting](/editor/autocomplete-and-snippets/).

## Fix an issue

Hover over an underline to open its tooltip. The tooltip shows a chip with the issue kind, for example **Spelling** or **Word Choice**, then the message, then the actions.

| Action | Offered on | What it does |
| --- | --- | --- |
| A replacement button, up to three | Every issue | Replaces the underlined text with the text on the button |
| **Add to dictionary** | Issues whose kind chip reads **Spelling** | Adds the underlined word to your personal dictionary, and Harper stops flagging that word anywhere |
| **Ignore** | Every issue | Dismisses that exact suggestion everywhere it recurs |

**Ignore** keys the dismissal to the text and its context rather than to a position, so it survives edits, files, and restarts.

The cards in the **Grammar** tab carry the same actions plus **Open file**. Select a card to jump to the issue in the source pane. The header of the tab shows the total and a chip per family with its count. Select a chip to filter the list to that family, and select it again to remove the filter.

Replacements and **Add to dictionary** act on the live text, so they work only for the file open in the source pane. On a card for another file they are disabled, with the hint **Open this file to apply**. **Ignore** is app-wide and always available.

## Manage the dictionary and ignored suggestions

Both lists live under **Settings → Integrations → Grammar** and apply app-wide, never per project.

The dictionary row counts the words you added, for example **Personal dictionary: 12 words**. Its hint notes that words you added with **Add to dictionary** are never flagged. Select **Manage** to open the list, where each word has its own remove button and the empty state reads **No custom words yet.** Each entry is a single word of at most 64 characters.

Under **Ignored suggestions**, select **Reset ignored lints** to restore every suggestion you dismissed with **Ignore**. Typeward confirms with the toast **Ignored lints cleared**.

Typeward writes both lists to its app data folder: the dictionary to `grammar/dictionary.txt`, one word per line, and the ignored set to `grammar/ignored.json`. The dictionary is plain text you can inspect, back up, or edit while the app is closed. See [Data locations, credentials, and uninstall](/reference/data-locations/).

## Choose between Harper and the AI action

With the AI assistant turned on, Typeward also offers a **Fix grammar & style** action for a selection. It is a different tool, not a better one.

- Harper is deterministic and local. It flags one issue at a time, you accept fixes individually, and nothing is sent anywhere.
- **Fix grammar & style** sends the selected text to the AI provider you configured, using your own API key. It proposes a rewrite you review before anything changes in the file.

The two are independent. Harper works with the AI assistant off, and **Fix grammar & style** works with the checker off. Neither one replaces the other.

## Check that it worked

You should now see three signs that Harper is running:

- The **Harper** row in **Settings → Integrations → Grammar** shows the status chip **Ready**.
- Colored underlines appear in the source pane about 400 ms after you stop typing.
- The status bar shows a count, for example **3 problems**, while the open file has issues.

## If it does not work

If no underlines appear, work down this ladder:

1. Confirm that the **Harper** row shows **Ready** rather than **Not configured**.
2. Confirm that the text you expect Harper to flag sits in the file open in the source pane, because Harper checks no other file.
3. Confirm that the text is prose, because the format-aware parser masks LaTeX commands and Typst code.
4. Confirm that the text is English, because Harper checks no other language.
5. Confirm that you never dismissed the suggestion with **Ignore**, which suppresses it everywhere until you select **Reset ignored lints**.
6. Confirm that the word is absent from your personal dictionary, because Harper stops flagging every word you add to it.

## See also

- [Editor overview](/editor/overview/)
- [Privacy and network behavior](/reference/privacy-and-network/)
- [Open source and licensing](/reference/open-source/)
