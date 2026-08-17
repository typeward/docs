---
title: Cloud sync with WebDAV
description: "Bidirectional file sync between a Typeward project and a WebDAV server you control: setup, sync cadence, conflict copies, and limits."
---

This guide shows you how to sync a Typeward project with a WebDAV server you control: Nextcloud, ownCloud, Fastmail, mailbox.org, a NAS, or any other WebDAV host. Sync is bidirectional, it is free like everything else in the app, and Typeward talks only to the server whose address you type in, using credentials you supply. For a change history with messages rather than a mirrored folder, see [Git in Typeward](/projects/git/).

There is no Typeward account and no Typeward server anywhere in the path. WebDAV is the only cloud backend Typeward ships, and Typeward has no Dropbox, Google Drive, or OneDrive integration.

A cloud-backed project is a normal folder on your disk. Editing, compiling, preview, and version history all work with the server unreachable, and sync catches up the next time it reaches the server. Files inside the remote folder you pick sync in both directions: sources, images, bibliographies, and anything else the folder holds.

## Known limitations

- Sync runs only while the cloud-backed project is open. Closing it or switching to another project stops sync, and nothing runs in the background for projects you are not working in.
- Typeward has no manual sync control. There is no "sync now" button, no command palette entry, and no action on the sync status badge that forces a pass.
- A file you copy into the project folder from Explorer or Finder stays local until you open it in Typeward and save it once. It then uploads like any other file.
- A file you delete or rename in the **Files** tab reaches the server at the next project open, not immediately. The catch-up pass at open is what propagates it.

Some state never leaves the machine that made it.

| Never syncs | Where it stays |
| --- | --- |
| Settings and preferences | `settings.json` on each machine, so theme, editor options, and engine choice stay where you set them. See [Data locations, credentials, and uninstall](/reference/data-locations/). |
| The WebDAV app password | The operating system keyring on that one machine |
| The project's `.typeward` folder | The local project. Crash-recovery snapshots, review comments, AI conversations, the citation cache, and the sync engine's own bookkeeping are rejected in both directions, at any depth |
| Version history | The app data folder rather than the project, so it is per machine too. See [Version history](/projects/version-history/). |

## Connect a WebDAV server

Before you start, issue an application password on your server. Most servers require one when two-factor authentication is on.

1. Open **Settings → Integrations → Cloud storage** and select **Add server**. The button turns into **Cancel** while the form is open.
2. In **Server URL**, enter the WebDAV path for your account, not the address of the web interface. The placeholder shows the shape: `e.g. https://cloud.example.com/remote.php/dav/files/you/`.
3. In **Username**, enter your account name on that server.
4. In **App password**, enter that application password rather than your account password.
5. Optional: Select **Allow a private / LAN server (10.x, 172.16.x, 192.168.x). Loopback and cloud-metadata addresses stay blocked.** when the server sits on your own network.
6. Select **Connect**. The button reads **Connecting…** while it works.

A bare host is accepted in **Server URL**, and Typeward adds `https://` and a trailing slash for you.

Connecting runs three checks in order. Typeward validates and screens the host, writes the password to the operating system keyring, then makes one probe request to confirm the credentials. Nothing is saved unless all three pass. If the probe fails, the stored password is deleted again and the form shows "WebDAV sign-in failed. Check the username and app password." Leaving a field empty gives "Server URL, username, and app password are all required."

The **Cloud storage** card names **WebDAV** as its provider, and that row reads unconfigured until an account is connected. A connected account is listed as `username@host`, with a **Disconnect** button beside it.

HTTPS is mandatory, including for servers on your own network. An `http://` address is rejected with a message that WebDAV requires https.

Every request resolves the host and screens the addresses it resolves to. Loopback and cloud-metadata addresses are always blocked. Private and carrier-grade ranges are blocked unless you selected the private-server option for that account, and a redirect may only stay on the same host over HTTPS. See [Privacy and network behavior](/reference/privacy-and-network/).

The password is stored only in the operating system keyring: Windows Credential Manager, the macOS Keychain, or the Secret Service on Linux. Typeward never writes it to `settings.json`, the app interface cannot read it back, and Typeward fetches it from the keyring for each request.

## Create a cloud-backed project

Typeward lists the top-level folders of your WebDAV account and never creates one for you, so the folder must exist on the server first.

1. On your server, create the folder that this project will sync with.
2. In the projects library, select **New project**.
3. Under **Where**, select **Cloud**, "Sync with a connected WebDAV server". The chooser appears once at least one account is connected, and its other option is **Local**, "Folder under your projects root".
4. In **WebDAV server**, select the account that holds the folder.
5. In **Remote folder**, select the folder. Picking one fills in the project **Name** for you.

While the list loads, it reads "Loading remote folders…". An account with no top-level folders gives "No folders found. Create one on your server, then come back." Submitting without both selections gives "Pick a cloud account and a remote folder first."

What happens on create depends on what the remote folder already holds.

| Remote folder | Result |
| --- | --- |
| Holds files, including a `.tex` or `.typ` | Everything downloads first and is recorded as the sync baseline, so the first poll has nothing to argue with |
| Holds files, but no `.tex` or `.typ` | The same download, plus a starter `main.tex` or `main.typ` written locally, which uploads on its first save |
| Empty | The normal starter project, which uploads on its first save |

The project itself lives in a cache folder inside your projects root, under `.remote-cache/webdav/<project-id>/`. When the remote folder already held files, that cache folder is the project root. When the remote folder was empty, the starter project sits one level deeper, in a subfolder named after the project. It is a normal Typeward project, down to the project's `.typeward` folder, the file watcher, and the compile pipeline. The binding to the server is stored with the project, so opening it later resumes sync automatically. Cloud-backed projects carry a small cloud chip whose tooltip reads "Synced · webdav". See [The projects library](/projects/library/).

## Check that it worked

The sync status badge sits in the top bar and stays hidden unless Typeward is tracking a cloud-backed project.

1. Open the cloud-backed project. The badge reads **Synced** once the first pull finishes.
2. Edit a file and save it. The badge shows **Pushing…**, then returns to **Synced**.
3. Open the remote folder in your server's own interface. Your saved file is there.

The badge shows the worst state across what it tracks.

| Badge | What it means |
| --- | --- |
| **Synced** | Nothing in flight. Local and remote agree as of the last pass |
| **Pulling…** and **Pushing…** | A pass is running |
| **Offline, will retry** | The server could not be reached. Pull retries at the next poll; push backs off from 15 seconds up to 5 minutes, and a successful pull resets it to fast |
| **Sync off** | This project remembers a WebDAV account that has no credentials on this machine. Select the badge to open **Settings → Integrations → Cloud storage** |
| **Sync error** | Something else failed. Select the badge for a toast with the detail |
| **2 conflicts** | Files changed on both sides. The number counts unresolved files. Select the badge to open the resolver |

Connection trouble is deliberately not treated as an error. Dropped connections, timeouts, and DNS failures land in **Offline, will retry** and keep retrying, and sync never gives up on its own.

## Know when Typeward syncs

Typeward runs exactly two cadences, and no control in the app forces a pass.

- Pull: once as soon as the project opens, then every 60 seconds for as long as it stays open. WebDAV offers no change feed for files, so each poll re-walks the remote folder and compares revisions against the last snapshot.
- Push: on save. Autosave is on by default at a 500 ms idle pause, and uploads coalesce on a further 1.5 second debounce. An edit typically reaches the server about two seconds after you stop typing.

With autosave off, only real saves push: `Ctrl+S` (`Cmd+S` on macOS), which is **Save and compile**, and the save-all that runs before a compile. Crash-recovery snapshots never push. See [Autosave and crash recovery](/projects/autosave-recovery/).

Opening a project also runs a catch-up pass. Typeward compares every tracked file against the hash it recorded at the last sync and re-queues anything that diverged. That recovers pushes lost to an offline save, a project switch, or a quit at the wrong moment. Tracked files that are now missing locally are deleted on the server in the same pass.

## Resolve a conflict

A conflict is a file that changed on both sides: your copy changed locally, and the server's revision changed too, since the last successful sync. Typeward compares the recorded content hash and the server revision rather than trusting file timestamps alone, so a touched but unchanged file is never a conflict. For a file with no recorded baseline on either side, timestamps more than a second apart count as a conflict.

The resolution rule is newest wins, and the loser is always kept.

- The copy with the newer modification time stays at the real path.
- Typeward writes the other copy beside it as `<name>.conflict-<timestamp><extension>`, for example `main.conflict-2026-05-22T18-30-00-000Z.tex`. The timestamp is the ISO time with colons and dots replaced by hyphens, milliseconds included.
- If the file was deleted on the server while you edited it locally, your copy is preserved as that conflict copy before the original path is removed.

Typeward never attempts a three-way merge, because sync carries arbitrary text and binary files that a wrong merge would corrupt silently. Both versions survive, and you decide.

The first conflict of a run raises a toast titled `Sync conflict in "main.tex"`, with the body "Both this device and the cloud copy changed. The other version is kept beside yours." and a **Resolve** action. Further conflicts stay quiet, because the badge count already carries them. Conflicts stay on the badge until you resolve each one, and a later clean pass never clears them.

Select **Resolve** on the toast, or select the badge, to open **Resolve sync conflicts (N)**. The dialog is described as "The cloud and local copies diverged for these files. Keep one, or open both to merge by hand." Each row shows the file path and, underneath, "Other copy:" with the conflict copy's name. Each row offers three actions.

| Action | What it does | Confirmation |
| --- | --- | --- |
| **Keep mine** | Deletes the conflict copy and keeps what is at the real path | `Delete the conflict copy "<path>"? This is the only saved copy of the other version.`, with the button **Delete other copy** |
| **Keep theirs** | Overwrites the file with the conflict copy's content, deletes the conflict copy, and reloads the tab if the file is open | `Replace your local "<path>" with the remote version? Your local edits will be lost.`, with the button **Replace local copy** |
| **Open both** | Loads the original and the conflict copy as editor tabs so you can merge by hand | None |

**Open both** is usually what you want for a `.tex` or `.typ` file. Save the merged file and the merge uploads like any other save, then clear the conflict copy with **Keep mine**.

If the conflict copy has already been removed, the row says so instead of offering a path. When nothing is outstanding the dialog reads "No outstanding conflicts." Close it with **Close**.

## Plan around the limits

| Limit | Value |
| --- | --- |
| File size, either direction | 256 MB |
| Folder listing response | 32 MB |
| Entries in the remote tree | 20,000 |
| Connect timeout | 15 seconds |
| Stall timeout | 60 seconds without data, not a deadline for the whole transfer, so large files on a slow uplink still finish |

Exceeding the tree cap fails the pass with "Remote folder listing exceeded 20000 entries. Pick a narrower project folder, or check the server for a directory loop." Because every poll walks the whole tree, point sync at a project folder rather than at the root of everything you own.

Several safeguards run without any action from you.

- An upload of a file that has synced before carries the revision Typeward last saw. If another device changed it inside the poll window, the server refuses and the upload is skipped rather than overwriting the other edit: `"<file>" changed on the server since it was last synced; the upload was skipped so the remote edit isn't overwritten. It will be reconciled on the next pull.` The next pull turns it into a normal conflict, with both copies kept.
- Missing parent folders on the server are created automatically on upload.
- The sync cursor and the file manifest are written by atomic replace, so a crash or a power cut cannot leave a half-written baseline.
- A baseline that exists but cannot be read stops the engine, which says so on the badge instead of starting from a blank slate. Starting fresh would risk resurrecting files you deleted remotely and would lose conflict detection.
- An operational failure aborts the pull without advancing the cursor, so the change is picked up again next time.
- After three failed attempts at the same batch, the entries that work are applied and the rest are recorded as pending retries, retried at the head of every later pull.
- Hostile remote entries are skipped one by one and logged. Absolute paths, `..` traversal, Windows drive prefixes, and anything aimed at the project's `.typeward` folder never touch your disk, and one bad entry cannot wedge the rest of the sync.

## If it does not work

1. Confirm the cloud-backed project is open. Sync runs only for the project you are working in.
2. Read the sync status badge in the top bar. **Offline, will retry** means the server could not be reached and Typeward is still retrying, so no action is needed.
3. Select the badge when it reads **Sync error**, and read the detail in the toast.
4. Reconnect the account under **Settings → Integrations → Cloud storage** when the badge reads **Sync off**.
5. Open any file that never uploaded and save it once in Typeward, because saving through the editor is what queues a file for upload.
6. Read the badge for "N file(s) couldn't be synced and will be retried". The usual cause on Windows is a remote file whose name Windows reserves, such as `aux.tex`.

## Disconnect a server or delete a project

**Disconnect** on the account row removes the keyring credential and the account from settings. Projects bound to it keep working: they open, edit, and compile as ordinary local folders. The badge shows **Sync off** with "WebDAV isn't connected on this machine. Reconnect it in Settings to resume syncing. Your files stay safe locally." Reconnect the same server URL and username to resume where you left off. A disconnect that fails raises the toast "Couldn't disconnect WebDAV".

Deleting a cloud-backed project on this machine never touches the server. The **Delete permanently** dialog says so directly: "The remote copy on your cloud provider stays untouched." To remove the remote copy, delete it from your server's own interface.

## Sync with a desktop client instead

Typeward's own sync is optional, and a Typeward project is an ordinary folder. Putting your projects root inside a folder that a desktop sync client already watches works: Nextcloud, Dropbox, Syncthing, OneDrive, iCloud Drive, or a NAS client. That is the simpler option if you already run one of those.

What you trade away:

- Conflict handling is the sync client's, not Typeward's, so you get its conflicted-copy naming and its rules, and Typeward's conflict badge and resolver never appear.
- The project's `.typeward` folder syncs along with everything else unless you exclude it, so crash-recovery snapshots and the citation cache travel between machines. They are not designed to.
- A client that syncs during a compile can pick up half-written `.aux` and `.pdf` output. Excluding auxiliary files and the PDF from the client avoids the churn.

## See also

- [Autosave and crash recovery](/projects/autosave-recovery/)
- [Version history](/projects/version-history/)
- [Git in Typeward](/projects/git/)
- [The projects library](/projects/library/)
- [Privacy and network behavior](/reference/privacy-and-network/)
- [Data locations, credentials, and uninstall](/reference/data-locations/)
