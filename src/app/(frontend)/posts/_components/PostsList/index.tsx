import { BasePayload, getPayload } from 'payload'

import { Post } from '@/payload-types'
import { PostsListClient } from './PostsList.client'
import { Suspense } from 'react'
import config from '@payload-config'
import { headers } from 'next/headers'

export type PostsListProps =
  | {
      listType: 'recent' | 'all'
    }
  | {
      listType: 'tag'
      tag: string
    }

async function getRecentPosts({ payload, locale }: { payload: BasePayload; locale: 'pl' | 'en' }) {
  return (
    (
      await payload.find({
        collection: 'posts',
        depth: 1,
        limit: 5,
        locale,
        sort: '-created_at',
        pagination: false,
      })
    )?.docs || []
  )
}

async function getPostsForTag({
  payload,
  locale,
  tag,
}: {
  payload: BasePayload
  locale: 'pl' | 'en'
  tag: string
}) {
  return (
    (
      await payload.find({
        collection: 'posts',
        depth: 1,
        limit: 10,
        locale,
        where: {
          'tags.tag': {
            equals: tag,
          },
        },
        sort: '-created_at',
      })
    )?.docs || []
  )
}

async function getPostsPage({ payload, locale }: { payload: BasePayload; locale: 'pl' | 'en' }) {
  return (
    (
      await payload.find({
        collection: 'posts',
        locale,
        depth: 2,
        limit: 10,
        sort: '-created_at',
      })
    )?.docs || []
  )
}

export const PostsList = async (props: PostsListProps) => {
  const payload = await getPayload({ config })

  const { listType } = props
  const headersData = await headers()
  const locale = (headersData.get('x-locale') || 'pl') as 'pl' | 'en'
  let posts: Post[] = []

  switch (listType) {
    case 'recent':
      posts = await getRecentPosts({ payload, locale })
      break

    case 'tag':
      posts = await getPostsForTag({ payload, locale, tag: props.tag })
      break

    case 'all':
      posts = await getPostsPage({ payload, locale })
      break
  }

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <PostsListClient posts={posts} />
    </Suspense>
  )
}
