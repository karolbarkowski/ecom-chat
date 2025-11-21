import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'
import type { Product, Review } from '@/payload-types'
import { numberToFormattedString } from '@/utilities/text-format'

export type ProductDTO = {
  id: string
  title: string
  url?: string | null
  color?: string | null
  price: number
  pricePrevious?: number | null
  description?: string | null
  mediaImages?: Product['mediaImages']
  category?: Product['category']
  manufacturer?: Product['manufacturer']
  savings: number
  savingsFormatted: string
  ratingAverage: number
  ratingsCount: number
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
      savings,
      savingsFormatted: numberToFormattedString(savings),
      ratingAverage: product['rating-average'] ? product['rating-average'] : 0,
      ratingsCount: product['rating-count'] || 0,
    }
  },
)

const queryProductReviews = cache(
  async ({
    productId,
    locale,
  }: {
    productId: string
    locale: 'pl' | 'en'
  }): Promise<ProductReviewDTO[]> => {
    const payload = await getPayload({ config: configPromise })

    const reviewsResult = await payload.find({
      collection: 'reviews',
      depth: 1,
      pagination: false,
      overrideAccess: true,
      locale,
      where: {
        product: {
          equals: productId,
        },
      },
    })

    return reviewsResult.docs
      ? reviewsResult.docs.map((r) => ({
          user: typeof r.user === 'object' ? r.user.email : r.user,
          content: r.content,
          createdAt: r.createdAt,
          rating: r.rating,
        }))
      : []
  },
)

export const ProductsService = {
  queryBySlug,
  queryProductReviews,
}
