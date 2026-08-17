---
title: Privacy and network behavior
description: "No telemetry, no crash reporting, no account, and no Typeward server: this page lists every host the app can reach and what starts each request."
---

This page lists every network request Typeward can make, what starts it, and what it sends.

A fresh install, opened on a machine with a live network connection, makes no network requests at all. Typeward has no account system, no backend, and no server of its own to talk to. Your files never go to Typeward, because there is no Typeward server to receive them.

Typeward has none of the following.

| What is absent | What that means |
| --- | --- |
| Telemetry and analytics | There is no usage tracking, no event pipeline, no install identifier, and no third-party SDK for any of it. |
| Crash reporting | The crash-submission path, the panic log, and their **Settings** section were removed on 2026-08-13. When something fails, Typeward writes a line to the developer console and shows a toast. Nothing is written to disk, and nothing is transmitted. |
| An account | There is nothing to sign in to. See [Open source and licensing](/reference/open-source/). |
| Update pings | The auto-updater is dormant in every shipped build, so no update request is ever made. See [Update checks](#update-checks). |
| A feedback endpoint | There is no in-app feedback form and no bug-report submitter. You file an issue yourself at [the Typeward app repository](https://github.com/typeward/app). |

## Outbound requests

Every feature in this table is off, or unconfigured, until you set it up. Your files reach a third party only through a service you connected yourself with your own credentials: your WebDAV server, your git remote, or your AI provider.

| Feature | Host | When it happens | What is sent |
| --- | --- | --- | --- |
| Zotero, local | `127.0.0.1:23119` on your own machine | Off until you enable **Zotero (local)**, apart from the reachability probe: opening **Settings → Integrations → References**, or selecting **Re-check** there, sends a request to that port whether or not the integration is enabled. Once enabled, also whenever you browse the **Refs** tab or refresh the reference library. | Requests to the Zotero desktop app for your libraries, collections, and their BibTeX. Loopback only, and no credential is ever attached to a loopback host. |
| Zotero Web API | `api.zotero.org` | Off until you paste a read-only API key and your numeric user id. Then on browsing and library refreshes. | Your Zotero API key and the library or collection being read |
| Mendeley | `api.mendeley.com`, including its OAuth endpoints | Off until you save your app secret and sign in. Then on browsing and library refreshes. | Your OAuth token and the folder and document ids being read. Sign-in, and only sign-in, also sends the client secret to the token endpoint. |
| DOI lookup | `doi.org`, then whichever registration agency it redirects to (`api.crossref.org`, `data.crossref.org`, `data.crosscite.org`, `data.datacite.org`) | Only when you add a citation from a DOI | The identifier you typed. These hosts are metadata-only: no credential may bind to them, and raw authorization headers are rejected. |
| arXiv lookup | `export.arxiv.org` | Only when you add an older arXiv id that has no minted DOI | The arXiv id |
| AI assistant, cloud provider | `api.anthropic.com`, `api.openai.com`, `generativelanguage.googleapis.com` | Off by default. The assistant must be on, that provider active, and your own key stored. Fires when you send a message, invoke an editor action, open the chat pane (the model list), or save a key (a verification probe). | The prompt described in [What an AI request contains](#what-an-ai-request-contains), plus your API key, which is attached inside Rust and pinned to that provider's host |
| AI assistant, local Ollama | Loopback port `11434`, or the loopback port you set | Off by default. The same triggers as a cloud provider. | The same prompt content, over loopback, to the daemon on your machine. No key, no account. |
| Cloud sync | The WebDAV server you connected, and only that one | Off until you add a server under **Settings → Integrations → Cloud storage**. Then, while a cloud-backed project is open, a pull runs when it opens and every 60 seconds after. A push follows about 1.5 seconds after a save. | Project file contents in both directions, plus HTTP Basic credentials for that server. Never the project's `.typeward` folder, and never your settings. |
| Git | The HTTPS remote you configured (`github.com`, `git.overleaf.com`, GitLab, a self-hosted host) | Only when you clone, fetch, pull, or push | Repository contents, and whatever credential your own git credential helper hands over for that host. Typeward stores no git credentials. |
| Tectonic package fetches | Tectonic's own package bundle | Only when you compile with the Tectonic engine and it needs a package it has not cached | A package request from the Tectonic subprocess. Nothing about your files. |
| Update check | `github.com` | Never in any shipped build | Nothing. The updater is dormant. |

Each of those features has a page that covers its setup and behavior in full: [How references work](/references/how-references-work/), [Connecting Zotero, Mendeley, and DOI lookup](/references/connecting-reference-managers/), [Cloud sync with WebDAV](/projects/cloud-sync/), and [Git in Typeward](/projects/git/).

An Overleaf zip import makes no network requests at all. Cloning the Overleaf git bridge is an ordinary git clone of `https://git.overleaf.com/<projectId>`, so the Git row covers it. See [Importing from Overleaf](/getting-started/import-from-overleaf/).

Typeward can also hand an address to your default browser, which is a handoff to another application rather than a request Typeward makes. The set of addresses is fixed: the Mendeley authorization page, `zotero.org`, `tug.org`, `typst.app/download`, and the API key pages at `console.anthropic.com`, `platform.openai.com`, and `aistudio.google.com`.

## Update checks

No shipped build checks for updates. The updater has no signing key configured, so the startup check does nothing. In **Settings → About → Check for updates**, selecting **Check now** shows a toast. It reads **Updates aren't configured yet**, with the body **This build predates automatic updates. Grab new versions from the Typeward download page.** No request leaves the machine when you select it.

The **Check automatically** toggle in the same section is on by default and controls nothing. If update signing is configured, the check becomes a plain HTTPS GET of a release manifest on GitHub, about ten seconds after launch, carrying no identifier of any kind. Typeward will ask before downloading or installing anything. New versions come from [the Typeward releases page](https://github.com/typeward/releases/releases). See [How updates work](/reference/updates/).

## What an AI request contains

The assistant is off until you turn it on. While it is off, no AI surface renders, no provider activates, and no AI code path runs. The card in **Settings** states it plainly. **Turn it off to hide every AI surface: no provider runs, nothing leaves the machine.**

With the assistant on and a provider active, Typeward enumerates and caps everything that leaves the machine. Pressing **Stop** drops the in-flight request in Rust rather than letting it finish quietly in the background.

:::note[The cloud provider rows are not in Settings]
**Settings** surfaces only the **Ollama (local)** provider row. A key stored by an earlier build keeps working.
:::

### Chat messages

A chat message sends the current conversation: your turns, the assistant's turns, and any images still live in memory. No text from your files, no file path, and no project name is attached to a plain chat message.

### Editor actions

The editor actions are **Rewrite**, **Fix grammar & style**, **Make concise**, **Expand**, **Continue writing**, **Explain this**, and **Ask about selection**. Each one sends a capped slice of the active file.

| What is sent | Cap |
| --- | --- |
| The selected text | 16 KB |
| Up to 40 lines of surrounding text on each side | 3 KB per side |
| The preamble of the file | 4 KB |
| Compile diagnostics that overlap the selection, plus a log excerpt, sent by **Explain this** only | 4 KB together |

Every editor action also carries a language label. Nothing else about the project is included: not paths, not file names, not sibling files.

### Images

You can attach at most 4 images per message, 5 MB each and 15 MB per request. Typeward downscales an image when its long edge exceeds 1568 px.

### Model lists

Typeward fetches the model list live from the provider when the chat pane opens with a provider active, and once more when you save a key so it can be verified. These requests carry your key and nothing about your files.

### Stored conversations

Typeward saves conversations per project as JSONL under `<project>/.typeward/ai/conversations/` and keeps the newest 30. Image bytes never reach that file, so a reloaded conversation shows a placeholder instead of the picture. Typeward excludes the whole `.typeward` folder from git commits, from cloud sync, and from project exports, so saved conversations never travel on their own. Full detail is on [AI assistant](/ai/overview/).

## Package downloads by your TeX and Typst tools

The engines you install are their own programs with their own network behavior, which Typeward neither drives nor bounds.

- MiKTeX can install packages on the fly during a compile, depending on how you configured it.
- The `typst` command-line tool downloads `@preview` packages the first time a file imports them.
- Tectonic downloads from its package bundle on demand and caches the result.

To change what MiKTeX or the `typst` command-line tool fetches, configure those tools directly.

## Compiles with no network access

A compile that uses a TeX distribution already on your machine (TeX Live, MacTeX, MiKTeX) runs local binaries and needs no connection, apart from whatever MiKTeX does on its own.

A Tectonic compile can reach the network unless `compile.strictOffline` is `true` in `settings.json` inside [the app-data folder](/reference/data-locations/). The setting defaults to `false` and has no control in **Settings**. It survives settings changes made in the app, and it passes `--only-cached` to Tectonic, so the compile fails rather than fetching anything. See [Per-project build configuration](/compiling/build-configuration/) for the file, and [Choosing a compile engine](/getting-started/compile-engines/) for the engines.

## What never leaves your machine

None of the following has a network path, connected or not, configured or not.

- Editing, [visual editing](/editor/visual-editing/), and [autocomplete](/editor/autocomplete-and-snippets/).
- [Compiling LaTeX](/compiling/compiling-latex/) with a TeX distribution on your machine, and Typst compiles through the `typst` command-line tool.
- [PDF preview](/preview/pdf-preview/), SyncTeX jumps, and [Markdown preview](/preview/markdown-preview/).
- [Grammar and spell checking](/editor/grammar-checking/), which runs Harper in process on your machine and is off until you turn it on.
- The `texlab` and `tinymist` language servers, which are local processes started from your `PATH` and speak to Typeward over pipes.
- [Version history](/projects/version-history/), [autosave and crash recovery](/projects/autosave-recovery/), [project templates](/projects/templates/), and [themes](/editor/themes/).
- Your settings. `settings.json` is a local file, and nothing about it is uploaded or synchronized.

## Limits on outbound requests

### The interface window

The window Typeward renders its interface in cannot reach the internet. Its content security policy declares `connect-src 'self' ipc: http://ipc.localhost` and nothing else, so the interface has no external origin it is permitted to contact. Every outbound request comes from the Rust side of the app, or from a subprocess such as a compiler.

### Host allowlist

The requests Typeward itself makes go through one HTTP client in Rust with a fixed host allowlist. Typeward checks the initial URL and re-checks every redirect hop, up to ten hops. The list is exactly `api.zotero.org`, `doi.org`, `api.crossref.org`, `data.crossref.org`, `data.crosscite.org`, `data.datacite.org`, `export.arxiv.org`, `api.mendeley.com`, `generativelanguage.googleapis.com`, `api.openai.com`, and `api.anthropic.com`. Any other host is refused with `blocked outbound URL`.

### Loopback traffic

Plain HTTP is permitted to loopback addresses only, and only for two pinned integrations.

- Zotero on port `23119`, under the paths `/better-bibtex*` and `/api/*`.
- Ollama on port `11434` or the loopback port you configured, under `/api/*`.

No other loopback port or path is reachable, and no credential is ever attached to a loopback host.

### Cloud sync screening

Cloud sync is the deliberate exception to the allowlist, because the server is yours and cannot be known in advance. It gets its own screening instead.

- HTTPS is required, even on your own LAN. A plain `http://` server URL is rejected.
- Typeward screens every address the host resolves to before it connects, then pins the connection to the vetted address.
- Loopback, link-local, and cloud-metadata addresses are always blocked.
- Private ranges stay blocked for an account until you select **Allow a private / LAN server (10.x, 172.16.x, 192.168.x). Loopback and cloud-metadata addresses stay blocked.**
- Redirects are followed only to the same host over HTTPS, five hops at most.
- Only hosts matching an account you enrolled and confirmed are accepted at all.

### Git remotes

Git remotes are HTTPS only. Typeward rejects `file://`, `ssh://`, and `user@host:path` remotes. Credentials come from your own git credential helper, are only ever offered to the host of the validated remote, and stop after three attempts.

### Headers and response caps

Every request Typeward makes identifies itself as `Typeward/<version>` and carries nothing else about you. Typeward reads response bodies through a capped stream, 32 MiB for text and 128 MiB for binary. It sanitizes assistant replies before rendering and strips `<a>` and `<img>` tags, so model output can neither navigate anywhere nor load a remote image.

## Credentials

Secrets for the integrations Typeward can reach live in your operating system keyring: Windows Credential Manager, the macOS Keychain, or the Secret Service on Linux and BSD. They never appear in `settings.json`.

The interface cannot read them. It can only write a credential, check that one exists, and delete it. Every read happens in Rust. Rust attaches the credential to the request and binds it to the expected host, so a stored key can never reach a different service.

Git is the exception in the other direction. Typeward stores no git credentials at all and defers entirely to your credential helper.

Removing a credential means disconnecting that integration in **Settings**, which deletes its keyring entry. [Data locations](/reference/data-locations/) lists every entry by name, along with everything Typeward writes to disk.

## See also

- [Data locations, credentials, and uninstall](/reference/data-locations/)
- [Open source and licensing](/reference/open-source/)
- [How updates work](/reference/updates/)
- [AI assistant](/ai/overview/)
- [Cloud sync with WebDAV](/projects/cloud-sync/)
- [Git in Typeward](/projects/git/)
