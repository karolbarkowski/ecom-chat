/* eslint-disable @next/next/no-img-element */

import { draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import Section from '@/components/Containers/section'
import { RichText } from '@/components/features'
import { LivePreviewListener } from '@/components/Payload/LivePreviewListener'
import { RelatedPosts } from '@/components/Posts/RelatedPosts/Component'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import NotFound from '../../not-found'

import type { Metadata } from 'next'
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

  return (
    <article className="pb-16">
      {draft && <LivePreviewListener />}

      {imgUrl && <img src={imgUrl} alt={post.title} className="mb-8 w-full object-cover" />}
      <div>
        <h1 className="mb-8 text-header1">{post.title}</h1>
        <RichText
          className="mx-auto max-w-[48rem]"
          data={post.content}
          enableGutter={false}
          enableProse={false}
        />

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <Section className="mt-16">
            <Section.Header>
              <h5 className="text-header5">Related posts</h5>
            </Section.Header>
            <Section.Content>
              <RelatedPosts
                className="lg:grid lg:grid-cols-subgrid grid-rows-[2fr] col-span-3 col-start-1 mt-12"
                docs={post.relatedPosts.filter((post) => typeof post === 'object')}
              />
            </Section.Content>
          </Section>
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
