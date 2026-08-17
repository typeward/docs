---
title: FAQ
description: Short answers on cost, accounts, telemetry, offline use, file locations, Typst, git, updates, and bug reports, each pointing to the page with the detail.
---

This page gives short answers to the questions that come up most often about Typeward, and each answer links to the page that holds the detail. For a failing compile or an error string you can quote, see [Troubleshooting](/troubleshooting/troubleshooting/).

## Is Typeward free?

Yes, and it is open source. Typeward is licensed GPL-3.0-or-later, and the code lives in the [Typeward source repository](https://github.com/typeward/app). There is no paid tier, no editions, and no feature gates: every feature ships in every build for every user. See [Open source and licensing](/reference/open-source/).

## Do I need to install LaTeX?

Usually not. The macOS, Windows x64, and Linux x86_64 builds bundle the **Tectonic** engine, so a new project compiles with nothing else installed. The ARM64 Windows and ARM64 Linux builds ship without it, because upstream Tectonic has no build for every ARM target, so on those install a TeX distribution or a `tectonic` command of your own. See [Install on Windows](/getting-started/install-windows/) and [Install on Linux](/getting-started/install-linux/). If you already have TeX Live, MacTeX, or MiKTeX, Typeward can use it instead, which adds the full CTAN ecosystem plus SyncTeX forward and inverse search. See [Choosing a compile engine](/getting-started/compile-engines/).

## Do I need an account?

No. Typeward has no sign-up, no sign-in screen, and no server behind it. Optional connections to Zotero, Mendeley, a WebDAV server, a git remote, or an AI provider use credentials you supply, which Typeward stores in your operating system keyring. See [Data locations](/reference/data-locations/).

## Does Typeward send telemetry?

No. Typeward has no analytics, no usage tracking, no crash reporting, and no error submission, and it records nothing about how you use it. The only network connections Typeward makes are the ones you configure yourself. See [Privacy and network behavior](/reference/privacy-and-network/).

## Is my document content used to train AI models?

No. Typeward trains nothing and uploads nothing on its own, and the AI assistant stays off until you turn it on. Once you configure a provider, only the text you send in a chat message or an editor action reaches that provider, under your own API key and their terms. A local Ollama model keeps even that text on your machine. See [AI assistant](/ai/overview/).

## Does Typeward work offline?

Yes, for everything local: editing, compiling with a TeX distribution, PDF and Markdown preview, templates, [grammar and spell checking](/editor/grammar-checking/), autosave, and [version history](/projects/version-history/). Three parts of Typeward reach the network.

| Feature | Needs a connection | Works offline |
| --- | --- | --- |
| Compiling with **Tectonic** | The first compile that needs a TeX package it has not cached | Every compile once those packages are cached |
| References | Zotero Web, Mendeley, and DOI or arXiv lookups | Zotero on the same machine, and the bibliography inside the project |
| Cloud sync and git remotes | Reaching the server, which sync retries on its own | Editing in the local project folder |

See [Choosing a compile engine](/getting-started/compile-engines/), [How references work](/references/how-references-work/), and [Cloud sync with WebDAV](/projects/cloud-sync/).

## Where are my files?

In plain folders you can open with any other tool, under `Documents/Typeward` by default. Typeward never puts your documents in a database or a proprietary container. See [Data locations](/reference/data-locations/).

## Can I write Typst?

Yes. A project is either LaTeX or Typst, and a Typst project gets the same editor: completion and diagnostics from tinymist, **Outline**, version history, references, and exports. Typst compiles through the `typst` command-line tool, which Typeward does not bundle, so install it and keep it on your `PATH`. See [Typst projects](/getting-started/typst/).

## Can I use my Zotero or Mendeley library?

Yes. Zotero on the same machine connects over its local server with no key, and Zotero Web needs an API key you generate in your own Zotero account. Mendeley needs an app you register yourself and exists mainly for migrating away from its discontinued desktop app. Single works go in by DOI or arXiv ID with no account at all, and every source you connect aggregates into one bibliography file inside the project. See [How references work](/references/how-references-work/) and [Connecting reference managers](/references/connecting-reference-managers/).

## Can I keep using git?

Yes, and git is built in. Typeward stages, commits, fetches, pulls, and pushes over HTTPS from the **SCM** tab in the sidebar, and it can clone a repository when you create a project. Commits use the identity in your own gitconfig, remote access uses your own git credential helper, and any other git client works on the same repository. Typeward pulls fast-forward only and has no merge-conflict interface. See [Git in Typeward](/projects/git/).

## Can I use Typeward with my existing Overleaf projects?

Yes. Import a zip export, or clone over Overleaf's git bridge, which is a feature of Overleaf's paid plans. See [Importing from Overleaf](/getting-started/import-from-overleaf/).

## Can I sync projects with OneDrive or Google Drive?

Yes. Projects are ordinary folders, so you can point any desktop sync client at your projects root. Typeward also syncs directly to a WebDAV server you control, such as Nextcloud or ownCloud. See [Cloud sync with WebDAV](/projects/cloud-sync/).

## Can two people edit the same project at once?

No. Typeward is a single-user desktop editor with no live collaboration and no sharing between people, and review comments stay on the machine that wrote them. Two people share a project through a git repository or a synced folder, one writer at a time. See [Git in Typeward](/projects/git/).

## Does Typeward run on iPad or Android tablets?

No. Typeward ships desktop builds for Windows, macOS, and Linux, and no tablet or phone build exists.

## How do I update Typeward?

Download the newer installer from the [Typeward releases page](https://github.com/typeward/releases/releases), then install it the way you installed the current version. The built-in updater is present but dormant: no shipped build makes an update request, and **Check now** under **Settings → About** reports **Updates aren't configured yet**. See [How updates work](/reference/updates/).

## Why does Windows or macOS warn me when I install Typeward?

Because the builds are unsigned, and SmartScreen and Gatekeeper warn about any installer without a certificate. Unsigned releases say so in their own release notes. Every release attaches a `SHA256SUMS` file so you can check what you downloaded, and every asset carries a GitHub build provenance attestation. See [Install on Windows](/getting-started/install-windows/), [Install on macOS](/getting-started/install-macos/), or [Install on Linux](/getting-started/install-linux/).

## Where do I report a bug?

Open an issue in the [Typeward issue tracker](https://github.com/typeward/app/issues). Typeward has no in-app bug report or feedback form and sends nothing on its own, so bring the details with you. Include what you did, what happened, your operating system, the version shown under **Settings → About**, and for a compile problem the raw log from the **All logs** tab. See [Troubleshooting](/troubleshooting/troubleshooting/).
