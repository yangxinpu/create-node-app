import { execa } from 'execa'

import type { ProjectContext } from '../context/types.js'

/**
 * 在生成的项目目录中初始化 Git 仓库并提交初始代码。
 */
export async function initGit(context: ProjectContext): Promise<void> {
  await execa('git', ['init'], { cwd: context.projectPath })
  await execa('git', ['add', '.'], { cwd: context.projectPath })
  await execa('git', ['commit', '-m', 'Initial commit from create-node-web'], {
    cwd: context.projectPath,
  })
}
