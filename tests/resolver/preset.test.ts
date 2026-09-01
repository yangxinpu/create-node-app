import { describe, expect, it } from 'vitest'

import { getPreset, PRESETS } from '../../src/presets/index.js'

describe('presets', () => {
  it('returns config for known preset', () => {
    const preset = getPreset('api')
    expect(preset).not.toBeNull()
    expect(preset!.framework).toBe('elysia')
    expect(preset!.database).toBe('mysql')
    expect(preset!.orm).toBe('prisma')
    expect(preset!.cache).toBe('redis')
    expect(preset!.architecture).toBe('api')
  })

  it('returns null for unknown preset', () => {
    expect(getPreset('nonexistent')).toBeNull()
  })

  it('all presets have required fields', () => {
    for (const [name, preset] of Object.entries(PRESETS)) {
      expect(preset.runtime, `${name} missing runtime`).toBeDefined()
      expect(preset.language, `${name} missing language`).toBeDefined()
      expect(preset.framework, `${name} missing framework`).toBeDefined()
      expect(preset.database, `${name} missing database`).toBeDefined()
      expect(preset.orm, `${name} missing orm`).toBeDefined()
      expect(preset.cache, `${name} missing cache`).toBeDefined()
      expect(preset.test, `${name} missing test`).toBeDefined()
      expect(preset.architecture, `${name} missing architecture`).toBeDefined()
    }
  })

  it('minimal preset has no database/orm/cache', () => {
    const preset = getPreset('minimal')!
    expect(preset.database).toBe('none')
    expect(preset.orm).toBe('none')
    expect(preset.cache).toBe('none')
  })
})
