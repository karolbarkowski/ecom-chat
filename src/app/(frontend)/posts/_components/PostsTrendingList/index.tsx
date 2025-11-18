import { BasePayload, getPayload } from 'payload'

import { Post } from '@/payload-types'
import { PostsListClient } from './PostsList.client'
import { Suspense } from 'react'
import config from '@payload-config'
import { headers } from 'next/headers'

async function getTrendingPosts({
  payload,
  locale,
}: {
  payload: BasePayload
  locale: 'pl' | 'en'
}) {
  return (
    (
      await payload.find({
        collection: 'posts',
        depth: 1,
        limit: 5,
        locale,
        where: {
          isTrending: {
            equals: true,
          },
        },
        sort: '-created_at',
        pagination: false,
      })
    )?.docs || []
  )
}

export const PostsTrendingList = async () => {
  const payload = await getPayload({ config })
  const headersData = await headers()
  const locale = (headersData.get('x-locale') || 'pl') as 'pl' | 'en'
  const posts: Post[] = await getTrendingPosts({ payload, locale })

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <PostsListClient posts={posts} />
    </Suspense>
  )
}
