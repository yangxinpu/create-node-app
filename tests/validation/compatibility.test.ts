import { describe, expect, it } from 'vitest'

import { DEFAULT_CONTEXT } from '../../src/context/defaults.js'
import type { ProjectContext } from '../../src/context/types.js'
import {
  CompatibilityError,
  checkCompatibility,
  validateCompatibility,
} from '../../src/validation/compatibility.js'

function buildContext(overrides: Partial<ProjectContext> = {}): ProjectContext {
  return {
    ...DEFAULT_CONTEXT,
    projectName: 'my-app',
    projectPath: 'my-app',
    ...overrides,
  }
}

describe('checkCompatibility', () => {
  it('returns no issues for a plain context', () => {
    expect(
      checkCompatibility(buildContext({ framework: 'none', runtime: 'node' })),
    ).toEqual([])
  })

  it('errors when ORM is selected without a database', () => {
    const issues = checkCompatibility(buildContext({ orm: 'prisma', database: 'none' }))
    expect(issues.some((i) => i.level === 'error' && i.name === 'orm-requires-database')).toBe(
      true,
    )
  })

  it('warns when Elysia runs on Node', () => {
    const issues = checkCompatibility(buildContext({ framework: 'elysia', runtime: 'node' }))
    expect(
      issues.some((i) => i.level === 'warning' && i.name === 'elysia-runtime'),
    ).toBe(true)
  })
})

describe('validateCompatibility', () => {
  it('throws on error-level issues', () => {
    expect(() =>
      validateCompatibility(buildContext({ orm: 'drizzle', database: 'none' })),
    ).toThrow(CompatibilityError)
  })

  it('passes with warnings only', () => {
    expect(() =>
      validateCompatibility(buildContext({ framework: 'elysia', runtime: 'node' })),
    ).not.toThrow()
  })
})
