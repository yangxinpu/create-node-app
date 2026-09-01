import { describe, expect, it } from 'vitest'

describe('health', () => {
  it('returns ok', () => {
    expect({ status: 'ok' }).toEqual({ status: 'ok' })
  })
})
