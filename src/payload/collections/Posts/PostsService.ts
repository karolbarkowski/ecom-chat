import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'

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
      slug: true,
      comments: true,
      title: true,
      heroImage: true,
      content: true,
      publishedAt: true,
      populatedAuthors: true,
    },
  })

  return result.docs?.[0] || null
})

export const PostsService = {
  queryPostBySlug,
}
