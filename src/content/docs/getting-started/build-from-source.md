---
title: Build from source
description: Clone the Typeward source, install the prerequisites and the required Tectonic binary, run a development build, and produce installers for your platform.
---

This guide shows you how to build Typeward from source, run a development window, and produce installers for your platform. To run Typeward without building it, install a [published release](https://github.com/typeward/releases/releases) and follow [Install on Windows](/getting-started/install-windows/), [Install on macOS](/getting-started/install-macos/), or [Install on Linux](/getting-started/install-linux/). Build from source to audit the GPL-3.0-or-later code in the [Typeward repository](https://github.com/typeward/app), run an unreleased change, contribute a fix, or target a platform no installer covers.

## Before you start

Install two toolchains on the machine you build on:

- Node at `^20.19 || >=22.12`, the range Vite 8 requires. CI uses Node 22.
- Rust, through [rustup](https://rustup.rs/). The toolchain version is pinned in `src-tauri/rust-toolchain.toml`, so rustup fetches the right compiler on the first build. Never pin your own version over it.

Tauri 2 also needs system packages, and the set differs by platform.

| Platform | System packages |
| --- | --- |
| Windows | The WebView2 runtime and the MSVC build tools |
| macOS | The Xcode command line tools |
| Linux | The GTK, WebKitGTK, and D-Bus development packages |

The [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/) carries the upstream list. On Debian and Ubuntu, one command covers the whole Linux set.

```sh
sudo apt install -y libdbus-1-dev libwebkit2gtk-4.1-dev build-essential \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

`libdbus-1-dev` covers the keyring crate's Secret Service backend, where Typeward stores optional integration credentials on Linux, and the rest of the list is Tauri's GTK and WebKitGTK chain.

## Get the source

Clone the repository and change into it.

```sh
git clone https://github.com/typeward/app.git typeward
cd typeward
```

## Install the dependencies

Use npm rather than pnpm or yarn, because the lockfile and the project's conventions assume npm.

1. Install the npm packages.

   ```sh
   npm install
   ```

2. Download the Tectonic binary for your host platform.

   ```sh
   npm run fetch:tectonic
   ```

`npm run fetch:tectonic` downloads Tectonic 0.15.0 into `src-tauri/binaries/`, a gitignored directory, so the step runs again on every machine you build on. The step is required even when you never compile with Tectonic, because `tauri.conf.json` lists the binary in `bundle.externalBin` and Tauri's build script validates that path. Without the binary in place, the build fails before it starts.

The script fetches the binary from the [Tectonic releases](https://github.com/tectonic-typesetting/tectonic/releases) on GitHub, and it refuses anything it cannot verify:

- It checks the SHA-256 of the downloaded archive and of the extracted binary against digests pinned in `scripts/fetch-tectonic.lib.mjs`.
- It rejects any URL that is not HTTPS.
- It rejects redirects to hosts outside a small allowlist.

A mismatch aborts the fetch rather than installing the file.

## Run a development build

Start the app against the Vite dev server.

```sh
npm run tauri dev
```

The first run compiles the Rust side and takes a while. Later runs reuse the build cache, and a frontend change hot reloads in the running window.

## Build installers

Produce the bundles for the platform you are on.

```sh
npm run tauri build
```

Tauri writes the bundles under `src-tauri/target/release/bundle/`, in the formats it produces for your host.

| Platform | Bundle formats |
| --- | --- |
| Windows | An NSIS installer |
| macOS | A `.dmg` |
| Linux | A `.deb`, an `.AppImage`, and an `.rpm` |

A build produced this way is unsigned, like the published builds, so your operating system raises the same warning. [Open source and licensing](/reference/open-source/) explains why, and the install guide for your platform carries the steps past the prompt.

Typeward does not support cross-compiling for another operating system. Build each platform's bundles on that platform.

### Build for ARM64

Windows and Linux ARM64 builds ship without a bundled Tectonic binary, because upstream Tectonic has no build for every ARM target. macOS is the exception: upstream publishes an `aarch64-apple-darwin` binary, so an Apple Silicon build bundles Tectonic like any other macOS build. To build for Windows or Linux on ARM64, skip `npm run fetch:tectonic` and pass the config overlay that drops the binary.

```sh
npm run tauri build -- --config src-tauri/tauri.no-tectonic.conf.json
```

That overlay zeroes `bundle.externalBin`, so the build neither validates nor packages the binary, and the app reports that no engine is bundled. To compile LaTeX in such a build, install a TeX distribution on the machine, or put your own `tectonic` binary on your `PATH`.

`npm run fetch:tectonic` does have an entry for Windows on ARM. It installs the x86_64 Tectonic under the aarch64 triple name, and Windows runs it under x64 emulation, which unblocks local ARM64 development builds.

## Check that it worked

`npm run tauri dev` opens the Typeward window on your desktop, and a saved frontend change reloads in that window without a restart. After `npm run tauri build`, `src-tauri/target/release/bundle/` holds an installer for your host platform.

## If it does not work

1. Confirm that `src-tauri/binaries/` holds the Tectonic binary. Tauri validates that path before the build starts, so a missing binary stops the build immediately.
2. On Linux, link the musl binary to the gnu triple name Tauri expects. The fetch script installs the statically linked musl build, while Tauri looks for the gnu triple that matches your rustc target.

   ```sh
   cd src-tauri/binaries
   ln -sf tectonic-x86_64-unknown-linux-musl tectonic-x86_64-unknown-linux-gnu
   ```

   The musl binary runs on glibc systems, because it is statically linked.

## Install optional tools

Typeward bundles none of these tools, and the build needs none of them.

| Tool | What it adds |
| --- | --- |
| A TeX distribution (TeX Live, MiKTeX, or MacTeX) | Compiling through `latexmk` or `pdflatex`. Tectonic covers LaTeX with no TeX distribution at all. See [Choosing a compile engine](/getting-started/compile-engines/). |
| The `typst` command-line tool, on your `PATH` | Compiling Typst projects. See [Typst projects](/getting-started/typst/). |
| `synctex`, which ships with every TeX distribution | Forward and inverse search between the source pane and the preview pane. Without it, compiling still works and sync is quietly unavailable. |

## Contribute a change

File issues and pull requests in the [Typeward repository](https://github.com/typeward/app). `CLAUDE.md` in the repository root, mirrored as `AGENTS.md`, is the architecture guide. Read its "Architecture seams" and "Security invariants" sections before touching compilation, IPC, the outbound HTTP allowlist, or anything that handles a path coming from a project.

Every change must pass these checks before it lands, and CI runs all of them.

```sh
npm run typecheck
npm test
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets --locked -- -D warnings
cargo test --manifest-path src-tauri/Cargo.toml --locked
```

Two house conventions apply everywhere. Code, files, and commit messages carry no emoji and no em dashes, and comments explain why rather than what.

## Next steps

- [Open source and licensing](/reference/open-source/) covers the license, what the GPL gives you, and the third-party components Typeward bundles.
- [Choosing a compile engine](/getting-started/compile-engines/) explains how Typeward detects your setup and when a TeX distribution beats the bundled Tectonic.
