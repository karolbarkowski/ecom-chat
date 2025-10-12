import { Product } from '@/payload-types'
import { pipeline, env } from '@xenova/transformers'

// Configure transformers to use local cache
env.cacheDir = './.cache/transformers'

// Singleton pattern - only initialize once
let embeddingPipeline: any = null

/**
 * Initialize the embedding model
 * This happens once on first use and is reused for all subsequent calls
 */
async function getEmbeddingPipeline() {
  if (embeddingPipeline === null) {
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embeddingPipeline
}

/**
 * Generate a 384-dimensional embedding vector for the given text
 * @param text - Input text to embed
 * @returns Array of 384 numbers representing the embedding
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty')
  }

  const embedder = await getEmbeddingPipeline()

  // Generate embedding with mean pooling and normalization
  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  })

  return Array.from(output.data)
}

/**
 * Generate embeddings for multiple texts in batch
 * More efficient than calling generateEmbedding multiple times
 * @param texts - Array of texts to embed
 * @returns Array of embedding vectors
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  if (!texts || texts.length === 0) {
    throw new Error('Texts array cannot be empty')
  }

  const embedder = await getEmbeddingPipeline()
  const embeddings: number[][] = []

  // Process in batches to avoid memory issues
  const BATCH_SIZE = 32

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)

    for (const text of batch) {
      if (text && text.trim().length > 0) {
        const output = await embedder(text, {
          pooling: 'mean',
          normalize: true,
        })
        embeddings.push(Array.from(output.data))
      } else {
        // Handle empty strings
        embeddings.push(new Array(384).fill(0))
      }
    }
  }

  return embeddings
}

/**
 * Utility function to calculate cosine similarity between two embeddings
 * Useful for testing and debugging
 * @param vecA - First embedding vector
 * @param vecB - Second embedding vector
 * @returns Similarity score between -1 and 1 (higher = more similar)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    magnitudeA += vecA[i] * vecA[i]
    magnitudeB += vecB[i] * vecB[i]
  }

  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }

  return dotProduct / (magnitudeA * magnitudeB)
}

/**
 * Convert product object to searchable text for embedding
 * @param product - Product object from database
 * @returns Natural language text representation
 */
export function productToEmbeddingText(product: Product): string {
  const parts = [
    product.title,
    product.description,
    product.category,
    product.manufacturer,
    product.color,
  ]

  return parts.filter((part) => part !== undefined && part !== null && part !== '').join(' ')
}
