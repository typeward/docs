---
title: Choosing a compile engine
description: How Typeward picks a LaTeX engine on first launch, what a TeX distribution adds over the bundled Tectonic engine, and where to change the choice.
---

This page explains how to choose between the two engines Typeward compiles LaTeX with: the TeX distribution on your machine, or the Tectonic engine bundled with the app. Switching between them is a setting rather than an install, for everyone. The bundled Tectonic engine ships in the macOS builds and in every x86_64 build; the Windows ARM64 and Linux ARM64 builds ship without it, so on those install a TeX distribution or the `tectonic` command-line tool yourself. For Typst projects, see [Typst projects](/getting-started/typst/).

## The engine to pick

Pick the engine that matches what your machine already has and what your document needs.

- You already have TeX Live, MacTeX, or MiKTeX installed: **System TeX**.
- You want to start writing now, with nothing to install: **Tectonic**.
- Your document needs XeLaTeX or LuaLaTeX: install a TeX distribution, then pick that engine in the project's build menu.
- You want source and PDF jumping: install a TeX distribution, whichever engine you compile with day to day.
- You want chapter drafts for a long document: install a TeX distribution and set the project's engine to **pdfLaTeX**, **XeLaTeX**, or **LuaLaTeX**.

The global choice is the **Default engine** picker under **Settings → Editor → Compilation**, which offers **System TeX** and **Tectonic**. Its hint reads "Default for projects without their own build settings (set those in the editor's build menu). System TeX uses your local install; Tectonic is self-contained." Any project can override that choice from its build menu, and the per-project choice wins. See [Per-project build configuration](/compiling/build-configuration/).

## The default on your machine

Typeward has no fixed default engine. At first launch it probes your machine for typesetting tools and sets the global engine from what it finds:

- **System TeX** when `pdflatex`, `xelatex`, or `lualatex` is on your `PATH`.
- **Tectonic** when none of them is.

A machine that already has TeX Live, MacTeX, or MiKTeX therefore starts on **System TeX**. A machine with no TeX at all starts on **Tectonic** and compiles anyway. The probe also runs when you skip the onboarding screens, so the choice is never made blindly. You can change it in **Settings** at any time.

## The setup check in onboarding

The second onboarding step, **Checking your typesetting setup**, runs the same probe and shows one row per tool:

| Tool | Subtitle |
| --- | --- |
| **pdfLaTeX** | Used for LaTeX |
| **XeLaTeX** | Unicode-aware LaTeX |
| **LuaLaTeX** | LaTeX with Lua scripting |
| **latexmk** | Build manager for LaTeX |
| **Tectonic** | Bundled with Typeward |
| **Typst** | Only for Typst projects |

A tool the probe finds carries a green **Ready** badge with the version that tool reports. A tool it does not find shows the line `<name> not on PATH` with the hint "Install it, then Re-scan". The **Re-scan** button runs the probe again, so you can install something in another window and check the result without restarting Typeward.

Typst is the exception. It is optional for LaTeX work, so a missing `typst` command-line tool shows a muted "Get it from typst.app" link instead of the red not-on-PATH state.

When the probe finds no LaTeX engine at all, the step adds a warning. It reads "No system TeX detected." and then "That's fine: Typeward's bundled Tectonic engine compiles LaTeX with nothing to install." A link to tug.org sits beside the warning for installing a full TeX Live.

## The engine status line in Settings

The **Default engine** picker carries a live status line for the engine you have selected, with a **Re-check** button beside it. While the probe runs, the line reads "Checking installed TeX tools…". If detection itself fails, it reads "TeX detection unavailable". Every other line names what the probe found:

| Selected engine | Status line | What it means |
| --- | --- | --- |
| **System TeX** | latexmk 4.86 · pdflatex found | Everything is in place. The version is whatever your install reports, and the second half appears only when `pdflatex` is also present. |
| **System TeX** | pdflatex only: latexmk is missing, so compiling calls pdflatex directly | Compiling works, but nothing manages reruns for you. If cross-references or citations need more than one pass, pick a recipe such as **Engine only (×2)** or **Engine + BibTeX** in the build menu. |
| **System TeX** | latexmk found but no TeX engine. Install a TeX distribution or switch to Tectonic | `latexmk` is present, but no `pdflatex`, `xelatex`, or `lualatex` exists for it to drive. |
| **System TeX** | No TeX installation detected; the Tectonic engine runs without one | The probe found nothing usable for **System TeX**. Switch the picker to **Tectonic**, or install a TeX distribution. |
| **Tectonic** | tectonic 0.15.0 found | The bundled engine, or a `tectonic` on your `PATH`, is ready. |
| **Tectonic** | tectonic isn't installed and this build doesn't include it. Install it, or switch the engine | This build shipped without the bundled engine, and none is installed. Install the `tectonic` command-line tool, or use **System TeX**. |

The first Tectonic line is what a normal desktop build reports, because the probe checks the bundled copy before it checks your `PATH`.

## System TeX

**System TeX** compiles with the TeX distribution installed on your machine: TeX Live, MacTeX, or MiKTeX.

- Typeward runs `latexmk`, resolved from your `PATH`, which handles reruns, bibliographies, and indices for you.
- You get the full CTAN package ecosystem exactly as your distribution provides it, which suits complex documents, journal classes, and anything you previously compiled elsewhere.
- The `synctex` command-line tool that powers source and PDF jumping comes with these distributions.

If `latexmk` cannot be started, or exits non-zero, Typeward re-runs the compile with the engine binary directly (`pdflatex`, `xelatex`, or `lualatex`). Some MiKTeX installs ship `latexmk` without a working Perl, which is the case this covers. The build log echoes every command it runs, as `$ latexmk ...` or `$ pdflatex ...`. It marks the fallback with a `--- falling back to pdflatex ---` line, so you can always see which binary produced the PDF.

The PDF lands in the project root, named after the main file: `thesis.tex` produces `thesis.pdf`. That holds even when the main file sits in a subfolder, so `chapters/thesis.tex` still writes `thesis.pdf` at the top of the project.

If no engine can be found at compile time, the build log ends with:

```
No LaTeX engine on PATH (pdflatex not found). Install MiKTeX/TeX Live or pick the Tectonic engine in the build menu.
```

The trade-off is the install. A full TeX Live is a multi-gigabyte download that you manage and update yourself.

## Bundled Tectonic

**Tectonic** is a self-contained engine that Typeward ships alongside the application binary, at version 0.15.0, so you can compile LaTeX with no TeX installation at all. If a build does not include the bundled copy, Typeward falls back to a `tectonic` on your `PATH`.

- Tectonic is XeLaTeX-based, so Unicode text and system fonts work without extra setup.
- Tectonic downloads packages on demand and caches them, so the first compile of a document reaches the network and later compiles of that document stay local.
- Tectonic runs its own bibliography and rerun passes. The build menu replaces its **Recipe** section with the note "Tectonic runs its own bibliography passes, so the recipe is ignored."
- Tectonic always stops at the first error, whatever the **Stop on first error** setting says.
- Tectonic writes the PDF next to the main file rather than in the project root.

:::caution[The first Tectonic compile needs a network connection]
Packages arrive on first use, so the first compile of a new document takes longer and reaches the network. On a machine that is offline, that first compile fails until the cache holds what the document needs.
:::

### Hardened mode

Typeward passes `--untrusted` to Tectonic on every compile. In that mode the document loses the capabilities that reach your machine: shell-escape, and writing outside the output directory. A `.tex` file is content someone else may have written, so this is the default rather than an option.

Typeward drops the flag only for a project you have granted shell-escape on that machine, which it asks for with a native confirmation dialog. Tectonic then receives `-Z shell-escape` instead, because its untrusted mode refuses the two together. The shell-escape toggle and the trust grant both live in the build menu.

### Fully offline compiles

One compile setting has no screen in the app: `compile.strictOffline`. When it is on, Tectonic runs with `--only-cached` and cannot reach the network at all.

It is off by default, because Tectonic downloads packages on first use and turning it on before the cache is warm breaks compiles. Compile the documents you care about at least once while online, then edit `settings.json` with Typeward closed:

```json
{
  "compile": { "strictOffline": true }
}
```

Typeward preserves the key across its own settings saves, so changing something in **Settings** does not wipe it. The path to `settings.json` differs per platform. See [Data locations](/reference/data-locations/).

## XeLaTeX and LuaLaTeX

**XeLaTeX** and **LuaLaTeX** are per-project choices rather than global ones. The global setting offers only **System TeX**, which compiles with pdfLaTeX, and **Tectonic**. A document that needs one of the other two takes its engine from the build menu, opened from the **Engine** pill in the sidebar footer or from the engine name in the status bar. That menu's **Engine** section lists **pdfLaTeX**, **XeLaTeX**, **LuaLaTeX**, and **Tectonic**.

Both run through your TeX distribution, as `latexmk` with `-xelatex` or `-lualatex` and the same direct-binary fallback, so they need a TeX installation. Typeward stores the choice per project, where it overrides the global default. The same menu holds the compile recipe and the other per-project build options. See [Per-project build configuration](/compiling/build-configuration/).

## Typst projects

Typst projects use neither LaTeX engine. Typeward runs the `typst` command-line tool resolved from your `PATH`, as `typst compile <main file>`, and the PDF lands beside the main file. Typeward never bundles that tool, and a missing one fails the compile with:

```
typst is not on PATH; install it from https://typst.app/download or `cargo install typst-cli`
```

## Known limitations

- Source and PDF jumping needs the `synctex` command-line tool, which ships with TeX Live, MacTeX, and MiKTeX rather than with the bundled Tectonic engine.
- On a machine that has only Tectonic, compiling and preview work normally, but forward search with `Ctrl+J` (`Cmd+J` on macOS) and double-click inverse search quietly do nothing.
- On that machine a recompile restores the raw scroll position instead of the source line you were reading.
- **Draft this chapter** compiles through your TeX distribution. Under **Tectonic** it refuses with `chapter drafts need a latexmk/pdflatex engine (Tectonic has no \includeonly fast path)`.
- The **Recipe** section of the build menu applies only to the engines from a TeX distribution, because Tectonic manages its own passes.
- Typst projects produce no SyncTeX data at all, whatever is installed.

## See also

- [Compiling LaTeX and reading errors](/compiling/compiling-latex/)
- [Per-project build configuration](/compiling/build-configuration/)
- [Chapter drafts](/compiling/chapter-drafts/)
- [Typst projects](/getting-started/typst/)
- [Data locations](/reference/data-locations/)
