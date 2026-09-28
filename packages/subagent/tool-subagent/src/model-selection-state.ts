/** Durable per-session state for the user-controlled model-selection opt-in. */

import { z as zod } from 'zod'
import type { Session } from '@deepseek-ai/dsh-session'
import type SessionProjectionRegistry from '@deepseek-ai/dsh-session-projection'
import type { ProjectionDefinition } from '@deepseek-ai/dsh-session-projection'
import { assertAllowedModelRoutes, assertAllowedDefaultRoute, type AllowedModelRoute } from './model-selection.ts'

declare module '@deepseek-ai/dsh-session/types' {
  interface SessionEventMap {
    /**
     * Records that this session's delegation tool exposes child provider,
     * model, and reasoning-effort selection. Appended before the first model
     * request; absence means the fixed-route definition. Log-only: it carries
     * no `surfaceOp` and never enters model history.
     */
    'subagent/model-selection-policy': {
      /** Exact routes this Session may select explicitly for a child. */
      allowedModels: AllowedModelRoute[]
      /** Child route used when a delegation names no provider and model. */
      defaultRoute?: AllowedModelRoute
    }
  }
}

/** Durable child-selection policy recorded for one Session. */
export interface SubagentModelSelectionPolicy {
  /** Exact routes this Session may select explicitly for a child. */
  allowedModels: AllowedModelRoute[]
  /** Child route used when a delegation names no provider and model. */
  defaultRoute?: AllowedModelRoute | undefined
}

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionStateMap {
    /** Child LLM selection policy, or null when disabled. */
    subagentModelSelectionPolicy: SubagentModelSelectionPolicy | null
  }
}

const routeSchema = zod.object({
  provider: zod.string().min(1),
  model: zod.string().min(1),
}).strict()

const modelSelectionPolicySchema: zod.ZodType<SubagentModelSelectionPolicy | null> = zod.object({
  allowedModels: zod.array(routeSchema).min(1),
  defaultRoute: routeSchema.optional(),
}).strict().nullable()

/** Host-only projection of the durable model-selection policy. */
export const subagentModelSelectionProjectionDefinition = {
  key: 'subagentModelSelectionPolicy',
  stateVersion: 2,
  stateSchema: modelSelectionPolicySchema,
  init: () => null,
  apply: (policy, event) => {
    if (policy !== null || event.type !== 'subagent/model-selection-policy') return policy
    const { allowedModels, defaultRoute } = event.data
    assertAllowedModelRoutes(allowedModels)
    if (allowedModels.length === 0) {
      throw new Error('subagent/model-selection-policy requires at least one route')
    }
    assertAllowedDefaultRoute(allowedModels, defaultRoute)
    return defaultRoute === undefined ? { allowedModels } : { allowedModels, defaultRoute }
  },
} satisfies ProjectionDefinition<'subagentModelSelectionPolicy', SubagentModelSelectionPolicy | null>

/**
 * Read the exact route list captured for a model-selectable definition.
 * @param projections - registry that owns the policy projection.
 * @param session - session whose durable decision is read.
 * @returns a detached route list, or undefined for the fixed-route definition.
 */
export function subagentModelSelectionPolicy(
  projections: Pick<SessionProjectionRegistry, 'stateOf'>,
  session: Session,
): SubagentModelSelectionPolicy | undefined {
  const policy = projections.stateOf(session, 'subagentModelSelectionPolicy')
  if (policy === null || policy === undefined) return undefined
  return policy.defaultRoute === undefined
    ? { allowedModels: policy.allowedModels.map(route => ({ ...route })) }
    : {
      allowedModels: policy.allowedModels.map(route => ({ ...route })),
      defaultRoute: { ...policy.defaultRoute },
    }
}

/**
 * Append the selection policy once, before its definition can reach a model request.
 * @param projections - registry that owns the policy projection.
 * @param session - session receiving the model-selectable definition.
 * @param allowedModels - exact routes the definition may select explicitly.
 * @param defaultRoute - optional child route used when a delegation names no route.
 */
export function recordSubagentModelSelection(
  projections: Pick<SessionProjectionRegistry, 'stateOf'>,
  session: Session,
  allowedModels: readonly AllowedModelRoute[],
  defaultRoute?: AllowedModelRoute,
): void {
  if (subagentModelSelectionPolicy(projections, session) !== undefined) return
  session.append('subagent/model-selection-policy', defaultRoute === undefined
    ? { allowedModels: allowedModels.map(route => ({ ...route })) }
    : { allowedModels: allowedModels.map(route => ({ ...route })), defaultRoute: { ...defaultRoute } })
}
