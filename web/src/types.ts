export type Language = 'zh' | 'en'
export type Theme = 'light' | 'dark'

export interface Section {
  id: string
  title: string
  body: string
  code?: string
}

export interface Content {
  nav: {
    language: string
    theme: string
    github: string
  }
  home: {
    eyebrow: string
    title: string
    intro: string
    install: string
    copy: string
    meta: string[]
    highlights: Array<{ title: string; text: string }>
    stackTitle: string
    stackText: string
    stackItems: string[]
  }
  usage: {
    title: string
    intro: string
    steps: Section[]
  }
}
