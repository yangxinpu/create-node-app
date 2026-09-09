import type { Content } from '../types'

interface HomePageProps {
  copy: Content
  onCopyCommand: () => void
}

export function HomePage({ copy, onCopyCommand }: HomePageProps) {
  return (
    <>
      <HeroSection copy={copy} onCopyCommand={onCopyCommand} />
      <UsageSection copy={copy} />
      <HighlightsSection copy={copy} />
    </>
  )
}

function HeroSection({ copy, onCopyCommand }: HomePageProps) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">
          <span></span>
          {copy.home.eyebrow}
        </p>
        <h1>{copy.home.title}</h1>
        <p className="lead">{copy.home.intro}</p>
        <div className="hero-meta" aria-label={copy.home.stackTitle}>
          {copy.home.meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="command-line">
          <code>{copy.home.install}</code>
          <button type="button" onClick={onCopyCommand}>
            {copy.home.copy}
          </button>
        </div>
      </div>
      <aside className="runtime-card" aria-label={copy.home.stackTitle}>
        <div className="runtime-card-header">
          <span>{copy.home.stackTitle}</span>
          <code>node-web</code>
        </div>
        <p>{copy.home.stackText}</p>
        <div className="stack-grid">
          {copy.home.stackItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <pre>{`GET /api/greetings
GET /health
npm run dev`}</pre>
      </aside>
    </section>
  )
}

function UsageSection({ copy }: { copy: Content }) {
  return (
    <section id="usage" className="usage-section" aria-labelledby="usage-title">
      <div>
        <h2 id="usage-title">{copy.usage.title}</h2>
        <p>{copy.usage.intro}</p>
      </div>
      <div className="usage-list">
        {copy.usage.steps.map((step) => (
          <article key={step.id} className="doc-section">
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            {step.code ? <pre>{step.code}</pre> : null}
          </article>
        ))}
      </div>
    </section>
  )
}

function HighlightsSection({ copy }: { copy: Content }) {
  return (
    <section className="highlight-grid">
      {copy.home.highlights.map((item) => (
        <article key={item.title}>
          <h2>{item.title}</h2>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  )
}
