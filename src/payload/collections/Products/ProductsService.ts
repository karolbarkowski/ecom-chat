import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'
import type { Product, Review } from '@/payload-types'
import { numberToFormattedString } from '@/utilities/text-format'

export type ProductDTO = {
  title: string
  url?: string | null
  color?: string | null
  price: number
  pricePrevious?: number | null
  description?: string | null
  mediaImages?: Product['mediaImages']
  category?: Product['category']
  manufacturer?: Product['manufacturer']
  reviews: ProductReviewDTO[]
  savings: number
  savingsFormatted: string
}

export type ProductReviewDTO = {
  user: string
  content: string
  createdAt: string
  rating: Review['rating']
}

const queryBySlug = cache(
  async ({ slug, locale }: { slug: string; locale: 'pl' | 'en' }): Promise<ProductDTO | null> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'products',
      limit: 1,
      depth: 2,
      pagination: false,
      overrideAccess: true,
      locale,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    const product = result.docs?.[0]

    if (!product) {
      return null
    }

    const savings = product.pricePrevious
      ? Math.round((product.pricePrevious - product.price) * 100) / 100
      : 0

    return {
      ...product,
      reviews: (product.reviews as Review[])?.map((r) => {
        return {
          user: typeof r.user === 'object' ? r.user.email : r.user,
          content: r.content,
          createdAt: r.createdAt,
          rating: r.rating,
        }
      }),
      savings,
      savingsFormatted: numberToFormattedString(savings),
    }
  },
)

export const ProductsService = {
  queryBySlug,
}
