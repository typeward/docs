---
title: Connecting Zotero, Mendeley, and DOI lookup
description: Connect Zotero on this machine, the Zotero Web API, or Mendeley, then add one-off citations by DOI or arXiv ID with no account involved.
---

This guide shows you how to connect Zotero on this machine, the Zotero Web API, or Mendeley, and how to add a single citation by DOI or arXiv ID. For what Typeward does with the entries once a source answers, see [How references work](/references/how-references-work/).

Every reference source ships in every build, for everyone. None of them is on by default, and none of them involves a Typeward account. Zotero on this machine needs no login at all, and the web sources use credentials you create yourself and keep in your operating system keyring.

## Open the reference settings

1. Open **Settings** with `Ctrl+,` (`Cmd+,` on macOS).
2. Under **Integrations**, select **References**.

The card is titled **References**, with the subtitle **Connect a reference manager to autocomplete `\cite{…}` keys and append the aggregated library to the project's .bib.** It holds three rows:

- **Zotero (local)**
- **Zotero Web API**
- **Mendeley**

DOI and arXiv lookup has no row, because nothing about it needs configuring.

Each row carries a status badge.

| Badge | What it means |
| --- | --- |
| **Ready** | On **Zotero (local)**, the probe reached the Zotero app. On **Zotero Web API** and **Mendeley**, credentials are saved and were accepted at the moment you connected. |
| **Not configured** | No credentials are saved. Only **Zotero Web API** and **Mendeley** show this. |
| **Checking…** | The probe is still running. Only **Zotero (local)** shows this. |
| **Not reachable** | The probe could not reach the Zotero app. Only **Zotero (local)** shows this. |

Only **Zotero (local)** is probed continuously. The two web rows are checked once, when you connect them, so their badge keeps reading **Ready** afterwards even if the machine goes offline or you revoke the key. Read it as "credentials saved", not "reachable right now". A refresh that fails reports the real reason.

You can enable more than one source at a time. Typeward pulls everything you configure into a single BibTeX file per project.

## Connect Zotero on this machine

The local connection talks to the Zotero desktop app over loopback HTTP on port 23119. It uses no key and no account, and it sends no traffic beyond your own machine, so it keeps working offline as long as Zotero is running.

1. In Zotero 7, open **Settings → Advanced** and enable **Allow other applications on this computer to communicate with Zotero**.
2. Leave Zotero running, and open the **References** card in Typeward. Typeward probes port 23119 as soon as the panel opens.
3. Wait for the **Zotero (local)** badge to change from **Checking…** to **Ready**.
4. Turn on the **Zotero (local)** switch.

The switch stays disabled until the probe succeeds, because a source that cannot answer has nothing to contribute. When the badge reads **Not reachable**, a **Re-check** button appears next to the switch. Start Zotero, turn on the Advanced setting, then select **Re-check**. A row that is already enabled can be switched off whether or not it is reachable.

Typeward asks for no library ID. It finds your personal library (**My Library**) and every group library on its own, along with each library's collections. Collections you moved to Zotero's trash are filtered out, so deleted folders never linger in the picker.

Refreshing the library while Zotero is closed fails for that source with:

> Zotero isn't reachable on 127.0.0.1:23119. Start Zotero 7 and enable "Allow other applications on this computer to communicate with Zotero" (Settings → Advanced). The Better BibTeX plugin is optional.

Other configured sources still refresh, and only Zotero is skipped. The **Refs** tab in the sidebar disappears once every configured source is proven unreachable, which in practice means Zotero is your only source and Zotero is closed.

### Let Better BibTeX supply the citation keys

If the [Better BibTeX](https://retorque.re/zotero-better-bibtex/) plugin is installed, Typeward detects it and exports your personal library through it, which gives the stable, human-readable citation keys Better BibTeX users expect. The plugin needs no setup in Typeward: the probe checks for it first and falls back to Zotero's own API when it is absent.

Group libraries always export through Zotero's built-in API, because Better BibTeX's internal library IDs do not match the public group IDs.

With the row enabled and no Better BibTeX installed, the row also shows **Using Zotero's built-in API. Install Better BibTeX for stable, human-readable citation keys.**

## Connect the Zotero Web API

The web connection reads your zotero.org account over the Zotero API instead of the desktop app. Use it when Zotero is not installed on this machine, lives on another one, or is not running. It works alongside **Zotero (local)**: both rows can be connected at once, and each contributes its own entries.

1. In the **Zotero Web API** row, select **Get key**. Typeward opens [zotero.org/settings/keys](https://www.zotero.org/settings/keys) in your system browser.
2. Create a key on that page. Read access is all Typeward needs, so leave write permissions off.
3. Note your numeric user ID, which Zotero shows on the same page.
4. Back in Typeward, fill in **User id** (placeholder **e.g. 1234567**) and **API key**.
5. Select **Connect**. The button reads **Testing…** while Typeward checks the credentials against the Zotero API.

Two errors can appear on the row:

- **Both the user id and API key are required.** when a field is blank.
- **Zotero rejected the credentials (status 403).** and similar when Zotero refuses the key. The number is the HTTP status Zotero returned.

Typeward deletes a rejected key rather than saving it. On success the badge turns **Ready**, the hint becomes **Connected as user 1234567.**, and a **Disconnect** button replaces the fields. Selecting **Disconnect** deletes the key from the keyring and clears the user ID.

Typeward stores the key in the operating system keyring and writes only the numeric user ID to `settings.json`. It discovers the personal library plus every group library that key can read, and each library's collections. Exports stop at 5000 entries per library, a deliberate ceiling on how much one refresh pulls.

Unlike the local connection, this one needs the network. See [Privacy and network behavior](/reference/privacy-and-network/).

## Connect Mendeley

:::caution[Mendeley is a migration path, not a starting point]
The row's own hint states the position: **Mendeley Desktop was discontinued in 2022 and the API is in maintenance mode. Use Zotero for new workflows; this exists for migration.** Typeward keeps the row for readers moving a library out of Mendeley.
:::

Mendeley is a confidential OAuth client, so the setup has two parts. You register an OAuth application at [dev.mendeley.com](https://dev.mendeley.com) with a redirect URL, and you paste that application's client secret into Typeward. Mendeley exposes one personal library (**My Library**) and its folders, nested the way you have them. Browsing a folder fetches its documents one by one and stops at 500 documents per folder.

Sign-in completes only when the client secret you save belongs to the same Mendeley OAuth application as the client ID compiled into your copy of Typeward. If you [build from source](/getting-started/build-from-source/), that client ID is yours to set. Mendeley is the least exercised of the reference sources, and it is the only one whose upstream is winding down. Report a sign-in that never completes at [github.com/typeward/app](https://github.com/typeward/app).

### Save the redirect URL and the client secret

1. In the **Mendeley** row, type the URL you registered at dev.mendeley.com into **Redirect URL**. The field starts at `http://localhost:5000/callback`.
2. Confirm that the value Typeward echoes matches your registration exactly. The echo reads **App will send: `http://localhost:5000/callback`. This is what Mendeley must have registered.**
3. Paste the application's client secret into **Client secret**.
4. Select **Save secret**. Typeward writes the secret to the operating system keyring, the button becomes **Update**, and the field shows **Saved (paste to replace)**.

Mendeley matches the redirect URL exactly, so the registered value and the Typeward value must agree character-for-character on host, port, path, and any trailing slash. A trailing slash or a different port is a different URL as far as Mendeley is concerned.

Typeward never reads the secret back into the interface. **Sign in** stays disabled until a secret is saved.

### Complete the sign-in

1. Select **Sign in**. The button reads **Connecting…** while the flow runs.
2. Sign in to Mendeley on the authorization page that opens in your system browser.
3. Return to Typeward once the browser tab reads **Signed in.** and **You can close this tab and return to Typeward.**

While you are in the browser, Typeward runs a small local server on the redirect URL's port, bound to both IPv4 and IPv6 so `localhost` resolves either way. It waits up to five minutes for the browser to come back. A failed round trip ends on a page reading **Sign-in failed.** and **Return to Typeward and try again.**

After a successful return, Typeward fetches your profile, the badge turns **Ready**, and the hint becomes **Connected as Your Name.**

If the redirect port is already taken, Typeward reports that the port is in use and suggests either freeing it or registering a redirect URL on a different port. On macOS, AirPlay Receiver listens on port 5000 by default. Turn AirPlay Receiver off, or register a redirect URL on another port in both places. Any other failure appears as an error line on the row, in Mendeley's own words.

### Manage the saved connection

Typeward stores the access and refresh tokens in the operating system keyring, under your Mendeley profile ID. Only the profile ID, the display name, and the redirect URL land in `settings.json`. The tokens refresh themselves shortly before they expire, without a new browser round trip. Selecting **Disconnect** deletes the token from the keyring and keeps the redirect URL, so reconnecting later does not mean retyping it.

## Add a citation by DOI or arXiv ID

The lookup itself needs no setup and no account, and it touches no reference manager: Typeward resolves the identifier over the network and writes the result into the open project. It is reached from the **Refs** tab, though, so at least one reference source has to be configured and not proven unreachable for the tab, and the **Add from DOI** button inside it, to appear.

1. In the sidebar, select the **Refs** tab.
2. Select **Add from DOI** at the bottom of the panel. Typeward opens the **Add citation from DOI or arXiv** dialog.
3. Paste a DOI, an arXiv ID, or a URL to either into the input, which carries the placeholder **10.1145/3290605.3300479 or 2403.04132**.
4. Select **Add**, or press `Enter`. The button reads **Fetching…** while the lookup runs.

The dialog states what it does: **Paste a DOI, an arXiv id, or a URL to either. We fetch the BibTeX and append it to this project.** It accepts five shapes of identifier.

| Input | Example |
| --- | --- |
| A DOI | `10.1145/3290605.3300479` |
| A DOI URL | `https://doi.org/10.1145/3290605.3300479` or the `dx.doi.org` form |
| An arXiv ID | `2403.04132`, with or without a version suffix such as `2403.04132v2` |
| An older arXiv ID | `math.GT/0309136` |
| An arXiv URL | `https://arxiv.org/abs/2403.04132` or the `/pdf/` form |

Typeward reports one of four results:

- **Added smith2024method.** when the entry is new.
- **smith2024method was already in the project library.** when the key is already there.
- **Couldn't parse that as a DOI or arXiv id. Try 10.1145/3290605.3300479 or 2403.04132.** when the input matches neither shape.
- **Open a project first.** when no project is open.

Typeward sends every DOI to `doi.org` with a request for BibTeX, and the registration agency answers with the publisher's own entry. arXiv identifiers from 2022 onward carry an auto-assigned DOI, so Typeward tries `10.48550/arXiv.<id>` first. Older papers fall back to the arXiv API and become a `@misc` entry keyed `arxiv` plus the identifier with the version suffix and every non-alphanumeric character stripped, so `math.GT/0309136` becomes `arxivmathGT0309136`.

Typeward appends added entries to `<project>/.typeward/citations/local.bib` and folds them into the aggregated library on the same refresh. They belong to the project rather than to any account, so they survive changing or removing reference managers, and they keep compiling once you are offline. The lookup itself needs the network.

## Find your saved credentials

Secrets never touch `settings.json`. Typeward writes them to the operating system keyring: Windows Credential Manager, the macOS Keychain, or a Secret Service provider such as GNOME Keyring or KWallet on Linux. Each entry is named `typeward.<service>`, and the account field names the credential.

| Entry | Holds |
| --- | --- |
| `typeward.zotero-web`, account = your user ID | Your Zotero API key |
| `typeward.mendeley`, account `app-secret` | The Mendeley client secret |
| `typeward.mendeley`, account = your profile ID | The Mendeley token bundle |

Zotero on this machine stores nothing, because it authenticates with nothing.

Typeward's interface can write, check for, and delete these entries, and it can never read them back. Every read happens in Typeward's Rust core, which attaches the credential to the outgoing request and nothing else. Each credential is bound to one host: Typeward sends the Zotero key only to `api.zotero.org` and the Mendeley token only to `api.mendeley.com`. A loopback request such as the local Zotero connection carries no credential at all.

On Linux, a missing Secret Service provider means the Zotero Web API and Mendeley connections can save nothing. See [Install on Linux](/getting-started/install-linux/).

## Check that it worked

Each source you connected shows the **Ready** badge on its row, and the **Zotero Web API** and **Mendeley** rows name the account they reached. Open a project, and the **Refs** tab appears in the sidebar.

## If it does not work

| Symptom | Where to look |
| --- | --- |
| **Zotero (local)** shows **Not reachable** | Zotero is closed, or **Allow other applications on this computer to communicate with Zotero** is off in Zotero's **Settings → Advanced**. Fix either, then select **Re-check**. |
| The **Zotero (local)** switch will not move | The probe has not succeeded yet. The switch unlocks once the badge reads **Ready**. |
| Citation keys changed shape after you installed Better BibTeX | Expected. Better BibTeX supplies its own keys for the personal library. Refresh the library, then update any citations you already inserted. |
| **Connect** on **Zotero Web API** reports a rejected status | The key or the user ID is wrong, or the key has no read access to the library. Create a fresh read-only key at zotero.org/settings/keys. |
| A Zotero library seems to stop partway | Web exports stop at 5000 entries per library. |
| Mendeley **Sign in** stays disabled | No client secret is saved yet. Paste one, then select **Save secret**. |
| The Mendeley browser tab reads **Sign-in failed.** | The redirect URL registered at dev.mendeley.com and the one in Typeward differ, or the browser took longer than five minutes. |
| Mendeley reports that the redirect port is in use | Another program holds that port. On macOS, AirPlay Receiver holds port 5000 unless you turn it off. |
| DOI lookup returns an error | The identifier may not be registered, or the machine is offline. Both cases surface the message the lookup received. |

## See also

- [How references work](/references/how-references-work/)
- [Privacy and network behavior](/reference/privacy-and-network/)
- [Data locations, credentials, and uninstall](/reference/data-locations/)
- [Troubleshooting](/troubleshooting/troubleshooting/)
