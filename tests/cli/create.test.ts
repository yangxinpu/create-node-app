import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const temporaryDirectories: string[] = []
const projectRoot = process.cwd()

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  )
})

describe('create CLI', () => {
  it('creates a project non-interactively from command-line options', async () => {
    const workingDirectory = await mkdtemp(path.join(tmpdir(), 'create-node-app-cli-'))
    temporaryDirectories.push(workingDirectory)

    const { stdout } = await execFileAsync(
      process.execPath,
      [
        path.join(projectRoot, 'node_modules/tsx/dist/cli.mjs'),
        path.join(projectRoot, 'src/cli/index.ts'),
        'cli-app',
        '--runtime',
        'bun',
        '--runtime-version',
        '1.3',
        '--language',
        'javascript',
        '--framework',
        'hono',
        '--database',
        'none',
        '--orm',
        'none',
        '--cache',
        'none',
        '--architecture',
        'layered',
        '--package-manager',
        'bun',
        '--no-install',
        '--no-git',
      ],
      { cwd: workingDirectory },
    )

    expect(stdout).toContain('Project created')

    const projectPath = path.join(workingDirectory, 'cli-app')
    const packageJson = JSON.parse(
      await readFile(path.join(projectPath, 'package.json'), 'utf-8'),
    ) as {
      engines: Record<string, string>
      scripts: Record<string, string>
      devDependencies?: Record<string, string>
    }

    expect(packageJson.engines).toEqual({ bun: '>=1.3.0 <1.4.0' })
    expect(packageJson.scripts.dev).toBe('bun --watch src/index.js')
    expect(packageJson.scripts.start).toBe('bun src/index.js')
    expect(packageJson.scripts.test).toBeUndefined()
    expect(packageJson.devDependencies?.vitest).toBeUndefined()
    await expect(readFile(path.join(projectPath, '.bun-version'), 'utf-8')).resolves.toBe('1.3\n')
    const welcomePage = await readFile(path.join(projectPath, 'web/index.html'), 'utf-8')
    expect(welcomePage).toContain('<h1 id="project-title">cli-app</h1>')
    expect(welcomePage).toContain('<strong>Bun 1.3 stable</strong>')
    expect(welcomePage).not.toContain('{{')
    const eslintConfig = await readFile(path.join(projectPath, 'eslint.config.js'), 'utf-8')
    expect(eslintConfig).not.toContain('typescript-eslint')
    await expect(
      readFile(path.join(projectPath, 'prettier.config.js'), 'utf-8'),
    ).resolves.toContain("@type {import('prettier').Config}")

    const route = await readFile(path.join(projectPath, 'src/routes/health.js'), 'utf-8')
    expect(route).toContain('getHealthStatus')

    const controller = await readFile(
      path.join(projectPath, 'src/controllers/health.controller.js'),
      'utf-8',
    )
    expect(controller).not.toContain('import type')
    expect(controller).not.toContain(': HealthStatus')
  })
})
