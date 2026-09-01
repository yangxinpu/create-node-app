import { describe, expect, it } from 'vitest'

import { DEFAULT_CONTEXT } from '../../src/context/defaults.js'
import { normalizeContext } from '../../src/context/normalize.js'

describe('normalizeContext', () => {
  it('fills defaults for missing fields', () => {
    const context = normalizeContext({ projectName: 'my-app' })
    expect(context).toEqual({
      ...DEFAULT_CONTEXT,
      projectName: 'my-app',
      projectPath: 'my-app',
    })
  })

  it('overrides defaults with provided values', () => {
    const context = normalizeContext({
      projectName: 'api',
      framework: 'hono',
      eslint: false,
    })
    expect(context.framework).toBe('hono')
    expect(context.eslint).toBe(false)
    expect(context.runtime).toBe('node')
  })

  it('ignores undefined values instead of overriding defaults', () => {
    const context = normalizeContext({
      projectName: 'api',
      framework: undefined,
      eslint: undefined,
    })
    expect(context.framework).toBe(DEFAULT_CONTEXT.framework)
    expect(context.eslint).toBe(DEFAULT_CONTEXT.eslint)
  })

  it('uses projectPath when provided', () => {
    const context = normalizeContext({ projectName: 'api', projectPath: '/tmp/api' })
    expect(context.projectPath).toBe('/tmp/api')
  })
})
