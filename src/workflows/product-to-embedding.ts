import { Product } from '@/payload-types'
import { textToEmbedding } from '@/services/embedding'

/**
 * Convert product object to its embedding representation
 * @param product - Product object from database
 * @returns Embedding representation
 */
export async function productToEmbeddingAsync(product: Product): Promise<number[]> {
  const productTextToEmbed = productToEmbeddingText(product)
  const embedding = await textToEmbedding(productTextToEmbed)

  return embedding
}

/**
 * Convert product object to searchable text for embedding
 * @param product - Product object from database
 * @returns Natural language text representation
 */
function productToEmbeddingText(product: Product): string {
  const parts = [
    product.title,
    product.description,
    product.category,
    product.manufacturer,
    product.color,
  ]

  return parts.filter((part) => part !== undefined && part !== null && part !== '').join(' ')
}
