import type { CollectionAfterChangeHook } from 'payload'
import { sentimentAnalysis } from '@/workflows/sentiment-analysis'
import type { Review } from '../../../../payload-types'
import { ProductsService } from '../ProductsService'

export const reviewAfterChange: CollectionAfterChangeHook<Review> = async ({ doc, req }) => {
  // Fire and forget - don't block the response
  if (doc.id && doc.content) {
    //update product rating based on updated review rating
    const productId = typeof doc.product == 'string' ? doc.product : doc.product.id
    const reviews = await ProductsService.queryProductReviews({ productId, locale: 'en' })
    const totalRating = reviews.reduce((sum, review) => sum + (parseInt(review.rating) || 0), 0)
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

    //perform sentiment analysis
    sentimentAnalysis(doc.id, doc.content)
      .then(async (sentiment) => {
        // Direct MongoDB update to bypass hooks and prevent infinite loop
        await req.payload.db.collections['reviews'].updateOne(
          { _id: doc.id },
          { $set: { sentiment: sentiment.toString() as '1' | '0' | '-1' } },
        )
      })
      .catch((err) => {
        console.error('Sentiment analysis failed for product review:', doc.id, err)
      })
  }

  return doc
}
