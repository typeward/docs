---
title: AI assistant
description: "An optional AI assistant, off by default: local Ollama chat and editor actions, with credentials in the OS keyring and nothing sent until you ask."
---

This page explains what the AI assistant does, what turns it on, and what leaves your machine when you use it. Typeward can connect the editor to an AI provider that you configure and pay for yourself, and the assistant is off until you turn it on. For an on-device checker that flags one issue at a time instead, see [Grammar and spell checking](/editor/grammar-checking/).

## The master switch

The assistant is off in a fresh install, and one switch controls every AI surface in the app. While that switch is off:

- No chat pane appears, and the preview pane toolbar carries no **AI** toggle.
- The editor context menu shows no **AI** section, and the command palette shows no **AI** group.
- Typeward activates no provider, so no AI code path runs and no request goes out.

Compiling, preview, and navigation do not depend on the assistant.

To turn it on, open **Settings → Integrations → AI providers** and turn on **AI assistant**. The card is titled **AI**, and the master switch is its first row. Its hint reads **Master switch. Off removes the chat panel and its toolbar button from the editor and deactivates the provider below.** The provider rows appear once the switch is on.

In-app messages name this card **Settings → Integrations → AI**, after the card title, while the settings nav item is labeled **AI providers**. Both point at the same place.

Turning the switch back off takes effect at once. If the chat pane is open at that moment, the preview pane falls back to the PDF.

## Providers

A provider is the service that answers your messages, and exactly one is active at a time. Typeward implements four:

- **Claude (Anthropic)**
- **ChatGPT (OpenAI)**
- **Gemini (Google)**
- **Ollama (local)**

The three cloud providers answer under an API key that you supply. **Ollama (local)** runs on your own machine and needs no key.

## Known limitations

- **Settings** lists one provider row, **Ollama (local)**. Typeward ships the three cloud providers, streaming and key storage included, and the settings panel does not list them, so **Settings** takes no cloud API key.
- Neither the chat pane toggle nor any of the seven editor actions has a keyboard shortcut.
- A conversation takes its title from the first non-empty line of your first message, capped at 60 characters. There is no rename.

## Local models with Ollama

Ollama is a daemon that serves models from your own machine. Both setup steps happen outside Typeward: installation from [ollama.com](https://ollama.com), and a pulled model such as `gemma3` (`ollama pull gemma3`).

Typeward probes the daemon live rather than trusting a saved value. The **Ollama (local)** row reads **Checking…** while it probes, then **Detected · N models** with the first few model ids once the daemon answers. Select **Use this** to make Ollama the active provider, and the button then reads **Active**.

If the daemon is not running, the row reads **Not reachable**. Its explanation reads **Ollama isn't running. Install it from ollama.com, pull a model (e.g. `ollama pull gemma3`), and it's detected automatically; no setup needed.** Once the daemon is running, **Re-check** picks it up.

Typeward looks for the daemon at `http://localhost:11434`. If yours listens on another port on the same machine, type the address into **Custom URL (optional)**. The address must be a loopback address. The backend permits plaintext HTTP only to loopback hosts, and only on paths under `/api/`, so it refuses a LAN or remote Ollama URL.

Model names come from the daemon itself and include the parameter size, for example `llama3 (8B)`. Whatever you have pulled is what the model picker offers.

## API keys and the keyring

An API key is the credential a cloud provider requires, and you supply your own. Typeward stores such a key in the operating system keyring, never in `settings.json`. The store is Windows Credential Manager on Windows, the macOS Keychain on macOS, and the Secret Service on Linux and BSD. Each key is filed under the service name for its provider: `typeward.anthropic`, `typeward.openai`, or `typeward.gemini`.

The frontend can write, probe, and delete a key, and never read one. Typeward attaches the request header in the Rust backend, so the key never crosses into the web layer. Each key is pinned to its provider's host, so it cannot be sent anywhere else.

Ollama needs no key and has no keyring entry.

## The chat pane

The chat pane is a conversation with the active provider, shown in place of the PDF. With the assistant on, the preview pane toolbar gains an **AI** toggle (the sparkles icon) that swaps the PDF for the chat and back. While a reply is streaming the toggle carries a small activity dot, so you can switch back to the PDF and still see that the model is answering.

**Ask the assistant…** is the composer placeholder. Send with the **Send** button or `Ctrl+Enter` (`Cmd+Enter` on macOS). Replies stream in as they are generated. **Stop** ends a stream and keeps whatever text arrived, marked with a **stopped** badge.

The header carries the provider label, a conversation switcher, and a model picker. Typeward fetches model lists from the provider each time rather than hardcoding them, so a retired model never lingers in the picker. If the list cannot load, the picker reads **Models unavailable**. With no provider active, the pane shows **No AI provider configured** and points you at **Settings**.

Hovering a reply reveals **Copy message**, plus three actions that reach the editor:

- **Insert at cursor** inserts the whole reply, or only the block body when the reply is exactly one fenced code block.
- **Apply to selection (diff preview)** opens the same diff dialog the editor actions use, with the reply as the result and no request sent. Without a selection the button reads **Apply to selection (select text in the editor first)** and is disabled.
- **Regenerate**, on the last reply only, drops that reply and streams again with the selected provider and model.

Replies render as sanitized Markdown, with a **Copy** button on every fenced code block. Links and images in model output never render as links or images. Typeward strips those tags before display, so link text appears as plain text and nothing in a reply can navigate anywhere or fetch a remote resource. That is deliberate, because Typeward treats model output as untrusted remote content.

## Conversations

A conversation is one thread of messages, saved with the project it belongs to. Typeward writes them as JSONL files in the project's `.typeward` folder, under `.typeward/ai/conversations/`. It keeps the newest 30 per project and removes older files when you start a new one.

The history dropdown in the chat header lists this project's conversations, with **New conversation** at the top and a trash button on each row. Deleting asks first, with the message `Delete the conversation "<title>"? This permanently removes its saved history and cannot be undone.` and the buttons **Delete** and **Cancel**.

Switching projects while the pane is open aborts any reply in flight, writes pending saves to the project you are leaving, and loads the new project's conversations. With no project open the assistant still works, and the conversation lives only in memory.

The project's `.typeward` folder never travels: Typeward excludes it from [git](/projects/git/), [cloud sync](/projects/cloud-sync/) rejects it, and [project exports](/projects/exports/) skip it. Chat history stays on the machine that produced it.

## Image attachments

An image attachment is a picture sent along with a chat message, and only some models accept one. When the selected model does, an **Attach image** button appears in the composer, and you can also paste an image straight into it. Typeward identifies the file from its bytes rather than its extension, and accepts PNG, JPEG, WebP, and GIF.

Four limits apply:

- 4 images per message, over which the toast reads **At most 4 images per message**.
- 5 MB per image, measured on the encoded payload.
- 15 MB per request in total, over which the error names the fix: remove an image or start a new conversation.
- 1568 px on the long edge, over which Typeward downscales the image before sending.

Downscaling keeps a JPEG as JPEG and re-encodes everything else as PNG. Anything rejected raises an **Image not attached** toast with the reason.

Typeward never writes image data to disk. The saved conversation records only the name, type, and size. A reloaded turn shows a placeholder instead of the picture. Its note reads **Image payloads aren't saved, so this image can't be re-sent after a reload.** Those placeholders are filtered out of outgoing requests as well, so a reloaded conversation cannot quietly re-upload anything.

Typeward assumes no vision support unless it can prove otherwise. It matches cloud models against a list of known vision-capable model ids, and asks an Ollama daemon directly what the model can do. When the answer is unclear, the attach button does not appear.

## Editor actions

An editor action runs the assistant over your selection without leaving the source pane. With the assistant on, an **AI** section appears in the [Editor context menu](/editor/context-menu/), and an **AI** group appears in the command palette, which opens with `Ctrl+K` (`Cmd+K` on macOS). The section holds seven actions.

| Action | What it does |
| --- | --- |
| **Rewrite** | Rewrites the selection for clarity and flow |
| **Fix grammar & style** | Corrects grammar, spelling, and awkward phrasing in the selection |
| **Make concise** | Tightens the selection without dropping information |
| **Expand** | Elaborates on the selection in the surrounding tone |
| **Continue writing** | Drafts the next passage from the cursor position |
| **Explain this** | Explains the selection in the chat pane, with overlapping compile diagnostics included, so it doubles as an explain-this-error action |
| **Ask about selection** | Opens the chat with the selection quoted, ready for your question |

Every action except **Continue writing** needs a selection. In the command palette the titles name their target, for example **Rewrite selection** and **Continue writing from cursor**.

### The diff dialog

The diff dialog is where a transform action lands before it touches your file. The four transform actions (**Rewrite**, **Fix grammar & style**, **Make concise**, **Expand**) never change the document on their own. They stream into a dialog that shows a read-only unified diff of the selection against the result. The dialog's line reads **Review the change, then replace the selection or insert below it.** It offers four buttons:

- **Replace** swaps the selection for the result.
- **Insert below** keeps the selection and adds the result after it.
- **Copy** puts the result on the clipboard.
- **Stop** ends the stream early, and what has arrived stays on screen.

If the selection changed while the action ran, **Replace** disables itself and says why: **The selection changed since this action started. Use Insert or Copy.** Insert and Copy remain available. An empty response shows **Nothing came back from the provider.**

**Continue writing** uses the same dialog with a plain-text preview instead of a diff, and its line reads **Review the draft, then insert it at the cursor.** It drops **Replace**, and offers **Copy** and **Insert at cursor** in place of **Insert below**, with **Stop** available while the stream runs.

**Explain this** and **Ask about selection** route into the chat pane instead, opening it. **Explain this** sends one visible message immediately, so what you see in the transcript is what was sent. **Ask about selection** quotes the selection into the composer, one `> ` prefix per line, and sends nothing until you add your question.

### Comparison with Harper grammar checking

**Fix grammar & style** is a rewrite by a language model, not a checker. Typeward also ships Harper, which runs on your machine with no network access and is likewise off until you turn it on. Harper flags deterministic issues in place, and the AI action rewrites a passage through your provider. Neither replaces the other. See [Grammar and spell checking](/editor/grammar-checking/).

## What a request contains

Typeward sends nothing in the background. A request happens only when you use the assistant:

- Sending a chat message.
- Invoking an editor action.
- Filling the model picker, which happens when the pane opens with a provider active.
- Verifying a key as you save it.

Every request goes to the provider you configured and to no one else.

A chat message sends the conversation's turns, your messages and the model's replies, plus any images still attached in this session. A plain chat message carries no document text, no file path, and no project metadata.

An editor action sends a bounded context, assembled in one place and capped piece by piece.

| Sent | Cap |
| --- | --- |
| The selected text | 16 KB |
| Up to 40 lines before and 40 lines after the selection | 3 KB per side |
| The file preamble: up to `\begin{document}` in LaTeX, the leading `#import` / `#set` / comment block in Typst, nothing in Markdown or plain text | 4 KB |
| The language label, for example `LaTeX` | none |
| For **Explain this** only: compile diagnostics overlapping the selection in the active file, plus a short raw-log excerpt | 4 KB together |

Typeward never includes file paths, the project name, or other files in the project.

Transform and continue actions add a fixed system prompt that pins the reply to raw replacement text. Beyond the model id, Typeward sends no generation parameters, so the provider's own defaults apply. Claude is the one exception: its API requires a reply limit, so Typeward sends `max_tokens` 4096 on every request.

## Privacy and network

- The assistant is off until you turn it on, and every AI surface in the app derives from that one switch.
- Requests go from your machine straight to the provider you configured. No Typeward server sits in the path, and there is no Typeward account.
- With Ollama, requests never leave the machine, because the backend allows plaintext HTTP only to loopback hosts and only under `/api/`.
- The backend enforces an allowlist of outbound hosts and re-checks it on every redirect hop. For AI that list is `api.anthropic.com`, `api.openai.com`, and `generativelanguage.googleapis.com`.
- API keys live in the OS keyring, and Typeward attaches each one to the request inside Rust, so they never reach the web layer.
- **Stop** aborts the HTTP request in the backend rather than letting it run to completion.
- Typeward prints AI failures to the developer console for local debugging. It writes nothing to a log file and transmits nothing, and the lines carry operation names such as `ai-chat-save`, never prompt or document content. Typeward has no telemetry and no crash reporting.

## See also

- [Privacy and network behavior](/reference/privacy-and-network/)
- [Editor context menu](/editor/context-menu/)
- [Grammar and spell checking](/editor/grammar-checking/)
