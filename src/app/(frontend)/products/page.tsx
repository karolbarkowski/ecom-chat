/* eslint-disable @next/next/no-img-element */
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { RatingStars } from './_components/RatingStars'

export default async function ProductsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'products',
    limit: 12,
  })
  const products = result.docs

  return (
    <main className="bg-savoy-card py-16">
      <div className="flex gap-12 container mx-auto">
        {/* Left Sidebar - Filters */}
        <aside className="w-64 shrink-0">
          <div className="sticky top-8">
            <h2>Filters</h2>
            {/* Placeholder for future filters */}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-row gap-16 py-16 border-b border-savoy-border"
            >
              {/* Product Image */}
              <div>
                {product.mediaImages?.[0]?.url && (
                  <img
                    src={product.mediaImages[0].url}
                    alt={product.title}
                    className="max-w-[200px] h-full object-cover"
                  />
                )}
              </div>

              {/* Product Info */}
              <div className="text-left flex gap-4 flex-col">
                {/* Title */}
                <h1 className="text-3xl tracking-wide mb-3 line-clamp-1 max-w-[50ch]">
                  {product.title}
                </h1>

                {/* Rating */}
                <RatingStars rating={4} count={product.reviews?.totalDocs || 0} />

                {/* Price */}
                <div className="flex items-center  gap-2">
                  {product.pricePrevious && (
                    <span className="text-(--font-size-sm) line-through">
                      ${product.pricePrevious.toFixed(2)}
                    </span>
                  )}
                  <span className="text-(--font-size-lg) font-(--font-weight-normal)">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <p>{product.description}</p>

                {/* show more */}
                <a href={`/products/${product.slug}`}>Show More</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
