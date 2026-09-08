import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { DEFAULT_CONTEXT } from '../../src/context/defaults.js'
import type { ProjectContext } from '../../src/context/types.js'
import { createProject } from '../../src/generator/generator.js'

const temporaryDirectories: string[] = []

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  )
})

async function createTemporaryProject(overrides: Partial<ProjectContext>): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), 'create-node-app-generator-'))
  const projectPath = path.join(root, 'generated-app')
  temporaryDirectories.push(root)

  await createProject({
    ...DEFAULT_CONTEXT,
    projectName: 'generated-app',
    projectPath,
    noInstall: true,
    noGit: true,
    ...overrides,
  })

  return projectPath
}

describe('createProject', () => {
  it('generates an API architecture with concrete service and schema files', async () => {
    const projectPath = await createTemporaryProject({
      architecture: 'api',
      framework: 'express',
      eslint: false,
      prettier: false,
    })

    await expect(access(path.join(projectPath, 'src/services/health.ts'))).resolves.toBeUndefined()
    await expect(access(path.join(projectPath, 'src/schemas/health.ts'))).resolves.toBeUndefined()

    const route = await readFile(path.join(projectPath, 'src/routes/health.ts'), 'utf-8')
    expect(route).toContain("import { getHealthStatus } from '../health.js'")
    expect(route).toContain('res.json(getHealthStatus())')
    await expect(access(path.join(projectPath, 'tests'))).rejects.toThrow()
    await expect(access(path.join(projectPath, 'vitest.config.ts'))).rejects.toThrow()
  })

  it('generates valid Bun scripts and layered JavaScript files', async () => {
    const projectPath = await createTemporaryProject({
      runtime: 'bun',
      language: 'javascript',
      framework: 'hono',
      architecture: 'layered',
      eslint: false,
      prettier: false,
    })

    const packageJson = JSON.parse(
      await readFile(path.join(projectPath, 'package.json'), 'utf-8'),
    ) as {
      scripts: Record<string, string>
      devDependencies?: Record<string, string>
    }

    expect(packageJson.scripts.dev).toBe('bun --watch src/index.js')
    expect(packageJson.scripts.start).toBe('bun src/index.js')
    expect(packageJson.devDependencies).toBeUndefined()

    await expect(
      access(path.join(projectPath, 'src/controllers/health.controller.js')),
    ).resolves.toBeUndefined()
    await expect(
      access(path.join(projectPath, 'src/repositories/health.repository.js')),
    ).resolves.toBeUndefined()
    await expect(access(path.join(projectPath, 'src/index.ts'))).rejects.toThrow()

    const controller = await readFile(
      path.join(projectPath, 'src/controllers/health.controller.js'),
      'utf-8',
    )
    expect(controller).not.toContain('import type')
    expect(controller).not.toContain(': HealthStatus')
  })
})
