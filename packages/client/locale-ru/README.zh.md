---
description: "dsh Web 客户端的俄语语言包：注册 `ru` 语言定义，并为共享、设置、会话、侧边栏与插件等命名空间提供俄语词典，其余内容回退到英语。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-locale-ru

[English](README.md) | 中文

## 概述

`dsh-client-locale-ru` 为 Web 界面的语言选择器添加俄语。它通过 `ctx.locale.addLanguage` 注册 `ru` 语言，并通过语言注册表的按语言注册形式，为共享词汇、设置页面、会话界面（对话正文与输入框、子智能体、计划、目标、问题、审批、模型选择、命令、反馈与技能）、轨迹与交付视图、侧边栏面板、插件管理器以及自动化任务提供俄语词典。没有俄语词典的命名空间——以及已覆盖命名空间中缺失的键——都会沿语言声明的回退链落到英语，因此可以分批翻译。该包随客户端树在 Web 名单上挂载，紧邻 locale 服务。

## 目录

- [使用本包](#use-this-package)
- [了解实现](#understand-the-implementation)
- [延伸阅读](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与待办](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

### 选择俄语

打开「设置 → 通用」，在语言行中选择 Русский。选择立即生效，并像其他语言偏好一样持久保存；当浏览器 navigator 请求 `ru` 时，会在显式选择到来前自动选中它。

### 已覆盖的命名空间

本包为共享的 `common` 词汇（OK/取消/保存）以及以下功能命名空间提供俄语：

- **设置** — `settings.locale`（语言行）、`settings`（设置外壳与通用导航）、`settings.shell`、`settings.subagent`、`settings.theme`（外观与字号）、`settings.agentLoop`、`settings.webSearch`、`settings.plugins`、`settings.models`（模型服务商卡片与选择器）、`settings.account`（登录、余额与引导）、`settings.pluginInventory`、`settings.permission` 与 `settings.agentPreset`。
- **会话** — `conversation`（对话正文、工具行、附件与输入框）、`subagent`（子智能体导航与子会话文案）、`plan`、`goal`、`question`（问题卡片与计划审核）、`approval`、`model`（模型与推理等级选择器）、`slash.menu`、`command`、`feedback`、`skill`、`trajectory`（轨迹视图）、`deliverables`（回合改动与交付卡片）、`job`（后台任务）、`reference`、`workflowRun` 与 `open-in-app`。
- **侧边栏与外壳** — `sidebar`、`sidebarRight`（右侧停靠区、分栏与标签页）、`sidebarBrowser`、`sidebarFiles`、`sidebarTerminal`、`sidebarDocumentPreview`、`workspace`（工作区与会话列表）与 `shortcuts`。
- **插件与调度** — `pluginManager`（安装、启用与卸载流程）以及 `schedule.catalog`/`schedule.manager`（提醒与自动化任务）。

此集合之外的命名空间以英语呈现。

### 扩展本包

在 `src/client/locales.ts` 中新增词典，并在 `DICTIONARIES` 中列出其命名空间，效果会在加载时注册它。按语言注册形式接受部分词典：它省略的键会落到英语，因此可以分批翻译同一命名空间。

-----

<a id="understand-the-implementation"></a>
## 了解实现

<details>
<summary>实现细节 — 点击展开</summary>

浏览器半边声明 `inject = ['locale']`，并注册两类自有副作用：一个 `ctx.locale.addLanguage({ id: 'ru', label: 'Русский', fallback: 'en' })` 定义，以及每个已覆盖命名空间一次 `ctx.locale.register(ns, 'ru', dict)` 调用。两者都返回幂等的清理函数，因此卸载插件会从注册表中移除该语言及其词典，并将处于活动状态的 `ru` 选择恢复到可用的浏览器或默认语言。

</details>

-----

<a id="further-exploration"></a>
## 延伸阅读

- [dsh-client-locale](../locale/README.zh.md) — 本包注册所依据的注册表、语言定义与回退查找。
- [客户端包地图](../README.zh.md) — 相邻的浏览器界面包。

-----

<a id="model-experience"></a>
## 模型体验

无。本包是浏览器端的词典贡献，不注册任何面向模型的内容。

#### KV Cache 影响

无；本包既不组装也不发送提供方请求。

## 已知限制与待办
<a id="known-limitations-and-deferred-work"></a>

这些限制界定了当前语言包。它们是当前约束，而不是任务清单。

- **翻译覆盖有意保持局部** — 仅上述命名空间已翻译；其余在添加词典前以英语呈现。
- **没有复数规则** — 注册表只提供键回退；计数相关键的俄语复数形式由所属命名空间处理，而非本包。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者的工作上下文 — 点击展开</summary>

无。

</details>
