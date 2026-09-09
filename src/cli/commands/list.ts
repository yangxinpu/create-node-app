import pc from 'picocolors'

import {
  ARCHITECTURES,
  CACHES,
  DATABASES,
  FRAMEWORKS,
  LANGUAGES,
  BUN_STABLE_VERSIONS,
  NODE_LTS_VERSIONS,
  ORMS,
  PACKAGE_MANAGERS,
  PRESETS,
  RUNTIMES,
} from '../../config/options.js'
import { logger } from '../../utils/logger.js'

/**
 * list 命令：展示当前支持的所有选项。
 */
export function listCommand(): void {
  logger.intro('create-node-app')
  logger.note(
    [
      formatGroup('Runtime', RUNTIMES),
      formatGroup('Node.js LTS', NODE_LTS_VERSIONS),
      formatGroup('Bun stable', BUN_STABLE_VERSIONS),
      formatGroup('Language', LANGUAGES),
      formatGroup('Framework', FRAMEWORKS),
      formatGroup('Database', DATABASES),
      formatGroup('ORM', ORMS),
      formatGroup('Cache', CACHES),
      formatGroup('Architecture', ARCHITECTURES),
      formatGroup('Package manager', PACKAGE_MANAGERS),
      formatGroup('Preset', PRESETS),
    ].join('\n'),
    'Supported options',
  )
  logger.outro(`Run ${pc.cyan('create-node-app --help')} for usage`)
}

/** 将选项组格式化为紧凑的单行列表。 */
function formatGroup(title: string, values: readonly string[]): string {
  return `${pc.bold(`${title}:`)} ${values.join(', ')}`
}
