---
title: Git in Typeward
description: Stage, commit, clone, fetch, push, and fast-forward pull over HTTPS using the git identity and credential helper you already have.
---

This guide shows you how to clone a repository, stage and commit your work, and push it, using Typeward's built-in git. Typeward links libgit2 directly instead of calling the `git` command, so all of it works on a machine with no git installation. For the local snapshots Typeward keeps on its own, see [Version history](/projects/version-history/).

## Known limitations

Typeward ships a small subset of git, and these limits shape every workflow in this guide.

- Typeward pulls fast-forward only. Diverged histories fail with an error, and the app offers no merge, no rebase, and no conflict resolution.
- Typeward creates no branch and switches to none. The branch name is display only.
- **Fetch**, **Pull**, and **Push** act on the `origin` remote and the current branch, and nothing else.
- Only `https://` remotes work. Typeward rejects `ssh://`, scp-style `git@host:path`, and `file://` remotes.
- Typeward shows no commit log, no per-file diff, and no blame.
- Typeward handles no tags, stashes, submodules, rebases, or reverts.
- No keyboard shortcut and no command palette entry runs a git action.

None of this locks you in. A Typeward project is a plain folder, and the repository inside it is an ordinary git repository. Any git client, graphical or command line, can work in that folder while Typeward is open, and the panel picks up the result within a couple of seconds. See [Files and folders](/projects/files-and-folders/).

## Before you start

Git ships in the desktop app. Typeward compiles the git commands out of mobile builds, and no mobile build ships.

Your own git setup is the configuration. Typeward has no git settings, no sign-in, and no credential storage of its own, so it reads the identity and the credential helper you already use on the command line. Set both up before your first commit and your first push.

## Set your git identity

Typeward takes the commit author from `user.name` and `user.email` in your gitconfig, exactly as the `git` command resolves them. Typeward never supplies a fallback identity, so a machine with no configured identity cannot commit. The commit fails with:

```
no git identity configured; set user.name and user.email in your git config
```

Set both values once per machine, from a terminal:

```sh
git config --global user.name "Ada Lovelace"
git config --global user.email "ada@example.com"
```

Your Typeward profile name and email are a separate thing. They pre-fill authorship in new projects and never reach a commit.

## Authenticate with a remote

Typeward reaches a remote over HTTPS only. The app contains no SSH transport, so Typeward rejects `git@host:path` and `ssh://` remotes before making any connection, and rejects `file://` paths as well.

Credentials come from your own git credential helper. When a remote asks for authentication, Typeward resolves whatever `credential.helper` your gitconfig names and hands the result to libgit2. Typeward stores nothing of its own: there is no git entry in the OS keyring, and no place in the app to type a password.

The helper behaves differently on each platform.

| Platform | Usual helper | What to expect |
| --- | --- | --- |
| Windows | Git Credential Manager, installed and configured by Git for Windows | The helper can prompt during a Typeward fetch, pull, or push, including a browser sign-in |
| macOS | `osxkeychain` | The helper returns credentials that are already stored, and never prompts. Authenticate once from the command line, or embed a token in the URL |
| Linux | Often none configured on a fresh install | Configure a helper, such as a libsecret-backed one, or embed a token in the URL |

The fallback that always works is a token in the remote URL, for example `https://git:TOKEN@git.overleaf.com/<projectId>` for the Overleaf git bridge.

:::danger
A token embedded in a remote URL then lives in `.git/config` inside that repository, which is worth knowing before you share or sync that folder.
:::

Three guards sit around credential handling.

| Guard | What it does |
| --- | --- |
| Helper lookup | Typeward reads only the global, XDG, and system gitconfig when it resolves `credential.helper`. Typeward never consults a repository's own `.git/config` for this, because helper values are executed as commands and a cloned repository is content you did not write |
| Host binding | Typeward sends credentials only to the host of the remote URL it validated. A repository configured to contact a different host stops with `refusing to send credentials for {host} to a different host ({url})` |
| Retry cap | After three rejected attempts the operation gives up rather than replaying the same rejected credentials forever |

Git remotes are the one outbound destination Typeward cannot list in advance, because you choose the host. See [Privacy and network behavior](/reference/privacy-and-network/).

## Clone a repository

Typeward clones an HTTPS repository into a new folder under your projects root. Start from the projects screen.

1. Select **New project**.
2. In the **Or start from:** row, next to **Template** and **Overleaf zip**, select **Clone repository**. The dialog opens with the description `Paste an HTTPS git URL: GitHub, Overleaf git-bridge, GitLab, any host.`
3. In **URL**, paste the HTTPS address of the repository.
4. Optional: In **Project name**, type a name. Left empty, the name comes from the last path segment of the URL with any `.git` removed.
5. Select **Clone**. The button reads `Cloning…` while the clone runs.

The dialog's helper text spells out authentication:

```
Private repos authenticate through your git credential helper (Git Credential Manager, osxkeychain, …), or embed a token in the URL, e.g. Overleaf's git bridge: https://git:TOKEN@git.overleaf.com/…
```

Typeward names the new folder from the project name, replacing anything outside letters, digits, `_`, and `-` with `-`. That folder must not already exist.

After the clone, Typeward looks for a main file: `main.tex` at the top level, otherwise the first top-level `.tex`, otherwise the first top-level `.typ`. Typeward never searches subdirectories. That file turns the folder into a project, which then appears in your [projects library](/projects/library/). Typeward never opens the clone automatically.

When the repository holds no top-level `.tex` or `.typ`, the dialog says so and leaves the files on disk:

```
Cloned to {path}, but no LaTeX/Typst entry was found. Add a main.tex/main.typ, then open the folder.
```

Add a `main.tex` or a `main.typ` at the top level of the cloned folder, then import the folder again. When a project opens with the wrong main file, change it under **Main file** in the project settings dialog rather than cloning again.

Overleaf's premium git bridge is an ordinary HTTPS remote, so it goes through this same dialog. See [Importing from Overleaf](/getting-started/import-from-overleaf/).

## Put an existing project under git

1. In a terminal, run `git init` in the project folder.
2. In Typeward, close the project and open it again.

The **SCM** tab appears in the sidebar on that next open.

The panel carries its own **git init** button, under the message `This project isn't a git repo yet.`, and it reads `Initializing…` while it runs. You rarely see that button: the tab hosting it exists only once `.git` is present, so the button is reachable only when `.git` exists and the repository cannot be opened.

Whichever way the repository is created, Typeward writes the `.typeward/` exclusion into `.git/info/exclude` the first time it touches that repository, so a fresh `git status` never lists that folder.

## Open the SCM tab

In the sidebar, select **SCM**. The tab appears only when the open project contains a `.git` entry, so a project that is not a repository never shows it. Typeward runs that check when the project opens, which is why a `git init` you run in a terminal needs a project reopen before the tab appears.

The top bar carries the second git surface: a chip showing the current branch name next to the sync badge. An up chevron and a count mean the branch is ahead of its upstream, and a down chevron and a count mean it is behind. The chip's tooltip reads `Tracking {upstream} · ahead {n} · behind {n}`, or `No upstream configured` when the branch tracks nothing. The chip disappears on projects that are not repositories.

Both the chip and the branch line in the SCM panel are display only.

## Stage and commit a change

The SCM panel lists changed files in two sections, **Staged** and **Changes**, each with a count. Typeward has no stage-all button, so staging is per file.

1. In **Changes**, move the pointer over a file and select the button that appears on its row. The file moves to **Staged**.
2. Repeat for every file that belongs in the commit.
3. In **Commit message**, type a message.
4. Select **Commit**. The button reads `Committing…` while the commit runs.

**Commit** stays disabled until at least one file is staged and the box holds a message. To take a file back out of the commit, select the same button on its row under **Staged**.

Each row carries a one-letter badge for what happened to the file.

| Badge | Meaning |
| --- | --- |
| `A` | Added |
| `M` | Modified |
| `D` | Deleted |
| `R` | Renamed |
| `T` | Type changed |
| `U` | Untracked (tooltip `Untracked`) |

The panel re-reads status every two seconds while it is visible, so a file you edit, or a command you run in a terminal, shows up on its own. An error raised by an action stays on screen until your next action, so a background refresh never clears an authentication message.

Typeward's own `.typeward/` folder never appears in this list. On every repository open, init, and clone, Typeward adds `.typeward/` to `<repo>/.git/info/exclude`, which is the repository's private exclude file, and never to your tracked `.gitignore`. That keeps snapshots, build output, review comments, and project metadata out of your commits. See [Data locations](/reference/data-locations/).

## Fetch, pull, and push

Three icon buttons sit in the panel header: **Fetch**, **Pull**, and **Push**. All three act on the `origin` remote and the current branch, and nothing else. A repository whose remote carries a name other than `origin` needs a git client outside Typeward for these operations.

**Push** sends the current branch to a branch of the same name on `origin`. It sets up no upstream tracking, so on a repository you initialized yourself the ahead and behind counts stay empty until the branch tracks a remote branch. Either `git push -u origin <branch>` or a clone arranges that tracking.

**Pull** is a fetch followed by a fast-forward, and only a fast-forward. Two things stop it:

- **A dirty worktree.** Typeward tests the worktree only once the fetch has brought something to fast-forward. At that point it refuses to move the branch while the project holds uncommitted changes, and reports `working tree has uncommitted changes; commit or stash before pulling`. Commit or stash, then pull again. A pull that finds nothing new upstream succeeds whatever the worktree holds. The project's `.typeward` folder is excluded from this check, so it never blocks a pull on its own.
- **A diverged branch.** When your branch and the remote have both moved, the pull stops with `pull requires a merge; only fast-forward is supported in Phase 3`. The wording names an internal milestone, and the meaning is that a merge is required. Merge with a git client outside Typeward, then come back.

## Check that it worked

A successful commit empties the **Staged** section. When the project has nothing left to show, the panel reads `Working tree clean.`

The branch chip is the slower signal. It refreshes when the window regains focus and on a background poll roughly every 30 seconds, so give it a moment after a push. For an independent check, run `git status` in the project folder from a terminal.

## If it does not work

Every message in this table comes from Typeward's git, and the last column is the shortest way out.

| Message | Cause | What to do |
| --- | --- | --- |
| `no git identity configured; set user.name and user.email in your git config` | No `user.name` or `user.email` in your gitconfig | Set both with `git config --global`, then commit again |
| `only HTTPS git remotes are supported` | The remote is `ssh://`, `file://`, or another non-HTTPS scheme | Use the repository's HTTPS URL |
| `remote URL could not be parsed; use an https:// URL (scp-style user@host:path remotes are not supported)` | The URL is an scp-style remote such as `git@github.com:you/repo.git`, or is malformed | Rewrite it as `https://github.com/you/repo.git` |
| `no credentials for {host}; configure a git credential helper (e.g. Git Credential Manager) or embed a token in the remote URL` | Your gitconfig names no credential helper, or the helper holds nothing for that host | Configure a helper, authenticate once from the command line, or put a token in the URL |
| `authentication failed for {host}; check the credentials in your git credential helper` | Three attempts were rejected by the host | Update or delete the stored credential for that host, then retry. Expired tokens are the usual cause |
| `refusing to send credentials for {host} to a different host ({url})` | The repository is configured to contact a different host than the one that was validated, typically through a `pushurl` | Inspect `.git/config` before continuing. Treat it as suspicious in a repository you did not create |
| `working tree has uncommitted changes; commit or stash before pulling` | Pull needs a clean worktree | Commit or stash your changes first |
| `pull requires a merge; only fast-forward is supported in Phase 3` | Local and remote have diverged | Merge with a git client outside Typeward, then continue in the app |
| `destination already exists: {path}` | A folder of that name is already under your projects root | Pick a different project name, or remove the existing folder |
| `Cloned to {path}, but no LaTeX/Typst entry was found. Add a main.tex/main.typ, then open the folder.` | The clone succeeded but has no top-level `.tex` or `.typ` | Add one at the top level, then import the folder |
| `Paste a repository URL first.` | The URL field is empty, or no projects root is set | Fill in the URL. If it is filled, set a projects root in **Settings** |
| `Could not derive a project name from the URL. Fill in Name.` | The URL has no usable last path segment | Type a name into the **Project name** field |

## See also

- [Importing from Overleaf](/getting-started/import-from-overleaf/), for the git bridge and the zip route.
- [Version history](/projects/version-history/), for the local snapshots Typeward keeps outside git.
- [Troubleshooting](/troubleshooting/troubleshooting/), for compile and engine failures beyond git.
