import type { Content, Language, Theme } from './types'

const REPOSITORY_URL = 'https://github.com/yangxinpu/create-node-web'

function updateMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

export function updateSeo(copy: Content, language: Language, theme: Theme) {
  const pageUrl = `${window.location.origin}${window.location.pathname}`
  const imageUrl = new URL('logo.png', document.baseURI).href
  const locale = language === 'zh' ? 'zh_CN' : 'en_US'
  const htmlLanguage = language === 'zh' ? 'zh-CN' : 'en'

  document.title = copy.seo.title
  document.documentElement.lang = htmlLanguage

  updateMeta('meta[name="description"]', copy.seo.description)
  updateMeta('meta[name="keywords"]', copy.seo.keywords)
  updateMeta('meta[name="theme-color"]', theme === 'dark' ? '#050607' : '#f3fbfa')
  updateMeta('meta[property="og:title"]', copy.seo.title)
  updateMeta('meta[property="og:description"]', copy.seo.description)
  updateMeta('meta[property="og:locale"]', locale)
  updateMeta('meta[property="og:url"]', pageUrl)
  updateMeta('meta[property="og:image"]', imageUrl)
  updateMeta('meta[property="og:image:alt"]', copy.seo.imageAlt)
  updateMeta('meta[name="twitter:title"]', copy.seo.title)
  updateMeta('meta[name="twitter:description"]', copy.seo.description)
  updateMeta('meta[name="twitter:image"]', imageUrl)
  updateMeta('meta[name="twitter:image:alt"]', copy.seo.imageAlt)

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }
  canonical.href = pageUrl

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'node-web',
        url: pageUrl,
        description: copy.seo.description,
        inLanguage: htmlLanguage,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'node-web',
        url: pageUrl,
        image: imageUrl,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows, macOS, Linux',
        description: copy.seo.description,
        softwareRequirements: 'Node.js 18 or later',
        isAccessibleForFree: true,
        license: 'https://opensource.org/licenses/MIT',
        codeRepository: REPOSITORY_URL,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  }

  const script = document.querySelector<HTMLScriptElement>('#structured-data')
  if (script) {
    script.textContent = JSON.stringify(structuredData)
  }
}
