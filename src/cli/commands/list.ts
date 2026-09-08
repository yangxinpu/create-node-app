import pc from 'picocolors'

import {
  ARCHITECTURES,
  CACHES,
  DATABASES,
  FRAMEWORKS,
  ORMS,
  RUNTIMES,
} from '../../config/options.js'

/**
 * list 命令：展示当前支持的所有选项。
 */
export function listCommand(): void {
  printGroup('Runtimes', RUNTIMES)
  printGroup('Frameworks', FRAMEWORKS)
  printGroup('Databases', DATABASES)
  printGroup('ORM', ORMS)
  printGroup('Cache', CACHES)
  printGroup('Architecture', ARCHITECTURES)
}

function printGroup(title: string, values: readonly string[]): void {
  console.log(pc.bold(title))
  console.log('')
  for (const value of values) {
    console.log(`  ${pc.green('✓')} ${value}`)
  }
  console.log('')
}
