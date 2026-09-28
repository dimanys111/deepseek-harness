/** Host-owned opt-in setting for model-selectable subagent delegation. */
import type { Volatile } from '@deepseek-ai/cordis'

import { Context, Service } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import {
  AllowedModelRouteSchema,
  assertAllowedDefaultRoute,
  assertAllowedModelRoutes,
  type AllowedModelRoute,
} from './model-selection.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** User preference sampled when a new Session receives delegation tools. */
    subagentModelSelection: SubagentModelSelectionConfig
  }
}

/** Stored user preference; the shipped composition defaults it off. */
export interface SubagentModelSelectionSettings {
  /** Whether newly composed top-level Sessions receive model selection. */
  enabled: boolean
  /** Exact child LLM routes offered to newly composed top-level Sessions. */
  allowedModels: AllowedModelRoute[]
  /**
   * Child route used when a delegation makes no explicit selection. Absent
   * leaves the child on its configured or inherited route.
   */
  defaultRoute?: AllowedModelRoute
}

/** Optional deployment base for the preference. */
export interface Config {
  /** Initial enabled state inherited when the user document does not override it. */
  enabled: Volatile<boolean>
  /** Initial routes inherited when the user document does not override them. */
  allowedModels: Volatile<AllowedModelRoute[]>
  /** Provider of the initial child default route, or empty to inherit. */
  defaultProvider: Volatile<string>
  /** Model of the initial child default route, or empty to inherit. */
  defaultModel: Volatile<string>
}

/** Singleton settings owner read when delegation tools are composed for a Session. */
export class SubagentModelSelectionConfig extends Service {
  static Config = z.object({
    enabled: z.boolean().default(false).volatile(),
    allowedModels: z.array(AllowedModelRouteSchema).default([]).volatile(),
    defaultProvider: z.string().default('').volatile(),
    defaultModel: z.string().default('').volatile(),
  })

  constructor(ctx: Context, private config: Config) {
    super(ctx, 'subagentModelSelection')
  }

  /**
   * Read a detached selection preference for the next eligible Session composition.
   * @returns the enabled state and exact allowed routes.
   */
  current(): SubagentModelSelectionSettings {
    const enabled = this.config.enabled.get()
    const allowedModels = this.config.allowedModels.get()
    assertAllowedModelRoutes(allowedModels)
    if (enabled && allowedModels.length === 0) {
      throw new Error('enabled subagent model selection requires at least one allowed model')
    }
    const provider = this.config.defaultProvider.get()
    const model = this.config.defaultModel.get()
    if ((provider === '') !== (model === '')) {
      throw new Error('subagent default route requires both provider and model, or neither')
    }
    const rawDefault = provider === '' ? undefined : { provider, model }
    assertAllowedDefaultRoute(allowedModels, rawDefault)
    return {
      enabled,
      allowedModels: allowedModels.map(route => ({ ...route })),
      ...rawDefault === undefined ? {} : { defaultRoute: { ...rawDefault } },
    }
  }

}

export const name = 'subagent-model-selection-settings'
export default SubagentModelSelectionConfig
