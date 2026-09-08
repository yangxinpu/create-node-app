import { describe, expect, it } from 'vitest'

import { DEFAULT_CONTEXT } from '../../src/context/defaults.js'
import type { ProjectContext } from '../../src/context/types.js'
import { resolveTemplates } from '../../src/resolver/template.js'

function buildContext(overrides: Partial<ProjectContext> = {}): ProjectContext {
  return {
    ...DEFAULT_CONTEXT,
    projectName: 'my-app',
    projectPath: 'my-app',
    ...overrides,
  }
}

describe('resolveTemplates', () => {
  it('always includes base, runtime and architecture', () => {
    const templates = resolveTemplates(buildContext())
    expect(templates).toContain('base/typescript')
    expect(templates).toContain('runtimes/node')
    expect(templates).toContain('architecture/minimal')
  })

  it('skips none-valued selections', () => {
    const templates = resolveTemplates(buildContext())
    expect(templates.some((t) => t.startsWith('databases/'))).toBe(false)
    expect(templates.some((t) => t.startsWith('orm/'))).toBe(false)
    expect(templates.some((t) => t.startsWith('cache/'))).toBe(false)
  })

  it('includes full stack selections', () => {
    const templates = resolveTemplates(
      buildContext({
        framework: 'elysia',
        database: 'mysql',
        orm: 'prisma',
        cache: 'redis',
        eslint: true,
        prettier: true,
        docker: true,
        architecture: 'api',
      }),
    )
    expect(templates).toEqual([
      'base/typescript',
      'runtimes/node',
      'frameworks/elysia',
      'databases/mysql',
      'orm/prisma',
      'cache/redis',
      'tooling/eslint',
      'tooling/prettier',
      'tooling/docker',
      'architecture/api',
    ])
  })

  it('skips disabled tooling', () => {
    const templates = resolveTemplates(buildContext({ eslint: false, prettier: false }))
    expect(templates.some((t) => t.startsWith('tooling/'))).toBe(false)
  })
})
