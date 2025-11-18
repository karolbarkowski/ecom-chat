/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export default async function ProductsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'products',
    limit: 20,
  })
  const products = result.docs

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex flex-col gap-6">
        {products.map((product) => (
          <a key={product.id} href={`product/${product.slug}`} className="flex flex-row gap-2">
            <img src={product.mediaImages?.[0].url} width={40} />
            {product.title}
          </a>
        ))}
      </div>
    </main>
  )
}
