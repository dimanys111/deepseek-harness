/**
 * Russian language pack, browser half: registers the `ru` language definition
 * and the Russian dictionaries it ships, each as an owned effect so unloading
 * the plugin removes them. Namespaces without a dictionary here fall back to
 * English through the language's declared fallback chain.
 */

import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import {
  LOCALE_FALLBACK, LOCALE_ID, LOCALE_LABEL,
  approval, command, common, conversation, deliverables, feedback, goal, job, model,
  openInApp, plan, pluginManager, question, reference, scheduleCatalog, scheduleManager,
  settings, settingsAccount, settingsAgentLoop, settingsAgentPreset, settingsLocale,
  settingsModels, settingsPermission, settingsPluginInventory, settingsPlugins,
  settingsShell, settingsSubagent, settingsTheme, settingsWebSearch, shortcuts, sidebar,
  sidebarBrowser, sidebarDocumentPreview, sidebarFiles, sidebarRight, sidebarTerminal,
  skill, slashMenu, subagent, trajectory, workflowRun, workspace,
} from './locales.ts'

export { LOCALE_FALLBACK, LOCALE_ID, LOCALE_LABEL } from './locales.ts'

/** Required services (cordis fiber inject). */
export const inject = ['locale']

/** Namespace to Russian dictionary, in registration order. */
export const DICTIONARIES: ReadonlyArray<readonly [string, Record<string, string>]> = [
  ['common', common],
  ['settings.locale', settingsLocale],
  ['settings', settings],
  ['settings.shell', settingsShell],
  ['settings.subagent', settingsSubagent],
  ['subagent', subagent],
  ['approval', approval],
  ['settings.theme', settingsTheme],
  ['goal', goal],
  ['plan', plan],
  ['question', question],
  ['skill', skill],
  ['model', model],
  ['slash.menu', slashMenu],
  ['command', command],
  ['feedback', feedback],
  ['settings.plugins', settingsPlugins],
  ['settings.agentLoop', settingsAgentLoop],
  ['settings.webSearch', settingsWebSearch],
  ['conversation', conversation],
  ['trajectory', trajectory],
  ['pluginManager', pluginManager],
  ['settings.models', settingsModels],
  ['workspace', workspace],
  ['deliverables', deliverables],
  ['settings.pluginInventory', settingsPluginInventory],
  ['job', job],
  ['sidebarRight', sidebarRight],
  ['shortcuts', shortcuts],
  ['settings.account', settingsAccount],
  ['settings.agentPreset', settingsAgentPreset],
  ['sidebarBrowser', sidebarBrowser],
  ['sidebarDocumentPreview', sidebarDocumentPreview],
  ['workflowRun', workflowRun],
  ['sidebarFiles', sidebarFiles],
  ['sidebar', sidebar],
  ['schedule.catalog', scheduleCatalog],
  ['schedule.manager', scheduleManager],
  ['open-in-app', openInApp],
  ['sidebarTerminal', sidebarTerminal],
  ['settings.permission', settingsPermission],
  ['reference', reference],
]

/**
 * Register the Russian language and its dictionaries with the locale registry.
 * @param ctx - the browser plugin context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(
    () => ctx.locale.addLanguage({ id: LOCALE_ID, label: LOCALE_LABEL, fallback: LOCALE_FALLBACK }),
    'ui-locale-ru: language definition',
  )
  for (const [ns, dict] of DICTIONARIES) {
    ctx.effect(
      () => ctx.locale.register(ns, LOCALE_ID, dict),
      'ui-locale-ru: ' + ns + ' dictionary',
    )
  }
}
