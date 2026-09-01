import { describe, expect, it } from 'vitest'

import { DEFAULT_CONTEXT } from '../../src/context/defaults.js'
import { ValidationError, validateContext } from '../../src/validation/schema.js'
import type { ProjectContext } from '../../src/context/types.js'

function buildContext(overrides: Partial<ProjectContext> = {}): ProjectContext {
  return {
    ...DEFAULT_CONTEXT,
    projectName: 'my-app',
    projectPath: 'my-app',
    ...overrides,
  }
}

describe('validateContext', () => {
  it('accepts a valid default context', () => {
    expect(() => validateContext(buildContext())).not.toThrow()
  })

  it('rejects invalid project names', () => {
    expect(() => validateContext(buildContext({ projectName: 'My App!' }))).toThrow(
      ValidationError,
    )
    expect(() => validateContext(buildContext({ projectName: '-leading-dash' }))).toThrow(
      ValidationError,
    )
  })

  it('accepts scoped package names', () => {
    expect(() => validateContext(buildContext({ projectName: '@scope/my-app' }))).not.toThrow()
  })

  it('rejects unknown runtime', () => {
    expect(() =>
      validateContext(buildContext({ runtime: 'deno' as never })),
    ).toThrow(/Invalid runtime/)
  })

  it('rejects unknown framework', () => {
    expect(() =>
      validateContext(buildContext({ framework: 'koa' as never })),
    ).toThrow(/Invalid framework/)
  })

  it('rejects empty projectPath', () => {
    expect(() => validateContext(buildContext({ projectPath: '' }))).toThrow(
      /projectPath is required/,
    )
  })
})
