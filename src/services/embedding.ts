import { pipeline, env } from '@xenova/transformers'

// Configure transformers to use local cache
env.cacheDir = './.cache/transformers'

// Singleton
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
export async function textToEmbedding(text: string): Promise<number[]> {
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
