import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

function seoAssets(siteUrl: string): Plugin {
  let outDir = 'dist'

  return {
    name: 'seo-assets',
    configResolved(config) {
      outDir = config.build.outDir
    },
    transformIndexHtml(html) {
      const imageUrl = siteUrl ? `${siteUrl}/logo.png` : '/logo.png'
      const canonical = siteUrl ? `<link rel="canonical" href="${siteUrl}/" />` : ''

      return html
        .replace('<!-- seo:canonical -->', canonical)
        .replaceAll('__SITE_URL__', siteUrl)
        .replaceAll('__SEO_IMAGE__', imageUrl)
    },
    closeBundle() {
      if (!siteUrl) {
        return
      }

      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        `  <url><loc>${siteUrl}/</loc></url>`,
        '</urlset>',
        '',
      ].join('\n')

      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap)
      writeFileSync(
        resolve(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.SITE_URL?.replace(/\/+$/, '') ?? ''

  return {
    plugins: [react(), seoAssets(siteUrl)],
  }
})
