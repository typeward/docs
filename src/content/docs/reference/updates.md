---
title: How updates work
description: Updating today means downloading the new installer from GitHub, plus what the built-in updater will do once builds are signed.
---

This page explains how you move to a newer version of Typeward today, and what the updater built into the app does once release builds are signed. Typeward does not update itself. The updater ships in every build and stays dormant, so no build checks for a new version at launch, makes an update request, or installs anything on its own.

## Updates today

Updating means downloading the new installer and running it over the installation you have. The route depends on how you got Typeward:

- You installed from a release installer: take the newest installer from the [Typeward releases page](https://github.com/typeward/releases/releases) and run it over your existing installation.
- You built Typeward yourself: pull the repository and repeat the [Build from source](/getting-started/build-from-source/) steps.

Each release carries installers for Windows, macOS, and Linux, a `SHA256SUMS` file listing every asset, and the changelog for that version. Verify the download against `SHA256SUMS` before you run it, with the steps per platform on [Install on Windows](/getting-started/install-windows/), [Install on macOS](/getting-started/install-macos/), and [Install on Linux](/getting-started/install-linux/).

Your projects and settings survive the reinstall. They live outside the installation, so replacing the application in place keeps every project, template, custom theme, and preference. See [Data locations, credentials, and uninstall](/reference/data-locations/).

### What a check does today

**Settings → About** has a **Check for updates** row with a **Check now** button. Today that button never reaches the network. It shows an information toast and stops:

> **Updates aren't configured yet**
>
> This build predates automatic updates. Grab new versions from the Typeward download page.

The **Check automatically** toggle in the same card is on by default, and today it has nothing to switch on. The launch check returns immediately in every build, whatever the toggle says.

That toast points at the Typeward download page. The releases page on GitHub is the location that always holds the files.

## The missing signing key

Verified updates need a signing keypair, and that keypair does not exist. Two things follow from that, and both are visible in the source:

- The update public key in the app configuration is empty, and the app reads that at build time. A check stops on the empty key and never reaches the updater plugin, so it makes no request at all, rather than making one and failing.
- Release builds produce update packages and an update manifest only when a signing key is present. With no key, the release pipeline publishes no signatures and no manifest, so a check would have nothing to read.

This state is deliberate rather than unfinished. An updater is the one part of the app that can replace the app, so it stays off until the release pipeline can sign what it ships.

## How Typeward will update itself once builds are signed

The update code already ships inside the app. It becomes live when signed releases start publishing an update manifest.

### The check after launch

With **Check automatically** on, Typeward will run one silent check roughly ten seconds after launch. Failures on this path stay silent, so an offline launch or an unreachable manifest never interrupts you. If a newer version exists, the **Update available** dialog appears. That dialog does not block the app, so you can keep working and decide later.

With the toggle off, no automatic check runs and manual checks from **Check now** still work. The toggle is a local setting stored with the rest of your preferences on this machine, and nothing about it travels anywhere.

### What a check sends

A check is a plain HTTPS `GET` for the release manifest on `github.com`, a `latest.json` file attached to the newest release in the `typeward/releases` repository. No account, no install identifier, no telemetry. The hint under **Check automatically** states the same guarantee: "The check is a plain HTTPS GET to GitHub with no identifiers, and updates never install without your confirmation." See [Privacy and network behavior](/reference/privacy-and-network/).

### The update prompt

The **Update available** dialog names the new version and the one you are on. Under **What's new**, it shows the release notes as plain text straight from the release. A release without notes says so. The dialog offers two choices:

- **Later** dismisses the dialog. Nothing has been downloaded.
- **Install and relaunch** downloads the update, shows **Downloading… NN%** while it runs, then closes the app and reopens it on the new version.

The dialog states the consequence: "The app closes and reopens on the new version. Unsaved work is saved by autosave first." Nothing installs without that button. Once the download starts the dialog cannot be dismissed, because the relaunch takes over from there. On Windows the installer replaces the running executable as part of the handoff.

If an install fails, an **Update failed to install** message appears and the app keeps running on the current version. Nothing is half-applied.

### Package signatures

Update packages will carry an updater signature, checked against a public key built into the app. Typeward rejects a package that does not verify instead of installing it. That signature is separate from operating-system code signing, which the installers do not have today.

### The manual check

A manual check always reports its outcome, unlike the silent one. **Check now** will show **Checking…** while it runs. The result is then one of three: the **Update available** dialog, a **You're up to date** toast, or a **Couldn't check for updates** error carrying the reason.

## The version you are running

The **Version** row in **Settings → About** shows the exact build, taken from the package version at build time. That is the number to quote in a bug report, and the number to compare against the releases page.

## See also

- [Privacy and network behavior](/reference/privacy-and-network/)
- [Data locations, credentials, and uninstall](/reference/data-locations/)
- [Build from source](/getting-started/build-from-source/)
