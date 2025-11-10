import { describe, it, expect } from 'vitest'
import { Product } from '@/payload-types'
import { textToEmbedding } from './embedding'
import { cosineSimilarity } from './vector-operations'
import { productToEmbeddingAsync } from '@/workflows/product-to-embedding'

describe('Embedding Service', () => {
  describe('generateEmbedding', () => {
    it('should generate a 384-dimensional embedding for simple text', async () => {
      const text = 'blue Nike running shoes'
      const embedding = await textToEmbedding(text)

      expect(embedding).toHaveLength(384)
      expect(embedding.every((val) => typeof val === 'number')).toBe(true)
    })

    it('should throw error for empty text', async () => {
      await expect(textToEmbedding('')).rejects.toThrow('Text cannot be empty')
    })

    it('should throw error for whitespace-only text', async () => {
      await expect(textToEmbedding('   ')).rejects.toThrow('Text cannot be empty')
    })

    it('should generate different embeddings for different texts', async () => {
      const embedding1 = await textToEmbedding('blue Nike running shoes')
      const embedding2 = await textToEmbedding('red Adidas dress shoes')

      expect(embedding1).not.toEqual(embedding2)
    })
  })

  describe('semantic similarity', () => {
    it('should show high similarity for semantically related queries', async () => {
      const product: Product = {
        title: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Max Air cushioning',
        category: 'sneakers',
        manufacturer: 'Nike',
        color: 'blue',
        id: 'test-product-1',
        price: 150,
        pricePrevious: 180,
        updatedAt: '',
        createdAt: '',
      }

      const productEmbedding = await productToEmbeddingAsync(product)

      // Very similar query
      const similarQuery = 'blue Nike athletic shoes'
      const similarEmbed = await textToEmbedding(similarQuery)
      const similarityHigh = cosineSimilarity(productEmbedding, similarEmbed)

      // Dissimilar query
      const dissimilarQuery = 'red Adidas dress shoes'
      const dissimilarEmbed = await textToEmbedding(dissimilarQuery)
      const similarityLow = cosineSimilarity(productEmbedding, dissimilarEmbed)

      expect(similarityHigh).toBeGreaterThan(0.5)
      expect(similarityHigh).toBeGreaterThan(similarityLow)
    })

    it('should rank products by relevance to query', async () => {
      const products: Product[] = [
        {
          title: 'Nike Air Max 270',
          description: 'Running shoes with air cushioning',
          category: 'sneakers',
          manufacturer: 'Nike',
          color: 'blue',
          id: 'test-product-1',
          price: 150,
          pricePrevious: 180,
          updatedAt: '',
          createdAt: '',
        },
        {
          title: 'Adidas Ultraboost',
          description: 'Premium running sneakers',
          category: 'sneakers',
          manufacturer: 'Adidas',
          color: 'blue',
          id: 'test-product-2',
          price: 250,
          pricePrevious: 280,
          updatedAt: '',
          createdAt: '',
        },
        {
          title: 'Evening Dress',
          description: 'Elegant formal dress for special occasions',
          category: 'dresses',
          manufacturer: 'Zara',
          color: 'red',
          id: 'test-product-3',
          price: 200,
          pricePrevious: 200,
          updatedAt: '',
          createdAt: '',
        },
      ]

      const userQuery = 'Nike running shoes'
      const queryEmbed = await textToEmbedding(userQuery)

      const results = await Promise.all(
        products.map(async (product) => {
          const prodEmbed = await productToEmbeddingAsync(product)

          const score = cosineSimilarity(queryEmbed, prodEmbed)
          return { product, score }
        }),
      )

      results.sort((a, b) => b.score - a.score)

      // Nike shoes should rank highest
      expect(results[0].product.title).toBe('Nike Air Max 270')
      expect(results[0].score).toBeGreaterThan(results[1].score)

      // Dress should rank lowest
      expect(results[2].product.title).toBe('Evening Dress')
    })
  })
})
