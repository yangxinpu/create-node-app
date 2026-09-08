import { describe, expect, it } from 'vitest'

import { DEFAULT_CONTEXT } from '../../src/context/defaults.js'
import type { ProjectContext } from '../../src/context/types.js'
import { buildTemplateVariables, renderContent } from '../../src/generator/render.js'

function buildContext(overrides: Partial<ProjectContext> = {}): ProjectContext {
  return {
    ...DEFAULT_CONTEXT,
    projectName: 'my-app',
    projectPath: 'my-app',
    ...overrides,
  }
}

describe('buildTemplateVariables', () => {
  it('includes basic context fields', () => {
    const vars = buildTemplateVariables(buildContext())
    expect(vars.projectName).toBe('my-app')
    expect(vars.runtime).toBe('node')
    expect(vars.framework).toBe('elysia')
  })

  it('includes prisma variables when database is set', () => {
    const vars = buildTemplateVariables(buildContext({ database: 'mysql' }))
    expect(vars.prismaDatasource).toBe('mysql')
    expect(vars.prismaUserModel).toContain('model User')
    expect(vars.prismaUserModel).toContain('autoincrement')
  })

  it('uses ObjectId for mongodb user model', () => {
    const vars = buildTemplateVariables(buildContext({ database: 'mongodb' }))
    expect(vars.prismaUserModel).toContain('ObjectId')
  })

  it('includes drizzle variables for sql databases', () => {
    const vars = buildTemplateVariables(buildContext({ database: 'postgresql' }))
    expect(vars.drizzleDialect).toBe('postgresql')
    expect(vars.drizzleTableFn).toBe('pgTable')
    expect(vars.drizzleCoreModule).toBe('drizzle-orm/pg-core')
  })

  it('does not include drizzle variables when database is none', () => {
    const vars = buildTemplateVariables(buildContext({ database: 'none' }))
    expect(vars.drizzleDialect).toBeUndefined()
  })
})

describe('renderContent', () => {
  it('replaces simple variables', () => {
    const result = renderContent('Hello {{projectName}}!', { projectName: 'world' })
    expect(result).toBe('Hello world!')
  })

  it('preserves unknown variables', () => {
    const result = renderContent('{{unknown}}', { projectName: 'test' })
    expect(result).toBe('{{unknown}}')
  })

  it('handles conditional blocks - true case', () => {
    const template = '{{#if runtime=node}}node code{{/if}}'
    const result = renderContent(template, { runtime: 'node' })
    expect(result).toBe('node code')
  })

  it('handles conditional blocks - false case', () => {
    const template = '{{#if runtime=node}}node code{{/if}}'
    const result = renderContent(template, { runtime: 'bun' })
    expect(result).toBe('')
  })

  it('handles multiple conditionals and variables', () => {
    const template = [
      '{{#if runtime=node}}import serve{{/if}}',
      '{{#if runtime=bun}}export default{{/if}}',
      'port: {{projectName}}',
    ].join('\n')
    const result = renderContent(template, { runtime: 'bun', projectName: 'app' })
    expect(result).toContain('export default')
    expect(result).not.toContain('import serve')
    expect(result).toContain('port: app')
  })

  it('renders comment-wrapped conditionals without leaving directives', () => {
    const template = [
      '// {{#if language=typescript}}',
      "import tseslint from 'typescript-eslint'",
      '// {{/if}}',
    ].join('\n')

    expect(renderContent(template, { language: 'typescript' })).toBe(
      "import tseslint from 'typescript-eslint'\n",
    )
    expect(renderContent(template, { language: 'javascript' })).toBe('')
  })
})
