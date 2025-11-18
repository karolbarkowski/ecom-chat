'use client'

import { LinkWithLocale } from '@/components/ui/LinkWithLocale'

export type TagsCloudProps = {
  tags: string[]
}

export const TagsCloudClient = (props: TagsCloudProps) => {
  const { tags } = props

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {tags.map((tag, i) => {
        return (
          <LinkWithLocale
            key={i}
            href={`/posts?tag=${tag}`}
            className="inline-block bg-savoy-text hover:bg-savoy-accent-orange  px-3 py-2 rounded-full font-mono  text-savoy-bg text-xs"
          >
            #{tag}
          </LinkWithLocale>
        )
      })}
    </div>
  )
}
