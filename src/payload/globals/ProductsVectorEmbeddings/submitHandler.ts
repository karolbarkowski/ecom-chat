'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { productToEmbeddingAsync } from '@/workflows/product-to-embedding'

export async function submitData() {
  const payload = await getPayload({ config })
  const products = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1000,
  })

  for (const product of products.docs) {
    const embedding = await productToEmbeddingAsync(product)

    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        embedding: embedding,
      },
    })
  }
}
