一、Template 总体结构
templates/
│
├── base/
│   ├── typescript/
│   └── javascript/
│
├── runtimes/
│   ├── node/
│   └── bun/
│
├── frameworks/
│   ├── express/
│   ├── elysia/
│   ├── hono/
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

当前不提供 `testing` 模板，生成项目不会附带测试框架或测试文件；数据库模板不包含 SQLite。

这里的核心关系是：

Base
  +
Runtime
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
  +
Architecture
        ↓
最终项目
二、Template 不应该只是目录

这是整个设计里比较重要的一点。

不要让：

templates/frameworks/elysia/

只是：

一些文件

而应该把每一个目录理解成：

一个 Template Module

它描述的是：

文件
依赖
脚本
环境变量
配置
生成逻辑
兼容性

例如：

templates/
└── frameworks/
    └── elysia/
        ├── template.json
        └── files/
            └── src/
                └── index.ts
三、推荐的标准 Template Module

每一个 Template Module 采用统一结构：

template-module/
│
├── template.json
├── files/
│
├── package.json
├── env.example
└── generator.ts

但是并不是每个模板都必须拥有所有文件。

因此更准确地说：

template-module/
├── template.json        # 模板元数据
├── files/               # 静态文件
├── package.json         # 依赖声明，可选
├── env.example          # 环境变量，可选
└── generator.ts         # 动态生成逻辑，可选

`files/` 内允许使用 `.template` 源文件后缀。复制时生成器会移除该后缀，例如
`eslint.config.js.template` 会生成 `eslint.config.js`。条件指令应写在注释中，以保证模板源文件仍可被 IDE 正常解析：

```javascript
// {{#if language=typescript}}
import tseslint from 'typescript-eslint'
// {{/if}}
```

特殊目标文件可以在源模板前加下划线，例如 `_Dockerfile.template` 最终生成
`Dockerfile`，避免 IDE 在模板渲染前按 Dockerfile 语法检查占位符。

四、template.json

这是每一个 Template Module 的核心描述文件。

例如：

templates/frameworks/elysia/template.json

内容可以设计成：

{
  "name": "elysia",
  "type": "framework",
  "version": "1.0.0",
  "description": "Elysia framework template",

  "dependencies": {
    "elysia": "^1.3.0"
  },

  "compatibility": {
    "runtime": [
      "node",
      "bun"
    ],
    "language": [
      "typescript",
      "javascript"
    ]
  }
}

它主要回答：

这个模板是什么？
属于什么类型？
需要什么依赖？
支持什么 Runtime？
支持什么 Language？
五、Base Template

Base 是所有项目的基础。

templates/base/
│
├── typescript/
│   ├── template.json
│   └── files/
│       ├── package.json
│       ├── tsconfig.json
│       ├── .gitignore
│       └── src/
│           └── index.ts
│
└── javascript/
    ├── template.json
    └── files/
        ├── package.json
        ├── .gitignore
        └── src/
            └── index.js

例如：

base/typescript

负责：

package.json
tsconfig.json
.gitignore
src/index.ts

它不应该负责：

Elysia
Prisma
Redis
MySQL

这些属于其他模块。

六、Runtime Template
templates/runtimes/
│
├── node/
│   ├── template.json
│   └── files/
│       └── .nvmrc
│
└── bun/
    ├── template.json
    └── files/
        └── .bun-version

Runtime 主要处理：

Node.js
Bun

例如 Node Template 可以定义：

{
  "name": "node",
  "type": "runtime"
}

它还可以负责：

runtime-specific config
runtime-specific script
runtime-specific package manager behavior
runtime version constraints
七、Framework Template
templates/frameworks/
│
├── express/
│   ├── template.json
│   ├── package.json
│   └── files/
│
├── elysia/
│   ├── template.json
│   ├── package.json
│   ├── files/
│   │   └── src/
│   │       ├── index.ts
│   │       └── routes/
│   │           └── health.ts
│   └── generator.ts
│
├── hono/
│   ├── template.json
│   ├── package.json
│   └── files/
│
└── fastify/
    ├── template.json
    ├── package.json
    └── files/

例如 Elysia：

frameworks/elysia/
│
├── template.json
├── package.json
├── files/
│   └── src/
│       ├── index.ts
│       └── routes/
│           └── health.ts
└── generator.ts

这里的 generator.ts 可以负责：

根据 TypeScript / JavaScript
生成不同入口文件

所以 Framework Template 不只是复制文件。

八、Database Template
templates/databases/
│
├── mysql/
│   ├── template.json
│   ├── package.json
│   ├── env.example
│   └── files/
│       └── src/
│           └── db/
│
├── postgresql/
│   ├── template.json
│   ├── package.json
│   ├── env.example
│   └── files/
│
└── mongodb/
    ├── template.json
    ├── package.json
    ├── env.example
    └── files/

例如 MySQL：

mysql/
├── template.json
├── package.json
├── env.example
└── files/
    └── src/
        └── db/
            └── client.ts

对应：

DATABASE_URL=mysql://user:password@localhost:3306/app
九、ORM Template
templates/orm/
│
├── prisma/
│   ├── template.json
│   ├── package.json
│   ├── env.example
│   ├── files/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       └── db/
│   │           └── prisma.ts
│   └── generator.ts
│
└── drizzle/
    ├── template.json
    ├── package.json
    ├── files/
    │   ├── drizzle.config.ts
    │   └── src/
    │       └── db/
    └── generator.ts

Prisma 负责：

Prisma Client
Prisma Schema
Prisma Config
数据库相关脚本

而不是负责：

MySQL 本身

这样：

MySQL + Prisma
PostgreSQL + Prisma

都能够组合。

十、Cache Template
templates/cache/
│
└── redis/
    ├── template.json
    ├── package.json
    ├── env.example
    ├── files/
    │   └── src/
    │       └── redis/
    │           ├── client.ts
    │           └── index.ts
    └── generator.ts

例如：

REDIS_URL=redis://localhost:6379

生成：

src/
└── redis/
    ├── client.ts
    └── index.ts
十一、Tooling Template
templates/tooling/
│
├── eslint/
│   ├── template.json
│   ├── package.json
│   └── files/
│       └── eslint.config.js.template
│
├── prettier/
│   ├── template.json
│   ├── package.json
│   └── files/
│       └── prettier.config.js
│
└── docker/
    ├── template.json
    └── files/
        ├── _Dockerfile.template
        └── .dockerignore

它们的特点是：

独立
可组合
无业务逻辑

例如：

Elysia
+
ESLint
+
Prettier
+
Docker

可以任意组合。

Runtime 模板还会生成版本约束文件：

```text
runtimes/node/files/.nvmrc          # Node.js 24 或 22 LTS
runtimes/bun/files/.bun-version     # Bun 1.4 或 1.3 稳定版本线
```

同一版本会用于 `package.json#engines`、TypeScript 运行时类型和 Docker 镜像。
Bun 当前没有正式 LTS 通道，不应在模板或文档中标记为 LTS。

十二、Architecture Template

这是我建议你增加的一层。

templates/architecture/
│
├── minimal/
│   ├── template.json
│   └── files/
│       └── src/
│           └── health.ts
│
├── api/
│   ├── template.json
│   └── files/
│       └── src/
│           ├── health.ts
│           ├── services/
│           │   └── health.ts
│           └── schemas/
│               └── health.ts
│
└── layered/
    ├── template.json
    └── files/
        └── src/
            ├── health.ts
            ├── controllers/
            │   └── health.controller.ts
            ├── services/
            │   └── health.service.ts
            ├── repositories/
            │   └── health.repository.ts
            └── schemas/
                └── health.ts

这样可以区分：

技术栈

和：

项目架构

例如：

Elysia + MySQL + Prisma

是技术栈。

而：

API

是项目组织方式。

这是两个不同维度。

十三、最终完整 Template 目录

所以最终我推荐：

templates/
│
├── base/
│   ├── typescript/
│   │   ├── template.json
│   │   └── files/
│   │       ├── package.json
│   │       ├── tsconfig.json
│   │       ├── .gitignore
│   │       └── src/
│   │
│   └── javascript/
│       ├── template.json
│       └── files/
│
├── runtimes/
│   ├── node/
│   │   ├── template.json
│   │   └── files/
│   │
│   └── bun/
│       ├── template.json
│       └── files/
│
├── frameworks/
│   ├── express/
│   │   ├── template.json
│   │   ├── package.json
│   │   └── files/
│   │
│   ├── elysia/
│   │   ├── template.json
│   │   ├── package.json
│   │   ├── files/
│   │   └── generator.ts
│   │
│   ├── hono/
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
十四、一个完整 Template 的内部结构

例如：

templates/orm/prisma/

最终可以是：

prisma/
│
├── template.json
│
├── package.json
│
├── env.example
│
├── files/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── src/
│       └── db/
│           └── prisma.ts
│
└── generator.ts

其中：

template.json

负责描述模板：

名称
类型
兼容性
依赖
package.json

只描述这个模块需要增加的依赖。

files/

存放静态模板文件。

env.example

存放环境变量。

generator.ts

负责无法通过静态文件完成的动态生成。

十五、Template 的核心数据模型

对应你前面的 Generator 架构，我建议定义：

export interface TemplateModule {
  name: string

  type:
    | 'base'
    | 'runtime'
    | 'framework'
    | 'database'
    | 'orm'
    | 'cache'
    | 'tooling'
    | 'architecture'

  files?: TemplateFile[]

  dependencies?: {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }

  scripts?: Record<string, string>

  env?: Record<string, string>

  compatibility?: {
    runtime?: string[]
    language?: string[]
    framework?: string[]
    database?: string[]
    orm?: string[]
  }

  validate?:
    (context: ProjectContext) => void

  generate?:
    (context: ProjectContext) => Promise<void>
}

这就把一个 Template 从：

目录

升级成：

可执行的模块
十六、Resolver 最终如何工作

假设用户选择：

Node
TypeScript
Elysia
MySQL
Prisma
Redis
ESLint
Prettier
API

Resolver 得到：

templates/base/typescript
templates/runtimes/node
templates/frameworks/elysia
templates/databases/mysql
templates/orm/prisma
templates/cache/redis
templates/tooling/eslint
templates/tooling/prettier
templates/architecture/api

然后：

                 ProjectContext
                       ↓
                Template Resolver
                       ↓
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
     Base          Framework        Database
       ↓               ↓               ↓
     Runtime          ORM             Cache
       ↓               ↓               ↓
                    Tooling       Architecture
                       └───────────────┘
                               ↓
                Template Modules
                       ↓
                 File Generator
                       ↓
                  File Merger
                       ↓
                 Final Project
十七、我建议特别注意一个原则

Template 不应该互相依赖。

例如：

Prisma

不要写：

Prisma → MySQL

而应该：

Prisma
MySQL

分别独立。

由：

Compatibility Engine

判断：

Prisma + MySQL
Prisma + PostgreSQL

是否能够组合。

最终：

Template Module
      ↓
独立
      ↓
Resolver
      ↓
组合

这样整个 Template 系统才能真正做到可组合。

十八、最终你这个项目的 Template Engine

最终可以形成这样的架构：

                       ProjectContext
                              │
                              ↓
                      Compatibility
                              │
                              ↓
                       Template Resolver
                              │
            ┌─────────────────┼─────────────────┐
            ↓                 ↓                 ↓
          Base           Framework          Database
            ↓                 ↓                 ↓
         Runtime             ORM              Cache
            ↓                 ↓                 ↓
                             Tooling        Architecture
                                └─────────────────┘
                                          ↓
                     Template Module[]
                              ↓
                     Dependency Resolver
                              ↓
                       File Generator
                              ↓
                        File Merger
                              ↓
                        package.json
                              ↓
                         README.md
                              ↓
                      Generated Project
