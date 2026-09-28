---
description: "Records a persistence type transition and its compatibility acknowledgement."
kind: persistence-change
---

# 2026-09-25-subagent-default-route

English | [中文](2026-09-25-subagent-default-route.zh.md)

## Summary

Adds an optional default child route to the durable `subagent/model-selection-policy` Session event and its projection, so a Session may record the child model used when a delegation names no provider or model.

## Table of Contents

- [Declaration](#declaration)
- [Compatibility](#compatibility)
- [Verification](#verification)
- [Dev Note](#dev-note)

<a id="declaration"></a>
## Declaration

```yaml persistence-change
schemaVersion: 1
id: 2026-09-25-subagent-default-route
baseline: false
changes:
  - root: "event:subagent/model-selection-policy"
    previous: "2026-09-11-initial"
    after: "8c425a7649fc61fca18ffb38a0212597e8638c5161b714d918dd228de090a100"
    decision: same-version
```

<a id="compatibility"></a>
## Compatibility

The new `defaultRoute` member is optional, so version-2 events written before it existed still decode and fold: an absent member leaves the child on its configured or inherited route, exactly as before. Because the event schema changed, its root digest moved, so the acknowledgement is recorded at the same Session format version rather than a new one. The projection state version advances from 1 to 2; the projection rebuilds from recorded events, and both a bare route list from older logs and the new object form are accepted. Readers that only consumed the route list still see the allowed routes, now under `allowedModels`.

<a id="verification"></a>
## Verification

pnpm exec vitest run packages/subagent/tool-subagent/tests/model-selection.spec.ts packages/subagent/tool-subagent/tests/model-selection-settings.spec.ts packages/subagent/tool-subagent/tests/tool-subagent.spec.ts packages/subagent/tool-subagent/tests/list-models.spec.ts: 4 files, 121 tests passed. pnpm run typecheck (tsc -b packages/subagent/tool-subagent): passed.

<a id="dev-note"></a>
## Dev Note

None.
