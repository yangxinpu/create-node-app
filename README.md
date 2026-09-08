create-node-app 项目方案
一、项目定位
1. 项目名称

暂定名称：

create-node-app

使用方式：

npm create node-app@latest my-server

或者：

npm create node-app@latest

第一种方式直接指定项目名称，第二种方式由 CLI 交互式询问。

2. 项目目标

create-node-app 是一个 Node.js 项目脚手架生成器（Project Generator）。

它不是简单复制一个固定模板，而是根据用户选择的：

Runtime
Language
Framework
Database
ORM
Cache
Tooling
Architecture

动态组合并生成完整项目。

核心思想：

              create-node-app
                     │
        ┌────────────┴────────────┐
        │                         │
   Interactive                Non-Interactive
        │                         │
    Prompts                    CLI Args
        │                         │
        └────────────┬────────────┘
                     ↓
              ProjectContext
                     ↓
          Compatibility Check
                     ↓
          Template Resolver
                     ↓
         Dependency Resolver
                     ↓
            File Generator
                     ↓
             File Merger
                     ↓
          Generated Project
3. 核心原则

整个项目遵循三个原则：

组合，而不是堆积模板

错误：

templates/
├── elysia-mysql-prisma
├── elysia-mysql-drizzle
├── hono-mysql-prisma
├── hono-postgres-drizzle
└── ...

正确：

Base
 +
Framework
 +
Database
 +
ORM
 +
Cache
 +
Tooling
 ↓
Generated Project

这样可以避免模板组合爆炸。

二、最终用户体验
1. 交互式创建

执行：

npm create node-app@latest

首先询问：

◇ create-node-app

? Project name: my-server

? Select runtime:
❯ Node
  Bun

? Select language:
❯ TypeScript
  JavaScript

? Select framework:
❯ Elysia
  Hono
  Express
  Fastify
  None

? Select database:
❯ MySQL
  PostgreSQL
  MongoDB
  None

? Select ORM:
❯ Prisma
  Drizzle
  None

? Select cache:
❯ Redis
  None

? Use ESLint?
❯ Yes
  No

? Use Prettier?
❯ Yes
  No

? Use Docker?
❯ Yes
  No

最后显示：

✔ Project created

Project: my-server
Runtime: Node.js
Language: TypeScript
Framework: Elysia
Database: MySQL
ORM: Prisma
Cache: Redis

Next steps:

cd my-server
npm run dev
三、非交互式 CLI

脚手架必须支持 CI/CD、自动化脚本和 AI Agent，因此不能只支持交互式模式。

例如：

npm create node-app@latest my-server \
  --runtime node \
  --language typescript \
  --framework elysia \
  --database mysql \
  --orm prisma \
  --cache redis \
  --eslint \
  --prettier

也支持：

npm create node-app@latest my-server --yes

--yes 表示使用默认配置。

例如：

npm create node-app@latest my-server --yes

等价于：

Node.js
TypeScript
Elysia
None
None
None
ESLint
Prettier
四、Preset 预设系统

这是对原方案的重要扩展。

很多用户实际上不想一个一个选择，而是希望：

创建一个标准 API 项目

因此增加：

--preset

例如：

npm create node-app@latest blog-api --preset api

提供：

presets/

├── minimal
├── api
├── fullstack
└── microservice

例如 api：

{
  runtime: 'node',
  language: 'typescript',
  framework: 'elysia',
  database: 'mysql',
  orm: 'prisma',
  cache: 'redis',
  eslint: true,
  prettier: true
}
Preset 的作用

Preset 并不是另外一套生成逻辑。

它只是：

Preset
   ↓
ProjectContext

最终仍然进入同一套 Generator。

这样可以避免维护两套生成系统。

五、配置文件系统

除了 CLI 和交互式模式，还可以支持：

node-app.config.ts

例如：

export default {
  runtime: 'node',
  language: 'typescript',
  framework: 'elysia',
  database: 'mysql',
  orm: 'prisma',
  cache: 'redis',
  eslint: true,
  prettier: true,
  docker: true
}

然后：

create-node-app my-server --config node-app.config.ts

最终：

Interactive
CLI Args
Preset
Config
       ↓
Normalize
       ↓
ProjectContext

这样整个系统的核心入口始终只有一个。

六、ProjectContext

ProjectContext 是整个系统最重要的数据结构。

它保存一次项目生成过程中的完整配置。

export interface ProjectContext {
  projectName: string
  projectPath: string

  runtime:
    | 'node'
    | 'bun'

  language:
    | 'typescript'
    | 'javascript'

  framework:
    | 'elysia'
    | 'hono'
    | 'express'
    | 'fastify'
    | 'none'

  database:
    | 'mysql'
    | 'postgresql'
    | 'mongodb'
    | 'none'

  orm:
    | 'prisma'
    | 'drizzle'
    | 'none'

  cache:
    | 'redis'
    | 'none'

  architecture:
    | 'minimal'
    | 'api'
    | 'layered'

  eslint: boolean
  prettier: boolean
  docker: boolean
}
为什么需要 Context？

因为后面的模块都只读取 Context：

CLI
 ↓
ProjectContext
 ↓
Validator
 ↓
Resolver
 ↓
Generator

例如 Generator 不需要知道：

用户是通过命令行选择的

还是：

用户是通过交互式 Prompt 选择的

它只知道：

context.framework === 'elysia'

这就是解耦。

七、Configuration Schema

用户输入的数据不能直接使用。

必须先：

Raw Input
   ↓
Normalize
   ↓
Schema Validation
   ↓
ProjectContext

例如：

validateContext(context)

检查：

projectName 是否合法
runtime 是否存在
framework 是否存在
database 是否存在
orm 是否存在

这样可以保证后面的 Generator 拿到的一定是合法 Context。

八、Compatibility Rule Engine

这是项目中非常重要的一层。

不同技术之间可能存在兼容性关系：

Runtime
+
Framework
+
ORM
+
Database

所以需要：

Compatibility Engine

例如：

interface CompatibilityRule {
  name: string

  condition:
    (context: ProjectContext) => boolean

  level:
    'error' | 'warning'

  message: string
}

例如：

const rule = {
  name: 'example-rule',

  condition: ctx =>
    ctx.runtime === 'bun' &&
    ctx.orm === 'xxx',

  level: 'warning',

  message:
    'xxx currently has limited Bun support'
}

系统可以输出：

⚠ Compatibility warning

Bun + xxx may have limited support.

或者：

✖ Configuration error

This combination is not supported.
为什么不能只写大量 if？

因为未来组合会越来越多：

Node + Elysia
Node + Hono
Bun + Elysia
Bun + Hono
Node + Prisma
Bun + Prisma
...

规则系统可以独立扩展。

九、Template Module System

这是整个项目的核心。

不要把模板理解成：

一个目录

而应该理解成：

一个 Template Module

例如：

interface TemplateModule {
  name: string

  files?: TemplateFile[]

  dependencies?: PackageDependencies

  scripts?: Record<string, string>

  env?: Record<string, string>

  validate?:
    (context: ProjectContext) => void

  generate?:
    (context: ProjectContext) => Promise<void>
}

一个模板模块可以拥有：

文件
依赖
脚本
环境变量
校验逻辑
动态生成逻辑

这比简单 Copy 文件强很多。

模板源文件可以使用 `.template` 后缀。生成器复制文件时会移除该后缀，例如
`eslint.config.js.template` 会输出为 `eslint.config.js`，从而避免 IDE 在模板渲染前误加载配置文件。

十、Template 分类

推荐目录：

templates/

├── base/
│   ├── typescript/
│   └── javascript/
│
├── runtimes/
│   ├── node/
│   └── bun/
│
├── frameworks/
│   ├── elysia/
│   ├── hono/
│   ├── express/
│   └── fastify/
│
├── databases/
│   ├── mysql/
│   ├── postgresql/
│   └── mongodb/
│
├── orm/
│   ├── prisma/
│   └── drizzle/
│
├── cache/
│   └── redis/
│
├── tooling/
│   ├── eslint/
│   ├── prettier/
│   └── docker/
│
└── architecture/
    ├── minimal/
    ├── api/
    └── layered/
十一、Template Resolver

Resolver 根据 Context 决定需要哪些模块。

例如：

function resolveTemplates(
  context: ProjectContext
) {
  const templates = []

  templates.push(
    `base/${context.language}`
  )

  templates.push(
    `runtimes/${context.runtime}`
  )

  if (context.framework !== 'none') {
    templates.push(
      `frameworks/${context.framework}`
    )
  }

  if (context.database !== 'none') {
    templates.push(
      `databases/${context.database}`
    )
  }

  if (context.orm !== 'none') {
    templates.push(
      `orm/${context.orm}`
    )
  }

  if (context.cache !== 'none') {
    templates.push(
      `cache/${context.cache}`
    )
  }

  if (context.eslint) {
    templates.push('tooling/eslint')
  }

  if (context.prettier) {
    templates.push('tooling/prettier')
  }

  if (context.docker) {
    templates.push('tooling/docker')
  }

  templates.push(
    `architecture/${context.architecture}`
  )

  return templates
}

例如：

Node
TypeScript
Elysia
MySQL
Prisma
Redis
ESLint
Prettier

得到：

base/typescript
runtimes/node
frameworks/elysia
databases/mysql
orm/prisma
cache/redis
tooling/eslint
tooling/prettier
architecture/api
十二、Dependency Resolver

模板不应该把依赖直接塞进 Generator。

每一个 Template Module 描述自己的依赖：

const elysia = {
  dependencies: {
    elysia: '^1.3.0'
  }
}

Prisma：

const prisma = {
  dependencies: {
    '@prisma/client': '^6.0.0'
  },

  devDependencies: {
    prisma: '^6.0.0'
  }
}

Redis：

const redis = {
  dependencies: {
    ioredis: '^5.0.0'
  }
}

然后：

Template Modules
       ↓
Dependency Resolver
       ↓
Dependency Graph
       ↓
package.json

这样 Generator 本身不需要知道：

Elysia 对应什么依赖
Prisma 对应什么依赖
Redis 对应什么依赖
十三、Package.json Merge

例如三个模块：

Base
Elysia
Prisma

分别提供：

{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
{
  "dependencies": {
    "elysia": "^1.3.0"
  }
}
{
  "dependencies": {
    "@prisma/client": "^6.0.0"
  },
  "devDependencies": {
    "prisma": "^6.0.0"
  }
}

最终合并为：

{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  },
  "dependencies": {
    "elysia": "^1.3.0",
    "@prisma/client": "^6.0.0"
  },
  "devDependencies": {
    "prisma": "^6.0.0"
  }
}
十四、File Merge Strategy

这里不要只有：

mergePackageJson()

应该建立通用的：

File Merge System

例如：

package.json
→ JSON Merge

tsconfig.json
→ JSON Deep Merge

.env.example
→ Environment Merge

README.md
→ Template Rendering

普通文件
→ Copy

设计：

interface MergeStrategy {
  canHandle(file: string): boolean

  merge(
    source: string,
    target: string
  ): Promise<void>
}

以后可以继续扩展：

JSON
ENV
Markdown
TypeScript
YAML
十五、Generator Pipeline

完整生成流程：

CLI
 │
 ↓
Parse Arguments
 │
 ↓
Interactive Prompts
 │
 ↓
Normalize Input
 │
 ↓
ProjectContext
 │
 ↓
Schema Validation
 │
 ↓
Compatibility Check
 │
 ↓
Resolve Templates
 │
 ↓
Resolve Dependencies
 │
 ↓
Generate Files
 │
 ↓
Merge Files
 │
 ↓
Generate package.json
 │
 ↓
Generate .env
 │
 ↓
Generate README
 │
 ↓
Install Dependencies
 │
 ↓
Initialize Git
 │
 ↓
Print Next Steps

核心代码：

async function createProject(
  context: ProjectContext
) {
  await validateContext(context)

  await validateCompatibility(context)

  const templates =
    resolveTemplates(context)

  const dependencies =
    resolveDependencies(templates)

  await generateFiles(
    context,
    templates
  )

  await mergeFiles(
    context,
    templates
  )

  await generatePackageJson(
    context,
    dependencies
  )

  await generateReadme(context)

  await installDependencies(context)

  await initGit(context)

  printNextSteps(context)
}
十六、生成项目结构

例如用户选择：

Node.js
TypeScript
Elysia
MySQL
Prisma
Redis
ESLint
Prettier
Docker

最终：

blog-api/

├── src/
│   ├── db/
│   │   ├── client.ts
│   │   └── prisma.ts
│   │
│   ├── redis/
│   │   └── client.ts
│   │
│   ├── routes/
│   │   └── health.ts
│   │
│   ├── services/
│   │   └── health.ts
│   │
│   ├── schemas/
│   │   └── health.ts
│   │
│   ├── app.ts
│   ├── health.ts
│   └── index.ts
│
├── prisma/
│   └── schema.prisma
│
├── .env.example
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── prettier.config.js
├── tsconfig.json
├── package.json
└── README.md

生成项目不包含测试框架、测试脚本或测试文件；仓库根目录的 Vitest 仅用于脚手架自身回归测试。

需要注意：

不是所有项目都生成这些目录。

例如：

Node + TypeScript + None

只生成基础入口和 `health.ts`。

而：

architecture/api

才生成：

routes
services
schemas

这样 Generator 才真正做到“按配置生成”。

十七、README 自动生成

README 不建议固定。

应该根据 ProjectContext 动态生成。

例如：

# blog-api

## Stack

- Node.js
- TypeScript
- Elysia
- MySQL
- Prisma
- Redis
- ESLint
- Prettier

## Development

```bash
npm install
npm run dev
Database
npx prisma generate
npx prisma migrate dev
因此：

```text
ProjectContext
      ↓
README Generator
      ↓
README.md
十八、Package Manager

CLI 不应该强制写死：

npm

应该支持：

npm
pnpm
yarn
bun

执行：

create-node-app my-server

可以检测：

用户当前环境

例如：

pnpm available

则可以优先使用：

pnpm install

也可以通过：

--package-manager npm

显式指定。

核心：

type PackageManager =
  | 'npm'
  | 'pnpm'
  | 'yarn'
  | 'bun'
十九、Git 初始化

生成完成后：

✔ Creating project
✔ Generating files
✔ Configuring Elysia
✔ Configuring Prisma
✔ Configuring MySQL
✔ Configuring Redis
✔ Installing dependencies
✔ Initializing Git
✔ Generating README

Success!

Project created at:

./blog-api

然后：

Next steps:

cd blog-api
npm run dev

Git 可以通过：

--no-git

关闭。

二十、CLI 参数设计

最终：

create-node-app <project-name>

Options：

--runtime <runtime>

--language <language>

--framework <framework>

--database <database>

--orm <orm>

--cache <cache>

--architecture <architecture>

--preset <preset>

--config <path>

--eslint

--prettier

--docker

--package-manager <manager>

--no-install

--no-git

--yes
二十一、CLI Commands

V1：

create-node-app
create-node-app <project-name>

V1.1：

create-node-app list

显示：

Frameworks

✓ Elysia
✓ Hono
✓ Express
✓ Fastify

Databases

✓ MySQL
✓ PostgreSQL
✓ MongoDB

ORM

✓ Prisma
✓ Drizzle

以后再增加：

create-node-app init
create-node-app info
create-node-app upgrade

其中：

upgrade

建议放到后期，因为它实际上属于项目迁移系统，复杂度远高于项目初始化。

二十二、项目目录

当前 CLI 项目结构：

create-node-app/
├── src/
│   ├── cli/
│   │   ├── index.ts
│   │   ├── commands/
│   │   │   ├── create.ts
│   │   │   └── list.ts
│   │   └── prompts.ts
│   ├── config/
│   │   └── options.ts
│   ├── context/
│   │   ├── types.ts
│   │   ├── defaults.ts
│   │   └── normalize.ts
│   ├── validation/
│   │   ├── schema.ts
│   │   └── compatibility.ts
│   ├── resolver/
│   │   ├── template.ts
│   │   ├── dependency.ts
│   │   └── preset.ts
│   ├── generator/
│   │   ├── generator.ts
│   │   ├── files.ts
│   │   ├── package.ts
│   │   ├── readme.ts
│   │   ├── env.ts
│   │   ├── render.ts
│   │   └── language.ts
│   ├── merger/
│   │   ├── index.ts
│   │   ├── json.ts
│   │   ├── env.ts
│   │   ├── json-strategy.ts
│   │   └── env-strategy.ts
│   ├── runtime/
│   │   ├── installer.ts
│   │   ├── git.ts
│   │   └── package-manager.ts
│   ├── presets/
│   │   └── index.ts
│   └── utils/
│       ├── logger.ts
│       └── paths.ts
├── templates/               # 八类可组合模板
├── tests/                   # CLI 与核心模块测试
├── package.json
├── tsconfig.json
├── tsdown.config.ts
├── vitest.config.ts
├── eslint.config.ts
├── prettier.config.ts
├── .gitignore
└── README.md

这里最重要的模块关系是：

cli
 ↓
context
 ↓
validation
 ↓
resolver
 ↓
generator
 ↓
merger
 ↓
runtime

而：

templates
config
presets

属于数据/配置层。

二十三、核心架构关系

整个系统最终可以理解成：

                         create-node-app
                                │
                ┌───────────────┴───────────────┐
                │                               │
          Interactive                     Non-Interactive
                │                               │
             Prompts                         CLI Args
                │                               │
                └───────────────┬───────────────┘
                                ↓
                           Normalize
                                ↓
                        ProjectContext
                                ↓
                        Schema Validation
                                ↓
                     Compatibility Rule Engine
                                ↓
                       Template Resolver
                                ↓
                     Dependency Resolver
                                ↓
                         File Generator
                                ↓
                         File Merge System
                                ↓
                     package.json Generator
                                ↓
                         README Generator
                                ↓
                       Dependency Installer
                                ↓
                           Git Init
                                ↓
                           Finished
二十四、技术栈

CLI 本身：

模块	技术	作用
Language	TypeScript	CLI 开发
Runtime	Node.js	CLI 运行
CLI	Commander	参数解析
Prompt	@inquirer/prompts	交互式命令
Color	picocolors	终端样式
File	fs-extra	文件操作
Process	execa	执行外部命令
Build	tsdown	CLI 构建
Test	Vitest	测试
Distribution	npm	发布

你原方案里使用 TypeScript + Commander + @inquirer/prompts + picocolors + fs-extra + execa + tsdown + Vitest 的组合，本身是合理的。

二十五、V1 开发阶段

不要一次支持全部组合。

Phase 1：CLI

完成：

npm create node-app@latest api

实现：

Commander
Prompts
Arguments
Logger
Phase 2：Context

完成：

ProjectContext
Normalize
Defaults
Schema Validation
Phase 3：Template Engine

先只支持：

TypeScript
Node.js
Elysia

实现：

Template Resolver
File Generator
package.json Generator

最终：

npm create node-app@latest api
cd api
npm run dev

真正运行起来。

Phase 4：Database

加入：

MySQL
PostgreSQL
MongoDB
Phase 5：ORM

加入：

Prisma
Drizzle

并完成：

Dependency Resolver
File Merge System
Phase 6：Redis

加入：

Redis

生成：

src/redis/client.ts
.env.example
Phase 7：Tooling

加入：

ESLint
Prettier
Docker
Git
Phase 8：Preset / Config

加入：

Preset
Config File

例如：

create-node-app api --preset api
Phase 9：Non-Interactive

完善：

--runtime
--framework
--database
--orm
--cache
--eslint
--prettier
--docker
--no-install
--no-git
--yes

最终支持：

create-node-app api \
  --runtime node \
  --language typescript \
  --framework elysia \
  --database mysql \
  --orm prisma \
  --cache redis \
  --eslint \
  --prettier
二十六、V1 最终目标

V1 不追求：

几十种 Framework
几十种 ORM
几百种模板

而追求：

生成的项目真的能够安装、启动和开发。

最终验证：

npm create node-app@latest blog-api

生成：

blog-api

然后：

cd blog-api
npm install
npm run dev

都能正常工作。
