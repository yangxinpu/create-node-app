import { useEffect, useState } from 'react'
import './App.css'
import { Header } from './components/Header'
import { HomePage } from './components/HomePage'
import { content } from './content'
import { updateSeo } from './seo'
import type { Language, Theme } from './types'

function App() {
  const [language, setLanguage] = useState<Language>('zh')
  const [theme, setTheme] = useState<Theme>('dark')
  const [copied, setCopied] = useState(false)
  const copy = content[language]

  useEffect(() => {
    updateSeo(copy, language, theme)
  }, [copy, language, theme])

  function switchLanguage() {
    setLanguage((current) => (current === 'zh' ? 'en' : 'zh'))
  }

  function switchTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  async function copyCommand(text: string) {
    await navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="site" data-theme={theme}>
      <Header
        copy={copy}
        language={language}
        theme={theme}
        onSwitchLanguage={switchLanguage}
        onSwitchTheme={switchTheme}
      />
      <main id="main-content">
        <HomePage copy={copy} onCopyCommand={copyCommand} copied={copied} />
      </main>
      <div
        className={`toast-notification ${copied ? 'show' : ''}`}
        role="status"
        aria-live="polite"
      >
        {copy.home.copied}
      </div>
    </div>
  )
}

export default App
