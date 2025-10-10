'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers'
import { Product } from '@/payload-types'

async function generateEmbedding(embedder: FeatureExtractionPipeline, text: string): Promise {
  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  })
  return Array.from(output.data)
}

function productToEmbeddingText(product: Product): string {
  const parts = [
    product.title,
    product.description,
    product.category,
    product.manufacturer,
    product.color,
  ].filter(Boolean) // Remove undefined values

  return parts.join(' ')
}

export async function submitData() {
  const payload = await getPayload({ config })
  const products = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1000,
  })

  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  console.log('Generating embeddings for products...')

  for (const product of products.docs) {
    const dataToEmbed = productToEmbeddingText(product)
    const embedding = await generateEmbedding(embedder, dataToEmbed)

    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        embedding: embedding,
      },
    })
  }
}
