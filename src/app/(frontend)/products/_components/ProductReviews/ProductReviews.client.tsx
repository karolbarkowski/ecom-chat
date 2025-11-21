'use client'

import { ProductReviewDTO } from '@/payload/collections/Products/ProductsService'
import { dateToFormattedString } from '@/utilities/text-format'
import { RatingStars } from '../RatingStars'

export type ProductListClientProps = {
  reviews: ProductReviewDTO[]
}

export const ProductReviewsClient = (props: ProductListClientProps) => {
  const { reviews } = props

  return (
    <div className="space-y-6 divide-y divide-savoy-border">
      {reviews.map((review, index) => {
        return (
          <div key={index} className="py-4">
            <RatingStars rating={review.rating} />
            <h3 className="text-md uppercase mt-1">{review.user}</h3>
            <p className="text-xs text-savoy-text-light">
              {dateToFormattedString(review.createdAt)}
            </p>
            <div className="text-xsmtext-savoy-text mt-2">{review.content}</div>
          </div>
        )
      })}
    </div>
  )
}
