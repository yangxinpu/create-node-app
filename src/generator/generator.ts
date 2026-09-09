import path from 'node:path'

import { ensureDir, pathExists } from 'fs-extra'
import pc from 'picocolors'

import type { ProjectContext } from '../context/types.js'
import { resolveDependencies } from '../resolver/dependency.js'
import { resolveTemplates } from '../resolver/template.js'
import { installDependencies } from '../runtime/installer.js'
import { initGit } from '../runtime/git.js'
import { logger } from '../utils/logger.js'
import { checkCompatibility, validateCompatibility } from '../validation/compatibility.js'
import { validateContext } from '../validation/schema.js'
import { generateEnv } from './env.js'
import { copyTemplateFiles, loadTemplateMeta } from './files.js'
import { generatePackageJson } from './package.js'
import { generateReadme } from './readme.js'
import { buildTemplateVariables } from './render.js'

/**
 * 完整生成流水线。
 * CLI / Prompt / Preset / Config 四种入口最终都汇聚到这里，
 * 本函数只读取 ProjectContext。
 */
export async function createProject(context: ProjectContext): Promise<void> {
  // 1. 校验
  validateContext(context)
  validateCompatibility(context)

  // 输出 warning 级别的兼容性提示
  const issues = checkCompatibility(context).filter((i) => i.level === 'warning')
  for (const issue of issues) {
    logger.warn(issue.message)
  }

  if (await pathExists(context.projectPath)) {
    throw new Error(`Target directory "${context.projectPath}" already exists.`)
  }
  await ensureDir(context.projectPath)

  const relativePath = path.relative(process.cwd(), context.projectPath) || '.'
  const scaffoldSpinner = logger.spinner()
  scaffoldSpinner.start(`Scaffolding project in ${pc.cyan(relativePath)}`)

  try {
    // 2. 解析
    const templatePaths = resolveTemplates(context)
    const variables = buildTemplateVariables(context)
    const metas = await Promise.all(templatePaths.map((tp) => loadTemplateMeta(tp, variables)))
    const dependencies = resolveDependencies(metas)

    // 3. 生成静态文件（按 resolver 顺序覆盖，文本内容经变量渲染）
    for (const tp of templatePaths) {
      await copyTemplateFiles(tp, context.projectPath, variables)
    }

    // 4. 组装
    await generatePackageJson(context, dependencies)
    await generateEnv(context, dependencies)
    await generateReadme(context)

    scaffoldSpinner.stop('Project files generated')
  } catch (error) {
    scaffoldSpinner.stop('Failed to generate project files', 1)
    throw error
  }

  // 5. 安装依赖 + Git
  if (!context.noInstall) {
    await runTask(
      `Installing dependencies with ${context.packageManager}`,
      'Dependencies installed',
      () => installDependencies(context),
    )
  }

  if (!context.noGit) {
    await runTask('Initializing Git repository', 'Git repository initialized', () =>
      initGit(context),
    )
  }

  // 6. 输出
  printNextSteps(context)
}

function printNextSteps(context: ProjectContext): void {
  const pm = context.packageManager
  const commands = [`cd ${context.projectName}`]
  if (context.noInstall) commands.push(`${pm} install`)
  commands.push(`${pm} run dev`)

  logger.success(`Project created in ${pc.cyan(context.projectPath)}`)
  logger.note(commands.map((command) => pc.cyan(command)).join('\n'), 'Next steps')
  logger.outro('Done')
}

/** 使用统一的终端进度展示执行耗时任务。 */
async function runTask(
  pendingMessage: string,
  successMessage: string,
  task: () => Promise<void>,
): Promise<void> {
  const spinner = logger.spinner()
  spinner.start(pendingMessage)
  try {
    await task()
    spinner.stop(successMessage)
  } catch (error) {
    spinner.stop(`Failed: ${pendingMessage}`, 1)
    throw error
  }
}
