import { describe, expect, it } from 'vitest'

import { isTsOnlyPackage, mapFileName, shouldSkipFile, stripTypes } from '../../src/generator/language.js'

describe('isTsOnlyPackage', () => {
  it('identifies TS toolchain packages', () => {
    expect(isTsOnlyPackage('typescript')).toBe(true)
    expect(isTsOnlyPackage('tsx')).toBe(true)
    expect(isTsOnlyPackage('tsdown')).toBe(true)
    expect(isTsOnlyPackage('typescript-eslint')).toBe(true)
    expect(isTsOnlyPackage('@types/node')).toBe(true)
    expect(isTsOnlyPackage('@types/express')).toBe(true)
  })

  it('does not flag runtime packages', () => {
    expect(isTsOnlyPackage('elysia')).toBe(false)
    expect(isTsOnlyPackage('vitest')).toBe(false)
    expect(isTsOnlyPackage('eslint')).toBe(false)
    expect(isTsOnlyPackage('mysql2')).toBe(false)
  })
})

describe('mapFileName', () => {
  it('maps .ts to .js in javascript mode', () => {
    expect(mapFileName('index.ts', 'javascript')).toBe('index.js')
    expect(mapFileName('app.config.ts', 'javascript')).toBe('app.config.js')
    expect(mapFileName('schema.mts', 'javascript')).toBe('schema.mjs')
  })

  it('keeps names unchanged in typescript mode', () => {
    expect(mapFileName('index.ts', 'typescript')).toBe('index.ts')
  })

  it('does not touch non-ts files', () => {
    expect(mapFileName('package.json', 'javascript')).toBe('package.json')
    expect(mapFileName('.env.example', 'javascript')).toBe('.env.example')
  })
})

describe('shouldSkipFile', () => {
  it('skips tsconfig.json only in javascript mode', () => {
    expect(shouldSkipFile('tsconfig.json', 'javascript')).toBe(true)
    expect(shouldSkipFile('tsconfig.json', 'typescript')).toBe(false)
    expect(shouldSkipFile('package.json', 'javascript')).toBe(false)
  })
})

describe('stripTypes', () => {
  it('removes import type statements', () => {
    const result = stripTypes(`import type { FastifyInstance } from 'fastify'\nconst x = 1`)
    expect(result).not.toContain('import type')
    expect(result).toContain('const x = 1')
  })

  it('removes parameter and return type annotations', () => {
    const source = `
export async function health(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({ status: 'ok' }))
}`
    const result = stripTypes(source)
    expect(result).toContain('async function health(app)')
    expect(result).not.toContain('FastifyInstance')
    expect(result).not.toContain('Promise<void>')
  })

  it('removes non-null assertions', () => {
    const result = stripTypes(`const url = process.env.DATABASE_URL!`)
    expect(result).toContain('process.env.DATABASE_URL;')
    expect(result).not.toContain('DATABASE_URL!')
  })

  it('preserves runtime code and import paths', () => {
    const source = `import { Elysia } from 'elysia'\nimport { health } from './routes/health.js'\nconst app = new Elysia().use(health)`
    const result = stripTypes(source)
    expect(result).toContain('from "elysia"')
    expect(result).toContain('from "./routes/health.js"')
    expect(result).toContain('new Elysia()')
  })
})
