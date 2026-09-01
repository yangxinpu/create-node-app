import { execa } from 'execa'

import type { ProjectContext } from '../context/types.js'
import { getPackageManager } from './package-manager.js'

/**
 * 在生成的项目目录中安装依赖。
 */
export async function installDependencies(context: ProjectContext): Promise<void> {
  const pm = getPackageManager(context.packageManager)
  await execa(pm.name, pm.installCommand, {
    cwd: context.projectPath,
    stdio: 'inherit',
  })
}
