---
description: "记录持久化类型更改及其兼容性确认。"
kind: persistence-change
---

# 2026-09-25-subagent-default-route

[English](2026-09-25-subagent-default-route.md) | 中文

## 概述

为持久化的 `subagent/model-selection-policy` 会话事件及其投影新增可选的默认子路由，使会话能够记录在委派未指定提供方或模型时所使用的子模型。

## 目录

- [声明](#declaration)
- [兼容性](#compatibility)
- [验证](#verification)
- [开发备注](#dev-note)

<a id="declaration"></a>
## 声明

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
## 兼容性

新增的 `defaultRoute` 成员为可选，因此在其出现之前写入的 version-2 事件仍可解码与折叠：该成员缺失时，子代理沿用其已配置或继承的路由，与之前完全一致。由于事件模式发生变化，其根摘要发生变化，因此该确认记录在同一会话格式版本下记录，而非新版本。投影状态版本由 1 升至 2；投影将根据已记录事件重建，并同时接受旧日志中的裸路由列表与新对象形式。仅消费路由列表的读取方仍能看到允许的路由，现位于 `allowedModels` 下。

<a id="verification"></a>
## 验证

pnpm exec vitest run packages/subagent/tool-subagent/tests/model-selection.spec.ts packages/subagent/tool-subagent/tests/model-selection-settings.spec.ts packages/subagent/tool-subagent/tests/tool-subagent.spec.ts packages/subagent/tool-subagent/tests/list-models.spec.ts：4 个文件，121 项测试通过。pnpm run typecheck（tsc -b packages/subagent/tool-subagent）：通过。

<a id="dev-note"></a>
## 开发备注

无。
