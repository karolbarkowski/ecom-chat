import { Suspense } from 'react'
import { ProductReviewsClient } from './ProductReviews.client'
import { ProductsService } from '@/payload/collections/Products/ProductsService'

interface ProductReviewsProps {
  productId: string
}

export async function ProductReviews({ productId }: ProductReviewsProps) {
  const reviews = await ProductsService.queryProductReviews({ productId, locale: 'en' })

  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        <ProductReviewsClient reviews={reviews} />
      </Suspense>
    </>
  )
}
