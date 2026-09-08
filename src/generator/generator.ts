import { ensureDir, pathExists } from 'fs-extra'

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

  // 2. 解析
  const templatePaths = resolveTemplates(context)
  const variables = buildTemplateVariables(context)
  const metas = await Promise.all(templatePaths.map((tp) => loadTemplateMeta(tp, variables)))
  const dependencies = resolveDependencies(metas)

  // 3. 生成静态文件（按 resolver 顺序覆盖，文本内容经变量渲染）
  logger.step('Generating files')
  for (const tp of templatePaths) {
    await copyTemplateFiles(tp, context.projectPath, variables)
  }

  // 4. 组装
  logger.step('Generating package.json')
  await generatePackageJson(context, dependencies)

  logger.step('Generating .env.example')
  await generateEnv(context, dependencies)

  logger.step('Generating README.md')
  await generateReadme(context)

  // 5. 安装依赖 + Git
  if (!context.noInstall) {
    logger.step(`Installing dependencies with ${context.packageManager}`)
    await installDependencies(context)
  }

  if (!context.noGit) {
    logger.step('Initializing Git')
    await initGit(context)
  }

  // 6. 输出
  printNextSteps(context)
}

function printNextSteps(context: ProjectContext): void {
  const pm = context.packageManager
  logger.success('Project created')
  console.log('')
  console.log(`  Project: ${context.projectName}`)
  console.log(`  Runtime: ${context.runtime}`)
  console.log(`  Language: ${context.language}`)
  console.log(`  Framework: ${context.framework}`)
  console.log('')
  console.log('  Next steps:')
  console.log('')
  console.log(`    cd ${context.projectName}`)
  if (context.noInstall) console.log(`    ${pm} install`)
  console.log(`    ${pm} run dev`)
  console.log('')
}
