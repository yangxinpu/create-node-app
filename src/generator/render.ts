import type { ProjectContext } from '../context/types.js'

/**
 * 模板变量表。模板文件中的 {{variable}} 占位符会被这里的值替换。
 * 让同一份模板文件能根据 ProjectContext（如所选数据库）动态渲染。
 */
export type TemplateVariables = Record<string, string>

const SQL_USER_MODEL = [
  'model User {',
  '  id    Int     @id @default(autoincrement())',
  '  email String  @unique',
  '  name  String?',
  '}',
].join('\n')

const MONGO_USER_MODEL = [
  'model User {',
  '  id    String  @id @default(auto()) @map("_id") @db.ObjectId',
  '  email String  @unique',
  '  name  String?',
  '}',
].join('\n')

const PRISMA_DATASOURCE: Record<string, string> = {
  mysql: 'mysql',
  postgresql: 'postgresql',
  mongodb: 'mongodb',
}

const PRISMA_USER_MODEL: Record<string, string> = {
  mysql: SQL_USER_MODEL,
  postgresql: SQL_USER_MODEL,
  mongodb: MONGO_USER_MODEL,
}

/** Welcome page labels for values that need more than title casing. */
const DISPLAY_LABELS: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  express: 'Express',
  elysia: 'Elysia',
  hono: 'Hono',
  fastify: 'Fastify',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
  prisma: 'Prisma',
  drizzle: 'Drizzle',
  redis: 'Redis',
  minimal: 'Minimal',
  api: 'API',
  layered: 'Layered',
  none: 'None',
}

interface DrizzleProfile {
  dialect: string
  coreModule: string
  tableFn: string
  idImport: string
  idColumn: string
  clientImports: string
  clientInit: string
}

const DRIZZLE: Record<string, DrizzleProfile> = {
  mysql: {
    dialect: 'mysql',
    coreModule: 'drizzle-orm/mysql-core',
    tableFn: 'mysqlTable',
    idImport: 'int',
    idColumn: "int('id').autoincrement().primaryKey()",
    clientImports:
      "import { drizzle } from 'drizzle-orm/mysql2'\nimport mysql from 'mysql2/promise'",
    clientInit:
      'const pool = mysql.createPool(process.env.DATABASE_URL!)\n\nexport const db = drizzle(pool, { schema })',
  },
  postgresql: {
    dialect: 'postgresql',
    coreModule: 'drizzle-orm/pg-core',
    tableFn: 'pgTable',
    idImport: 'serial',
    idColumn: "serial('id').primaryKey()",
    clientImports: "import { drizzle } from 'drizzle-orm/node-postgres'\nimport { Pool } from 'pg'",
    clientInit:
      'const pool = new Pool({ connectionString: process.env.DATABASE_URL })\n\nexport const db = drizzle(pool, { schema })',
  },
}

/**
 * 从 ProjectContext 计算模板变量。
 */
export function buildTemplateVariables(context: ProjectContext): TemplateVariables {
  const tooling = [
    context.eslint ? 'ESLint' : '',
    context.prettier ? 'Prettier' : '',
    context.docker ? 'Docker' : '',
  ].filter(Boolean)
  const vars: TemplateVariables = {
    projectName: context.projectName,
    runtime: context.runtime,
    runtimeVersion: context.runtimeVersion,
    runtimeDisplay:
      context.runtime === 'node'
        ? `Node.js ${context.runtimeVersion} LTS`
        : `Bun ${context.runtimeVersion} stable`,
    runtimeTypesPackage: context.runtime === 'node' ? '@types/node' : '@types/bun',
    runtimeTypesName: context.runtime === 'node' ? 'node' : 'bun',
    runtimeTypesRange:
      context.runtime === 'node'
        ? `^${context.runtimeVersion}.0.0`
        : `~${context.runtimeVersion}.0`,
    runtimeEntry:
      context.language === 'typescript' && context.runtime === 'node'
        ? 'dist/index.js'
        : `src/index.${context.language === 'typescript' ? 'ts' : 'js'}`,
    dockerVariant: `${context.runtime}-${context.language}`,
    language: context.language,
    languageDisplay: getDisplayLabel(context.language),
    extension: context.language === 'typescript' ? 'ts' : 'js',
    framework: context.framework,
    frameworkDisplay: getDisplayLabel(context.framework),
    database: context.database,
    databaseDisplay: getDisplayLabel(context.database),
    orm: context.orm,
    ormDisplay: getDisplayLabel(context.orm),
    cache: context.cache,
    cacheDisplay: getDisplayLabel(context.cache),
    architecture: context.architecture,
    architectureDisplay: getDisplayLabel(context.architecture),
    toolingDisplay: tooling.length > 0 ? tooling.join(', ') : 'None',
  }

  if (context.database !== 'none') {
    vars.prismaDatasource = PRISMA_DATASOURCE[context.database] ?? context.database
    vars.prismaUserModel = PRISMA_USER_MODEL[context.database] ?? SQL_USER_MODEL

    const profile = DRIZZLE[context.database]
    if (profile) {
      vars.drizzleDialect = profile.dialect
      vars.drizzleCoreModule = profile.coreModule
      vars.drizzleTableFn = profile.tableFn
      vars.drizzleIdImport = profile.idImport
      vars.drizzleIdColumn = profile.idColumn
      vars.drizzleClientImports = profile.clientImports
      vars.drizzleClientInit = profile.clientInit
    }
  }

  return vars
}

/** Return the user-facing label used by the generated welcome page. */
function getDisplayLabel(value: string): string {
  return DISPLAY_LABELS[value] ?? value
}

/**
 * 替换内容中的 {{variable}} 占位符。未知变量原样保留。
 * 支持条件块：{{#if name=value}}...{{/if}}，仅当变量等于给定值时保留块内容。
 */
export function renderContent(content: string, variables: TemplateVariables): string {
  const renderConditional = (_match: string, key: string, value: string, block: string): string => {
    return variables[key] === value ? block : ''
  }

  const commentConditionalsRendered = content.replace(
    /^[ \t]*\/\/\s*\{\{#if\s+(\w+)=([\w-]+)\s*\}\}\r?\n([\s\S]*?)^[ \t]*\/\/\s*\{\{\/if\}\}[ \t]*(?:\r?\n|$)/gm,
    renderConditional,
  )
  const conditionalsRendered = commentConditionalsRendered.replace(
    /\{\{#if\s+(\w+)=([\w-]+)\s*\}\}([\s\S]*?)\{\{\/if\}\}/g,
    renderConditional,
  )
  return conditionalsRendered.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => {
    return key in variables ? (variables[key] as string) : match
  })
}
