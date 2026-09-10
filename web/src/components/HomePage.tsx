import { useState } from 'react'
import type { Content, PackageManager } from '../types'
import { NpmLogo, PnpmLogo, YarnLogo, BunLogo } from './Logos'

interface HomePageProps {
  copy: Content
  onCopyCommand: (text: string) => void
  copied?: boolean
}

const COMMANDS: Record<PackageManager, string> = {
  npm: 'npm create node-web@latest',
  pnpm: 'pnpm create node-web@latest',
  yarn: 'yarn create node-web',
  bun: 'bun create node-web@latest'
}

const PM_LOGOS: Record<PackageManager, React.ReactNode> = {
  npm: <NpmLogo />,
  pnpm: <PnpmLogo />,
  yarn: <YarnLogo />,
  bun: <BunLogo />
}

function PkgTabs({
  label,
  pkgManager,
  setPkgManager,
}: {
  label: string
  pkgManager: PackageManager
  setPkgManager: (pm: PackageManager) => void
}) {
  return (
    <div className="pkg-tabs" role="group" aria-label={label}>
      {(['npm', 'pnpm', 'yarn', 'bun'] as PackageManager[]).map((pm) => (
        <button
          key={pm}
          className={`pkg-tab ${pkgManager === pm ? 'active' : ''} ${pm}`}
          aria-pressed={pkgManager === pm}
          onClick={() => setPkgManager(pm)}
          type="button"
        >
          {PM_LOGOS[pm]}
          {pm}
        </button>
      ))}
    </div>
  )
}

export function HomePage({ copy, onCopyCommand, copied }: HomePageProps) {
  const [pkgManager, setPkgManager] = useState<PackageManager>('npm')

  return (
    <>
      <HeroSection copy={copy} onCopyCommand={onCopyCommand} copied={copied} pkgManager={pkgManager} setPkgManager={setPkgManager} />
      <UsageSection copy={copy} pkgManager={pkgManager} setPkgManager={setPkgManager} />
      <HighlightsSection copy={copy} />
    </>
  )
}

interface SectionProps extends HomePageProps {
  pkgManager: PackageManager
  setPkgManager: (pm: PackageManager) => void
}

function HeroSection({ copy, onCopyCommand, copied, pkgManager, setPkgManager }: SectionProps) {
  const command = COMMANDS[pkgManager]

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span></span>
          {copy.home.eyebrow}
        </p>
        <h1 id="hero-title">{copy.home.title}</h1>
        <p className="lead">{copy.home.intro}</p>
        <div className="hero-meta" aria-label={copy.home.stackTitle}>
          {copy.home.meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="terminal-block">
          <div className="terminal-header">
            <div className="mac-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <PkgTabs
              label={copy.usage.packageManagerLabel}
              pkgManager={pkgManager}
              setPkgManager={setPkgManager}
            />
          </div>
          <div className="command-line">
            <code>{command}</code>
            <button type="button" onClick={() => onCopyCommand(command)} className={copied ? 'copied' : ''}>
              {copy.home.copy}
            </button>
          </div>
        </div>
      </div>
      <aside className="runtime-card" aria-label={copy.home.stackTitle}>
        <div className="runtime-card-header">
          <h2>{copy.home.stackTitle}</h2>
        </div>
        <p>{copy.home.stackText}</p>
        <div className="stack-tags">
          {copy.home.stackItems.map((item) => (
            <span key={item} className="stack-tag">{item}</span>
          ))}
        </div>
      </aside>
    </section>
  )
}

function UsageSection({ copy, pkgManager, setPkgManager }: { copy: Content, pkgManager: PackageManager, setPkgManager: (pm: PackageManager) => void }) {
  return (
    <section id="usage" className="usage-section" aria-labelledby="usage-title">
      <div>
        <h2 id="usage-title">{copy.usage.title}</h2>
        <p>{copy.usage.intro}</p>
        <div className="usage-tabs-container">
          <PkgTabs
            label={copy.usage.packageManagerLabel}
            pkgManager={pkgManager}
            setPkgManager={setPkgManager}
          />
        </div>
      </div>
      <div className="usage-list">
        {copy.usage.steps.map((step) => (
          <article key={step.id} className="doc-section">
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            {step.code ? (
              <div className="terminal-block usage-terminal">
                <div className="terminal-header">
                  <div className="mac-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                </div>
                <pre><code>{step.code[pkgManager]}</code></pre>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

function HighlightsSection({ copy }: { copy: Content }) {
  return (
    <section className="highlight-grid" aria-labelledby="features-title">
      <h2 id="features-title" className="sr-only">{copy.home.highlightsTitle}</h2>
      {copy.home.highlights.map((item) => (
        <article key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  )
}
