import { execa } from 'execa'

import type { PackageManagerName } from '../config/options.js'

export interface PackageManagerInfo {
  name: PackageManagerName
  installCommand: string[]
  runCommand: (script: string) => string[]
}

const MANAGERS: Record<PackageManagerName, PackageManagerInfo> = {
  npm: {
    name: 'npm',
    installCommand: ['install'],
    runCommand: (script) => ['run', script],
  },
  pnpm: {
    name: 'pnpm',
    installCommand: ['install'],
    runCommand: (script) => ['run', script],
  },
  yarn: {
    name: 'yarn',
    installCommand: ['install'],
    runCommand: (script) => ['run', script],
  },
  bun: {
    name: 'bun',
    installCommand: ['install'],
    runCommand: (script) => ['run', script],
  },
}

export function getPackageManager(name: PackageManagerName): PackageManagerInfo {
  return MANAGERS[name]
}

/**
 * 检测环境中可用的包管理器，找不到时回退到 npm。
 */
export async function detectPackageManager(): Promise<PackageManagerName> {
  const candidates: PackageManagerName[] = ['pnpm', 'yarn', 'bun', 'npm']
  for (const candidate of candidates) {
    try {
      await execa(candidate, ['--version'])
      return candidate
    } catch {
      // 继续尝试下一个
    }
  }
  return 'npm'
}
