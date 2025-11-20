/* eslint-disable @next/next/no-img-element */
'use client'

import { LinkWithLocale } from '@/components/ui/LinkWithLocale'
import { Post } from '@/payload-types'

export type ProductListClientProps = {
  posts: Post[]
}

export const PostsListClient = (props: ProductListClientProps) => {
  const { posts } = props

  return (
    <div className="flex flex-col gap-16">
      {posts.map((p) => {
        const imgUrl = typeof p.heroImage === 'string' ? p.heroImage : p.heroImage?.url
        const author = typeof p.author === 'object' ? p.author.email : ''
        const publicationDate =
          typeof p.publishedAt === 'string'
            ? new Date(p.publishedAt).toLocaleDateString('en-GB').replace(/\//g, '.')
            : ''

        return (
          <div key={p.id} className="flex flex-col gap-4">
            <LinkWithLocale href={`posts/${p.slug}`} className="flex-col overflow-hiddenflex">
              <img
                src={
                  imgUrl ||
                  'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                }
                alt={p.title}
                className="mb-8 w-full h-48 rounded-2xl object-cover"
              />

              {/* Main content */}
              <h2 className="text-2xl uppercase tracking-wide mb-2">{p.title}</h2>

              {/* author and date */}
              <div className="text-xs uppercase tracking-[0.2em]">
                {author?.toString()} | {publicationDate}
              </div>
            </LinkWithLocale>

            {/* description */}
            {p.description && <span>{p.description}</span>}
          </div>
        )
      })}
    </div>
  )
}
