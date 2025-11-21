import type { CollectionAfterChangeHook } from 'payload'
import { sentimentAnalysis } from '@/workflows/sentiment-analysis'
import type { Review } from '../../../../payload-types'

export const reviewAfterChange: CollectionAfterChangeHook<Review> = async ({ doc, req, operation }) => {
  // Fire and forget - don't block the response
  if (doc.id && doc.content) {
    //update product rating based on updated review rating

    const productId = typeof doc.product == 'string' ? doc.product : doc.product.id

    // Fetch all reviews directly from database
    const reviewsResult = await req.payload.find({
      collection: 'reviews',
      pagination: false,
      where: {
        product: {
          equals: productId,
        },
      },
    })

    // For 'create' operations, the new review isn't in the DB yet, so we need to include it manually
    const allReviews = operation === 'create'
      ? [...reviewsResult.docs, doc]
      : reviewsResult.docs

    const totalRating = allReviews.reduce((sum, review) => sum + (parseInt(review.rating) || 0), 0)
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0

    //update rating statistics on product
    await req.payload.update({
      collection: 'products',
      id: productId,
      data: {
        'rating-average': averageRating,
        'rating-count': allReviews.length,
      },
    })

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
