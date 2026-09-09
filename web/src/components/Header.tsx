import logo from '../assets/logo.png'
import type { Content, Language, Theme } from '../types'
import { GithubIcon, MoonIcon, SunIcon } from './Icons'

interface HeaderProps {
  copy: Content
  language: Language
  theme: Theme
  onSwitchLanguage: () => void
  onSwitchTheme: () => void
}

export function Header({ copy, language, theme, onSwitchLanguage, onSwitchTheme }: HeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#" aria-label="node-web">
        <img src={logo} alt="" />
        <span>node-web</span>
      </a>

      <div className="actions">
        <button
          className="language-switch"
          type="button"
          role="switch"
          aria-checked={language === 'en'}
          aria-label={copy.nav.language}
          title={copy.nav.language}
          onClick={onSwitchLanguage}
        >
          <span>中文</span>
          <span>EN</span>
          <i aria-hidden="true"></i>
        </button>
        <button
          className="icon-button"
          type="button"
          onClick={onSwitchTheme}
          aria-label={copy.nav.theme}
          title={copy.nav.theme}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <a
          className="icon-button"
          href="https://github.com/yangxinpu/create-node-web"
          target="_blank"
          rel="noreferrer"
          aria-label={copy.nav.github}
          title={copy.nav.github}
        >
          <GithubIcon />
        </a>
      </div>
    </header>
  )
}
