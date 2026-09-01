import { Command } from 'commander'
import pc from 'picocolors'

import { createCommand } from './commands/create.js'
import { listCommand } from './commands/list.js'

const program = new Command()

program
  .name('create-node-app')
  .description('Node.js project scaffolding generator — compose, don\'t stack templates')
  .version('0.1.0')

program
  .command('create', { isDefault: true })
  .description('Create a new Node.js project')
  .argument('[project-name]', 'project directory name')
  .option('--runtime <runtime>', 'node | bun')
  .option('--language <language>', 'typescript | javascript')
  .option('--framework <framework>', 'elysia | hono | express | fastify | none')
  .option('--database <database>', 'mysql | postgresql | sqlite | mongodb | none')
  .option('--orm <orm>', 'prisma | drizzle | none')
  .option('--cache <cache>', 'redis | none')
  .option('--test <test>', 'vitest | none')
  .option('--architecture <architecture>', 'minimal | api | layered')
  .option('--preset <preset>', 'minimal | api | fullstack | microservice')
  .option('--config <path>', 'path to config file (node-app.config.ts)')
  .option('--eslint', 'enable ESLint')
  .option('--prettier', 'enable Prettier')
  .option('--docker', 'enable Docker')
  .option('--package-manager <manager>', 'npm | pnpm | yarn | bun')
  .option('--no-install', 'skip dependency installation')
  .option('--no-git', 'skip Git initialization')
  .option('-y, --yes', 'use default configuration (non-interactive)')
  .action(createCommand)

program
  .command('list')
  .description('List all supported options')
  .action(listCommand)

async function main(): Promise<void> {
  console.log('')
  console.log(pc.bold('  create-node-app'))
  console.log('')
  await program.parseAsync(process.argv)
}

main().catch((error) => {
  console.error(pc.red(error instanceof Error ? error.message : String(error)))
  process.exit(1)
})
