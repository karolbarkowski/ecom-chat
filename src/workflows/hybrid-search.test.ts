import { describe, it, expect } from 'vitest'
import { performHybridSearch } from './hybrid-search'

describe('Hybrid Search Workflow', () => {
  describe('hybridSearch', () => {
    it('should perform basic search with semantic query only', async () => {
      const results = await performHybridSearch('running shoes', { limit: 3 })

      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBeLessThanOrEqual(3)

      if (results.length > 0) {
        const result = results[0]
        expect(result).toHaveProperty('_id')
        expect(result).toHaveProperty('title')
        expect(result).toHaveProperty('description')
        expect(result).toHaveProperty('price')
        expect(result).toHaveProperty('category')
        expect(result).toHaveProperty('color')
        expect(result).toHaveProperty('manufacturer')
        expect(result).toHaveProperty('url')
        expect(result).toHaveProperty('score')
        expect(typeof result.score).toBe('number')
      }
    })
  })

  it('should return results sorted by relevance score', async () => {
    const results = await performHybridSearch('blue Nike running shoes', { limit: 5 })

    expect(Array.isArray(results)).toBe(true)

    if (results.length > 1) {
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score)
      }
    }
  })

  it('should respect limit configuration', async () => {
    const limit = 3
    const results = await performHybridSearch('shoes', { limit })

    expect(results.length).toBeLessThanOrEqual(limit)
  })
})
