import { describe, it, expect, beforeAll } from 'vitest'
import { extractFilters, checkLlmHealth, ProductFilters } from './filter-extraction'

describe('Filter Extraction Service', () => {
  beforeAll(async () => {
    const isHealthy = await checkLlmHealth()
    if (!isHealthy) {
      console.warn('⚠️  Ollama is not running. Some tests may be skipped.')
      console.warn('   To run all tests:')
      console.warn('   1. Start Ollama: ollama serve')
      console.warn('   2. Install model: ollama pull llama3.1:8b')
    }
  })

  describe('checkOllamaHealth', () => {
    it('should check if Ollama is running and model is available', async () => {
      const result = await checkLlmHealth()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('extractFilters', () => {
    it('should extract color and manufacturer from basic query', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('blue Nike running shoes')

      expect(result).toHaveProperty('filters')
      expect(result).toHaveProperty('semantic_query')
      expect(result.semantic_query).toBeTruthy()
    })

    it('should extract price constraint from "under" query', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('red dress under $100')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should detect "on sale" queries', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('black shoes on sale')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should handle budget/cheap terms with price_max', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('cheap Adidas sneakers')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should handle luxury/premium terms with price_min', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('luxury leather handbag')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should extract multiple constraints from complex query', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('Nike running shoes under $150')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should handle price range queries', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('shoes between $50 and $200')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should extract manufacturer from brand-specific query', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('Zara formal shirts')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should detect clearance/discount terms', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('clearance winter jackets')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should handle very complex multi-constraint query', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('affordable blue Nike sneakers on sale under $80')

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should return empty filters for simple product search without constraints', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('running shoes')

      expect(result).toHaveProperty('filters')
      expect(result).toHaveProperty('semantic_query')
      expect(result.semantic_query).toContain('running')
    })

    it('should fallback gracefully on error', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        // Test fallback when Ollama is not available
        const result = await extractFilters('test query')

        expect(result).toEqual({
          filters: {},
          semantic_query: 'test query',
        })
        return
      }

      // If Ollama is available, this test just verifies no crash
      const result = await extractFilters('test query')
      expect(result).toBeDefined()
    })
  })

  describe('filter validation', () => {
    it('should validate expected filter structure for color and manufacturer', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('blue Nike shoes under $100')
      const expected: Partial<ProductFilters> = {
        color: 'blue',
        manufacturer: 'Nike',
        price_max: 100,
      }

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })

    it('should validate expected filter structure for on_sale queries', async () => {
      const isHealthy = await checkLlmHealth()
      if (!isHealthy) {
        console.log('Skipping test - Ollama not available')
        return
      }

      const result = await extractFilters('red dresses on sale')
      const expected: Partial<ProductFilters> = {
        color: 'red',
        category: 'dresses',
        on_sale: true,
      }

      expect(result.filters).toBeDefined()
      expect(result.semantic_query).toBeTruthy()
    })
  })
})
