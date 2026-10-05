---
description: "Russian language pack for the dsh web client: registers the `ru` language and Russian dictionaries for the shared, settings, conversation, sidebar, plugin, and scheduling namespaces, falling back to English elsewhere."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-locale-ru

English | [中文](README.zh.md)

## Summary

`dsh-client-locale-ru` adds Russian to the Web GUI language selector. It registers the `ru` language through `ctx.locale.addLanguage` and supplies Russian dictionaries for the shared vocabulary, the settings pages, the conversation surfaces (the chat transcript and composer, subagents, plans, goals, questions, approvals, the model picker, commands, feedback, and skills), the trajectory and deliverables views, the sidebar panes, the plugin manager, and automation tasks. Every namespace without a Russian dictionary, and every key missing from a covered one, falls back to English through the language's declared fallback chain, so translation can proceed in batches.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

### Choosing Russian

Open Settings → General and pick Русский from the Language row. The selection applies immediately and persists like any other locale preference; a browser whose navigator asks for `ru` selects it automatically before an explicit choice arrives.

### Covered namespaces

The pack ships Russian copy for the shared `common` vocabulary (OK, Cancel, Save) and for these feature namespaces:

- **Settings** — `settings.locale` (the Language row), `settings` (the settings shell and General navigation), `settings.shell`, `settings.subagent`, `settings.theme` (Appearance and font size), `settings.agentLoop`, `settings.webSearch`, `settings.plugins`, `settings.models` (the model-provider cards and picker), `settings.account` (sign-in, balance, and onboarding), `settings.pluginInventory`, `settings.permission`, and `settings.agentPreset`.
- **Conversation** — `conversation` (the chat transcript, tool rows, attachments, and composer input), `subagent` (subagent navigation and child-transcript copy), `plan`, `goal`, `question` (question cards and plan review), `approval`, `model` (the model and reasoning-effort picker), `slash.menu`, `command`, `feedback`, `skill`, `trajectory` (the trajectory view), `deliverables` (turn changes and delivery cards), `job` (background jobs), `reference`, `workflowRun`, and `open-in-app`.
- **Sidebar and shell** — `sidebar`, `sidebarRight` (the right dock, split panes, and tabs), `sidebarBrowser`, `sidebarFiles`, `sidebarTerminal`, `sidebarDocumentPreview`, `workspace` (workspace and session lists), and `shortcuts`.
- **Plugins and scheduling** — `pluginManager` (install, enable, and uninstall flows) and `schedule.catalog`/`schedule.manager` (reminders and automation tasks).

Namespaces outside this set render in English.

### Extending the pack

Add a dictionary to `src/client/locales.ts`, list its namespace in `DICTIONARIES`, and the effect registers it on load. The single-locale registration form takes a partial dictionary: keys it omits fall through to English.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The browser half declares `inject = ['locale']` and registers owned effects: one `ctx.locale.addLanguage({ id: 'ru', label: 'Русский', fallback: 'en' })` definition, and one `ctx.locale.register(ns, 'ru', dict)` call per covered namespace. Both return idempotent disposers, so unloading the plugin removes the language and its dictionaries and returns an active `ru` selection to the available browser or default locale.

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

- [dsh-client-locale](../locale/README.md) — the registry, language definitions, and fallback lookup this pack registers into.
- [Client package map](../README.md) — adjacent browser UI packages.

-----

<a id="model-experience"></a>
## Model Experience

None, as this pack is a browser-side dictionary contribution that registers nothing model-facing.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work
<a id="known-limitations-and-deferred-work"></a>

These limits define the current pack. They are current constraints, not a task backlog.

- **Translation coverage is partial by design** — only the namespaces listed above are translated; the rest render in English until dictionaries are added.
- **No plural rules** — the registry supplies key fallback only; Russian plural forms for count-sensitive keys are resolved by the owning namespace, not here.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
