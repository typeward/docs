---
title: Data locations, credentials, and uninstall
description: Every file and keyring entry Typeward writes, where each one lives on Windows, macOS, and Linux, and how to remove all of it.
---

This page lists every file, folder, and keyring entry Typeward writes on your machine, and what removing each one costs you. See [Privacy and network behavior](/reference/privacy-and-network/) for what does and does not leave the machine. Typeward writes to five places, all of them on your own disk.

| Store | Where it lives | What it holds |
| --- | --- | --- |
| Your projects | One folder per project under your projects root | Your files, the compile output beside them, and one `.typeward` folder per project |
| App data folder | A `com.typeward.app` folder in the platform app data location | Settings, version history, themes, custom templates, grammar dictionary, profile picture, shell-escape approvals |
| Window state file | `.window-state.json` in the platform config location | Window size, position, and maximized state |
| Webview storage | The platform webview's own profile storage | Theme, accent color, and the last reference manager and library per project |
| Credentials | Your operating system's keyring, under service names starting with `typeward.` | One entry per connected integration |

There is no account of any kind, no Typeward server, and no copy of your work held anywhere you cannot reach. There is no telemetry file, no crash log, no analytics database, and no local record of an account, because none of those features exist.

## Your projects

Projects are plain folders. Your projects root is `%USERPROFILE%\Documents\Typeward` on Windows and `~/Documents/Typeward` on macOS and Linux.

Typeward records that location as `projectsRoot` in `settings.json`. The **Projects folder** row of the **Storage** card, in **Settings → Projects & files**, carries a **Change…** button that moves it. A projects root has to sit inside your `Documents` folder. Typeward rejects anything outside it on save, and falls back to the default when a stored root no longer validates. A new root changes where new projects are created, and existing projects stay where they are.

Inside a project you keep your own files (`.tex`, `.typ`, `.bib`, figures) alongside everything a compile produces. Compiled output stays next to your sources. Typeward writes `main.pdf`, `main.aux`, `main.log`, and the other auxiliary files into the folder that holds `main.tex`, exactly as `latexmk` would.

### The project's .typeward folder

Typeward adds one `.typeward` folder to every project, holding its own bookkeeping for that project.

| Path | Contents |
| --- | --- |
| `.typeward/project.json` | Project metadata: name, root path and root file, format, build overrides, tags, deadline, space, archived and trashed state, last-opened time, connected integrations, and a schema version |
| `.typeward/snapshots/` | [Crash-recovery snapshots](/projects/autosave-recovery/) of unsaved edits, one `<file>.snap` per file |
| `.typeward/reviews/comments.json` | [Comment threads](/editor/review-comments/) |
| `.typeward/build/` | Staged [export artifacts](/projects/exports/) (source bundle, annotated PDF, Word and HTML output) before they are copied to your chosen destination |
| `.typeward/citations/library.bib` | The aggregated [reference library](/references/how-references-work/), rewritten on every refresh |
| `.typeward/citations/local.bib` | Entries added by DOI and arXiv lookup, which survive provider changes |
| `.typeward/ai/conversations/` | [AI assistant](/ai/overview/) chat history, one JSONL file per conversation, newest 30 kept per project |
| `.typeward/integrations/` | Sync bookkeeping for [cloud-backed projects](/projects/cloud-sync/) only: the poll cursor, `idmap.json`, and `sync-state.json` |

The `.typeward` folder never travels with a project. Typeward excludes it from git through `.git/info/exclude` rather than your own `.gitignore`, and skips it in cloud sync, in zip exports, and in custom templates.

Deleting it loses that bookkeeping, not your documents. A fresh clone or export arrives with no comments, no history of AI chats, and no `library.bib` until you refresh references on the new machine.

### Cloud-backed projects

A project created against a WebDAV server does not sit under the projects root directly. Its local copy lives in a cache folder:

```
<projectsRoot>/.remote-cache/webdav/<projectId>/
```

That cache is a normal Typeward project, with the same `.typeward` folder, the same file watcher, and the same compile pipeline. That is why a cloud-backed project keeps working offline.

When sync cannot reconcile two edits, Typeward keeps both. It writes the losing copy beside the original as `<name>.conflict-<timestamp>.<ext>`, for example `main.conflict-2026-05-22T18-30-00-000Z.tex`. The same kind of copy appears when a file changed on disk underneath an open buffer. See [Cloud sync with WebDAV](/projects/cloud-sync/).

## App data folder

Everything that belongs to the app rather than to one project lives in a single folder, named after the app identifier `com.typeward.app`.

| Operating system | App data folder |
| --- | --- |
| Windows | `%APPDATA%\com.typeward.app` |
| macOS | `~/Library/Application Support/com.typeward.app` |
| Linux | `~/.local/share/com.typeward.app`, or `$XDG_DATA_HOME/com.typeward.app` |

That folder holds one file or subfolder per kind of app data.

| File or folder | Contents |
| --- | --- |
| `settings.json` | Every setting, including your projects root and the non-secret half of each integration (server URL, username, user id). **Never any secret** |
| `settings.json.corrupt` | Written only when `settings.json` cannot be parsed. The original bytes are renamed aside first, and if that rename fails the app refuses to reset rather than overwrite your real settings |
| `profile/` | The copy of your profile picture, one file at most, `png`, `jpg`, `jpeg`, `webp`, or `gif`, up to 8 MB |
| `themes/` | Your [custom theme](/editor/themes/) JSON files |
| `templates/custom/` | [Custom templates](/projects/templates/) you saved from your own projects, one folder per template |
| `grammar/dictionary.txt` | Words you added to the [grammar checker](/editor/grammar-checking/) personal dictionary |
| `grammar/ignored.json` | Grammar suggestions you dismissed |
| `history/` | [Version history](/projects/version-history/): one folder per project, holding gzip-compressed blobs named by content hash plus one `index.json` |
| `shell-escape-trust.json` | Per-machine [shell-escape approvals](/compiling/build-configuration/), granted or denied, keyed by project path and never stored in the project itself |

Version history lives here rather than in the project's `.typeward` folder on purpose. It has to survive the case it exists for, which is a project folder that was deleted or overwritten. Keeping it outside the project also keeps it out of git status, cloud sync, and exports.

## Window state file

Typeward saves the window size, position, and maximized state to `.window-state.json` in the app config folder.

| Operating system | Config folder |
| --- | --- |
| Windows | `%APPDATA%\com.typeward.app` |
| macOS | `~/Library/Application Support/com.typeward.app` |
| Linux | `~/.config/com.typeward.app` |

On Windows and macOS that is the same folder as the app data. On Linux the two differ, so a complete cleanup there removes both `~/.local/share/com.typeward.app` and `~/.config/com.typeward.app`.

## Webview storage

The webview keeps a small amount of local storage of its own. It holds your theme and accent color, so the window paints in the right colors before settings load. It also holds which reference manager and library each project last had open.

That storage lives in the platform webview's own profile, which Typeward does not configure and which differs by operating system. **Reset local app data** clears it, along with resetting settings.

## Credentials

Secrets never touch `settings.json`. Every credential goes into your operating system's keyring, under a service name starting with `typeward.`.

| Service | Account | What it holds |
| --- | --- | --- |
| `typeward.zotero-web` | Your numeric Zotero user id | The Zotero Web API key |
| `typeward.mendeley` | Your Mendeley profile id | The OAuth token bundle |
| `typeward.mendeley` | `app-secret` | The client secret of the Mendeley app you registered |
| `typeward.webdav` | `<username>@<host>` | The WebDAV app password |
| `typeward.anthropic` | `default` | Your Claude API key |
| `typeward.openai` | `default` | Your ChatGPT API key |
| `typeward.gemini` | `default` | Your Gemini API key |

Typeward can write a secret, ask whether one exists, and delete it. It can never read one back. The Rust backend resolves each credential and attaches it to the request there, bound to the host it belongs to.

Four details shape what ends up in the keyring:

- Typeward replaces any character outside `A-Za-z0-9._@-` in a WebDAV account name with `_`, so a stored entry may not read exactly like the username you typed.
- **Settings → Integrations → AI providers** offers one row, **Ollama (local)**, which talks to a daemon on your own machine and stores no credential. Builds that expose the Claude, ChatGPT, and Gemini rows write the three cloud entries.
- No git credentials live here. Typeward uses your own git credential helper and your `gitconfig` identity, exactly as the `git` command line does. Any GitHub token left behind by builds from before the account layer was removed is deleted from the keyring at startup. See [Git in Typeward](/projects/git/).
- Windows caps a single credential at 2560 bytes. Typeward never splits a value across records, so the store can refuse an unusually long token.

The keyring is your operating system's own credential store.

| Operating system | Credential store | Where to inspect it |
| --- | --- | --- |
| Windows | Windows Credential Manager | Under Generic Credentials |
| macOS | Keychain | Keychain Access |
| Linux and BSD | Any Secret Service provider, such as `gnome-keyring` or KWallet | Seahorse or KWallet Manager |

Without a Secret Service provider, Linux installs cannot store integration credentials at all. See [Install on Linux](/getting-started/install-linux/). Editing, compiling, preview, templates, and version history never touch the keyring.

### Credential removal

Disconnecting an integration deletes its keyring entry and clears the matching fields in `settings.json`.

| Credential | Where to remove it |
| --- | --- |
| Zotero Web API key | Select **Disconnect** on the **Zotero Web API** row in **Settings → Integrations → References** |
| Mendeley token and client secret | Select **Disconnect** on the **Mendeley** row in **Settings → Integrations → References** |
| WebDAV app password | Select **Disconnect** on the account in **Settings → Integrations → Cloud storage** |
| AI provider key | Remove the stored key in **Settings → Integrations → AI providers**, where only **Ollama (local)** is shown and it stores no key |

To confirm nothing is left, search for `typeward` in the credential store for your operating system and delete what you find.

## Reset local app data

In **Settings → Security → Danger zone**, **Reset local app data** restores default settings and clears local UI state. The confirmation dialog is titled **Reset local app data** and carries the buttons **Reset and reload** and **Cancel**. The app reloads afterwards.

A reset rewrites `settings.json` with the defaults, deletes your stored profile picture, and clears the webview's local storage. It never touches your project files, your version history, your custom themes, your saved templates, your grammar dictionary, your shell-escape approvals, or your keyring entries. To clear anything in that list, remove it by hand.

## Complete uninstall

Uninstalling removes the program and nothing else. No installer on any platform opts into deleting app data, so your settings, history, themes, templates, keyring entries, and every project folder survive the uninstall.

Remove the program the way your operating system removes any app.

| Operating system | How to remove the program |
| --- | --- |
| Windows | **Settings → Apps → Installed apps**, then **Uninstall** on the **Typeward** row |
| macOS | Drag **Typeward** from **Applications** to the Trash |
| Linux | Remove the `.deb` or `.rpm` package with your distribution's package manager, or delete the AppImage file |

On Debian and Ubuntu, `dpkg -l | grep -i typeward` names the installed package, and `sudo apt remove <package>` removes it.

Everything else comes off by hand:

1. Delete the app data folder for your operating system, which removes your settings, version history, themes, custom templates, profile picture, grammar dictionary, and shell-escape approvals.
2. On Linux, delete `~/.config/com.typeward.app` as well, which holds `.window-state.json`. On Windows and macOS that folder is the one you deleted in step 1.
3. Delete any remaining `typeward.` entries from the credential store for your operating system.
4. Delete your project folders yourself, including `.remote-cache` under your projects root, because Typeward never deletes them for you.

Your webview's own storage may leave a small cache behind in a platform-specific location. It holds nothing but the interface state listed under Webview storage.

Nothing else needs cleaning up. No account exists to delete and no server holds a copy. A project you synced to a WebDAV server or pushed to a git remote still exists there until you delete it on that service yourself.

## See also

- [Privacy and network behavior](/reference/privacy-and-network/)
- [Cloud sync with WebDAV](/projects/cloud-sync/)
- [Version history](/projects/version-history/)
- [Install on Linux](/getting-started/install-linux/)
