'use client'

import { LinkWithLocale } from '@/components/ui/LinkWithLocale'
import { Post } from '@/payload-types'

export type ProductListClientProps = {
  posts: Post[]
}

export const PostsListClient = (props: ProductListClientProps) => {
  const { posts } = props

  return (
    <div className="flex flex-col gap-4">
      {posts.map((p) => {
        const author = typeof p.authors?.[0] === 'object' ? p.authors?.[0].email : ''

        return (
          <div key={p.id}>
            <LinkWithLocale
              href={`posts/${p.slug}`}
              className="flex-col max-w-sm overflow-hiddenflex "
            >
              <h2 className="uppercase tracking-[0.2em] transition hover:text-savoy-accent-orange">
                {p.title}
              </h2>
              <span>{author?.toString()}</span>
            </LinkWithLocale>
          </div>
        )
      })}
    </div>
  )
}
