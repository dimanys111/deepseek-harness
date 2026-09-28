/**
 * The Russian language pack registers its language definition and dictionaries
 * through the locale registry, falls back to English for uncovered keys, and
 * removes both on unload.
 */
import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { apply, DICTIONARIES, inject } from '../src/client/index.ts'
import { LOCALE_ID } from '../src/client/locales.ts'

async function bench(preference?: string) {
  const ctx = new Context()
  const locale = new LocaleRuntime(ctx, undefined, preference === undefined ? undefined : { languages: [], preference })
  ctx.provide('locale', locale)
  const fiber = ctx.plugin({ inject, apply })
  await fiber.await()
  return { ctx, locale, fiber }
}

describe('russian language pack', () => {
  it('registers the ru language with its dictionaries', async () => {
    const b = await bench()
    try {
      expect(b.locale.getSnapshot().locales.map(l => l.id)).toContain(LOCALE_ID)
      b.locale.setLocale(LOCALE_ID)
      expect(b.locale.getSnapshot().active).toBe(LOCALE_ID)
      expect(b.locale.bind('settings.locale')('language.title')).toBe('Язык')
      expect(b.locale.bind('subagent')('mode.oneShot')).toBeDefined()
      expect(DICTIONARIES.length).toBeGreaterThan(0)
    } finally {
      await b.fiber.dispose()
    }
  })

  it('falls back to English for keys the Russian dictionaries omit', async () => {
    const b = await bench(LOCALE_ID)
    try {
      b.locale.register('probe', 'en', { only: 'English only' })
      expect(b.locale.bind('probe')('only')).toBe('English only')
    } finally {
      await b.fiber.dispose()
    }
  })

  it('removes the language and dictionaries on unload', async () => {
    const b = await bench(LOCALE_ID)
    expect(b.locale.getSnapshot().active).toBe(LOCALE_ID)
    await b.fiber.dispose()
    expect(b.locale.getSnapshot().locales.map(l => l.id)).not.toContain(LOCALE_ID)
    expect(b.locale.getSnapshot().active).toBe('en')
  })
})
