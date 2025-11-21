import type { CollectionBeforeChangeHook } from 'payload'
import { sentimentAnalysis } from '@/workflows/sentiment-analysis'
import type { PostComment } from '../../../../payload-types'

export const analyzeSentiment: CollectionBeforeChangeHook<PostComment> = async ({ data }) => {
  if (data.content) {
    const sentiment = await sentimentAnalysis(data.content)
    data.sentiment = sentiment.toString() as '1' | '0' | '-1'
  }

  return data
}
