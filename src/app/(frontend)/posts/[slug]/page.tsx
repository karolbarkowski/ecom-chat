/* eslint-disable @next/next/no-img-element */

import { draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'
import { LivePreviewListener } from '@/components/Payload/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import NotFound from '../../not-found'

import type { Metadata } from 'next'
import { RichText } from '@/components/RichText'
import { PostsService } from '@/payload/collections/Posts/PostsService'
import { PostComments } from '../_components/PostComments/PostComments'
import { dateToFormattedString } from '@/utilities/text-format'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const locales = ['pl', 'en']
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = locales.flatMap((locale) =>
    posts.docs.map(({ slug }) => ({
      slug,
      locale,
    })),
  )

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const headersData = await headers()
  // const locale = (headersData.get('x-locale') || 'pl') as 'pl' | 'en'
  const locale = 'en'
  const post = await PostsService.queryPostBySlug({ slug, locale })

  if (!post) {
    return <NotFound />
  }

  const imgUrl = typeof post.heroImage === 'string' ? post.heroImage : post.heroImage?.url
  const author = typeof post.author === 'object' ? post.author?.name : ''

  return (
    <article className="pb-16">
      {draft && <LivePreviewListener />}

      {imgUrl && (
        <img src={imgUrl} alt={post.title} className="mb-8 w-full object-cover rounded-2xl" />
      )}
      <div>
        <div className="text-center mb-16">
          <h1 className="text-3xl uppercase tracking-wider inline-block border-b-2 border-savoy-text pb-2 mb-3">
            {post.title}
          </h1>

          <div className="text-xs uppercase tracking-[0.2em]">
            By {author?.toString()} on {dateToFormattedString(post.publishedAt)}
          </div>
        </div>

        <RichText data={post.content} enableGutter={false} enableProse={false} />

        <PostComments comments={post.comments || []} postTitle={post.title} />
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await PostsService.queryPostBySlug({ slug, locale: 'en' })

  return generateMeta({ doc: post })
}
