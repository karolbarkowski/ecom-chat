/* eslint-disable @next/next/no-img-element */

import { draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import { LivePreviewListener } from '@/components/Payload/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import NotFound from '../../not-found'

import type { Metadata } from 'next'
import { RichText } from '@/components/RichText'
import { PostComment } from '@/payload-types'
import { PostsService } from '@/payload/collections/Posts/PostsService'

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
  const author =
    typeof post.populatedAuthors?.[0] === 'object' ? post.populatedAuthors?.[0].name : ''
  const publicationDate =
    typeof post.publishedAt === 'string'
      ? new Date(post.publishedAt).toLocaleDateString('en-GB').replace(/\//g, '.')
      : ''

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
            By {author?.toString()} on {publicationDate}
          </div>
        </div>

        <RichText data={post.content} enableGutter={false} enableProse={false} />

        {post.comments && post.comments.length > 0 && (
          <div className="mt-16">
            <h5 className="text-header5 mb-8">Comments</h5>
            <div className="space-y-6">
              {post.comments
                .filter((comment): comment is PostComment => typeof comment === 'object')
                .map((comment, index) => {
                  const userName =
                    typeof comment.user === 'object' ? comment.user.email : comment.user
                  return (
                    <div key={index} className="border border-savoy-border p-4 rounded-lg">
                      <p className="font-semibold">{userName} says:</p>
                      <p>{comment.content}</p>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await PostsService.queryPostBySlug({ slug, locale: 'en' })

  return generateMeta({ doc: post })
}
