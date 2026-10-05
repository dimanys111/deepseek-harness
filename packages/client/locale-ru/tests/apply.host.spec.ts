/**
 * The Russian language pack's node half is a pure roster row: it registers
 * nothing on the host and exists only so the plugin appears in the Loader.
 */
import { expect, it } from 'vitest'
import { apply } from '../src/index.ts'

it('keeps the Russian language pack Host Loader entry inert', () => {
  expect(apply).not.toThrow()
})
