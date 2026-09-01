import { describe, expect, it } from 'vitest'

import { deepMergeJson } from '../../src/merger/json.js'
import { mergeEnvFiles } from '../../src/merger/env.js'
import { writeFile, readFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

describe('deepMergeJson', () => {
  it('merges nested objects', () => {
    const target = { compilerOptions: { target: 'ES2020', strict: true }, include: ['src'] }
    const source = { compilerOptions: { module: 'NodeNext' }, exclude: ['dist'] }
    const result = deepMergeJson(target, source) as Record<string, unknown>
    const co = result.compilerOptions as Record<string, unknown>
    expect(co.target).toBe('ES2020')
    expect(co.strict).toBe(true)
    expect(co.module).toBe('NodeNext')
    expect(result.include).toEqual(['src'])
    expect(result.exclude).toEqual(['dist'])
  })

  it('source overrides scalar values', () => {
    const result = deepMergeJson({ a: 1 }, { a: 2 }) as Record<string, unknown>
    expect(result.a).toBe(2)
  })
})

describe('mergeEnvFiles', () => {
  it('appends non-duplicate env vars', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'cna-test-'))
    const targetPath = path.join(dir, '.env')
    const sourcePath = path.join(dir, '.env.source')

    await writeFile(targetPath, 'PORT=3000\nDB=mysql\n')
    await writeFile(sourcePath, 'PORT=8080\nREDIS=redis://localhost\n')

    await mergeEnvFiles(sourcePath, targetPath)

    const merged = await readFile(targetPath, 'utf-8')
    expect(merged).toContain('PORT=3000')
    expect(merged).not.toContain('PORT=8080')
    expect(merged).toContain('REDIS=redis://localhost')

    await rm(dir, { recursive: true })
  })
})
