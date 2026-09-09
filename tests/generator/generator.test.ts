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
      runtimeVersion: '22',
      architecture: 'api',
      framework: 'express',
      docker: true,
      eslint: false,
      prettier: false,
    })

    await expect(access(path.join(projectPath, 'src/services/health.ts'))).resolves.toBeUndefined()
    await expect(access(path.join(projectPath, 'src/schemas/health.ts'))).resolves.toBeUndefined()

    const route = await readFile(path.join(projectPath, 'src/routes/health.ts'), 'utf-8')
    expect(route).toContain("import { getHealthStatus } from '../health.ts'")
    expect(route).toContain('res.json(getHealthStatus())')
    const packageJson = JSON.parse(
      await readFile(path.join(projectPath, 'package.json'), 'utf-8'),
    ) as {
      engines: Record<string, string>
      devDependencies: Record<string, string>
    }
    expect(packageJson.engines).toEqual({ node: '>=22.0.0 <23.0.0' })
    expect(packageJson.devDependencies['@types/node']).toBe('^22.0.0')
    const tsconfig = JSON.parse(
      await readFile(path.join(projectPath, 'tsconfig.json'), 'utf-8'),
    ) as {
      compilerOptions: { rewriteRelativeImportExtensions: boolean }
    }
    expect(tsconfig.compilerOptions.rewriteRelativeImportExtensions).toBe(true)
    await expect(readFile(path.join(projectPath, '.nvmrc'), 'utf-8')).resolves.toBe('22\n')
    const dockerfile = await readFile(path.join(projectPath, 'Dockerfile'), 'utf-8')
    expect(dockerfile).toContain('FROM node:22-alpine')
    expect(dockerfile).toContain('COPY --from=builder /app/web ./web')
    const welcomePage = await readFile(path.join(projectPath, 'web/index.html'), 'utf-8')
    expect(welcomePage).toContain('<h1 id="project-title">generated-app</h1>')
    expect(welcomePage).toContain('<strong>Node.js 22 LTS</strong>')
    expect(welcomePage).toContain('<strong>Express</strong>')
    expect(welcomePage).toContain('<strong>API</strong>')
    expect(welcomePage).toContain("fetch('/api/hello'")
    expect(welcomePage).toContain('data-language="zh"')
    expect(welcomePage).not.toContain('Resolved template modules')
    expect(welcomePage).not.toContain('{{')
    await expect(readFile(path.join(projectPath, 'src/home.ts'), 'utf-8')).resolves.toContain(
      '../web/index.html',
    )
    const generatedReadme = await readFile(path.join(projectPath, 'README.md'), 'utf-8')
    expect(generatedReadme).toContain('http://localhost:3000')
    expect(generatedReadme).toContain('`GET /health`')
    await expect(access(path.join(projectPath, 'tests'))).rejects.toThrow()
    await expect(access(path.join(projectPath, 'vitest.config.ts'))).rejects.toThrow()
  })

  it('generates valid Bun scripts and layered JavaScript files', async () => {
    const projectPath = await createTemporaryProject({
      runtime: 'bun',
      runtimeVersion: '1.3',
      language: 'javascript',
      framework: 'hono',
      architecture: 'layered',
      docker: true,
      eslint: false,
      prettier: false,
    })

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
    expect(packageJson.devDependencies).toBeUndefined()
    await expect(readFile(path.join(projectPath, '.bun-version'), 'utf-8')).resolves.toBe('1.3\n')
    const dockerfile = await readFile(path.join(projectPath, 'Dockerfile'), 'utf-8')
    expect(dockerfile).toContain('FROM oven/bun:1.3-alpine')
    expect(dockerfile).toContain('CMD ["bun", "src/index.js"]')
    expect(dockerfile).not.toContain('FROM node:')
    const welcomePage = await readFile(path.join(projectPath, 'web/index.html'), 'utf-8')
    expect(welcomePage).toContain('<strong>Bun 1.3 stable</strong>')
    expect(welcomePage).toContain('<strong>Hono</strong>')
    expect(welcomePage).toContain('<strong>Layered</strong>')
    expect(welcomePage).toContain('<strong>None</strong>')

    await expect(
      access(path.join(projectPath, 'src/controllers/health.controller.js')),
    ).resolves.toBeUndefined()
    await expect(
      access(path.join(projectPath, 'src/repositories/health.repository.js')),
    ).resolves.toBeUndefined()
    await expect(access(path.join(projectPath, 'src/index.ts'))).rejects.toThrow()
    const entry = await readFile(path.join(projectPath, 'src/index.js'), 'utf-8')
    expect(entry).toContain('./home.js')
    expect(entry).not.toContain('{{extension}}')

    const controller = await readFile(
      path.join(projectPath, 'src/controllers/health.controller.js'),
      'utf-8',
    )
    expect(controller).not.toContain('import type')
    expect(controller).not.toContain(': HealthStatus')
  })

  it('uses Bun-compatible types and Docker entrypoints for TypeScript', async () => {
    const projectPath = await createTemporaryProject({
      runtime: 'bun',
      runtimeVersion: '1.4',
      language: 'typescript',
      framework: 'hono',
      docker: true,
      eslint: false,
      prettier: false,
    })

    const packageJson = JSON.parse(
      await readFile(path.join(projectPath, 'package.json'), 'utf-8'),
    ) as {
      engines: Record<string, string>
      devDependencies: Record<string, string>
    }
    expect(packageJson.engines).toEqual({ bun: '>=1.4.0 <1.5.0' })
    expect(packageJson.devDependencies['@types/bun']).toBe('~1.4.0')
    expect(packageJson.devDependencies['@types/node']).toBeUndefined()
    expect(packageJson.devDependencies.tsx).toBeUndefined()

    const tsconfig = JSON.parse(
      await readFile(path.join(projectPath, 'tsconfig.json'), 'utf-8'),
    ) as {
      compilerOptions: { types: string[] }
    }
    expect(tsconfig.compilerOptions.types).toEqual(['bun'])

    const dockerfile = await readFile(path.join(projectPath, 'Dockerfile'), 'utf-8')
    expect(dockerfile).toContain('FROM oven/bun:1.4-alpine')
    expect(dockerfile).toContain('CMD ["bun", "src/index.ts"]')
  })

  it.each([
    ['express', 'src/index.ts', "app.get('/',"],
    ['elysia', 'src/app.ts', ".get('/',"],
    ['hono', 'src/index.ts', "app.get('/',"],
    ['fastify', 'src/index.ts', "app.get('/',"],
    ['none', 'src/index.ts', 'createServer'],
  ] as const)('serves the welcome page with the %s framework', async (framework, entry, marker) => {
    const projectPath = await createTemporaryProject({
      framework,
      eslint: false,
      prettier: false,
    })

    const source = await readFile(path.join(projectPath, entry), 'utf-8')
    expect(source).toContain("import { homePage } from './home.ts'")
    expect(source).toContain(marker)
    expect(source).toContain('/api/hello')
    expect(source).toContain('Hello Node App')
    await expect(readFile(path.join(projectPath, 'web/index.html'), 'utf-8')).resolves.toContain(
      'Your selected stack',
    )
  })
})
