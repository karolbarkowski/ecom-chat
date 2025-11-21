import type { CollectionAfterChangeHook } from 'payload'
import { sentimentAnalysis } from '@/workflows/sentiment-analysis'
import type { PostComment } from '../../../../payload-types'

export const analyzeSentiment: CollectionAfterChangeHook<PostComment> = async ({ doc, req }) => {
  // Fire and forget - don't block the response
  if (doc.id && doc.content) {
    sentimentAnalysis(doc.id, doc.content)
      .then(async (sentiment) => {
        // Direct MongoDB update to bypass hooks and prevent infinite loop
        await req.payload.db.collections['post-comments'].updateOne(
          { _id: doc.id },
          { $set: { sentiment: sentiment.toString() as '1' | '0' | '-1' } },
        )
      })
      .catch((err) => {
        console.error('Sentiment analysis failed for comment:', doc.id, err)
      })
  }

  return doc
}
