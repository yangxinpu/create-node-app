import path from 'node:path'
import { writeFile } from 'node:fs/promises'

import type { ProjectContext } from '../context/types.js'

/**
 * 根据 ProjectContext 动态渲染 README，而非固定模板。
 */
export async function generateReadme(context: ProjectContext): Promise<void> {
  const stack = buildStackList(context)
  const pm = context.packageManager

  const lines: string[] = [
    `# ${context.projectName}`,
    '',
    '## Stack',
    '',
    ...stack.map((item) => `- ${item}`),
    '',
    '## Development',
    '',
    '```bash',
    `${pm} install`,
    `${pm} run dev`,
    '```',
    '',
    'Open [http://localhost:3000](http://localhost:3000) to view the generated project overview.',
    '',
    '## Endpoints',
    '',
    '- `GET /` - generated stack overview',
    '- `GET /api/greetings` - greeting resource example',
    '- `GET /health` - service health status',
    '',
  ]

  if (context.orm === 'prisma') {
    lines.push(
      '## Database',
      '',
      '```bash',
      'npx prisma generate',
      'npx prisma migrate dev',
      '```',
      '',
    )
  }

  await writeFile(path.join(context.projectPath, 'README.md'), lines.join('\n'))
}

function buildStackList(context: ProjectContext): string[] {
  const stack: string[] = []
  stack.push(
    context.runtime === 'node'
      ? `Node.js ${context.runtimeVersion} LTS`
      : `Bun ${context.runtimeVersion}`,
  )
  stack.push(context.language === 'typescript' ? 'TypeScript' : 'JavaScript')
  if (context.framework !== 'none') stack.push(capitalize(context.framework))
  if (context.database !== 'none') stack.push(capitalize(context.database))
  if (context.orm !== 'none') stack.push(capitalize(context.orm))
  if (context.cache !== 'none') stack.push(capitalize(context.cache))
  if (context.eslint) stack.push('ESLint')
  if (context.prettier) stack.push('Prettier')
  if (context.docker) stack.push('Docker')
  return stack
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
