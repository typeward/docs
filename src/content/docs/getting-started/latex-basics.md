---
title: LaTeX basics in Typeward
description: "Learn LaTeX by writing one article in Typeward: preamble and body, sections, math, a figure, a table, and cross-references."
---

This tutorial takes you from a starter template to an article with sections, math, a figure, a table, and working cross-references, in about 30 minutes. It begins where [Your first project](/getting-started/first-project/) ended, and it assumes Typeward is installed and assumes no LaTeX experience. For Typst projects, see [Typst projects](/getting-started/typst/).

## Create the practice project

Everything in this tutorial happens in one project, created from a built-in template.

1. Press `Ctrl+N` (`Cmd+N` on macOS) to open the **New project** dialog.
2. In the **Or start from:** strip, select **Template**.
3. In the **Pick a template** dialog, select **Basic article**.
4. Type a name for the project, then fill in **Title** and **Author**.
5. Select **Create**.

The project opens with `main.tex` active. Press `Ctrl+S` (`Cmd+S` on macOS), which runs **Save and compile**, and the preview pane renders a one-page article. That is the loop for the whole tutorial: edit, press `Ctrl+S`, read the preview pane.

If instead the compile fails, the engine is the first thing to settle. See [Choosing a compile engine](/getting-started/compile-engines/).

## Find the preamble and the body

`main.tex` has two parts, and one line divides them:

```latex
\documentclass[11pt]{article}   % preamble: what kind of document
\usepackage{graphicx}           % preamble: load capabilities
% ...

\begin{document}                % body starts
\maketitle
Welcome to your new article.
\end{document}                  % body ends
```

Everything before `\begin{document}` is the preamble. It holds the document class, the `\usepackage` lines, and the `\title`, `\author`, and `\date` declarations that `\maketitle` turns into the heading block.

Everything between `\begin{document}` and `\end{document}` is the body, the only part that produces pages. Text after a percent sign (`%`) is a comment, which LaTeX never prints.

## Add sections and a table of contents

The template body already contains `\section{Introduction}` through `\section{Discussion}`.

1. Under the introduction, add `\subsection{Background}`.
2. Press `Ctrl+S`. LaTeX numbers the headings for you.
3. On its own line after `\maketitle`, add `\tableofcontents`.
4. Press `Ctrl+S` again. The table of contents lists every heading.

In the sidebar, the **Outline** section under the tabs mirrors the heading tree, and selecting an entry jumps to it.

LaTeX builds the table of contents from the previous compile's data, so it can need an extra pass. Typeward's default build recipe reruns LaTeX automatically until the document settles.

## Format text

1. Select a word in the source pane, then press `Ctrl+B` (`Cmd+B` on macOS). The source becomes `\textbf{word}`.
2. Select another word, then press `Ctrl+I` (`Cmd+I` on macOS). Typeward wraps it in `\textit{...}`.

Both actions also sit in the format toolbar under the file tabs, next to the list, math, figure, and table inserts.

:::tip
Every format toolbar action is also in the command palette, `Ctrl+K` (`Cmd+K` on macOS).
:::

## Add lists

Lists are environments you write yourself. Add both of these to the body:

```latex
\begin{itemize}
  \item A bulleted point
  \item Another one
\end{itemize}

\begin{enumerate}
  \item Numbered step one
  \item Step two
\end{enumerate}
```

Press `Ctrl+S`. The preview pane shows one bulleted list and one numbered list.

## Write math

Inline math goes between dollar signs (`$`), as in `The area is $A = \pi r^2$.`

For displayed, numbered math, use the `equation` environment. The template preloads `amsmath`, so the environment needs no extra setup, and the format toolbar's **Equation** button inserts an empty one.

```latex
\begin{equation}
  \int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}
  \label{eq:gauss}
\end{equation}
```

Math-only characters such as the underscore (`_`) and the caret (`^`) must stay inside math mode. In plain text they produce the `Missing $ inserted` error.

## Add labels and cross-references

The `\label{eq:gauss}` line in the preceding equation is an anchor. Refer to it anywhere with `Equation~\eqref{eq:gauss}`. Sections, figures, and tables use `\ref{...}` instead, with the `\label` placed after the `\caption` or `\section` it names. The template loads `hyperref`, so every reference becomes a clickable link in the PDF.

If instead a reference prints as `??`, it points at a label that does not exist. Check the spelling, then press `Ctrl+S` again. Typeward reruns LaTeX here too, the same as for the table of contents.

## Add a figure

The template preloads `graphicx`, which provides `\includegraphics`. To bring an image into the project, right-click the file tree in the **Files** tab and select **Add files here…**. The format toolbar's **Figure** button inserts the skeleton with empty slots. Filled in, it looks like this:

```latex
\begin{figure}[h]
  \centering
  \includegraphics[width=0.8\linewidth]{results-plot.png}
  \caption{Yield against reaction temperature.}
  \label{fig:results}
\end{figure}
```

:::tip
Dragging an image onto the Typeward window adds it to the project as well.
:::

## Add a table

A table combines a `table` float with a `tabular` grid. The column spec `lrr` means one left-aligned column and two right-aligned ones. An ampersand (`&`) separates cells, and `\\` ends a row.

```latex
\begin{table}[ht]
  \centering
  \begin{tabular}{lrr}
    Item   & Quantity & Price \\
    \hline
    Apples & 3        & 1.20  \\
    Pears  & 2        & 0.95  \\
  \end{tabular}
  \caption{A minimal table.}
  \label{tab:fruit}
\end{table}
```

The bracketed placement hint is only a suggestion. `[h]` asks for here if possible, and `[ht]` also allows the top of a page. Floats move, and that is expected behavior. A `\ref{tab:fruit}` reference follows the float wherever it lands.

## Load a package

Anything LaTeX cannot do on its own arrives through a `\usepackage` line in the preamble. The template already loads `amsmath`, `graphicx`, and `hyperref`.

1. In the preamble, add `\usepackage{booktabs}`.
2. In the table, swap `\hline` for `\toprule` and `\bottomrule`.
3. Press `Ctrl+S`. The table rules redraw in the booktabs style.

If instead the compile stops with `File 'something.sty' not found`, the package is missing from your TeX distribution. See [Compiling LaTeX and reading errors](/compiling/compiling-latex/) for the per-distribution fix.

## Break the document and read the error

This section breaks the document on purpose, so that the first real error is familiar.

1. In `main.tex`, change `\textbf` to `\texbf`.
2. Press `Ctrl+S`.

The compile fails with `Undefined control sequence`, and the preview pane keeps showing the last good PDF under a **Preview is stale** ribbon.

Open the logs panel, which sits in a tab next to the preview pane by default. The **Errors** tab lists each parsed error as a card, and **All logs** holds the raw output.

LaTeX errors cascade, so fix the first line starting with an exclamation mark (`!`) and compile again before working through the rest. Two steps put this project back on a clean compile:

1. In `main.tex`, change `\texbf` back to `\textbf`.
2. Press `Ctrl+S`. The preview pane renders the article again, with no stale ribbon.

## Next steps

- [Compiling LaTeX and reading errors](/compiling/compiling-latex/): common errors decoded, plus SyncTeX jumping between the source pane and the preview pane.
- [How references work](/references/how-references-work/): where a `\cite` key comes from, and how the entries reach your document.
- [Visual editing for LaTeX](/editor/visual-editing/): a word-processor-style view over the same `.tex` source.
- [Overleaf Learn](https://www.overleaf.com/learn): the fuller treatment of what this tutorial compressed, in the same LaTeX that Typeward compiles.
