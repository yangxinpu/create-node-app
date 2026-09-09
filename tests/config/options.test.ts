import { describe, expect, it } from 'vitest'

import {
  BUN_STABLE_VERSIONS,
  FRAMEWORKS,
  getDefaultRuntimeVersion,
  getRuntimeVersions,
  NODE_LTS_VERSIONS,
} from '../../src/config/options.js'

describe('runtime options', () => {
  it('lists Express as the first framework', () => {
    expect(FRAMEWORKS[0]).toBe('express')
  })

  it('returns supported versions for each runtime', () => {
    expect(getRuntimeVersions('node')).toBe(NODE_LTS_VERSIONS)
    expect(getRuntimeVersions('bun')).toBe(BUN_STABLE_VERSIONS)
    expect(getDefaultRuntimeVersion('node')).toBe('24')
    expect(getDefaultRuntimeVersion('bun')).toBe('1.4')
  })
})
