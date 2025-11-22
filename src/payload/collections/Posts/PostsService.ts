import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'
import { PostComment } from '@/payload-types'

const queryPostBySlug = cache(async ({ slug, locale }: { slug: string; locale: 'pl' | 'en' }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
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
    select: {
      comments: true,
      title: true,
      heroImage: true,
      content: true,
      publishedAt: true,
      author: true,
    },
  })

  return result.docs?.[0] || null
})

const queryPostComments = cache(
  async ({ postId, locale }: { postId: string | number | undefined; locale: 'pl' | 'en' }) => {
    if (!postId) {
      return new Array<PostComment>()
    }

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'post-comments',
      depth: 1,
      pagination: false,
      locale,
      where: {
        post: {
          equals: postId,
        },
      },
    })

    return result.docs || null
  },
)

export const PostsService = {
  queryPostBySlug,
  queryPostComments,
}
