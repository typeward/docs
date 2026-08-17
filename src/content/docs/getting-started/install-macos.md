---
title: Install on macOS
description: Download, verify, and install Typeward on macOS 13.3 or newer, including the Gatekeeper steps the unsigned builds need.
---

This guide installs Typeward on macOS and ends with the app running. To build Typeward from source instead of downloading a disk image, see [Build from source](/getting-started/build-from-source/). Typeward runs entirely on your Mac, and there is no account of any kind.

## Requirements

- macOS 13.3 (Ventura) or newer. Typeward draws its interface with WKWebView, which is tied to the macOS version, so earlier releases cannot run it.
- An Apple Silicon (M-series) or Intel Mac. Each architecture has its own disk image, and Typeward publishes no universal build.
- No TeX distribution. Every macOS disk image bundles the Tectonic engine, so LaTeX compiles without one, and Typeward can use MacTeX or another TeX distribution instead. See [Choosing a compile engine](/getting-started/compile-engines/).

## Download and install

1. Open **Apple menu → About This Mac** and read the chip or processor line.
2. On the [Typeward releases page](https://github.com/typeward/releases/releases), download `Typeward-macos-aarch64.dmg` for an Apple Silicon Mac, or `Typeward-macos-x64.dmg` for an Intel Mac.
3. Verify the file with the checksum and provenance checks in [Verify your download](#verify-your-download).
4. Open the disk image.
5. Drag **Typeward** into your **Applications** folder.
6. Launch Typeward from **Applications**. Gatekeeper blocks that first launch, so follow [Gatekeeper on first launch](#gatekeeper-on-first-launch).

Every release attaches the same two disk images under their versioned names, `Typeward_<version>_aarch64.dmg` and `Typeward_<version>_x64.dmg`.

Once Typeward sits in **Applications** and you have launched it once, macOS knows it as an editor for `.tex` (**LaTeX Source**), `.typ` (**Typst Source**), and `.bib` (**BibTeX Bibliography**) files. Double-clicking one of those files opens it in Typeward, and a Typeward window that is already open takes the file and comes to the front.

## Verify your download

Two checks establish that the disk image you downloaded is byte for byte the file that was released: the SHA-256 hash, and the build provenance attestation. Every release attaches a `SHA256SUMS` file listing the hash of every asset, and the release notes end with a "Verify your download" section. Releases that go out unsigned carry an "Unsigned build" section as well.

1. Download `SHA256SUMS` from the same release into your downloads folder.
2. In Terminal, change to that folder and check what you downloaded against it:

   ```sh
   cd ~/Downloads
   shasum -a 256 -c SHA256SUMS --ignore-missing
   ```

3. Confirm that every file you downloaded prints `OK`.

If a file does not match, delete it and download it again. Never open the copy that failed.

To check one file by eye instead, hash the disk image you downloaded:

```sh
shasum -a 256 Typeward-macos-aarch64.dmg
```

Compare the result with the line for that file in `SHA256SUMS`.

A matching hash proves the file was not corrupted or swapped in transit. It does not prove who built it, because `SHA256SUMS` sits on the same page as the disk image. For that, verify the build provenance attestation with the [GitHub CLI](https://cli.github.com/):

```sh
gh attestation verify Typeward-macos-aarch64.dmg --repo typeward/app
```

The attestation confirms that the exact file you downloaded came out of the release workflow in the [typeward/app](https://github.com/typeward/app) repository, rather than from somewhere else.

## Gatekeeper on first launch

Typeward builds are not signed or notarized, so Gatekeeper blocks a normal double-click launch of a freshly downloaded copy. The prompt is expected, and [Open source and licensing](/reference/open-source/) explains why the builds are unsigned. Gatekeeper asks once per downloaded copy, so later launches start normally, and a freshly downloaded update raises the prompt again. The route past it depends on your macOS version.

### Open Typeward on macOS 15 (Sequoia) and later

macOS 15 removed the right-click bypass for unsigned apps, so the route runs through **System Settings**.

1. In **Applications**, double-click **Typeward**. macOS reports that it cannot verify the app, so dismiss that dialog without moving Typeward to the Trash.
2. Open **System Settings → Privacy & Security** and scroll to the **Security** section, where a message reports that Typeward was blocked.
3. Select **Open Anyway** and authenticate if asked.
4. Confirm in the dialog that follows. Typeward launches.

### Open Typeward on macOS 13 and 14

1. In **Applications**, right-click (or Control-click) **Typeward** and select **Open**.
2. In the dialog that appears, confirm with **Open**.

If that dialog offers no **Open** button, use the **System Settings** route instead. It works on these versions too.

## Check that it worked

You should now see Typeward's first-run welcome screen, which checks your TeX setup before opening the projects library.

If Typeward does not start:

1. Confirm in **Apple menu → About This Mac** that your macOS version is 13.3 or newer.
2. On that same screen, confirm that the chip matches the disk image you installed.
3. Open **System Settings → Privacy & Security** and look for the message that Typeward was blocked, which points at [Gatekeeper on first launch](#gatekeeper-on-first-launch) rather than at a broken install.
4. Hash the disk image again and compare the result with `SHA256SUMS`, to rule out an incomplete download.

## Updating

Current builds do not update themselves, and the built-in update checker is dormant. To update:

1. Download the new disk image from the [Typeward releases page](https://github.com/typeward/releases/releases).
2. Verify it with the steps in [Verify your download](#verify-your-download).
3. Drag **Typeward** into **Applications** again, replacing the old copy.

Your settings, projects, and version history are untouched, because they live outside the app bundle. See [How updates work](/reference/updates/).

## Uninstalling

Drag **Typeward** from **Applications** to the Trash. Uninstalling removes the app and nothing else: your projects under `~/Documents/Typeward`, your settings, and your version history all stay where they are. See [Data locations, credentials, and uninstall](/reference/data-locations/) for every location and how to clear it.

Uninstalling also leaves any credentials you stored in the macOS Keychain. Typeward has no account and stores no session. The Keychain holds only the credentials of optional integrations you connect yourself: a WebDAV password, a Zotero API key, or an AI provider key. Typeward never writes those credentials into a plain file. See [Privacy and network behavior](/reference/privacy-and-network/).

## Next steps

- [Your first project](/getting-started/first-project/): create a project from a template and compile a PDF.
- [Typst projects](/getting-started/typst/): install the `typst` command-line tool, which no build bundles, and put it on your `PATH`.
- [Keyboard shortcuts](/reference/keyboard-shortcuts/): every binding, with Cmd accelerators on a Mac and the common commands also in the menu bar. These docs write each shortcut Ctrl-first: `Ctrl+K` (`Cmd+K` on macOS).
