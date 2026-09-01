import { describe, expect, it } from 'vitest'

import { resolveDependencies, type TemplateMeta } from '../../src/resolver/dependency.js'

describe('resolveDependencies', () => {
  it('merges dependencies, scripts and env from all modules', () => {
    const metas: TemplateMeta[] = [
      {
        name: 'base',
        type: 'base',
        scripts: { dev: 'tsx watch src/index.ts' },
        devDependencies: { typescript: '^5.7.3' },
      },
      {
        name: 'elysia',
        type: 'framework',
        dependencies: { elysia: '^1.3.0' },
      },
      {
        name: 'prisma',
        type: 'orm',
        dependencies: { '@prisma/client': '^6.0.0' },
        devDependencies: { prisma: '^6.0.0' },
        env: { DATABASE_URL: 'mysql://user:password@localhost:3306/app' },
      },
    ]

    const result = resolveDependencies(metas)
    expect(result.dependencies).toEqual({
      elysia: '^1.3.0',
      '@prisma/client': '^6.0.0',
    })
    expect(result.devDependencies).toEqual({
      typescript: '^5.7.3',
      prisma: '^6.0.0',
    })
    expect(result.scripts).toEqual({ dev: 'tsx watch src/index.ts' })
    expect(result.env).toEqual({
      DATABASE_URL: 'mysql://user:password@localhost:3306/app',
    })
  })

  it('later modules override earlier entries', () => {
    const metas: TemplateMeta[] = [
      { name: 'a', type: 'runtime', scripts: { dev: 'old' } },
      { name: 'b', type: 'runtime', scripts: { dev: 'new' } },
    ]
    expect(resolveDependencies(metas).scripts.dev).toBe('new')
  })

  it('returns empty records for empty input', () => {
    expect(resolveDependencies([])).toEqual({
      dependencies: {},
      devDependencies: {},
      scripts: {},
      env: {},
    })
  })
})
