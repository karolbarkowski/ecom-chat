import { describe, it, expect } from 'vitest'
import { cosineSimilarity } from './vector-operations'

describe('Vector Operations Service', () => {
  describe('cosineSimilarity', () => {
    it('should return 1 for identical vectors', () => {
      const vec = [1, 2, 3, 4, 5]
      const similarity = cosineSimilarity(vec, vec)

      expect(similarity).toBeCloseTo(1, 5)
    })

    it('should return 0 for orthogonal vectors', () => {
      const vecA = [1, 0, 0, 0]
      const vecB = [0, 1, 0, 0]
      const similarity = cosineSimilarity(vecA, vecB)

      expect(similarity).toBeCloseTo(0, 5)
    })

    it('should return -1 for opposite vectors', () => {
      const vecA = [1, 2, 3]
      const vecB = [-1, -2, -3]
      const similarity = cosineSimilarity(vecA, vecB)

      expect(similarity).toBeCloseTo(-1, 5)
    })

    it('should throw error for vectors of different lengths', () => {
      const vecA = [1, 2, 3]
      const vecB = [1, 2]

      expect(() => cosineSimilarity(vecA, vecB)).toThrow('Vectors must have the same length')
    })

    it('should return 0 for zero vectors', () => {
      const vecA = [0, 0, 0]
      const vecB = [1, 2, 3]
      const similarity = cosineSimilarity(vecA, vecB)

      expect(similarity).toBe(0)
    })
  })
})
