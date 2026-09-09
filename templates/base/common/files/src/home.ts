import { readFileSync } from 'node:fs'

/** HTML shown at the project root route. */
export const homePage = readFileSync(new URL('../web/index.html', import.meta.url), 'utf8')
