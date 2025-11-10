import { describe, it, expect } from 'vitest'
import { performHybridSearch } from './hybrid-search'

describe('Hybrid Search Workflow', () => {
  describe('hybridSearch', () => {
    it('should perform basic search with semantic query only', async () => {
      const results = await performHybridSearch(
        'I need a nice home decor under 20$, prefferably in blue color',
        { limit: 3 },
      )

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
})
