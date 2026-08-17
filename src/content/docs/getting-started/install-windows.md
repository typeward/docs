---
title: Install on Windows
description: Download, verify, and install Typeward on Windows, with the checksum and provenance checks and the SmartScreen steps for unsigned builds.
---

This guide installs Typeward on Windows and ends with the app running. For another platform, see [Install on macOS](/getting-started/install-macos/) or [Install on Linux](/getting-started/install-linux/). Installing creates no account and contacts no Typeward server, because Typeward has neither.

## Requirements

- 64-bit Windows 10 or 11, on x64 or on ARM64. Each architecture has its own installer, and no 32-bit build exists.
- The Microsoft Edge WebView2 runtime, which Typeward uses to draw its interface. On a machine without it, the installer downloads and runs Microsoft's WebView2 bootstrapper silently, so setup there needs an internet connection.
- No TeX distribution on x64, because that installer bundles the Tectonic engine. Typeward can use MiKTeX or TeX Live instead when you have one installed. See [Choosing a compile engine](/getting-started/compile-engines/).
- A TeX distribution on ARM64, because the ARM64 installer ships without Tectonic: upstream publishes no ARM64 Windows binary. MiKTeX, TeX Live, or a `tectonic` command on your `PATH` all work, and Typeward compiles with whichever it finds.
- The `typst` command for Typst projects, which no installer bundles. See [Typst projects](/getting-started/typst/).

## Download and install

1. On the [Typeward releases page](https://github.com/typeward/releases/releases), download `Typeward-windows-x64-setup.exe` for an Intel or AMD machine, or `Typeward-windows-arm64-setup.exe` for an ARM machine.
2. Verify the file with the checksum and provenance checks in [Verify your download](#verify-your-download).
3. Run the installer. It installs for the current user and needs no administrator rights, and [Windows SmartScreen](#windows-smartscreen) warns about it on the way.
4. Launch Typeward from the Start menu.

Each release attaches the same two installers under their versioned names, `Typeward_<version>_x64-setup.exe` and `Typeward_<version>_arm64-setup.exe`. Windows releases carry an NSIS installer only, with no MSI package.

The installer registers Typeward as an editor for `.tex` ("LaTeX Source"), `.typ` ("Typst Source"), and `.bib` ("BibTeX Bibliography") files. Double-clicking one of those opens it in Typeward, and a Typeward window that is already open takes the file and comes to the front.

## Verify your download

Typeward builds carry no code signature, so a checksum and a provenance attestation are the whole integrity story. Every release attaches a `SHA256SUMS` file listing the hash of every asset.

1. In the folder holding the installer, open PowerShell and hash the file:

   ```powershell
   Get-FileHash .\Typeward-windows-x64-setup.exe -Algorithm SHA256
   ```

2. Compare the value under `Hash` with the line for that filename in `SHA256SUMS`. The two must match, though the comparison ignores case.
3. Verify the build provenance attestation with the [GitHub CLI](https://cli.github.com/):

   ```powershell
   gh attestation verify .\Typeward-windows-x64-setup.exe --repo typeward/app
   ```

If the hashes differ, delete the file and download it again. Never run it.

:::tip
In Git Bash or WSL, `sha256sum -c SHA256SUMS --ignore-missing` does the same comparison in one step and prints `OK` for each file that matches.
:::

A matching hash proves the file was not corrupted or swapped in transit. The attestation proves the installer came out of the release workflow in the [typeward/app](https://github.com/typeward/app) repository, rather than being assembled somewhere else.

Each release repeats both checks in a "Verify your download" section of its notes. An unsigned release carries an "Unsigned build" section as well, saying that SmartScreen warns.

## Windows SmartScreen

Because the installer carries no code signature, Microsoft Defender SmartScreen raises a "Windows protected your PC" dialog when you run it.

1. In the SmartScreen dialog, select **More info**.
2. Select **Run anyway**.

The prompt is expected, and it returns for each new version you download. [Open source and licensing](/reference/open-source/) explains why the builds carry no signature, and [Verify your download](#verify-your-download) is what establishes that the file is the one that was released.

## Check that it worked

You should now see the Typeward window, which starts with the first-run setup on a new installation.

If Typeward does not start:

1. Confirm that you ran the installer for your architecture, `Typeward-windows-x64-setup.exe` on Intel and AMD machines and `Typeward-windows-arm64-setup.exe` on ARM machines.
2. Check that the Microsoft Edge WebView2 runtime is installed, because the installer can only fetch it on a machine with an internet connection.
3. Hash the installer again and compare the value with `SHA256SUMS`, because a file that fails that comparison is not the installer that was released.

## Updating

Typeward does not update itself. The built-in update checker is dormant, and no build makes an update request.

To update:

1. On the [Typeward releases page](https://github.com/typeward/releases/releases), download the installer for your architecture.
2. Verify it with the steps in [Verify your download](#verify-your-download).
3. Run the installer over your existing installation.

Your settings, projects, and version history survive that, because they live outside the installation folder. See [How updates work](/reference/updates/).

## Uninstalling

Uninstall Typeward from Windows Settings or from its Start menu entry. Uninstalling removes the app and leaves your projects in place, by design. Projects live under `Documents\Typeward` by default, and in any other folder you have pointed Typeward at.

Uninstalling also leaves the app data folder, which holds your settings, version history, custom themes, and templates. Windows Credential Manager keeps any credentials you saved for optional integrations, such as a WebDAV password, a Zotero API key, or an AI provider key. Typeward never writes those credentials to plain files. See [Data locations, credentials, and uninstall](/reference/data-locations/) for every location and how to clear it.

## Next steps

- [Your first project](/getting-started/first-project/): create a project and compile your first PDF.
- [Privacy and network behavior](/reference/privacy-and-network/): every request Typeward can make, and what each one sends.
- [Build from source](/getting-started/build-from-source/): build the GPL-3.0-or-later source yourself instead of running an installer.
