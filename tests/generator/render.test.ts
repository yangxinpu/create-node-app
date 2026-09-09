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
    expect(vars.runtimeVersion).toBe('24')
    expect(vars.runtimeTypesPackage).toBe('@types/node')
    expect(vars.runtimeTypesRange).toBe('^24.0.0')
    expect(vars.runtimeTypesName).toBe('node')
    expect(vars.dockerVariant).toBe('node-typescript')
    expect(vars.runtimeEntry).toBe('dist/index.js')
    expect(vars.framework).toBe('express')
    expect(vars.runtimeDisplay).toBe('Node.js 24 LTS')
    expect(vars.languageDisplay).toBe('TypeScript')
    expect(vars.frameworkDisplay).toBe('Express')
    expect(vars.architectureDisplay).toBe('Minimal')
    expect(vars.toolingDisplay).toBe('ESLint, Prettier')
    expect(vars.healthEntryHandlerSource).toContain('function getHealthStatus')
    expect(vars.healthRouteHandlerSource).toContain('function getHealthStatus')
  })

  it('includes Bun-specific runtime variables', () => {
    const vars = buildTemplateVariables(
      buildContext({
        runtime: 'bun',
        runtimeVersion: '1.3',
        language: 'javascript',
      }),
    )

    expect(vars.runtimeTypesPackage).toBe('@types/bun')
    expect(vars.runtimeTypesRange).toBe('~1.3.0')
    expect(vars.runtimeTypesName).toBe('bun')
    expect(vars.dockerVariant).toBe('bun-javascript')
    expect(vars.runtimeEntry).toBe('src/index.js')
    expect(vars.runtimeDisplay).toBe('Bun 1.3 stable')
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

  it('targets the selected architecture health layer', () => {
    const api = buildTemplateVariables(buildContext({ architecture: 'api' }))
    const layered = buildTemplateVariables(buildContext({ architecture: 'layered' }))

    expect(api.healthEntryHandlerSource).toContain('./services/health.ts')
    expect(api.healthRouteHandlerSource).toContain('../services/health.ts')
    expect(layered.healthEntryHandlerSource).toContain('./controllers/health.controller.ts')
    expect(layered.healthRouteHandlerSource).toContain('../controllers/health.controller.ts')
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

  it('renders comment-wrapped code variables without leaving comments', () => {
    const result = renderContent('/* {{healthHandlerSource}} */', {
      healthHandlerSource: "import { getHealthStatus } from '../services/health.ts'",
    })

    expect(result).toBe("import { getHealthStatus } from '../services/health.ts'")
  })
})
