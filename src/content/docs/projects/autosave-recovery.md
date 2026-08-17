---
title: Autosave and crash recovery
description: How Typeward keeps unsaved edits when the app closes without warning, what the recovery dialog offers, and where snapshots live on disk.
---

This page explains how Typeward holds on to edits that never reached disk, and how to recover them after a crash or a power cut. To recover a state you already saved and then overwrote, see [Version history](/projects/version-history/). Both safety nets described here are local to the machine you are typing on.

## Recovery after a crash

Reopen the project. What you get back depends on the **Autosave** setting that was in force when the app stopped.

- **Autosave** was on, the default: Typeward wrote the file to disk after each idle pause while you typed.
- **Autosave** was off: Typeward opens a **Recover unsaved changes?** dialog listing every file that holds buffered edits.
- No dialog opens: nothing was unsaved to recover.

## The recovery dialog

**Recover unsaved changes?** opens when Typeward finds snapshots newer than the file they belong to, or whose file is gone. Each row names one file and when its edits were buffered. Two buttons act on the whole list.

- **Restore all** puts each snapshot back into its open buffer and marks the file unsaved. Your next save rewrites the file on disk. The snapshots stay until that save clears them, so closing the app straight away leaves you a second chance.
- **Discard all** deletes the snapshots after a confirmation. The deletion is permanent, because the unsaved edits they hold are the only copy.

Snapshots older than their file never appear in the dialog. The file was saved after the snapshot was taken, so the snapshot holds nothing new. Typeward deletes those on the same pass.

## Autosave

**Autosave** is the **Settings → Editor** toggle that writes the active file to disk after a short idle pause, and it is on by default. **Autosave delay** sets the length of that pause in the same place: 300, 500, 1000, or 2000 ms, with 500 ms as the default.

An autosave is a real save, taking the same conflict-guarded write path as `Ctrl+S` (`Cmd+S` on macOS). Compiling is the one difference. `Ctrl+S` runs **Save and compile** and always compiles after saving, while an autosave compiles only when **Auto-compile on save** is on.

Autosave follows the file you are editing. If you switch tabs while an edit is still inside the idle pause, Typeward flushes that edit on the way out. A fast tab switch keeps the last few hundred milliseconds of typing.

## Crash recovery snapshots

A snapshot is the raw text of a buffer whose edits are not on disk. With **Autosave** off, the same idle pause writes one here instead of saving:

```
<project>/.typeward/snapshots/<path/to/file>.<ext>.snap
```

The snapshot holds your text and nothing else, so any editor opens it if you ever need it outside Typeward. Typeward clears a snapshot the moment the file is saved for real, so a snapshot exists only while you have unsaved work.

:::note
Snapshots live in the project's `.typeward` folder, which Typeward keeps out of git commits and project exports.
:::

## Safety nets by situation

Different kinds of loss are covered by different mechanisms, and only the first one is crash recovery.

| Situation | Covered by |
| --- | --- |
| You typed and never saved, then the app stopped | Crash recovery snapshot |
| You saved, then overwrote or mangled the file | [Version history](/projects/version-history/) |
| You saved, and want a checkpoint that carries a message | [Git in Typeward](/projects/git/), or any git client, because a project is a plain folder |
| You deleted the project folder | [Version history](/projects/version-history/), which lives in app data rather than in the project |

## See also

- [Version history](/projects/version-history/)
- [Git in Typeward](/projects/git/)
- [Settings reference](/reference/settings/)
- [Data locations, credentials, and uninstall](/reference/data-locations/)
