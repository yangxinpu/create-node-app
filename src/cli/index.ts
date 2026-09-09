import { Command } from 'commander'

import { logger } from '../utils/logger.js'
import { createCommand } from './commands/create.js'
import { listCommand } from './commands/list.js'

const program = new Command()

program
  .name('create-node-web')
  .description("Node.js project scaffolding generator — compose, don't stack templates")
  .version('0.1.0')

program
  .command('create', { isDefault: true })
  .description('Create a new Node.js project')
  .argument('[project-name]', 'project directory name')
  .option('--runtime <runtime>', 'node | bun')
  .option('--runtime-version <version>', 'node: 24 | 22; bun: 1.4 | 1.3')
  .option('--language <language>', 'typescript | javascript')
  .option('--framework <framework>', 'express | elysia | hono | fastify | none')
  .option('--database <database>', 'mysql | postgresql | mongodb | none')
  .option('--orm <orm>', 'prisma | drizzle | none')
  .option('--cache <cache>', 'redis | none')
  .option('--architecture <architecture>', 'minimal | api | layered')
  .option('--preset <preset>', 'minimal | api | fullstack | microservice')
  .option('--config <path>', 'path to config file (node-web.config.ts)')
  .option('--eslint', 'enable ESLint')
  .option('--prettier', 'enable Prettier')
  .option('--docker', 'enable Docker')
  .option('--package-manager <manager>', 'npm | pnpm | yarn | bun')
  .option('--no-install', 'skip dependency installation')
  .option('--no-git', 'skip Git initialization')
  .option('-y, --yes', 'use default configuration (non-interactive)')
  .action(createCommand)

program.command('list').description('List all supported options').action(listCommand)

async function main(): Promise<void> {
  await program.parseAsync(process.argv)
  process.stdin.destroy()
}

main().catch((error) => {
  logger.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
