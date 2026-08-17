---
title: Importing from Overleaf
description: Move a project from Overleaf to Typeward with a zip export, or clone it over the Overleaf git bridge.
---

This guide shows you how to move an Overleaf project into Typeward. Both sides work with plain LaTeX sources, so nothing is converted along the way. Which path you take depends on whether you are leaving Overleaf or working on both sides:

- A zip export copies the project once. The copy keeps no connection to Overleaf.
- A git-bridge clone keeps a git connection, so you can pull and push later. Overleaf sells the bridge with its paid plans.

Because both paths create the project inside your projects root, set one under **Settings → Projects & files** first. See [Settings reference](/reference/settings/).

Where a step happens in Overleaf, the labels belong to Overleaf and can change.

## Known limitations

- A zip holds your project source only. Overleaf-side history, comments, and track changes stay on Overleaf.
- Typeward picks the main file from the top level of the zip or the repository: `main.tex`, else the first top-level `.tex`, else the first top-level `.typ`. Subfolders are never searched.
- A zip may hold at most 5,000 entries and expand to at most 500 MB.
- Typeward rejects symlink entries and any entry whose path would escape the destination folder.
- The destination folder must not already exist, so the same zip never imports twice under the same name.
- The git bridge belongs to Overleaf's paid plans, and Overleaf decides who can use it. Typeward adds no requirement of its own.
- Pulls from Overleaf are fast-forward only. When both sides have moved on, the pull fails and the merge needs an outside git client.

## Import a zip export

Overleaf's own download menu produces the zip, and Typeward's **New project** dialog reads it.

1. In Overleaf, open the project you want to move.
2. In the Overleaf project, select **Menu → Download → Source**. Overleaf saves a zip of the full project source: your `.tex` files, bibliography, and figures.
3. In Typeward's projects library, select **New project**.
4. In the **New project** dialog, select **Overleaf zip** under **Or start from:**.
5. In the file dialog titled **Pick an Overleaf-exported .zip**, select the zip you downloaded. Typeward extracts it into a new folder under your projects root and opens the project.

The project takes its name from the zip file, minus the `.zip` extension. The folder it lands in under your projects root gets a sanitized form of that name, with every character outside letters, digits, hyphens, and underscores turned into a hyphen. Nothing prompts you for a name, so rename the zip first when the name matters.

:::caution[Import folder does not read zips]
The **Import folder** button in the projects library adopts a folder that already sits inside your projects root. The Overleaf zip path lives in the **New project** dialog.
:::

## Clone the Overleaf git bridge

Overleaf exposes a project as a git repository through its git bridge, and Typeward clones that repository like any other. Cloning needs no git installation and nothing on your `PATH`, because git is built into Typeward through libgit2. Only `https://` remotes work, which is the form the bridge hands you.

Typeward stores no Overleaf token and offers no place to type one, so choose how the clone authenticates before you start:

- Embed the token in the URL. Paste `https://git:TOKEN@git.overleaf.com/<projectId>`, where the username is literally `git`.
- Let your git credential helper hold it. Store a credential for `git.overleaf.com` in the helper your git config names, such as Git Credential Manager on Windows or `osxkeychain` on macOS, then paste the plain URL.

1. In Overleaf, select **Menu → Git** to get the project's clone URL, which looks like `https://git.overleaf.com/<projectId>`.
2. In your Overleaf account settings, create a git token unless you already hold one.
3. In Typeward's projects library, select **New project**.
4. In the **New project** dialog, select **Clone repository** under **Or start from:**.
5. In the **URL** field, paste the clone URL in the authenticated form you chose.
6. Confirm the **Project name** that Typeward derives from the URL.
7. Select **Clone**. The clone lands in a new folder under your projects root.

The project appears in [the projects library](/projects/library/) without opening by itself, so open it from there. When the repository holds no top-level `.tex` or `.typ`, the clone still succeeds and Typeward reports:

```
Cloned to <path>, but no LaTeX/Typst entry was found. Add a main.tex/main.typ, then open the folder.
```

## Keep the project in sync with Overleaf

A bridge clone is an ordinary git repository, so the project is under git the moment the clone finishes. It keeps exactly one tie to Overleaf: the `origin` remote pointing at `git.overleaf.com`. Typeward's **SCM** sidebar tab commits your changes, pushes them to Overleaf, and pulls edits made on the Overleaf side. Pulls are fast-forward only, so a history that moved on both sides needs an outside git client for the merge. See [Git in Typeward](/projects/git/).

A zip import keeps no tie of any kind. Any git client can drop the `origin` remote when you stop syncing, and any git client can work on the folder alongside Typeward.

## Check that it worked

A zip import opens the project in the editor as soon as it finishes, and a clone waits in the projects library until you open it. Either way, compile the project once: a PDF in the preview pane means the sources arrived intact. Overleaf compiles against a full TeX Live, so a project that compiled there can call packages your machine does not have.

## If it does not work

Match what Typeward reports against this table.

| What you see | What to do |
| --- | --- |
| `Set a projects root in Settings first.` | Set a projects root under **Settings → Projects & files**, then import again |
| `Paste a repository URL first.` while the **URL** field holds a URL | Set a projects root, which is the missing piece, then clone again |
| `no .tex or .typ file found in the zip (is this an Overleaf export?)` | Check whether the sources sit one folder deep inside the zip rather than at the top level |
| `destination already exists: <path>` | Rename the zip or remove that folder, then import again |
| `zip archive exceeds the import limit (decompression bomb guard)` | Extract the zip into your projects root yourself, then adopt the folder with **Import folder** |
| The project opens on the wrong file | Pick the right one under **Main file** in the project settings dialog |
| The compile stops on a package your machine does not have | Compile with a full TeX distribution, or with the bundled Tectonic engine, which downloads packages on the first compile |

## Next steps

- [Choosing a compile engine](/getting-started/compile-engines/): **System TeX** against the bundled Tectonic engine, and which one suits an imported project.
- [Git in Typeward](/projects/git/): staging, committing, and the fast-forward pull rule in full.
- [Exporting your work](/projects/exports/): PDF, source zip, and the other targets for handing the project on.
