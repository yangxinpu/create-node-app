import { useState } from 'react'
import './App.css'
import { Header } from './components/Header'
import { HomePage } from './components/HomePage'
import { content } from './content'
import type { Language, Theme } from './types'

function App() {
  const [language, setLanguage] = useState<Language>('zh')
  const [theme, setTheme] = useState<Theme>('dark')
  const copy = content[language]

  function switchLanguage() {
    setLanguage((current) => (current === 'zh' ? 'en' : 'zh'))
  }

  function switchTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  async function copyCommand() {
    await navigator.clipboard?.writeText(copy.home.install)
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
      <main>
        <HomePage copy={copy} onCopyCommand={copyCommand} />
      </main>
    </div>
  )
}

export default App
