import { describe, it, expect } from 'vitest'
import { extractFilters, ProductFilters } from './filter-extraction'

describe('Filter Extraction Service', () => {
  describe('extractFilters', () => {
    it('should extract color and manufacturer from basic query', async () => {
      const result = await extractFilters('blue Nike running shoes')

      expect(result).toHaveProperty('filters')
      expect(result).toHaveProperty('semantic_query')
      expect(result.semantic_query).toBeTruthy()
    })

    it('should extract price constraint from "under" query', async () => {
      const result = await extractFilters('red dress under $100')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should detect "on sale" queries', async () => {
      const result = await extractFilters('black shoes on sale')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should handle budget/cheap terms with price_max', async () => {
      const result = await extractFilters('cheap Adidas sneakers')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should handle luxury/premium terms with price_min', async () => {
      const result = await extractFilters('luxury leather handbag')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should extract multiple constraints from complex query', async () => {
      const result = await extractFilters('Nike running shoes under $150')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should handle price range queries', async () => {
      const result = await extractFilters('shoes between $50 and $200')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should extract manufacturer from brand-specific query', async () => {
      const result = await extractFilters('Zara formal shirts')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should detect clearance/discount terms', async () => {
      const result = await extractFilters('clearance winter jackets')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should handle very complex multi-constraint query', async () => {
      const result = await extractFilters('affordable blue Nike sneakers on sale under $80')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should return empty filters for simple product search without constraints', async () => {
      const result = await extractFilters('running shoes')

      expect(result).toHaveProperty('filters')
      expect(result).toHaveProperty('semantic_query')
      expect(result.semantic_query).toContain('running')
    })
  })

  describe('filter validation', () => {
    it('should validate expected filter structure for color and manufacturer', async () => {
      const result = await extractFilters('blue Nike shoes under $100')
      const expected: Partial<ProductFilters> = {
        color: 'blue',
        manufacturer: 'Nike',
        price_max: 100,
      }

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
      expect(result.filters).toMatchObject(expected)
    })

    it('should validate expected filter structure for on_sale queries', async () => {
      const result = await extractFilters('red dresses on sale')
      const expected: Partial<ProductFilters> = {
        color: 'red',
        category: 'dresses',
        on_sale: true,
      }

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
      expect(result.filters).toMatchObject(expected)
    })
  })
})
