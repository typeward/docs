# Typeward docs style guide

This guide is the single authority for writing pages in `src/content/docs`. Every rule here is
checkable by looking at the page. Where the research behind this guide disagreed with itself, the
call is already made below. Do not reopen it in a page.

Our reader is an academic who is expert in their own field and is not a programmer. They usually
arrive from a search engine, mid-task, holding an error string or a question. Write for that
arrival.

---

## 1. Non-negotiable house rules

These are absolute. A page that breaks one is not finished.

1. **No em dashes in prose.** Not `—`, not `--`, not ` - ` used as a dash. Substitutes, in order of
   preference: rewrite as two sentences; a colon when the second half unpacks the first; a comma
   pair for a light aside; parentheses for a true aside. If a UI string that Typeward itself renders
   contains an em dash, quote it exactly and flag it in the pull request so the app can be fixed.
   Never silently alter a quoted UI string.
2. **No contractions in prose.** Write "do not", "cannot", "it is", "you will". The only exception
   is a UI string quoted verbatim (for example the toast `Remapping isn't supported yet.`).
3. **Sentence case for every heading**, including the frontmatter `title`. Capitalize proper nouns
   and exact UI labels only.
4. **Frontmatter `description` is at most 160 characters**, one sentence, ending with a period. It
   is the search snippet and the sidebar tooltip. It is not the page lede.
5. **Shortcuts are Ctrl-first with the macOS form in parentheses**, both in code formatting:
   `` `Ctrl+S` (`Cmd+S` on macOS) ``. No spaces around the plus. Never the `Ctrl/Cmd` slash form.
   First use on a page carries both forms; later uses on the same page may give the `Ctrl` form
   alone. Where macOS uses a literal `Ctrl` (for example `Ctrl+Tab`), say so in the same sentence.
6. **UI labels are quoted exactly as the app renders them**, in bold, including typographic
   characters: **Compiling…**, **Outline unavailable for this file type.**, **Projects & files**.
   Never re-case, never re-punctuate, never paraphrase a label.
7. **Internal links are absolute and end with a slash**: `/compiling/compiling-latex/`. No relative
   links, no `.md` extensions, no missing trailing slash.
8. **No emoji**, anywhere, including headings and callouts.
9. **No marketing language.** Banned outright: powerful, seamless, blazing, magic, effortless,
   delightful, best-in-class, revolutionary, and every exclamation mark.
10. **No invented UI.** Every label, menu path, toast, setting, and default in a page must exist in
    a shipped build. If you cannot verify it, cut the sentence.

Also banned, because they blame or flatter the reader: simply, easy, easily, just, quickly, please,
obviously, of course, note that.

Mechanical substitutions, applied every time: "allows you to" becomes "lets you"; "in order to"
becomes "to"; "e.g." becomes "for example"; "i.e." becomes "that is"; "utilize" and "leverage"
become "use"; "there is" and "there are" get a real subject, except in the assurance sentences in
section 7.

Because contractions are banned, a scanning reader can miss the word "not". Where meaning turns on a
negation, use "never" or "no", or invert to a positive: "Never edit `library.bib` by hand".

---

## 2. Page furniture

- Frontmatter carries `title` and `description` and nothing else, unless a page genuinely needs
  `sidebar`. Never ship `draft: true`.
- Starlight renders the H1 from `title`. Never write an H1 in the body.
- The body starts with prose, never with a heading. One to three sentences.
- Do not skip heading levels. Do not use H4 unless the page is a reference table page.
- Every heading on a page is unique. Duplicate headings collide in the table of contents.
- No heading ends with punctuation, except a question mark on an FAQ or a troubleshooting question.
- No links, no bold, and no code spans in heading text, with one exception: a literal error string
  used as a troubleshooting H3 is written in code formatting.
- No gerund headings anywhere. "Cloning a repository" becomes "Clone a repository". "How versions
  are recorded" becomes "How Typeward records a version" only on a concept page; on a task page it
  becomes an imperative.

Heading grammar is fixed per archetype and must be held for the whole page:

| Archetype | Heading grammar | Example |
| --- | --- | --- |
| Install, how-to, tutorial | Imperative verb phrase | `## Verify your download` |
| Concept | Noun phrase | `## Engine trade-offs` |
| UI-surface tour | Noun phrase matching the UI label | `## Preview pane` |
| Reference | Noun phrase matching the app's own section name | `## Projects & files` |
| Troubleshooting | The reader's symptom, or the literal error string | `## The preview shows an old PDF` |
| FAQ | The reader's question, ending in a question mark | `## Is Typeward free?` |

---

## 3. The first screenful

The first sentence of the body says what the reader will be able to do, decide, or find after
reading the page. It contains a verb the reader cares about (install, compile, recover, choose,
cite, export). It is not a platform note, not a UI location, not a storage fact, and not a
restatement of the title.

Fixed opener per archetype. Use these templates:

- Tutorial: "This tutorial takes you from X to Y."
- How-to: "This guide shows you how to X."
- Concept: "This page explains X."
- Install: "This guide installs Typeward on X and ends with the app running."
- UI-surface tour: "The X shows Y." followed by every route that opens it.
- Reference: one sentence of scope. No promise sentence.
- Troubleshooting and FAQ: one sentence naming what the page covers and where deeper coverage lives.

Within the first three sentences, send the wrong reader away, once, in this shape: "For Typst
projects, see [Typst projects](/getting-started/typst/)." Put the routing sentence before any
prerequisite and before the first step.

The answer the title promises goes in the first screenful. If the page is called "Choosing a compile
engine", the recommendation is the first H2 and the detection mechanism comes after it. Mechanism,
storage, persistence, and internals never precede the thing the reader came for.

---

## 4. Sentence and paragraph mechanics

- **Sentence length**: at most 30 words. At most one colon per sentence, and it may only introduce
  a list or a single expansion. Two or more semicolons in one sentence means it should be a bullet
  list. Front-load the clause: condition, purpose, or location first, verb last. Write "To rename a
  label, place the cursor inside the brace", not "Place the cursor inside the brace if you want to
  rename a label".
- **Paragraph length**: two to five sentences, and no more than about 90 words. A single-sentence
  paragraph is fine and often better.
- **Numbered procedure**: any sequence of two or more actions the reader performs in order is a
  numbered list. One action per step. Each step is a complete sentence starting with an imperative
  verb and ending with a period. Name the surface before the action: "In the **Files** tab, select
  **New file**." Fold the result into the same step; never give a result its own step. Prefix a
  skippable step with the literal string `Optional: `. A one-action task is a single bullet under a
  lead-in sentence, never a numbered list of one.
- **Table beats a list** when three or more items share two or more attributes: symptom and fix,
  setting and default and effect, feature and platform. Three columns is the target and four is the
  hard maximum, because the Starlight layout scrolls horizontally beyond that. Introduce every table
  with a complete sentence. Column headers are sentence case with no terminal punctuation. Never put
  a table inside a numbered step.
- **List length**: two to seven items. Never a list of one. Keep every item in the same grammatical
  shape. Capitalize the first word. Add a period only when the item is a complete sentence.
- **Active voice, named actor**: "Typeward writes the snapshot to `.typeward/snapshots/`", not "the
  snapshot is written". The passive is correct in exactly one case, and you should use it there:
  when naming the actor would blame the reader. Write "The package was not found on the search
  path", not "You installed the package in the wrong place".
- **Second person**: "you" and "your". Never "we", "us", "let us", "our", or "I". Where a statement
  is about the project rather than the software, name Typeward: "Typeward does not upload your
  files."
- **Present tense**: describe what the software does. Use "will" only for something that genuinely
  happens later: "The next compile will reuse the cached auxiliary files."
- **Link text** is the destination page title or a self-sufficient noun phrase, with the important
  words first. Never "here", "this page", "this link", or a bare URL. The period goes outside the
  link. Use one cross-reference sentence everywhere: "See [Page title](/slug/)." Two different
  targets on the same page never share link text.
- **Alt text**: at most 150 characters, one sentence, starting with "Screenshot of" or "Diagram of",
  ending with a period. Describe the purpose, not the interface, because the steps already carry the
  detail. Never "Image of". A purely decorative image takes an empty alt attribute.
- **No directional language.** Never "the screenshot below", "above", "to the right of", or
  "top-left". Starlight reflows, so those statements go wrong at narrow widths. Write "next to
  **Compile**" or "in the sidebar footer", and refer to a figure as "the preceding screenshot".
- **Menu paths** use the arrow, bolded as one run, at most three segments:
  **Settings → Editor → Compilation**. Never `>`.
- **Punctuation characters** are named before they are shown: "type a backslash (`\`)".
- **Realistic examples only**: `\cite{einstein1905}`, `results-plot.pdf`. Never `foo` or `image.png`.

### Callouts

Use Starlight asides. Each type has exactly one job:

- `:::note` a fact a minority of readers needs, such as a platform exception.
- `:::tip` an optional shortcut the reader can finish the task without.
- `:::caution` something that wastes the reader's time or leaves a confusing state.
- `:::danger` something that loses work or data, or a security decision.

Rules: at most two asides per page. An aside longer than one sentence takes a bracket title written
as a claim or the reader's own question, for example `:::caution[Compiling from a synced folder]`.
A one-sentence aside takes no title. Never put a prerequisite, a step the reader must perform, or
the page's main answer in an aside, because a skimming reader skips boxes. Never stack two asides.
Never end a page inside an aside.

---

## 5. Page skeletons

Each skeleton is an ordered list of sections. Sections marked optional may be omitted; the others
appear on every page of that archetype, in that order, with those heading words.

### 5.1 Install page

1. Lede. One sentence: what the reader has at the end.
2. `## Requirements`. Machine facts only, as bullets, with a plain-language translation of any
   technical threshold. Nothing the reader must do.
3. `## Before you install` (optional). Only for actions required before step 1.
4. `## Download and install`. Numbered steps, ending with the app launched.
5. `## Verify your download`. Numbered steps, the exact command, and the literal expected output.
6. `## <the platform security prompt>`. Named for what the reader sees, for example
   `## Windows SmartScreen`. Two or three numbered steps, plus one clause saying the prompt is
   expected and linking to the explanation. No justification paragraph.
7. `## Check that it worked`. One sentence "You should now see ...", then a numbered ladder titled
   "If Typeward does not start:" where each item is a check that narrows the cause, not a fix.
8. `## Updating`.
9. `## Uninstalling`.
10. `## Next steps`. Two to four links, one clause each.

Must not contain: a feature tour, settings defaults, or more than one clause of reasoning about
unsigned builds. All three install pages carry the same sections in the same order.

### 5.2 Getting started and tutorial page

1. Lede. "This tutorial takes you from X to Y." Then one sentence of assumed knowledge, stated as a
   non-assumption: "This tutorial assumes Typeward is installed and assumes no LaTeX experience."
2. Continuity sentence when the page follows another: "This tutorial begins where
   [Your first project](/getting-started/first-project/) ended."
3. `## Before you start` (optional). One short list or one sentence.
4. Numbered imperative H2 steps. **One path only.** No "or", no template menus, no alternatives, no
   settings tables. Anything optional moves to a how-to page and is linked from Next steps.
5. After each milestone, one sentence of what the reader should see, and one "If instead you see"
   branch that links to the fix.
6. `## Next steps`. Each link carries one sentence saying what that page gets the reader.

Must not contain: architecture explanations, an outbound link inside a numbered step, or any choice.

### 5.3 Concept page

1. Lede. "This page explains X."
2. First H2 answers the question or decision the title raises, as a short recommendation list keyed
   to what the reader has: "You already have a TeX distribution installed: **System TeX**."
3. Noun-phrase H2s per facet, each opening with a definition sentence.
4. `## Known limitations` (optional). See section 7.
5. `## See also`. Bare links, no descriptions.

Must not contain: numbered procedures (link to the how-to), or a complete catalog of values (link
to the reference page).

### 5.4 How-to and task page

1. Lede. "This guide shows you how to X."
2. Routing sentence (optional), sending the adjacent reader elsewhere.
3. Prerequisite as one imperative sentence, or `## Before you start` when prerequisites branch.
4. Imperative H2 sections, each holding numbered steps.
5. `## Check that it worked`. Observable proof.
6. `## If it does not work` (optional). Numbered narrowing checks.
7. `## Next steps` or `## See also`.

Must not contain: rationale paragraphs longer than one sentence, mechanism sections, or option
catalogs. Hand each of those off with "See [Page title](/slug/)."

### 5.5 UI-surface tour page

1. Lede. Sentence one defines the surface. Sentence two gives every route that opens it: the
   shortcut, the menu, and the click target.
2. One screenshot of the whole surface, at most. Additional images only as a before and after pair
   whose difference is legible at page width, or a tight crop of one named element.
3. One H2 per region, noun phrase matching the UI label, in screen order, each one short paragraph
   or one bullet list, each ending with a link to the deep page.
4. `## Layout and what persists` (optional).
5. `## See also`.

Must not contain: procedures, settings defaults, error strings, or a second description of a region
that another tour page already owns. The window regions are named once, in
[Editor overview](/editor/overview/), and every other page reuses those names without redescribing
them.

### 5.6 Reference table page

1. Lede. One sentence of scope. No promise sentence.
2. The first table, immediately. Nothing between the lede and it.
3. One H2 per section, in the app's own order, with H3 per subsection. Heading text matches the
   in-app label character for character.
4. Tables in a fixed shape: Setting, Default, What it does. The third column describes only. Any
   sentence starting with an imperative verb, or with "when you want to", belongs in a linked guide.
5. `## How these values are stored` (optional), at the end.
6. `## See also`.

Must not contain: numbered steps, recommendations, or storage and persistence mechanics above the
first table.

### 5.7 Troubleshooting page

1. Lede. One sentence naming where Typeward reports failures, and one sentence routing to the FAQ or
   the install pages.
2. `## Start here`. A two-column table: symptom, and a link to the section that fixes it.
3. Noun-phrase H2 groups by area, then one H3 per failure. The H3 text is the literal error string
   in code formatting. If the string is a long sentence, use the recognizable head of it as the
   heading and quote the full string in the first body line.
4. Under each H3, four slots in this order: one sentence of what it means; one or two sentences of
   what causes it; the fix as numbered steps, cheapest first; and, where true, the sentence "This is
   a warning, not an error. You can ignore it unless X."
5. `## Still stuck`. Name exactly what to collect (operating system, engine, the last twenty lines
   of the log, the smallest file that reproduces it) and where to file it.

Must not contain: an error string in bold body text, an error string that another page also owns as
a heading, or a section with no anchorable heading. One string, one home, and every other mention
links to that anchor.

### 5.8 FAQ page

1. Lede. One sentence saying the FAQ answers briefly and points to the page that holds the detail.
2. One H2 per question, in the reader's words, ending with a question mark, most-asked first.
3. Each answer opens with "Yes.", "No.", or a one-sentence answer, adds at most two more sentences,
   and ends with "See [Page title](/slug/)."

Must not contain: any fact that lives nowhere else. The FAQ routes; it never becomes a second source
of truth. Any answer running past four sentences means the page it should link to is missing.

---

## 6. Terminology

Use the left column everywhere, including headings, alt text, and frontmatter descriptions.

| Use this | Not this | Why |
| --- | --- | --- |
| project | document, workspace, folder | A project is the folder Typeward opens. Reserve "document" for what the reader writes. |
| file | document, source file | One file on disk. "Main file" is the compile root. |
| compile (verb) | build, typeset, render | One verb for the action. "Build" survives only inside fixed names such as **build menu**. |
| build menu | build settings popover, build configuration popover, engine popover | The menu opened from the **Engine** pill. Name the control **Engine** pill, name the menu build menu. |
| engine | compiler, backend | pdfLaTeX, XeLaTeX, LuaLaTeX, Tectonic. Typst projects compile with the `typst` command-line tool. |
| **System TeX** | system TeX, system-TeX | It is a UI option, so it is bold and exactly cased. Use "TeX distribution" for the software installed on the machine. |
| logs panel | console, log pane, output panel | One name for the surface holding **All logs**, **Errors**, **Warnings**, **Info**, and **Grammar**. |
| preview pane | preview panel, PDF pane, viewer | Matches [Editor overview](/editor/overview/). Quote **In preview panel** only as a verbatim **Layout** option. |
| source pane | editor pane, text pane, code pane | Matches the tour page. |
| sidebar | left panel, file panel | The tabbed region. Its tabs are **Files**, **Refs**, **SCM**, **Review**, and **TODO**, always bold and exact. |
| **Outline** | outline panel, document outline, structure tree | The section below the sidebar tabs, named as the app names it. |
| status bar | bottom bar, footer | One name. |
| top bar | header, title bar, toolbar | One name. |
| command palette | quick actions, command bar | Opened with `Ctrl+K` (`Cmd+K` on macOS). |
| Settings | Settings screen, Settings panel, preferences, options | Refer to it as **Settings**, and write paths as **Settings → Projects & files**. |
| projects root | projects folder, project directory, library folder | The folder Typeward creates and lists projects in. Quote **Projects folder** only when naming the control. |
| projects library | the library, project list, dashboard | Always with the modifier, because `library.bib` is a different thing. |
| cloud sync | WebDAV sync, Cloud storage, sync service | Cloud sync is the feature. WebDAV is the protocol it speaks. |
| the project's `.typeward` folder | sidecar, sidecar folder | "Sidecar" is jargon our reader does not hold. |
| auxiliary files | aux files, intermediates | Spell it out in prose. Quote **Clean auxiliary files** as the menu label. |
| language server | LSP, LSP server | Name the specific server where it matters: texlab, tinymist. |
| reference manager | citation provider, bibliography tool | Zotero, Mendeley, and the rest. A connected source of entries is a "reference source". |
| keyboard shortcut | hotkey, key binding | Reserve **Keybindings** for the setting that switches the source pane to Vim or Emacs. |
| select | click, tap, press (for pointer actions) | "Select" covers pointer and keyboard. Use "click" only when the mouse specifically matters, and "press" only for keys. |
| app data | application data, appdata | One spelling. |
| American spelling | behaviour, labelled, cancelled, grey, colour | The corpus already leans American. Use behavior, labeled, canceled, gray, color. |

---

## 7. Writing honestly about a pre-1.0 open-source app

State the fact. State what the reader sees. State what to do. Three sentences, no apology, no
promise.

**Limitations.** Collect them under `## Known limitations`, placed immediately after the description
of the feature and before the steps, never at the bottom of the page. Each bullet is a flat
declarative present-tense fact:

- Typeward pulls fast-forward only. Diverged histories fail with an error.
- Typst projects produce no SyncTeX data, so the PDF does not highlight comment threads.

Banned in those bullets and everywhere else: "coming soon", "in a future release", "we plan to",
"on the roadmap", "currently", "for now", any release date, and any version number that has not
shipped. "Yet" is allowed only inside a quoted UI string.

**Dormant or off-by-default features.** Name what exists, say it is off by default, say what turns
it on, and say what the reader gets without it. Frame the state as the reader's choice, not as an
unfinished product: "Grammar checking is off until you turn it on. Compiling, preview, and
navigation do not depend on it."

**Features that do not ship yet.** Do not publish a page for them. Do not add a stub. Do not add a
deprecation notice for a removed feature; delete the page and add a redirect in `astro.config.mjs`.

**Pre-1.0 realities the reader will hit**, such as unsigned builds or a missing keyring: state the
fact in one clause at the step where the reader meets it, say the warning is expected, and link the
explanation. The reasoning lives on a concept page, never inside a procedure.

**Assurances** are the one place "there is no" is correct, because the absence is the point: "There
is no account of any kind." Keep those sentences short and do not soften them.

Never compare Typeward to another product by name in order to look better. Naming another tool to
help a reader migrate or to state a fact is fine.

---

## 8. Checklist

Run this against a finished page. Every answer must be yes.

1. Does the body start with prose, not a heading?
2. Does the first sentence say what the reader can do, decide, or find, using the archetype template
   in section 3?
3. Is the answer the title promises inside the first screenful, ahead of any mechanism or storage?
4. Is the `description` one sentence of 160 characters or fewer, different from the lede?
5. Are all headings sentence case, unique on the page, free of gerunds, and in the single grammar
   this archetype requires?
6. Does the page follow its skeleton in section 5, section for section, in order?
7. Is every ordered sequence of two or more actions a numbered list of complete imperative
   sentences, with the surface named before the action?
8. Does every set of three or more items sharing two or more attributes appear as a table of at most
   four columns, introduced by a complete sentence?
9. Is every sentence 30 words or fewer, with at most one colon, and every paragraph five sentences
   or fewer?
10. Are there zero em dashes, zero contractions outside quoted UI strings, and zero emoji?
11. Is every shortcut written `` `Ctrl+X` (`Cmd+X` on macOS) `` on first use, and every menu path
    written with bold labels and arrows, at most three segments?
12. Is every UI label bold and character-exact, and does every label, default, and toast on the page
    exist in a shipped build?
13. Are all internal links absolute with a trailing slash, with self-sufficient link text, the
    period outside the link, and no duplicate link text pointing at different pages?
14. Does every image have alt text of at most 150 characters that describes purpose rather than
    interface, and does the prose avoid "above", "below", and "to the right of"?
15. Are there at most two asides, each with the right type, each titled if longer than one sentence,
    and none holding a step, a prerequisite, or the main answer?
16. Is every literal error string an H3 in code formatting on exactly one page, with every other
    mention linking to that anchor?
17. Does the page use only the left column of the terminology table in section 6?
18. Is every actor named, every claim in the present tense, and every sentence in second person with
    no "we", "us", or "let us"?
19. Are limitations stated as flat present-tense facts, with no dates, no roadmap language, and no
    apology?
20. Does the page end on a forward move (`## Next steps` or `## See also`), and not on a caveat, a
    limits section, or a closing `:::`?
21. Does `npm run build` pass, including the link validator?

Quick greps before you open a pull request, from the repo root:

```
grep -rn "—\|--" src/content/docs
grep -rniE "\b(don't|doesn't|isn't|it's|you'll|can't|won't)\b" src/content/docs
grep -rniE "\b(simply|just|easy|easily|quickly|please|seamless|powerful)\b" src/content/docs
grep -rn "click here\|this page\|see above\|see below" src/content/docs
```

A grep may hit a quoted UI string or a code fence. Check the hit; never change a quoted string to
satisfy a grep.
