import type { Content, Language } from './types'

export const content: Record<Language, Content> = {
  zh: {
    seo: {
      title: 'node-web：可组合的 Node.js / Bun 后端项目脚手架',
      description:
        'node-web 是可组合的 Node.js 与 Bun 后端项目脚手架，支持 Express、Elysia、Hono、Fastify、数据库、ORM、缓存、Docker 和多种工程化配置。',
      keywords:
        'node-web, Node.js 脚手架, Bun, TypeScript, Express, Elysia, Hono, Fastify, 后端项目生成器, create-node-web',
      imageAlt: 'node-web 项目标志',
    },
    nav: {
      language: '语言',
      theme: '切换主题',
      github: 'GitHub',
      skipToContent: '跳转到主要内容',
    },
    home: {
      eyebrow: 'Node.js 后端脚手架生成器',
      title: 'node-web',
      intro:
        '通过可组合模板快速生成 Node.js 后端项目。选择运行时、框架、数据库、ORM、缓存、工程化和目录结构，即可得到可以安装、启动和继续开发的项目。',
      install: 'npm create node-web@latest my-server',
      copy: '复制命令',
      copied: '已复制到剪贴板',
      meta: ['Node.js 24 / 22', 'Bun 1.4 / 1.3', 'RESTful API', 'Docker Ready'],
      highlights: [
        {
          title: '组合式模板',
          text: 'Base、Framework、Database、ORM、Cache、Tooling 和 Architecture 独立组合，避免预置模板爆炸。',
        },
        {
          title: '可运行输出',
          text: '生成项目包含欢迎页、RESTful 示例接口、请求日志、README、运行时版本约束和 Docker 入口。',
        },
        {
          title: '适合自动化',
          text: '支持交互式 TUI、全参数 CLI、Preset 和配置文件，可用于本地初始化与 CI/CD。',
        },
      ],
      stackTitle: '支持范围',
      stackText: '我们支持主流的 Node.js 与 Bun 运行时，以及各种流行框架与工具链：',
      stackItems: ['Node.js', 'Bun', 'TypeScript', 'Express', 'Elysia', 'Hono', 'Fastify', 'Docker'],
      highlightsTitle: '核心特性',
    },
    usage: {
      title: '使用方法',
      intro: '首页直接展示最常用的创建方式，复制后即可在终端运行。',
      packageManagerLabel: '选择包管理器',
      steps: [
        {
          id: 'interactive',
          title: '交互式创建',
          body: '不传完整参数时，CLI 会依次询问项目名、运行时、框架、数据库和工程化选项。',
          code: {
            npm: 'npm create node-web@latest',
            pnpm: 'pnpm create node-web@latest',
            yarn: 'yarn create node-web',
            bun: 'bun create node-web@latest'
          }
        },
        {
          id: 'quick-start',
          title: '创建并启动',
          body: '生成项目后进入目录，安装依赖并启动开发服务器。',
          code: {
            npm: 'npm create node-web@latest my-server\ncd my-server\nnpm install\nnpm run dev',
            pnpm: 'pnpm create node-web@latest my-server\ncd my-server\npnpm install\npnpm run dev',
            yarn: 'yarn create node-web my-server\ncd my-server\nyarn install\nyarn dev',
            bun: 'bun create node-web@latest my-server\ncd my-server\nbun install\nbun run dev'
          }
        },
        {
          id: 'non-interactive',
          title: '非交互式创建',
          body: '在脚本或 CI/CD 中通过 CLI 参数一次性指定技术栈。',
          code: {
            npm: 'npm create node-web@latest my-server -- \\\n  --runtime node \\\n  --runtime-version 24 \\\n  --language typescript \\\n  --framework express \\\n  --architecture api \\\n  --eslint \\\n  --prettier',
            pnpm: 'pnpm create node-web@latest my-server -- \\\n  --runtime node \\\n  --runtime-version 24 \\\n  --language typescript \\\n  --framework express \\\n  --architecture api \\\n  --eslint \\\n  --prettier',
            yarn: 'yarn create node-web my-server -- \\\n  --runtime node \\\n  --runtime-version 24 \\\n  --language typescript \\\n  --framework express \\\n  --architecture api \\\n  --eslint \\\n  --prettier',
            bun: 'bun create node-web@latest my-server -- \\\n  --runtime bun \\\n  --language typescript \\\n  --framework elysia \\\n  --architecture api \\\n  --eslint \\\n  --prettier'
          }
        },
      ],
    },
  },
  en: {
    seo: {
      title: 'node-web - Composable Node.js & Bun Backend Generator',
      description:
        'Generate ready-to-run Node.js and Bun backend projects with composable runtimes, frameworks, databases, ORMs, caches, Docker, and developer tooling.',
      keywords:
        'node-web, Node.js scaffolding, Bun, TypeScript, Express, Elysia, Hono, Fastify, backend generator, create-node-web',
      imageAlt: 'node-web project logo',
    },
    nav: {
      language: 'Language',
      theme: 'Toggle theme',
      github: 'GitHub',
      skipToContent: 'Skip to main content',
    },
    home: {
      eyebrow: 'Node.js backend project generator',
      title: 'node-web',
      intro:
        'Generate Node.js backend projects from composable templates. Choose runtime, framework, database, ORM, cache, tooling, and structure to get a project that can install, run, and grow.',
      install: 'npm create node-web@latest my-server',
      copy: 'Copy command',
      copied: 'Copied to clipboard',
      meta: ['Node.js 24 / 22', 'Bun 1.4 / 1.3', 'RESTful API', 'Docker Ready'],
      highlights: [
        {
          title: 'Composable templates',
          text: 'Base, Framework, Database, ORM, Cache, Tooling, and Architecture modules compose independently.',
        },
        {
          title: 'Runnable output',
          text: 'Generated projects include a welcome page, RESTful sample API, request logging, README, runtime constraints, and Docker entrypoints.',
        },
        {
          title: 'Automation ready',
          text: 'Use the interactive TUI, full CLI flags, presets, or config files for local setup and CI/CD.',
        },
      ],
      stackTitle: 'Supported stack',
      stackText: 'We support mainstream Node.js and Bun runtimes, as well as various popular frameworks and toolchains:',
      stackItems: ['Node.js', 'Bun', 'TypeScript', 'Express', 'Elysia', 'Hono', 'Fastify', 'Docker'],
      highlightsTitle: 'Key features',
    },
    usage: {
      title: 'Usage',
      intro: 'The most common commands are shown directly on the homepage.',
      packageManagerLabel: 'Select a package manager',
      steps: [
        {
          id: 'interactive',
          title: 'Interactive creation',
          body: 'Without full flags, the CLI prompts for project name, runtime, framework, database, and tooling.',
          code: {
            npm: 'npm create node-web@latest',
            pnpm: 'pnpm create node-web@latest',
            yarn: 'yarn create node-web',
            bun: 'bun create node-web@latest'
          }
        },
        {
          id: 'quick-start',
          title: 'Create and run',
          body: 'After generation, enter the project, install dependencies, and start the dev server.',
          code: {
            npm: 'npm create node-web@latest my-server\ncd my-server\nnpm install\nnpm run dev',
            pnpm: 'pnpm create node-web@latest my-server\ncd my-server\npnpm install\npnpm run dev',
            yarn: 'yarn create node-web my-server\ncd my-server\nyarn install\nyarn dev',
            bun: 'bun create node-web@latest my-server\ncd my-server\nbun install\nbun run dev'
          }
        },
        {
          id: 'non-interactive',
          title: 'Non-interactive creation',
          body: 'Use explicit flags in scripts or CI/CD workflows.',
          code: {
            npm: 'npm create node-web@latest my-server -- \\\n  --runtime node \\\n  --runtime-version 24 \\\n  --language typescript \\\n  --framework express \\\n  --architecture api \\\n  --eslint \\\n  --prettier',
            pnpm: 'pnpm create node-web@latest my-server -- \\\n  --runtime node \\\n  --runtime-version 24 \\\n  --language typescript \\\n  --framework express \\\n  --architecture api \\\n  --eslint \\\n  --prettier',
            yarn: 'yarn create node-web my-server -- \\\n  --runtime node \\\n  --runtime-version 24 \\\n  --language typescript \\\n  --framework express \\\n  --architecture api \\\n  --eslint \\\n  --prettier',
            bun: 'bun create node-web@latest my-server -- \\\n  --runtime bun \\\n  --language typescript \\\n  --framework elysia \\\n  --architecture api \\\n  --eslint \\\n  --prettier'
          }
        },
      ],
    },
  },
}
