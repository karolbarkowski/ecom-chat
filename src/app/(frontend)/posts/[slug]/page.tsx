/* eslint-disable @next/next/no-img-element */

import { draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import { LivePreviewListener } from '@/components/Payload/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import NotFound from '../../not-found'

import type { Metadata } from 'next'
import { RelatedPosts } from '../_components/RelatedPosts/Component'
import { RichText } from '@/components/RichText'
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
  const locale = (headersData.get('x-locale') || 'pl') as 'pl' | 'en'
  const post = await queryPostBySlug({ slug, locale })

  if (!post) {
    return <NotFound />
  }

  const imgUrl = typeof post.heroImage === 'string' ? post.heroImage : post.heroImage?.url
  const author = typeof post.authors?.[0] === 'object' ? post.authors?.[0].email : ''
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

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="mt-16">
            <h5 className="text-header5">Related posts</h5>
            <RelatedPosts
              className="lg:grid lg:grid-cols-subgrid grid-rows-[2fr] col-span-3 col-start-1 mt-12"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug, locale: 'en' })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug, locale }: { slug: string; locale: 'pl' | 'en' }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
