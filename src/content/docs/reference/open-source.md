---
title: Open source and licensing
description: "Typeward is GPL-3.0-or-later free software: what the license allows, where the source and releases live, and the third-party components it bundles."
---

This page explains what the Typeward license lets you do, where the source and the installers come from, and which third-party components ship inside the application. Typeward is free software under GPL-3.0-or-later, and the whole application lives in one repository, [typeward/app on GitHub](https://github.com/typeward/app). For the network requests Typeward can make, see [Privacy and network behavior](/reference/privacy-and-network/).

:::note
The `LICENSE` file in the repository root is the authoritative text, and this page is a summary rather than legal advice.
:::

## What the license gives you

Under GPL-3.0-or-later, you hold four freedoms over the copy of Typeward you are running.

- Run Typeward for any purpose, private or commercial, on as many machines as you like. There is no key, no registration, and no account to create.
- Read the source of every part of the application you are running.
- Change the source and run your modified version.
- Share Typeward, original or modified, as long as the people you share it with get the same freedoms. That means giving them the corresponding source under GPL-3.0-or-later, with the license and copyright notices intact.

The "or later" part lets recipients rely on the terms of any later version of the GNU GPL, should one be published.

## One build for everyone

A release is one build per platform, and every feature in that build is available to every user.

- No plans, tiers, trials, or license keys, and nothing behind a paywall
- No account of any kind, and no Typeward server holding your work
- No telemetry and no crash reporting

Projects are ordinary folders on your disk. For everything Typeward writes to disk, see [Data locations, credentials, and uninstall](/reference/data-locations/).

Optional third-party services are the only part of Typeward that reaches the network. [Reference manager accounts](/references/connecting-reference-managers/), [cloud sync](/projects/cloud-sync/), [git remotes](/projects/git/), and the [AI assistant](/ai/overview/) each stay off until you configure them with your own credentials, and Typeward stores those credentials in the operating system keyring rather than in a settings file. [DOI and arXiv lookup](/references/connecting-reference-managers/#add-a-citation-by-doi-or-arxiv-id) is the exception: it needs no account and no credentials, and it reaches the network only at the moment you look an identifier up.

## Source and releases

Typeward is developed in one repository and released from another.

| What | Where |
| --- | --- |
| Source, issues, and pull requests | [github.com/typeward/app](https://github.com/typeward/app) |
| Installers, release notes, and checksums | [github.com/typeward/releases/releases](https://github.com/typeward/releases/releases) |

The split keeps a release a small, stable download location rather than a build system. The release workflow in the app repository produces every installer from a tagged commit.

To build the application yourself rather than download it, see [Build from source](/getting-started/build-from-source/).

## Checksums and build provenance

Every release carries two checks you can run against the file you downloaded.

`SHA256SUMS` is a file attached to the release, listing the checksum of every asset in it. The release notes carry a `Verify your download` section with the command, and the per-platform commands are on [Install on Windows](/getting-started/install-windows/), [Install on macOS](/getting-started/install-macos/), and [Install on Linux](/getting-started/install-linux/).

GitHub attests each asset at build time. Running `gh attestation verify <file> --repo typeward/app` ties the file in your downloads folder to the workflow run and the tagged commit that produced it.

## Known limitations

- Typeward carries no Windows Authenticode signature and no Apple notarization. SmartScreen and Gatekeeper warn about the installers, and a release published without signatures says so in its release notes under an `Unsigned build` heading.
- Nothing in the app updates itself, so a new version means a new download. See [How updates work](/reference/updates/).
- Merge-conflict resolution for git pulls, mobile builds, and real-time collaboration are not implemented. Nothing is held back for a paid tier, because Typeward has none.

## Third-party components

Typeward links and bundles third-party code, each piece under its own license. `THIRD-PARTY-NOTICES.md` in the repository root lists them and explains how each one is compatible with GPLv3. These are the notable entries.

| Component | License |
| --- | --- |
| Tauri, wry, and the Tauri plugins | MIT OR Apache-2.0 |
| `tao`, the windowing crate | Apache-2.0 |
| CodeMirror 6 | MIT |
| PDF.js | Apache-2.0 |
| KaTeX | MIT |
| DOMPurify | MPL-2.0 OR Apache-2.0 |
| libgit2 | GPL-2.0-only with a linking exception |
| Tectonic | MIT |
| `harper-core` | Apache-2.0 |

Two entries need more explanation than a row holds.

`harper-core` is the one component redistributed in the Typeward repository as source, under `src-tauri/vendor/harper-core/`. It is the engine behind on-device [grammar and spell checking](/editor/grammar-checking/), vendored from upstream version 2.7.0. Typeward modifies the copy: three lint files add a type cast so the crate compiles on current Rust versions. Each of those files carries a header notice recording the change, and the Apache-2.0 license text sits alongside the source, as that license requires.

libgit2 provides git support in Typeward and is GPL-2.0-only, a license that on its own would not be compatible with GPLv3. It ships a linking exception that permits combining it with a program under any license, and that exception is what makes the combination lawful here. See [Git in Typeward](/projects/git/).

## What the notices file leaves out

Three kinds of software sit outside `THIRD-PARTY-NOTICES.md`.

- The setup step fetches Tectonic rather than committing it to the repository, and the desktop installers copy the binary in, apart from the ARM64 Windows and Linux builds, which ship without it. It is MIT-licensed, and the notices file records that its MIT attribution is not yet collected alongside the build.
- The platform webview that Typeward renders through is an operating system component: WebView2 on Windows, WKWebView on macOS, and WebKitGTK on Linux. Typeward distributes none of them.
- Tools you install yourself, such as `latexmk`, `pdflatex`, `typst`, `texlab`, `tinymist`, and `synctex`, are separate programs that Typeward invokes. They are under their own licenses and are not part of Typeward.

`THIRD-PARTY-NOTICES.md` is a curated summary rather than an exhaustive per-dependency manifest, and it says so. For the complete set, `cargo tree` and `npm ls` in a checkout list every transitive dependency.

## Contributions

Issues and pull requests are welcome in [the Typeward app repository](https://github.com/typeward/app).

`CLAUDE.md` in the repository root, mirrored as `AGENTS.md`, is the architecture guide. Before touching compilation, IPC, the outbound HTTP allowlist, or anything that handles a path coming from a project, read its "Architecture seams" and "Security invariants" sections.

Five checks must pass before a change lands, and CI runs all of them:

- TypeScript typecheck
- Frontend test suite
- `cargo fmt` in check mode
- `cargo clippy` with warnings denied
- Rust test suite

The exact commands are in the repository README and under [Build from source](/getting-started/build-from-source/).

Three house conventions apply to every change:

- Code, files, and commit messages carry no emoji and no em dashes.
- Comments explain why rather than what.
- The project uses npm, not pnpm or yarn.

When you file a bug, include the build version from **Settings → About**, along with your operating system and how you installed Typeward.

## See also

- [Privacy and network behavior](/reference/privacy-and-network/)
- [Data locations, credentials, and uninstall](/reference/data-locations/)
- [Build from source](/getting-started/build-from-source/)
- [How updates work](/reference/updates/)
