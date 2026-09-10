export type Language = 'zh' | 'en'
export type Theme = 'light' | 'dark'
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export interface Section {
  id: string
  title: string
  body: string
  code?: Record<PackageManager, string>
}

export interface Content {
  seo: {
    title: string
    description: string
    keywords: string
    imageAlt: string
  }
  nav: {
    language: string
    theme: string
    github: string
    skipToContent: string
  }
  home: {
    eyebrow: string
    title: string
    intro: string
    install: string
    copy: string
    copied: string
    meta: string[]
    highlights: Array<{ title: string; text: string }>
    stackTitle: string
    stackText: string
    stackItems: string[]
    highlightsTitle: string
  }
  usage: {
    title: string
    intro: string
    packageManagerLabel: string
    steps: Section[]
  }
}
