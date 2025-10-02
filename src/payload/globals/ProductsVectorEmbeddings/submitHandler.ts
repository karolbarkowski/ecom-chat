'use server'

import { Embed } from '@/services/ai'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function submitData() {
  const payload = await getPayload({ config })
  const products = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1000,
  })

  for (const product of products.docs) {
    const text = `
      Nazwa: ${product.title},
      Opis: ${product.description},
      Kolor: ${product.color},
      Cena: ${product.price},
    `

    const embeddings = await Embed(text, 'search_document')
    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        embedding: embeddings,
      },
    })
  }
}
